function getElemProperty(elem, property) {
	property = camelToHtml(property);
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

function getElemStyle(elem, prop) {
	return elem.style[prop];
}

function getStyleOperator(value) {
	if (value.indexOf('px') !== -1)
		return 'px';
	if (value.indexOf('em') !== -1)
		return 'em';
	if (value.indexOf('pt') !== -1)
		return 'pt';
	if (value.indexOf('rem') !== -1)
		return 'rem';
}

function setElemStyle(elem, prop, value) {
	value += '';
	if (value.substring(0, 2) === '+=')
		value = getElemProperty(elem, prop) + parseInt(value.substring(2)) +
			getStyleOperator(value);
	else if (value.substring(0, 2) === '-=')
		value = getElemProperty(elem, prop) - parseInt(value.substring(2)) +
			getStyleOperator(value);
	elem.style[prop] = value;
}

function setElemWidth(elem, px) {
	setElemStyle(elem, 'width', parseInt(px) + 'px');
}

function setElemHeight(elem, px) {
	setElemStyle(elem, 'height', parseInt(px) + 'px');
}

function getWindowWidth() {
	return window.innerWidth;
}

function getWindowHeight() {
	return window.innerHeight;
}

function getElemId(id) {
	return document.getElementById(id);
}

function getElemQuery(query) {
	return document.querySelector(query);
}

function getElemsClass(className) {
	return document.getElementsByClassName(className);
}

function getElemsName(name) {
	return document.getElementsByName(name);
}

function getElemName(name) {
	return getElemsName(name)[0];
}

function getElemClass(className) {
	return getElemsClass(className)[0];
}

function getElemData(elem, key) {
	return elem.dataset[key];
}

function setElemData(elem, key, val) {
	elem.dataset[key] = val;
}

function elemHasClass(elem, cls) {
	return elem.classList.contains(cls);
}

function setInputValue(name, value) {
	if (typeof value === 'boolean')
		getElemName(name).checked = value;
	else getElemName(name).value = value;
}

function getInputValue(name) {
	var inputElem = getElemName(name);
	if (inputElem.type === 'checkbox')
		return inputElem.checked;
	else if (inputElem.type === 'number')
		if (inputElem.value % 1 === 0)
			return parseInt(inputElem.value);
		else return parseFloat(inputElem.value);
	else return inputElem.value;
}

function centerVertically(elem) {
	setElemStyle(elem, 'top',
		Math.floor((getElemHeight(elem.parentElement) - getElemHeight(elem)))
		/ 2 + "px");
}

function centerHorizontally(elem) {
	setElemStyle(elem, 'left',
		(getElemWidth(elem.parentElement) - getElemWidth(elem)) / 2 + "px");
}

function centerElement(elem) {
	centerVertically(elem);
	centerHorizontally(elem);
}

function camelToHtml(s){
	return s.replace(/([A-Z])/g, function($1){return "-"+$1.toLowerCase();});
}
