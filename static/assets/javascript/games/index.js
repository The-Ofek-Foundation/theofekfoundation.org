var headers = getElemsClass('header');
var descriptions = getElemsClass('description');
var collapsibleChildren = getElemsClass('collapsible-list')[0].children;
var hiddenTop = getElemId('hidden-top');
var lastAnimationTime = new Date().getTime() / 1e3 + 1;
var mainDescElem = getElemId('main-desc');

var headerHeight = getElemHeight(headers[0]) + getElemBorderHeight(headers[0]);

var tools = getElemClass('checkmark') === undefined;

if (!tools)
	var checkmarkExtendable = getElemWidth(getElemClass('checkmark'))
		+ getElemWidth(getElemClass('extendable'))
		+ parseInt(getElemStyle(getElemClass('checkmark'), 'margin-left'));

function pageReady() {
	onResize();
}

function onResize() {
	var extended = getElemsClass('extended');
	for (var i = 0; i < extended.length; i++)
		slideUpDescription(extended[i]);

	var collapsibleChildrenWidth =
		parseInt(getElemStyle(headers[0].parentElement, 'width'))
		- getElemPaddingWidth(headers[0]) - getElemBorderWidth(headers[0]);

	for (var i = 0; i < collapsibleChildren.length; i++) {
		var elem = collapsibleChildren[i];
		if (elem.id.indexOf('hidden') !== -1) continue;
		setElemWidth(elem, collapsibleChildrenWidth);
	}

	var headerTitleWidth = collapsibleChildrenWidth - (tools ? 0:checkmarkExtendable) -
		getElemBorderWidth(headers[1]);

	for (var i = 1; i < headers.length; i++)
		setElemStyle(headers[i].firstElementChild, 'max-width', headerTitleWidth + "px");

	for (var i = 0; i < descriptions.length; i++)
		setElemStyle(descriptions[i], 'top', "-100000px");

	var mainDescHeight = getElemHeight(mainDescElem) +
		getElemBorderHeight(mainDescElem);

	for (var i = headers.length - 1; i >= 0; i--) {
		var elem = headers[i];
		var index = headers.length - i - 1;
		if (index === 0)
			setElemStyle(elem, 'transition', 'margin-top 0.7s');
		else setElemStyle(elem, 'transition', 'margin-top ' +
			index * Math.pow(0.8, index) + 's');
		setElemStyle(elem, 'margin-top', mainDescHeight + index * headerHeight + 'px');
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
