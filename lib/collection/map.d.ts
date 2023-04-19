import type { KeyValueCollection } from '../api';

declare class MapColl<Key, Item> extends KeyValueCollection<Key, Item> {
  constructor();
  contentKeys(): Array<Item>;
  contentKeyValues(): any;

  // JS Map
  // <https://github.com/microsoft/TypeScript/blob/main/src/lib/es2015.collection.d.ts>
  readonly size: number;
  clear(): void;
  delete(key: Key): boolean;
  get(key: Key): Item | undefined;
  has(key: Key): boolean;
  /**
   * @param callback Will be called once for each element in the collection.
   */
  forEach(callback: (value: Item, key: Key) => void): void;
  // <https://github.com/microsoft/TypeScript/blob/main/src/lib/es2015.iterable.d.ts>
  /**
   * @returns All items of the collection as iterator.
   */
  values(): Collection<Item>;
  /**
   * @returns All key of the collection as iterator.
   */
  keys(): Collection<Key>;
  /**
   * @returns All entries of the collection, each with key and item, as iterator.
   */
  entries(): Collection<[Key, Item]>;
}
