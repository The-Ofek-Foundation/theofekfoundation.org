function getElemProperty(elem, property) {
	return parseInt(
		window.getComputedStyle(elem, null).getPropertyValue(property));
}

function getElemPaddingWidth(elem) {
	return getElemProperty(elem, 'padding-left') +
	       getElemProperty(elem, 'padding-right');
}

function getElemPaddingHeight(elem) {
	return getElemProperty(elem, 'padding-top') +
	       getElemProperty(elem, 'padding-bottom');
}

function getElemWidth(elem) {
	return getElemProperty(elem, 'width') + getElemPaddingWidth(elem);
}

function getElemHeight(elem) {
	return getElemProperty(elem, 'height') + getElemPaddingHeight(elem);
}

function centerVertically(elem) {
	elem.style.top =
		(getElemHeight(elem.parentElement) - getElemHeight(elem)) / 2 + "px";
}

function centerHorizontally(elem) {
	elem.style.left =
		(getElemWidth(elem.parentElement) - getElemWidth(elem)) / 2 + "px";
}

function centerElement(elem) {
	centerVertically(elem);
	centerHorizontally(elem);
}
