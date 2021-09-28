import type { Collection } from '../api';

export function notInCommonColl<Item>(coll1: Collection<Item>, coll2: Collection<Item>): Collection<Item>;
export function xorColl<Item>(coll1: Collection<Item>, coll2: Collection<Item>): Collection<Item>;
