import type { Collection } from '../api';
import type { TransformedCollection } from './transform';

export function sortColl<Item>(coll: Collection<Item>, sortFunc: (a: Item, b: Item) => number): SortedCollection<Item>;
declare class SortedCollection<Item> extends TransformedCollection<Item> {
  constructor(source: Collection<Item>, sortFunc: (a: Item, b: Item) => number);
}
export function compareValues<Item>(a: Item, b: Item): number;
