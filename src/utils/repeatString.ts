/**
 * Repeats a string a certain number of times.
 * Also: the future is bright and consists of native string repetition:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat
 *
 * @param {string} str  String to repeat
 * @param {number} times   Number of times to repeat string. Integer.
 * @see http://jsperf.com/string-repeater/2
 */
export default function repeatString(str: string, times: number) {
  if (times === 1) {
    return str;
  }
  if (times < 0) {
    throw new Error();
  }
  var repeated = '';
  while (times) {
    if (times & 1) {
      repeated += str;
    }
    if ((times >>= 1)) {
      str += str;
    }
  }
  return repeated;
}
