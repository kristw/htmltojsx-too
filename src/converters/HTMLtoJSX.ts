import {
  ATTRIBUTE_MAPPING,
  ELEMENT_ATTRIBUTE_MAPPING,
} from '../constants/mappings';
import { NodeType } from '../constants/NodeType';
import cleanHTML from '../utils/cleanHTML';
import createElement from '../utils/createElement';
import escapeSpecialChars from '../utils/escapeSpecialChars';
import isNumeric from '../utils/isNumeric';
import isSelfClosing from '../utils/isSelfClosing';
import jsxTagName from '../utils/jsxTagName';
import onlyOneTopLevel from '../utils/onlyOneTopLevel';
import repeatString from '../utils/repeatString';
import trimEnd from '../utils/trimEnd';
import StyleParser from './StyleParser';

export type ConfigType = {
  createClass: boolean;
  indent: string;
  outputClassName?: string;
};

/**
 * Gets a JSX formatted version of the specified element styles
 *
 * @param {string} styles
 * @return {string}
 */
export function _getStyleAttribute(styles: string) {
  const jsxStyles = new StyleParser(styles).toJSXString();
  return 'style={{' + jsxStyles + '}}';
}

/**
 * Removes class-level indention in the JSX output. To be used when the JSX
 * output is configured to not contain a class deifinition.
 *
 * @param {string} output JSX output with class-level indention
 * @param {string} indent Configured indention
 * @return {string} JSX output wihtout class-level indention
 */
export function removeJSXClassIndention(output: string, indent: string) {
  var classIndention = new RegExp('\\n' + indent + indent + indent, 'g');
  return output.replace(classIndention, '\n');
}

/**
 * Gets a JSX formatted version of the specified attribute from the node
 *
 * @param {DOMElement} node
 * @param {object}     attribute
 * @return {string}
 */
function _getElementAttribute(
  node: Element,
  attribute: { name: string; value: string }
) {
  switch (attribute.name) {
    case 'style':
      return _getStyleAttribute(attribute.value);
    default:
      var tagName = jsxTagName(node.tagName);
      var name =
        (ELEMENT_ATTRIBUTE_MAPPING[tagName as 'input'] &&
          ELEMENT_ATTRIBUTE_MAPPING[tagName as 'input'][
            attribute.name as keyof typeof ELEMENT_ATTRIBUTE_MAPPING.input
          ]) ||
        ATTRIBUTE_MAPPING[attribute.name as keyof typeof ATTRIBUTE_MAPPING] ||
        attribute.name;

      var result = name;
      // Numeric values should be output as {123} not "123"
      if (isNumeric(attribute.value)) {
        result += '={' + attribute.value + '}';
      } else if (attribute.value.length > 0) {
        result += '="' + attribute.value.replace(/"/gm, '&quot;') + '"';
      } else if (attribute.value.length === 0 && attribute.name === 'alt') {
        result += '=""';
      }
      return result;
  }
}

/**
 * This is a very simple HTML to JSX converter. It turns out that browsers
 * have good HTML parsers (who would have thought?) so we utilise this by
 * inserting the HTML into a temporary DOM node, and then do a breadth-first
 * traversal of the resulting DOM tree.
 */
export default class HTMLtoJSX {
  config: ConfigType;
  output: string;
  level: number;
  _inPreTag: boolean;

  constructor(config: ConfigType) {
    this.config = config || {};

    if (this.config.createClass === undefined) {
      this.config.createClass = true;
    }
    if (!this.config.indent) {
      this.config.indent = '  ';
    }

    this.output = '';
    this.level = 0;
    this._inPreTag = false;
  }

  /**
   * Reset the internal state of the converter
   */
  reset() {
    this.output = '';
    this.level = 0;
    this._inPreTag = false;
  }

  /**
   * Handles processing of the specified text node
   *
   * @param {Text} node
   */
  _visitComment(node: Comment) {
    this.output += '{/*' + node.textContent?.replace('*/', '* /') + '*/}';
  }

  /**
   * Gets a newline followed by the correct indentation for the current
   * nesting level
   *
   * @return {string}
   */
  _getIndentedNewline() {
    return '\n' + repeatString(this.config.indent, this.level + 2);
  }

  /**
   * Handles processing the specified node
   *
   * @param {Node} node
   */
  _visit(node: Node) {
    this._beginVisit(node);
    this._traverse(node);
    this._endVisit(node);
  }

  /**
   * Traverses all the children of the specified node
   *
   * @param {Node} node
   */
  _traverse(node: Node) {
    this.level++;
    for (var i = 0, count = node.childNodes.length; i < count; i++) {
      this._visit(node.childNodes[i]);
    }
    this.level--;
  }

  /**
   * Handle pre-visit behaviour for the specified node.
   *
   * @param {Node} node
   */
  _beginVisit(node: Node) {
    switch (node.nodeType) {
      case NodeType.ELEMENT:
        this._beginVisitElement(node as Element);
        break;

      case NodeType.TEXT:
        this._visitText(node as Text);
        break;

      case NodeType.COMMENT:
        this._visitComment(node as Comment);
        break;

      default:
        console.warn('Unrecognised node type: ' + node.nodeType);
    }
  }

  /**
   * Handles post-visit behaviour for the specified node.
   *
   * @param {Node} node
   */
  _endVisit(node: Node) {
    switch (node.nodeType) {
      case NodeType.ELEMENT:
        this._endVisitElement(node as Element);
        break;
      // No ending tags required for these types
      case NodeType.TEXT:
      case NodeType.COMMENT:
        break;
    }
  }

  /**
   * Handles pre-visit behaviour for the specified element node
   *
   * @param {DOMElement} node
   */
  _beginVisitElement(node: Element) {
    var tagName = jsxTagName(node.tagName);
    var attributes = [];
    for (var i = 0, count = node.attributes.length; i < count; i++) {
      attributes.push(_getElementAttribute(node, node.attributes[i]));
    }

    if (tagName === 'textarea') {
      // Hax: textareas need their inner text moved to a "defaultValue" attribute.
      attributes.push(
        'defaultValue={' +
          JSON.stringify((node as HTMLTextAreaElement).value) +
          '}'
      );
    }
    if (tagName === 'style') {
      // Hax: style tag contents need to be dangerously set due to liberal curly brace usage
      attributes.push(
        'dangerouslySetInnerHTML={{__html: ' +
          JSON.stringify(node.textContent) +
          ' }}'
      );
    }
    if (tagName === 'pre') {
      this._inPreTag = true;
    }

    this.output += '<' + tagName;
    if (attributes.length > 0) {
      this.output += ' ' + attributes.join(' ');
    }
    if (!isSelfClosing(node)) {
      this.output += '>';
    }
  }

  /**
   * Handles post-visit behaviour for the specified element node
   *
   * @param {Node} node
   */
  _endVisitElement(node: Element) {
    const tagName = jsxTagName(node.tagName);
    // De-indent a bit
    // TODO: It's inefficient to do it this way :/
    this.output = trimEnd(this.output, this.config.indent);
    if (isSelfClosing(node)) {
      this.output += ' />';
    } else {
      this.output += '</' + tagName + '>';
    }

    if (tagName === 'pre') {
      this._inPreTag = false;
    }
  }

  /**
   * Handles processing of the specified text node
   *
   * @param {TextNode} node
   */
  _visitText(node: Text) {
    var parentTag =
      node.parentNode && jsxTagName((node.parentNode as Element).tagName);
    if (parentTag === 'textarea' || parentTag === 'style') {
      // Ignore text content of textareas and styles, as it will have already been moved
      // to a "defaultValue" attribute and "dangerouslySetInnerHTML" attribute respectively.
      return;
    }

    var text = escapeSpecialChars(node.textContent || '');

    if (this._inPreTag) {
      // If this text is contained within a <pre>, we need to ensure the JSX
      // whitespace coalescing rules don't eat the whitespace. This means
      // wrapping newlines and sequences of two or more spaces in variables.
      text = text
        .replace(/\r/g, '')
        .replace(/( {2,}|\n|\t|\{|\})/g, function(whitespace) {
          return '{' + JSON.stringify(whitespace) + '}';
        });
    } else {
      // Handle any curly braces.
      text = text.replace(/(\{|\})/g, function(brace) {
        return "{'" + brace + "'}";
      });
      // If there's a newline in the text, adjust the indent level
      if (text.indexOf('\n') > -1) {
        text = text.replace(/\n\s*/g, this._getIndentedNewline());
      }
    }
    this.output += text;
  }

  /**
   * Main entry point to the converter. Given the specified HTML, returns a
   * JSX object representing it.
   * @param {string} html HTML to convert
   * @return {string} JSX
   */
  convert(html: string) {
    this.reset();

    var containerEl = createElement('div');
    containerEl.innerHTML = '\n' + cleanHTML(html) + '\n';

    if (this.config.createClass) {
      if (this.config.outputClassName) {
        this.output =
          'var ' + this.config.outputClassName + ' = React.createClass({\n';
      } else {
        this.output = 'React.createClass({\n';
      }
      this.output += this.config.indent + 'render: function() {' + '\n';
      this.output += this.config.indent + this.config.indent + 'return (\n';
    }

    if (onlyOneTopLevel(containerEl)) {
      // Only one top-level element, the component can return it directly
      // No need to actually visit the container element
      this._traverse(containerEl);
    } else {
      // More than one top-level element, need to wrap the whole thing in a
      // container.
      this.output +=
        this.config.indent + this.config.indent + this.config.indent;
      this.level++;
      this._visit(containerEl);
    }
    this.output = this.output.trim() + '\n';
    if (this.config.createClass) {
      this.output += this.config.indent + this.config.indent + ');\n';
      this.output += this.config.indent + '}\n';
      this.output += '});';
    } else {
      this.output = removeJSXClassIndention(this.output, this.config.indent);
    }
    return this.output;
  }
}
