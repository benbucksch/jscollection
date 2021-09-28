import type {  KeyValueCollection } from '../api';

declare class MapColl<Item> extends KeyValueCollection<Item> {
  constructor();
  contentKeys(): Array<Item>;
  contentKeyValues(): any;
}
