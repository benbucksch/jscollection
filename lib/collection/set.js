/**
 * A |Collection| which can hold each object only once.
 * Properties:
 * - not ordered
 * - can *not* hold the same item several times
 * - fast
 */

const { Collection, CollectionObserver } = require("collection/api");
const util = require("collection/util");

function Set() {
  Collection.apply(this);
  this._array = [];
}
Set.prototype = {

  /**
   * Adds this item.
   * If the item already exists, this is a no-op.
   * @param item {Object}
   */
  add : function(item) {
    if ( !item && item !== 0)
      throw "null objects are not allowed";
    if (this._arrayContains(item))
      return;
    this._array.push(item);
    this._notifyAdded(item, this);
  },

  remove : function(item) {
    util.arrayRemove(this._array, item, true);
    this._notifyRemoved(item, this);
  },

  clear : function() {
    for each (let item in this._array)
      this._notifyRemoved(item, this);
    this._array = [];
  },

  get length() {
    return this._array.length;
  },

  contains : function(item) {
    return util.arrayContains(this._array, item);
  },

  contents : function() {
    return this._array.slice(0); // return copy of array
  },
}
util.extends(Set, Collection);

exports.Set = Set;
