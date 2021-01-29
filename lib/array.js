import { assert } from "./util.js"

/**
 * A |KeyValueCollection| based on a JS Array.
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
    this._notifyAdded([item], this);
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
    _coll_arrayRemove(this._array, item, false);
    this._notifyRemoved([item], this);
  }

  _removeWithoutObserver(item) {
    _coll_arrayRemove(this._array, item, false);
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
    this._notifyRemoved(this.contents, this);
    this._array = [];
  }

  get length() {
    return this._array.length;
  }

  contains(item) {
    return this._array.indexOf(item) != -1;
  }

  // containsKey : defined in KeyValueCollection

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

  /**
   * Sets the value at index |i|
   * This is similar to array[i]
   *
   * @param key {Integer}
   */
  set(i, item) {
    assert(typeof(i) == "number");
    if (this._array.length > i && this._array[i] == item) {
      return;
    }
    var oldItem = this._array[i];
    this._array[i] = item;
    if (oldItem !== undefined) {
      this._notifyRemoved([oldItem], this);
    }
    if (item !== undefined) {
      this._notifyAdded([item], this);
    }
  }

  /**
   * Gets the value at index |i|
   *
   * If the key doesn't exist, returns null.
   * @param key {Integer}
   */
  get(i) {
    assert(typeof(i) == "number");
    return this._array[i];
  }

  removeKey(i) {
    var item = this._array[i];
    if (item == undefined) {
      return;
    }
    delete this._array[i];
    this._notifyRemoved([item], this);
  }

  getKeyForValue(value) {
    for (var i in this._array) {
      if (this._array[i] == value) {
        return i;
      }
    }
    return undefined;
  }
}



/**
 * Removes |element| from |array|.
 * @param array {Array} to be modified. Will be modified in-place.
 * @param element {Object} If |array| has a member that equals |element|,
 *    the array member will be removed.
 * @param all {boolean}
 *     if true: remove all occurences of |element| in |array.
 *     if false: remove only the first hit
 * @returns {Integer} number of hits removed (0, 1 or more)
 */
function _coll_arrayRemove(array, element, all) {
  var found = 0;
  var pos = 0;
  while ((pos = array.indexOf(element, pos)) != -1) {
    array.splice(pos, 1);
    found++
    if ( ! all) {
      return found;
    }
  }
  return found;
}

function _coll_sanitizeString(unchecked) {
  return String(unchecked);
};
