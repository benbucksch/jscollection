import type { Collection } from '../api';

declare class SetColl<Item> extends Collection<Item> {
  constructor();
  private _addWithoutObserver(item: Item);
  private _removeWithoutObserver(item: Item);

  // JS Set
  values(): { next: () => { value: Item, done: boolean} };
  keys(): { next: () => { value: Item, done: boolean} };
  entries(): { next: () => { value: Item, done: boolean} };
  // <https://github.com/microsoft/TypeScript/blob/main/src/lib/es2015.collection.d.ts>
  readonly size: number;
  delete(value: Item): boolean;
  has(value: Item): boolean;
}
