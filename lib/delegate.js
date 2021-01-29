import { assert } from "./util.js"

/**
 * Implements the `Collection` API, but forwards
 * all function calls to a another `Collection` implementation.
 */
export class DelegateCollection extends Collection {
  constructor(base) {
    super();
    this._observers = null;
    assert(base instanceof Collection);
    this._base = base;
  }

  add(item) {
    this._base.add(item);
  }
  remove(item) {
    this._base.remove(item);
  }
  clear() {
    this._base.clear();
  }
  get length() {
    return this._base.length;
  }
  get isEmpty() {
    return this._base.isEmpty;
  }
  contains(item) {
    return this._base.contains(item);
  }
  get contents() {
    return this._base.contents;
  }
  get first() {
    return this._base.first;
  }
  getIndex(i) {
    return this._base.getIndex(i);
  }
  getIndexRange(i, length) {
    return this._base.getIndexRange(i, length);
  }
  forEach(callback) {
    this._base.forEach(callback);
  }
  registerObserver(observer) {
    this._base.registerObserver(observer);
  }
  unregisterObserver(observer) {
    this._base.unregisterObserver(observer);
  }
}
