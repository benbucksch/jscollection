import { Collection } from "../api.js"
import { arrayRemove } from "../util.js"

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
    this._array = [];
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
    this._array.push(item);
    return true;
  }

  remove(item) {
    arrayRemove(this._array, item, true);
    this._notifyRemoved([item], this);
  }

  _removeWithoutObserver(item) {
    arrayRemove(this._array, item, true);
  }

  addAll(items) {
    if (items instanceof Collection) {
      items = items.contents;
    }
    items.forEach(item => this._addWithoutObserver(item));
    this._notifyAdded(items, this);
  }

  removeAll(items) {
    if (items instanceof Collection) {
      items = items.contents;
    }
    items.forEach(item => this._removeWithoutObserver(item));
    this._notifyRemoved(items, this);
  }

  clear() {
    this._notifyRemoved(this.contents, this);
    this._array = [];
  }

  get length() {
    return this._array.length;
  }

  contains(item) {
    return this._array.indexOf(item) != -1;
  }

  get contents() {
    return this._array.slice(); // return copy of array
  }

  get first() {
    return this._array[0];
  }

  getIndex(i) {
    return this._array[i];
  }

  getIndexRange(i, length) {
    if (!i) {
      return [];
    }
    return this._array.slice(i, i + length);
  }

  forEach(callback) {
    this._array.forEach(callback);
  }
}
