import { ArrayColl } from '..';

test('sort', () => {
  let a = new ArrayColl([ "h", "f", "d", "g", "c", "b", "e" ]);

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

  expect(sorted.contents).toMatchObject([ "a", "b", "d", "e", "f", "g", "h" ]);
  expect(removed.contents).toMatchObject([ "c" ]);
  expect(added.contents).toMatchObject([ "a" ]);
});
