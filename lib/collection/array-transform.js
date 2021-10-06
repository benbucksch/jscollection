/** Split into separate file, to avoid circular depencency */
import { ArrayColl } from "./array.js";
import { TransformedCollection } from "../operator/transform.js";

ArrayColl.prototype.slice = function(start, end) {
  return new TransformedCollection(this, source => source._array
    .slice(start, end));
}

/**
 * Unlike JS Array, this is not in-place, but returns a new ArrayColl.
 */
ArrayColl.prototype.reverse = function() {
  return new TransformedCollection(this, source => source.contents
    .reverse());
}

ArrayColl.prototype.flat = function() {
  return new TransformedCollection(this, source => source._array
    .flat());
}

ArrayColl.prototype.flatMap = function(mapFunc) {
  return new TransformedCollection(this, source => source._array
    .flatMap(mapFunc));
}
