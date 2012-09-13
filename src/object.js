exports.getType = getType;
exports.isFunction = isFunction;
exports.isArray = isArray;
exports.isWindow = isWindow;
exports.isNumeric = isNumeric;
exports.isPlainObject = isPlainObject;
exports.isEmptyObject = isEmptyObject;
exports.isDefined = isDefined;
exports.owns = owns;
exports.extend = extend;
exports.clone = clone;


/**
 * Following code is "stolen" from jQuery
 * functions getType, isFunction, isArray, isWindow, isNumeric,
 * hasOwn, isPlainObject, isEmptyObject and extend
 * were taken from jQuery framework with only minor changes.
 */
var classToType = [];
	classToType["[object Boolean]"] = "boolean";
	classToType["[object Number]"] = "number";
	classToType["[object String]"] = "string";
	classToType["[object Function]"] = "function";
	classToType["[object Array]"] = "array";
	classToType["[object Date]"] = "date";
	classToType["[object RegExp]"] = "regexp";
	classToType["[object Object]"] = "object";

function getType( obj ) {
	return obj == null ?
		String( obj ) :
		classToType[ toString.call(obj) ] || "object";
}

function isFunction( obj ) {
	return getType(obj) === "function";
}

function isArray( obj ) {
	if (Array.isArray) {
		return Array.isArray(obj);
	} else {
		return getType(obj) === "array";
	}
}

function isWindow( obj ) {
	return obj != null && obj == obj.window;
}

function isNumeric( obj ) {
	return !isNaN( parseFloat(obj) ) && isFinite( obj );
}

function isPlainObject( obj ) {
	// Must be an Object.
	// Because of IE, we also have to check the presence of the constructor property.
	// Make sure that DOM nodes and window objects don't pass through, as well
	if ( !obj || getType(obj) !== "object" || obj.nodeType || isWindow( obj ) ) {
		return false;
	}

	try {
		// Not own constructor property must be Object
		if ( obj.constructor &&
				!owns(obj, "constructor") &&
				!owns(obj.constructor.prototype, "isPrototypeOf") ) {
			return false;
		}
	} catch ( e ) {
		// IE8,9 Will throw exceptions on certain host objects #9897
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for ( key in obj ) {}
	return key === undefined || owns( obj, key );
}

function isEmptyObject( obj ) {
	for ( var name in obj ) {
		return false;
	}
	return true;
}

function isDefined( obj ) {
	if (typeof obj === 'undefined') {
		return false;
	}
	if (obj === null) {
		return false;
	}
	return true;
}

/**
 * Shortcut for Object.hasOwnProperty
 * @param obj
 * @param propertyName
 */
function owns(obj, propertyName) {
	return Object.prototype.hasOwnProperty.call(obj, propertyName);
}

function extend() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !isFunction(target) ) {
		target = {};
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( isPlainObject(copy) || (copyIsArray = isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && isArray(src) ? src : [];

					} else {
						clone = src && isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
}

function clone() {
	var target = arguments[0] || {};
	var deep = false;
	if ( typeof arguments[1] === "boolean" ) {
		deep = arguments[1];
	}
	return extend(deep, {}, target);
}

