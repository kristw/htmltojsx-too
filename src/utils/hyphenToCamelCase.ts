/**
 * Convert a hyphenated string to camelCase.
 */
export default function hyphenToCamelCase(str: string) {
  return str.replace(/-(.)/g, function(_, chr) {
    return chr.toUpperCase();
  });
}
