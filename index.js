/**
 * This exports all classes and functions provided by this API,
 * for more convenient importing.
 */

export { Collection, CollectionObserver, KeyValueCollection } from "./array.js"
export { ArrayColl } from "./array.js"
export { Set } from "./set.js"
export { mergeColl, concatDups, subtractColl, inCommonColl, notInCommonColl,
    addColl, addCollWithDups, andColl, xorColl,
    } from "./basic-operators.js"
export { sortColl } from "./sort.js"
export { DelegateCollection } from "./delegate.js"
