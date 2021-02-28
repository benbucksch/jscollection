const { KeyValueCollection } = require("./api.js");
const { assert } = require("./util.js");

/**
 * A `KeyValueCollection` which can map one string or object to another object.
 * Properties:
 * - not ordered
 * - can *not* hold the same key several times
 * - fast
 */
class MapColl extends KeyValueCollection {
  constructor() {
    super();
    this._obj = {};
    this._nextFree = 0; // Hack to support add() somehow
  }

  /**
   * This doesn't make much sense for MapColl.
   * Please use set() instead.
   */
  add(value) {
    while (this.contains(this._nextFree)) {
      this._nextFree++;
    }
    this.set(this._nextFree++, value);
  }

  remove(value) {
    var key = this.getKeyForValue(value);
    if (!key) {
      throw "Item doesn't exist";
    }
    this.removeKey(key);
  }

  clear() {
    this._notifyRemoved(this.contents, this);
    this._obj = {};
  }

  get length() {
    var length = 0;
    for (let prop in this._obj) {
      length++;
    }
    return length;
  }

  get contents() {
    var array = [];
    for (let prop in this._obj) {
      let value = this._obj[prop];
      array.push(value);
    }
    return array;
  }

  get first() {
    return this.contents[0]; // is there a more efficient impl?
  }

  getIndex(i) {
    return this.contents[i];
  }

  getIndexRange(i, length) {
    if (!i) {
      return [];
    }
    return this.contents.slice(i, i + length);
  }

  contentKeys() {
    var array = [];
    for (let key in this._obj) {
      array.push(key);
    }
    return array;
  }

  contentKeyValues() {
    var obj = {};
    for (let key in this._obj) {
      obj[key] = value
    }
    return obj;
  }

  forEach(callback) {
    for (let prop in this._obj) {
      let value = this._obj[prop];
      callback(value);
    }
  }

  /*
  iterator*() {
    for (var prop in this._obj) {
      var value = this._obj[prop];
      yield value[i];
    }
  }*/

  contains(value) {
    return this.getKeyForValue(value) != undefined;
  }

  // containsKey : defined in KeyValueCollection

  /**
   * Sets the value for |key|
   *
   * @param key {String}
   */
  set(key, value) {
    key = sanitizeString(key);
    var oldValue = this._obj[key];
    if (oldValue == value) {
      return;
    }
    this._obj[key] = value;
    if (oldValue !== undefined) {
      this._notifyRemoved([oldValue], this);
    }
    if (value !== undefined) {
      this._notifyAdded([value], this);
    }
  }

  /**
   * Gets the value for |key|
   *
   * If the key doesn't exist, returns null.
   * @param key {String}
   */
  get(key) {
    key = sanitizeString(key);
    return this._obj[key];
  }

  removeKey(key) {
    key = sanitizeString(key);
    var value = this._obj[key];
    if (value == undefined) {
      return;
    }
    delete this._obj[key];
    this._notifyRemoved([value], this);
  }

  getKeyForValue(value) {
    for (var key in this._obj) {
      if (this._obj[key] == value) {
        return key;
      }
    }
    return undefined;
  }
}


function sanitizeString(unchecked) {
  return String(unchecked);
};

exports.MapColl = MapColl;
