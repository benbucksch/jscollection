import { ArrayColl } from '..';
import { compareValues } from '../lib/operator/sort';

test('sort', () => {
  let a = new ArrayColl(["h", "f", "d", "g", "b", "c", "b", "e"]);
  let sorted = a.sort((a, b) => compareValues(a, b));

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
  a.add("e2");
  a.add("i");
  a.remove("c");

  expect(sorted.contents).toMatchObject(["a", "b", "b", "d", "e", "e2", "f", "g", "h", "i"]);
  expect(removed.contents).toMatchObject(["c"]);
  expect(added.contents).toMatchObject(["a", "e2", "i"]);
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
  a.add({ name: "e2" });
  a.add({ name: "i" });
  a.remove(c);

  expect(sorted.contents.map(o => o.name)).toMatchObject(["a", "b", "b", "d", "e", "e2", "f", "g", "h", "i"]);
  expect(removed.contents.map(o => o.name)).toMatchObject(["c"]);
  expect(added.contents.map(o => o.name)).toMatchObject(["a", "e2", "i"]);
});
