import type { Collection } from '../api';
import type { ArrayColl } from '../collection/array';

declare class FilteredCollection<Item> extends ArrayColl<Item> {
  constructor(source: Collection<Item>, filterFunc: (item: Item) => boolean);
}
