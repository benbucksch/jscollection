import type { Collection } from '../api';
import type { ArrayColl } from '../collection/array';

export function sortColl<Item>(coll: Collection<Item>, sortFunc: (a: Item, b: Item) => boolean): SortedCollection<Item>;
declare class SortedCollection<Item> extends ArrayColl<Item> {
  constructor(source: Collection<Item>, sortFunc: (a: Item, b: Item) => boolean);
}
