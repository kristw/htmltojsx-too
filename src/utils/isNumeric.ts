/**
 * Determines if the specified string consists entirely of numeric characters.
 */
export default function isNumeric(input: string | number | null | undefined) {
  return (
    input !== undefined &&
    input !== null &&
    // @ts-expect-error
    (typeof input === 'number' || parseInt(input, 10) == input)
  );
}
