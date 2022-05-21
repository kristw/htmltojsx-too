import hyphenToCamelCase from '../utils/hyphenToCamelCase';
import isNumeric from '../utils/isNumeric';

/**
 * Convert the CSS style key to a JSX style key
 *
 * @param key CSS style key
 * @return JSX style key
 */
export function toJSXKey(key: string) {
  // Don't capitalize -ms- prefix
  if (/^-ms-/.test(key)) {
    key = key.slice(1);
  }
  return hyphenToCamelCase(key);
}

/**
 * Convert the CSS style value to a JSX style value
 *
 * @param value CSS style value
 * @return JSX style value
 */
export function toJSXValue(value: string) {
  if (isNumeric(value)) {
    // If numeric, no quotes
    return value;
  }
  // Probably a string, wrap it in quotes
  return "'" + value.replace(/'/g, '"') + "'";
}

/**
 * Handles parsing of inline styles
 */
export default class StyleParser {
  styles: { [key: string]: string };

  /**
   * Handles parsing of inline styles
   *
   * @param {string} rawStyle Raw style attribute
   * @constructor
   */
  constructor(rawStyle: string) {
    this.styles = {};
    this.parse(rawStyle);
  }

  /**
   * Parse the specified inline style attribute value
   * @param {string} rawStyle Raw style attribute
   */
  parse(rawStyle: string) {
    this.styles = {};
    rawStyle.split(';').forEach(style => {
      style = style.trim();
      const firstColon = style.indexOf(':');
      let key = style.slice(0, firstColon);
      const value = style.slice(firstColon + 1).trim();
      if (key !== '') {
        // Style key should be case insensitive
        key = key.toLowerCase();
        this.styles[key] = value;
      }
    });
  }

  /**
   * Convert the style information represented by this parser into a JSX
   * string
   *
   * @return {string}
   */
  toJSXString() {
    return Object.entries(this.styles)
      .map(([key, value]) => toJSXKey(key) + ': ' + toJSXValue(value))
      .join(', ');
  }
}
