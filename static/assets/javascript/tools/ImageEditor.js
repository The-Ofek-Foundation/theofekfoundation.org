const background = getElemId("background");
const imageSrcElem = getElemId("image-src");

var context, image;
var docwidth, docheight;
var toPlaySound = true;
var pixelsSave, pixelsOriginal;
var mouseX, mouseY;
var original = true;
var colorInc, color = "all";

var data, pixels, pixelsCopy;

context = background.getContext("2d");

function pageReady() {
	image = new Image();
	image.crossOrigin = 'Anonymous';

	docwidth = getElemWidth(contentWrapper);
	docheight = getElemHeight(contentWrapper);


	image.onload = function() {
		docwidth = getElemWidth(contentWrapper);
		docheight = getElemHeight(contentWrapper);
		var imageRatio = image.width / image.height;
		var screenRatio = docwidth / docheight;
		var changeRatio;
		if (imageRatio > screenRatio)
			changeRatio = docwidth / image.width;
		else changeRatio = docheight / image.height;
		background.width = image.width * changeRatio;
		background.height = image.height * changeRatio;
		context.drawImage(image,0,0,image.width,image.height, 0, 0, background.width, background.height);

		setElemWidth(background, background.width);
		setElemHeight(background, background.height);
		setElemStyle(background, "left", (docwidth - background.width) / 2);
		setElemStyle(background, "top", (docheight - background.height) / 2);

		data = context.getImageData(0, 0, background.width, background.height);
		pixels = data.data;
		pixelsOriginal = new Array(pixels.length);
		for (var i = 0; i < pixels.length; i++)
			pixelsOriginal[i] = pixels[i];
		context.putImageData(data, 0, 0, 0, 0, data.width, data.height);
		original = null;
		alertCommands();
	};

	changeImageSrc(imageSrcElem.value);
}

function alertCommands() {
	if (!getCookie("commands-shown")) {
		alert("Press 'c' to enter commands!");
		setCookie("commands-shown", "press 'c' to enter commands", 10);
	}
}

function changeImageSrc(src) {
	image.src = src;
}

function showRgb(x, y, alert) {
	var i = (y * 4) * data.width + x * 4;

	var R = pixels[i];
	var G = pixels[i + 1];
	var B = pixels[i + 2];
	if (alert)
		prompt("Copy to Clipboard, Ctrl + C", R + ', ' + G + ", " + B);
	setElemStyle(getElemId("color-preview"), 'background-color', 'rgb(' + R + ', ' + G + ', ' + B + ')');
	setElemText(getElemId("color-text"), '(' + R + ', ' + G + ', ' + B + ')');
}

function swapImageWithOriginal() {
	var i;
	if (original === true) {
		for (i = 0; i < pixels.length; i++)
			pixels[i] = pixelsSave[i];
		context.putImageData(data, 0, 0, 0, 0, data.width, data.height);
		original = false;
	} else if (original === false) {
		pixelsSave = new Array(pixels.length);
		for (i = 0; i < pixels.length; i++) {
			pixelsSave[i] = pixels[i];
			pixels[i] = pixelsOriginal[i];
		}
		context.putImageData(data, 0, 0, 0, 0, data.width, data.height);
		original = true;
	}
	showRgb(mouseX, mouseY, false);
}

function playSound(url) {
	if (toPlaySound)
		getElemId("sound").innerHTML = "<embed src='"+url+"' hidden=true autostart=true loop=false>";
}

function OpenInNewTab(url) {
	var win = window.open(url, '_blank');
	win.focus();
}

function ding() {
	playSound("/static/sounds/ImageEditor/default_ding.mp3");
}

function fullscreen() {
	docwidth = getElemWidth(contentWrapper);
	docheight = getElemHeight(contentWrapper);
	background.width = docwidth;
	background.height = docheight;
	context.drawImage(image,0,0,image.width,image.height, 0, 0, docwidth, docheight);

	setElemWidth(background, background.width);
	setElemHeight(background, background.height);
	setElemStyle(background, "left", 0);
	setElemStyle(background, "top", 0);

	ding();
}

function getAverageColor(data, pixels, x, y, radius, colorInc) {
	var count = 0;
	var avRGB = [0, 0, 0];
	var tx, ty, i;

	if (colorInc < 0) {
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
	} else {
		for (tx = x - radius; tx <= x + radius; tx++)
			for (ty = y - radius; ty <= y + radius; ty++) {
				if (tx < 0 || ty < 0 || tx >= data.width || ty >= data.height)
					continue;
				i = (ty * 4) * data.width + tx * 4;
				avRGB[colorInc] += pixels[i + colorInc];
				count++;
			}
		avRGB[colorInc] /= count;
	}
	return avRGB;
}

function getColorInc(color) {
	var colorInc = -1;
	switch (color) {
		case "opacity": case 'o':
			colorInc++;
		case "blue": case 'b':
			colorInc++;
		case "green": case 'g':
			colorInc++;
		case "red": case 'r':
			colorInc++;
			break;
		case "all": case 'a':
			colorInc = -1;
	}
	return colorInc;
}

function blur(params) {
	for (var x = 0; x < data.width; x++)
		for (var y = 0; y < data.height; y++) {
			i = (y * 4) * data.width + x * 4;
			var avRGB = getAverageColor(data, pixelsCopy, x, y, params.radius, colorInc);
			if (colorInc < 0) {
				pixels[i] = avRGB[0];
				pixels[i + 1] = avRGB[1];
				pixels[i + 2] = avRGB[2];
			} else pixels[i + colorInc] = avRGB[colorInc];
		}
}

function tint(params) {
	var magnitude = params.magnitude;

	for (var x = 0; x < data.width; x++)
		for (var y = 0; y < data.height; y++) {
			var i = (y * 4) * data.width + x * 4;
			if (colorInc < 0)
				if (magnitude.charAt(0) == '+') {
					pixels[i] += parseInt(magnitude.substring(1), 10);
					pixels[i + 1] += parseInt(magnitude.substring(1), 10);
					pixels[i + 2] += parseInt(magnitude.substring(1), 10);
				} else if (magnitude.charAt(0) == '-') {
					pixels[i] -= parseInt(magnitude.substring(1), 10);
					pixels[i + 1] -= parseInt(magnitude.substring(1), 10);
					pixels[i + 2] -= parseInt(magnitude.substring(1), 10);
				} else {
					pixels[i] = parseInt(magnitude, 10);
					pixels[i + 1] = parseInt(magnitude, 10);
					pixels[i + 2] = parseInt(magnitude, 10);
				}
			else if (magnitude.charAt(0) == '+')
					pixels[i + colorInc] += parseInt(magnitude.substring(1), 10);
				else if (magnitude.charAt(0) == '-')
					pixels[i + colorInc] -= parseInt(magnitude.substring(1), 10);
				else pixels[i + colorInc] = parseInt(magnitude, 10);
		}
}

function edgeDetection(params) {

	var delta;

	for (var x = 0; x < data.width; x++)
		for (var y = 0; y < data.height; y++) {
			i = (y * 4) * data.width + x * 4;
			var avRGB = getAverageColor(data, pixelsCopy, x, y, params.radius, -1);
			if (colorInc < 0)
				delta = (Math.pow(avRGB[0] - pixels[i], 2) + Math.pow(avRGB[1] - pixels[i + 1], 2) + Math.pow(avRGB[2] - pixels[i + 2], 2)) / 3;
			else delta = Math.pow(avRGB[colorInc] - pixels[i + colorInc], 2);
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
			var avRGB = getAverageColor(data, pixelsCopy, x + params.radius/2, y + params.radius/2, params.radius/2, colorInc);
			for (var xt = x; xt < x + params.radius && xt < data.width; xt++)
				for (var yt = y; yt < y + params.radius && yt < data.height; yt++) {
					i = (yt * 4) * data.width + xt * 4;
					if (colorInc >= 0) {
						pixels[i + colorInc] = avRGB[colorInc];
					} else {
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
			var avRGB = getAverageColor(data, pixelsCopy, x, y, params.radius, colorInc);
			if (colorInc < 0) {
				pixels[i] = pixels[i] * 2 - avRGB[0];
				pixels[i + 1] = pixels[i + 1] * 2 - avRGB[1];
				pixels[i + 2] = pixels[i + 2] * 2 - avRGB[2];
			} else pixels[i + colorInc] = pixels[i + colorInc] * 2 - avRGB[colorInc];
		}
}

function mixed(params) {
	for (var x = 0; x < data.width; x++)
		for (var y = 0; y < data.height; y++) {
			var avRGB = getAverageColor(data, pixelsCopy, x, y, params.radius, colorInc);
			i = (y * 4) * data.width + x * 4;
			if (colorInc < 0)
				if ((x % 2 === 0 && y % 2 == 1) || (x % 2 == 1 && y % 2 === 0)) {
					pixels[i] = pixels[i] * 2 - avRGB[0];
					pixels[i + 1] = pixels[i + 1] * 2 - avRGB[1];
					pixels[i + 2] = pixels[i + 2] * 2 - avRGB[2];
				} else {
					pixels[i] = avRGB[0];
					pixels[i + 1] = avRGB[1];
					pixels[i + 2] = avRGB[2];
				}
			else if ((x % 2 === 0 && y % 2 == 1) || (x % 2 == 1 && y % 2 === 0))
				pixels[i + colorInc] = pixels[i + colorInc] * 2 - avRGB[colorInc];
			else pixels[i + colorInc] = avRGB[colorInc];
		}
}

function grayscale(params) {
	for (var x = 0; x < data.width; x++)
		for (var y = 0; y < data.height; y++) {
			var i = (y * 4) * data.width + x * 4;
			var avg = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
			if (colorInc < 0) {
				pixels[i] = avg;
				pixels[i + 1] = avg;
				pixels[i + 2] = avg;
			} else pixels[i + colorInc] = avg;
		}
}

function invert(params) {
	for (var x = 0; x < data.width; x++)
		for (var y = 0; y < data.height; y++) {
			var i = (y * 4) * data.width + x * 4;
			if (colorInc < 0) {
				pixels[i] = 255 - pixels[i];
				pixels[i + 1] = 255 - pixels[i + 1];
				pixels[i + 2] = 255 - pixels[i + 2];
			} else pixels[i + colorInc] = 255 - pixels[i + colorInc];
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
	if (colorInc < 0)
		for (ndt = 0; ndt < notdlength; ndt++) {
			avRGB = [0, 0, 0];
			count = 0;
			for (dt = 0; dt < dlength; dt++) {
				i = ((horiz ? ndt:dt) * 4) * data.width + (horiz ? dt:ndt) * 4;
				avRGB[0] += pixelsCopy[i];
				avRGB[1] += pixelsCopy[i + 1];
				avRGB[2] += pixelsCopy[i + 2];
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
	else for (ndt = 0; ndt < notdlength; ndt++) {
			avRGB = [0, 0, 0];
			count = 0;
			for (dt = 0; dt < dlength; dt++) {
				i = ((horiz ? ndt:dt) * 4) * data.width + (horiz ? dt:ndt) * 4;
				avRGB[colorInc] += pixelsCopy[i + colorInc];
				count++;
			}
			avRGB[colorInc] /= count;
			for (dt = 0; dt < dlength; dt++) {
				i = ((horiz ? ndt:dt) * 4) * data.width + (horiz ? dt:ndt) * 4;
				pixels[i + colorInc] = avRGB[colorInc];
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
	if (colorInc < 0)
		for (x = 0; x < data.width; x++)
			for (y = 0; y < data.height; y++) {
				avRGB = [0, 0, 0];
				count = 0;
				for (dt = (horiz ? x:y) - params.radius / 2; dt < dlength && dt < (horiz ? x:y) + params.radius / 2; dt++) {
					if (dt < 0) continue;
					i = ((horiz ? y:dt) * 4) * data.width + (horiz ? dt:x) * 4;
					avRGB[0] += pixelsCopy[i];
					avRGB[1] += pixelsCopy[i + 1];
					avRGB[2] += pixelsCopy[i + 2];
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
	else for (x = 0; x < data.width; x++)
			for (y = 0; y < data.height; y++) {
				avRGB = [0, 0, 0];
				count = 0;
				for (dt = (horiz ? x:y) - params.radius / 2; dt < dlength && dt < (horiz ? x:y) + params.radius / 2; dt++) {
					if (dt < 0) continue;
					i = ((horiz ? y:dt) * 4) * data.width + (horiz ? dt:x) * 4;
					avRGB[colorInc] += pixelsCopy[i + colorInc];
					count++;
				}
				avRGB[colorInc] /= count;
				for (dt = (horiz ? x:y) - params.radius / 2; dt < dlength && dt < (horiz ? x:y) + params.radius / 2; dt++) {
					if (dt < 0) continue;
					i = ((horiz ? y:dt) * 4) * data.width + (horiz ? dt:x) * 4;
					pixels[i + colorInc] = avRGB[colorInc];
				}
			}
}

function rotateColors(params) {
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
			var outputColors = [(pixels[i] * 0.393) + (pixels[i + 1] * 0.769) + (pixels[i + 2] * 0.189),	(pixels[i] * 0.349) + (pixels[i + 1] * 0.686) + (pixels[i + 2] * 0.168), (pixels[i] * 0.272) + (pixels[i + 1] * 0.534) + (pixels[i + 2] * 0.131)];
			if (colorInc < 0) {
				pixels[i] = outputColors[0];
				pixels[i + 1] = outputColors[1];
				pixels[i + 2] = outputColors[2];
			} else pixels[i + colorInc] = outputColors[colorInc];
		}
}

function darker(params) {
	for (var x = 0; x < data.width; x++)
		for (var y = 0; y < data.height; y++) {
			var i = (y * 4) * data.width + x * 4;
			if (colorInc < 0) {
				pixels[i] *= 0.95;
				pixels[i + 1] *= 0.95;
				pixels[i + 2] *= 0.95;
			} else pixels[i + colorInc] *= 0.95;
		}
}

function lighter(params) {
	for (var x = 0; x < data.width; x++)
		for (var y = 0; y < data.height; y++) {
			var i = (y * 4) * data.width + x * 4;
			if (colorInc < 0) {
				pixels[i] *= 1.05;
				pixels[i + 1] *= 1.05;
				pixels[i + 2] *= 1.05;
			} else pixels[i + colorInc] *= 1.05;
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

function runEffect(parameters, effectFunction) {
	for (var param in parameters)
		if (!parameters[param]) // cancel pressed
			return;

	data = context.getImageData(0, 0, background.width, background.height);
	pixels = data.data;
	pixelsCopy = new Array(pixels.length);

	for (var i = 0; i < pixels.length; i++)
		pixelsCopy[i] = pixels[i];

	colorInc = getColorInc(color);

	effectFunction(parameters);

	context.putImageData(data, 0, 0, 0, 0, data.width, data.height);
	ding();
	original = false;
}

function runCommand(command, promptIfNotFound) {
	switch (command.toLowerCase()) {
		case "blur": case 'b':
			runEffect({"radius": parseInt(prompt("Radius", "2"), 10)}, blur);
			break;
		case "brighter": case "lighter": case 'l': case "lighten": case "brighten":
			runEffect({}, lighter);
			break;
		case "clear": case 'c':
			runEffect({"radius": parseInt(prompt("Radius", "2"), 10)}, clear);
			break;
		case "color commands": case 'cc':
			color = prompt("Color", "red");
			promptCommands();
			break;
		case "darker": case 'd': case "darken":
			runEffect({}, darker);
			break;
		case "edge": case "edge detection": case 'e':
			runEffect({"radius": parseInt(prompt("Radius", "2"), 10), "effect": "black", "sensitivity": parseInt(prompt("Enter a sensitivity:", "40"), 10)}, edgeDetection);
			break;
		case "edge blur": case 'eb':
			runEffect({"radius": parseInt(prompt("Radius", "2"), 10), "effect": "blur", "sensitivity": parseInt(prompt("Enter a sensitivity:", "40"), 10)}, edgeDetection);
			break;
		case "edge sharpen": case "edge enhance": case 'eh': case 'es':
			runEffect({"radius": parseInt(prompt("Radius", "2"), 10), "effect": "sharpen", "sensitivity": parseInt(prompt("Enter a sensitivity:", "40"), 10)}, edgeDetection);
			break;
		case "edge focus": case 'ef':
			runEffect({"radius": parseInt(prompt("Radius", "2"), 10), "effect": "focus", "sensitivity": parseInt(prompt("Enter a sensitivity:", "40"), 10)}, edgeDetection);
			break;
		case "edge black white": case 'ebw':
			runEffect({"radius": parseInt(prompt("Radius", "2"), 10), "effect": "black white", "sensitivity": parseInt(prompt("Enter a sensitivity:", "40"), 10)}, edgeDetection);
			break;
		case "fullscreen": case 'f': case 'full':
			fullscreen();
			break;
		case "grayscale": case "greyscale": case 'g': case "gray": case "grey":
			runEffect({}, grayscale);
			break;
		case "invert": case 'i':
			runEffect({}, invert);
			break;
		case "invert edge": case 'ie':
			runEffect({"radius": parseInt(prompt("Radius", "2"), 10), "effect": "invert", "sensitivity": parseInt(prompt("Enter a sensitivity:", "40"), 10)}, edgeDetection);
			break;
		case "list commands":
			OpenInNewTab("https://goo.gl/Jnhgnc");
			break;
		case "mixed": case 'm':
			runEffect({"radius": parseInt(prompt("Radius", "2"), 10)}, mixed);
			break;
		case "pixelate": case 'p':
			runEffect({"radius": parseInt(prompt("Radius", "5"), 10)}, pixelate);
			break;
		case "rainbow": case 'r':
			runEffect({}, rainbow);
			break;
		case "rotate colors": case 'rc':
			runEffect({}, rotateColors);
			break;
		case "sepia": case 's':
			runEffect({}, sepia);
			break;
		case "sandwich":
			runEffect({"orientation": prompt("What orientation?", "horizontal")}, sandwich);
			break;
		case "stripper":
			runEffect({"orientation": prompt("What orientation?", "horizontal"), "radius": parseInt(prompt("Width", "5"), 10)}, stripper);
			break;
		case "tint": case 't':
			runEffect({"magnitude": prompt("How much?", "-50")}, tint);
			break;
		case "toggle preview": case "preview":
			toggleElemVisiblity(getElemId("color-preview"));
			toggleElemVisiblity(getElemId("color-text"));
			break;
		case "toggle sound": case "sound":
			toPlaySound = !toPlaySound;
			break;
		case "toggle url": case "url":
			toggleElemVisiblity(imageSrcElem);
			break;
		default:
			if(promptIfNotFound && confirm(command + " not found. For a full list of commands, press OK"))
				OpenInNewTab("https://goo.gl/Jnhgnc");
			break;
	}
}

function promptCommands() {
	var command = prompt("Please enter a command", "list commands");
	if (command) // prevent cancel
		runCommand(command, true);
}

document.addEventListener("keydown", e => {
	switch (e.which) {
		case 9: // tab
			e.preventDefault();
			swapImageWithOriginal();
			break;
		case 13: // enter
			changeImageSrc(imageSrcElem.value);
			imageSrcElem.blur();
			break;
		case 67: case 191: // c, /
			setCookie("commands-shown", "press 'c' to enter commands", 10);
			color = "all";
			promptCommands();
			break;
		default:
			runCommand(String.fromCharCode(e.which), false);
			break;
	}
});
background.addEventListener("click", e => {
	if (e.ctrlKey) {
		const parentOffsetLeft = background.parentElement.offsetLeft;
		const parentOffsetTop = background.parentElement.offsetTop;

		mouseX = e.pageX - parentOffsetLeft;
		mouseY = e.pageY - parentOffsetTop;

		showRgb(mouseX, mouseY, true);
	}
});

background.addEventListener("mousemove", e => {
	const parentOffsetLeft = background.parentElement.offsetLeft;
	const parentOffsetTop = background.parentElement.offsetTop;

	mouseX = e.pageX - parentOffsetLeft;
	mouseY = e.pageY - parentOffsetTop;

	if(getElemStyle(getElemId("color-preview"), "display") !== "none")
		showRgb(mouseX, mouseY, false);
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
