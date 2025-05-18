import { ArrayColl } from '..';

test('unique with object identity', () => {
  let a = new ArrayColl([ "b", "b", "d", "e", "e", "e", "h" ]);

  let unique = a.unique();
  expect(unique.contents).toMatchObject(["b", "d", "e", "h"]);

  let added = new ArrayColl();
  let removed = new ArrayColl();
  unique.registerObserver({
    added: (items, coll) => {
      added.addAll(items);
    },
    removed: (items, coll) => {
      removed.addAll(items);
    },
  });

  a.unshift("a");
  a.remove("b");
  a.remove("h");

  expect(unique.contents).toMatchObject([ "b", "d", "e", "a" ]);
  expect(removed.contents).toMatchObject([ "h" ]);
  expect(added.contents).toMatchObject([ "a" ]);
});

test('unique with equal function', () => {
  let b = { id: "b" };
  let b2 = { id: "b" };
  let b3 = { id: "b" };
  let c = { id: "c" };
  let c2 = { id: "c" };
  let d = { id: "d" };
  let e = { id: "e" };
  let a = new ArrayColl([b, b2, b3, c, c2, d]);
  function equal(a, b) {
    return a.id == b.id;
  }

  let unique = a.unique(equal);
  expect(unique.contents).toMatchObject([b, c, d]);

  let added = new ArrayColl();
  let removed = new ArrayColl();
  unique.registerObserver({
    added: (items, coll) => {
      added.addAll(items);
    },
    removed: (items, coll) => {
      removed.addAll(items);
    },
  });

  a.unshift(e);
  a.remove(c2);
  a.remove(d);

  expect(unique.contents).toMatchObject([b, c, e]);
  expect(removed.contents).toMatchObject([d]);
  expect(added.contents).toMatchObject([e]);
});
