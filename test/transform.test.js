import { ArrayColl } from '..';

test('transform observer finds the right changes', () => {
  let a = new ArrayColl([ "b", "c", "d", "e", "f", "g", "h" ]);

  let transform = a.reverse(); // uses TransformCollection

  let added = new ArrayColl();
  let removed = new ArrayColl();
  transform.registerObserver({
    added: (items, coll) => {
      added.addAll(items);
    },
    removed: (items, coll) => {
      removed.addAll(items);
    },
  });

  a.unshift("a");
  a.remove("b");

  /*
  // swap "c" and "d"
  let swap = a.get(1);
  a.set(1, a.get(2));
  console.log("after setting d", a.contents, added.contents, removed.contents);
  a.set(2, swap);
  console.log("after setting c", a.contents, added.contents, removed.contents);

  expect(transform.contents).toMatchObject([ "a", "d", "c", "e", "f", "g", "h" ].reverse());
  expect(removed.contents).toMatchObject([ "b", "c", "d" ]);
  expect(added.contents).toMatchObject([ "a", "d", "c" ]);
  */

  expect(transform.contents).toMatchObject([ "a", "c", "d", "e", "f", "g", "h" ].reverse());
  expect(removed.contents).toMatchObject([ "b" ]);
  expect(added.contents).toMatchObject([ "a" ]);
});
