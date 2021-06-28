import { Collection } from "./api.js"
import { ArrayColl } from "./array.js"
import { SetColl } from "./set.js"
import { assert } from "./util.js"

/**
 * This allows to merge collections to new collections,
 * based on certain operations like add, subtract, sort.
 *
 * The result collections are not static, but updated dynamically
 * when the base collections change, using observers.
 * The resulting collections can be observed as well, of course,
 * and you can chain operations.
 *
 * @see <https://wiki.mozilla.org/Jetpack/Collections>
 * @see <http://en.wikipedia.org/wiki/Set_theory>
 */

/**
 * Returns a collection that contains all values from coll1 and coll2.
 * If the same item is in both coll1 and coll2, it will be added only once.
 *
 * Union @see <http://en.wikipedia.org/wiki/Union_(set_theory)>
 *
 * @param coll1 {Collection}
 * @param coll2 {Collection}
 * @returns {Collection}
 *     Does not preserve order.
 */
function mergeColl(coll1, coll2) {
  return new AdditionCollection(coll1, coll2);
}
var addColl = mergeColl;

/**
 * Returns a collection that contains all values from coll1 and coll2.
 * If the same item is in both coll1 and coll2, it will be added twice.
 *
 * @param coll1 {Collection}
 * @param coll2 {Collection}
 * @returns {Collection}
 *     Preserves order
 */
function concatColl(coll1, coll2) {
  return new AdditionCollectionWithDups(coll1, coll2);
}
var addCollWithDups = concatColl;

/**
 * Returns a collection that contains all values from collBase,
 * apart from those in collSubtract.
 *
 * Set difference @see <http://en.wikipedia.org/wiki/Set_difference>
 *
 * @param collBase {Collection}
 * @param collSubtract {Collection}
 * @returns {Collection}
 *     Preserves order of collBase.
 */
function subtractColl(collBase, collSubtract) {
  return new SubtractCollection(collBase, collSubtract);
}

/**
 * Returns a collection that contains the values that are contained
 * in *both* coll1 and coll1, and only those.
 *
 * Intersection @see <http://en.wikipedia.org/wiki/Intersection_(set_theory)>
 *
 * @param coll1 {Collection}
 * @param coll2 {Collection}
 * @returns {Collection}
 *     Does not preserve order.
 */
function inCommonColl(coll1, coll2) {
  return new IntersectionCollection(coll1, coll2);
}
var andColl = inCommonColl;

/**
 * Returns a collection that contains all values that are contained
 * only in coll1 or coll2, but *not in both*.
 *
 * Symmetric difference <http://en.wikipedia.org/wiki/Symmetric_difference>
 *
 * @param coll1 {Collection}
 * @param coll2 {Collection}
 * @returns {Collection}
 *     Does not preserve order.
 */
function notInCommonColl(coll1, coll2) {
  return new SubtractCollection(
      new AdditionCollection(coll1, coll2),
      new IntersectionCollection(coll1, coll2));
}
var xorColl = notInCommonColl;



//////////////////////////////
// Implementation classes

/**
 * Shared ctor code for `AdditionCollection*`
 */
function _initAddition(self, coll1, coll2) {
  assert(coll1 instanceof Collection, "must be a Collection");
  assert(coll2 instanceof Collection, "must be a Collection");
  self._coll1 = coll1;
  self._coll2 = coll2;

  // add initial contents
  coll1.forEach(item => self.add(item));
  coll2.forEach(item => self.add(item));

  coll1.registerObserver(self);
  coll2.registerObserver(self);
}

/**
 * Superset
 * Does not allow duplicates
 * E.g. A = abcd, B = bdef, then with addition = abcdef.
 */
class AdditionCollection extends SetColl {
  constructor(coll1, coll2) {
    super();
    _initAddition(this, coll1, coll2);
  }

  // Implement CollectionObserver
  added(items) {
    //this.addAll(items); -- also works, but leaves de-duping to SetColl
    this.addAll(items.filter(item => !this.contains(item)));
  }

  removed(items, coll) {
     // if the item was in both colls, but now is in only one,
     // we need to keep it in the result.
     // SetColl.remove() would not keep it at all anymore.
    //var otherColl = coll == this._coll1 ? this._coll2 : this._coll1;
    //if (otherColl.contains(item))
    //  return;
    this.removeAll(items.filter(item =>
      !(this._coll1.contains(item) || this._coll2.contains(item))
    ));
  }
}

/**
 * Superset
 * Allows duplicates
 * E.g. A = abcd, B = bdef, then addition with dups = abcdbdef.
 */
class AdditionCollectionWithDups extends ArrayColl {
  constructor(coll1, coll2) {
    super();
    _initAddition(this, coll1, coll2);
  }

  // Implement CollectionObserver
  added(items) {
    this.addAll(items);
  }

  removed(items, coll) {
    this.removeAll(items);
  }
}

/**
 * Removes the second coll from the first.
 * E.g. A = abcd, B = bdef, then substract = ac
 */
class SubtractCollection extends ArrayColl {
  constructor(collBase, collSubtract) {
    super();
    assert(collBase instanceof Collection, "must be a Collection");
    assert(collSubtract instanceof Collection, "must be a Collection");
    this._collBase = collBase;
    this._collSubtract = collSubtract;

    // add initial contents
    this._reconstruct();

    var self = this;
    collBase.registerObserver({
      // Implement CollectionObserver
      added : function(items, coll) {
        // add(this) doesn't preserve original order
        var addItems = items.filter(item => !self._collSubtract.contains(item));
        if (addItems.length) {
          self._reconstruct();
          self._notifyAdded(addItems);
        }
      },
      removed : function(items, coll) {
        items.forEach(item => {
          if (self._collSubtract.contains(item)) {
            return;
          }
          self.removeEach(item);
        });
      },
    });
    collSubtract.registerObserver({
      // Implement CollectionObserver
      added : function(items, coll) {
        self.removeAll(items);
      },
      removed : function(items, coll) {
        // add(this) -- doesn't preserve original order
        var addItems = items.filter(item => self._collBase.contains(item));
        if (addItems.length) {
          self._reconstruct();
          self._notifyAdded(addItems);
        }
      },
    });
  }

  _reconstruct() {
    var sub = this._collSubtract;
    this._collBase.forEach(item => {
      if ( !sub.contains(item)) {
        this._addWithoutObserver(item);
      }
    });
  }
}

/**
 * Returns a subset of `source`.
 * Which items will be included is defined by `filterFunc`.
 * This works like Array.filter().
 *
 * It's observable, i.e. if `source` changed and `filterFunc` matches,
 * items will be added and the observers called.
 *
 * @param source {Collection}   Another collection that is to be filtered
 * @param filterFunc {Function(item)}
 *     `item` will be included in FilteredCollection, (only) if `true` is returned
 */
class FilteredCollection extends ArrayColl {
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
class MapToCollection extends ArrayColl {
  constructor(source, mapFunc) {
    super();
    assert(typeof(mapFunc) == "function", "must be a function");
    assert(source instanceof Collection, "must be a Collection");
    //this._source = source;
    this._mapFunc = mapFunc;

    // add initial contents
    source.forEach(item => this._addWithoutObserver(mapFunc(item)));

    source.registerObserver(this);
  }

  // Implement CollectionObserver
  added(items) {
    this.addAll(items.map(item => this._mapFunc(item)));
  }

  removed(items, coll) {
    var mappedRemovedItems = items.map(item => this._mapFunc(item));
    this.removeAll(this.filter(mappedItem =>
      mappedRemovedItems.indexOf(mappedItem) != -1  // TODO Will not work with `Object`s
    ));
  }
}

/**
 * Returns a new collection that is sorted using the `sortFunc`.
 *
 * @param source {Collection}   Another collection that is to be sorted
 * @param sortFunc {Function(itemA, itemB): boolean} itemA <= itemB
 *     If true: itemA before itemB.
 *     If false: itemB before itemA.
 *     Note: The result is boolean, not a number like `compareFunc` used by `Array.sort()`.
 */
class SortedCollection extends ArrayColl {
  constructor(source, sortFunc) {
    super();
    assert(typeof(sortFunc) == "function", "must be a function");
    assert(source instanceof Collection, "must be a Collection");
    this._source = source;
    this._sortFunc = sortFunc;

    // add initial contents
    this.addAll(source.contents.sort((a, b) => sortFunc(a, b) ? -1 : 1));

    source.registerObserver(this);
  }

  // Implement CollectionObserver
  added(items) {
    // TODO re-implement by sorting only the new items,
    // then call the observer for those only (all at once)
    this.removeAll(this._source.contents);
    this.addAll(this._source.contents.sort((a, b) => this._sortFunc(a, b) ? -1 : 1));
  }

  removed(items) {
    this.removeAll(items);
  }
}

/**
 * Has only those items that are in both coll1 and in coll2.
 * E.g. A = abcd, B = bdef, then intersection = bd.
 */
class IntersectionCollection extends SetColl {
  constructor(coll1, coll2) {
    super();
    assert(coll1 instanceof Collection, "must be a Collection");
    assert(coll2 instanceof Collection, "must be a Collection");
    this._coll1 = coll1;
    this._coll2 = coll2;

    // add initial contents
    coll1.forEach(item => {
      if (coll2.contains(item)) {
        this._addWithoutObserver(item);
      }
    });

    coll1.registerObserver(this);
    coll2.registerObserver(this);
  }

  // Implement CollectionObserver
  added(items) {
    this.addAll(items.filter(item =>
      this._coll1.contains(item) &&
      this._coll2.contains(item) &&
      !this.contains(item)
    ));
  }

  removed(items, coll) {
    this.removeAll(items.filter(item => this.contains(item)));
  }
}
