import { ArrayColl } from '..';


test('Array basics', () => {
  let a = new ArrayColl();
  a.add("a");
  a.add("b");
  a.add("c");
  let el = "d";
  a.add(el);
  expect(a.length).toBe(4);
  expect(a.contents.length).toBe(a.length);
  a.remove(el);
  expect(a.length).toBe(3);
  expect(a.contents.length).toBe(a.length);

  // KeyValue of ArrayColl
  expect(a.get(0)).toBe("a");
  expect(a.get(2)).toBe("c");
  a.set(2, "c2");
  expect(a.length).toBe(3);
  expect(a.contents.length).toBe(a.length);
  a.set(3, "d2");
  expect(a.length).toBe(4);
  expect(a.contents.length).toBe(a.length);
  a.set(10, "e");
  expect(a.length).toBe(11);
  expect(a.contents.length).toBe(a.length);
});
