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

const EXPORTED_SYMBOLS = [
    "mergeColl", "concatColl", "subtractColl", "inCommonColl", "notInCommonColl",
    "addColl", "addCollWithDups", "andColl", "xorColl",
    ];

const { Collection, CollectionObserver } = require("./api");
const { ArrayColl } = require("./array");
const { Set } = require("./set");
const util = require("./util");

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
 * Returns a collection that contains all values that are contained
 * in *both* coll1 and coll1.
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
 * Shared ctor code for |AdditionCollection*|
 */
function initAddition(self, coll1, coll2) {
  util.assert(coll1 instanceof Collection, "must be a Collection");
  util.assert(coll2 instanceof Collection, "must be a Collection");
  self._coll1 = coll1;
  self._coll2 = coll2;

  // add initial contents
  for each (let item in coll1)
    self.add(item);
  for each (let item in coll2)
    self.add(item);

  coll1.registerObserver(self);
  coll2.registerObserver(self);
}

/**
 * Does not allow duplicates
 */
function AdditionCollection(coll1, coll2) {
  Set.call(this);
  initAddition(this, coll1, coll2);
}
AdditionCollection.prototype = {
  // Implement CollectionObserver
  added : function(item) {
    this.add(item);
  },
  removed : function(item, coll) {
     // if the item was in both colls, but now is in only one,
     // we need to keep it in the result.
     // Set.remove() would not keep it at all anymore.
    //var otherColl = coll == this._coll1 ? this._coll2 : this._coll1;
    //if (otherColl.contains(item))
    //  return;
    if (this._coll1.contains(item) || this._coll2.contains(item))
      return;
    this.remove(item);
  },
}
util.extend(AdditionCollection, Set);

/**
 * Allows duplicates
 */
function AdditionCollectionWithDups(coll1, coll2) {
  ArrayColl.call(this);
  initAddition(this, coll1, coll2);
}
AdditionCollection.prototype = {
  // Implement CollectionObserver
  added : function(item) {
    this.add(item);
  },
  removed : function(item, coll) {
    this.remove(item);
  },
}
util.extend(AdditionCollection, ArrayColl);


function SubtractCollection(collBase, collSubtract) {
  ArrayColl.call(this);
  util.assert(collBase instanceof Collection, "must be a Collection");
  util.assert(collSubtract instanceof Collection, "must be a Collection");
  this._collBase = collBase;
  this._collSubtract = collSubtract;

  // add initial contents
  this._reconstruct();

  var self = this;
  collBase.registerObserver({
    // Implement CollectionObserver
    added : function(item, coll) {
      if (self._collSubtract.contains(item))
        return;
      // this.add(this); -- doesn't preserve original order
      self._reconstruct();
      self._notifyAdded(item);
    },
    removed : function(item, coll) {
      if (self._collSubtract.contains(item))
        return;
      self.removeEach(item);
    },
  });
  collSubtract.registerObserver({
    // Implement CollectionObserver
    added : function(item, coll) {
      self.removeEach(item);
    },
    removed : function(item, coll) {
      if (self._collBase.contains(item)) {
        // this.add(this); -- doesn't preserve original order
        self._reconstruct();
        self._notifyAdded(item);
      }
    },
  });
}
SubtractCollection.prototype = {
  _reconstruct : function() {
    var sub = this._collSubtract;
    for each (let item in this._collBase) {
      if ( !sub.contains(item))
        this._addWithoutObserver(item);
    }
  },
}
util.extend(SubtractCollection, ArrayColl);



function IntersectionCollection(coll1, coll2) {
  Set.call(this);
  util.assert(coll1 instanceof Collection, "must be a Collection");
  util.assert(coll2 instanceof Collection, "must be a Collection");
  this._coll1 = coll1;
  this._coll2 = coll2;

  // add initial contents
  for each (let item in coll1) {
    if (coll2.contains(item))
      this._addWithoutObserver(item);
  }

  coll1.registerObserver(this);
  coll2.registerObserver(this);
}
IntersectionCollection.prototype = {
  // Implement CollectionObserver
  added : function(item) {
    if (this._coll1.contains(item) &&
        this._coll2.contains(item) &&
        !this.contains(item)) {
      this.add(item);
    }
  },
  removed : function(item, coll) {
    if ( !this.contains(item))
      return;
    this.remove(item);
  },
}
util.extend(IntersectionCollection, Set);



for each (let symbolName in EXPORTED_SYMBOLS)
  exports[symbolName] = this[symbolName];
