/**
 * INTERNAL
 * Some common functionality needed by the implementation
 */

function assert(test, errorMsg)
{
  if (!test)
    throw new NotReached(errorMsg ? errorMsg : "Bug: assertion failed");
}

function extend(child, supertype)
{
  child.prototype.__proto__ = supertype.prototype;
}

function arrayRemove(array, element, all)
{
  var found = 0;
  var pos = 0;
  while ((pos = array.indexOf(element, pos)) != -1)
  {
    array.splice(pos, 1);
    found++
    if ( ! all)
      return found;
  }
  return found;
}

function arrayContains(array, element)
{
  return array.indexOf(element) != -1;
}

exports.extend = extend;
exports.assert = assert;
exports.arrayRemove = arrayRemove;
exports.arrayContains = arrayContains;
