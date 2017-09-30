/**
 * Function that checks if two arrays are equal
 * @param  {Object} array1  one of the arrays to test
 * @param  {Object} array2  the other array to test
 * @return {boolean}        returns true if arrays are equal
 */
function arraysEqual(array1, array2) {
	if (!Array.isArray(array1) && !Array.isArray(array2))
		return array1 === array2;

	if (array1.length !== array2.length)
		return false;

	for (var i = 0, len = array1.length; i < len; i++)
		if (!arraysEqual(array1[i], array2[i]))
			return false;

	return true;
}
