import { Collection } from "../api.js"
import { ArrayColl } from "../collection/array.js"
import { assert } from "../util.js"

/**
 * Returns a subset of the source collection.
 * Which items will be included is defined by `filterFunc`.
 * This works like `Array.filter()`.
 *
 * It's observable, i.e. if the source collection changed and `filterFunc` matches,
 * items will be added and the observers called.
 *
 * @param filterFunc {Function(item)}
 *     `item` will be included in FilteredCollection, (only) if `true` is returned
 */
Collection.prototype.filter = function(filterFunc) {
  return new FilteredCollection(this, filterFunc);
}


/**
 * Returns a subset of the source collection.
 * Which items will be included is defined by `filterFunc`.
 * This works like `Array.filter()`.
 *
 * It's observable, i.e. if the source collection changed and `filterFunc` matches,
 * items will be added and the observers called.
 *
 * @param source {Collection}   Another collection that is to be filtered
 * @param filterFunc {Function(item)}
 *     `item` will be included in FilteredCollection, (only) if `true` is returned
 */
export class FilteredCollection extends ArrayColl {
  constructor(source, filterFunc) {
    super();
    assert(typeof(filterFunc) == "function", "must be a function");
    assert(source instanceof Collection, "must be a Collection");
    //this._source = source;
    this._filterFunc = filterFunc;

    // add initial contents
    source.forEach(item => {
      if (filterFunc(item)) {
        this._addWithoutObserver(item);
      }
    });

    source.registerObserver(this);
  }

  // Implement CollectionObserver
  added(items) {
    this.addAll(items.filter(item => this._filterFunc(item)));
  }

  removed(items, coll) {
    this.removeAll(items.filter(item => this.contains(item)));
  }
}
