import { KeyValueCollection } from "../api.js"

/**
 * A `KeyValueCollection` which can map one string or object to another object.
 * Properties:
 * - not ordered
 * - can *not* hold the same key several times
 * - fast
 */
export class MapColl extends KeyValueCollection {
  constructor() {
    super();
    this._map = new Map();
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

  /**
   * Slow. Please use removeKey() instead.
   */
  remove(value) {
    let key = this.getKeyForValue(value);
    if (key === undefined) {
      throw "Item doesn't exist";
    }
    this.removeKey(key);
  }

  clear() {
    this._notifyRemoved(this.contents);
    this._map.clear();
  }

  get length() {
    return this._map.size;
  }

  get size() {
    return this._map.size;
  }

  /** Slow */
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
    let oldValue = this._map.get(key);
    if (oldValue == value) {
      return;
    }
    this._map.set(key, value);
    if (oldValue !== undefined) {
      this._notifyRemoved([oldValue]);
    }
    if (value !== undefined) {
      this._notifyAdded([value]);
    }
  }

  /**
   * Gets the value for |key|
   *
   * If the key doesn't exist, returns null.
   * @param key {String}
   */
  get(key) {
    return this._map.get(key);
  }

  removeKey(key) {
    let value = this.get(key);
    this._map.delete(key);
    this._notifyRemoved([value]);
  }

  delete(key) {
    this.removeKey(key);
  }

  has(key) {
    return this._map.has(key);
  }

  /** Slow */
  getKeyForValue(value) {
    let key;
    this._map.forEach((curValue, curKey) => {
      if (value == curValue) {
        key = curKey;
      }
    });
    return key;
  }

  forEach(func) {
    this._map.forEach(func);
  }

  get contents() {
    return [...this._map.values()];
  }

  contentKeys() {
    return [...this._map.keys()];
  }

  contentKeyValues() {
    let obj = {};
    this._map.forEach((value, key) => obj[key] = value);
    return obj;
  }

  values() {
    return this._map.values();
  }

  keys() {
    return this._map.keys();
  }

  entries() {
    return this._map.entries();
  }

  /** This doesn't make much sense for MapColl. Slow. */
  get first() {
    return this.contents[0]; // is there a more efficient impl?
  }

  /** This doesn't make much sense for MapColl. Slow. */
  getIndex(i) {
    return this.contents[i];
  }

  /** This doesn't make much sense for MapColl. Slow. */
  getIndexRange(i, length) {
    if (!i) {
      return [];
    }
    return this.contents.slice(i, i + length);
  }

  /**
   * Incompatible with JS Map: While Collection and MapColl
   * iterate over the items, JS Map iterates over the `entries()`.
   */
  [Symbol.iterator]() {
    return this._map.values();
  }

  /*
  iterator*() {
    this._map.forEach(value => yield value[i]);
  }*/
}
