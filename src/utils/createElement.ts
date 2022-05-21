import { parseHTML } from 'linkedom';

let createElement: (tagName: string) => HTMLElement;

// @ts-expect-error
if (typeof IN_BROWSER !== 'undefined' && IN_BROWSER) {
  // Browser environment, use document.createElement directly.
  createElement = function(tag: string) {
    return document.createElement(tag);
  };
} else {
  const { document } = parseHTML('<html></html>');

  createElement = function(tag: string) {
    return document.createElement(tag);
  };
}

export default createElement;
