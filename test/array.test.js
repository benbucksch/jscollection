import { ArrayColl } from '..';

function newArray() {
  return ArrayColl.from(["a", "b", "c", "c", "d"]);
}

test('Array add, remove', () => {
  let a = newArray();
  expect(a.length).toBe(5);

  a.push("d", "d"); // alias for addAll([...])
  let el = "e";
  a.add(el);
  expect(a.length).toBe(8);
  expect(a.contents.length).toBe(a.length);
  a.removeAll(["d", el]);
  expect(a.length).toBe(6);
  expect(a.contents.length).toBe(a.length);
  a.remove("d");
  expect(a.length).toBe(5);
  expect(a.contents.length).toBe(a.length);
  a.push("c");
  a.removeEach("c");
  expect(a.length).toBe(3);
  expect(a.contents.length).toBe(a.length);
});

test('Array set, get', () => {
  let a = newArray();
  expect(a.length).toBe(5);

  expect(a.get(0)).toBe("a");
  expect(a.getIndex(2)).toBe("c");
  expect(a.at(2)).toBe("c");
  expect(a.getKeyForValue("a")).toBe(0);
  a.set(2, "c2");
  expect(a.length).toBe(5);
  expect(a.contents.length).toBe(a.length);
  a.set(3, "d2");
  expect(a.length).toBe(5);
  expect(a.contents.length).toBe(a.length);
  a.set(100, "e");
  expect(a.length).toBe(101);
  expect(a.contents.length).toBe(a.length);
  a.removeKey(3);
  expect(a.length).toBe(100);
  expect(a.contents.length).toBe(a.length);
});

test('Array push, pop', () => {
  let a = newArray();
  let before = a.contents;

  a.push(a.pop());
  expect(a.contents).toMatchObject(before);
});

test('Array shift, unshift', () => {
  let a = newArray();
  let before = a.contents;

  a.unshift(a.shift());
  expect(a.contents).toMatchObject(before);

  a.unshift(a.shift(), a.shift());
  expect(a.contents).toMatchObject(before);
});

test('Array clear', () => {
  let a = newArray();
  expect(a.length).toBeGreaterThan(0);
  expect(a.isEmpty).toBe(false);
  expect(a.hasItems).toBe(true);

  a.clear();
  expect(a.length).toBe(0);
  expect(a.contents.length).toBe(a.length);
  expect(a.isEmpty).toBe(true);
  expect(a.hasItems).toBe(false);
});

test('Array replace', done => {
  let a = new ArrayColl(["a", "b", "c", "d"]);
  expect.assertions(7);
  expect(a.length).toBe(4);

  a.registerObserver({
    added: (items, coll) => {
      expect(items.length).toBe(1);
      expect(items[0]).toBe("e");
      expect(coll).toBe(a);
      done();
    },
    removed: (items, coll) => {
      expect(items.length).toBe(1);
      expect(items[0]).toBe("a");
      expect(coll).toBe(a);
    },
  });
  a.replaceAll(["b", "c", "d", "e"]);
});

test('Array isArrayColl', () => {
  let a = newArray();
  expect(ArrayColl.isArray(a)).toBe(true);
  expect(ArrayColl.isArray([])).toBe(true);
  expect(ArrayColl.isArray({})).toBe(false);
  expect(ArrayColl.isArrayColl(a)).toBe(true);
  expect(ArrayColl.isArrayColl([])).toBe(false);
  expect(ArrayColl.isArrayColl({})).toBe(false);
});

test('Array search functions', () => {
  let a = newArray();
  expect(a.length).toBe(5);

  expect(a.contains("b")).toBe(true);
  expect(a.includes("b")).toBe(true);
  expect(a.includes("b", 3)).toBe(false);

  expect(a.indexOf("b")).toBe(1);
  expect(a.lastIndexOf("c")).toBe(3);
  expect(a.findIndex(item => item == "b")).toBe(1);
  expect(a.find(item => item == "b")).toBe("b");

  expect(a.every(item => item >= "a" && item < "h")).toBe(true);
  expect(a.every(item => item < "c")).toBe(false);
  expect(a.some(item => item > "h")).toBe(false);
  expect(a.some(item => item < "b")).toBe(true);
});

test('Array for...of', () => {
  let a = newArray();
  let result = "";
  for (let item of a) {
    result += "-" + item;
  }
  expect(result).toEqual("-" + a.contents.join("-"));
});

test('Array forEach', () => {
  let a = newArray();
  let result = "";
  a.forEach(item => {
    result += "-" + item;
  });
  expect(result).toEqual("-" + a.contents.join("-"));
});

test('Array iterators', () => {
  let a = newArray();
  let iter = a[Symbol.iterator]();
  expect(iter.next().value).toBe(a.first);
  let values = a.values();
  expect(values.next().value).toBe(a.first);
  let keys = a.keys();
  expect(keys.next().value).toBe(0);
  let entries = a.entries();
  expect(entries.next().value[1]).toBe(a.first);
});

test('Array toString', () => {
  let a = newArray();
  expect(a.join(" + ")).toBe(a.contents.join(" + "));
  expect(a.toString()).toBe(a.contents.toString());
  expect(a.toLocaleString()).toBe(a.contents.toLocaleString());
});

test('Array reversed', () => {
  let a = newArray();
  let reversed = a.reverse();
  expect(reversed.contents).toMatchObject(a.contents.reverse());
});

test('Array splice 0', () => {
  let a = newArray();
  let before = a.contents;
  a.addAll(new ArrayColl(["g", "h"]));
  let removedItems = a.splice(before.length);
  expect(removedItems.contents).toMatchObject(["g", "h"]);
  expect(a.contents).toMatchObject(before);
});

test('Array splice 1', () => {
  let a = newArray();
  let array = a.contents;
  a.splice(3, 2, "h", "g");
  array.splice(3, 2, "h", "g");
  expect(a.contents).toMatchObject(array);
});

test('Array splice 2', () => {
  let a = newArray();
  let array = a.contents;
  a.splice(3, 2);
  array.splice(3, 2);
  expect(a.contents).toMatchObject(array);
});

test('Array splice 3', () => {
  let a = newArray();
  let array = a.contents;
  a.splice(3);
  array.splice(3);
  expect(a.contents).toMatchObject(array);
});

test('Array slice 0', () => {
  let a = newArray();
  let before = a.contents;
  a.addAll(["g", "h"]);
  let sliced = a.slice(0, -2);
  expect(sliced.contents).toMatchObject(before);
  a.pop();
  a.pop();
  expect(a.contents).toMatchObject(before);
});

test('Array slice 1', () => {
  let a = newArray();
  let array = a.contents;
  let result = a.slice(2, 2);
  let resultArray = array.slice(2, 2);
  expect(result.contents).toMatchObject(resultArray);
});

test('Array slice 2', () => {
  let a = newArray();
  let array = a.contents;
  let result = a.slice(2, -2);
  let resultArray = array.slice(2, -2);
  expect(result.contents).toMatchObject(resultArray);
});

test('Array slice 3', () => {
  let a = newArray();
  let array = a.contents;
  let result = a.slice(2);
  let resultArray = array.slice(2);
  expect(result.contents).toMatchObject(resultArray);
});

test('Array getIndexRange(1, ...) ', () => {
  let a = newArray();
  expect(a.length).toBeGreaterThan(4);
  let array = a.contents;
  let result = a.getIndexRange(1, 3);
  let resultArray = array.slice(1, 4);
  expect(result).toMatchObject(resultArray);
});

test('Array getIndexRange(0, ...) ', () => {
  let a = newArray();
  expect(a.length).toBeGreaterThan(4);
  let array = a.contents;
  let result = a.getIndexRange(0, 3);
  let resultArray = array.slice(0, 3);
  expect(result).toMatchObject(resultArray);
});

test('Array getIndexRange(..., 0) ', () => {
  let a = newArray();
  expect(a.length).toBeGreaterThan(4);
  let result = a.getIndexRange(3, 0);
  expect(result.length).toBe(0);
});

test('Array fill 1', () => {
  let a = newArray();
  let array = a.contents;
  a.fill("n");
  array.fill("n");
  expect(a.contents).toMatchObject(array);
});

test('Array fill 2', () => {
  let a = newArray();
  let array = a.contents;
  a.fill("n", 2);
  array.fill("n", 2);
  expect(a.contents).toMatchObject(array);
});

test('Array fill 3', () => {
  let a = newArray();
  let array = a.contents;
  a.fill("n", 2, 4);
  array.fill("n", 2, 4);
  expect(a.contents).toMatchObject(array);
});

test('Array copyWithin 1', () => {
  let a = newArray();
  let array = a.contents;
  a.copyWithin(1, 3, 2);
  array.copyWithin(1, 3, 2);
  expect(a.contents).toMatchObject(array);
});

test('Array copyWithin 2', () => {
  let a = newArray();
  let array = a.contents;
  a.copyWithin(1, 3);
  array.copyWithin(1, 3);
  expect(a.contents).toMatchObject(array);
});

test('Array copyWithin 3', () => {
  let a = newArray();
  let array = a.contents;
  a.copyWithin(1);
  array.copyWithin(1);
  expect(a.contents).toMatchObject(array);
});

test('Array flat', () => {
  let a = newArray();
  a.set(3, newArray().contents);
  let array = a.contents;
  let result = a.flat();
  let should = array.flat(2);
  expect(result.contents).toMatchObject(should);
});

test('Array flatMap', () => {
  let a = new ArrayColl();
  a.set(3, { ideas: newArray() });
  let array = a.contents;
  let result = a.flatMap(item => item?.ideas);
  let should = array.flatMap(item => item?.ideas.contents);
  expect(result.contents).toMatchObject(should);
});

test('Array reduce', () => {
  let a = newArray();
  let array = a.contents;
  let result = a.reduce((prev, item) => prev + ", " + item, "start");
  let should = array.reduce((prev, item) => prev + ", " + item, "start");
  expect(result).toEqual(should);
});

test('Array reduceRight', () => {
  let a = newArray();
  let array = a.contents;
  let result = a.reduceRight((prev, item) => prev + ", " + item, "start");
  let should = array.reduceRight((prev, item) => prev + ", " + item, "start");
  expect(result).toEqual(should);
});
