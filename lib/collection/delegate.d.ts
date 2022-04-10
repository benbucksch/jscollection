import type { Collection } from '../api';

declare class DelegateCollection<Item> extends Collection<Item> {
  constructor(base: Collection<Item>);
  subscribe(subscription: (value: DelegateCollection<Item>) => void): (() => void);
}
