var power = 2;
var mode = 'add';
var nthPower = false;
var inverse = false;

function clear() {
	$('.falling-number').remove();
}

function fact(num) {
	var factt = Big(1);
	while (num.gt('1')) {
		factt = factt.times(num);
		num = num.plus('-1');
	}
	return factt;
}

function contains(num, arr) {
	for (var i = 0; i < arr.length; i+=1)
		if (num.toFixed(0) == arr[i])
			return true;
	return false;
}

function perfectify(num) {
	var total;
	if (mode == 'add' || mode == 'fact' || mode == 'factorial')
		total = Big('0');
	else if (mode == 'mult' || mode =='multiply')
		total = Big('1');
	var len = num.toFixed(0).length;
	for (var i = 0; i < len; i+=1) {
		if (nthPower == 'digit')
			power = parseInt(num.toFixed(0).charAt(i), 10);
		else if (nthPower == 'place')
			power = i + 1;
		else if (nthPower == 'reversePlace')
			power = len - i;
		if (mode == 'add')
			if (inverse)
				total = total.add(Big(Math.pow(power, parseInt(num.toFixed(0).charAt(i), 10))));
			else total = total.add(Big(Math.pow(parseInt(num.toFixed(0).charAt(i), 10), power)));
		else if (mode == 'factorial' || mode == 'fact')
			if (num.toFixed(0).charAt(i) == '0');
			else total = total.add(fact(Big(num.toFixed(0).charAt(i))));
		else if (mode == 'mult' || mode == 'multiply')
			if (num.toFixed(0).charAt(i) == '0');
			else if (inverse)
				total = total.times(Big(Math.pow(power, parseInt(num.toFixed(0).charAt(i), 10))));
			else total = total.times(Big(Math.pow(parseInt(num.toFixed(0).charAt(i), 10), power)));
	}
	return total;
}

function falldownNumber(previousNumbers, symbol) {
	var falldown = $('<div class="falling-number"></div>').text(String(previousNumbers).replace(/,/g, symbol));
	$('body').append(falldown);
	var top = $("#content-wrapper").outerHeight(true);
	$('.falling-number').each(function() {
		top -= $(this).outerHeight();
	});
	falldown.animate({top: top}, 10000, 'linear');
}

function runPerfect(num, previousNumbers, output) {
	var startTime = new Date().getTime();
	var elapsedTime;
	while (!num.eq(Big('1')) && !contains(num, previousNumbers)) {
		elapsedTime = new Date().getTime() - startTime;
		if (elapsedTime > 1000)
			break;
		previousNumbers.push(num.toFixed(0));
		num = perfectify(num);
	}
	previousNumbers.push(num.toFixed(0));
	if (output) {
		if (elapsedTime > 1000)
			$('#calculations-div').text('Inconclusive');
		else if (num.eq(Big('1')))
			$('#calculations-div').text('Happy!');
		else $('#calculations-div').text('Unhappy');
		falldownNumber(previousNumbers, ' > ');
		console.log(String(previousNumbers).replace(/,/g,' > '));
	}
	if (num.eq(Big('1')))
		return true;
	return false;
}

function checkAndRunInput() {
	if ($('#input-number').val().length === 0 || isNaN($('#input-number').val()))
		alert("Please Enter a Number");
	else if ($('#input-number').val() < 0)
		alert("Make sure your Number is Positive");
	else runPerfect(Big($('#input-number').val()), [], true);
}

$('#calculate-btn').click(function() {
	checkAndRunInput();
});

$("#input-number").keydown(function(e) {
	$('#calculations-div').text('???');
	if (e.keyCode == 13)				// enter key
		checkAndRunInput();
});

function evaluate() {
	eval($('#developer-input').val());
	$('#developer-input').val('');
}

$('#eval-btn').click(function() {
	evaluate();
});

$('#developer-input').keydown(function(e) {
	if (e.keyCode == 13)
		evaluate();
});

function findRecursive(start, stop) {
	var li = [];
	for (; start <= stop; start += 1)
		if (perfectify(Big(start)).eq(Big(start))) {
			console.log(start);
			li.push(Big(start));
		}
	falldownNumber(li, ', ');
}

function findHappies(start, stop, output) {
	var happies = [];
	var range = stop - start + 1;
	for (; start <= stop; start += 1)
		if (runPerfect(Big(start), [], false)) {
			if (output)
				console.log(start);
			happies.push(Big(start));
		}
	falldownNumber(happies, ', ');
	console.log("Concentration: " + (happies.length / range));
}

function happyConcent(start, stop) {
	var range = stop - start + 1;
	var happyTotal = 0;
	for (; start <= stop; start += 1)
		if (runPerfect(Big(start), [], false))
			happyTotal += 1;
	console.log("Concentration: " + (happyTotal / range));
}