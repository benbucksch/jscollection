import { Collection } from "../api.js"
import { ArrayColl } from "../collection/array.js"
import { AdditionCollectionOfCollectionObserver } from "./add-merge.js"
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
 * Like concatColl(), but adds a collection of a collection of items,
 * and observes the collection, so if collections of items are added or removed,
 * this result is updated.
 * Like mergeColls(), but contains duplicates.
 *
 * E.g. `let tenants = concatColls(houses.map(house => house.tenants))`
 * so `tenants` will contain all tenants from all houses.
 * If houses are added or removed, their tenants will be added/removed.
 * Likewise, as with mergeColl(), if tenants are added/removed from any house,
 * they will be added/removed from the merged collection.
 *
 * @param colls {Collection of Collection} Any number of collections to merge
 * @returns {Collection}
 *     Does not preserve order.
 */
export function concatColls(colls) {
  let merge = new AdditionCollectionWithDups();
  for (let coll of colls.contents) {
    merge.addColl(coll);
  }
  merge._colls = colls;
  colls.registerObserver(new AdditionCollectionOfCollectionObserver(merge));
  return merge;
}

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
