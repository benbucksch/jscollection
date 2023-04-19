import { MapColl } from '..';

function newMap() {
  let a = new MapColl();
  a.set("a", "a1");
  a.set("b", "b1");
  a.set("c", "c1");
  a.set("c", "c2");
  a.set("d", "d1");
  return a;
}

test('Map add, remove', () => {
  let a = newMap();
  expect(a.length).toBe(4);
  let el = "e1";
  a.add(el);
  expect(a.length).toBe(5);
  expect(a.contents.length).toBe(a.length);
  a.remove(el);
  a.remove("d1");
  expect(a.length).toBe(3);
  expect(a.contents.length).toBe(a.length);
});

test('Map removeKey, delete', () => {
  let a = newMap();
  expect(a.length).toBe(4);
  a.removeKey("a");
  a.delete("b"); // alias for removeKey();
  expect(a.length).toBe(2);
  expect(a.contents.length).toBe(a.length);
});

test('Map set, get', () => {
  let a = newMap();
  expect(a.length).toBe(4);
  a.add("e1");

  expect(a.get("a")).toBe("a1");
  expect(a.get("c")).toBe("c2");
  expect(a.get(0)).toBe("e1");
  a.set("c", "c3");
  expect(a.length).toBe(5);
  expect(a.contents.length).toBe(a.length);
  a.set(100, "z1");
  expect(a.length).toBe(6);
  expect(a.contents.length).toBe(a.length);
});

test('Map clear', () => {
  let a = newMap();
  expect(a.length).toBeGreaterThan(0);
  a.clear();
  expect(a.length).toBe(0);
  expect(a.contents.length).toBe(a.length);
});

test('Map search functions', () => {
  let a = newMap();
  expect(a.has("b")).toBe(true);
  expect(a.find(item => item == "b1")).toBe("b1");
});

test('Map for...of', () => {
  let a = newMap();
  let result = "";
  for (let item of a) {
    result += "-" + item;
  }
  expect(result).toEqual("-" + a.contents.join("-"));
});

test('Map forEach', () => {
  let a = newMap();
  let result = "";
  a.forEach(item => {
    result += "-" + item;
  });
  expect(result).toEqual("-" + a.contents.join("-"));
});

test('Map iterators', () => {
  let a = newMap();
  let values = a.values();
  expect(values.first).toBe(a.first);
  let keys = a.keys();
  expect(keys.first).toBe("a");
  let entries = a.entries();
  expect(entries.first[1]).toBe(a.first);
});
