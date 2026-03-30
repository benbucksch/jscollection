import { ArrayColl } from '..';
import { Observable } from './Observable';

class Leaf extends Observable {
  constructor(valid) {
    super();
    this._valid = valid;
  }
  get valid() {
    return this._valid;
  }
  set valid(val) {
    this._valid = val;
    this.notifyObservers();
  }
}

test('filterOnce() non-observable objects', () => {
  let itemA = { valid: true };
  let itemB = { valid: false };
  let itemC = { valid: false };
  let a = new ArrayColl([itemA, itemB, itemC]);
  let filtered = a.filterOnce(item => item.valid);

  expect(filtered.length).toBe(1);
  expect(filtered.contents).toMatchObject([itemA]);

  itemB.valid = true;
  expect(filtered.length).toBe(1);
  expect(filtered.contents).toMatchObject([itemA]);
});

test('filterOnce() observable objects', () => {
  let itemA = new Leaf(true);
  let itemB = new Leaf(false);
  let itemC = new Leaf(false);
  let a = new ArrayColl([itemA, itemB, itemC]);
  let filtered = a.filterOnce(item => item.valid);

  expect(filtered.length).toBe(1);
  expect(filtered.contents).toMatchObject([itemA]);

  itemB.valid = true;
  expect(filtered.length).toBe(1);
  expect(filtered.contents).toMatchObject([itemA]);

  let added = new ArrayColl();
  let removed = new ArrayColl();
  filtered.registerObserver({
    added: (items, coll) => {
      added.addAll(items);
    },
    removed: (items, coll) => {
      removed.addAll(items);
    },
  });

  expect(filtered.contents).toMatchObject([itemA]);
  expect(removed.contents).toMatchObject([]);
  expect(added.contents).toMatchObject([]);
});

test('filterObservable() non-observable objects', () => {
  let itemA = { valid: true };
  let itemB = { valid: false };
  let itemC = { valid: false };
  let a = new ArrayColl([itemA, itemB, itemC]);
  let filtered = a.filterObservable(item => item.valid);

  expect(filtered.length).toBe(1);
  expect(filtered.includes(itemA)).toBeTruthy();

  itemB.valid = true;
  expect(filtered.length).toBeGreaterThanOrEqual(1);
});

test('filterObservable() observable objects', () => {
  let itemA = new Leaf(true);
  let itemB = new Leaf(false);
  let itemC = new Leaf(false);
  let a = new ArrayColl([itemA, itemB, itemC]);
  let filtered = a.filterObservable(item => item.valid);

  expect(filtered.length).toBe(1);
  expect(filtered.contents).toMatchObject([itemA]);

  itemB.valid = true;
  expect(filtered.length).toBe(2);

  let added = new ArrayColl();
  let removed = new ArrayColl();
  filtered.registerObserver({
    added: (items, coll) => {
      added.addAll(items);
    },
    removed: (items, coll) => {
      removed.addAll(items);
    },
  });

  itemC.valid = true;
  expect(filtered.length).toBe(3);

  expect(filtered.contents).toMatchObject([itemA, itemB, itemC]);
  expect(removed.contents).toMatchObject([]);
  expect(added.contents).toMatchObject([itemC]);
});

test('filterWritable() non-observable objects', () => {
  let itemA = { valid: true };
  let itemB = { valid: false };
  let itemC = { valid: false };
  let a = new ArrayColl([itemA, itemB, itemC]);
  let filtered = a.filterWritable(item => item.valid);

  expect(filtered.contents).toMatchObject([itemA]);
  expect(a.contents).toMatchObject([itemA, itemB, itemC]);

  let itemD = { valid: true };
  filtered.add(itemD);
  expect(filtered.contents).toMatchObject([itemA, itemD]);
  expect(a.contents).toMatchObject([itemA, itemB, itemC, itemD]);

  let itemE = { valid: false };
  filtered.add(itemE);
  expect(filtered.contents).toMatchObject([itemA, itemD]);

  expect(a.contents).toMatchObject([itemA, itemB, itemC, itemD]);

  filtered.remove(itemA);
  expect(filtered.contents).toMatchObject([itemD]);
  expect(a.contents).toMatchObject([itemB, itemC, itemD]);

  let itemF = { valid: true };
  a.add(itemF);
  expect(filtered.contents).toMatchObject([itemD, itemF]);
  expect(a.contents).toMatchObject([itemB, itemC, itemD, itemF]);

  a.remove(itemF);
  expect(filtered.contents).toMatchObject([itemD]);
  expect(a.contents).toMatchObject([itemB, itemC, itemD]);

  let itemG = { valid: false };
  a.add(itemG);
  expect(filtered.contents).toMatchObject([itemD]);
  expect(a.contents).toMatchObject([itemB, itemC, itemD, itemG]);

  a.remove(itemG);
  expect(filtered.contents).toMatchObject([itemD]);
  expect(a.contents).toMatchObject([itemB, itemC, itemD]);

  itemB.valid = true;
  expect(filtered.contents).toMatchObject([itemD]);
  expect(a.contents).toMatchObject([itemB, itemC, itemD]);
});

test('filterWritable() observable objects', () => {
  let itemA = new Leaf(true);
  let itemB = new Leaf(false);
  let itemC = new Leaf(false);
  let a = new ArrayColl([itemA, itemB, itemC]);
  let filtered = a.filterWritable(item => item.valid);

  expect(filtered.contents).toMatchObject([itemA]);
  expect(a.contents).toMatchObject([itemA, itemB, itemC]);

  let added = new ArrayColl();
  let removed = new ArrayColl();
  filtered.registerObserver({
    added: (items, coll) => {
      added.addAll(items);
    },
    removed: (items, coll) => {
      removed.addAll(items);
    },
  });

  let itemD = new Leaf(true);
  filtered.add(itemD);
  expect(filtered.contents).toMatchObject([itemA, itemD]);
  expect(a.contents).toMatchObject([itemA, itemB, itemC, itemD]);

  let itemE = new Leaf(false);
  filtered.add(itemE);
  expect(filtered.contents).toMatchObject([itemA, itemD]);
  expect(a.contents).toMatchObject([itemA, itemB, itemC, itemD]);

  filtered.remove(itemA);
  expect(filtered.contents).toMatchObject([itemD]);
  expect(a.contents).toMatchObject([itemB, itemC, itemD]);

  let itemF = new Leaf(true);
  a.add(itemF);
  expect(filtered.contents).toMatchObject([itemD, itemF]);
  expect(a.contents).toMatchObject([itemB, itemC, itemD, itemF]);

  a.remove(itemF);
  expect(filtered.contents).toMatchObject([itemD]);
  expect(a.contents).toMatchObject([itemB, itemC, itemD]);

  let itemG = new Leaf(false);
  a.add(itemG);
  expect(filtered.contents).toMatchObject([itemD]);
  expect(a.contents).toMatchObject([itemB, itemC, itemD, itemG]);

  a.remove(itemG);
  expect(filtered.contents).toMatchObject([itemD]);
  expect(a.contents).toMatchObject([itemB, itemC, itemD]);

  itemB.valid = true;
  expect(filtered.length).toBe(2);
  expect(a.length).toBe(3);

  itemB.valid = false;
  expect(filtered.length).toBe(1);
  expect(a.length).toBe(2);

  expect(added.length).toBe(3);
  expect(removed.length).toBe(3);
});

test('filter() (deprecated API) non-observable objects', () => {
  let itemA = { valid: true };
  let itemB = { valid: false };
  let itemC = { valid: false };
  let a = new ArrayColl([itemA, itemB, itemC]);
  let filtered = a.filter(item => item.valid);

  expect(filtered.length).toBe(1);
  expect(filtered.includes(itemA)).toBeTruthy();

  itemB.valid = true;
  expect(filtered.length).toBeGreaterThanOrEqual(1);
});

test('filter() (deprecated API) observable objects', () => {
  let itemA = new Leaf(true);
  let itemB = new Leaf(false);
  let itemC = new Leaf(false);
  let a = new ArrayColl([itemA, itemB, itemC]);
  let filtered = a.filter(item => item.valid);

  expect(filtered.length).toBe(1);
  expect(filtered.contents).toMatchObject([itemA]);

  itemB.valid = true;
  expect(filtered.length).toBe(1);

  let added = new ArrayColl();
  let removed = new ArrayColl();
  filtered.registerObserver({
    added: (items, coll) => {
      added.addAll(items);
    },
    removed: (items, coll) => {
      removed.addAll(items);
    },
  });

  itemC.valid = true;
  expect(filtered.length).toBe(1);

  expect(filtered.contents).toMatchObject([itemA]);
  expect(removed.contents).toMatchObject([]);
  expect(added.contents).toMatchObject([]);
});
