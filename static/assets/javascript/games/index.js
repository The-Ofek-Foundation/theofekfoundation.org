var headers = getElemsClass('header');
var descriptions = getElemsClass('description');
var collapsibleChildren = getElemsClass('collapsible-list')[0].children;

function pageReady() {
	for (var i = 0; i < collapsibleChildren.length; i++) {
		var elem = collapsibleChildren[i];
		setElemWidth(elem, parseInt(getElemStyle(elem.parentElement, 'width')) - getElemPaddingWidth(elem) - getElemBorderWidth(elem));
	}

	for (var i = headers.length - 2; i >= 0; i--) {
		var elem = headers[i];
		console.log(elem.offsetHeight);
		var index = headers.length - i - 1;
		setElemStyle(elem, 'border-top', '0px');
		setElemStyle(elem, 'transition', 'margin-top ' + index * Math.pow(0.8, index) + 's');
		setElemStyle(elem, 'margin-top', index * elem.offsetHeight + 'px');
	}
}


function slideDownDescription(header) {
	var desc = header.nextElementSibling;
	setElemStyle(desc, 'top', header.offsetTop + header.offsetHeight - desc.offsetHeight + "px");
	setElemStyle(desc, 'transition', 'margin-top 0s');
	setElemStyle(desc, 'margin-top', "0px");
	setTimeout(function () {
		setElemStyle(desc, 'transition', 'margin-top 2s');
		var extended = false;
		for (var nextChild = header.previousElementSibling; nextChild !== null; nextChild = nextChild.previousElementSibling) {
			setElemStyle(nextChild, 'transition', 'margin-top 2s');
			setElemStyle(nextChild, 'margin-top', '+=' + desc.offsetHeight + "px");
		}
		setElemStyle(desc, 'margin-top', desc.offsetHeight + "px");
		addClassElem(header, 'extended');
	}, 0);
}

function slideUpDescription(header) {
	var desc = header.nextElementSibling;
	for (var nextChild = header.previousElementSibling; nextChild !== null; nextChild = nextChild.previousElementSibling) {
		setElemStyle(nextChild, 'margin-top', '-=' + desc.offsetHeight + "px");
	}
	setElemStyle(desc, 'margin-top', '-=' + desc.offsetHeight + "px");
	removeClassElem(header, 'extended');
}

document.addEventListener('click', function (e) {
	if (hasClassElem(e.target, 'header'))
		if (e.clientX >= e.target.offsetLeft + e.target.offsetWidth -
			getElemProperty(e.target, 'width', ':after') -
			getElemProperty(elem, 'padding-right') && e.clientX <=
			e.target.offsetLeft + e.target.offsetWidth -
			getElemProperty(elem, 'padding-right'))
			hasClassElem(e.target, 'extended') ? slideUpDescription(e.target):
				slideDownDescription(e.target);
});
