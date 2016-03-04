function doc_ready() {
	var content_wrapper = $("#content-wrapper"), window_height = $(window).outerHeight(true);
	content_wrapper.css('top', $('#navbar-top').outerHeight(true)).height(window_height - $('#navbar-top').outerHeight(true));
	vert_padding_align();
	if (page_ready)
		page_ready();
	// console.log($("#navbar-top").outerHeight());
	// if (document.getElementById('navbar-top') !== null)
	// 	document.body.style.paddingTop = document.getElementById('navbar-top').clientHeight + "px";
};

var page_ready = 0;

var navbar_height = null;
var count_repeats = 0;
var get_final_navbar_height = setInterval(function () {
	var temp_height = $("#navbar-top").outerHeight();
	if (temp_height != navbar_height)
		if (navbar_height) {
			doc_ready();
			clearInterval(get_final_navbar_height);
		}
		else	navbar_height = $("#navbar-top").outerHeight();
	count_repeats++;
	if (count_repeats > 5) {
		doc_ready();
		clearInterval(get_final_navbar_height);
	}
}, 30);

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