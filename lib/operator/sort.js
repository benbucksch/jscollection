import { Collection } from "../api.js"
import { ArrayColl } from "../collection/array.js"
import { assert } from "../util.js"

/**
 * Returns a new collection that is sorted using the `sortFunc`.
 *
 * @param sortFunc {Function(itemA, itemB): boolean} itemA <= itemB
 *     If true: itemA before itemB.
 *     If false: itemB before itemA.
 *     Note: The result is boolean, not a number like `compareFunc` used by `Array.sort()`.
 *
 * @param coll {Collection}
 * @param sortFunc(a {Item}, b {Item})
 *     returns {Boolean} a > b // TODO stable sort? {Integer: -1: <, 0: =, 1: >}
 * @returns {Collection}
 */
export function sortColl(coll, sortFunc) {
  return new SortedCollection(coll, sortFunc);
}

/**
 * Returns a new collection that is sorted using the `sortFunc`.
 *
 * @param sortFunc {Function(itemA, itemB): boolean} itemA <= itemB
 *     If true: itemA before itemB.
 *     If false: itemB before itemA.
 *     Note: The result is boolean, not a number like `compareFunc` used by `Array.sort()`.
 */
Collection.prototype.sort = function (sortFunc) {
  return new SortedCollection(this, sortFunc);
}


/**
 * Returns a new collection that is sorted using the `sortFunc`.
 *
 * @param sortValueFunc {Function(itemA): any}
 *     Sort by the return value of the function given.
 *     E.g. messages.sortBy(msg => msg.sent) will order messages by their `sent` property.
 */
Collection.prototype.sortBy = function (sortValueFunc) {
  return new SortedCollection(this, (a, b) => sortValueFunc(a) <= sortValueFunc(b));
}


/**
 * Returns a new collection that is sorted using the `sortFunc`.
 *
 * @param source {Collection}   Another collection that is to be sorted
 * @param sortFunc {Function(itemA, itemB): boolean} itemA > itemB
 *     If true: itemA before itemB, or equal.
 *     If false: itemB before itemA.
 *     Note: The result is boolean, not a number like `compareFunc` used by `Array.sort()`.
 */
export class SortedCollection extends ArrayColl {
  constructor(source, sortFunc) {
    super();
    assert(typeof (sortFunc) == "function", "must be a function");
    assert(source instanceof Collection, "must be a Collection");
    this._source = source;
    this._sortFunc = sortFunc

    // add initial contents
    this.addAll(source.contents.sort((a, b) => sortFunc(a, b) ? -1 : 1));

    let observer = new SortedCollectionObserver(this);
    source.registerObserver(observer);
  }

  sortedIndex(value) {
    let low = 0;
    let high = this._array.length;

    while (low < high) {
      let mid = (low + high) >>> 1;
      if (this._sortFunc(value, this._array[mid])) { // value > array[mid]
        low = mid + 1;
      } else {
        high = mid;
      }
    }
    return low;
  }

}

class SortedCollectionObserver { // implements CollectionObserver
  constructor(sortedColl) {
    this._sortedColl = sortedColl;
  }

  added(items) {
    for (let item of items) {
      this._sortedColl._array.splice(this._sortedColl.sortedIndex(item), 0, item);
    }
  }

  removed(items) {
    this._sortedColl.removeAll(items);
  }
}
