/**
 * A |Collection| which can hold each object only once.
 * Properties:
 * - not ordered
 * - can *not* hold the same item several times
 * - fast
 */

const { Collection, CollectionObserver } = require("./api");
const util = require("./util");

function Set() {
  Collection.call(this);
  this._array = [];
}
Set.prototype = {

  /**
   * Adds this item.
   * If the item already exists, this is a no-op.
   * @param item {Object}
   */
  add : function(item) {
    this._addWithoutObserver(item);
    this._notifyAdded(item, this);
  },

  _addWithoutObserver : function(item) {
    if ( !item && item !== 0)
      throw "null objects are not allowed";
    if (util.arrayContains(item))
      return;
    this._array.push(item);
  },

  remove : function(item) {
    util.arrayRemove(this._array, item, true);
    this._notifyRemoved(item, this);
  },

  _removeWithoutObserver : function(item) {
    util.arrayRemove(this._array, item, true);
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
    return this._array.slice(); // return copy of array
  },
}
util.extend(Set, Collection);

exports.Set = Set;
