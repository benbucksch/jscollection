import { SetColl } from '..';

function newSet() {
  let a = new SetColl();
  a.add("a");
  a.add("b");
  a.add("c");
  a.add("c");
  a.add("d");
  return a;
}

test('Set add, remove', () => {
  let a = newSet();
  expect(a.length).toBe(4); // no dups
  let el = "e";
  a.add(el);
  expect(a.length).toBe(5);
  expect(a.contents.length).toBe(a.length);
  a.remove(el);
  a.remove("c");
  expect(a.length).toBe(3);
  a.delete("d"); // alias for remove()
  expect(a.length).toBe(2);
  expect(a.contents.length).toBe(a.length);
  a.addAll(newSet());
  expect(a.length).toBe(4);
  a.removeAll(["c", "d"]);
  expect(a.length).toBe(2);
  expect(a.contents.length).toBe(a.length);
});

test('Set clear', () => {
  let a = newSet();
  expect(a.length).toBeGreaterThan(0);
  a.clear();
  expect(a.length).toBe(0);
  expect(a.contents.length).toBe(a.length);
});

test('Set search functions', () => {
  let a = newSet();
  expect(a.size).toBe(4);
  expect(a.has("b")).toBe(true);
  expect(a.contains("c")).toBe(true);

  expect(a.find(item => item == "b")).toBe("b");
});

test('Set for...of', () => {
  let a = newSet();
  let result = "";
  for (let item of a) {
    result += "-" + item;
  }
  expect(result).toEqual("-" + a.contents.join("-"));
});

test('Set forEach', () => {
  let a = newSet();
  let result = "";
  a.forEach(item => {
    result += "-" + item;
  });
  expect(result).toEqual("-" + a.contents.join("-"));
});

test('Set iterators', () => {
  let a = newSet();
  let iter = a[Symbol.iterator]();
  expect(iter.next().value).toBe(a.first);
  let values = a.values();
  expect(values.next().value).toBe(a.first);
  let entries = a.entries();
  expect(entries.next().value[1]).toBe(a.first);
});
