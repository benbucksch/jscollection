import { assert, arrayRemove } from "./util.js"

/**
 * This defines the common base API for all collections and operators
 */
export class Collection {
  constructor() {
    this._observers = [];
    this._svelteObservers = [];
  }

  /**
   * Adds one item to the list
   * @param item {Object} any JS object
   */
  add(item) {
    throw "implement";
  }

  /**
   * Compat with JS `Array`
   */
  push(item) {
    this.add(item);
  }

  /**
   * Removes one item from the list
   * @param item {Object} any JS object
   */
  remove(item) {
    throw "implement";
  }

  /**
   * Add all items in `coll` to this list.
   * This is just a convenience function.
   * This adds items statically and does not observe the `coll` changes.
   * Consider using addColl() instead.
   *
   * Note: This is intentionally not overloading `add`.
   * @param coll {Collection or JS Array}
   */
  addAll(coll) {
    coll.forEach(item => this.add(item));
  }

  /**
   * Removes all items in `coll` from this list
   * @see addAll()
   * @param coll {Collection or JS Array}
   */
  removeAll(coll) {
    coll.forEach(item => this.remove(item));
  }

  /**
   * Removes all items from the list.
   */
  clear() {
    throw "implement";
  }

  /**
   * The number of items in this list
   * @returns {Integer} (always >= 0)
   */
  get length() {
    throw "implement";
  }

  /**
   * Whether there are items in this list
   * @returns {Boolean}
   */
  get isEmpty() {
    return this.length == 0;
  }

  /**
   * Checks whether this item is in the list.
   * @returns {Boolean}
   */
  contains(item) {
    return this.contents.indexOf(item) != -1;
  }

  /**
   * Returns all items contained in this list,
   * as a new JS array (so calling this can be expensive).
   *
   * If the list is ordered, the result of this function
   * is ordered in the same way.
   *
   * While the returned array is a copy, the items
   * are not, so changes to the array do not affect
   * the list, but changes to its items do change the
   * items in the list.
   *
   * @returns {Array} new JS array with all items
   */
  get contents() {
    throw "implement";
  }

  /**
   * Convenience function for Svelte.
   * Needed, because Svelte doesn't use iterators.
   *
   * E.g. `{#each $coll.each as item}`
   */
  get each() {
    return this.contents;
  }

  /**
   * The first item in the list
   * @returns {Object}
   * null, if the list is empty
   */
  get first() {
    throw "implement";
  }

  /**
   * The item at the nth position in the list
   * @returns {Object}
   * null, if the list is empty
   */
  getIndex(i) {
    throw "implement";
  }

  /**
   * `len` number of items, starting from the nth position in the list
   * @returns {Array of Object}
   * null, if the list is empty
   */
  getIndexRange(i, length) {
    throw "implement";
  }



  forEach(callback) {
    this.contents.forEach(callback);
  }

  /**
   * Provides an iterator, i.e. allows to write:
   * var coll = new SetColl();
   * for (let item of coll) {
   *   debug(item);
   * }
   *
   * Subclasses may override this with a more
   * efficient implementation. But take care that
   * a `remove()` during the iteration doesn't confuse it.
   */
  [Symbol.iterator]() {
    let array = this.contents;
    let i = 0;
    return {
      next: () => {
        if (i >= array.length) {
          return { done: true };
        }
        return { value: array[i++], done: false };
      }
    }
  }
  /*
  iterator: function*() {
    var items = this.contents;
    for (var i = 0; i < items.length; i++) {
      yield items[i];
    }
  }*/

  /**
   * @returns first matching item or `undefined`
   */
  find(filterFunc) {
    var result = undefined;
    this.forEach(item => {
      if ( !result && filterFunc(item)) {
        result = item;
      }
    });
    return result;
  }


  // Convenience methods for operators

  /**
   * @param filterFunc {Function(item)}
   * @returns {Array of items} where `filterFunc` returned `true`
   */
  filter(filterFunc) {
    throw "Overwritten in operators";
  }

  map(mapFunc) {
    throw "Overwritten in operators";
  }

  /**
   * operator +
   * Returns a collection that contains all values from both collections.
   * If the same item is in both collections, it will be added twice.
   * The result is simply `otherColl` appended to `this`.
   * @param otherColl {Collection}
   * @returns {Collection} Preserves order.
   */
  concat(otherColl) {
    throw "Overwritten in operators";
  }

  /**
   * operator +
   * [Union](http://en.wikipedia.org/wiki/Union_(set_theory))
   * Returns a collection that contains all values from both collections.
   * If the same item is in both collections, it will be added only once.
   * @param otherColl {Collection}
   * @returns {Collection} Does not preserve order.
   */
  merge(otherColl) {
    throw "Overwritten in operators";
  }

  /**
   * operator -
   * [Set difference](http://en.wikipedia.org/wiki/Set_difference)
   * Returns a collection that contains all values from `this`, apart from those in collSubtract.
   * @param collSubtract {Collection}
   * @returns {Collection} Preserves order of collBase.
   */
  subtract(collSubtract) {
    throw "Overwritten in operators";
  }

  /**
   * operator &
   * [Intersection](http://en.wikipedia.org/wiki/Intersection_(set_theory))
   * Returns a collection that contains the values that are contained
   * in *both* collections, and only those.
   * @param otherColl {Collection}
   * @returns {Collection} Does not preserve order.
   */
  inCommon(otherColl) {
    throw "Overwritten in operators";
  }

  /**
   * operator xor
   * [Symmetric difference](http://en.wikipedia.org/wiki/Symmetric_difference)
   * Returns a collection that contains all values that are contained only in `this` or in `otherColl`, but not in both.
   * @param otherColl {Collection}
   * @returns {Collection} Does not preserve order.
   */
  notInCommon(otherColl) {
    throw "Overwritten in operators";
  }

  /**
   * @param sortFunc {Function(itemA, itemB): boolean} @see SortedCollection
   * @returns {Array of items} sorted by `sortFunc`
   */
  sort(sortFunc) {
    throw "Overwritten in operators";
  }



  // Observer

  /**
   * Pass an object that will be called when
   * items are added or removed from this list.
   *
   * If you call this twice for the same observer, the second is a no-op.
   * @param observer {CollectionObserver}
   */
  registerObserver(observer) {
    assert(observer);
    assert(typeof(observer.added) == "function",
        "must implement CollectionObserver");
    if (this._observers.indexOf(observer) != -1) { // already contains it
      return;
    }
    this._observers.push(observer);
  }

  /**
   * undo `registerObserver`
   * @param observer {CollectionObserver}
   */
  unregisterObserver(observer) {
    assert(observer);
    assert(typeof(observer.added) == "function" &&
           typeof(observer.removed) == "function",
        "must implement CollectionObserver");
    arrayRemove(this._observers, observer, true);
  }

  _notifyAdded(items) {
    this._observers.forEach(observer => {
      try {
        observer.added(items, this);
      } catch (e) {
        console.error(e);
      }
    });
    this._notifyChanged();
  }

  _notifyRemoved(items) {
    this._observers.forEach(observer => {
      try {
        observer.removed(items, this);
      } catch (e) {
        console.error(e);
      }
    });
    this._notifyChanged();
  }

  // Svelte subscribe() API

  _notifyChanged() {
    this._svelteObservers.forEach(observer => {
      try {
        observer(this);
      } catch (e) {
        console.error(e);
      }
    });
  }

  subscribe(observer) {
    assert(typeof(observer) == "function", "Need a function");
    this._svelteObservers.push(observer);
    // Per Svelte API, call the observer immediately after subscribe()
    try {
      observer(this);
    } catch (ex) {
      console.error(ex);
    }
    return () => { // unsubscribe
      arrayRemove(this._svelteObservers, observer);
    }
  }
}


/**
 * A collection where entries have a key or label or index.
 * Examples of subclasses: ArrayColl (key = index), MapColl
 */
export class KeyValueCollection extends Collection {
  constructor() {
    super();
  }

  /**
   * Sets the value for `key`
   *
   * @param key
   */
  set(key, item) {
  }

  /**
   * Gets the value for `key`
   *
   * If the key doesn't exist, returns `undefined`.
   * @param key
   */
  get(key) {
    throw "implement";
  }

  /**
   * Remove the key and its corresponding value item.
   *
   * undo set(key, item)
   */
  removeKey(key) {
    throw "implement";
  }

  /**
   * @returns {Boolean}
   */
  containsKey(key) {
    return this.get(key) != undefined;
  }

  /**
   * Searches the whole list for this `value`.
   * and if found, returns the (first) key for it.
   *
   * If not found, returns undefined.
   * @returns key
   */
  getKeyForValue(value) {
  }
}


/**
 * This listens to changes in the lists, to react on them.
 *
 * This is can be implemented by application code
 * and passed to Collection.registerObserver().
 *
 * Abstract class
 */
export class CollectionObserver {
  constructor() {
  }

  /**
   * Called after an item has been added to the list.
   *
   * @param items {Array of Object} the added item
   * @param coll {Collection} the observed list. convenience only.
   */
  added(items, coll) {
    throw "implement";
  }

  /**
   * Called after an item has been removed from the list
   *
   * @param items {Array of Object} the removed item
   * @param coll {Collection} the observed list. convenience only.
   */
  removed(items, coll) {
    throw "implement";
  }
}
