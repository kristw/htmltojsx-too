/**
 * Trim the specified substring off the string. If the string does not end
 * with the specified substring, this is a no-op.
 *
 * @param {string} haystack String to search in
 * @param {string} needle   String to search for
 * @return {string}
 */
export default function trimEnd(haystack: string, needle: string) {
  return haystack.endsWith(needle)
    ? haystack.slice(0, -needle.length)
    : haystack;
}
