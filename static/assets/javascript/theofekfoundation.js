$(document).ready(function () {
	vert_padding_align();
	console.log("heya");
});

function doc_ready() {
	var content_wrapper = $("#content-wrapper"), window_height = $(window).outerHeight(true);
	content_wrapper.css('top', $('#navbar-top').outerHeight(true)).height(window_height - $('#navbar-top').outerHeight(true));
	vert_padding_align();
	prt();
	// console.log($("#navbar-top").outerHeight());
	// if (document.getElementById('navbar-top') !== null)
	// 	document.body.style.paddingTop = document.getElementById('navbar-top').clientHeight + "px";
};

function prt() {	// page ready test
	// console.log("testing3");
	if (typeof page_ready === "function")
		page_ready();
	else if (page_ready === null)
		setTimeout(prt, 500);
}

var page_ready = null;

var navbar_height = null;
var count_repeats = 0;
var get_final_navbar_height = setInterval(function () {
	var temp_height = $("#navbar-top").outerHeight();
	// console.log(temp_height);
	if (temp_height != navbar_height)
		if (navbar_height) {
			doc_ready();
			clearInterval(get_final_navbar_height);
		}
		else	navbar_height = $("#navbar-top").outerHeight();
	if (temp_height !== null)
		count_repeats++;
	if (count_repeats > 20 && temp_height !== null) {
		doc_ready();
		clearInterval(get_final_navbar_height);
	}
}, 60);

function vert_padding_align() {
	var vert_padding_align = document.getElementsByClassName('vert-padding-align');
	for (var i = 0, elem = $(vert_padding_align[i]); i < vert_padding_align.length; i++, elem = $(vert_padding_align[i]))
		elem.css('padding-top', (elem.parent().height() - elem.height()) / 2 + "px");
}

function fit_parent() {
	var fit_parents = document.getElementsByClassName("fit-parent");
	var fp = fit_parents, elem;
	for (var i = 0; i < fp.length; i++) {
		elem = $(fp[i]);
		while (elem.height() > elem.parent().height())
		    elem.css('font-size', (parseInt(elem.css('font-size')) - 1) + "px" );
	}
}

function vert_align() {
	var vert_aligns = document.getElementsByClassName("vert-align");

	var va = vert_aligns, elem;
	for (var i = 0; i < va.length; i++) {
		elem = $(va[i]);
		elem.css('margin-top', (elem.parent().height() - elem.height()) / 2 + "px");
	}
}

function window_at(elem) {
	return $(document).scrollTop() + $(window).height() - $('.footer').outerHeight(true) >= elem.position().top;
}

function redirect(url) {
	window.location.href = url;
}