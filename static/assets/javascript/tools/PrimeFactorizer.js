var sieve;
var startTime;
var error;

$('#calculate-btn').click(function() {
	var num = Big($('#input-number').val());
	if (!sieve) {
		alert("Generate a sieve first!");
		return;
	}
	startTime = new Date().getTime();
	error = false;
	var factors;
	if (num.gt(9007199254740992))
		factors = bigFactor(num);
	else factors = factor(Math.round(num));
	if (factors === 0)
		$('#calculations-div').text(num + " is pretty cool!");
	else if (factors == 1)
		$('#calculations-div').text(num + " is a prime number!");
	else $('#calculations-div').text(factors);
	$('#time-div').text("Time Elapsed: " + (new Date().getTime() - startTime) / 1000 + " seconds");
	if (error)
		alert("Error possible, try increasing the sieve");
});

function bigFactor(num) {
	var diviser = getBigDiviser(num);
	if (num.eq(1))
		return 0;
	else if (num.eq(diviser))
		return 1;
	else {
		var power = 1, lastDiviser = diviser;
		num = num.div(diviser);
		var factors = diviser + "";
		do {
			diviser = getBigDiviser(num);
			num = num.div(diviser);
			if (diviser.eq(lastDiviser))
				power++;
			else {
				if (power > 1)
					factors += "^" + power;
				factors += " * " + diviser;
				power = 1;
				lastDiviser = diviser;
			}
		} while (num.gt(1));
		if (power > 1)
			factors += "^" + power;
		return factors;
	}
}

function factor(num) {
	var diviser = getDiviser(num);
	if (num == 1)
		return 0;
	else if (num == diviser)
		return 1;
	else {
		var power = 1, lastDiviser = diviser;
		num /= diviser;
		var factors = diviser + "";
		do {
			diviser = getDiviser(num);
			num /= diviser;
			if (diviser == lastDiviser)
				power++;
			else {
				if (power > 1)
					factors += "^" + power;
				factors += " * " + diviser;
				power = 1;
				lastDiviser = diviser;
			}
		} while (num > 1);
		if (power > 1)
			factors += "^" + power;
		return factors;
	}
}

$('#create-sieve').click(function() {
	$('#sieve-generated').text("Generating...");
	setTimeout(function() {
		var length = Math.floor(Math.sqrt($('#sieve-size').val()));
		sieve = new Array(length);
		sieve[0] = false;
		for (var i = 1; i < length; i++)
			sieve[i] = true;
		createSieve();
		$('#sieve-generated').text("Generated");
	}, 20);
});

function createSieve() {
	for (var i = 0; i < sieve.length; i++)
		if (sieve[i])
			removeItems(i + 1);
}

function removeItems(multiple) {
	for (var i = 2 * multiple - 1; i < sieve.length; i+= multiple)
		sieve[i] = false;
}

function getBigDiviser(num) {
	var end = Math.floor(num.sqrt());
	var endAt = sieve.length < end ? sieve.length - 1:end;
	for (var i = 0; i <= endAt; i++)
		if (sieve[i] && num.mod(i + 1).eq(0))
			return Big(i + 1);
	if (sieve.length < end) {
		error = true;
		console.log("error");
	}
	return num;
}

function getDiviser(num) {
	var end = Math.floor(Math.sqrt(num));
	var endAt = sieve.length < end ? sieve.length - 1:end;
	for (var i = 0; i <= endAt; i++)
		if (sieve[i] && num % (i + 1) === 0)
			return i + 1;
	if (sieve.length < end)
		error = true;
	return num;
}

function clear() {
	$('.falling-number').remove();
}

$('#clear').click(clear);

function falldownNumber(previousNumbers, symbol) {
	var falldown = $('<div class="falling-number"></div>').text(String(previousNumbers).replace(/,/g, symbol));
	$('body').append(falldown);
	var top = $(window).outerHeight(true);
	$('.falling-number').each(function() {
		top -= $(this).outerHeight();
	});
	falldown.animate({top: top}, 10000, 'linear');
}

$('#pdp').click(function() {
	if (sieve)
		primeDiviserPrime($('#input-number').val());
	else alert("Generate a sieve first!");
});

function primeDiviserPrime(num) {
	var steps = -1;
	error = false;
	num = Big(num);
	var previousNumbers = [num];
	var factors;
	startTime = new Date().getTime();
	do {
		steps++;
		if (num.gt(9007199254740992))
			factors = bigFactor(num);
		else factors = factor(Math.round(num));
		num = factorsToNum(factors);
		previousNumbers.push(num);
	} while (factors !== 0 && factors != 1);
	$('#time-div').text("Time Elapsed: " + (new Date().getTime() - startTime) / 1000 + " seconds");
	$('#calculations-div').text("Num Steps: " + steps);
	if (error)
		falldownNumber(previousNumbers, " ?> ");
	else falldownNumber(previousNumbers, " > ");
}

function factorsToNum(factors) {
	if (factors == 1 || factors === 0)
		return Big(factors);
	var noSymbols = factors.replace(/ /g, '').replace(/\*/g, '').replace(/\^/g, '');
	return Big(noSymbols);
}

function factorsToNumNoExp(factors) {
	if (factors == 1 || factors === 0)
		return Big(factors);
	var noSymbols = factors.replace(/\^[0-9].?/g, '').replace(/ /g, '').replace(/\*/g, '');
	return Big(noSymbols);
}

function sameThing(num, factors, exp) {
	if (factors == 1 || factors === 0)
		return false;
	factors = exp ? factors.replace(/ /g, '').replace(/\*/g, '').replace(/\^/g, ''):factors.replace(/\^[0-9].?/g, '').replace(/ /g, '').replace(/\*/g, '');
	if (factors.length != num.length)
		return false;
	var index;
	for (var i = 0; i < num.length; i++) {
		index = factors.indexOf(num.charAt(i));
		if (index < 0)
			return false;
		factors = factors.slice(0, index) + factors.slice(index + 1);
	}
	return true;
}

function reciprocalPdp(start, end, exp) {
	var factors;
	for (var num = start; num <= end; num++) {
		factors = factor(num);
		if (Math.floor(exp ? factorsToNum(factors):factorsToNumNoExp(factors)) == num)
			console.log(num);
	}
	console.log("Done!");
}

function reciprocalPdpSt(start, end, exp) {
	var factors, count = 0;
	for (var num = start; num <= end; num++) {
		factors = factor(num);
		if (sameThing(num + "", factors, exp)) {
			console.log(num + "\t" + factors);
			count++;
		}
	}
	console.log("Done! " + (count / (end - start) * 100) + "%");
}

function randomPdpInRange(lower, upper, exp) {
	var factors, ran;
	lower = Big(lower);
	upper = Big(upper);
	while (true) {
		ran = Big(Math.random()).times(upper.minus(lower)).plus(lower).round();
		factors = bigFactor(ran);
		if (sameThing(ran + "", factors, exp)) {
			console.log(ran + "\t" + factors);
			return;
		}
	}
}