import { WeakSetIterable } from "./collection/weakset.js";
import { assert } from "./util.js";

/**
 * This defines the common base API for all collections and operators
 */
export class Collection {
  constructor() {
    this._observers = new WeakSetIterable();
    this._svelteObservers = new WeakSetIterable();
  }

  /**
   * Adds one item to the collection.
   * @param item {Object} any JS object
   */
  add(item) {
    throw "implement";
  }

  /**
   * Removes one item from the collection.
   * @param item {Object} any JS object
   */
  remove(item) {
    throw "implement";
  }

  /**
   * Appends all items in `coll` to this collection.
   *
   * Should call the observers only once for all these items.
   *
   * @example
   * ```js
   * coll.addAll([ a, b, c, d ]);
   * ```
   *
   * Note: If `coll` is a Collection and you want later
   * additions to `coll` to be added to the result as well,
   * then use `concat()` or merge()`.
   * In contrast, `addAll()` does a one-time append to this collection.
   * @see concat()
   * @see merge()
   *
   * @param coll {Collection or JS Array} What to add to the collection.
   * This may be a JS Array or a Collection.
   *
   * Note: This is intentionally not overloading `add()`.
   */
  addAll(coll) {
    for (let item of coll) {
      this.add(item)
    }
  }

  /**
   * Removes all items in `coll` from this collection.
   *
   * Should call the observers only once for all these items.
   *
   * @example
   * ```js
   * coll.addAll([ a, b, c, d ]);
   * ```
   *
   * @see addAll()
   * @see subtract()
   *
   * @param coll {Collection or JS Array} What to remove from the collection.
   * This may be a JS Array or a Collection.
   */
  removeAll(coll) {
    for (let item of coll) {
      this.remove(item)
    }
  }

  /**
   * Makes `coll` the new content of this collection.
   *
   * Calls the added() and removed() observers only for those items
   * which are different before/after.
   * TODO Ensure same duplicity and order, even for downstream operators
   *
   * @example
   * ```js
   * let coll = new ArrayColl([ a, b, c, d ]);
   * coll.replaceAll([ b, c, d, e ]);
   * ... calls ...
   * observer.removed([ a ]);
   * observer.added([ e ]);
   * ```
   *
   * @param coll {Collection or JS Array} The new entire contents
   * This may be a JS Array or a Collection.
   */
  replaceAll(coll) {
    let added = [];
    let removed = [];
    for (let item of coll) {
      if (!this.includes(item)) {
        added.push(item);
      }
    }
    for (let item of this) {
      if (!coll.includes(item)) {
        removed.push(item);
      }
    }
    this.removeAll(removed);
    this.addAll(added);
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
   * @returns {Boolean} true, if there are no items
   */
  get isEmpty() {
    return this.length == 0;
  }

  /**
   * Whether there are items in this list
   * @returns {Boolean} true, if there are items
   */
  get hasItems() {
    return !this.isEmpty;
  }

  /**
   * Checks whether this item is in the list.
   * @returns {Boolean}
   */
  contains(item) {
    return this.contents.includes(item);
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
   * Needed only because Svelte doesn't use iterators.
   * @example
   * Intended to be used with Svelte, e.g.
   * ```
   * {#each $coll.each as item (item.id)}
   * ```
   * @returns a copy of the collection contents as JS Array.
   */
  get each() {
    return this.contents;
  }

  /**
   * The first item in the list
   *
   * Implementation: Fast for ArrayColl, but slow for MapColl, SetColl and
   * result collections like mergeColl.
   * @returns {Object}
   * null, if the list is empty
   */
  get first() {
    return this.contents[0];
  }

  /**
   * The last item in the list
   *
   * Implementation: Fast for ArrayColl, but slow for MapColl, SetColl and
   * result collections like mergeColl.
   * @returns {Object}
   * null, if the list is empty
   */
  get last() {
    return this.contents[this.length - 1];
  }

  /**
   * The item at the nth position in the list
   *
   * Implementation: Fast for ArrayColl, but slow for MapColl, SetColl and
   * result collections like mergeColl. Do not use it in a loop for such colls.
   * Instead, use forEach() etc.
   * @returns {Object}
   * null, if the list is empty
   */
  getIndex(i) {
    return this.contents[i];
  }

  /**
   * `len` number of items, starting from the nth position in the list
   * @returns {Array of Object}
   * null, if the list is empty
   */
  getIndexRange(i, length) {
    if (!length) {
      return [];
    }
    return this.contents.slice(i, i + length);
  }

  /**
   * Calls the callback for each item in the collection individually.
   * @param func {Function(item)}
   */
  forEach(func) {
    this.contents.forEach((item, index) => func(item, index, this));
  }

  /**
   * Provides an iterator, i.e. allows to write:
   * var coll = new SetColl();
   * for (let item of coll) {
   *   debug(item);
   * }
   *
   * Subclasses should override this with a more
   * efficient implementation that supports
   * a `remove()` during the iteration.
   */
  [Symbol.iterator]() {
    return this.contents.values();
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
    this.forEach((item, index) => {
      if (!result && filterFunc(item, index, this)) {
        result = item;
      }
    });
    return result;
  }


  // Convenience methods for operators

  /**
   * Creates a new collection which contains only those items that meet a certain condition.
   * You define that condition by returning true from your `filterFunc`.
   *
   * It's not observing the source collection. Use this for one-off calculations,
   * where you don't keep the filtered result around.
   *
   * @param filterFunc A function that accepts up to three arguments. The filter method calls the `filterFunc` function one time for each element in the collection.
   */
  filterOnce(filterFunc) {
    throw "Overwritten in operators";
  }
  /**
   * Returns a subset of the source collection.
   * Which items will be included is defined by `filterFunc`.
   * This works like `Array.filter()`.
   *
   * It's observable, i.e. if the source collection changed and `filterFunc` matches,
   * items will be added and the observers called.
   *
   * It's also observing. It will observe all items.
   * If their properties change and the item now matches or
   * nor longer matches, it will be added to or removed from the filtered result.
   *
   * Implementation note:
   * This works only 1 level deep, i.e. only direct properties of the added items
   * are observed, not when the item references another item and the
   * condition depends on that. This limitation should be lifted some time, so
   * don't depend on this *not* working, either.
   *
   * @param filterFunc {Function(item)}
   *     `item` will be included in FilteredCollection, (only) if `true` is returned
   */
  filterObservable(filterFunc) {
    throw "Overwritten in operators";
  }
  /**
   * Creates a new collection which contains only those items that meet a certain condition.
   * You define that condition by returning true from your `filterFunc`.
   *
   * Once items are later added or removed from the source collections, they will also be added/removed accordingly to the result collection, as long as the collection lives.
   *
   * @deprecated
   * However, if any of the items change their properties and are now
   * matching or not matching anymore, the result will *not* change.
   *
   * @param filterFunc A function that accepts up to three arguments. The filter method calls the `filterFunc` function one time for each element in the collection.
   */
  filter(filterFunc) {
    throw "Overwritten in operators";
  }

  /**
   * Creates a new collection which contains other objects that are derived from the items in this collection.
   * You create them with the return value of your `mapFunc`.
   *
   * Calls the `mapFunc` callback function on each element of the collection, and returns a new observable collection that contains the results.
   *
   * Once items are later added or removed from the source collections, they will also be added/removed accordingly to the result collection, as long as the collection lives.
   *
   * @param filterFunc {Function(item)}
   * @returns {Collection} where `filterFunc` returned `true`
   */
  map(mapFunc) {
    throw "Overwritten in operators";
  }

  /**
   * operator +
   * Combines two collections, by appending the another colleciton.
   * Returns a collection that contains all values from both collections.
   * Duplicates are allowed. If the same item is in both collections, it will be added twice.
   *
   * Once items are later added or removed from the source collections, they will also be added/removed accordingly to the result collection, as long as the collection lives.
   *
   * @see merge() if you do not want duplicates
   *
   * @param {Collection} otherColl Additional items from another collection to add to the end of the collection.
   * @returns {Collection} A new collection which contains the items of both source collections. Preserves order.
   */
  concat(otherColl) {
    throw "Overwritten in operators";
  }

  /**
   * Combines two collections, by merging the items, without duplicates.
   * Returns a collection that contains all values from both collections.
   * If the same item is in both collections, it will appear only once in the result colleciton.
   *
   * Once items are later added or removed from the source collections, they will also be added/removed accordingly to the result collection, as long as the collection lives.
   *
   * [Union](http://en.wikipedia.org/wiki/Union_(set_theory))
   *
   * Once items are later added or removed from the source collections, they will also be added/removed accordingly to the result collection, as long as the collection lives.
   *
   * @see concat() if you want a simple append with duplicates
   *
   * @param {Collection} otherColl Additional items from another collection to add to the collection.
   * @returns {Collection} A new collection which contains the items of both source collections. Does not preserve order.
   */
  merge(otherColl) {
    throw "Overwritten in operators";
  }

  /**
   * operator -
   * Returns a collection that contains all values from `this`, apart from those in collSubtract.
   *
   * [Set difference](http://en.wikipedia.org/wiki/Set_difference)
   *
   * Once items are later added or removed from the source collections, they will also be added/removed accordingly to the result collection, as long as the collection lives.
   *
   * @param collSubtract {Collection}
   * @returns {Collection} Preserves order of collBase.
   */
  subtract(collSubtract) {
    throw "Overwritten in operators";
  }

  /**
   * operator &
   * Returns a collection that contains the values that are contained
   * in *both* collections, and only those.
   *
   * [Intersection](http://en.wikipedia.org/wiki/Intersection_(set_theory))
   *
   * Once items are later added or removed from the source collections, they will also be added/removed accordingly to the result collection, as long as the collection lives.
   *
   * @param otherColl {Collection}
   * @returns {Collection} Does not preserve order.
   */
  inCommon(otherColl) {
    throw "Overwritten in operators";
  }

  /**
   * operator xor
   * Returns a collection that contains all values that are contained only in `this` or in `otherColl`, but not in both.
   *
   * [Symmetric difference](http://en.wikipedia.org/wiki/Symmetric_difference)
   *
   * @param otherColl {Collection}
   * @returns {Collection} Does not preserve order.
   */
  notInCommon(otherColl) {
    throw "Overwritten in operators";
  }

  /**
   * Sorts the items in the collection based on your `sortFunc` and returns a new sorted collection.
   *
   * Once items are later added or removed from the source collections, they will also be added/removed accordingly to the result collection, as long as the collection lives.
   * Unlike JS Array sort(), does not change the source collection in-place, but returns a new collection.
   *
   * @example
   * ```ts
   * new ArrayColl([11,2,22,1]).sort((a, b) => a < b)
   * ```
   *
   * @param sortFunc {Function(itemA, itemB): boolean}
   *   Should return true, if itemA < itemB
   *   Unlike JS Array sort(), the `sortFunc` returns boolean instead of -1/0/1.
   *   @see SortedCollection
   * @returns {Collection} sorted by `sortFunc`
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
    assert(typeof (observer.added) == "function",
      "must implement CollectionObserver");
    this._observers.add(observer);
  }

  /**
   * Undo `registerObserver`
   * @param observer {CollectionObserver}
   */
  unregisterObserver(observer) {
    assert(observer);
    assert(typeof (observer.added) == "function" &&
      typeof (observer.removed) == "function",
      "must implement CollectionObserver");
    this._observers.delete(observer);
  }

  _notifyAdded(items) {
    for (let observer of this._observers) {
      try {
        observer.added(items, this);
      } catch (ex) {
        console.error(ex);
      }
    }
    this._notifySvelteOfChanges();
  }

  _notifyRemoved(items) {
    for (let observer of this._observers) {
      try {
        observer.removed(items, this);
      } catch (ex) {
        console.error(ex);
      }
    }
    this._notifySvelteOfChanges();
  }

  // Svelte subscribe() API

  _notifySvelteOfChanges() {
    for (let observer of this._svelteObservers) {
      try {
        observer(this);
      } catch (ex) {
        console.error(ex);
      }
    }
  }

  /**
   * Svelte subscribe() API.
   * Svelte will call this to be informed of changes in the collection,
   * and then re-render the corresponding UI portion.
   * You just need to prepend `$` before the variable name to
   * let Svelte subscribe to it.
   * @example
   * ```
   * {#each $coll.each as project (project.id)}
   *   <Project {project} />
   * {/each}
   * ```
   * This `$` lets Svelte `subscribe()` to changes in `coll`,
   * and will re-render the `<Project>`s as needed,
   * once there are new or removed items in the collection.
   */
  subscribe(observer) {
    assert(typeof (observer) == "function", "Need a function");
    this._svelteObservers.add(observer);
    // Per Svelte API, call the observer immediately after subscribe()
    try {
      observer(this);
    } catch (ex) {
      console.error(ex);
    }
    return () => { // unsubscribe
      this._svelteObservers.delete(observer);
    }
  }
  // Aliases for compat with JS Array.

  /**
   * Alias for add().
   */
  push(item) {
    this.add(item);
  }

  /**
   * Alias for contains().
   */
  includes(item) {
    return this.contains(item);
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
   * @param key {number or string}
   * @param item {any}
   */
  set(key, item) {
  }

  /**
   * Gets the value for `key`
   *
   * If the key doesn't exist, returns `undefined`.
   * @param key {number or string}
   * @returns {any}
   */
  get(key) {
    throw "implement";
  }

  /**
   * Remove the key and its corresponding value item.
   *
   * undo set(key, item)
   * @param key {number or string}
   */
  removeKey(key) {
    throw "implement";
  }

  /**
   * @param key {number or string}
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
   * @param item {any}
   * @returns key
   */
  getKeyForValue(item) {
  }

  /**
   * Remove the value and its corresponding key.
   *
   * undo set(key, item)
   * @param value {any}
   */
  removeValue(value) {
    this.removeKey(this.getKeyForValue(value));
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
