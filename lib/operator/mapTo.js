import { Collection } from "../api.js"
import { ArrayColl } from "../collection/array.js"
import { concatColls } from "./add-concat.js";
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
 * For each item in `source`, returns multiple items defined by `mapFunc()`.
 * This works like Array.flatMap(), but observes both the source collection and
 * the map result for additions/removals.
 *
 * It's observable, i.e. if `source` changed,
 * mapped items will be added and the observers called.
 * Additionally, the result of the map function is a collection that
 * will also be observed for additionals/removals.
 *
 * @param mapFunc {Function(item)}
 *     The results will be included in the FlatMap
 */
Collection.prototype.flatMap = function (mapFunc) {
  return concatCollsMap(new MapToCollection(this, mapFunc));
}

/** Same as mergeColls(), but accepts normal objects and ignores nulls */
function concatCollsMap(colls) {
  let colls2 = new ArrayColl();
  for (let coll of colls) {
    if (coll == null) {
      continue;
    } else if (coll instanceof Collection) {
      colls2.add(coll);
    } else if (coll instanceof Array) {
      colls2.add(new ArrayColl(coll));
    } else { // plain object
      // TODO inefficient, if there are many normal objects
      colls2.add(new ArrayColl([coll]));
    }
  }
  return concatColls(colls2);
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
    for (let item of source) {
      this._addWithoutObserver(mapFunc(item));
    }

    let observer = new MapToCollectionObserver(this);
    source.registerObserver(observer);
  }
}

class MapToCollectionObserver { // implements CollectionObserver
  constructor(mapToColl) {
    this.mapToColl = mapToColl;
  }

  added(items) {
    this.mapToColl.addAll(items.map((item, i) => this.mapToColl._mapFunc(item, i)));
  }

  removed(items, coll) {
    let mappedRemovedItems = items.map((item, i) => this.mapToColl._mapFunc(item, i));
    this.mapToColl.removeAll(this.mapToColl.filter(mappedItem =>
      mappedRemovedItems.includes(mappedItem)  // TODO Will not work with `Object`s
    ));
  }
}
