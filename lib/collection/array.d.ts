import type { Collection, KeyValueCollection } from '../api';

declare class ArrayColl<Item> extends KeyValueCollection<number, Item> {
  constructor(copyFrom?: Array<Item> | Collection<Item>);
  removeEach(item: Item): void;
  private _addWithoutObserver(item: Item);
  private _removeWithoutObserver(item: Item);

  /**
   * @returns Whether the given object is a JS Array or ArrayColl.
   */
  static isArray(array: any): boolean;
  /**
   * @returns Whether the given object is an ArrayColl, and not a JS Array.
   */
  static isArrayColl(array: any): boolean;

  // JS Array
  /**
   * @returns The item at the given index position.
   */
  at(pos: number): Item;
  // <https://github.com/microsoft/TypeScript/blob/main/src/lib/es5.d.ts>
  // <https://github.com/microsoft/TypeScript/blob/main/src/lib/es2015.iterable.d.ts>
  // <https://github.com/microsoft/TypeScript/blob/main/src/lib/es2015.core.d.ts>
  // <https://github.com/microsoft/TypeScript/blob/main/src/lib/es2016.array.include.d.ts>
  // <https://github.com/microsoft/TypeScript/blob/main/src/lib/es2019.array.d.ts>
  // Comments MIT License (c) Microsoft
  /**
   * Currently not implemented
   */
  [n: number]: Item;
  /**
   * Gets the length of the collection.
   * This is the integer number one higher than the highest index in the collection.
   */
  length: number;
  /**
   * @returns a string representation of the collection.
   */
  toString(): string;
  /**
   * @returns a string representation of the collection. The elements are converted to string using their toLocaleString methods.
   */
  toLocaleString(): string;
  /**
   * Removes the last element from the collection and returns it.
   *
   * If the collection is empty, undefined is returned and the collection is not modified.
   */
  pop(): Item | undefined;
  /**
   * Appends all the elements of the collection collection into a string, separated by the specified separator string.
   * @param separator A string used to separate one element of the collection from the next in the resulting string. If omitted, the elements are separated with a `,` comma.
   */
  join(separator?: string): string;
  /**
   * Reverses the elements in the collection in place.
   * This method mutates the collection and returns a reference to the same array.
   */
  reverse(): ArrayColl<Item>;
  /**
   * Removes the first element from the collection and returns it.
   *
   * If the collection is empty, undefined is returned and the collection is not modified.
   */
  shift(): Item | undefined;
  /**
   * Inserts new items at the start of the collection, and returns the new length of the collection.
   * @param items Elements to insert at the start of the collection.
   */
  unshift(...items: Item[]): number;
  /**
   * Returns a section of the collection.
   *
   * For both start and end, a negative index can be used to indicate an offset from the end of the collection.
   * For example, -2 refers to the second to last element of the collection.
   * @param start The beginning of the specified portion of the collection.
   * If start is undefined, then the slice begins at index 0.
   * @param end The end of the specified portion of the collection. This is exclusive of the element at the index 'end'.
   * If end is undefined, then the slice extends to the end of the collection.
   */
  slice(start?: number, end?: number): ArrayColl<Item>;
  /**
   * Removes items from the collection collection, returning the deleted elements.
   * @param start The zero-based index position in the collection from which to start removing elements.
   * @param deleteCount The number of elements to remove. Optional.
   * @returns An ArrayColl containing the elements that were deleted.
   */
  splice(start: number, deleteCount?: number): ArrayColl<Item>;
  /**
   * Removes items from the collection collection and, if necessary, inserts new elements in their place, returning the deleted elements.
   * @param start The zero-based index position in the collection from which to start removing elements.
   * @param deleteCount The number of elements to remove.
   * @param items Elements to insert into the collectionin place of the deleted elements.
   * @returns An ArrayColl containing the elements that were deleted.
   */
  splice(start: number, deleteCount: number, ...items: Item[]): ArrayColl<Item>;
  /**
   * Returns the index of the first occurrence of the given in the collection.
   * @param searchElement The item to locate in the collection.
   * @param fromIndex The index at which to begin the search.
   *   If fromIndex is omitted, the search starts at index 0.
   */
  indexOf(searchElement: Item, fromIndex?: number): number;
  /**
   * Returns the index of the last occurrence of a the given item in the collection, or -1 if it is not present.
   * @param searchElement The item to locate in the collection.
   * @param fromIndex The index at which to begin searching backward.
   *   If fromIndex is omitted, the search starts at the last index in the collection.
   */
  lastIndexOf(searchElement: Item, fromIndex?: number): number;
  /**
   * Determines whether all the members of the collection satisfy the specified test.
   * @param filterFunc A function that accepts up to three arguments. The every method calls
   * the `filterFunc` function for each element in the collection until the `filterFunc` returns a value
   * which is coercible to the Boolean value false, or until the end of the collection.
   */
  every(filterFunc: (value: Item, index: number) => unknown): boolean;
  /**
   * Determines whether the specified callback function returns true for any element of the collection.
   * @param filterFunc A function that accepts up to three arguments. The some method calls
   * the `filterFunc` function for each element in the collection until the `filterFunc` returns a value
   * which is coercible to the Boolean value true, or until the end of the collection.
   */
  some(filterFunc: (value: Item, index: number) => unknown): boolean;
  /**
   * @param callback Will be called once for each element in the collection.
   */
  forEach(callback: (item: Item, index: number) => void): void;
  /**
   * Returns the value of the first element in the collection where `filterFunc` is true,
   * and undefined otherwise.
   * @param filterFunc find calls `filterFunc` once for each element of the collection, in ascending
   * order, until it finds one where `filterFunc` returns true. If such an element is found, find
   * immediately returns that element valuehttps://github.com/microsoft/TypeScript/blob/main/src/lib/es2016.array.include.d.tsOtherwise, find returns undefined.
   */
  find(filterFunc: (item: Item) => boolean): Item;
  /**
   * Returns the index of the first element in the collection where `filterFunc` is true,
   * and -1 otherwise.
   * @param filterFunc find calls `filterFunc` once for each element of the collection, in ascending
   * order, until it finds one where `filterFunc` returns true. If such an element is found,
   * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
   */
  findIndex(filterFunc: (value: Item, index: number, obj: Item[]) => unknown): number;
  /**
   * Calls the specified callback function for all the elements in the collection. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
   * @param callback A function that accepts up to four arguments. The reduce method calls the callback function one time for each element in the collection.
   * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callback function provides this value as an argument instead of the collection value.
   */
  reduce<Result>(callback: (previousValue: Result, currentValue: Item, currentIndex: number) => Result, initialValue: Result): Result;
  /**
   * Calls the specified callback function for all the elements in the collection, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
   * @param callback A function that accepts up to four arguments. The reduceRight method calls the callback function one time for each element in the collection.
   * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callback function provides this value as an argument instead of the collection value.
   */
  reduceRight<Result>(callback: (previousValue: Result, currentValue: Item, currentIndex: number) => Result, initialValue: Result): Result;
  /**
   * Changes all array elements from `start` to `end` index to a static `value` and returns the modified array
   * @param value value to fill array section with
   * @param start index to start filling the collection at. If start is negative, it is treated as
   * length+start where length is the length of the collection.
   * @param end index to stop filling the collection at. If end is negative, it is treated as
   * length+end.
   */
  fill(value: Item, start?: number, end?: number): this;
  /**
   * Returns the this object after copying a section of the collection identified by start and end
   * to the same array starting at position target
   * @param target If target is negative, it is treated as length+target where length is the
   * length of the collection.
   * @param start If start is negative, it is treated as length+start. If end is negative, it
   * is treated as length+end.
   * @param end If not specified, length of the this object is used as its default value.
   */
  copyWithin(target: number, start: number, end?: number): this;
  /**
   * Returns a new collection with all sub-array elements concatenated into it
   * recursively up to the specified depth.
   *
   * Once items are later added or removed from the source collections, they will also be added/removed accordingly to the result collection, as long as the collection lives.
   *
   * @param depth The maximum recursion depth
   */
  flat(): ArrayColl<unknown>;
  /**
   * Calls the `mapFunc` callback function on each element of the collection.
   * Then, flattens the result into a new array.
   * This is identical to a map followed by flat with depth 1.
   *
   * Once items are later added or removed from the source collections, they will also be added/removed accordingly to the result collection, as long as the collection lives.
   *
   * @param mapFunc A function that accepts up to three arguments. The flatMap method calls the
   * callback function one time for each element in the collection.
   */
  flatMap<Result>(mapFunc: (value: Item, index: number) => Result | Array<Result>): ArrayColl<Result>;
  /**
   * Determines whether the collection includes a certain item.
   * @param searchElement The item to search for.
   * @param fromIndex The position in this array at which to begin searching for searchElement.
   */
  includes(searchElement: Item, fromIndex?: number): boolean;
  /**
   * Creates an ArrayColl from an array-like object or iterable object.
   * @param arrayLike An array-like object to convert to an ArrayColl.
   */
  static from<Item>(arrayLike: ArrayLike<Item>): ArrayColl<Item>;
  /**
   * @returns All items of the collection as iterator.
   */
  values(): Collection<Item>;
  /**
   * @returns All indexes of the array collection as iterator.
   */
  keys(): Collection<number>;
  /**
   * @returns All entries of the array collection, each with index and item, as iterator.
   */
  entries(): Collection<[number, Item]>;
}
