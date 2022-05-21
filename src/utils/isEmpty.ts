/**
 * Determines if the specified string consists entirely of whitespace.
 */
export default function isEmpty(str: string) {
  return !/[^\s]/.test(str);
}
