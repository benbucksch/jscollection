import type { Collection } from '../api';
import type { SetColl } from '../collection/set';

declare class UniqueCollection<Item> extends SetColl<Item> {
  constructor(source: Collection<Item>, equalFunc: (a: Item, b: Item) => boolean = null);
}
