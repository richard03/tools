var fs = require('fs');

var fn = require('./function.js');
var obj = require('./object.js');

var fileDefaults = {
	fileType: "binary"
};

/**
 *
 * @param fileName
 * @param [options]
 * @param onSuccess
 * @param [onFailure]
 */
function readFile() {
	var args = fn.mapArguments(arguments, { fileName: "string", options: "object", onSuccess: "function", onFailure: "function"});
	var options = obj.extend({}, fileDefaults, args.options);

	fs.stat(args.fileName, function(err, stats) {
		if (err == null && stats.isFile()) {
			fs.readFile(args.fileName, options.fileType, function(err, fileContent) {
				if (!err) {
					args.onSuccess(fileContent);
				} else if (typeof args.onFailure === 'function') {
					args.onFailure(err);
				}
			});
		} else {
			if (typeof args.onFailure === 'function') {
				args.onFailure(err);
			}
		}
	});
}

exports.read = readFile;