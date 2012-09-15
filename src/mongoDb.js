exports.establishConnection = establishConnection;
exports.readList = readList;
exports.readRecord = readRecord;
exports.insertRecord = insertRecord;

var mongoDb = require('mongodb');

var fn = require('./function.js');

/**
 * Setup MongoDb database connection
 * @param settings
 * @param onSuccess
 * @param [onFailure]
 */
function establishConnection(settings, onSuccess, onFailure) {
	var mongoServer = new mongoDb.Server(settings.url, settings.port, {});
	var db = new mongoDb.Db(settings.databaseName, mongoServer, {});
	db.open(function(err, pClient) {
		if (err) {
			fn.callIfPresent(onFailure, [err]);
		} else {
			onSuccess(db);
		}
	});
}

/**
 * Reads a list of documents from single collection
 * @param queryObject
 * @param onSuccess
 * @param [onFailure]
 */
function readList(queryObject, onSuccess, onFailure) {
	queryObject.db.collection(queryObject.collectionName, function (err, resultCollection) {
		if (err) {
			fn.callIfPresent(onFailure, [err]);
		} else {
			resultCollection.find().toArray(function (err, resultArray) {
				if (err) {
					fn.callIfPresent(onFailure, [err]);
				} else {
					if (typeof queryObject.filter === 'function') {
						for (var i = 0, l = resultArray.length; i < l; i++) {
							queryObject.filter(resultArray[i]);
						}
					}
					onSuccess(resultArray);
				}
			});
		}
	});
}

/**
 * Reads a single document from a collection, using selector object.
 * @param queryObject
 * @param onSuccess
 * @param [onFailure]
 */
function readRecord(queryObject, onSuccess, onFailure) {
	queryObject.db.collection(queryObject.collectionName, function (err, resultCollection) {
		if (err) {
			fn.callIfPresent(onFailure, [err]);
		} else {
			resultCollection.findOne(queryObject.query, function (err, resultObject) {
				if (err) {
					fn.callIfPresent(onFailure, [err]);
				} else {
					onSuccess(resultObject);
				}
			});
		}
	});
}


/**
 * Inserts a document to a database.
 * @param recordObject
 * @param queryObject - specifies the location where the record shall be located
 * @param [onSuccess]
 * @param [onFailure]
 */
function insertRecord(recordObject, queryObject, onSuccess, onFailure) {
	queryObject.db.collection(queryObject.collectionName, function (err, targetCollection) {
		if (err) {
			fn.callIfPresent(onFailure, [err]);
		} else {
			targetCollection.insert(recordObject, { safe: true }, function (err) {
				if (err) {
					fn.callIfPresent(onFailure, [err]);
				} else {
					fn.callIfPresent(onSuccess);
				}
			});
		}
	});
}