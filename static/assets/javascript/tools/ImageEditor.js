var background, context, image;
var docwidth, docheight;
var play_sound = true;
var pixels_save, pixels_original;
var mouse_x, mouse_y;
var original = true;
var color_inc;

var data, pixels, pixels_copy;

image = new Image();
image.crossorigin = 'anonymous';

docwidth = $("#content-wrapper").outerWidth(true);
docheight = $("#content-wrapper").outerHeight(true);

background = document.getElementById("background");
context = background.getContext("2d");

image.onload = function() {
  docwidth = $("#content-wrapper").outerWidth(true);
  docheight = $("#content-wrapper").outerHeight(true);
  var image_ratio = image.width / image.height;
  var screen_ratio = docwidth / docheight;
  var change_ratio;
  if (image_ratio > screen_ratio)
    change_ratio = docwidth / image.width;
  else change_ratio = docheight / image.height;
  background.width = image.width * change_ratio;
  background.height = image.height * change_ratio;
  context.drawImage(image,0,0,image.width,image.height, 0, 0, background.width, background.height);
  $('#background').width(background.width).height(background.height).css('left', (docwidth - background.width) / 2).css('top', (docheight - background.height) / 2);
  data = context.getImageData(0, 0, background.width, background.height);
  pixels = data.data;
  pixels_original = new Array(pixels.length);
  for (var i = 0; i < pixels.length; i++)
    pixels_original[i] = pixels[i];
  context.putImageData(data, 0, 0, 0, 0, data.width, data.height);
  original = null;
  alert_commands();
};

function alert_commands() {
  if (!getCookie("commands-shown")) {
    alert("Press 'c' to enter commands!");
    setCookie("commands-shown", "press 'c' to enter commands", 10);
  }
}

function change_image_src(src) {
  image.src = src;
}

change_image_src($('#image-src').val());

function show_rgb(x, y, alert) {
  var i = (y * 4) * data.width + x * 4;

  var R = pixels[i];
  var G = pixels[i + 1];
  var B = pixels[i + 2];
  if (alert)
    prompt("Copy to Clipboard, Ctrl + C", R + ', ' + G + ", " + B);
  $('#color-preview').css('background-color', 'rgb(' + R + ', ' + G + ', ' + B + ')');
  $('#color-text').text('(' + R + ', ' + G + ', ' + B + ')');
}

function swap_image_with_original() {
  var i;
  if (original === true) {
    for (i = 0; i < pixels.length; i++)
      pixels[i] = pixels_save[i];
    context.putImageData(data, 0, 0, 0, 0, data.width, data.height);
    original = false;
  }
  else if (original === false) {
    pixels_save = new Array(pixels.length);
    for (i = 0; i < pixels.length; i++) {
      pixels_save[i] = pixels[i];
      pixels[i] = pixels_original[i];
    }
    context.putImageData(data, 0, 0, 0, 0, data.width, data.height);
    original = true;
  }
  show_rgb(mouse_x, mouse_y, false);
}

function playSound( url ){
  if (play_sound)
    $('#sound').html("<embed src='"+url+"' hidden=true autostart=true loop=false>");
}

function OpenInNewTab(url) {
  var win = window.open(url, '_blank');
  win.focus();
}

function ding() {
  playSound("/static/sounds/ImageEditor/default_ding.mp3");
}

function fullscreen() {
  docwidth = $("#content-wrapper").outerWidth(true);
  docheight = $("#content-wrapper").outerHeight(true);
  background.width = docwidth;
  background.height = docheight;
  context.drawImage(image,0,0,image.width,image.height, 0, 0, docwidth, docheight);
  $('#background').width(background.width).height(background.height).css('left', 0).css('top', 0);
  ding();
}

function get_average_color(data, pixels, x, y, radius, color_inc) {
  var count = 0;
  var avRGB = [0, 0, 0];
  var tx, ty, i;

  if (color_inc < 0) {
    for (tx = x - radius; tx <= x + radius; tx++)
      for (ty = y - radius; ty <= y + radius; ty++) {
        if (tx < 0 || ty < 0 || tx >= data.width || ty >= data.height)
          continue;
        i = (ty * 4) * data.width + tx * 4;
        avRGB[0] += pixels[i];
        avRGB[1] += pixels[i + 1];
        avRGB[2] += pixels[i + 2];
        count++;
      }
    avRGB[0] /= count; avRGB[1] /= count; avRGB[2] /= count;
  }
  else {
    for (tx = x - radius; tx <= x + radius; tx++)
      for (ty = y - radius; ty <= y + radius; ty++) {
        if (tx < 0 || ty < 0 || tx >= data.width || ty >= data.height)
          continue;
        i = (ty * 4) * data.width + tx * 4;
        avRGB[color_inc] += pixels[i + color_inc];
        count++;
      }
    avRGB[color_inc] /= count;
  }
  return avRGB;
}

function get_color_inc(color) {
  var color_inc = -1;
  switch (color) {
    case "opacity": case 'o':
      color_inc++;
    case "blue": case 'b':
      color_inc++;
    case "green": case 'g':
      color_inc++;
    case "red": case 'r':
      color_inc++;
      break;
    case "all": case 'a':
      color_inc = -1;
  }
  return color_inc;
}

function blur(params) {
  for (var x = 0; x < data.width; x++)
    for (var y = 0; y < data.height; y++) {
      i = (y * 4) * data.width + x * 4;
      var avRGB = get_average_color(data, pixels_copy, x, y, params.radius, color_inc);
      if (color_inc < 0) {
        pixels[i] = avRGB[0];
        pixels[i + 1] = avRGB[1];
        pixels[i + 2] = avRGB[2];
      }
      else pixels[i + color_inc] = avRGB[color_inc];
    }
}

function tint(params) {
  var magnitude = params.magnitude;

  for (var x = 0; x < data.width; x++)
    for (var y = 0; y < data.height; y++) {
      var i = (y * 4) * data.width + x * 4;
      if (color_inc < 0)
        if (magnitude.charAt(0) == '+') {
          pixels[i] += parseInt(magnitude.substring(1), 10);
          pixels[i + 1] += parseInt(magnitude.substring(1), 10);
          pixels[i + 2] += parseInt(magnitude.substring(1), 10);
        }
        else if (magnitude.charAt(0) == '-') {
          pixels[i] -= parseInt(magnitude.substring(1), 10);
          pixels[i + 1] -= parseInt(magnitude.substring(1), 10);
          pixels[i + 2] -= parseInt(magnitude.substring(1), 10);
        }
        else {
          pixels[i] = parseInt(magnitude, 10);
          pixels[i + 1] = parseInt(magnitude, 10);
          pixels[i + 2] = parseInt(magnitude, 10);
        }
      else
        if (magnitude.charAt(0) == '+')
          pixels[i + color_inc] += parseInt(magnitude.substring(1), 10);
        else if (magnitude.charAt(0) == '-')
          pixels[i + color_inc] -= parseInt(magnitude.substring(1), 10);
        else pixels[i + color_inc] = parseInt(magnitude, 10);
    }
}

function edge_detection(params) {

  var delta;

  for (var x = 0; x < data.width; x++)
    for (var y = 0; y < data.height; y++) {
      i = (y * 4) * data.width + x * 4;
      var avRGB = get_average_color(data, pixels_copy, x, y, params.radius, -1);
      if (color_inc < 0)
        delta = (Math.pow(avRGB[0] - pixels[i], 2) + Math.pow(avRGB[1] - pixels[i + 1], 2) + Math.pow(avRGB[2] - pixels[i + 2], 2)) / 3;
      else delta = Math.pow(avRGB[color_inc] - pixels[i + color_inc], 2);
      if (delta > params.sensitivity)
        switch (params.effect) {
          case "black": case "black white":
            pixels[i] = 0;
            pixels[i + 1] = 0;
            pixels[i + 2] = 0;
            break;
          case "sharpen":
            pixels[i] = pixels[i] * 2 - avRGB[0];
            pixels[i + 1] = pixels[i + 1] * 2 - avRGB[1];
            pixels[i + 2] = pixels[i + 2] * 2 - avRGB[2];
            break;
          case "blur":
            pixels[i] = avRGB[0];
            pixels[i + 1] = avRGB[1];
            pixels[i + 2] = avRGB[2];
            break;
          case "invert":
            pixels[i] = 255 - pixels[i];
            pixels[i + 1] = 255 - pixels[i + 1];
            pixels[i + 2] = 255 - pixels[i + 2];
            break;
        }
      else switch (params.effect) {
        case "focus":
          pixels[i] = avRGB[0];
          pixels[i + 1] = avRGB[1];
          pixels[i + 2] = avRGB[2];
          break;
        case "black white":
          pixels[i] = 255;
          pixels[i + 1] = 255;
          pixels[i + 2] = 255;
      }
    }
}

function pixelate(params) {
  for (var x = 0; x < data.width; x+=params.radius)
    for (var y = 0; y < data.height; y+=params.radius) {
      var avRGB = get_average_color(data, pixels_copy, x + params.radius/2, y + params.radius/2, params.radius/2, color_inc);
      for (var xt = x; xt < x + params.radius && xt < data.width; xt++)
        for (var yt = y; yt < y + params.radius && yt < data.height; yt++) {
          i = (yt * 4) * data.width + xt * 4;
          if (color_inc >= 0) {
            pixels[i + color_inc] = avRGB[color_inc];
          }
          else {
            pixels[i] = avRGB[0];
            pixels[i + 1] = avRGB[1];
            pixels[i + 2] = avRGB[2];
          }
        }
    }
}

function clear(params) {
  for (var x = 0; x < data.width; x++)
    for (var y = 0; y < data.height; y++) {
      i = (y * 4) * data.width + x * 4;
      var avRGB = get_average_color(data, pixels_copy, x, y, params.radius, color_inc);
      if (color_inc < 0) {
        pixels[i] = pixels[i] * 2 - avRGB[0];
        pixels[i + 1] = pixels[i + 1] * 2 - avRGB[1];
        pixels[i + 2] = pixels[i + 2] * 2 - avRGB[2];
      }
      else pixels[i + color_inc] = pixels[i + color_inc] * 2 - avRGB[color_inc];
    }
}

function mixed(params) {
  for (var x = 0; x < data.width; x++)
    for (var y = 0; y < data.height; y++) {
      var avRGB = get_average_color(data, pixels_copy, x, y, params.radius, color_inc);
      i = (y * 4) * data.width + x * 4;
      if (color_inc < 0)
        if ((x % 2 === 0 && y % 2 == 1) || (x % 2 == 1 && y % 2 === 0)) {
          pixels[i] = pixels[i] * 2 - avRGB[0];
          pixels[i + 1] = pixels[i + 1] * 2 - avRGB[1];
          pixels[i + 2] = pixels[i + 2] * 2 - avRGB[2];
        }
        else {
          pixels[i] = avRGB[0];
          pixels[i + 1] = avRGB[1];
          pixels[i + 2] = avRGB[2];
        }
      else if ((x % 2 === 0 && y % 2 == 1) || (x % 2 == 1 && y % 2 === 0))
        pixels[i + color_inc] = pixels[i + color_inc] * 2 - avRGB[color_inc];
      else pixels[i + color_inc] = avRGB[color_inc];
    }
}

function grayscale(params) {
  for (var x = 0; x < data.width; x++)
    for (var y = 0; y < data.height; y++) {
      var i = (y * 4) * data.width + x * 4;
      var avg = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
      if (color_inc < 0) {
        pixels[i] = avg;
        pixels[i + 1] = avg;
        pixels[i + 2] = avg;
      }
      else pixels[i + color_inc] = avg;
    }
}

function invert(params) {
  for (var x = 0; x < data.width; x++)
    for (var y = 0; y < data.height; y++) {
      var i = (y * 4) * data.width + x * 4;
      if (color_inc < 0) {
        pixels[i] = 255 - pixels[i];
        pixels[i + 1] = 255 - pixels[i + 1];
        pixels[i + 2] = 255 - pixels[i + 2];
      }
      else pixels[i + color_inc] = 255 - pixels[i + color_inc];
    }
}

function sandwich(params) {
  var dt, dlength, notdlength, horiz = true;
  var ndt, avRGB, count;

  switch(params.orientation) {
    case "vertical": case "vert": case 'v':
      dlength = data.height;
      notdlength = data.width;
      horiz = false;
      break;
    default:
      dlength = data.width;
      notdlength = data.height;
      break;
  }
  if (color_inc < 0)
    for (ndt = 0; ndt < notdlength; ndt++) {
      avRGB = [0, 0, 0];
      count = 0;
      for (dt = 0; dt < dlength; dt++) {
        i = ((horiz ? ndt:dt) * 4) * data.width + (horiz ? dt:ndt) * 4;
        avRGB[0] += pixels_copy[i];
        avRGB[1] += pixels_copy[i + 1];
        avRGB[2] += pixels_copy[i + 2];
        count++;
      }
      avRGB[0] /= count; avRGB[1] /= count; avRGB[2] /= count;
      for (dt = 0; dt < dlength; dt++) {
        i = ((horiz ? ndt:dt) * 4) * data.width + (horiz ? dt:ndt) * 4;
        pixels[i] = avRGB[0];
        pixels[i + 1] = avRGB[1];
        pixels[i + 2] = avRGB[2];
      }
    }
  else
    for (ndt = 0; ndt < notdlength; ndt++) {
      avRGB = [0, 0, 0];
      count = 0;
      for (dt = 0; dt < dlength; dt++) {
        i = ((horiz ? ndt:dt) * 4) * data.width + (horiz ? dt:ndt) * 4;
        avRGB[color_inc] += pixels_copy[i + color_inc];
        count++;
      }
      avRGB[color_inc] /= count;
      for (dt = 0; dt < dlength; dt++) {
        i = ((horiz ? ndt:dt) * 4) * data.width + (horiz ? dt:ndt) * 4;
        pixels[i + color_inc] = avRGB[color_inc];
      }
    }
}

function stripper(params) {
  var dt, dlength, horiz = true;
  var x, y, avRGB, count;

  switch(params.orientation) {
    case "vertical": case "vert": case 'v':
      dlength = data.height;
      horiz = false;
      break;
    default:
      dlength = data.width;
      break;
  }
  if (color_inc < 0)
    for (x = 0; x < data.width; x++)
      for (y = 0; y < data.height; y++) {
        avRGB = [0, 0, 0];
        count = 0;
        for (dt = (horiz ? x:y) - params.radius / 2; dt < dlength && dt < (horiz ? x:y) + params.radius / 2; dt++) {
          if (dt < 0) continue;
          i = ((horiz ? y:dt) * 4) * data.width + (horiz ? dt:x) * 4;
          avRGB[0] += pixels_copy[i];
          avRGB[1] += pixels_copy[i + 1];
          avRGB[2] += pixels_copy[i + 2];
          count++;
        }
        avRGB[0] /= count; avRGB[1] /= count; avRGB[2] /= count;
        for (dt = (horiz ? x:y) - params.radius / 2; dt < dlength && dt < (horiz ? x:y) + params.radius / 2; dt++) {
          if (dt < 0) continue;
          i = ((horiz ? y:dt) * 4) * data.width + (horiz ? dt:x) * 4;
          pixels[i] = avRGB[0];
          pixels[i + 1] = avRGB[1];
          pixels[i + 2] = avRGB[2];
        }
      }
  else
    for (x = 0; x < data.width; x++)
      for (y = 0; y < data.height; y++) {
        avRGB = [0, 0, 0];
        count = 0;
        for (dt = (horiz ? x:y) - params.radius / 2; dt < dlength && dt < (horiz ? x:y) + params.radius / 2; dt++) {
          if (dt < 0) continue;
          i = ((horiz ? y:dt) * 4) * data.width + (horiz ? dt:x) * 4;
          avRGB[color_inc] += pixels_copy[i + color_inc];
          count++;
        }
        avRGB[color_inc] /= count;
        for (dt = (horiz ? x:y) - params.radius / 2; dt < dlength && dt < (horiz ? x:y) + params.radius / 2; dt++) {
          if (dt < 0) continue;
          i = ((horiz ? y:dt) * 4) * data.width + (horiz ? dt:x) * 4;
          pixels[i + color_inc] = avRGB[color_inc];
        }
      }
}

function rotate_colors(params) {
  for (var x = 0; x < data.width; x++)
    for (var y = 0; y < data.height; y++) {
      var i = (y * 4) * data.width + x * 4;
      var temp = pixels[i];
      pixels[i] = pixels[i + 1];
      pixels[i + 1] = pixels[i + 2];
      pixels[i + 2] = temp;
    }
}

function sepia(params) {
  for (var x = 0; x < data.width; x++)
    for (var y = 0; y < data.height; y++) {
      var i = (y * 4) * data.width + x * 4;
      var outputColors = [(pixels[i] * 0.393) + (pixels[i + 1] * 0.769) + (pixels[i + 2] * 0.189),  (pixels[i] * 0.349) + (pixels[i + 1] * 0.686) + (pixels[i + 2] * 0.168), (pixels[i] * 0.272) + (pixels[i + 1] * 0.534) + (pixels[i + 2] * 0.131)];
      if (color_inc < 0) {
        pixels[i] = outputColors[0];
        pixels[i + 1] = outputColors[1];
        pixels[i + 2] = outputColors[2];
      }
      else pixels[i + color_inc] = outputColors[color_inc];
    }
}

function darker(params) {
  for (var x = 0; x < data.width; x++)
    for (var y = 0; y < data.height; y++) {
      var i = (y * 4) * data.width + x * 4;
      if (color_inc < 0) {
        pixels[i] *= 0.95;
        pixels[i + 1] *= 0.95;
        pixels[i + 2] *= 0.95;
      }
      else pixels[i + color_inc] *= 0.95;
    }
}

function lighter(params) {
  for (var x = 0; x < data.width; x++)
    for (var y = 0; y < data.height; y++) {
      var i = (y * 4) * data.width + x * 4;
      if (color_inc < 0) {
        pixels[i] *= 1.05;
        pixels[i + 1] *= 1.05;
        pixels[i + 2] *= 1.05;
      }
      else pixels[i + color_inc] *= 1.05;
    }
}

function rainbow(params) {
  for (var x = 0; x < data.width; x++)
    for (var y = 0; y < data.height; y++) {
      var i = (y * 4) * data.width + x * 4;
      pixels[i] *= (1 + x / data.width) / 2;
      pixels[i + 1] *= (1 + y / data.height) / 2;
      pixels[i + 2] *= (1 + (data.width + data.height - x - y) / (data.width + data.height)) / 2;
    }
}

function run_effect(parameters, effect_function) {
  for (var param in parameters)
    if (!parameters[param]) // cancel pressed
      return;

  data = context.getImageData(0, 0, background.width, background.height);
  pixels = data.data;
  pixels_copy = new Array(pixels.length);

  for (var i = 0; i < pixels.length; i++)
    pixels_copy[i] = pixels[i];

  color_inc = get_color_inc(color);

  effect_function(parameters);

  context.putImageData(data, 0, 0, 0, 0, data.width, data.height);
  ding();
  original = false;
}

function prompt_commands() {
  var command = prompt("Please enter a command", "list commands");
  if (command) // prevent cancel
  switch (command.toLowerCase()) {
    case "blur": case 'b':
      run_effect({"radius": parseInt(prompt("Radius", "2"), 10)}, blur);
      break;
    case "brighter": case "lighter": case 'l': case "lighten": case "brighten":
      run_effect({}, lighter);
      break;
    case "clear": case 'c':
      run_effect({"radius": parseInt(prompt("Radius", "2"), 10)}, clear);
      break;
    case "color commands": case 'cc':
      color = prompt("Color", "red");
      prompt_commands();
      break;
    case "darker": case 'd': case "darken":
      run_effect({}, darker);
      break;
    case "edge": case "edge detection": case 'e':
      run_effect({"radius": parseInt(prompt("Radius", "2"), 10), "effect": "black", "sensitivity": parseInt(prompt("Enter a sensitivity:", "40"), 10)}, edge_detection);
      break;
    case "edge blur": case 'eb':
      run_effect({"radius": parseInt(prompt("Radius", "2"), 10), "effect": "blur", "sensitivity": parseInt(prompt("Enter a sensitivity:", "40"), 10)}, edge_detection);
      break;
    case "edge sharpen": case "edge enhance": case 'eh': case 'es':
      run_effect({"radius": parseInt(prompt("Radius", "2"), 10), "effect": "sharpen", "sensitivity": parseInt(prompt("Enter a sensitivity:", "40"), 10)}, edge_detection);
      break;
    case "edge focus": case 'ef':
      run_effect({"radius": parseInt(prompt("Radius", "2"), 10), "effect": "focus", "sensitivity": parseInt(prompt("Enter a sensitivity:", "40"), 10)}, edge_detection);
      break;
    case "edge black white": case 'ebw':
      run_effect({"radius": parseInt(prompt("Radius", "2"), 10), "effect": "black white", "sensitivity": parseInt(prompt("Enter a sensitivity:", "40"), 10)}, edge_detection);
      break;
    case "fullscreen": case 'f': case 'full':
      fullscreen();
      break;
    case "grayscale": case "greyscale": case 'g': case "gray": case "grey":
      run_effect({}, grayscale);
      break;
    case "invert": case 'i':
      run_effect({}, invert);
      break;
    case "invert edge": case 'ie':
      run_effect({"radius": parseInt(prompt("Radius", "2"), 10), "effect": "invert", "sensitivity": parseInt(prompt("Enter a sensitivity:", "40"), 10)}, edge_detection);
      break;
    case "list commands":
      OpenInNewTab("https://goo.gl/Jnhgnc");
      break;
    case "mixed": case 'm':
      run_effect({"radius": parseInt(prompt("Radius", "2"), 10)}, mixed);
      break;
    case "pixelate": case 'p':
      run_effect({"radius": parseInt(prompt("Radius", "5"), 10)}, pixelate);
      break;
    case "rainbow": case 'r':
      run_effect({}, rainbow);
      break;
    case "rotate colors": case 'rc':
      run_effect({}, rotate_colors);
      break;
    case "sepia": case 's':
      run_effect({}, sepia);
      break;
    case "sandwich":
      run_effect({"orientation": prompt("What orientation?", "horizontal")}, sandwich);
      break;
    case "stripper":
      run_effect({"orientation": prompt("What orientation?", "horizontal"), "radius": parseInt(prompt("Width", "5"), 10)}, stripper);
      break;
    case "tint": case 't':
      run_effect({"magnitude": prompt("How much?", "-50")}, tint);
      break;
    case "toggle preview": case "preview":
      $('#color-preview').toggle();
      $('#color-text').toggle();
      break;
    case "toggle sound": case "sound":
      play_sound = !play_sound;
      break;
    case "toggle url": case "url":
      $('#image-src').toggle();
      break;
    default:
      if(confirm(command + " not found. For a full list of commands, press OK"))
        OpenInNewTab("https://goo.gl/Jnhgnc");
      break;
  }
}

$(document).keydown(function(e) {
  switch (e.which) {
    case 9: // tab
      e.preventDefault();
      swap_image_with_original();
      break;
    case 13: // enter
      change_image_src($('#image-src').val());
      $('#image-src').blur();
      break;
    case 67: // c
      setCookie("commands-shown", "press 'c' to enter commands", 10);
      color = "all";
      prompt_commands();
      break;
  }
});

$('#background').click(function(e) {
  if (e.ctrlKey) {
    var parentOffset = $(this).parent().offset();
    mouse_x = e.pageX - parentOffset.left;
    mouse_y = e.pageY - parentOffset.top;

    show_rgb(mouse_x, mouse_y, true);
  }
});

$('#background').mousemove(function(e) {
  var parentOffset = $(this).parent().offset();
  mouse_x = e.pageX - parentOffset.left;
  mouse_y = e.pageY - parentOffset.top;

  if ($('#color-preview').is(":visible"))
    show_rgb(mouse_x, mouse_y, false);
});

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
    }
    return "";
}