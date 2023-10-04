import { Collection, KeyValueCollection } from "../api.js"
import { assert, arrayRemove } from "../util.js"

/**
 * A `KeyValueCollection` based on a JS Array.
 * Properties:
 * - ordered
 * - indexed: every item has an integer key
 * - can hold the same item several times
 * - fast
 */
export class ArrayColl extends KeyValueCollection {
  /**
   * @param copyFrom {Array or Collection} init the collection with these values
   */
  constructor(copyFrom) {
    super();
    this._array = [];
    if (copyFrom instanceof Collection) {
      this._array = copyFrom.contents;
    } else if (copyFrom && copyFrom.length) {
      this._array = copyFrom.slice(0);
    }
  }

  /**
   * Adds this item to the end of the array.
   *
   * You can add them same object several times.
   */
  add(item) {
    this._array.push(item);
    this._notifyAdded([item]);
  }

  _addWithoutObserver(item) {
    this._array.push(item);
  }

  /**
   * Removes first instance of this item.
   *
   * If you have added the same object 5 times,
   * you need to call remove() 5 times, or removeEach() once,
   * to remove them all.
   */
  remove(item) {
    if (this._removeWithoutObserver(item)) {
      this._notifyRemoved([item]);
    }
  }

   /** @returns {integer} number of items removed */
  _removeWithoutObserver(item) {
    return arrayRemove(this._array, item, false);
  }

  addAll(items) {
    this._array.push(...items);
    this._notifyAdded(items);
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

  /**
   * Removes all instances of this item.
   *
   * If you have added the same object 5 times,
   * you need to call remove() 5 times, or removeEach() once,
   * to remove them all.
   */
  removeEach(item) {
    let found = arrayRemove(this._array, item, true);
    if (found) {
      this._notifyRemoved(new Array(found).fill(item));
    }
  }

  clear() {
    if (!this._array.length) {
      return;
    }
    let items = this._array;
    this._array = [];
    this._notifyRemoved(items);
  }

  get length() {
    return this._array.length;
  }

  get contents() {
    return this._array.slice(); // return copy of array
  }

  contains(item) {
    return this._array.indexOf(item) != -1;
  }

  // containsKey : defined in KeyValueCollection

  get first() {
    return this._array[0];
  }

  get last() {
    return this._array[this._array.length - 1];
  }

  getIndex(i) {
    return this._array[i];
  }

  getIndexRange(i, length) {
    if (!length) {
      return [];
    }
    return this._array.slice(i, i + length);
  }

  find(filterFunc) {
    return this._array.find(filterFunc);
  }

  forEach(func) {
    this._array.forEach((item, index) => func(item, index, this));
  }

  /**
   * Sets the value at index |i|
   * This is similar to array[i]
   *
   * @param key {Integer}
   */
  set(i, item) {
    if (i in this._array && this._array[i] === item) {
      return;
    }
    var oldItem = this._array[i];
    this._array[i] = item;
    if (oldItem !== undefined) {
      this._notifyRemoved([oldItem]);
    }
    if (item !== undefined) {
      this._notifyAdded([item]);
    }
  }

  /**
   * Gets the value at index |i|
   *
   * If the key doesn't exist, returns null.
   * @param key {Integer}
   */
  get(i) {
    assert(typeof (i) == "number");
    return this._array[i];
  }

  removeKey(i) {
    if (!(i in this._array)) {
      return;
    }
    let removedItems = this._array.splice(i, 1); // returns array of one item
    this._notifyRemoved(removedItems);
  }

  getKeyForValue(value) {
    let key = this._array.indexOf(value);
    return key >= 0 ? key : undefined;
  }

  replaceAll(coll) {
    // Start by assuming that all the existing items will be removed.
    let removedItems = this._array;

    if (coll instanceof Collection) {
      this._array = coll.contents;
    } else {
      this._array = coll.slice();
    }
    // Check each of the new items to see whether the array used to have them,
    // so we only notify on the really new items.
    // This also removes them from the array of items to be removed.
    let addedItems = this._array.filter(item => !arrayRemove(removedItems, item));
    if (removedItems.length) {
      this._notifyRemoved(removedItems);
    }
    if (addedItems.length) {
      this._notifyAdded(addedItems);
    }
  }

  ////////////////////////////////////
  // Array compat functions

  [Symbol.iterator]() {
    return this._array.values();
  }

  values() {
    return new ArrayColl([...this._array.values()]);
  }

  keys() {
    return new ArrayColl([...this._array.keys()]);
  }

  entries() {
    return new ArrayColl([...this._array.entries()]);
  }

  every(func) {
    return this._array.every((item, index) => func(item, index, this));
  }

  some(func) {
    return this._array.some((item, index) => func(item, index, this));
  }

  includes(item, start) {
    return this._array.includes(item, start);
  }

  at(pos) {
    if (typeof (this._array.at) == "function") { // Node v14 doesn't support at() yet
      return this._array.at(pos);
    } else {
      return this.get(pos);
    }
  }

  indexOf(item) {
    return this._array.indexOf(item);
  }

  lastIndexOf(item) {
    return this._array.lastIndexOf(item);
  }

  findIndex(filterFunc) {
    return this._array.findIndex((item, index) => filterFunc(item, index, this));
  }

  join(separator) {
    return this._array.join(separator);
  }

  pop() {
    if (!this._array.length) {
      return;
    }
    let removedItem = this._array.pop();
    this._notifyRemoved([removedItem]);
    return removedItem;
  }

  push(...items) {
    this.addAll(items);
    return this.length;
  }

  shift() {
    if (!this._array.length) {
      return;
    }
    let removedItem = this._array.shift();
    this._notifyRemoved([removedItem]);
    return removedItem;
  }

  unshift(...insertItems) {
    let length = this._array.unshift(...insertItems);
    if (insertItems.length) {
      this._notifyAdded(insertItems);
    }
    return length;
  }

  toString() {
    return this._array.toString();
  }

  toLocaleString(locales, options) {
    return this._array.toLocaleString(locales, options);
  }

  static from(...args) {
    return new ArrayColl(Array.from(...args));
  }

  static isArray(array) {
    return Array.isArray(array) || array instanceof ArrayColl;
  }

  static isArrayColl(array) {
    return array instanceof ArrayColl;
  }

  reduce(func, ...initial) {
    return this._array.reduce((acc, item, index) => func(acc, item, index, this), ...initial);
  }

  reduceRight(func, ...initial) {
    return this._array.reduceRight((acc, item, index) => func(acc, item, index, this), ...initial);
  }

  /**
   * Modifies the array in-place, and fires the observers.
   * @returns {ArrayColl} the removed items
   */
  splice(start, deleteCount, ...insertItems) {
    //let removedItems = this._array.slice(start, start + deleteCount);
    //this._array.splice(start, deleteCount, ...insertItems);

    // Uses `arguments` as `deleteCount` may be omitted
    let removedItems = this._array.splice(...arguments);

    if (removedItems.length) {
      this._notifyRemoved(removedItems);
    }
    if (insertItems.length) {
      this._notifyAdded(insertItems);
    }
    return new ArrayColl(removedItems);
  }

  /**
   * Modifies the array in-place, and fires the observers.
   * @returns this
   */
  fill(value, start, end) {
    let removedItems = this._array.slice(start, end);
    let addedItems = removedItems.slice().fill(value);

    this._array.fill(value, start, end);

    if (removedItems.length) {
      this._notifyRemoved(removedItems);
    }
    if (addedItems.length) {
      this._notifyAdded(addedItems);
    }
    return this;
  }

  /**
   * Modifies the array in-place, and fires the observers.
   * @returns this
   */
  copyWithin(target, start, end) {
    let addedItems = this._array.slice(start, end);
    let removedItems = this._array.slice(target, target + addedItems.length);
    addedItems.length = removedItems.length;

    this._array.copyWithin(target, start, end);

    if (removedItems.length) {
      this._notifyRemoved(removedItems);
    }
    if (addedItems.length) {
      this._notifyAdded(addedItems);
    }
    return this;
  }

  slice(start, end) {
    throw "Implemented in transform.js";
  }
  reverse() {
    throw "Implemented in transform.js";
  }
  flat() {
    throw "Implemented in transform.js";
  }
  flatMap(mapFunc) {
    throw "Implemented in transform.js";
  }
}
