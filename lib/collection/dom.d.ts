import type { Collection } from '../api';
import type { ArrayColl } from './array';

declare class DOMColl<Item> extends ArrayColl<Item> {
  constructor(domlist: NodeList);
}
declare class DynamicDOMColl<Item> extends Collection<Item> {
  constructor(domlist: NodeList);
}
