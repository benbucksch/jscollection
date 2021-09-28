import type { Collection } from '../api';
import type { ArrayColl } from '../collection/array';

export function concatColl<Item>(coll1: Collection<Item>, coll2: Collection<Item>): AdditionCollectionWithDups<Item>;
export function addCollWithDups<Item>(coll1: Collection<Item>, coll2: Collection<Item>): AdditionCollectionWithDups<Item>;
declare class AdditionCollectionWithDups<Item> extends ArrayColl<Item> {
  constructor(coll1: Collection<Item>, coll2: Collection<Item>);
}
