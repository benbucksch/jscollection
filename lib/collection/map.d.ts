import type {  KeyValueCollection } from '../api';

declare class MapColl<Key, Item> extends KeyValueCollection<Key, Item> {
  constructor();
  contentKeys(): Array<Item>;
  contentKeyValues(): any;

  // JS Map
  values(): { next: () => { value: Item, done: boolean} };
  keys(): { next: () => { value: Item, done: boolean} };
  entries(): { next: () => { value: Item, done: boolean} };
  // <https://github.com/microsoft/TypeScript/blob/main/src/lib/es2015.collection.d.ts>
  readonly size: number;
  clear(): void;
  delete(key: Key): boolean;
  get(key: Key): Item | undefined;
  has(key: Key): boolean;
  forEach(callbackfn: (value: Item, key: Key) => void): void;
}
