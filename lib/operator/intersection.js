import { Collection } from "../api.js"
import { SetColl } from "../collection/set.js"
import { assert } from "../util.js"

/**
 * Returns a collection that contains the values that are contained
 * in *both* `coll1` and `coll2`, and only those.
 *
 * E.g. A = abcd, B = bdef, then intersection = bd.
 *
 * Intersection @see <http://en.wikipedia.org/wiki/Intersection_(set_theory)>
 *
 * @param coll1 {Collection}
 * @param coll2 {Collection}
 * @returns {Collection}
 *     Does not preserve order.
 */
export function inCommonColl(coll1, coll2) {
  return new IntersectionCollection(coll1, coll2);
}

const intersectionColl = inCommonColl;

/**
 * Returns a collection that contains the values that are contained
 * in *both* `coll1` and `coll2`, and only those.
 *
 * E.g. A = abcd, B = bdef, then intersection = bd.
 *
 * Intersection @see <http://en.wikipedia.org/wiki/Intersection_(set_theory)>
 *
 * @param coll1 {Collection}
 * @param coll2 {Collection}
 * @returns {Collection}
 *     Does not preserve order.
 */
Collection.prototype.inCommon = function (otherColl) {
  return new IntersectionCollection(this, otherColl);
}

Collection.prototype.intersect = Collection.prototype.inCommon;


/**
 * Has only those items that are in both `coll1` and in `coll2`.
 * E.g. A = abcd, B = bdef, then intersection = bd.
 */
export class IntersectionCollection extends SetColl {
  _observer = null;
  constructor(coll1, coll2) {
    super();
    assert(coll1 instanceof Collection, "must be a Collection");
    assert(coll2 instanceof Collection, "must be a Collection");
    this._coll1 = coll1;
    this._coll2 = coll2;

    // add initial contents
    for (let item of coll1) {
      if (coll2.contains(item)) {
        this._addWithoutObserver(item);
      }
    }

    this._observer = new IntersectionCollectionObserver(this);
    coll1.registerObserver(this._observer);
    coll2.registerObserver(this._observer);
  }
}

class IntersectionCollectionObserver { // implements CollectionObserver
  constructor(intersectionColl) {
    this.intersectionColl = intersectionColl;
  }

  added(items) {
    this.intersectionColl.addAll(items.filter(item =>
      this.intersectionColl._coll1.contains(item) &&
      this.intersectionColl._coll2.contains(item) &&
      !this.intersectionColl.contains(item)
    ));
  }

  removed(items, coll) {
    this.intersectionColl.removeAll(items);
  }
}
