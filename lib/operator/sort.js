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
Collection.prototype.sort = function(sortFunc) {
  return new SortedCollection(this, sortFunc);
}


/**
 * Returns a new collection that is sorted using the `sortFunc`.
 *
 * @param source {Collection}   Another collection that is to be sorted
 * @param sortFunc {Function(itemA, itemB): boolean} itemA <= itemB
 *     If true: itemA before itemB.
 *     If false: itemB before itemA.
 *     Note: The result is boolean, not a number like `compareFunc` used by `Array.sort()`.
 */
export class SortedCollection extends ArrayColl {
  constructor(source, sortFunc) {
    super();
    assert(typeof(sortFunc) == "function", "must be a function");
    assert(source instanceof Collection, "must be a Collection");
    this._source = source;
    this._sortFunc = sortFunc;

    // add initial contents
    this.addAll(source.contents.sort((a, b) => sortFunc(a, b) ? -1 : 1));

    source.registerObserver(this);
  }

  // Implement CollectionObserver
  added(items) {
    // TODO re-implement by sorting only the new items,
    // then call the observer for those only (all at once)
    this.removeAll(this._source.contents);
    this.addAll(this._source.contents.sort((a, b) => this._sortFunc(a, b) ? -1 : 1));
  }

  removed(items) {
    this.removeAll(items);
  }
}
