/**
 * INTERNAL
 * Some common functionality needed by the implementation
 */

function assert(test, errorMsg) {
  if (!test) {
    throw new Error(errorMsg ? errorMsg : "Bug: assertion failed");
  }
}
