import { ArrayColl, inCommonColl } from '..';

test('In common', done => {
  let a = new ArrayColl();
  let b = new ArrayColl();
  let el = "a";
  a.add(el);
  a.add("b");
  a.add("c");
  b.add(el);
  b.add("e");
  b.add("f");
  let inCommon = inCommonColl(a, b);
  expect(inCommon.length).toBe(1);

  for (let item of inCommon) {
    expect(item).toBe(el);
  }

  inCommon.registerObserver({
    added: (items, coll) => {
    },
    removed: (items, coll) => {
      expect(items[0]).toBe(el);
      expect(coll).toBe(inCommon);
      done();
    },
  });
  b.remove(el); // calls removed()
});
