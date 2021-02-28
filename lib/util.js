/**
 * INTERNAL
 * Some common functionality needed by the implementation
 */

function assert(test, errorMsg) {
  if (!test) {
    throw new Error(errorMsg ? errorMsg : "Bug: assertion failed");
  }
}

/**
 * Removes |element| from |array|.
 * @param array {Array} to be modified. Will be modified in-place.
 * @param element {Object} If |array| has a member that equals |element|,
 *    the array member will be removed.
 * @param all {boolean}
 *     if true: remove all occurences of |element| in |array.
 *     if false: remove only the first hit
 * @returns {Integer} number of hits removed (0, 1 or more)
 */
function arrayRemove(array, element, all) {
  var found = 0;
  var pos = 0;
  while ((pos = array.indexOf(element, pos)) != -1) {
    array.splice(pos, 1);
    found++
    if ( ! all) {
      return found;
    }
  }
  return found;
}

exports.assert = assert;
exports.arrayRemove = arrayRemove;
