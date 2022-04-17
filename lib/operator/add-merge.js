import { Collection } from "../api.js"
import { SetColl } from "../collection/set.js"
import { _initAddition } from "./add-concat.js"

/**
 * Returns a collection that contains all values from `coll1` and `coll2`.
 * If the same item is in both `coll1` and `coll2`, it will be added only once.
 *
 * E.g. A = abcd, B = bdef, then result = abcdef.
 *
 * Union @see <http://en.wikipedia.org/wiki/Union_(set_theory)>
 *
 * @param coll1 {Collection}
 * @param coll2 {Collection}
 * @returns {Collection}
 *     Does not preserve order.
 */
export function mergeColl(coll1, coll2) {
  return new AdditionCollection(coll1, coll2);
}

const addColl = mergeColl;

/**
 * Returns a collection that contains all values from this coll and `otherColl`.
 * If the same item is in both the this coll and `otherColl`, it will be added only once.
 *
 * E.g. A = abcd, B = bdef, then result = abcdef.
 *
 * Union @see <http://en.wikipedia.org/wiki/Union_(set_theory)>
 *
 * @param otherColl {Collection}
 * @returns {Collection}
 *     Does not preserve order.
 */
Collection.prototype.merge = function (otherColl) {
  return new AdditionCollection(this, otherColl);
}


/**
 * Superset
 * Does not allow duplicates
 * E.g. A = abcd, B = bdef, then result = abcdef.
 */
export class AdditionCollection extends SetColl {
  constructor(coll1, coll2) {
    super();
    _initAddition(this, coll1, coll2);

    let observer = new AdditionCollectionObserver(this);
    coll1.registerObserver(observer);
    coll2.registerObserver(observer);
  }
}

class AdditionCollectionObserver { // implements CollectionObserver
  constructor(addColl) {
    this.addColl = addColl;
  }

  added(items) {
    //this.addColl.addAll(items); -- also works, but leaves de-duping to SetColl
    this.addColl.addAll(items.filter(item => !this.addColl.contains(item)));
  }

  removed(items, coll) {
    // if the item was in both colls, but now is in only one,
    // we need to keep it in the result.
    // SetColl.remove() would not keep it at all anymore.
    //let otherColl = coll == this.addColl._coll1 ? this.addColl._coll2 : this.addColl._coll1;
    //if (otherColl.contains(item)) return;
    this.addColl.removeAll(items.filter(item =>
      !(this.addColl._coll1.contains(item) || this.addColl._coll2.contains(item))
    ));
  }
}
