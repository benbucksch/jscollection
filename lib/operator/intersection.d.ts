import type { Collection } from '../api';
import type { SetColl } from '../collection/set';

export function inCommonColl<Item>(coll1: Collection<Item>, coll2: Collection<Item>): IntersectionCollection<Item>;
export function intersectionColl<Item>(coll1: Collection<Item>, coll2: Collection<Item>): IntersectionCollection<Item>;
declare class IntersectionCollection<Item> extends SetColl<Item> {
  constructor(coll1: Collection<Item>, coll2: Collection<Item>);
}
