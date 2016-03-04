var power = 2;
var mode = 'add';
var nth_power = false;
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
    if (nth_power == 'digit')
      power = parseInt(num.toFixed(0).charAt(i), 10);
    else if (nth_power == 'place')
      power = i + 1;
    else if (nth_power == 'reverse_place')
      power = len - i;
    if (mode == 'add')
      if (inverse)
        total = total.add(Big(Math.pow(power, parseInt(num.toFixed(0).charAt(i), 10))));
      else
      total = total.add(Big(Math.pow(parseInt(num.toFixed(0).charAt(i), 10), power)));
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

function falldown_number(previous_numbers, symbol) {
  var falldown = $('<div class="falling-number"></div>').text(String(previous_numbers).replace(/,/g, symbol));
  $('body').append(falldown);
  var top = $("#content-wrapper").outerHeight(true);
  $('.falling-number').each(function() {
    top -= $(this).outerHeight();
  });
  falldown.animate({top: top}, 10000, 'linear');
}

function run_perfect(num, previous_numbers, output) {
  var start_time = new Date().getTime();
  var elapsed_time;
  while (!num.eq(Big('1')) && !contains(num, previous_numbers)) {
    elapsed_time = new Date().getTime() - start_time;
    if (elapsed_time > 1000)
      break;
    previous_numbers.push(num.toFixed(0));
    num = perfectify(num);
  }
  previous_numbers.push(num.toFixed(0));
  if (output) {
    if (elapsed_time > 1000)
      $('#calculations-div').text('Inconclusive');
    else if (num.eq(Big('1')))
      $('#calculations-div').text('Happy!');
    else
      $('#calculations-div').text('Unhappy');
    falldown_number(previous_numbers, ' > ');
    console.log(String(previous_numbers).replace(/,/g,' > '));
  }
  if (num.eq(Big('1')))
    return true;
  return false;
}

function check_and_run_input() {
  if ($('#input-number').val().length === 0 || isNaN($('#input-number').val()))
    alert("Please Enter a Number");
  else if ($('#input-number').val() < 0)
    alert("Make sure your Number is Positive");
  else run_perfect(Big($('#input-number').val()), [], true);
}

$('#calculate-btn').click(function() {
  check_and_run_input();
});

$("#input-number").keydown(function(e) {
  $('#calculations-div').text('???');
  if (e.keyCode == 13)        // enter key
    check_and_run_input();
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

function find_recursive(start, stop) {
  var li = [];
  for (; start <= stop; start += 1)
    if (perfectify(Big(start)).eq(Big(start))) {
      console.log(start);
      li.push(Big(start));
    }
  falldown_number(li, ', ');
}

function find_happies(start, stop, output) {
  var happies = [];
  var range = stop - start + 1;
  for (; start <= stop; start += 1)
    if (run_perfect(Big(start), [], false)) {
      if (output)
        console.log(start);
      happies.push(Big(start));
    }
  falldown_number(happies, ', ');
  console.log("Concentration: " + (happies.length / range));
}

function happy_concent(start, stop) {
  var range = stop - start + 1;
  var happy_total = 0;
  for (; start <= stop; start += 1)
    if (run_perfect(Big(start), [], false))
      happy_total += 1;
  console.log("Concentration: " + (happy_total / range));
}