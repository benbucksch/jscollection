import { ArrayColl } from '..';

test('Observer', done => {
  let a = new ArrayColl();
  let el = "a";
  expect.assertions(4);
  a.registerObserver({
    added: (items, coll) => {
      expect(items[0]).toBe(el);
      expect(coll).toBe(a);
    },
    removed: (items, coll) => {
      expect(items[0]).toBe(el);
      expect(coll).toBe(a);
      done();
    },
  });
  a.add(el);
  a.remove(el);
});
