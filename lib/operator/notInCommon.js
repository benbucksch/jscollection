import { Collection } from "../api.js"
import { SubtractCollection } from "./subtract.js"
import { AdditionCollection } from "./add-merge.js"
import { IntersectionCollection } from "./intersection.js"

/**
 * Returns a collection that contains all values that are contained
 * only in `coll1` or `coll2`, but *not in both*.
 *
 * Symmetric difference <http://en.wikipedia.org/wiki/Symmetric_difference>
 *
 * @param coll1 {Collection}
 * @param coll2 {Collection}
 * @returns {Collection}
 *     Does not preserve order.
 */
export function notInCommonColl(coll1, coll2) {
  return new SubtractCollection(
      new AdditionCollection(coll1, coll2),
      new IntersectionCollection(coll1, coll2));
}

const xorColl = notInCommonColl;

/**
 * Returns a collection that contains all values that are contained
 * only in the base collection or `otherColl`, but *not in both*.
 *
 * Symmetric difference <http://en.wikipedia.org/wiki/Symmetric_difference>
 *
 * @param otherColl {Collection}
 * @returns {Collection}
 *     Does not preserve order.
 */
Collection.prototype.notInCommon = function(otherColl) {
  return notInCommonColl(this, otherColl);
}

Collection.prototype.xorColl = Collection.prototype.notInCommon;
