import { ArrayColl } from '..';

test('sort', () => {
  let a = new ArrayColl(["h", "f", "d", "g", "b", "c", "b", "e"]);

  let sorted = a.sort((a, b) => a < b);

  let added = new ArrayColl();
  let removed = new ArrayColl();
  sorted.registerObserver({
    added: (items, coll) => {
      added.addAll(items);
    },
    removed: (items, coll) => {
      removed.addAll(items);
    },
  });

  a.add("a");
  a.remove("c");

  /*
  // swap the first two
  let swap = a.get(0);
  a.set(0, a.get(1));
  a.set(1, swap);
  */

  expect(sorted.contents).toMatchObject(["a", "b", "b", "d", "e", "f", "g", "h"]);
  expect(removed.contents).toMatchObject(["c"]);
  expect(added.contents).toMatchObject(["a"]);
});


test('sortBy', () => {
  let c = { name: "c" };
  let a = new ArrayColl([{ name: "h" }, { name: "f" }, { name: "d" }, { name: "g" }, { name: "b" }, c, { name: "b" }, { name: "e" }]);

  let sorted = a.sortBy((o => o.name));

  let added = new ArrayColl();
  let removed = new ArrayColl();
  sorted.registerObserver({
    added: (items, coll) => {
      added.addAll(items);
    },
    removed: (items, coll) => {
      removed.addAll(items);
    },
  });

  a.add({ name: "a" });
  a.remove(c);

  /*
  // swap the first two
  let swap = a.get(0);
  a.set(0, a.get(1));
  a.set(1, swap);
  */

  expect(sorted.contents.map(o => o.name)).toMatchObject(["a", "b", "b", "d", "e", "f", "g", "h"]);
  expect(removed.contents.map(o => o.name)).toMatchObject(["c"]);
  expect(added.contents.map(o => o.name)).toMatchObject(["a"]);
});
