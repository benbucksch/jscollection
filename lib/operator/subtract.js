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
  _baseObserver = null;
  _subtractObserver = null;
  constructor(collBase, collSubtract) {
    super();
    assert(collBase instanceof Collection, "must be a Collection");
    assert(collSubtract instanceof Collection, "must be a Collection");
    this._collBase = collBase;
    this._collSubtract = collSubtract;

    // add initial contents
    this._reconstruct();

    this._baseObserver = new SubtractBaseObserver(this);
    collBase.registerObserver(this._baseObserver);
    this._subtractObserver = new SubtractSubstractedObserver(this);
    collSubtract.registerObserver(this._subtractObserver);
  }

  _reconstruct() {
    this._array = this._collBase.contents.filter(item => !this._collSubtract.contains(item));
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
    this.resultColl.removeAll(items);
  }
}

class SubtractSubstractedObserver { // implements CollectionObserver
  constructor(resultColl) {
    this.resultColl = resultColl;
  }

  added(items) {
    for (let item of items) {
      this.resultColl.removeEach(item);
    }
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
