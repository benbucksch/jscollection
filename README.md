JavaScript Collections for Svelte
===================

[Recollections](https://www.npmjs.com/package/recollections) provides a coherent set of collection/list classes. They form a powerful, yet lean system to design component APIs and plug different modules together between backend logic and UI. Like LEGO Technic. It simplifes application code with list operators and automatic updates.

This is mostly about 3 aspects:
* **Common API** for various collection types (array, set, map, OrderedMap, DOM list etc.), similar to java.util.Collection.
* **Observers** to notify about changes, allowing automatic UI updates in Svelte
* **Operators** for whole lists, like concat, merge, substract, intersect etc..

These aspects work together: Operation results are observable and change when the underlying operand collections change. Operations can be chained. All collection types support all operations.

That means you can have a `shopItems` collection defined as the result of `installedItems` subtracted from `availableItems` . When you show the `shopItems`, the user sees only those items that are not yet installed. Now, as soon as an item is added to `installedItems`, it automatically disappears from the shop UI - immediately, without you having to write any extra code in the UI to support these updates. You don't have to install observers to `installedItems`, because the subtract operator already does that. If your list UI component observes list changes using the collection API here, you don't need any UI update wiring at all. Its all calculated and updated automatically. The `installedItems` can be managed by a backend module - completely independently from the UI. This allows you to decouple logic from the UI.

It works directly with Svelte. All you need to do is add a `$` in front of the collection when you use it in the HTML part. It removes the need to re-assign the array every time anything changes it, even in other components. Svelte is automatically notified about changes and automatically update the UI. You only need to call `add()` or `remove()` on the collection.

Example
=======

Show only those items which are not already purchased, i.e. only offer new stuff:

    var availableItems = await getItemsFromServer(); // returns ArrayColl
    var installedItems = new ArrayColl([ itemA, itemC ]);
    var shopItems = availableItems.subtract(installedItems);

    <div class="shop">
    {#each $shopItems.each as item (item.id) }
      <div class="item">item.name</div>
    {/each}
    </div>

That's all. When items are added to `availableItems` later, they automatically appear in the list UI, *unless* they are in `installedItems`. `shopItems` will be automatically updated and displayed, without further application code.

That's because the subtract operator automatically subscribed to changes in `availableItems`. If you then later do `availableItems.add(itemC)`, the subtract operator would check whether the same items is in `installedItems`, and only if it's not, it would add it to `shopItems`. `listbox.showCollection()` in turn automatically subscribed to changes in `shopItems`, gets notified about the new item there, and shows it. All of that would happen just with the above code lines, there is no additional code needed to follow updates.

Of course, if you wanted to show both `availableItems` and `installedItems` in the UI, you would do `add()` instead of `substract()`.

This means that you don't need additional wiring to make the UI update after the user (or server) did add/remove item actions, you only need to update the underlying lists.

Functionality
============

* Base API implemented by all collections
  * similar to java.util.Collection probably
  * with observers to allow you to subscribe to changes and be notified when items are added or remoted
  * Ability to specify identity and sorting for items, e.g. "if `id` property matches, it's the same item" and "sort on `name` property" or "if a.name > b.name, then a > b"
* Operators on the collections
  * Operate on whole lists, e.g. `allItems = merge(availableItems, installedItems);`
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
  * E.g. `listbox.showList(allItems)`
  * Dynamically adapting UI without extra work: Thanks to observers, the UI updates automatically based on changes of the underlying list.
  * The API of the UI then wouldn't need "add/remoteItem()" functions itself.
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
  * @param item {`Object`} any JS object

##### `remove(item)`
  * Removes one item from the list
  * @param item {`Object`} any JS object

##### `addAll(coll)`
  * Add all items in `coll` to this list.
  * This is just a convenience function.
  * This adds items statically and does not observe the `coll` changes.
  * Consider using addColl() instead.
  * Note: This is intentionally not overloading `add`.
  * @param coll {`Collection or JS Array`}

##### `removeAll(coll)`
  * Removes all items in `coll` from this list
  * @param coll {`Collection or JS Array`}

##### `clear()`
  * Removes all items from the list.

##### `get length()`
  * The number of items in this list
  * @returns {`Integer`} (always >= 0)

##### `get isEmpty()`
  * Whether there are no items in this list
  * @returns {`Boolean`} true, if there are no items

##### `get hasItems()`
  * Whether there are items in this list
  * @returns {`Boolean`} true, if there are items

##### `contains(item)`
  * Checks whether this item is in the list.
  * @returns {`Boolean`}

##### `contents()`
  * Returns all items contained in this list, as a new JS array (so calling this can be expensive).
  * If the list is ordered, the result of this function is ordered in the same way.
  * While the returned array is a copy, the items are not, so changes to the array do not affect the list, but changes to its items do change the items in the list.
  * @returns {`Array`} new JS array with all items

##### `first`
  * @returns {`Object`} The first item in the list

##### `last`
  * @returns {`Object`} The last item in the list

##### `forEach(func)`
  * Iterates over all items in the list.
  * @returns {`Boolean`}

##### `forEach(func)`
  * Iterates over all items in the list.
  * @returns {`Boolean`}

##### `filter(filterFunc)`
  * Returns a new observable collection with all matching items.
  * The result will be dynamically updated as the source collection changes.
  * @param filterCallback {`Function(item)`}
  * @returns {`Collection of items`} where `filterFunc` returned `true`

##### `find(filterFunc)`
  * Returns the first matching item.
  * @param filterCallback {`Function(item)`}
  * @returns {`Object`} for which `filterFunc` returned `true`

##### `map(mapFunc)`
  * For each item in the source collection, return a corresponding other item
  * as determined by `mapFunc`.
  * The result is an observable collection and will be dynamically updated
  * as the source collection changes.
  * @returns {`Collection of Object`} whereby {`Object`} is the result of `mapFunc()`

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
  * @param observer {`CollectionObserver`}

##### `unregisterObserver(observer)`
  * undo `registerObserver`
  * @param observer {`CollectionObserver`}

KeyValueCollection
---------------------

A collection where entries have a key or label or index.

Examples of subclasses: Array (key = index), Map

##### `set(key, item)`
  * Sets the value for `key`
  * @param key

##### `get(key)`
  * Gets the value for `key`
  * If the key doesn't exist, returns `undefined`.
  * @param key

##### `removeKey(key)`
  * Remove the key and its corresponding value item.
  * undo set(key, item)

##### `containsKey(key)`
  * @returns {`Boolean`}

##### `getKeyForValue(value)`
  * Searches the whole list for this `value` and if found, returns the (first) key for it.
  * If not found, returns undefined.
  * @returns key

CollectionObserver
---------------------

To listen to collection changes, you need to implement this interface.

##### `added(item, list)`
  * Called after an item has been added to the collection.
  * @param item {`Object`} the removed item
  * @param coll {`Collection`} the observed list. convenience only.

##### `removed(item, coll)`
  * Called after an item has been removed from the collection.
  * @param item {`Object`} the removed item
  * @param coll {`Collection`} the observed list. convenience only.
  * TODO should clear() call removed() for each item? Currently: yes. Alternative: separate cleared()


Concrete collections
----------------------

To create a collection, instantiate one of these.

##### `ArrayColl`
  * A `KeyValueCollection` based on a JS Array.
  * Properties:
  * - ordered
  * - indexed: every item has an integer key
  * - can hold the same item several times
  * - fast
  * @param copyFromArray {`Array`} (optional) init the collection with these values

##### `SetColl`
  * A `Collection` which can hold each object only once.
  * Properties:
  * - not ordered
  * - can *not* hold the same item several times
  * - fast

##### `MapColl`
  * A `KeyValueCollection` which can map one string or object to another object.
  * Properties:
  * - not ordered
  * - can hold the same item several times, as long as the key is different
  * - fast

##### `DOMColl`
  * A `Collection` which wraps a DOMNodeList.
  * Static, i.e. changes in the DOM are not reflected here.
  * @param {`DOMNodeList`}

##### `DynamicDOMColl`
  * A `Collection` which wraps a DOMNodeList.
  * Dynamic, i.e. changes in the DOM are reflected in the collection and trigger the observers.
  * @param {`DOMNodeList`}
  * Not yet implemented


Operators
-----------

add, subtract, and, xor - compare [Set theory](http://en.wikipedia.org/wiki/Set_theory) and sort

All operators observe the original collections they are constructed from, and adapt the result based on changes, and notify any observers that are registered on the operator result collection.

##### `concatColl(coll1, coll2, ...)`
  * operator +
  * Returns a collection that contains all values from coll1 and coll2.
  * If the same item is in both coll1 and coll2, it will be added twice.
  * The result is simply coll2 appended to coll1.
  * @param coll, coll, coll, ...  {`Collection`}
  * @returns {`Collection`} Preserves order

##### `mergeColl(coll1, coll2, ...)`
  * operator +
  * [Union](http://en.wikipedia.org/wiki/Union_(set_theory))
  * Returns a collection that contains all values from coll1 and coll2.
  * If the same item is in both coll1 and coll2, it will be added only once.
  * @param coll, coll, coll, ... {`Collection`}
  * @returns {`Collection`} Does not preserve order.

##### `subtractColl(collBase, collSubtract)`
  * operator -
  * [Set difference](http://en.wikipedia.org/wiki/Set_difference)
  * Returns a collection that contains all values from collBase, apart from those in collSubtract.
  * @param collBase {`Collection`}
  * @param collSubtract {`Collection`}
  * @returns {`Collection`} Preserves order of collBase.

##### `inCommonColl(coll1, coll2)`
  * operator &
  * [Intersection](http://en.wikipedia.org/wiki/Intersection_(set_theory))
  * Returns a collection that contains the values that are contained in *both* coll1 and coll1, and only those.
  * @param coll1 {`Collection`}
  * @param coll2 {`Collection`}
  * @returns {`Collection`} Does not preserve order.

##### `notInCommonColl(coll1, coll2)`
  * operator xor
  * [Symmetric difference](http://en.wikipedia.org/wiki/Symmetric_difference)
  * Returns a collection that contains all values that are contained only in coll1 or coll2, but not in both.
  * @param coll1 {`Collection`}
  * @param coll2 {`Collection`}
  * @returns {`Collection`} Does not preserve order.

##### `sortColl(coll, sortFunc)`
  * Returns a new collection that is sorted using the `sortFunc`.
  * @param coll {`Collection`}
  * @param sortFunc(a {`Item`}, b {`Item`}) returns {`Boolean`} a < b
  *     If true: itemA before itemB.
  *     If false: itemB before itemA.
  *     Note: The result is boolean, not a number like `compareFunc` used by `Array.sort()`.
  * @returns {`Collection`}

Implementation
==============

TODO
* OrderedMap
* WeapMap, WeakSet
* UI list elements that accept these collections
* Backend APIs emit these collections

Code / download
* `git clone https://github.com/benbucksch/jscollection`
