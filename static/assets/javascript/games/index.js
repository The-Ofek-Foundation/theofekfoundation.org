var headers = getElemsClass('header');
var descriptions = getElemsClass('description');
var collapsibleChildren = getElemsClass('collapsible-list')[0].children;
var hiddenTop = getElemId('hidden-top');
var lastAnimationTime = new Date().getTime() / 1e3 + 1;

function pageReady() {

	for (var i = 0; i < collapsibleChildren.length; i++) {
		var elem = collapsibleChildren[i];
		if (elem.id.indexOf('hidden') !== -1) continue;
		setElemWidth(elem, parseInt(getElemStyle(elem.parentElement, 'width'))
			- getElemPaddingWidth(elem) - getElemBorderWidth(elem));
	}

	for (var i = headers.length - 2; i >= 0; i--) {
		var elem = headers[i];
		var index = headers.length - i - 1;
		setElemStyle(elem, 'border-top', '0px');
		setElemStyle(elem, 'transition', 'margin-top ' + index * Math.pow(0.8, index) + 's');
		setElemStyle(elem, 'margin-top', index * elem.offsetHeight + 'px');
	}

	setElemStyle(hiddenTop, 'bottom', getElemHeight(contentWrapper) -
		headers[headers.length - 1].offsetTop + "px");
}


function slideDownDescription(header) {
	var desc = header.nextElementSibling;
	setElemStyle(desc, 'top', header.offsetTop + header.offsetHeight - desc.offsetHeight + "px");
	setElemStyle(desc, 'transition', 'margin-top 0s');
	setElemStyle(desc, 'margin-top', "0px");
	setTimeout(function () {
		setElemStyle(desc, 'transition', 'margin-top 1s');
		var extended = false;
		for (var nextChild = header.previousElementSibling; nextChild !== null; nextChild = nextChild.previousElementSibling) {
			setElemStyle(nextChild, 'transition', 'margin-top 1s');
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
			getElemProperty(e.target, 'padding-right') && e.clientX <=
			e.target.offsetLeft + e.target.offsetWidth -
			getElemProperty(e.target, 'padding-right')) {
			if (new Date().getTime() / 1e3 - lastAnimationTime > 1) {
				hasClassElem(e.target, 'extended') ? slideUpDescription(e.target):
					slideDownDescription(e.target);
				lastAnimationTime = new Date().getTime() / 1e3;
			}
		}
});
