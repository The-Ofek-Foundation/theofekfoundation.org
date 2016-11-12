if (window.location.protocol !== "https:" && window.location.hostname !== "127.0.0.1")
	window.location = window.location.toString().replace(/^http:/, "https:");

document.addEventListener("DOMContentLoaded", docReady);

function docReady() {
	resizeContentWrapper();
	prt();
	document.addEventListener('click', function(event) {
		var targetElem = event.target;
		if (elemHasClass(targetElem, 'path-link')) {
			setLocallyStored("path", getElemData(targetElem, 'path'));
			redirect(getElemData(targetElem, 'url'));
		} else if (targetElem.id === 'logout-url')
			$.post(getElemData(targetElem, 'url'),
				function (data) {
					location.reload();
				}
			)
	});
};

window.addEventListener('resize', function () {
	resizeContentWrapper();
	if (typeof onResize === 'function')
		onResize();
});

function resizeContentWrapper() {
	var contentWrapper = getElemId('content-wrapper'),
	    windowHeight = getWindowHeight(),
	    navbarTopHeight = getElemHeight(getElemId('navbar-top'));
	setElemStyle(contentWrapper, 'top', navbarTopHeight);
	setElemHeight(contentWrapper, windowHeight - navbarTopHeight - 1);
}

function prt() {	// page ready test
	if (typeof pageReady === 'function')
		pageReady();
	else if (pageReady === null)
		setTimeout(prt, 50);
}

var pageReady = null;

function fitParent() {
	var fp = getElemsClass("fit-parent");
	for (var i = 0, elem = fp[i]; i < fp.length; i++, elem = fp[i]) {
		var parentHeight = getElemHeight(elem.parentElement);
		while (getElemHeight(elem) > parentHeight)
			setElemStyle(elem, 'fontSize',
				getElemProperty(elem, 'fontSize') - 1 + "px");
	}
}

function vertAlign() {
	var va = getElemsClass("vert-align");

	for (var i = 0, elem = va[i]; i < va.length; i++, elem = va[i])
		setElemStyle(elem, 'marginTop', (getElemHeight(elem.parentElement) -
			getElemHeight(elem)) / 2 + "px");
}

function windowAt(elem) {
	var doc = document.documentElement;
	return (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0)
		+ getWindowHeight() - getElemHeight(getElemClass('footer'))
		>= elem.offsetTop;
}

function redirect(url) {
	window.location.href = url;
}

function getLocallyStored(key) {
	return JSON.parse(localStorage.getItem(key));
}

function setLocallyStored(key, val) {
	localStorage.setItem(key, JSON.stringify(val));
}

function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function snakeToCamel(s) {
	return s.replace(/(\_\w)/g, function($1){return $1[1].toUpperCase();});
}

function camelToSnake(s){
	return s.replace(/([A-Z])/g, function($1){return "_"+$1.toLowerCase();});
}

function convertToPython(o) {
	for (key in o) {
		if (typeof o[key] === 'boolean')
			o[key] = o[key] ? 'True':'False';
	}
}

function convertFromPython(o) {
	for (key in o) {
		if (typeof o[key] === 'string') {
			if (o[key].toLowerCase() === 'true' || o[key].toLowerCase() === 'false')
				o[key] = o[key].toLowerCase() === 'true';
		}
	}
}

function convertKeysObject(o, revert) {
	newObject = {};
	if (revert) {
		// convertToPython(o);
		for (key in o)
			newObject[camelToSnake(key)] = o[key];
	} else {
		convertFromPython(o);
		for (key in o)
			newObject[snakeToCamel(key)] = o[key];
	}
	return newObject;
}

function castType(val, typedVal) {
	// Cast val to type of typedVal
	switch (typeof typedVal) {
		case 'undefined':
			throw new Error("Error converting to undefined.");
			return val;
		case 'string':
			return String(val);
		case 'number':
			return Number(val);
		case 'boolean':
			return String(val).toLowerCase() === 'true';
		default:
			return val;
	}
}

// using jQuery
function getCookie(name) {
	var cookieValue = null;
	if (document.cookie && document.cookie !== '') {
		var cookies = document.cookie.split(';');
		for (var i = 0; i < cookies.length; i++) {
			var cookie = jQuery.trim(cookies[i]);
			// Does this cookie string begin with the name we want?
			if (cookie.substring(0, name.length + 1) === (name + '=')) {
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
			}
		}
	}
	return cookieValue;
}
var csrftoken = getCookie('csrftoken');
function csrfSafeMethod(method) {
	// these HTTP methods do not require CSRF protection
	return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
	beforeSend: function(xhr, settings) {
		if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
			xhr.setRequestHeader("X-CSRFToken", csrftoken);
		}
	}
});
