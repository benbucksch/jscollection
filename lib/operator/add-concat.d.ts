import type { Collection } from '../api';
import type { ArrayColl } from '../collection/array';

export function concatColl<Item>(...coll: Collection<Item>): AdditionCollectionWithDups<Item>;
export function addCollWithDups<Item>(...coll: Collection<Item>): AdditionCollectionWithDups<Item>;
declare class AdditionCollectionWithDups<Item> extends ArrayColl<Item> {
  constructor();
  addColl(coll: Collection<Item>);
}
