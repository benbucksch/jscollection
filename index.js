/**
 * This exports all classes and functions provided by this API,
 * for more convenient importing.
 */

const api = require("./lib/api.js");
const operators = require("./lib/basic-operators.js");
const sort = require("./lib/sort.js");
const array = require("./lib/array.js");
const map = require("./lib/map.js");
const set = require("./lib/set.js");
const dom = require("./lib/dom.js");
const delegate = require("./lib/delegate.js");

exports.Collection = api.Collection;
exports.KeyValueCollection = api.KeyValueCollection;
exports.CollectionObserver = api.CollectionObserver;
exports.ArrayColl = array.ArrayColl;
exports.SetColl = set.SetColl;
exports.MapColl = set.MapColl;
exports.DOMColl = dom.DOMColl;
exports.DelegateCollection = delegate.DelegateCollection;

exports.AdditionCollection = operators.AdditionCollection;
exports.AdditionCollectionWithDups = operators.AdditionCollectionWithDups;
exports.SubtractCollection = operators.SubtractCollection;
exports.IntersectionCollection = operators.IntersectionCollection;
exports.MapToCollection = operators.MapToCollection;
exports.FilteredCollection = operators.FilteredCollection;
exports.notInCommonColl = operators.notInCommonColl;
exports.mergeColl = operators.mergeColl;
exports.concatColl = operators.concatColl;
exports.subtractColl = operators.subtractColl;
exports.inCommonColl = operators.inCommonColl;
