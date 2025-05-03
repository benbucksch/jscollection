import type { Collection } from '../api';
import type { ArrayColl } from '../collection/array';

/**
 * Returns a subset of the source collection.
 * Which items will be included is defined by `filterFunc`.
 * This works like `Array.filter()`.
 *
 * It's observable, i.e. if the source collection changed and `filterFunc` matches,
 * items will be added and the observers called.
 *
 * It's also observing. It will observe all items.
 * If their properties change and the item now matches or
 * nor longer matches, it will be added to or removed from the filtered result.
 *
 * Implementation note:
 * This works only 1 level deep, i.e. only direct properties of the added items
 * are observed, not when the item references another item and the
 * condition depends on that. This limitation should be lifted some time, so
 * don't depend on this *not* working, either.
 *
 * @param source {Collection}   Another collection that is to be filtered
 * @param filterFunc {Function(item)}
 *     `item` will be included in FilteredCollection, (only) if `true` is returned
 */
declare class ObservableFilteredCollection<Item> extends ArrayColl<Item> {
  constructor(source: Collection<Item>, filterFunc: (item: Item) => boolean);
}

/**
 * Returns a subset of the source collection.
 * Which items will be included is defined by `filterFunc`.
 * This works like `Array.filter()`.
 *
 * It's observable, i.e. if the source collection changed and `filterFunc` matches,
 * items will be added and the observers called.
 *
 * @deprecated
 * However, if any of the items change their properties and are now
 * matching or not matching anymore, the result will *not* change.
 *
 * @param source {Collection}   Another collection that is to be filtered
 * @param filterFunc {Function(item)}
 *     `item` will be included in FilteredCollection, (only) if `true` is returned
 */
declare class FilteredCollection<Item> extends ArrayColl<Item> {
  constructor(source: Collection<Item>, filterFunc: (item: Item) => boolean);
}
