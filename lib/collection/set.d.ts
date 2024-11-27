import type { Collection } from '../api';

declare class SetColl<Item> extends Collection<Item> {
  constructor();
  protected _addWithoutObserver(item: Item);
  protected _removeWithoutObserver(item: Item);

  // JS Set
  // <https://github.com/microsoft/TypeScript/blob/main/src/lib/es2015.collection.d.ts>
  readonly size: number;
  delete(value: Item): boolean;
  has(value: Item): boolean;
  // <https://github.com/microsoft/TypeScript/blob/main/src/lib/es2015.iterable.d.ts>
  /**
   * @returns All items of the collection as iterator.
   */
  values(): IterableIterator<Item>;
  /**
   * @returns All items of the collection as iterator.
   * Does not make sense for Set. Call `values()` instead, or use `for..of`.
   */
  keys(): IterableIterator<Item>;
  /**
   * @returns All entries of the collection as iterator.
   * Does not make sense for Set. Call `values()` instead, or use `for..of`.
   */
  entries(): IterableIterator<[Item, Item]>;
}
