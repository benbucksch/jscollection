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
export function concatColl(...colls) {
  let merge = new AdditionCollectionWithDups();
  for (let coll of colls) {
    merge.addColl(coll);
  }
  return merge;
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
Collection.prototype.concat = function (...otherColls) {
  return concatColl(this, ...otherColls);
}


/**
 * Superset
 * Allows duplicates
 * E.g. A = abcd, B = bdef, then addition with dups = abcdbdef.
 */
export class AdditionCollectionWithDups extends ArrayColl {
  _observer = null;
  constructor() {
    super();
    this._observer = new AdditionCollectionWithDupsObserver(this);
  }

  addColl(coll) {
    assert(coll instanceof Collection, "must be a Collection");
    this._observer.added(coll.contents);
    coll.registerObserver(this._observer);
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
