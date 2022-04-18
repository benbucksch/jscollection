import { Collection } from "../api.js"
import { ArrayColl } from "../collection/array.js"
import { assert } from "../util.js"

/**
 * Returns a collection that contains all values from `coll1` and `coll2`.
 * If the same item is in both `coll1` and `coll2`, it will be added twice.
 *
 * E.g. A = abcd, B = bdef, then addition with dups = abcdbdef.
 *
 * @param coll1 {Collection}
 * @param coll2 {Collection}
 * @returns {Collection}
 *     Preserves order
 */
export function concatColl(coll1, coll2) {
  return new AdditionCollectionWithDups(coll1, coll2);
}

const addCollWithDups = concatColl;

/**
 * Returns a collection that contains all values from this coll and `otherColl`.
 * If the same item is in both this coll and `otherColl`, it will be added twice.
 *
 * E.g. A = abcd, B = bdef, then addition with dups = abcdbdef.
 *
 * @param otherColl {Collection}
 * @returns {Collection}
 *     Preserves order
 */
Collection.prototype.concat = function (otherColl) {
  return new AdditionCollectionWithDups(this, otherColl);
}


/**
 * Superset
 * Allows duplicates
 * E.g. A = abcd, B = bdef, then addition with dups = abcdbdef.
 */
export class AdditionCollectionWithDups extends ArrayColl {
  constructor(coll1, coll2) {
    super();
    _initAddition(this, coll1, coll2);

    let observer = new AdditionCollectionWithDupsObserver(this);
    coll1.registerObserver(observer);
    coll2.registerObserver(observer);
  }
}

/**
 * Shared ctor code for `AdditionCollection*`
 * Used also by `add-merge.js`.
 */
export function _initAddition(self, coll1, coll2) {
  assert(coll1 instanceof Collection, "must be a Collection");
  assert(coll2 instanceof Collection, "must be a Collection");
  self._coll1 = coll1;
  self._coll2 = coll2;

  // add initial contents
  for (let item of coll1) {
    self.add(item);
  }
  for (let item of coll2) {
    self.add(item);
  }
}

class AdditionCollectionWithDupsObserver { // implements CollectionObserver
  constructor(addColl) {
    this.addColl = addColl;
  }

  added(items) {
    this.addColl.addAll(items);
  }

  removed(items, coll) {
    this.addColl.removeAll(items);
  }
}
