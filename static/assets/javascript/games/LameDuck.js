var fish = document.getElementById("fish-images").children;
var wrapperTop;
var maxScore = 25;

setInterval(function () {
	var elems = document.getElementsByClassName("fish");
	var duck = $(document.getElementById("duck"));
	var e1, e2;
	if (Math.random() > 0.9)
	for (var i = 0; i < elems.length - 1; i++) {	// check overlapping fish
		e1 = $(elems[i]);
		for (var a = i + 1; a < elems.length; a++) {
			e2 = $(elems[a])
			if (elemOverlap(e1, e2))
				if (canEat(e1, e2))
					eatElem(e1, e2);
				else if (canEat(e2, e1))
					eatElem(e2, e1);
		}
	}
	for (var i = 0; i < elems.length; i++) {	// check duck overlaps
		e1 = $(elems[i]);
		resizeElem(e1, e1.data("width") * 0.993, e1.data('ratio'));
		if (elemOverlap(e1, duck))
			if (canEat(e1, duck))
				eatElem(e1, duck);
			else if (canEat(duck, e1))
				eatElem(duck, e1);
	}
	if (duck.data("width") > 13)
		resizeElem(duck, duck.data("width") * 0.997, duck.data('ratio'));
}, 200);

var duck = $('#duck').data('ratio', 1).data('count', 0);
var count = 0;

function rotateDuck(rad) {
	duck.css({transform: 'rotate(' + rad + 'rad)'});
}

function resizeElemAbs(elem, width, height)	{
	elem.css({width: width + 'px', height: height + 'px', 'z-index': parseInt((width + height) / 2, 10) + 50});
}

function getElemWidth(elem) {
	if (elem.outerWidth() >= elem.outerHeight())
		return elem.outerWidth();
	return elem.outerHeight();
}

function resizeElem(elem, width, ratio) {
	if (elem.attr('id') === 'duck') {
		elem.data("width", width);
		if (ratio >= 1)
			resizeElemAbs(elem, width, width / ratio);
		else resizeElemAbs(elem, width * ratio, width);
		if (width > maxScore) {
			maxScore = width + 0.5 | 0;
			$("#high-score").text(maxScore);
		}
		$('#score').text(width + 0.5 | 0);
	}
	else {
		if (width * ratio < 6 || width / ratio < 6) {
			elem.remove();
			return;
		}
		if (ratio >= 1) {
			if (Math.abs(width - elem.outerWidth()) > 1)
				resizeElemAbs(elem, width, width / ratio);
		}
		else if (Math.abs(width - elem.outerHeight()) > 1)
			resizeElemAbs(elem, width * ratio, width);
		elem.data("width", width);
	}
}

function calcDist(dx, dy) {
	xd2 = Math.pow(dx, 2);
	yd2 = Math.pow(dy, 2);
	return Math.sqrt(xd2 + yd2);
}

function getDuckSpeed() {
	return duck.data("width") / 10.0;
}

function getFishSpeed(fish) {
	return (fish.outerWidth() + fish.outerHeight()) / 2.0;
}

function eatElem(hunter, prey)	{
	resizeElem(hunter, Math.sqrt(Math.pow(hunter.data("width"), 2) + Math.pow(prey.data("width"), 2)), hunter.data('ratio'));
	if (prey.attr('id') === "duck")	{ // new game functionality
		prey.hide();
		alert("Game Over!!!, Your Score: " + maxScore + "!!!");
		$('.fish').remove();
		resizeElem(duck, 25, duck.data('ratio'));
		prey.show();
		maxScore = 25;
		$("#high-score").text(maxScore);
		$('#score').text(duck.data("width"));
	}
	else prey.remove();
}

function canEat(hunter, prey)	{
	return hunter.outerWidth() >= prey.outerWidth() * 1.1 && hunter.outerHeight() >= prey.outerHeight() * 1.1;
}

function elemOverlap(elema, elemb){

	var offseta = elema.offset();
	var offsetb = elemb.offset();

	var al = offseta.left;
	var ar = al + elema.outerWidth();
	var bl = offsetb.left;
	var br = bl + elemb.outerWidth();

	var at = offseta.top;
	var ab = at + elema.outerHeight();
	var bt = offsetb.top;
	var bb = bt + elemb.outerHeight();

	if(bl>ar || br<al){return false;}//overlap not possible
	if(bt>ab || bb<at){return false;}//overlap not possible

	return true;
}

function moveElem(elem, x, y, distance, speed, callback)	{
	elem.clearQueue();
	elem.animate(
		{left: x + 'px', top: y + 'px'},
		{duration: distance * speed, easing: "linear", complete: function() {
			elem.css({left: x + 'px', top: y + 'px'});
			if (callback)
				callback(elem);
		},
		// step: function() {
			// elem.data('count', elem.data('count') + 1);
			// if (elem.data('count') % 10 === 0)
			//	 if (elem == duck)
			//		 resizeElem(elem, getElemWidth(elem) * 0.999, elem.data('ratio'));
			//	 else resizeElem(elem, getElemWidth(elem) * 0.9999, elem.data('ratio'));
		// }
	});
}

function moveDuck(x, y)	{
	x -= duck.outerWidth() / 2.0;
	y -= duck.outerHeight() / 2.0;
	var offset = duck.offset();
	var dx = x - offset.left;
	var dy = y - offset.top;
	rotateDuck(Math.atan2(dy, dx));
	count++;
	if (count % 5 === 0)
		moveElem(duck, x, y, calcDist(dx, dy), getDuckSpeed());
}

function moveFish(fish) {
	var dx = -3 * fish.outerWidth() + 6 * fish.outerWidth() * Math.random();
	var dy = -3 * fish.outerHeight() + 6 * fish.outerHeight() * Math.random();
	var offset = fish.offset();
	var x = parseInt(fish.css('left')) + dx;
	var y = parseInt(fish.css('top')) + dy;
	if (x < 0)
		x = 0;
	else if (x > $("#content-wrapper").outerWidth() - fish.outerWidth())
		x = $("#content-wrapper").outerWidth() - fish.outerWidth();

	if (y < wrapperTop)
		y = wrapperTop;
	else if (y > $("#content-wrapper").outerHeight() - fish.outerHeight())
		y = $("#content-wrapper").outerHeight() - fish.outerHeight() - Math.abs(dy);
	moveElem(fish, x, y, calcDist(dx, dy), getFishSpeed(fish), moveFish);
}

function addFish() {
	var oldFish = $(fish[Math.random() * fish.length | 0]);
	var newFish = oldFish.clone();
	var ratio = oldFish.width() * 1.0 / oldFish.height();
	if (oldFish.height() === 0) {
		setTimeout(addFish, 1000 + Math.random() * 3000);
		return;
	}
	newFish.data('ratio', ratio).data('count', 0);
	resizeElem(newFish, duck.data("width") / 2.0 + duck.data("width") * Math.random(), ratio);
	newFish.css({left: Math.random() * ($("#content-wrapper").outerWidth() - newFish.outerWidth()), top: Math.random() * ($("#content-wrapper").outerHeight() - newFish.outerHeight())});
	var conflict = false;
	newFish.siblings().each(function() {
		if (conflict)
			return;
		if (elemOverlap(newFish, $(this)))
			conflict = true;
	});
	if (conflict)
		newFish.remove();
	else {
		newFish.appendTo('#content-wrapper').addClass('fish');
		moveFish(newFish);
	}
	setTimeout(addFish, 1000 + Math.random() * 3000);
}

function pageReady() {
	resizeElem(duck, 25, duck.data('ratio'));
	addFish();

	wrapperTop = $("#content-wrapper").position().top;

	$(window).mousemove(function(evt) { moveDuck(evt.pageX, evt.pageY - wrapperTop);});
	$(window).mousemove();
}