Author: Ben Bucksch

JavaScript Collections
===================

JS Collections provides a coherent set of collection/list classes. They form a powerful, yet lean system to design component APIs and plug different modules together between backend logic and UI. Like LEGO Technic. It simplifes application code with list operators and automatic updates.

This is mostly about 3 aspects:
* A *common API* for various collection types (array, set, map, OrderedMap etc.), similar to java.util.Collection.
* *observers* to notify about changes, allowing automatic updates
* *operators* for whole lists, like concat, merge, substract, intersect etc..

These aspects work together: Operation results are observable and change when the operand collections change. Operations can be chained. All collection types support all operations.

The real value comes from a coherent API and base functionality that can be used in other APIs.  It removes the need for getItemList(), addItem()/removeItem(), addObserver()/removeObserver(), load(callback) functions in your API, and allows modules to work together. If each API uses a slightly different API to add/remove items, not only does the programmer have to learn each API, but he also has to do the plumbing between the components all manually. This gets particularly tedious as there need to be dynamic updates from one component to another, e.g. data to UI or pref dialog to main UI.

Example
=======

Show only those server items which are not in local items, i.e. only offer new stuff

    var serverItems = new ArrayColl([ itemA, itemB ]);
    var localItems = getAllLocalItems(path);
    var offerItems = serverItems.subtract(localItems);
    var listbox = E("itemsList");
    listbox.showList(offerItems);

That's all already. Now, when items are added to serverItems, they automatically appear in the list UI (without any further app code), *unless* they are in localItems.

That's because the subtract operator automatically subscribed to changes in serverItems. If you then later do serverItems.add(itemC), the subtract operator would check whether the same items is in localItem, and only if it's not, it would add it to offerItems. listbox.showList() in turn automatically subscribed to changes in offerItems, gets notified about the new item there, and shows it. All of that would happen just with the above code lines, there is no additional code needed to follow updates.

Of course, if you wanted to show both serverItems and localItems in the UI, you would do |add()| instead of |substract()|.

This means that you don't need additional wiring to make the UI update after the user (or server) did add/remove item actions, you only need to update the underlying lists.

Functionality
============

* Base API implemented by all collections
  * similar to java.util.Collection probably
  * with observers to allow you to subscribe to changes and be notified when items are added or remoted
  * Ability to specify identity and sorting for items, e.g. "if |id| property matches, it's the same item" and "sort on |name| property" or "if a.name > b.name, then a > b"
* Operators on the collections
  * Operate on whole lists, e.g. allItems = add(serverItems, localItems);
  * Update result dynamically using observers
  * add, merge
  * subtract
  * in common, not in common
  * sort
* Some basic collection implementations
  * Array - ordered list of items, integer-indexed - based on JS Array
  * Map - key/value pair - based on JS Object properties
  * OrderedMap - allows fast lookup
  * Set
  * OrderedMap
  * Others can live in third-party modules, but if they adhere to the common APi, they would fit in nicely
* UI
  * (Not part of this module, but a use of it)
  * Listbox, tree node childred etc. all could accept such lists
  * E.g. listbox.showList(allItems)
  * Dynamically adapting UI without extra work: Thanks to observers, the UI updates automatically based on changes of the underlying list.
  * The API of the UI then wouldn't need "add/remoteItem" functions itself.
* Other classes
  * Pretty much anything that takes a list in Jetpack could be using this API, at least optionally.

API
===

The classes are standing alone, they do not change JS Array or Object types.

(extract, full docs will be in module)

Collection
-----------

Base class for all lists.

##### `add(item)`
  * Adds one item to the list
  * @param item {Object} any JS object
  
##### `remove(item)`
  * Removes one item from the list
  * @param item {Object} any JS object
  
##### `addAll(coll)`
  * Add all items in |coll| to this list.
  * This is just a convenience function.
  * This adds items statically and does not observe the |coll| changes.
  * Consider using addColl() instead.
  * Note: This is intentionally not overloading |add|.
  * @param coll {Collection or JS Array}
  
##### `removeAll(coll)`
  * Removes all items in |coll| from this list
  * @param coll {Collection or JS Array}
  
##### `clear()`
  * Removes all items from the list.
  
##### `get length()`
  * The number of items in this list
  * @returns {Integer} (always >= 0)
  
##### `get isEmpty()`
  * Whether there are items in this list
  * @returns {Boolean}
  
##### `contains(item)`
  * Checks whether this item is in the list.
  * @returns {Boolean}
  
##### `contents()`
  * Returns all items contained in this list, as a new JS array (so calling this can be expensive).
  * If the list is ordered, the result of this function is ordered in the same way.
  * While the returned array is a copy, the items are not, so changes to the array do not affect the list, but changes to its items do change the items in the list.
  * @returns {Array} new JS array with all items

##### `forEach(func)`
  * Iterates over all items in the list.
  * @returns {Boolean}

##### `filter(filterFunc)`
  * Returns a new observable collection with all matching items.
  * The result will be dynamically updated as the source collection changes.
  * @param filterCallback {Function(item)}
  * @returns {Collection of items} where |filterFunc| returned |true|

##### `find(filterFunc)`
  * Returns the first matching item.
  * @param filterCallback {Function(item)}
  * @returns {Object} for which |filterFunc| returned |true|

##### `map(mapFunc)`
  * For each item in the source collection, return a corresponding other item
  * as determined by |mapFunc|.
  * The result is an observable collection and will be dynamically updated
  * as the source collection changes.
  * @returns {Collection of Object} whereby {Object} is the result of |mapFunc()|

##### `concat(otherColl)`
  * operator +
  * @see concatColl()

##### `merge(otherColl)`
  * operator +
  * [Union](http://en.wikipedia.org/wiki/Union_(set_theory))
  * @see mergeColl()

##### `subtract(collSubtract)`
  * operator -
  * [Set difference](http://en.wikipedia.org/wiki/Set_difference)
  * @see subtractColl()

##### `inCommonColl(otherColl)`
  * operator &
  * [Intersection](http://en.wikipedia.org/wiki/Intersection_(set_theory))
  * @see inCommonColl()

##### `notInCommonColl(otherColl)`
  * operator xor
  * [Symmetric difference](http://en.wikipedia.org/wiki/Symmetric_difference)
  * @see notInCommonColl()

##### `sortColl(sortFunc)`
  * @see sortColl()

##### `registerObserver(observer)`
  * Pass an object that will be called when items are added or removed from this list.
  * If you call this twice for the same observer, the second is a no-op.
  * @param observer {CollectionObserver}

##### `unregisterObserver(observer)`
  * undo `registerObserver`
  * @param observer {CollectionObserver}

KeyValueCollection
---------------------

A collection where entries have a key or label or index.

Examples of subclasses: Array (key = index), Map

##### `set(key, item)`
  * Sets the value for |key|
  * @param key
  
##### `get(key)`
  * Gets the value for |key|
  * If the key doesn't exist, returns |undefined|.
  * @param key
  
##### `removeKey(key)`
  * Remove the key and its corresponding value item.
  * undo set(key, item)
  
##### `containsKey(key)`
  * @returns {Boolean}
  
##### `getKeyForValue(value)`
  * Searches the whole list for this |value| and if found, returns the (first) key for it.
  * If not found, returns undefined.
  * @returns key

CollectionObserver
---------------------

To listen to collection changes, you need to implement this interface.

##### `added(item, list)`
  * Called after an item has been added to the list.
  * @param item {Object} the removed item
  * @param coll {Collection} the observed list. convenience only.
  
##### `removed(item, coll)`
  * Called after an item has been removed from the list
  * TODO should clear() call removed() for each item? Currently: yes.
  * Alternative: separate cleared()
  * @param item {Object} the removed item
  * @param coll {Collection} the observed list. convenience only.


Concrete collections
----------------------

To create a collection, instantiate one of these.

##### `ArrayColl`
  * A |KeyValueCollection| based on a JS Array.
  * Properties:
  * - ordered
  * - indexed: every item has an integer key
  * - can hold the same item several times
  * - fast
  * @param copyFromArray {Array} (optional) init the collection with these values

##### `SetColl`
  * A |Collection| which can hold each object only once.
  * Properties:
  * - not ordered
  * - can *not* hold the same item several times
  * - fast

##### `MapColl`
  * A |KeyValueCollection| which can hold each object only once.
  * Properties:
  * - not ordered
  * - can *not* hold the same item several times
  * - fast

##### `DOMColl`
  * A |Collection| which wraps a DOMNodeList.
  * It is static, i.e. changes in the DOM are not reflected here.
  * @param {DOMNodeList}


Operators
-----------

add, subtract, and, xor - compare [Set theory](http://en.wikipedia.org/wiki/Set_theory) and sort

All operators observe the original collections they are constructed from, and adapt the result based on changes, and notify any observers that are registered on the operator result collection.

##### `concatColl(coll1, coll2)`
  * operator +
  * Returns a collection that contains all values from coll1 and coll2.
  * If the same item is in both coll1 and coll2, it will be added twice.
  * The result is simply coll2 appended to coll1.
  * @param coll1 {Collection}
  * @param coll2 {Collection}
  * @returns {Collection} Preserves order

##### `mergeColl(coll1, coll2)`
  * operator +
  * [Union](http://en.wikipedia.org/wiki/Union_(set_theory))
  * Returns a collection that contains all values from coll1 and coll2.
  * If the same item is in both coll1 and coll2, it will be added only once.
  * @param coll1 {Collection}
  * @param coll2 {Collection}
  * @returns {Collection} Does not preserve order.

##### `subtractColl(collBase, collSubtract)`
  * operator -
  * [Set difference](http://en.wikipedia.org/wiki/Set_difference)
  * Returns a collection that contains all values from collBase, apart from those in collSubtract.
  * @param collBase {Collection}
  * @param collSubtract {Collection}
  * @returns {Collection} Preserves order of collBase.
  
##### `inCommonColl(coll1, coll2)`
  * operator &
  * [Intersection](http://en.wikipedia.org/wiki/Intersection_(set_theory))
  * Returns a collection that contains the values that are contained in *both* coll1 and coll1, and only those.
  * @param coll1 {Collection}
  * @param coll2 {Collection}
  * @returns {Collection} Does not preserve order.
  
##### `notInCommonColl(coll1, coll2)`
  * operator xor
  * [Symmetric difference](http://en.wikipedia.org/wiki/Symmetric_difference)
  * Returns a collection that contains all values that are contained only in coll1 or coll2, but not in both.
  * @param coll1 {Collection}
  * @param coll2 {Collection}
  * @returns {Collection} Does not preserve order.
  
##### `sortColl(coll, sortFunc)`
  * Returns a new collection that is sorted based on the |sortFunc|.
  * TODO
  * @param coll {Collection}
  * @param sortFunc(a {Item}, b {Item}) returns {Boolean} a > b
  * @returns {Collection}

Implementation
==============

DONE
* Ben Bucksch provided API, base implementation, Array, Set, Map, and operators

TODO
* Ben will implement sortColl()
* Others are welcome to make UI elements support these collections.
* The code will be documented using the [JSDoc conventions](http://code.google.com/intl/en/closure/compiler/docs/js-for-compiler.html).

Code / download
* `git clone https://github.com/benbucksch/jscollection`

Feedback needed
-------------------

### Comparison of items
How to specify identity and sorting for items, e.g. "if |id| property matches, it's the same item" and "sort on |name| property" or "if a.name > b.name, then a > b"

Options:
* base class for items -- convenient, but doesn't allow to collect objects not supporting this API, also doesn't allow to specify different sorting based on situation
* Operators and Set and Ordered* collections take functions that can compare the objects -- cumbersome, because it needs to be specified for every use

* specify id and sortBy properties or -- more convenient
* specify isSameObject() and isGreaterThan() functions - more flexible

### Weak references
* Leveraging [WeakMap](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/WeakMap)  should be considered.
