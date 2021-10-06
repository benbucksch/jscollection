import { ArrayColl, mergeColl } from '..';

test('Merge', done => {
  let a = new ArrayColl();
  let b = new ArrayColl();
  a.add("a");
  a.add("b");
  a.add("c");
  b.add("d");
  b.add("e");
  b.add("f");
  let merged = mergeColl(a, b);
  expect(merged.length).toBe(6);

  expect.assertions(2);
  merged.registerObserver({
    added: (items, coll) => {
      expect(items[0]).toBe("h");
      done();
    },
    removed: (items, coll) => {
    },
  });
  b.add("h");
});
