import { ArrayColl, concatColl, mergeColl, mergeColls } from '..';

test('Concat', done => {
  let a = new ArrayColl();
  let b = new ArrayColl();
  a.add("a");
  a.add("b");
  a.add("c");
  b.add("a");
  b.add("b");
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
  b.add("a");
  b.add("b");
  b.add("f");
  c.add("g");
  c.add("h");
  c.add("i");
  d.add("j");
  d.add("a");
  d.add("b");
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
  b.add("a");
  b.add("b");
  b.add("f");
  let merged = mergeColl(a, b);
  expect(merged.length).toBe(4);

  expect.assertions(3);
  merged.registerObserver({
    added: (items, coll) => {
      expect(items[0]).toBe("h");
      expect(merged.length).toBe(5);
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
  b.add("a");
  b.add("b");
  b.add("f");
  c.add("g");
  c.add("a");
  c.add("b");
  d.add("j");
  d.add("a");
  d.add("b");
  let merged = mergeColl(a, b, c, d);
  expect(merged.length).toBe(6);

  expect.assertions(3);
  merged.registerObserver({
    added: (items, coll) => {
      expect(items[0]).toBe("m");
      expect(merged.length).toBe(7);
      done();
    },
    removed: (items, coll) => {
    },
  });
  c.add("m");
});


test('Merge with dynamic collection', done => {
  let a = new ArrayColl();
  let b = new ArrayColl();
  let c = new ArrayColl();
  let d = new ArrayColl();
  a.add("a");
  a.add("b");
  a.add("c");
  b.add("a");
  b.add("b");
  b.add("f");
  c.add("a");
  c.add("b");
  c.add("i");
  d.add("j");
  d.add("a");
  d.add("b");
  let colls = new ArrayColl([a, b, c]);
  let merged = mergeColls(colls);
  expect(merged.length).toBe(5);

  expect.assertions(2);
  merged.registerObserver({
    added: (items, coll) => {
      expect(merged.length).toBe(6);
      done();
    },
    removed: (items, coll) => {
    },
  });
  colls.add(d);
});
