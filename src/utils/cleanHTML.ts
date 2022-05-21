/**
 * Cleans up the specified HTML so it's in a format acceptable for
 * converting.
 *
 * @param html HTML to clean
 * @return Cleaned HTML
 */
export default function cleanHTML(html: string) {
  // Remove unnecessary whitespace
  html = html.trim();
  // Ugly method to strip script tags. They can wreak havoc on the DOM nodes
  // so let's not even put them in the DOM.
  html = html.replace(/<script([\s\S]*?)<\/script>/g, '');
  return html;
}
