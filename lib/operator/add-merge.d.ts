import type { Collection } from '../api';
import type { SetColl } from '../collection/set';

export function mergeColl<Item>(coll1: Collection<Item>, coll2: Collection<Item>): AdditionCollection<Item>;
export function addColl<Item>(coll1: Collection<Item>, coll2: Collection<Item>): AdditionCollection<Item>;
declare class AdditionCollection<Item> extends SetColl<Item> {
  constructor(coll1: Collection<Item>, coll2: Collection<Item>);
}
