import { Collection } from "../api.js"
import { ArrayColl } from "../collection/array.js"
import { assert } from "../util.js"

/**
 * Returns a new collection that is sorted using the `sortFunc`.
 *
 * @param coll {Collection}
 * @param sortFunc {Function(itemA, itemB): number}
 *     Like `Array.sort()`:
 *     If negative (`-1`): `itemA` before `itemB`
 *     If positive (`1`): `itemB` before `itemA`
 *     If `0`: `itemA` sorted identical to `itemB`
 *     You can use `compareValues()` to compare strings or numbers.
 * @returns {Collection}
 */
export function sortColl(coll, sortFunc) {
  return new SortedCollection(coll, sortFunc);
}

/**
 * Returns a new collection that is sorted using the `sortFunc`.
 *
 * @param sortFunc {Function(itemA, itemB): number}
 *     Like `Array.sort()`:
 *     If negative (`-1`): `itemA` before `itemB`
 *     If positive (`1`): `itemB` before `itemA`
 *     If `0`: `itemA` sorted identical to `itemB`
 *     You can use `compareValues()` to compare strings or numbers.
 */
Collection.prototype.sort = function (sortFunc) {
  return new SortedCollection(this, sortFunc);
}

/**
 * Returns a new collection that is sorted using the `sortFunc`.
 *
 * @param sortValueFunc {Function(itemA): any}
 *     Sort by the return value of the function given.
 *     Works for strings, numbers and `Date`s.
 *     E.g. `messages.sortBy(msg => msg.sent)`
 *     will order messages by their `sent` property.
 */
Collection.prototype.sortBy = function (sortValueFunc) {
  return new SortedCollection(this, (a, b) => compareValues(sortValueFunc(a), sortValueFunc(b)));
}

/**
 * Works for strings, numbers and `Date`s
 * @returns
 *     `-1`: `a` before `b`
 *     `1`: `b` before `a`
 *     `0`: `a` is sorted identical to `b`
*/
export function compareValues(a, b) {
  if (a < b) {
    return -1;
  } else if (a > b) {
    return 1;
  } else { // equal
    return 0;
  }
}

/**
 * Returns a new collection that is sorted using the `sortFunc`.
 *
 * @param source {Collection}   Another collection that is to be sorted
 * @param sortFunc {Function(itemA, itemB): number}
 *     Like `Array.sort()`:
 *     If negative (`-1`): `itemA` before `itemB`
 *     If positive (`1`): `itemB` before `itemA`
 *     If `0`: `itemA` sorted identical to `itemB`
 *     You can use `compareValues()` to compare strings or numbers.
 */
export class SortedCollection extends ArrayColl {
  constructor(source, sortFunc) {
    super();
    assert(typeof (sortFunc) == "function", "must be a function");
    assert(source instanceof Collection, "must be a Collection");
    this._source = source;
    this._sortFunc = sortFunc;

    // add initial contents
    this.addAll(source.contents.sort(sortFunc));

    let observer = new SortedCollectionObserver(this);
    source.registerObserver(observer);
  }

  sortedIndex(value) {
    let low = 0;
    let high = this._array.length;

    while (low < high) {
      let mid = (low + high) >>> 1;
      if (this._sortFunc(value, this._array[mid]) > 0) { // value > array[mid]
        low = mid + 1;
      } else {
        high = mid;
      }
    }
    return low;
  }

  /*
  sortedIndex_walk(value) {
    for (let i = 0; i < this._array.length; i++) {
      if (this._sortFunc(value, this._array[i]) < 0) { // value < array[i]
        return i;
      }
    }
    return this._array.length;
  }*/
}

class SortedCollectionObserver { // implements CollectionObserver
  constructor(sortedColl) {
    this._sortedColl = sortedColl;
  }

  added(items) {
    for (let item of items) {
      let pos = this._sortedColl.sortedIndex(item);
      this._sortedColl._array.splice(pos, 0, item);
      this._sortedColl._notifyAdded([item]);
    }
  }

  removed(items) {
    this._sortedColl.removeAll(items);
  }
}
