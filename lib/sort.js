/**
 * Implements sort operator
 */
const { Collection, CollectionObserver } = require("./api");
const { ArrayColl } = require("./array");
const { Set } = require("./set");
const util = require("./util");

/**
 * Returns a new collection that is sorted based on the |sortFunc|.
 *
 * TODO Stable sort, even with observers?
 *
 * @param coll {Collection}
 * @param sortFunc(a {Item}, b {Item})
 *     returns {Boolean} a > b // TODO stable sort? {Integer: -1: <, 0: =, 1: >}
 * @returns {Collection}
 */
function sortColl(coll, sortFunc) {
  throw new "not yet implemented"
}

exports.sortColl = sortColl;
