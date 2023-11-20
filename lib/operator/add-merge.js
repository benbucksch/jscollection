import { Collection } from "../api.js"
import { SetColl } from "../collection/set.js"
import { ArrayColl } from "../collection/array.js"
import { assert } from "../util.js"

/**
 * Returns a collection that contains all values from `coll1` and `coll2`.
 * If the same item is in both `coll1` and `coll2`, it will be added only once.
 *
 * E.g. A = abcd, B = bdef, then result = abcdef.
 *
 * Union @see <http://en.wikipedia.org/wiki/Union_(set_theory)>
 *
 * @param coll, coll, coll, ... {Collection} Any number of collections to merge
 * @returns {Collection}
 *     Does not preserve order.
 */
export function mergeColl(...colls) {
  let merge = new AdditionCollection();
  for (let coll of colls) {
    merge.addColl(coll);
  }
  return merge;
}

/**
 * Like mergeColl(), but adds a collection of a collection of items,
 * and observes the collection, so if collections of items are added or removed,
 * this merge is updated.
 *
 * E.g. `let tenants = mergeColls(houses.map(house => house.tenants))`
 * so `tenants` will contain all tenants from all houses.
 * If houses are added or removed, their tenants will be added/removed.
 * Likewise, as with mergeColl(), if tenants are added/removed from any house,
 * they will be added/removed from the merged collection.
 *
 * @param colls {Collection of Collection} Any number of collections to merge
 * @returns {Collection}
 *     Does not preserve order.
 */
export function mergeColls(colls) {
  let merge = new AdditionCollection();
  for (let coll of colls.contents) {
    merge.addColl(coll);
  }
  merge._colls = colls;
  colls.registerObserver(new AdditionCollectionOfCollectionObserver(merge));
  return merge;
}

const addColl = mergeColl;

/**
 * Returns a collection that contains all values from this coll and `otherColl`.
 * If the same item is in both the this coll and `otherColl`, it will be added only once.
 *
 * E.g. A = abcd, B = bdef, then result = abcdef.
 *
 * Union @see <http://en.wikipedia.org/wiki/Union_(set_theory)>
 *
 * @param otherColl {Collection}
 * @returns {Collection}
 *     Does not preserve order.
 */
Collection.prototype.merge = function (...otherColls) {
  return mergeColl(this, ...otherColls);
}


/**
 * Superset
 * Does not allow duplicates
 * E.g. A = abcd, B = bdef, then result = abcdef.
 */
export class AdditionCollection extends SetColl {
  _observer = null;
  /**
   * The base collections which are added to the merge
   * Overwritten by mergeColls()
   */
  _colls = new ArrayColl();
  constructor() {
    super();
    this._observer = new AdditionCollectionDedupObserver(this);
  }
  addColl(coll) {
    assert(coll instanceof Collection, "must be a Collection");
    this._colls.add(coll);
    this._observer.added(coll.contents);
    coll.registerObserver(this._observer);
  }
}

class AdditionCollectionDedupObserver { // implements CollectionObserver
  constructor(addColl) {
    this.addColl = addColl;
  }

  added(items) {
    //this.addColl.addAll(items); -- also works, but leaves de-duping to SetColl
    this.addColl.addAll(items.filter(item => !this.addColl.contains(item)));
  }

  removed(items, itemsFromColl) {
    // if the item was in both colls, but now is in only one,
    // we need to keep it in the result.
    this.addColl.removeAll(items.filter(item =>
      !this.addColl._colls.some(coll => coll != itemsFromColl && coll.contains(item))
    ));
  }
}


class AdditionCollectionOfCollectionObserver { // implements CollectionObserver
  constructor(addColl) {
    this.addColl = addColl;
  }

  added(colls, collOfColls) {
    for (let coll of colls) {
      this.addColl._observer.added(coll.contents, coll);
    }
  }
  removed(colls, collOfColls) {
    for (let coll of colls) {
      this.addColl._observer.removed(coll.contents, coll);
    }
  }
}
