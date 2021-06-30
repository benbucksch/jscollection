import { Collection } from "../api.js"
import { ArrayColl } from "../collection/array.js"
import { assert } from "../util.js"

/**
 * Removes the second coll from the first.
 * I.e. returns a collection that contains all values from `collBase`,
 * apart from those in `collSubtract`.
 *
 * E.g. A = abcd, B = bdef, then subtract = ac
 *
 * Set difference @see <http://en.wikipedia.org/wiki/Set_difference>
 *
 * @param collBase {Collection}
 * @param collSubtract {Collection}
 * @returns {Collection}
 *     Preserves order of `collBase`.
 */
export function subtractColl(collBase, collSubtract) {
  return new SubtractCollection(collBase, collSubtract);
}

/**
 * Removes the second coll from the first.
 * I.e. returns a collection that contains all values from `collBase`,
 * apart from those in `collSubtract`.
 *
 * E.g. A = abcd, B = bdef, then substract = ac
 *
 * Set difference @see <http://en.wikipedia.org/wiki/Set_difference>
 *
 * @param collSubtract {Collection}
 * @returns {Collection}
 *     Preserves order of the base collection.
 */
Collection.prototype.subtract = function(subtractColl) {
  return new SubtractCollection(this, subtractColl);
}


/**
 * Removes the second coll from the first.
 * I.e. returns a collection that contains all values from `collBase`,
 * apart from those in `collSubtract`.
 *
 * E.g. A = abcd, B = bdef, then substract = ac
 *
 * Set difference @see <http://en.wikipedia.org/wiki/Set_difference>
 */
export class SubtractCollection extends ArrayColl {
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
