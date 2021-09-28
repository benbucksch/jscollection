import type { Collection } from '../api';
import type { ArrayColl } from '../collection/array';

declare class MapToCollection<Item> extends ArrayColl<Item> {
  constructor(source: Collection<Item>, mapFunc: (item: Item) => Item);
}
