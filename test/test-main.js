const _import = require("collection/collection");
for (let symbolName in _import)
  this[symbolName] = _import[symbolName];

exports.array = function(test)
{
  var a = new ArrayColl();
  a.add("a");
  a.add("b");
  a.add("c");
  var el = "d";
  a.add(el);
  test.assertEqual(a.length, 4);
  test.assertEqual(a.contents().length, 4);
  a.remove(el);
  test.assertEqual(a.length, 3);
  test.assertEqual(a.contents().length, 3);

  // KeyValue of ArrayColl
  test.assertEqual(a.get(0), "a");
  test.assertEqual(a.get(2), "c");
  a.set(2, "c2");
  test.assertEqual(a.length, 3);
  test.assertEqual(a.contents().length, 3);
  a.set(3, "d2");
  test.assertEqual(a.length, 4);
  test.assertEqual(a.contents().length, 4);
  a.set(10, "e");
  test.assertEqual(a.length, 11);
  test.assertEqual(a.contents().length, 11);
  test.done();
}

exports.observer = function(test)
{
  var a = new ArrayColl();
  var el = "a";
  a.registerObserver({
    added : function(item, coll) {
      test.pass("observer added called");
      test.assertEqual(coll, a);
      test.assertEqual(item, el);
    },
    removed : function(item, coll) {
      test.pass("observer removed called");
      test.assertEqual(coll, a);
      test.assertEqual(item, el);
      test.done();
    }
  });
  a.add(el);
  a.remove(el);
}

exports.merge = function(test)
{
  var a = new ArrayColl();
  var b = new ArrayColl();
  a.add("a");
  a.add("b");
  a.add("c");
  b.add("d");
  b.add("e");
  b.add("f");
  var merged = mergeColl(a, b);
  test.assertEqual(merged.length, 6);
  test.assertEqual(merged.contents().length, 6);

  merged.registerObserver({
    added : function(item, coll) {
      test.done();
    },
    removed : function(item, coll) {
    }
  });
  b.add("h");
}

exports.subtract = function(test)
{
  var a = new ArrayColl();
  var b = new ArrayColl();
  var el = "a"
  a.add(el);
  a.add("b");
  a.add("c");
  b.add(el);
  b.add("e");
  b.add("f");
  var sub = subtractColl(a, b);
  test.assertEqual(sub.length, 2);
  test.assertEqual(sub.contents().length, 2);

  sub.registerObserver({
    added : function(item, coll) {
      test.pass("observer added called");
    },
    removed : function(item, coll) {
      test.pass("observer removed called");
      test.assertEqual(coll, sub);
      test.assertEqual(item, el);
      test.done();
    }
  });
  a.add("h"); // calls added()
  b.remove(el); // calls added()
  b.add(el); // calls removed()
}

exports.common = function(test)
{
  var a = new ArrayColl();
  var b = new ArrayColl();
  var el = "a"
  a.add(el);
  a.add("b");
  a.add("c");
  b.add(el);
  b.add("e");
  b.add("f");
  var common = inCommonColl(a, b);
  test.assertEqual(common.length, 1);
  test.assertEqual(common.contents().length, 1);
  for each (let item in common)
    test.assertEqual(item, el);

  common.registerObserver({
    added : function(item, coll) {
    },
    removed : function(item, coll) {
      test.assertEqual(coll, common);
      test.assertEqual(item, el);
      test.done();
    }
  });
  b.remove(el); // calls removed()
}
