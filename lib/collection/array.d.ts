import type { Collection, KeyValueCollection } from '../api';

declare class ArrayColl<Item> extends KeyValueCollection<number, Item> implements Array {
  constructor(copyFrom: Array<Item> | Collection<Item>);
  removeEach(item: Item): void;
  private _addWithoutObserver(item: Item);
  private _removeWithoutObserver(item: Item);
  static isArrayColl(array: any): boolean;

  // JS Array
  at(pos: number): Item;
  flat(): ArrayColl<unknown>;
  flatMap(mapFunc): ArrayColl<unknown>;
  values(): { next: () => { value: Item, done: boolean} };
  keys(): { next: () => { value: Item, done: boolean} };
  entries(): { next: () => { value: Item, done: boolean} };
  // <https://github.com/microsoft/TypeScript/blob/main/src/lib/es5.d.ts>
  // <https://github.com/microsoft/TypeScript/blob/main/src/lib/es2015.core.d.ts>
  // <https://github.com/microsoft/TypeScript/blob/main/src/lib/es2016.array.include.d.ts>
  [n: number]: Item;
  length: number;
  toString(): string;
  toLocaleString(): string;
  pop(): Item | undefined;
  join(separator?: string): string;
  reverse(): ArrayColl<Item>;
  shift(): Item | undefined;
  slice(start?: number, end?: number): ArrayColl<Item>;
  splice(start: number, deleteCount?: number): ArrayColl<Item>;
  splice(start: number, deleteCount: number, ...items: Item[]): ArrayColl<Item>;
  unshift(...items: Item[]): number;
  indexOf(searchElement: Item, fromIndex?: number): number;
  lastIndexOf(searchElement: Item, fromIndex?: number): number;
  every(predicate: (value: Item, index: number) => unknown): boolean;
  some(predicate: (value: Item, index: number) => unknown): boolean;
  forEach(callbackfn: (value: Item, index: number) => void): void;
  reduce(callbackfn: (previousValue: Item, currentValue: Item, currentIndex: number) => Item): Item;
  reduce(callbackfn: (previousValue: Item, currentValue: Item, currentIndex: number) => Item, initialValue: Item): Item;
  reduce<U>(callbackfn: (previousValue: U, currentValue: Item, currentIndex: number) => U, initialValue: U): U;
  reduceRight(callbackfn: (previousValue: Item, currentValue: Item, currentIndex: number) => Item): Item;
  reduceRight(callbackfn: (previousValue: Item, currentValue: Item, currentIndex: number) => Item, initialValue: Item): Item;
  reduceRight<U>(callbackfn: (previousValue: U, currentValue: Item, currentIndex: number) => U, initialValue: U): U;
  find<S extends Item>(predicate: (this: void, value: Item, index: number, obj: Item[]) => value is S): S | undefined;
  find(predicate: (value: Item, index: number, obj: Item[]) => unknown): Item | undefined;
  findIndex(predicate: (value: Item, index: number, obj: Item[]) => unknown): number;
  fill(value: Item, start?: number, end?: number): this;
  copyWithin(target: number, start: number, end?: number): this;
  includes(searchElement: Item, fromIndex?: number): boolean;
  static from<Item>(arrayLike: ArrayLike<Item>): ArrayColl<Item>;
  static from<Item, U>(arrayLike: ArrayLike<Item>, mapfn: (v: Item, k: number) => U): U[];
  static of<Item>(...items: Item[]): ArrayColl<Item>;
  static isArray(array: any): boolean;
}
