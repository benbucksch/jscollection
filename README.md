Author: Ben Bucksch

= JavaScript Collections =

This describes a future module that will have a coherent set of collection/list classes

This is mostly about 3 aspects:
* A common API for various collection types (array, set, map, OrderedMap etc.), similar to java.util.Collection.
* observers to notify about changes
* operators for whole lists, like concat, merge, substract, intersect etc.

The real value comes from being a coherent API and base functionality that can be used in other APIs, and these other APIs are fitting together naturally. If each API uses a slightly different API to add/remove items, not only does the programmer have to learn each API, but he also has to do the plumbing between the components all manually. This gets particularly tedious as there need to be dynamic updates from one component to another, e.g. data to UI or pref dialog to main UI. The advantage here is that this is a powerful, yet lean system to plug modules together with custom operators in between. Basically LEGO Technic.

= Functionality =

* Base API implemented by all collections
** similar to java.util.Collection probably
** with observers to allow you to subscribe to changes and be notified when items are added or remoted
** Ability to specify identity and sorting for items, e.g. "if |id| property matches, it's the same item" and "sort on |name| property" or "if a.name > b.name, then a > b"
* Operators on the collections
** Operate on whole lists, e.g. allItems = add(serverItems, localItems);
** Update result dynamically using observers
** add, merge
** subtract
** in common, not in common
** sort
* Some basic collection implementations
** Array - ordered list of items, integer-indexed - based on JS Array
** Map - key/value pair - based on JS Object properties
** OrderedMap - allows fast lookup
** Set
** OrderedMap
** Others can live in third-party modules, but if they adhere to the common APi, they would fit in nicely
* UI
** (Not part of this module, but a use of it)
** Listbox, tree node childred etc. all could accept such lists
** E.g. listbox.showList(allItems)
** Dynamically adapting UI without extra work: Thanks to observers, the UI updates automatically based on changes of the underlying list.
** The API of the UI then wouldn't need "add/remoteItem" functions itself.
* Other classes
** Pretty much anything that takes a list in Jetpack could be using this API, at least optionally.

= Example =

Show only those server items which are not in local items, i.e. only offer new stuff

 var serverItems = new JArray();
 serverItems.add(itemA);
 serverItems.add(itemB);
 var localItems = listAllMyItems(path);
 var offerItems = subtract(serverItems, localItems);
 var listbox = E(&quot;itemsList&quot;);
 listbox.showList(offerItems);

That's all already. Now, when items are added to serverItems, they automatically appear in the list UI (without any further app code), *unless* they are in localItems.

That's because the subtract operator automatically subscribed to changes in serverItems. If you then later do serverItems.add(itemC), the subtract operator would check whether the same items is in localItem, and only if it's not, it would add it to offerItems. listbox.showList() in turn automatically subscribed to changes in offerItems, gets notified about the new item there, and shows it. All of that would happen just with the above code lines, there is no additional code needed to follow updates.

Of course, if you wanted to show both serverItems and localItems in the UI, you would do |add()| instead of |substract()|.

This means that you don't need additional wiring to make the UI update after the user (or server) did add/remove item actions, you only need to update the underlying lists.

= API =

The classes are standing alone, they do not change JS Array or Object types.

(extract, full docs will be in module)

== Collection ==

Base class for all lists.

   * Adds one item to the list
   * @param item {Object} any JS object
  add : function(item)
  
   * Removes one item from the list
   * @param item {Object} any JS object
  remove : function(item)
  
   * Add all items in |coll| to this list.
   * This is just a convenience function.
   * This adds items statically and does not observe the |coll| changes.
   * Consider using addColl() instead.
   * Note: This is intentionally not overloading |add|.
   * @param coll {Collection or JS Array}
  addAll : function(coll)
  
   * Removes all items in |coll| from this list
   * @param coll {Collection or JS Array}
  removeAll : function(coll)
  
   * Removes all items from the list.
  clear : function()
  
   * The number of items in this list
   * @returns {Integer} (always >= 0)
  get length()
  
   * Whether there are items in this list
   * @returns {Boolean}
  get isEmpty()
  
   * Checks whether this item is in the list.
   * @returns {Boolean}
  contains : function(item)
  
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
  contents : function()
  
   * Provides an iterator, i.e. allows to write:
   * var coll = new Set();
   * for each (let item in coll)
   *   debug(item);
  __iterator__ : function()
  
   * Pass an object that will be called when
   * items are added or removed from this list.
   * If you call this twice for the same observer, the second is a no-op.
   * @param observer {CollectionObserver}
  registerObserver : function(observer)
  
   * undo |registerObserver|
   * @param observer {CollectionObserver}
  unregisterObserver : function(observer)

== KeyValueCollection ==

A collection where entries have a key or label or index.

Examples of subclasses: Array (key = index), Map

   * Sets the value for |key|
   * @param key
  set : function(key, item)
  
   * Gets the value for |key|
   * If the key doesn't exist, returns |undefined|.
   * @param key
  get : function(key)
  
   * Remove the key and its corresponding value item.
   * undo set(key, item)
  removeKey : function(key)
  
   * @returns {Boolean}
  containsKey : function(key)
  
   * Searches the whole list for this |value|.
   * and if found, returns the (first) key for it.
   * If not found, returns undefined.
   * @returns key
  getKeyForValue : function(value)

== CollectionObserver ==

   * Called after an item has been added to the list.
   * @param item {Object} the removed item
   * @param coll {Collection} the observed list. convenience only.
  added : function(item, list)
  
   * Called after an item has been removed from the list
   *
   * TODO should clear() call removed() for each item?
   * Currently: yes.
   * Alternative: separate cleared()
   *
   * @param item {Object} the removed item
   * @param coll {Collection} the observed list. convenience only.
  removed : function(item, coll)

== Operators ==

add, subtract, and, xor (compare [http://en.wikipedia.org/wiki/Set_theory Set theory]) and sort

All operators observe the original collections they are constructed from, and adapt the result based on changes, and notify any observers that are registered on the operator result collection.

   * operator +
   * Returns a collection that contains all values from coll1 and coll2.
   * If the same item is in both coll1 and coll2, it will be added only once.
   *
   * [http://en.wikipedia.org/wiki/Union_(set_theory) Union]
   *
   * @param coll1 {Collection}
   * @param coll2 {Collection}
   * @returns {Collection}
   *     Does not preserve order.
  function mergeColl(coll1, coll2)
  
   * operator +
   * Returns a collection that contains all values from coll1 and coll2.
   * If the same item is in both coll1 and coll2, it will be added twice.
   * The result is simply coll2 appended to coll1.
   *
   * @param coll1 {Collection}
   * @param coll2 {Collection}
   * @returns {Collection}
   *     Preserves order
  function concatColl(coll1, coll2)
  
   * operator -
   * Returns a collection that contains all values from collBase,
   * apart from those in collSubtract.
   *
   * [http://en.wikipedia.org/wiki/Set_difference Set difference]
   *
   * @param collBase {Collection}
   * @param collSubtract {Collection}
   * @returns {Collection}
   *     Preserves order of collBase.
  function subtractColl(collBase, collSubtract)
  
   * operator &
   * Returns a collection that contains all values that are contained
   * in *both* coll1 and coll1.
   *
   * [http://en.wikipedia.org/wiki/Intersection_(set_theory) Intersection]
   *
   * @param coll1 {Collection}
   * @param coll2 {Collection}
   * @returns {Collection}
   *     Does not preserve order.
  function inCommonColl(coll1, coll2)
  
   * operator xor
   * Returns a collection that contains all values that are contained
   * only in coll1 or coll2, but not in both.
   *
   * [http://en.wikipedia.org/wiki/Symmetric_difference Symmetric difference]
   *
   * @param coll1 {Collection}
   * @param coll2 {Collection}
   * @returns {Collection}
   *     Does not preserve order.
  function notInCommonColl(coll1, coll2)
  
   * Returns a new collection that is sorted based on the |sortFunc|.
   *
   * @param coll {Collection}
   * @param sortFunc(a {Item}, b {Item})
   *     returns {Boolean} a > b
   * @returns {Collection}
  function sortColl(coll, sortFunc)

= Implementation =

DONE
* Ben Bucksch provided API, base implementation, Array, Set, and operators

TODO
* Ben will implement Map and sortColl()
* M.-A. Darche will provide OrderedMap and possibly OrderedSet
* Others are welcome to make UI elements support these collections.
* The code will be documented using the [http://code.google.com/intl/en/closure/compiler/docs/js-for-compiler.html JSDoc conventions].

Code / download
* git clone http://git.beonex.com/jetpack/collection/ (there is no web frontend, but git clone works)
* [https://bugzilla.mozilla.org/show_bug.cgi?id=722597 Bug 722597]

= Feedback needed =

== Comparison of items ==
How to specify identity and sorting for items, e.g. "if |id| property matches, it's the same item" and "sort on |name| property" or "if a.name > b.name, then a > b"

Options:
* base class for items -- convenient, but doesn't allow to collect objects not supporting this API, also doesn't allow to specify different sorting based on situation
* Operators and Set and Ordered* collections take functions that can compare the objects -- cumbersome, because it needs to be specified for every use

* specify id and sortBy properties or -- more convenient
* specify isSameObject() and isGreaterThan() functions - more flexible

== Naming ==
The [https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Set Set] object is available in future versions of Firefox and thus this name should not be used.

== Compatibiltiy ==
* What should be the [http://robertnyman.com/javascript/ JavaScript version and features] this module relies on? Relying on JavaScript 1.6 would make it possible to use the JavaScript Collections with Google Chrome V8 JavaScript engine as well and thus the JavaScript Collections module would be useful for more people for more context, and a developer using the JavaScript Collections for Jetpack could use it as-is on many other web projects. That would ease many developers' life.

== weak references ==
* Leveraging [https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/WeakMap WeakMap] (available since Firefox 6 and should be available in Google Chrome 18) should be considered.

