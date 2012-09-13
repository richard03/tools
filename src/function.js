exports.checkArguments = checkArguments;
exports.mapArguments = mapArguments;
exports.callIfPresent = callIfPresent;

var obj = require('./object.js');

function checkArguments(argumentsCollection, typeNamesArray) {
	for (var i = 0, l = typeNamesArray.length; i < l; i++) {
		switch (typeNamesArray[i]) {
			case "array":
				if (!(argumentsCollection[i] instanceof Array)) {
					return false;
				}
				break;
			default:
				if (typeof argumentsCollection[i] != "undefined") {
					if (argumentsCollection[i] != null) {
						if ( (typeof argumentsCollection[i]) != typeNamesArray[i]) {
							return false;
						}
					}
				}
				break;
		}
	}
	return true;
}

function mapArguments(argumentsCollection, mappingObject) {
	var args = {};
	var i = 0;
	for (var propertyName in mappingObject) {
		if (obj.owns(mappingObject, propertyName)) {
			args[propertyName] = null;
			switch (mappingObject[propertyName]) {
				case "array":
					if (argumentsCollection[i] instanceof Array) {
						args[propertyName] = argumentsCollection[i];
						i++;
					}
					break;
				default:
					if ( (typeof argumentsCollection[i]) === mappingObject[propertyName]) {
						args[propertyName] = argumentsCollection[i];
						i++;
					}
					break;
			}
		}
	}
	return args;
}

function callIfPresent(callFn) {
	if (typeof callFn === "function") {
		var contextObj, args;
		if (arguments.length > 2) {
			contextObj = arguments[1];
			args = arguments[2];
		} else {
			contextObj = null;
			args = arguments[1];
		}
		return callFn.call(contextObj, args);
	}
	return null;
}


