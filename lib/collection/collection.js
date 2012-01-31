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
    "mergeColl", "concatColl", "subtractColl", "inCommonColl", "notInCommonColl",
    "addColl", "addCollWithDups", "andColl", "xorColl", // aliases
    "sortColl",
    ];

const { Collection, CollectionObserver, KeyValueCollection } =
    require("./array");
const { ArrayColl } = require("./array");
const { Set } = require("./set");
const { mergeColl, concatDups, subtractColl, inCommonColl, notInCommonColl,
    addColl, addCollWithDups, andColl, xorColl, // aliases
    sortColl } =
    require("./basic-operators");
const { DelegateCollection } = require("./delegate");

for each (let symbolName in EXPORTED_SYMBOLS)
  exports[symbolName] = this[symbolName];
