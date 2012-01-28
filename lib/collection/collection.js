/**
 * This exports all classes and functions provided by this API,
 * for more convenient importing.
 *
 * @see <https://wiki.mozilla.org/Jetpack/Collections>
 */

const EXPORTED_SYMBOLS = [
    // Base API
    "Collection", "CollectionObserver", "KeyValueCollection",
    // collection impl
    "ArrayColl", "Set",
    "DelegateCollection",
    // operators
    "addColl", "addCollWithDups", "subtractColl", "andColl", "xorColl",
    "sortColl",
    ];

const { Collection, CollectionObserver, KeyValueCollection } =
    require("collection/array");
const { ArrayColl } = require("collection/array");
const { Set } = require("collection/set");
const { addColl, addCollWithDups, subtractColl, andColl, xorColl,
    sortColl } =
    require("collection/basic-operators");
const { DelegateCollection } = require("collection/delegate");

for each (let symbolName in EXPORTED_SYMBOLS)
  exports[symbolName] = this[symbolName];
