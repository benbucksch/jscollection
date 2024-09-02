/**
 * Like Set, but with weak references.
 * Like WeakSet, but iterable.
 *
 * Not a `Collection`. Does not implement the whole `Set` API.
 */
export class WeakSetIterable {
  constructor() {
    this._set = new Set();
  }

  /**
   * Adds this item to the end of the array.
   *
   * You can add them same object several times.
   */
  add(item) {
    if (this.has(item)) {
      return;
    }
    this._set.add(new WeakRef(item));
  }

  remove(item) {
    this.delete(item);
  }

  delete(item) {
    let weakref = this._findWeakRef(item);
    if (weakref === undefined) {
      return;
    }
    this._set.delete(weakref);
  }

  _findWeakRef(item) {
    for (let weakref of this._set) {
      let i = weakref.deref();
      if (i === undefined) {
        this._set.delete(weakref);
      } else if (i === item) {
        return weakref;
      }
    }
    return undefined;
  }

  has(item) {
    return !!this._findWeakRef(item);
  }

  clear() {
    this._set.clear();
  }

  get size() {
    return this._set.size;
  }

  get length() {
    return this._set.size;
  }

  *[Symbol.iterator]() {
    for (let weakref of this._set) {
      let item = weakref.deref();
      if (item === undefined) {
        this._set.delete(weakref);
      } else {
        yield item;
      }
    }
  }
}
