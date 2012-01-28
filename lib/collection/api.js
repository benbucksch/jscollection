/**
 * This defines the common base API for all collections and operators
 */

const EXPORTED_SYMBOLS = [ "Collection", "CollectionObserver",
    "KeyValueCollection", ];

const util = require("collection/util");

function Collection() {
  this._observers = [];
}
Collection.prototype = {
  _observers : null,

  /**
   * Adds one item to the list
   * @param item {Object} any JS object
   */
  add : function(item) {
    throw "implement";
  },

  /**
   * Removes one item from the list
   * @param item {Object} any JS object
   */
  remove : function(item) {
    throw "implement";
  },

  /**
   * Add all items in |coll| to this list.
   *
   * This is just a convenience function.
   * This adds items statically and does not observe the |coll| changes.
   * Consider using addColl() instead.
   *
   * Note: This is intentionally different from |add| and not
   * overloading |all|.
   * @param coll {Collection or JS Array}
   */
  addAll : function(coll) {
    for each (let item in coll)
      this.add(item);
  },

  /**
   * Removes all items in |coll| from this list
   * @param coll {Collection or JS Array}
   */
  removeAll : function(coll) {
    for each (let item in coll)
      this.add(item);
  },

  /**
   * Removes all items from the list.
   */
  clear : function() {
    throw "implement";
  },

  /**
   * The number of items in this list
   * @returns {Integer} (always >= 0)
   */
  get length() {
    throw "implement";
  },

  /**
   * Whether there are items in this list
   * @returns {Boolean}
   */
  get isEmpty() {
    return this.length == 0;
  },

  /**
   * Checks whether this item is in the list.
   * @returns {Boolean}
   */
  contains : function(item) {
    throw "implement";
  },

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
  contents : function() {
    throw "implement";
  },

  /**
   * Provides an iterator, i.e. allows to write:
   * var coll = new Set();
   * for each (let item in coll)
   *   debug(item);
   *
   * Subclasses may override this with a more
   * efficient implementation. But take care that
   * a remove() during the iteration doesn't confuse it.
   */
  __iterator__ : function() {
    let items = array.contents();
    for (let i = 0; i < items.length; i++)
      yield items[i];
  };


  // Observer

  /**
   * Pass an object that will be called when
   * items are added or removed from this list.
   *
   * If you call this twice for the same observer, the second is a no-op.
   * @param observer {CollectionObserver}
   */
  registerObserver : function(observer) {
    util.assert(observer);
    util.assert(typeof(observer.added) == "function",
        "must implement CollectionObserver");
    if (util.arrayContains(this._observers, observer)
      return;
    this._observers.push(observer);
  },

  /**
   * undo |registerObserver|
   * @param observer {CollectionObserver}
   */
  unregisterObserver : function(observer) {
    util.assert(observer);
    util.assert(typeof(observer.added) == "function",
        "must implement CollectionObserver");
    util.arrayRemove(this._observers, observer, true);
  },

  _notifyAdded : function(item) {
    for each (let observer in this._observers) {
      try {
        observer.added(item, this);
      } catch (e) {
        console.error(e);
      }
    }
  },

  _notifyRemoved : function(item) {
    for each (let observer in this._observers) {
      try {
        observer.removed(item, this);
      } catch (e) {
        console.error(e);
      }
    }
  },
}


/**
 * A collection where entries have a key or label or index.
 * Examples of subclasses: Array (key = index), Map
 */
function KeyValueCollection() {
  Collection.call(this);
}
KeyValueCollection.prototype = {

  /**
   * Sets the value for |key|
   *
   * @param key
   */
  set : function(key, item) {
  },

  /**
   * Gets the value for |key|
   *
   * If the key doesn't exist, returns |undefined|.
   * @param key
   */
  get : function(key) {
    throw "implement";
  },

  /**
   * Remove the key and its corresponding value item.
   *
   * undo set(key, item)
   */
  removeKey : function(key) {
    throw "implement";
  },

  /**
   * @returns {Boolean}
   */
  containsKey : function(key) {
    return this.get(key) != undefined;
  },

  /**
   * Searches the whole list for this |value|.
   * and if found, returns the (first) key for it.
   *
   * If not found, returns undefined.
   * @returns key
   */
  getKeyForValue : function(value) {
  },

}
util.extend(KeyValueCollection, Collection);


/**
 * This listens to changes in the lists, to react on them.
 *
 * This is can be implemented by application code
 * and passed to Collection.registerObserver().
 */
function CollectionObserver() {
  throw "abstract class";
}
CollectionObserver.prototype = {

  /**
   * Called after an item has been added to the list.
   *
   * @param item {Object} the removed item
   * @param coll {Collection} the observed list. convenience only.
   */
  added : function(item, list) {
    throw "implement";
  },

  /**
   * Called after an item has been removed from the list
   *
   * TODO should clear() call removed() for each item?
   * Currently: yes.
   *
   * @param item {Object} the removed item
   * @param coll {Collection} the observed list. convenience only.
   */
  removed : function(item, coll) {
    throw "implement";
  },
}


for each (let symbolName in EXPORTED_SYMBOLS)
  exports[symbolName] = this[symbolName];
