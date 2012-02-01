/**
 * A |Collection| which can hold each object only once.
 * Properties:
 * - not ordered
 * - can *not* hold the same item several times
 * - fast
 */

const { Collection, CollectionObserver } = require("./api");
const sanitize = require("./sanitizeDatatypes");
const util = require("./util");

function Map() {
  Collection.call(this);
  this._obj = {};
}
Map.prototype = {
  _nextFree : 0, // Hack to support add() somehow

  /**
   * This doesn't make much sense for Map.
   * Please use set() instead.
   */
  add : function(value) {
    while (this.contains(this._nextFree))
      this._nextFree++;
    this.set(this._nextFree++, value);
  },

  remove : function(value) {
    var key = this.getKeyForValue(value);
    if (!key)
      throw "item doesn't exist";
    this.removeKey(key);
  },

  clear : function() {
    for each (let value in this._obj)
      this._notifyRemoved(value, this);
    this._obj = {};
  },

  get length() {
    var length = 0;
    for each (let value in this._obj)
      length++;
    return length;
  },

  contents : function() {
    var array = [];
    for each (let value in this._obj)
      array.push(value);
    return array;
  },

  contentKeys : function() {
    var array = [];
    for (let key in this._obj)
      array.push(key);
    return array;
  },

  contentKeyValues : function() {
    var obj = {};
    for (let key in this._obj)
      obj[key] = value
    return obj;
  },

  __iterator__ : function() {
    for each (let value in this._obj)
      yield value[i];
  },

  contains : function(value) {
    return this.getKeyForValue(value) != undefined;
  },

  // containsKey : defined in KeyValueCollection

  /**
   * Sets the value for |key|
   *
   * @param key {String}
   */
  set : function(key, value) {
    key = sanitize.string(key);
    var oldValue = this._obj[key];
    this._obj[key] = value;
    if (oldValue !== undefined)
      this._notifyRemoved(oldValue, this);
    if (value !== undefined)
      this._notifyAdded(value, this);
  },

  /**
   * Gets the value for |key|
   *
   * If the key doesn't exist, returns null.
   * @param key {String}
   */
  get : function(key) {
    key = sanitize.string(key);
    return this._obj[key];
  },

  removeKey : function(key) {
    key = sanitize.string(key);
    var value = this._obj[key];
    if (value == undefined)
      return;
    delete this._obj[key];
    this._notifyRemoved(value, this);
  },

  getKeyForValue : function(value) {
    for (let key in this._obj) {
      if (this._obj[key] == value)
        return key;
    }
    return undefined;
  },

}
util.extend(Map, KeyValueCollection);

exports.Map = Map;
