var sieve;
var start_time;
var error;

$('#calculate-btn').click(function() {
  var num = Big($('#input-number').val());
  if (!sieve) {
    alert("Generate a sieve first!");
    return;
  }
  start_time = new Date().getTime();
  error = false;
  var factors;
  if (num.gt(9007199254740992))
    factors = big_factor(num);
  else factors = factor(Math.round(num));
  if (factors === 0)
    $('#calculations-div').text(num + " is pretty cool!");
  else if (factors == 1)
    $('#calculations-div').text(num + " is a prime number!");
  else $('#calculations-div').text(factors);
  $('#time-div').text("Time Elapsed: " + (new Date().getTime() - start_time) / 1000 + " seconds");
  if (error)
    alert("Error possible, try increasing the sieve");
});

function big_factor(num) {
  var diviser = get_big_diviser(num);
  if (num.eq(1))
    return 0;
  else if (num.eq(diviser))
    return 1;
  else {
    var power = 1, last_diviser = diviser;
    num = num.div(diviser);
    var factors = diviser + "";
    do {
      diviser = get_big_diviser(num);
      num = num.div(diviser);
      if (diviser.eq(last_diviser))
        power++;
      else {
        if (power > 1)
          factors += "^" + power;
        factors += " * " + diviser;
        power = 1;
        last_diviser = diviser;
      }
    } while (num.gt(1));
    if (power > 1)
      factors += "^" + power;
    return factors;
  }
}

function factor(num) {
  var diviser = get_diviser(num);
  if (num == 1)
    return 0;
  else if (num == diviser)
    return 1;
  else {
    var power = 1, last_diviser = diviser;
    num /= diviser;
    var factors = diviser + "";
    do {
      diviser = get_diviser(num);
      num /= diviser;
      if (diviser == last_diviser)
        power++;
      else {
        if (power > 1)
          factors += "^" + power;
        factors += " * " + diviser;
        power = 1;
        last_diviser = diviser;
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
    create_sieve();
    $('#sieve-generated').text("Generated");
  }, 20);
});

function create_sieve() {
  for (var i = 0; i < sieve.length; i++)
    if (sieve[i])
      remove_items(i + 1);
}

function remove_items(multiple) {
  for (var i = 2 * multiple - 1; i < sieve.length; i+= multiple)
    sieve[i] = false;
}

function get_big_diviser(num) {
  var end = Math.floor(num.sqrt());
  var end_at = sieve.length < end ? sieve.length - 1:end;
  for (var i = 0; i <= end_at; i++)
    if (sieve[i] && num.mod(i + 1).eq(0))
      return Big(i + 1);
  if (sieve.length < end) {
    error = true;
    console.log("error");
  }
  return num;
}

function get_diviser(num) {
  var end = Math.floor(Math.sqrt(num));
  var end_at = sieve.length < end ? sieve.length - 1:end;
  for (var i = 0; i <= end_at; i++)
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

function falldown_number(previous_numbers, symbol) {
  var falldown = $('<div class="falling-number"></div>').text(String(previous_numbers).replace(/,/g, symbol));
  $('body').append(falldown);
  var top = $(window).outerHeight(true);
  $('.falling-number').each(function() {
    top -= $(this).outerHeight();
  });
  falldown.animate({top: top}, 10000, 'linear');
}

$('#pdp').click(function() {
  if (sieve)
    prime_diviser_prime($('#input-number').val());
  else alert("Generate a sieve first!");
});

function prime_diviser_prime(num) {
  var steps = -1;
  error = false;
  num = Big(num);
  var previous_numbers = [num];
  var factors;
  start_time = new Date().getTime();
  do {
    steps++;
    if (num.gt(9007199254740992))
      factors = big_factor(num);
    else factors = factor(Math.round(num));
    num = factors_to_num(factors);
    previous_numbers.push(num);
  } while (factors !== 0 && factors != 1);
  $('#time-div').text("Time Elapsed: " + (new Date().getTime() - start_time) / 1000 + " seconds");
  $('#calculations-div').text("Num Steps: " + steps);
  if (error)
    falldown_number(previous_numbers, " ?> ");
  else falldown_number(previous_numbers, " > ");
}

function factors_to_num(factors) {
  if (factors == 1 || factors === 0)
    return Big(factors);
  var no_symbols = factors.replace(/ /g, '').replace(/\*/g, '').replace(/\^/g, '');
  return Big(no_symbols);
}

function factors_to_num_no_exp(factors) {
  if (factors == 1 || factors === 0)
    return Big(factors);
  var no_symbols = factors.replace(/\^[0-9].?/g, '').replace(/ /g, '').replace(/\*/g, '');
  return Big(no_symbols);
}

function same_thing(num, factors, exp) {
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

function reciprocal_pdp(start, end, exp) {
  var factors;
  for (var num = start; num <= end; num++) {
    factors = factor(num);
    if (Math.floor(exp ? factors_to_num(factors):factors_to_num_no_exp(factors)) == num)
      console.log(num);
  }
  console.log("Done!");
}

function reciprocal_pdp_st(start, end, exp) {
  var factors, count = 0;
  for (var num = start; num <= end; num++) {
    factors = factor(num);
    if (same_thing(num + "", factors, exp)) {
      console.log(num + "\t" + factors);
      count++;
    }
  }
  console.log("Done! " + (count / (end - start) * 100) + "%");
}

function random_pdp_in_range(lower, upper, exp) {
  var factors, ran;
  lower = Big(lower);
  upper = Big(upper);
  while (true) {
    ran = Big(Math.random()).times(upper.minus(lower)).plus(lower).round();
    factors = big_factor(ran);
    if (same_thing(ran + "", factors, exp)) {
      console.log(ran + "\t" + factors);
      return;
    }
  }
}