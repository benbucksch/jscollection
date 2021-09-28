import type{ FilteredCollection } from './operator/filter';
import type{ MapToCollection } from './operator/mapTo';
import type{ SortedCollection } from './operator/sort';
import type{ AdditionCollection } from './operator/add-merge';
import type{ AdditionCollectionWithDups } from './operator/add-concat';
import type{ SubtractCollection } from './operator/subtract';
import type{ IntersectionCollection } from './operator/intersection';

declare class Collection<Item> {
  constructor();
  add(item: Item): void;
  push(item: Item): void;
  remove(item: Item): void;
  addAll(coll: Collection<Item> | Array<Item>): void;
  removeAll(coll: Collection<Item> | Array<Item>): void;
  clear(): void;
  readonly length: number;
  readonly isEmpty: boolean;
  contains(item: Item): boolean;
  readonly contents: Array<Item>;
  readonly each: Array<Item>;
  readonly first: Item;
  getIndex(i: number): Item;
  getIndexRange(i: number, length: number): Item;
  forEach(callback: (item: Item) => void): void;
  [Symbol.iterator](): { next: () => { value: Item, done: boolean} };
  find(filterFunc: (item: Item) => boolean): Item;
  filter(filterFunc: (item: Item) => boolean): FilteredCollection<Item>;
  map(mapFunc: (item: Item) => Item): MapToCollection<Item>;
  sort(sortFunc: (a: Item, b: Item) => boolean): SortedCollection<Item>;
  concat(otherColl: Collection<Item>): AdditionCollectionWithDups<Item>;
  merge(otherColl: Collection<Item>): AdditionCollection<Item>;
  subtract(collSubtract: Collection<Item>): SubtractCollection<Item>;
  inCommon(otherColl: Collection<Item>): IntersectionCollection<Item>;
  notInCommon(otherColl: Collection<Item>): Collection<Item>;
  registerObserver(observer: CollectionObserver<Item>): void;
  unregisterObserver(observer: CollectionObserver<Item>): void;
  private _notifyAdded(items: Array<Item>): void;
  private _notifyRemoved(items: Array<Item>): void;
  private _notifyChanged(): void;
  subscribe(subscription: (value: Item) => void): (() => void);
}

declare class KeyValueCollection<Item> extends Collection<Item> {
  constructor();
  set(key: Key, item: Item): void;
  get(key: Key): Item;
  removeKey(key: Key): void;
  containsKey(key: Key): boolean;
  getKeyForValue(item: Item): Key;
}
type Key = number | string;

declare class CollectionObserver<Item> {
  constructor();
  added(items: Array<Item>, coll: Collection<Item>): void;
  removed(items: Array<Item>, coll: Collection<Item>): void;
}
