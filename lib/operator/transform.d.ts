import type { Collection } from '../api';
import type { ArrayColl } from '../collection/array';

declare class TransformedCollection<Item> extends ArrayColl<Item> {
  constructor(source: Collection<Item>, transformFunc: (source: Collection<Item>) => Array<Item>);
}
