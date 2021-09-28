import type { Collection } from '../api';

declare class SetColl<Item> extends Collection<Item> {
  constructor();
  private _addWithoutObserver(item: Item);
  private _removeWithoutObserver(item: Item);
}
