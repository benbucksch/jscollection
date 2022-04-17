import { Collection } from "../api.js"
import { ArrayColl } from "../collection/array.js"
import { assert } from "../util.js"


/**
 * For each item in `source`, returns another item defined by `mapFunc()`.
 * This works like Array.map().
 *
 * It's observable, i.e. if `source` changed,
 * mapped items will be added and the observers called.
 * TODO removed() observer may not work properly
 *
 * @param mapFunc {Function(item)}
 *     The result will be included in MapToCollection
 */
Collection.prototype.map = function (mapFunc) {
  return new MapToCollection(this, mapFunc);
}


/**
 * For each item in `source`, returns another item defined by `mapFunc()`.
 * This works like Array.map().
 *
 * It's observable, i.e. if `source` changed,
 * mapped items will be added and the observers called.
 * TODO removed() observer may not work properly
 *
 * @param source {Collection}   Another collection that is to be filtered
 * @param mapFunc {Function(item)}
 *     The result will be included in MapToCollection
 */
export class MapToCollection extends ArrayColl {
  constructor(source, mapFunc) {
    super();
    assert(typeof (mapFunc) == "function", "must be a function");
    assert(source instanceof Collection, "must be a Collection");
    //this._source = source;
    this._mapFunc = mapFunc;

    // add initial contents
    source.forEach(item => this._addWithoutObserver(mapFunc(item)));

    let observer = new MapToCollectionObserver(this);
    source.registerObserver(observer);
  }
}

class MapToCollectionObserver { // implements CollectionObserver
  constructor(mapToColl) {
    this.mapToColl = mapToColl;
  }

  added(items) {
    this.mapToColl.addAll(items.map(item => this.mapToColl._mapFunc(item)));
  }

  removed(items, coll) {
    let mappedRemovedItems = items.map(item => this.mapToColl._mapFunc(item));
    this.mapToColl.removeAll(this.mapToColl.filter(mappedItem =>
      mappedRemovedItems.indexOf(mappedItem) != -1  // TODO Will not work with `Object`s
    ));
  }
}
