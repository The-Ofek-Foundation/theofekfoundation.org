function getElemProperty(elem, property, pseudoSelector=null) {
	property = camelToHtml(property);
	return parseInt(
		window.getComputedStyle(elem, pseudoSelector)
		.getPropertyValue(property)) || 0;
}

function getElemPaddingWidth(elem) {
	return getElemProperty(elem, 'padding-left') +
	       getElemProperty(elem, 'padding-right');
}

function getElemPaddingHeight(elem) {
	return getElemProperty(elem, 'padding-top') +
	       getElemProperty(elem, 'padding-bottom');
}

function getElemBorderWidth(elem) {
	return getElemProperty(elem, 'border-left') +
	       getElemProperty(elem, 'border-right');
}

function getElemBorderHeight(elem) {
	return getElemProperty(elem, 'border-top') +
	       getElemProperty(elem, 'border-bottom');
}

function getElemWidth(elem) {
	return parseInt(getElemData(elem, 'width'))
		|| getElemProperty(elem, 'width') + getElemPaddingWidth(elem)
		|| elem.width
		|| getElemStyle('width');
}

function getElemHeight(elem) {
	return parseInt(getElemData(elem, 'height'))
		|| getElemProperty(elem, 'height') + getElemPaddingHeight(elem)
		|| elem.height
		|| getElemStyle('height');
}

function getElemStyle(elem, prop) {
	return elem.style[prop] || getComputedStyle(elem)[prop];
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
	if (typeof prop === 'object') {
		for (key in prop)
			setElemStyle(elem, key, prop[key]);
		return;
	}
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
	if (typeof key === 'object') {
		for (k in key)
			setElemData(elem, k, key[k]);
	} else elem.dataset[key] = val;
}

function addClassElem(elem, className) {
	if (elem.classList)
		elem.classList.add(className);
	else elem.className += ' ' + className;
}

function removeClassElem(elem, className) {
	if (elem.classList)
		elem.classList.remove(className);
	else elem.className = elem.className.replace(new RegExp('(^|\\b)' +
		className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
}

function hasClassElem(elem, className) {
	if (elem.classList)
		return elem.classList.contains(className);
	return new RegExp('(^| )' + className + '( |$)', 'gi')
		.test(elem.className);
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

function getElemSiblings(elem) {
	return Array.prototype.filter.call(elem.parentNode.children, function (child) {
		return child !== elem;
	});
}

function centerVertically(elem) {
	var pstyle = getElemStyle(elem, 'position'), prop;
	if (pstyle === 'absolute' || pstyle === 'fixed')
		prop = 'top';
	else prop = 'margin-top';
	setElemStyle(elem, prop,
		Math.floor((getElemHeight(elem.parentElement) - getElemHeight(elem)))
		/ 2 + "px");
}

function centerHorizontally(elem) {
	var pstyle = getElemStyle(elem, 'position'), prop;
	if (pstyle === 'absolute' || pstyle === 'fixed')
		prop = 'left';
	else prop = 'margin-left';
	setElemStyle(elem, 'left',
		(getElemWidth(elem.parentElement) - getElemWidth(elem)) / 2 + "px");
}

function centerElem(elem) {
	centerVertically(elem);
	centerHorizontally(elem);
}

function camelToHtml(s){
	return s.replace(/([A-Z])/g, function($1){return "-"+$1.toLowerCase();});
}
