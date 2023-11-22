import { Collection } from "../api.js"

/**
 * A `Collection` which can hold each object only once.
 * Properties:
 * - not ordered
 * - can *not* hold the same item several times
 * - fast
 */
export class SetColl extends Collection {
  constructor() {
    super();
    this._set = new Set();
  }

  /**
   * Adds this item.
   * If the item already exists, this is a no-op.
   * @param item {Object}
   */
  add(item) {
    var added = this._addWithoutObserver(item);
    if (added) {
      this._notifyAdded([item]);
    }
  }

  _addWithoutObserver(item) {
    if (!item && item !== 0) {
      throw "null objects are not allowed";
    }
    if (this.contains(item)) {
      return false;
    }
    this._set.add(item);
    return true;
  }

  delete(item) {
    this.remove(item);
  }

  remove(item) {
    this._removeWithoutObserver(item);
    this._notifyRemoved([item]);
  }

  _removeWithoutObserver(item) {
    this._set.delete(item);
  }

  addAll(items) {
    for (let item of items) {
      this._addWithoutObserver(item);
    }
    this._notifyAdded(items);
  }

  removeAll(items) {
    for (let item of items) {
      this._removeWithoutObserver(item);
    }
    this._notifyRemoved(items);
  }

  clear() {
    this._notifyRemoved(this.contents);
    this._set.clear();
  }

  get length() {
    return this._set.size;
  }

  get size() {
    return this._set.size;
  }

  contains(item) {
    return this._set.has(item);
  }

  has(item) {
    return this._set.has(item);
  }

  [Symbol.iterator]() {
    return this._set.values();
  }

  values() {
    return this._set.values();
  }

  keys() {
    return this._set.keys();
  }

  entries() {
    return this._set.entries();
  }

  forEach(func) {
    this._set.forEach(func);
  }

  get contents() {
    return [...this._set.values()];
  }

  /*
  iterator*() {
    this._map.forEach(value => yield value[i]);
  }*/
}
