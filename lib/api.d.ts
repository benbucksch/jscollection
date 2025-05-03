import type { FilteredCollection, ObservableFilteredCollection } from './operator/filter';
import type { MapToCollection } from './operator/mapTo';
import type { SortedCollection } from './operator/sort';
import type { AdditionCollection } from './operator/add-merge';
import type { AdditionCollectionWithDups } from './operator/add-concat';
import type { SubtractCollection } from './operator/subtract';
import type { IntersectionCollection } from './operator/intersection';

declare class Collection<Item> {
  constructor();
  // Recollections API
  /**
   * Appends a new item to the collection.
   * @param item What to add to the collection.
   */
  add(item: Item): void;
  /**
   * Removes one item from the collection.
   * @param item What to remove from the collection.
   */
  remove(item: Item): void;
  /**
   * Appends multiple new items to the collection.
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
   * In contrast, `addAll()` does a one-time append
   * to this collection.
   *
   * @param coll What to add to the collection.
   * This may be a JS Array or a Collection.
   */
  addAll(coll: Collection<Item> | Array<Item>): void;
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
   * @param coll What to remove from the collection.
   * This may be a JS Array or a Collection.
   */
  removeAll(coll: Collection<Item> | Array<Item>): void;

  /**
   * Replaces all items in `coll` with this collection.
   *
   * @example
   * ```js
   * coll.replaceAll([ a, b, c, d ]);
   * ```
   *
   * @param coll The new contents of the collection.
   * This may be a JS Array or a Collection.
   */
  replaceAll(coll: Collection<Item> | Array<Item>): void;

  /**
   * Empties the collection and removes all items.
   *
   * Calls the observer exactly once for all old items.
   */
  clear(): void;
  /**
   * @returns How many items are in the collection.
   */
  readonly length: number;
  /**
   * @returnes true, if the collection contains no items.
   */
  readonly isEmpty: boolean;
  /**
   * @returnes true, if the collection contains items.
   */
  readonly hasItems: boolean;
  /**
  * @returns a copy of the collection contents as JS Array.
  */
  readonly contents: Array<Item>;
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
  readonly each: Array<Item>;
  /**
   * @returns The first item in the collection
   */
  readonly first: Item;
  /**
   * @returns The last item in the collection
   */
  readonly last: Item;
  /**
  * @returns true, if the collection has this item.
  */
  contains(item: Item): boolean;
  /**
   * Note: For non-array collections, this may be very slow.
   * Do not call this in a loop, unless you have an ArrayColl
   * or a subtype of it. Rather, use `forEach()` or `for..of`.
   *
   * @param i the position of the wanted item
   * @returns the item at the given position.
   */
  getIndex(i: number): Item;
  /**
   * Returns a part of the collection as JS Array,
   * starting at a given position.
   * @param i where to start
   * @param length how many items to return
   * @returns the items at the given position
   */
  getIndexRange(i: number, length: number): Item[];
  // <https://github.com/microsoft/TypeScript/blob/main/src/lib/es5.d.ts>
  // Comments MIT license (c) Microsoft
  /**
   * @param callback Will be called once for each element in the collection.
   */
  forEach(callback: (item: Item) => void): void;
  [Symbol.iterator](): IterableIterator<Item>;
  /**
   * Returns the value of the first element in the collection where `filterFunc` is true, and undefined
   * otherwise.
   * @param filterFunc find calls `filterFunc` once for each element of the array, in ascending
   * order, until it finds one where `filterFunc` returns true. If such an element is found, find
   * immediately returns that element value. Otherwise, find returns undefined.
   */
  find(filterFunc: (item: Item) => boolean): Item;
  /**
   * Creates a new collection which contains only those items that meet a certain condition.
   * You define that condition by returning true from your `filterFunc`.
   *
   * It's not observing the source collection. Use this for one-off calculations,
   * where you don't keep the filtered result around.
   *
   * @param filterFunc A function that accepts up to three arguments. The filter method calls the `filterFunc` function one time for each element in the collection.
   */
  filterOnce(filterFunc: (item: Item) => boolean): Collection<Item>;
  /**
   * Creates a new collection which contains only those items that meet a certain condition.
   * You define that condition by returning true from your `filterFunc`.
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
   * @param filterFunc A function that accepts up to three arguments. The filter method calls the `filterFunc` function one time for each element in the collection.
   */
  filterObservable(filterFunc: (item: Item) => boolean): ObservableFilteredCollection<Item>;
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
  filter(filterFunc: (item: Item) => boolean): FilteredCollection<Item>;
  /**
   * Creates a new collection which contains other objects that are derived from the items in this collection.
   * You create them with the return value of your `mapFunc`.
   *
   * Calls the `mapFunc` callback function on each element of the collection, and returns a new observable collection that contains the results.
   *
   * Once items are later added or removed from the source collections, they will also be added/removed accordingly to the result collection, as long as the collection lives.
   *
   * @param callbackfn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
   */
  map<Result>(mapFunc: (item: Item) => Result): MapToCollection<Item, Result>;
  /**
   * Sorts the collection and returns a new collection with the result.
   *
   * Once items are later added or removed from the source collections, they will also be added/removed accordingly to the result collection, as long as the collection lives.
   * Unlike JS Array.sort(), this function does not alter the source collection.
   *
   * @example
   * ```ts
   * new ArrayColl([11,2,22,1]).sort((a, b) => a < b)
   * ```
   *
   * @param compareFn Function used to determine the order of the elements.
   * It returns true, if the first argument is less than the second argument, and false otherwise.
   * Unlike JS Array.sort(), the compare function returns boolean instead of -1/0/1.
   */
  sort(sortFunc: (a: Item, b: Item) => number): SortedCollection<Item>;
  /**
   * Sorts the collection by a value and returns a new collection with the result.
   *
   * Once items are later added or removed from the source collections, they will also be added/removed accordingly to the result collection, as long as the collection lives.
   * Unlike JS Array.sort(), this function does not alter the source collection.
   *
   * @example
   * ```ts
   * new ArrayColl([{name: 'a'},{name: 'b'},{name: 'b'},{name: 'd'}]).sortBy(o => o.name)
   * ```
   *
   * @param valueFn Function used to get the property to compare.
   */
  sortBy(valueFn: (o: Item) => any): SortedCollection<Item>;
  /**
  * operator +
  * Combines two collections, by appending the another colleciton.
  * Returns a collection that contains all values from both collections.
  * Duplicates are allowed. If the same item is in both collections, it will be added twice.
  *
  * @see merge() if you do not want duplicates
  *
  * Once items are later added or removed from the source collections, they will also be added/removed accordingly to the result collection, as long as the collection lives.
  *
  * @param otherColl Additional items from another collection to add to the end of the collection.
  * @returns A new collection which contains the items of both source collections.
  */
  concat(otherColl: Collection<Item>): AdditionCollectionWithDups<Item>;
  /**
   * Combines two collections, by merging the items, without duplicates.
   * Returns a collection that contains all values from both collections.
   * If the same item is in both collections, it will appear only once in the result colleciton.
   *
   * [Union](http://en.wikipedia.org/wiki/Union_(set_theory))
   *
   * Once items are later added or removed from the source collections, they will also be added/removed accordingly to the result collection, as long as the collection lives.
   *
   * @see concat() if you want a simple append with duplicates
   *
   * @param otherColl Additional items from another collection to add to the collection.
   * @returns A new collection which contains the items of both source collections. Does not preserve order.
   */
  merge(otherColl: Collection<Item>): AdditionCollection<Item>;

  // Recollections API
  /**
   * operator -
   * Returns a collection that contains all values from `this`, apart from those in collSubtract.
   *
   * [Set difference](http://en.wikipedia.org/wiki/Set_difference)
   *
   * Once items are later added or removed from the source collections, they will also be added/removed accordingly to the result collection, as long as the collection lives.
   * Same is true for the items that you remove: If items are later added to the collSubtract collection, they will disappear from the result collection, and vise versa.
   *
   * @param collSubtract Items that you do not want in the result collection.
   * @returns Preserves order of collBase.
   */
  subtract(collSubtract: Collection<Item>): SubtractCollection<Item>;
  /**
   * operator &
   * Returns a collection that contains the values that are contained
   * in *both* collections, and only those.
   *
   * [Intersection](http://en.wikipedia.org/wiki/Intersection_(set_theory))
   *
   * Once items are later added or removed from the source collections, they will also be added/removed accordingly to the result collection, as long as the collection lives.
   *
   * @param otherColl
   * @returns Does not preserve order.
   */
  inCommon(otherColl: Collection<Item>): IntersectionCollection<Item>;
  /**
   * operator xor
   * Returns a collection that contains all values that are contained only in `this` or in `otherColl`, but not in both.
   *
   * [Symmetric difference](http://en.wikipedia.org/wiki/Symmetric_difference)
   *
   * @param otherColl
   * @returns Does not preserve order.
   */
  notInCommon(otherColl: Collection<Item>): Collection<Item>;
  /**
   * Pass an object that will be called when
   * items are added or removed from this list.
   *
   * If you call this twice for the same observer, the second is a no-op.
   * @param observer
   */
  registerObserver(observer: CollectionObserver<Item>): void;
  /**
   * Undo `registerObserver`
   * @param observer {CollectionObserver}
   */
  unregisterObserver(observer: CollectionObserver<Item>): void;
  protected _notifyAdded(items: Array<Item>): void;
  protected _notifyRemoved(items: Array<Item>): void;
  protected _notifyChanged(): void;
  subscribe(subscription: (value: this) => void): (() => void);
  // Aliases for compat with JS Array.
  /**
   * Alias for `add()`
   */
  push(item: Item): void;
  /**
   * Alias for `contains()`
   */
  includes(item: Item): boolean;
}

declare class KeyValueCollection<Key, Item> extends Collection<Item> {
  constructor();
  set(key: Key, item: Item): void;
  get(key: Key): Item;
  removeKey(key: Key): void;
  containsKey(key: Key): boolean;
  getKeyForValue(item: Item): Key;
  removeValue(item: Item): void;
}

declare class CollectionObserver<Item> {
  constructor();
  added(items: Array<Item>, coll: Collection<Item>): void;
  removed(items: Array<Item>, coll: Collection<Item>): void;
}
