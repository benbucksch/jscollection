import type { Collection, KeyValueCollection } from '../api';

declare class ArrayColl<Item> extends KeyValueCollection<Item> {
  constructor(copyFrom: Array<Item> | Collection<Item>);
  removeEach(item: Item): void;
  private _addWithoutObserver(item: Item);
  private _removeWithoutObserver(item: Item);
}
