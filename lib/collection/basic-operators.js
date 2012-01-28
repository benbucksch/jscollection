/**
 * This allows to merge collections to new collections,
 * based on certain operations like add, subtract, sort.
 *
 * The result collections are not static, but updated dynamically
 * when the base collections change, using observers.
 * The resulting collections can be observed as well, of course,
 * and you can chain operations.
 *
 * @see <https://wiki.mozilla.org/Jetpack/Collections>
 */

const EXPORTED_SYMBOLS = [ "addColl", "subtractColl", "sortColl", ];

const { Collection, CollectionObserver } = require("collection/api");
const { ArrayColl } = require("collection/array");
const util = require("collection/util");

/**
 * @returns {Collection}
 */
function addColl(coll1, coll2) {
}

function subtractColl(collBase, collSubtract) {
}

function sortColl(coll, sortFunc) {
}


for each (let symbolName in EXPORTED_SYMBOLS)
  exports[symbolName] = this[symbolName];
