import { ArrayColl, subtractColl } from '..';
import { jest } from '@jest/globals';

test('Subtract', done => {
  let a = new ArrayColl();
  let b = new ArrayColl();
  let el = "a"
  a.add(el);
  a.add("b");
  a.add("c");
  b.add(el);
  b.add("e");
  b.add("f");
  let sub = subtractColl(a, b);
  expect(sub.length).toBe(2);

  expect.assertions(4);
  let addedCalled = jest.fn();
  let removedCalled = jest.fn();
  sub.registerObserver({
    added: (items, coll) => {
      addedCalled(items[0]);
    },
    removed: (items, coll) => {
      removedCalled(items[0]);

      expect(addedCalled).toHaveBeenNthCalledWith(1, "h");
      expect(addedCalled).toHaveBeenNthCalledWith(2, el);
      expect(removedCalled).toHaveBeenCalledWith(el);
      done();
    },
  });
  a.add("h"); // calls added()
  b.remove(el); // calls added()
  b.add(el); // calls removed()
});
