const { Collection } = require("./api.js");
const { ArrayColl } = require("./array.js");
const { assert } = require("./util.js");

/**
 * A `Collection` which wraps a DOMNodeList.
 * It is static, i.e. changes in the DOM are not reflected here.
 */
class DOMColl extends ArrayColl {
  /**
   * @param domlist {DOM NodeList}
   */
  constructor(domlist) {
    super();
    assert(typeof(domlist.item) == "function", "Not a DOMNodeList");
    var array = [];
    for (let i = 0, l = domlist.length; i < l; i++) {
      array.push(domlist[i]);
    }
  }

  add(value) {
    throw "immutable";
  }

  remove(value) {
    throw "immutable";
  }

  clear() {
    throw "immutable";
  }
}

/**
 * A `Collection` which wraps a DOMNodeList.
 * Changes in the DOM will be reflected here and
 * be sent to the observers.
 * TODO Not yet implemented
 *
class DynamicDOMColl extends Collection {
  constructor(domlist) {
    super();
    assert(typeof(domlist.item) == "function", "Not a DOMNodeList");
    this._domlist = domlist;
  }

  add(el) {
    throw "immutable";
  }

  remove(el) {
    throw "immutable";
  }

  clear() {
    this._notifyRemoved(this.contents, this);
    this._domlist = [];
  },

  get length() {
    return this._domlist.length;
  }

  get contents() {
    var array = [];
    for (let i = 0, l = this._domlist.length; i < l; i++) {
      let item = this._domlist.item(i);
      array.push(item);
    }
    return array;
  }

  forEach(callback) {
    for (let i = 0, l = this._domlist.length; i < l; i++) {
      let item = this._domlist[i];
      callback(item);
    }
  }
}
*/

exports.DOMColl = DOMColl;
