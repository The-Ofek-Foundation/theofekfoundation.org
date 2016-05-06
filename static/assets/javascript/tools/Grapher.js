var docwidth, docheight;
var precision = 10;
var EXPR = 'x*sin(x)';
var graph, pen;
var domain = [-15, 15];
var range = [-10, 10];
var line_mode = true;
var previous_trace = false;
var saved_graph = false;
var prev_domain;
var data;
var curr_x, curr_tangent;
var animate = true;
var functions_animating = 0;
var immediate = typeof(setImmediate) == 'undefined' ? false:true;
var increment = immediate ? 0.002:0.02;
var draw_coordinate_axes = true;

$('#expression').val(EXPR);

function update_dri() { // domain, range, increment
  var str = "Domain: " + domain + " ... Range: " + range + " ... Increment: " + increment;
  $('#upper-footer').text(str);
}

function update_xym(x, y, m) { // x, y, slope
  var str = "X: " + x + " ... Y: " + y + " ... Slope: " + m;
  $('#upper-upper-footer').text(str);
}

update_dri();

function restore_graph() {
  var data = pen.getImageData(0, 0, graph.width, graph.height);
  var pixels = data.data;
  for (var i = 0; i < pixels.length; i++)
    pixels[i] = saved_graph[i];
  pen.putImageData(data, 0, 0, 0, 0, data.width, data.height);
}

function save_graph() {
  var data = pen.getImageData(0, 0, graph.width, graph.height);
  var pixels = data.data;
  saved_graph = new Array(pixels.length);
  for (var i = 0; i < pixels.length; i++)
    saved_graph[i] = pixels[i];
  pen.putImageData(data, 0, 0, 0, 0, data.width, data.height);
}

function evaluate_expression(expr, location) {
  return math.round(math.compile(expr).eval({x: location}), precision);
}

function evaluate_expression_exact(expr, location) {
  return math.compile(expr).eval({x: location});
}

function evaluate_derivative(expr, location) {
  return math.round((evaluate_expression_exact(expr, location + 0.0001) - evaluate_expression_exact(expr, location - 0.0001)) / 0.0002, precision);
}

function evaluate_nth_derivative(expr, location, n) {
  if (n == 1)
    return evaluate_derivative(expr, location);
  else if (n < 1)
    return null;
  return math.round((evaluate_nth_derivative(expr, location + 0.0001, n-1) - evaluate_nth_derivative(expr, location - 0.0001, n-1)) / 0.0002, precision);
}

function evaluate_integral(expr, start, end) {
  return math.round((evaluate_expression_exact(expr, start) + evaluate_expression_exact(expr, end)) / 2 * (end-start), precision);
}

function evaluate_integral_point(expr, location) {
  return math.round((evaluate_expression_exact(expr, 0) + evaluate_expression_exact(expr, location)) / 2 * (location-0), precision);
}

function evaluate_zero(expr, location) {
  var slope = evaluate_derivative(expr, location);
  return evaluate_expression("(" + slope + "*" + location + "-" + evaluate_expression(expr, location) + ")/" + slope, location);
}

function get_tangent_expression(expr, location) {
  return evaluate_derivative(expr, location) + '*(x-' + location + ')+' + evaluate_expression(expr, location);
}

function clear_graph(callback) {
  stop_timeout = true;
  pen.clearRect(0, 0, docwidth, docheight);
  pen.fillStyle = "white";
  pen.fillRect(0, 0, docwidth, docheight);
  setTimeout(function() {
    stop_timeout = false;
    functions_animating = 0;
    save_graph();
    callback();
  }, 20);
}

function X(x) { // convert x coord to somewhere on screen
  x = x - domain[0];
  return x * docwidth / (domain[1] - domain[0]);
}

function rX(x) { // convert somewhere on screen to x coord
  x = x / docwidth * (domain[1] - domain[0]);
  return x + domain[0];
}

function Y(y) { // convert y coord to somewhere on screen
  y = y - range[0];
  return docheight - (y * docheight / (range[1] - range[0]));
}

function rY(y) {
  y = docheight - y;
  y = y / docheight * (range[1] - range[0]);
  return y + range[0];
}

function draw_trace(x) {
  var expr = $('#expression').val();
  var y = evaluate_expression(expr, x);
  pen.fillStyle = "black";
  pen.strokeStyle = "black";
  pen.fillRect(X(x)-2, Y(y)-2, 5, 5);
  curr_tangent = get_tangent_expression(expr, x);
  var slope = evaluate_derivative(curr_tangent, x);
//     var inc = Math.sqrt(10/(Math.pow(evaluate_derivative(tangent, x), 2) + 1));
//   var inc = evaluate_expression("sqrt(10/((" + slope + ")^2+1))", 0);
  pen.beginPath();
  pen.moveTo(X(domain[0]), Y(evaluate_expression(curr_tangent, domain[0])));
  pen.lineTo(X(domain[1]), Y(evaluate_expression(curr_tangent, domain[1])));
  pen.stroke();
  update_xym(x, y, slope);
}

function trace(x) {
  restore_graph();
  draw_trace(x);
}

function run_newtons() {
  curr_x = evaluate_zero($('#expression').val(), curr_x);
  draw_trace(curr_x);
}

function draw_axes() {
  pen.strokeStyle = "black";
  pen.beginPath();
  pen.lineWidth = 3;
  pen.moveTo(X(0), 0);
  pen.lineTo(X(0), docheight);
  pen.moveTo(0, Y(0));
  pen.lineTo(docwidth, Y(0));
  pen.stroke();
}

function bad_expression(expr) {
  try {
    evaluate_expression(expr, 0);
    return false;
  }
  catch (err) {
    if ((err + '').indexOf("Invalid number") > 0)
      return false;
    return true;
  }
}

function draw_function(expr, no_save, dom, deriv) {
  if (animate) {
    start_function_animation(expr, no_save, dom, deriv);
    return;
  }
  if (!dom)
    dom = domain;
  if (bad_expression(expr)) {
    alert("Bad Expression!");
    return;
  }
  var x, y;
  var drawing = false;
  var evaluate = deriv ? evaluate_derivative:evaluate_expression;
  pen.strokeStyle = "black";
  pen.fillStyle = "black";
  pen.beginPath();
  pen.lineWidth = 1;

  if (line_mode) {
    y = evaluate(expr, dom[0]);
    pen.moveTo(X(dom[0]), Y(y));
    for (x = dom[0] + increment; x <= dom[1]; x += increment) {
      y = evaluate(expr, x);
      if (Y(y) > docheight || Y(y) < 0 || y.re) {
        if (drawing) {
          drawing = false;
          pen.lineTo(X(x), Y(y));
          pen.stroke();
        }
        pen.beginPath();
        pen.moveTo(X(x), Y(y));
      }
      else {
        pen.lineTo(X(x), Y(y));
        drawing = true;
      }
    }
  }
  else for (x = dom[0]; x <= dom[1]; x += increment)
    pen.fillRect(X(x), Y(evaluate(expr, x)), 1, 1);
  pen.stroke();
  if (!no_save)
    save_graph();
}

var requestAnimationFrame = immediate ?
  function(callback) {
    return setImmediate(callback);
  }:function(callback) {
    return setTimeout(callback, 0);
  };

var stop_timeout = false;

var animate_function_drawing = function(expr, dom, x, prev_y, drawing, no_save, evaluate) {
  if (x > dom[1]) {
    if (!no_save)
      save_graph();
    functions_animating--;
    return;
  }

  var y = evaluate(expr, x);

  if (y.re || stop_timeout) drawing = false;
  else if (line_mode) {
    if (Y(y) > docheight || Y(y) < 0) {
      if (drawing) {
        drawing = false;
        pen.beginPath();
        pen.moveTo(X(x - increment), Y(prev_y));
        pen.lineTo(X(x), Y(y));
        pen.stroke();
      }
    }
    else if (!prev_y.re) {
      pen.beginPath();
      pen.moveTo(X(x - increment), Y(prev_y));
      pen.lineTo(X(x), Y(y));
      pen.stroke();
      drawing = true;
    }
  }
  else
    pen.fillRect(X(x), Y(y), 1, 1);

  if (!stop_timeout)
    requestAnimationFrame(function() {
      animate_function_drawing(expr, dom, x + increment, y, drawing, no_save, evaluate);
    });
};

function start_function_animation(expr, no_save, dom, deriv) {
  if (!dom)
    dom = domain;
  if (bad_expression(expr)) {
    alert("Bad Expression!");
    return;
  }

  pen.strokeStyle = "black";
  pen.fillStyle = "black";

  pen.lineWidth = 1;
  var evaluate = deriv ? evaluate_derivative:evaluate_expression;

  var y = evaluate(expr, dom[0]);

  functions_animating++;
  if (line_mode)
    animate_function_drawing(expr, dom, dom[0] + increment, y, false, no_save, evaluate);
  else {
    pen.fillRect(X(dom[0]), Y(y), 1, 1);
    animate_function_drawing(expr, dom, dom[0] + increment, y, false, no_save, evaluate);
  }

}

function draw_graph(derivative) {
  clear_graph(function() {
    draw_function($('#expression').val(), null, null, derivative);
  });

  if (draw_coordinate_axes)
	draw_axes();
}

function page_ready() {

  graph = document.getElementById("graph");
  pen = graph.getContext("2d");

  $("#header").css('top', $("#content-wrapper").position().top);
  $("#upper-footer").css('bottom', $("#footer").outerHeight());
  $("#upper-upper-footer").css('bottom', $("#footer").outerHeight() + $("#upper-footer").outerHeight());

  docwidth = $("#content-wrapper").outerWidth(true);
  docheight = $("#content-wrapper").outerHeight(true);

  graph.setAttribute('width', docwidth);
  graph.setAttribute('height', docheight);

  setTimeout(draw_graph, 100);

};

$(document).keydown(function(e) {
  switch (e.which) {
    case 13: // enter
      $('#btn-eval').click();
      break;
    case 78: // n
      if ($('#operation').find(":selected").attr('value') == 'trace')
        run_newtons();
      break;
  }
  if (e.ctrlKey) {
   switch (e.which) {
     case 187: // =
       e.preventDefault();
       zoom_in();
       break;
     case 189: // -
       e.preventDefault();
       zoom_out();
       break;
   }
 }
}).mousemove(function(e) {
  curr_x = rX(e.pageX);
  if ($('#operation').find(":selected").attr('value') == 'trace' && functions_animating <= 0)
    trace(curr_x);
});

$('#operation').change(function() {
  if (functions_animating <= 0)
    restore_graph();
});

$('#btn-eval').click(function() {
  switch ($('#operation').find(":selected").attr('value')) {
    case 'value':
      prompt("Evaluation:", evaluate_expression($('#expression').val(), parseInt(prompt("Enter a value to evaluate: ", '0'), 10)));
      break;
    case 'derivative':
      prompt("Evaluation:", evaluate_derivative($('#expression').val(), parseInt(prompt("Enter a value to evaluate: ", '0'), 10)));
      break;
    case 'graph':
      draw_function($('#expression').val());
      break;
    case 'regraph':
      draw_graph();
      break;
    case 'draw-deriv':
      draw_function($('#expression').val(), null, null, true);
      break;
    case 'clear':
      clear_graph();
      if (draw_coordinate_axes)
	    draw_axes();
      $('#operation').val('graph');
      break;
  }
});

$('#btn-settings').click(function() {
  var setting = prompt("Enter a setting: ", 'increment');
  switch(setting) {
    case 'increment':
      increment = parseFloat(prompt("Enter an Increment: ", '0.02'));
      break;
    case 'draw lines': case 'show lines':
      line_mode = true;
      break;
    case 'hide lines':
      line_mode = false;
      break;
    case 'domain':
      domain = eval(prompt("Enter a Domain: ", "[-15, 15]"));
      break;
    case 'range':
      range = eval(prompt("Enter a Range: ", "[-10, 10]"));
      break;
    case 'animate': case 'draw animation':
      animate = true;
      break;
    case 'no animation': case 'stop animation': case 'stop animating':
      animate = false;
      break;
    case 'toggle axes':
      draw_coordinate_axes = !draw_coordinate_axes;
      break;
  }
  update_dri();
});

function zoom_in() {
  var delta = domain[1] - domain[0];
  domain = [domain[0] + delta / 4, domain[1] - delta / 4];
  delta = range[1] - range[0];
  range = [range[0] + delta / 4, range[1] - delta / 4];
  increment /= 2;
  update_dri();
  draw_graph();
}

function zoom_out() {
  var delta = domain[1] - domain[0];
  domain = [domain[0] - delta / 2, domain[1]  + delta / 2];
  delta = range[1] - range[0];
  range = [range[0] - delta / 2, range[1] + delta / 2];
  increment *= 2;
  update_dri();
  draw_graph();
}

$(document).ready(function(){
    $(document).bind('mousewheel', function(e) {
      if(e.originalEvent.wheelDelta /120 > 0)
        zoom_in();
      else zoom_out();
    });
});