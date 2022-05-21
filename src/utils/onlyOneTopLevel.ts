import { NODE_TYPE } from '../constants/mappings';
import isEmpty from './isEmpty';

/**
 * Determines if there's only one top-level node in the DOM tree. That is,
 * all the HTML is wrapped by a single HTML tag.
 *
 * @param {DOMElement} containerEl Container element
 * @return {boolean}
 */
export default function onlyOneTopLevel(containerEl: Element) {
  // Only a single child element
  if (
    containerEl.childNodes.length === 1 &&
    containerEl.childNodes[0].nodeType === NODE_TYPE.ELEMENT
  ) {
    return true;
  }
  // Only one element, and all other children are whitespace
  let foundElement = false;
  for (let i = 0, count = containerEl.childNodes.length; i < count; i++) {
    const child = containerEl.childNodes[i];
    if (child.nodeType === NODE_TYPE.ELEMENT) {
      if (foundElement) {
        // Encountered an element after already encountering another one
        // Therefore, more than one element at root level
        return false;
      } else {
        foundElement = true;
      }
    } else if (
      child.nodeType === NODE_TYPE.TEXT &&
      !isEmpty(child.textContent ?? '')
    )
      // Contains text content
      return false;
  }
  return true;
}
