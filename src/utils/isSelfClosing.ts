import jsxTagName from './jsxTagName';

/**
 * Determines if this element node should be rendered as a self-closing
 * tag.
 *
 * @param node
 * @return
 */
export default function isSelfClosing(node: Element) {
  const tagName = jsxTagName(node.tagName);
  // If it has children, it's not self-closing
  // Exception: All children of a textarea are moved to a "defaultValue" attribute, style attributes are dangerously set.
  return !node.firstChild || tagName === 'textarea' || tagName === 'style';
}
