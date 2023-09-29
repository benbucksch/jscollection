import { KeyValueCollection } from "../api.js"
import { ArrayColl } from "./array.js"

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
    if (this.isEmpty) {
      return;
    }
    let items = this.contents;
    this._map.clear();
    this._notifyRemoved(items);
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
    if (oldValue === value) {
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
    this._map.forEach((value, key) => func(value, key, this));
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
    return new ArrayColl([...this._map.values()]);
  }

  keys() {
    return new ArrayColl([...this._map.keys()]);
  }

  entries() {
    return new ArrayColl([...this._map.entries()]);
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
