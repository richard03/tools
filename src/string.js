exports.trim = trim;

/**
 * TODO: improve this
 */
function trim(str) {
	str = str.replace(/^\s*/, '');
	str = str.replace(/\s*$/, '');
	return str;
//	return str.replace(' ', '');
}

