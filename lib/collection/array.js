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
    arrayRemove(this._array, item, false);
    this._notifyRemoved([item]);
  }

  _removeWithoutObserver(item) {
    arrayRemove(this._array, item, false);
  }

  addAll(items) {
    this._array.push(...items);
    this._notifyAdded(items);
  }

  removeAll(items) {
    for (let item of items) {
      this._removeWithoutObserver(item);
    }
    this._notifyRemoved(items);
  }

  /**
   * Removes all instances of this item.
   *
   * If you have added the same object 5 times,
   * you need to call remove() 5 times, or removeEach() once,
   * to remove them all.
   */
  removeEach(item) {
    while (this.contains(item)) {
      this.remove(item);
    }
  }

  clear() {
    this._notifyRemoved(this.contents);
    this._array.length = 0;
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
    this._array.forEach(func);
  }

  /**
   * Sets the value at index |i|
   * This is similar to array[i]
   *
   * @param key {Integer}
   */
  set(i, item) {
    assert(typeof (i) == "number");
    if (this._array.length > i && this._array[i] == item) {
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
    var item = this._array[i];
    if (item == undefined) {
      return;
    }
    delete this._array[i];
    this._notifyRemoved([item]);
  }

  getKeyForValue(value) {
    for (var i in this._array) {
      if (this._array[i] == value) {
        return i;
      }
    }
    return undefined;
  }

  replaceAll(coll) {
    // Call observers
    super.replaceAll(coll);

    // Ensure same order and duplicity
    this._array.length = 0;
    if (coll instanceof Collection) {
      coll = coll.contents;
    }
    this._array.push(...coll);
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
    return this._array.every(func);
  }

  some(func) {
    return this._array.some(func);
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
    return this._array.findIndex(filterFunc);
  }

  join(separator) {
    return this._array.join(separator);
  }

  pop() {
    let removedItem = this._array.pop();
    if (removedItem) {
      this._notifyRemoved([removedItem]);
    }
    return removedItem;
  }

  push(...items) {
    this.addAll(items);
    return this.length;
  }

  shift() {
    let removedItem = this._array.shift();
    if (removedItem) {
      this._notifyRemoved([removedItem]);
    }
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

  reduce(func, initial) {
    return this._array.reduce(func, initial);
  }

  reduceRight(func, initial) {
    return this._array.reduceRight(func, initial);
  }

  /**
   * Modifies the array in-place, and fires the observers.
   * @returns {ArrayColl} the removed items
   */
  splice(start, deleteCount, ...insertItems) {
    //let removedItems = this._array.slice(start, start + deleteCount);
    //this._array.splice(start, deleteCount, ...insertItems);

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
    let addedItems = [];
    for (let i = 0; i < removedItems.length; i++) {
      addedItems.push(value);
    }

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
    let removedItems = this._array.slice(target, end - start);

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
    throw "Implemented in array-transform.js";
  }
  reverse() {
    throw "Implemented in array-transform.js";
  }
  flat() {
    throw "Implemented in array-transform.js";
  }
  flatMap(mapFunc) {
    throw "Implemented in array-transform.js";
  }
}
