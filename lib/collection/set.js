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
      this._notifyAdded([item], this);
    }
  }

  _addWithoutObserver(item) {
    if ( !item && item !== 0) {
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
    this._notifyRemoved([item], this);
  }

  _removeWithoutObserver(item) {
    this._set.delete(item);
  }

  addAll(items) {
    items.forEach(item => this._addWithoutObserver(item));
    this._notifyAdded(items, this);
  }

  removeAll(items) {
    items.forEach(item => this._removeWithoutObserver(item));
    this._notifyRemoved(items, this);
  }

  clear() {
    this._notifyRemoved(this.contents, this);
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

  forEach(callback) {
    this._set.forEach(callback);
  }

  get contents() {
    return [...this.set.values()];
  }

  /**
   * This doesn't make much sense for SetColl.
   */
  get first() {
    return this.contents[0];
  }

  /**
   * This doesn't make much sense for SetColl.
   */
  getIndex(i) {
    return this.contents[i];
  }

  /**
   * This doesn't make much sense for SetColl.
   */
  getIndexRange(i, length) {
    if (!i) {
      return [];
    }
    return this.contents.slice(i, i + length);
  }
}
