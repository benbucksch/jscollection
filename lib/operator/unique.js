import { Collection } from "../api.js"
import { SetColl } from "../collection/set.js"
import { assert } from "../util.js"

Collection.prototype.unique = function (equalFunc = null) {
  return new UniqueCollection(this, equalFunc);
}

/**
 * Returns a new collection where each item is contained only once.
 *
 * @param source {Collection}   Another collection that is to be filtered
 * @param equalFunc {Function(item, item): boolean}
 *   TODO not used
 *   Called to check whether 2 items are identical.
 *   You can either require object identity, i.e. `(a, b) => a === b` (the default),
 *   or compare the values or ID, e.g. `(a, b) => a.id == b.id`.
 */
export class UniqueCollection extends SetColl {
  _observer = null;
  constructor(source, equalFunc = null) {
    super();
    assert(equalFunc == null || typeof (equalFunc) == "function", "must be a function");
    assert(source instanceof Collection, "must be a Collection");
    this._source = source;
    this._equalFunc = equalFunc;

    this._observer = new UniqueCollectionObserver(this);
    source.registerObserver(this._observer);

    // add initial contents
    this._observer.added(source);
  }
}

class UniqueCollectionObserver { // implements CollectionObserver
  constructor(uniqueColl) {
    this.uniqueColl = uniqueColl;
  }

  added(items) {
    if (this.uniqueColl._equalFunc) {
      for (let addItem of items) {
        if (this.uniqueColl.contents.some(existing =>
          this.uniqueColl._equalFunc(existing, addItem))) {
          continue;
        }
        if (addItem != null) { // Set doesn't allow null/undefined
          this.uniqueColl.add(addItem);
        }
      }
    } else {
      this.uniqueColl.addAll(items
        .filter(item => item != null));
    }
  }

  removed(items, coll) {
    if (this.uniqueColl._equalFunc) {
      this.uniqueColl.removeAll(items.filter(removeItem =>
        !this.uniqueColl._source.contents.some(remaining =>
          this.uniqueColl._equalFunc(remaining, removeItem))));
    } else {
      this.uniqueColl.removeAll(items.filter(removeItem =>
        !this.uniqueColl._source.contains(removeItem)));
    }
  }
}
