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
Collection.prototype.subtract = function (subtractColl) {
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

    collBase.registerObserver(new SubtractBaseObserver(this));
    collSubtract.registerObserver(new SubtractSubstractedObserver(this));
  }

  _reconstruct() {
    let sub = this._collSubtract;
    this._collBase.forEach(item => {
      if (!sub.contains(item)) {
        this._addWithoutObserver(item);
      }
    });
  }
}


class SubtractBaseObserver { // implements CollectionObserver
  constructor(resultColl) {
    this.resultColl = resultColl;
  }

  added(items) {
    // add(this) doesn't preserve original order
    var addItems = items.filter(item => !this.resultColl._collSubtract.contains(item));
    if (addItems.length) {
      this.resultColl._reconstruct();
      this.resultColl._notifyAdded(addItems);
    }
  }

  removed(items, coll) {
    items.forEach(item => {
      if (this.resultColl._collSubtract.contains(item)) {
        return;
      }
      this.resultColl.removeEach(item);
    });
  }
}

class SubtractSubstractedObserver { // implements CollectionObserver
  constructor(resultColl) {
    this.resultColl = resultColl;
  }

  added(items) {
    this.resultColl.removeAll(items);
  }

  removed(items, coll) {
    // add(this) -- doesn't preserve original order
    let addItems = items.filter(item => this.resultColl._collBase.contains(item));
    if (addItems.length) {
      this.resultColl._reconstruct();
      this.resultColl._notifyAdded(addItems);
    }
  }
}
