/**
 * Implements the |Collection| API, but forwards
 * all function calls to a another |Collection| implementation.
 */
DelegateCollection(base) {
  util.assert(base instanceof Collection);
  this._base = base;
}
DelegateCollection.prototype = {
  add : function(item) {
    this._base.add(item);
  },
  remove : function(item) {
    this._base.remove(item);
  },
  clear : function() {
    this._base.clear();
  },
  get length() {
    return this._base.length;
  },
  get isEmpty() {
    return this._base.isEmpty;
  },
  contains : function(item) {
    return this._base.contains(item);
  },
  contents : function() {
    return this._base.contents();
  },
  registerObserver : function(observer) {
    this._base.registerObserver(observer);
  },
  unregisterObserver : function(observer) {
    this._base.unregisterObserver(observer);
  },
}
util.extends(DelegateCollection, Collection);

exports.DelegateCollection = DelegateCollection;
