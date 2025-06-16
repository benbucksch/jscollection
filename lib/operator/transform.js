import { Collection } from "../api.js"
import { ArrayColl } from "../collection/array.js"
import { assert } from "../util.js"

/**
 * Returns a new collection that is based on another collection,
 * which is then transformed by a function into a new collection.
 * Unlike the map() operator, the transformation happens on the entire
 * collection, not just individual items.
 *
 * This is a fast way to implement operators, but it results in slow
 * execution time, because the entire result collection must be
 * recalculated every time items are added ot removed to the base collection.
 * Often, it is better not to use this class and to instead implement the observers
 * on an item level. E.g. a sort operator should look where the new items belong
 * in the result collection, and then specifically insert them there, instead of
 * recalculating the entire result collection every time, which this class does.
 * So, this is really just a cheap shortcut implementation until you have time
 * or need to implement the operator observers properly.
 *
 * The observers will be called only for those items where the result
 * of the transformFunc differs from the previous state.
 * So, downstream gets minimal observer notifications, even though
 * transformFunc recalculates everything every time.
 * In other words, this implementation is slow, but at least the downstream
 * will be isolated from it and still get minimal notifications.
 *
 * @param source {Collection}   Another collection that is to be sorted
 * @param transformFunc {Function(Collection): Array}
 *   Called once when the class is created, and then each time
 *   items are added or removed to the source collection.
 */
export class TransformedCollection extends ArrayColl {
  constructor(source, transformFunc) {
    super();
    assert(typeof (transformFunc) == "function", "must be a function");
    assert(source instanceof Collection, "must be a Collection");
    this._source = source;
    this._transformFunc = transformFunc;

    // add initial contents
    let initialContents = transformFunc(source);
    assert(Array.isArray(initialContents), "transformFunc must return a JS Array");
    this.addAll(initialContents);

    let observer = new TransformedCollectionObserver(this);
    source.registerObserver(observer);
  }

  _recalculate() {
    let oldItems = this.contents;

    this._array = this._transformFunc(this._source);

    // Calculate what changed, to notify observers only for those items
    let newItems = this.contents;
    let addedItems = newItems.filter(item => !oldItems.includes(item));
    let removedItems = oldItems.filter(item => !newItems.includes(item));
    // find items that only changed place
    let oldCommonItems = oldItems.filter(item => newItems.includes(item));
    let newCommonItems = newItems.filter(item => oldItems.includes(item));
    let movedItems = newCommonItems.filter((item, i) => item != oldCommonItems[i]);
    if (addedItems.length || movedItems.length) {
      this._notifyAdded(addedItems.concat(movedItems));
    }
    if (removedItems.length || movedItems.length) {
      this._notifyRemoved(removedItems.concat(movedItems));
    }
    // TODO wrongly notifies all following items, if there are duplicate items
    // console.log("transform observer", "old", oldItems, "new", newItems, "added", addedItems, "removed", removedItems, "moved", movedItems, "oldcommon", oldCommonItems, "newcommon", newCommonItems);
  }
}

class TransformedCollectionObserver { // implements CollectionObserver
  constructor(transformedColl) {
    this.transformedColl = transformedColl;
  }

  added(items) {
    this.transformedColl._recalculate();
  }

  removed(items, coll) {
    this.transformedColl._recalculate();
  }
}

ArrayColl.prototype.slice = function(start, end) {
  return new TransformedCollection(this, source => source._array
    .slice(start, end));
}

/**
 * Unlike JS Array, this is not in-place, but returns a new ArrayColl.
 */
ArrayColl.prototype.reverse = function() {
  return new TransformedCollection(this, source => source.contents
    .reverse());
}

ArrayColl.prototype.flat = function() {
  return new TransformedCollection(this, source => source._array
    .flat());
}

// flatMap defined in mapTo.js for all collections
