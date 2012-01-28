/**
 * This exports all classes and functions provided by this API,
 * for more convenient importing.
 *
 * @see <https://wiki.mozilla.org/Jetpack/Collections>
 */

const EXPORTED_SYMBOLS = [
    "Collection", "CollectionObserver", // API
    "ArrayColl", // collection impl
    ];

const { Collection, CollectionObserver } = require("collection/array");
const { ArrrayColl } = require("collection/array");
const { addColl, substractColl, sortColl } = require("collection/basic-operators");

for each (let symbolName in EXPORTED_SYMBOLS)
  exports[symbolName] = this[symbolName];
