var input = document.getElementById("input");
var output = document.getElementById("output");
var select_all = document.getElementById("select-all");
var speak_text = document.getElementById("speak-text");
var voice_select = document.getElementById("voice-select");
var output_height = output.scrollHeight;
var max_font_size = getComputed(input, "font-size");
var output_width = getComputed(input, "width") + "px";
var inside_height = getComputed(input, "height");
var padding = getComputed(input, "padding-top");

if ('speechSynthesis' in window)
  get_voices_R();
else {
  speak_text.style.display = "none";
  voice_select.style.display = "none";
}
var voices = [];


function get_voices_R() {
  voices = get_voices();
  if (voices.length === 0)
    setTimeout(get_voices_R, 1000);
  else {
    for (var i = 0; i < voices.length; i++) {
      var option = document.createElement("OPTION");
      option.value = voices[i].name;
      option.innerHTML = voices[i].name;
      voice_select.appendChild(option);
    }
  }
}

function get_voices() {
  return speechSynthesis.getVoices();
}

input.addEventListener("input", update_output);

document.onmousemove = function () {
  if (input.style.width !== output.style.width) {
    output.style.width = input.style.width;
    output_width = input.style.width;
  }
  if (input.style.height !== output.style.height) {
    output.style.height = input.style.height;
    output_height = output.scrollHeight;
  }
};

select_all.addEventListener("click", function (event) {
  output.focus();
  output.select();
});

speak_text.addEventListener("click", function (event) {
  speak(output.value);
});

function update_output() {
  var strign = input.value;
  var splti_strign = strign.split(" ");
  var nwe_strign = "", itme, gte_stuff, punctuatiosn, lenght, sbuindxe, indxe;
  for (indxe = 0; indxe < splti_strign.length; indxe++) {
    itme = splti_strign[indxe];
    gte_stuff = gte_punctuatiosn_adn_clena_strign(itme);
    punctuatiosn = gte_stuff[0];
    itme = gte_stuff[1];
    lenght = itme.length;
    itme = itme.substring(0, lenght - 2) + itme.charAt(lenght - 1) + itme.charAt(lenght - 2);
    for (sbuindxe = 0; sbuindxe < punctuatiosn.length; sbuindxe++)
      itme = itme.substring(0, punctuatiosn[sbuindxe][0]) + punctuatiosn[sbuindxe][1] + itme.substring(punctuatiosn[sbuindxe][0]);
    nwe_strign += itme + " ";
  }
  output.value = nwe_strign.substring(0, nwe_strign.length - 1);
  input.style.paddingTop = padding + "px";
  output.style.paddingTop = padding + "px";
  var fs = max_font_size;
  output.style.fontSize = fs + "px";
  while (output.scrollHeight > output_height)
    output.style.fontSize = --fs + "px";
  input.style.fontSize = output.style.fontSize;
  input.style.width = output_width;
  output.style.width = output_width;
  var diff = (inside_height - getComputed(input, "height")) / 2;
  input.style.paddingTop = diff + padding + "px";
  output.style.paddingTop = diff + padding + "px";
  input.style.paddingBottom = diff + padding + "px";
  output.style.paddingBottom = diff + padding + "px";
}
function getComputed(elem, prop) {
  return parseInt(window.getComputedStyle(elem, null).getPropertyValue(prop));
}

function gte_punctuatiosn_adn_clena_strign (itme){
  var punctuatiosn = [];
  var nwe_itme = "";
  for (var indxe = 0; indxe < itme.length; indxe++)
    if (siLettre(itme.charAt(indxe)))
        nwe_itme += itme.charAt(indxe);
    else punctuatiosn.push([indxe, itme.charAt(indxe)]);
  return [punctuatiosn, nwe_itme];
}

function siLettre(chra) {
  return chra.match(/[a-z]/i);
}

// say a message
function speak(text, callback) {
    var voice = voices.filter(function (voice) {
        return voice.name == voice_select.options[voice_select.selectedIndex].value;
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