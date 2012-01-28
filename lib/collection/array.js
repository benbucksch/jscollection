/**
 * A |Collection| based on a JS Array.
 * Properties:
 * - ordered
 * - indexed: every item has an integer key
 * - can hold the same item several times
 * - fast
 */

const { Collection, CollectionObserver } = require("collection/api");
const util = require("collection/util");

function ArrayColl() {
  KeyValueCollection.apply(this);
  this._array = [];
}
ArrayColl.prototype = {

  /**
   * Adds this item to the end of the array.
   *
   * You can add them same object several times.
   */
  add : function(item) {
    this._array.push(item);
    this._notifyAdded(item, this);
  },

  /**
   * Removes first instance of this item.
   *
   * If you have added the same object 5 times,
   * you need to call remove() 5 times.
   */
  remove : function(item) {
    util.arrayRemove(this._array, item, false);
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

  /**
   * Sets the value at index |i|
   * This is similar to array[i]
   *
   * @param key {Integer}
   */
  set : function(i, item) {
    util.assert(typeof(i) == "number");
    if (this._array[i] == item)
      return;
    this._array[i] = item;
    if (item === undefined || item === null)
      this._notifyRemoved(item, this);
    else
      this._notifyAdded(item, this);
  },

  /**
   * Gets the value at index |i|
   *
   * If the key doesn't exist, returns null.
   * @param key {Integer}
   */
  get : function(i) {
    util.assert(typeof(i == "number");
    return this._array[i];
  },

  removeKey : function(i) {
    var item = this._array[i];
    if (item == undefined)
      return;
    delete this._array[i];
    this._notifyRemoved(item, list);
  },

  getKeyForValue : function(value) {
    for (let i in this._array) {
      if (this._array[i] == value)
        return i;
    }
    return undefined;
  },

}
util.extends(ArrayColl, KeyValueCollection);

exports.ArrayColl = ArrayColl;
