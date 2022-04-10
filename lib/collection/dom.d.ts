import type { Collection } from '../api';
import type { ArrayColl } from './array';

declare class DOMColl<Item> extends ArrayColl<Item> {
  constructor(domlist: NodeList);
  subscribe(subscription: (value: DOMColl<Item>) => void): (() => void);
}
declare class DynamicDOMColl<Item> extends Collection<Item> {
  constructor(domlist: NodeList);
  subscribe(subscription: (value: DynamicDOMColl<Item>) => void): (() => void);
}
