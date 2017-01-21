var contentWrapper;

document.addEventListener("DOMContentLoaded", docReady);
function docReady() {
	if (getElemHeight(getElemClass('link')) !== getElemHeight(getElemId('navbar-top')))
		setElemStyle(getElemId('navbar-top'), 'height',
			getElemHeight(getElemClass('link')) + "px");
	contentWrapper = getElemId('content-wrapper');
	resizeContentWrapper();
	prt();
	document.addEventListener('click', function(event) {
		var targetElem = event.target;
		if (hasClassElem(targetElem, 'path-link')) {
			setSessionData('path', getElemData(targetElem, 'path'));
			redirect(getElemData(targetElem, 'url'));
		} else if (targetElem.id === 'logout-url') {
			var request = new XMLHttpRequest();
			request.open('POST', getElemData(targetElem, 'url'), true);
			request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
			request.send();
			request.onreadystatechange = function() {
				if (request.readyState == 4 && request.status == 200)
					location.reload();
			};
		}
	});
};

window.addEventListener('resize', function () {
	resizeContentWrapper();
	if (typeof onResize === 'function')
		onResize();
});

function resizeContentWrapper() {
	var windowHeight = getWindowHeight(),
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
		var parentWidth = getElemWidth(elem.parentElement);
		while (getElemHeight(elem) > parentHeight || getElemWidth(elem) > parentWidth)
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

function setSessionData(key, val) {
	try {
		setLocallyStored(key, val);
	} catch(err) {}
	try {
		setCookie(key, val, 365 * 100);
	} catch(err) {}
}

function getSessionData(key) {
	return getLocallyStored(key) || getCookie(key);
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
			var cookie = cookies[i].trim();
			// Does this cookie string begin with the name we want?
			if (cookie.substring(0, name.length + 1) === (name + '=')) {
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
			}
		}
	}
	return cookieValue;
}

function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires="+d.toUTCString();
	document.cookie = cname + "=" + cvalue + "; " + expires;
}

var csrftoken = getSessionData('csrftoken');
function csrfSafeMethod(method) {
	// these HTTP methods do not require CSRF protection
	return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

function addXMLRequestCallback(callback){
	var oldSend, i;
	if( XMLHttpRequest.callbacks ) {
		// we've already overridden send() so just add the callback
		XMLHttpRequest.callbacks.push( callback );
	} else {
		// create a callback queue
		XMLHttpRequest.callbacks = [callback];
		// store the native send()
		oldSend = XMLHttpRequest.prototype.send;
		// override the native send()
		XMLHttpRequest.prototype.send = function(){
			// process the callback queue
			// the xhr instance is passed into each callback but seems pretty useless
			// you can't tell what its destination is or call abort() without an error
			// so only really good for logging that a request has happened
			// I could be wrong, I hope so...
			// EDIT: I suppose you could override the onreadystatechange handler though
			for( i = 0; i < XMLHttpRequest.callbacks.length; i++ ) {
				XMLHttpRequest.callbacks[i]( this );
			}
			// call the native send()
			oldSend.apply(this, arguments);
		}
	}
}

addXMLRequestCallback(function(xhr) {
	xhr.setRequestHeader("X-CSRFToken", csrftoken);
});
