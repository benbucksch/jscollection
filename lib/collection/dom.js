import { ArrayColl } from "./array.js"
import { assert } from "../util.js"

/**
 * A `Collection` which wraps a DOMNodeList.
 * It is static, i.e. changes in the DOM are not reflected here.
 */
export class DOMColl extends ArrayColl {
  /**
   * @param domlist {DOM NodeList}
   */
  constructor(domlist) {
    assert(typeof (domlist.item) == "function", "Not a DOMNodeList");
    super();
    for (let i = 0, l = domlist.length; i < l; i++) {
      this._array.push(domlist[i]);
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
export class DynamicDOMColl extends Collection {
  constructor(domlist) {
    assert(typeof(domlist.item) == "function", "Not a DOMNodeList");
    super();
    this._domlist = domlist;
  }

  add(el) {
    ...
  }

  remove(el) {
    ...
  }

  clear() {
    this.removeAll(this.contents);
  },

  get length() {
    return this._domlist.length;
  }

  get contents() {
    var array = [];
    for (let i = 0, l = this._domlist.length; i < l; i++) {
      array.push(this._domlist.item(i));
    }
    return array;
  }

  forEach(func) {
    for (let i = 0, l = this._domlist.length; i < l; i++) {
      let item = this._domlist[i];
      func(item);
    }
  }
}
*/
