var headers = getElemsClass('header');
var descriptions = getElemsClass('description');
var collapsibleChildren = getElemsClass('collapsible-list')[0].children;
var hiddenTop = getElemId('hidden-top');
var lastAnimationTime = new Date().getTime() / 1e3 + 1;
var mainDescElem = getElemId('main-desc');

function pageReady() {
	onResize();
}

function onResize() {
	for (var i = 0; i < collapsibleChildren.length; i++) {
		var elem = collapsibleChildren[i];
		if (elem.id.indexOf('hidden') !== -1) continue;
		setElemWidth(elem, parseInt(getElemStyle(elem.parentElement, 'width'))
			- getElemPaddingWidth(elem) - getElemBorderWidth(elem));
	}

	for (var i = 0; i < descriptions.length; i++)
		setElemStyle(descriptions[i], 'top', "-100000px");

	var mainDescHeight = getElemHeight(mainDescElem) +
		getElemBorderHeight(mainDescElem);

	for (var i = headers.length - 1; i >= 0; i--) {
		var elem = headers[i];
		var index = headers.length - i - 1;
		setElemStyle(elem, 'border-top', '0px');
		setElemStyle(elem, 'transition', 'margin-top ' +
			index * Math.pow(0.8, index) + 's');
		if (index === 0)
			setElemStyle(elem, 'transition', 'margin-top 0.7s');
		setElemStyle(elem, 'margin-top', mainDescHeight + index * elem.offsetHeight + 'px');
	}

	setElemStyle(hiddenTop, 'bottom', getElemHeight(contentWrapper) -
		collapsibleChildren[0].offsetTop + "px");
	setTimeout(function () {
		setElemStyle(hiddenTop, 'bottom', getElemHeight(contentWrapper) -
			collapsibleChildren[0].offsetTop + "px");
	}, 100);
}


function slideDownDescription(extendable) {
	var header = extendable.parentElement;
	var desc = header.nextElementSibling;
	setElemStyle(desc, 'top', header.offsetTop + header.offsetHeight - desc.offsetHeight + "px");
	setElemStyle(desc, 'transition', 'margin-top 0s');
	setElemStyle(desc, 'margin-top', "0px");
	setTimeout(function () {
		setElemStyle(desc, 'transition', 'margin-top 1s');
		var extended = false;
		for (var nextChild = header.previousElementSibling; nextChild !== mainDescElem; nextChild = nextChild.previousElementSibling) {
			setElemStyle(nextChild, 'transition', 'margin-top 1s');
			setElemStyle(nextChild, 'margin-top', '+=' + desc.offsetHeight + "px");
		}
		setElemStyle(desc, 'margin-top', desc.offsetHeight + "px");
		addClassElem(extendable, 'extended');
	}, 0);
}

function slideUpDescription(extendable) {
	var header = extendable.parentElement;
	var desc = header.nextElementSibling;
	for (var nextChild = header.previousElementSibling; nextChild !== mainDescElem; nextChild = nextChild.previousElementSibling) {
		setElemStyle(nextChild, 'margin-top', '-=' + desc.offsetHeight + "px");
	}
	setElemStyle(desc, 'margin-top', '-=' + desc.offsetHeight + "px");
	removeClassElem(extendable, 'extended');
}

document.addEventListener('click', function (e) {
	if (hasClassElem(e.target, 'extendable'))
		if (new Date().getTime() / 1e3 - lastAnimationTime > 1) {
			hasClassElem(e.target, 'extended') ? slideUpDescription(e.target):
				slideDownDescription(e.target);
			lastAnimationTime = new Date().getTime() / 1e3;
		}
});
