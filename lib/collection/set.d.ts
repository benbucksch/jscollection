import type { Collection } from '../api';

declare class SetColl<Item> extends Collection<Item> {
  constructor();
  readonly size: number;
  delete(item: Item): void;
  has(item: Item): boolean;
  values(): { next: () => { value: Item, done: boolean} };
  keys(): { next: () => { value: Item, done: boolean} };
  entries(): { next: () => { value: Item, done: boolean} };
  private _addWithoutObserver(item: Item);
  private _removeWithoutObserver(item: Item);
}
