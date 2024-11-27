import type { Collection } from '../api';
import type { ArrayColl } from '../collection/array';

export function subtractColl<Item>(collBase: Collection<Item>, collSubtract: Collection<Item>): SubtractCollection<Item>;
declare class SubtractCollection<Item> extends ArrayColl<Item> {
  constructor(collBase: Collection<Item>, collSubtract: Collection<Item>);
  protected _reconstruct(): void;
}
