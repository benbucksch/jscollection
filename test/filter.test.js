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
