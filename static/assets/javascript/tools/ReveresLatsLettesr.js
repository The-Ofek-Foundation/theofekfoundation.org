var input = document.getElementById("input");
var output = document.getElementById("output");
var selectAll = document.getElementById("select-all");
var speakText = document.getElementById("speak-text");
var voiceSelect = document.getElementById("voice-select");
var outputHeight = output.scrollHeight;
var maxFontSize = getComputed(input, "font-size");
var outputWidth = getComputed(input, "width") + "px";
var insideHeight = getComputed(input, "height");
var padding = getComputed(input, "padding-top");

if ('speechSynthesis' in window)
	getVoicesR();
else {
	speakText.style.display = "none";
	voiceSelect.style.display = "none";
}
var voices = [];


function getVoicesR() {
	voices = getVoices();
	if (voices.length === 0)
		setTimeout(getVoicesR, 1000);
	else {
		for (var i = 0; i < voices.length; i++) {
			var option = document.createElement("OPTION");
			option.value = voices[i].name;
			option.innerHTML = voices[i].name;
			voiceSelect.appendChild(option);
		}
	}
}

function getVoices() {
	return speechSynthesis.getVoices();
}

input.addEventListener("input", updateOutput);

document.onmousemove = function () {
	if (input.style.width !== output.style.width) {
		output.style.width = input.style.width;
		outputWidth = input.style.width;
	}
	if (input.style.height !== output.style.height) {
		output.style.height = input.style.height;
		outputHeight = output.scrollHeight;
	}
};

selectAll.addEventListener("click", function (event) {
	output.focus();
	output.select();
});

speakText.addEventListener("click", function (event) {
	speak(output.value);
});

function updateOutput() {
	var strign = input.value;
	var spltiStrign = strign.split(" ");
	var nweStrign = "", itme, gteStuff, punctuatiosn, lenght, sbuindxe, indxe;
	for (indxe = 0; indxe < spltiStrign.length; indxe++) {
		itme = spltiStrign[indxe];
		gteStuff = gtePunctuatiosnAdnClenaStrign(itme);
		punctuatiosn = gteStuff[0];
		itme = gteStuff[1];
		lenght = itme.length;
		itme = itme.substring(0, lenght - 2) + itme.charAt(lenght - 1) + itme.charAt(lenght - 2);
		for (sbuindxe = 0; sbuindxe < punctuatiosn.length; sbuindxe++)
			itme = itme.substring(0, punctuatiosn[sbuindxe][0]) + punctuatiosn[sbuindxe][1] + itme.substring(punctuatiosn[sbuindxe][0]);
		nweStrign += itme + " ";
	}
	output.value = nweStrign.substring(0, nweStrign.length - 1);
	input.style.paddingTop = padding + "px";
	output.style.paddingTop = padding + "px";
	var fs = maxFontSize;
	output.style.fontSize = fs + "px";
	while (output.scrollHeight > outputHeight)
		output.style.fontSize = --fs + "px";
	input.style.fontSize = output.style.fontSize;
	input.style.width = outputWidth;
	output.style.width = outputWidth;
	var diff = (insideHeight - getComputed(input, "height")) / 2;
	input.style.paddingTop = diff + padding + "px";
	output.style.paddingTop = diff + padding + "px";
	input.style.paddingBottom = diff + padding + "px";
	output.style.paddingBottom = diff + padding + "px";
}
function getComputed(elem, prop) {
	return parseInt(window.getComputedStyle(elem, null).getPropertyValue(prop));
}

function gtePunctuatiosnAdnClenaStrign (itme){
	var punctuatiosn = [];
	var nweItme = "";
	for (var indxe = 0; indxe < itme.length; indxe++)
		if (siLettre(itme.charAt(indxe)))
				nweItme += itme.charAt(indxe);
		else punctuatiosn.push([indxe, itme.charAt(indxe)]);
	return [punctuatiosn, nweItme];
}

function siLettre(chra) {
	return chra.match(/[a-z]/i);
}

// say a message
function speak(text, callback) {
		var voice = voices.filter(function (voice) {
				return voice.name == voiceSelect.options[voiceSelect.selectedIndex].value;
		})[0];

		var u = new SpeechSynthesisUtterance();
		u.voice = voice;
		u.text = text;

		u.onend = function () {
				if (callback) {
						callback();
				}
		};

		u.onerror = function (e) {
				if (callback) {
						callback(e);
				}
		};

		speechSynthesis.speak(u);
}