import type { Collection } from '../api';
import type { SetColl } from '../collection/set';

export function mergeColl<Item>(...coll: Collection<Item>[]): AdditionCollection<Item>;
export function addColl<Item>(...coll: Collection<Item>[]): AdditionCollection<Item>;
export function mergeColls<Item>(colls: Collection<Collection<Item>>): AdditionCollection<Item>;
declare class AdditionCollection<Item> extends SetColl<Item> {
  constructor();
  addColl(coll: Collection<Item>);
}
