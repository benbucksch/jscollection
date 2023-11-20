import { ArrayColl, mergeColl, concatColl } from '..';

test('Concat', done => {
  let a = new ArrayColl();
  let b = new ArrayColl();
  a.add("a");
  a.add("b");
  a.add("c");
  b.add("d");
  b.add("e");
  b.add("f");
  let merged = concatColl(a, b);
  expect(merged.length).toBe(6);

  expect.assertions(3);
  merged.registerObserver({
    added: (items, coll) => {
      expect(items[0]).toBe("d");
      expect(merged.length).toBe(7);
      done();
    },
    removed: (items, coll) => {
    },
  });
  a.add("d");
});

test('Concat multiple', done => {
  let a = new ArrayColl();
  let b = new ArrayColl();
  let c = new ArrayColl();
  let d = new ArrayColl();
  a.add("a");
  a.add("b");
  a.add("c");
  b.add("d");
  b.add("e");
  b.add("f");
  c.add("g");
  c.add("h");
  c.add("i");
  d.add("j");
  d.add("k");
  d.add("l");
  let merged = concatColl(a, b, c, d);
  expect(merged.length).toBe(12);

  expect.assertions(3);
  merged.registerObserver({
    added: (items, coll) => {
      expect(items[0]).toBe("j");
      expect(merged.length).toBe(13);
      done();
    },
    removed: (items, coll) => {
    },
  });
  b.add("j");
});

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

  expect.assertions(3);
  merged.registerObserver({
    added: (items, coll) => {
      expect(items[0]).toBe("h");
      expect(merged.length).toBe(7);
      done();
    },
    removed: (items, coll) => {
    },
  });
  a.add("h");
});

test('Merge multiple', done => {
  let a = new ArrayColl();
  let b = new ArrayColl();
  let c = new ArrayColl();
  let d = new ArrayColl();
  a.add("a");
  a.add("b");
  a.add("c");
  b.add("d");
  b.add("e");
  b.add("f");
  c.add("g");
  c.add("h");
  c.add("i");
  d.add("j");
  d.add("k");
  d.add("l");
  let merged = mergeColl(a, b, c, d);
  expect(merged.length).toBe(12);

  expect.assertions(3);
  merged.registerObserver({
    added: (items, coll) => {
      expect(items[0]).toBe("m");
      expect(merged.length).toBe(13);
      done();
    },
    removed: (items, coll) => {
    },
  });
  c.add("m");
});
