import { Collection } from "../api.js"

/**
 * A `Collection` which can hold each object only once.
 * Properties:
 * - not ordered
 * - can *not* hold the same item several times
 * - fast
 */
export class SetColl extends Collection {
  constructor(copyFrom) {
    super();
    this._set = new Set();
    if (copyFrom) {
      this.addAll(copyFrom);
    }
  }

  /**
   * Adds this item.
   * If the item already exists, this is a no-op.
   * @param item {Object} Must not be null/undefined.
   */
  add(item) {
    var added = this._addWithoutObserver(item);
    if (added) {
      this._notifyAdded([item]);
    }
  }

  _addWithoutObserver(item) {
    if (item == null) { // specific check for SetColl
      throw new Error("null/undefined objects are not allowed");
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
    if (this._removeWithoutObserver(item)) {
      this._notifyRemoved([item]);
    }
  }

  /** @returns {boolean} whether the value was in the set and remove, or not. */
  _removeWithoutObserver(item) {
    return this._set.delete(item);
  }

  addAll(items) {
    let addedItems = [];
    for (let item of items) {
      if (this._addWithoutObserver(item)) {
        addedItems.push(item);
      }
    }
    if (addedItems.length) {
      this._notifyAdded(addedItems);
    }
  }

  removeAll(items) {
    let removedItems = [];
    for (let item of items) {
      if (this._removeWithoutObserver(item)) {
        removedItems.push(item);
      }
    }
    if (removedItems.length) {
      this._notifyRemoved(removedItems);
    }
  }

  clear() {
    if (this.isEmpty) {
      return;
    }
    let items = this.contents;
    this._set.clear();
    this._notifyRemoved(items);
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
    this._set.forEach(value => func(value, value, this));
  }

  get contents() {
    return [...this._set.values()];
  }

  /*
  iterator*() {
    this._map.forEach(value => yield value[i]);
  }*/
}
