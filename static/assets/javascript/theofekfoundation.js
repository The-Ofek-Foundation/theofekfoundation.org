$(document).ready(function () {
	vertPaddingAlign();
	// console.log("heya");
});

function docReady() {
	var contentWrapper = $("#content-wrapper"), windowHeight = $(window).outerHeight(true);
	contentWrapper.css('top', $('#navbar-top').outerHeight(true)).height(windowHeight - $('#navbar-top').outerHeight(true));
	vertPaddingAlign();
	prt();
	// console.log($("#navbar-top").outerHeight());
	// if (document.getElementById('navbar-top') !== null)
	// 	document.body.style.paddingTop = document.getElementById('navbar-top').clientHeight + "px";

	$(".path-link").click(function(event) {
		setLocallyStored("path", $(this).data('path'));
		redirect($(this).data('url'));
	});

	$("#logout-url").click(function(event) {
		$.post($(this).data('url'),
			function (data) {
				redirect(window.location.href);
			}
		)
	});
};

function prt() {	// page ready test
	// console.log("testing3");
	if (typeof pageReady === 'function')
		pageReady();
	else if (pageReady === null)
		setTimeout(prt, 500);
}

var pageReady = null;

var navbarHeight = null;
var countRepeats = 0;
var getFinalNavbarHeight = setInterval(function () {
	var tempHeight = $("#navbar-top").outerHeight();
	// console.log(tempHeight);
	if (tempHeight != navbarHeight)
		if (navbarHeight) {
			docReady();
			clearInterval(getFinalNavbarHeight);
		} else navbarHeight = $("#navbar-top").outerHeight();
	if (tempHeight !== null)
		countRepeats++;
	if (countRepeats > 20 && tempHeight !== null) {
		docReady();
		clearInterval(getFinalNavbarHeight);
	}
}, 60);

function vertPaddingAlign() {
	var vertPaddingAlign = document.getElementsByClassName('vert-padding-align');
	for (var i = 0, elem = $(vertPaddingAlign[i]); i < vertPaddingAlign.length; i++, elem = $(vertPaddingAlign[i]))
		elem.css('padding-top', (elem.parent().height() - elem.height()) / 2 + "px");
}

function fitParent() {
	var fitParents = document.getElementsByClassName("fit-parent");
	var fp = fitParents, elem;
	for (var i = 0; i < fp.length; i++) {
		elem = $(fp[i]);
		while (elem.height() > elem.parent().height())
			elem.css('font-size', (parseInt(elem.css('font-size')) - 1) + "px" );
	}
}

function vertAlign() {
	var vertAligns = document.getElementsByClassName("vert-align");

	var va = vertAligns, elem;
	for (var i = 0; i < va.length; i++) {
		elem = $(va[i]);
		elem.css('margin-top', (elem.parent().height() - elem.height()) / 2 + "px");
	}
}

function windowAt(elem) {
	return $(document).scrollTop() + $(window).height() - $('.footer').outerHeight(true) >= elem.position().top;
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