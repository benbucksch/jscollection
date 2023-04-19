import { Collection } from "../api.js"
import { TransformedCollection } from "./transform.js"

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
 * @param sortFunc {Function(itemA, itemB): boolean} itemA <= itemB
 *     If true: itemA before itemB, or equal.
 *     If false: itemB before itemA.
 *     Note: The result is boolean, not a number like `compareFunc` used by `Array.sort()`.
 */
export class SortedCollection extends TransformedCollection {
  constructor(source, sortFunc) {
    let transformFunc = source => source.contents.sort((a, b) => sortFunc(a, b) ? -1 : 1);
    super(source, transformFunc);
  }
}
