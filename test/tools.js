var plan = require('../../plan/src/plan.js');

var str = require('../src/string.js');
var obj = require('../src/object.js');
var fn = require('../src/function.js');
var file = require('../src/file.js');
var mongoDb = require('../src/mongoDb.js');

exports.testTrim = function(test) {
	test.strictEqual(str.trim("test"), "test", "string without spaces shall stay unchanged");
	test.strictEqual(str.trim("lorem ipsum"), "lorem ipsum", "string with inner spaces shall stay unchanged");
	test.strictEqual(str.trim(" 12345"), "12345", "space before the string shall be trimmed");
	test.strictEqual(str.trim("12345 "), "12345", "space after the string shall be trimmed");
	test.strictEqual(str.trim("   dolor    sit   amet      "), "dolor    sit   amet", "all whitespace before and after the string shall be stripped");
	test.done();
};

exports.testExtend = function(test) {
	test.deepEqual(obj.extend({}, {}), {}, "Empty object extended by empty object is an empty object");
	test.deepEqual(obj.extend({}, {a:1}), {a:1}, "Adding single property");
	test.deepEqual(obj.extend({}, {a:1, b:1}), {a:1, b:1}, "Adding two different properties");
	test.deepEqual(obj.extend({a:1}, {}), {a:1}, "Adding empty object to existing object");
	test.deepEqual(obj.extend({a:1}, {b:1}), {a:1, b:1}, "Standard object extension");
	test.deepEqual(obj.extend({a:1}, {a:2, b:1}), {a:2, b:1}, "Overwrite property");
	test.deepEqual(obj.extend({a:1, b:1}, {b:2}), {a:1, b:2}, "Overwrite another property");
	test.deepEqual(obj.extend({}, {b:2}, null), {b:2}, "Extending by null object");

	var testObj = {a:1, c:1};
	obj.extend(testObj, {a:2, b:2});
	test.deepEqual(testObj, {a:2, b:2, c:1}, "Intuitive behavior");

	test.done();
};

exports.testClone = function(test) {
	var testObj = { a:1, b: 2, c: [1, 2, 3] };
	var shallowClone = obj.clone(testObj);
	var deepClone = obj.clone(testObj, true);
	testObj.a = 4;
	testObj.c[1] = 5;

	test.equals(shallowClone.a, 1);
	test.equals(shallowClone.b, 2);
	test.equals(shallowClone.c[1], 5, "Shallow clone copies array as reference");

	test.equals(deepClone.a, 1);
	test.equals(deepClone.b, 2);
	test.equals(deepClone.c[1], 2, "Deep clone copies array as value");

	test.done();
};

exports.testIsNumeric = function (test) {
	test.equals(obj.isNumeric(0), true);
	test.equals(obj.isNumeric(1), true);
	test.equals(obj.isNumeric(2), true);
	test.equals(obj.isNumeric(666), true);
	test.equals(obj.isNumeric(-1), true);
	test.equals(obj.isNumeric(0.1), true);
	test.equals(obj.isNumeric(-0.1), true);
	test.equals(obj.isNumeric('x'), false);
	test.equals(obj.isNumeric(null), false);
	test.equals(obj.isNumeric(true), false);
	test.equals(obj.isNumeric(false), false);
	test.equals(obj.isNumeric({}), false);
	test.equals(obj.isNumeric([]), false);
	test.done();
};

exports.testIsEmptyObject = function (test) {
	test.equals(obj.isEmptyObject({}), true);
	test.equals(obj.isEmptyObject(new Object()), true);
	test.equals(obj.isEmptyObject({'a': 1}), false);
	test.equals(obj.isEmptyObject([]), true);
	test.equals(obj.isEmptyObject([1]), false);
	test.done();
};

exports.testIsDefined = function (test) {
	var undefined;
	var defined = 0;
	test.equals(obj.isDefined(undefined), false);
	test.equals(obj.isDefined(null), false);
	test.equals(obj.isDefined(defined), true);
	test.done();
};

exports.testCheckArguments = function (test) {
	function testFn(aStr, bNum, cBool, dObj, eArr, fFn) {
		test.ok(
			fn.checkArguments(arguments, ["string", "number", "boolean", "object", "array", "function"]),
			"If argument types match type names, checkArguments shall return true."
		);
	}
	testFn("test", 0, true, { a: 1 }, [0, 1, 2], function () {} );

	function testFn2(aObj, bArr, cArr) {
		test.ok(
			fn.checkArguments(arguments, ["object", "array", "array"]),
			"CheckArguments shall distinguish arrays from other objects, despite the 'typeof' operator returns 'object' for them."
		);
	}
	testFn2({ length: 1 }, [0, 1, 2], new Array(1, 2, 3, 4) );

	function testFn3(a, b, c, d) {
		test.ok(
			fn.checkArguments(arguments, ["number", "number", "number", "number"]),
			"Arguments shall not be required. If there are some arguments missing, the check shall pass."
		);
	}
	testFn3(1, 2);

	test.done();
};

exports.testMapArguments = function (test) {
	var testCallback = function () {};
	var testObject = { a: 1 };
	var testArray = [0, 1, 2];

	function testFn(aStr, bNum, cBool, dObj, eArr, fFn) {
		test.deepEqual(
			fn.mapArguments(arguments, { a: "string", b: "number", c: "boolean", d: "object", e: "array", f: "function"}),
			{ a: "test", b: 0, c: true, d: testObject, e: testArray, f: testCallback },
			"All arguments shall be mapped properly."
		);
	}
	testFn("test", 0, true, testObject, testArray, testCallback );

	function testFn2(aStr, bNum, cBool, dObj, eArr, fFn) {
		test.deepEqual(
			fn.mapArguments(arguments, { a: "string", b: "number", c: "boolean", d: "object", e: "array", f: "function"}),
			{ a: "test", b: null, c: null, d: null, e: null, f: testCallback },
			"Mapping shall recognize missing arguments and map variables properly, using argument type for recognition."
		);
	}
	testFn2("test", testCallback );

	test.done();
};

exports.testCallIfPresent = function (test) {
	test.expect(2);
	var fn1;
	var fn2 = function (a) {
		test.equal(a, 1);
	};
	var fn3 = function () {
		return true;
	};
	test.ok(fn.callIfPresent(fn3));
	fn.callIfPresent(fn1);
	fn.callIfPresent(fn2, [1]);
	test.done();
};

exports.testReadFile = function (test) {
	test.expect(1);
	file.read('./test/resources/staticFile.txt',
		function (fileContent) { // onSuccess
			test.equals(fileContent, 'this is a static file');
			test.done();
		}, function (err) { // onError
			test.ok(false, 'Error reading file. ' + err);
			test.done();
		});
};

exports.testMongoDb = function (test) {
	var dbSettings = {
		url: "127.0.0.1",
		port: 27017,
		databaseName: 'testNode'
	};
	mongoDb.establishConnection(dbSettings, function (db) {
		test.ok(db.serverConfig.connected);

		var testPlan = plan.create();

		testPlan.addTask(function (task) {
			mongoDb.readList({
					db: db,
					collectionName: "testCollection"
				}, function (resultArray) { // onSuccess
					test.equals(resultArray.length, 2);
					task.done();
				});
		});

		testPlan.addTask(function (task) {
			mongoDb.read({
					db: db,
					collectionName: "testCollection",
					query: { 'name': 'Test Record' }
				}, function (resultObject) { // onSuccess
					test.equals(resultObject.name, 'Test Record');
					task.done();
				});
		});

		testPlan.onFinish(function () {
			test.done();
		});

		testPlan.run();
	});
};


