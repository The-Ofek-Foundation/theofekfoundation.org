$("#generate-form").submit(function () {
  var password = "", length = $("input[name=length]").val(), illegal = $("input[name=illegal]").val(), char;
  for (var i = 0; i < length; i++) {
    do {
      char = String.fromCharCode(Math.random() * 95 + 32 | 0);
    }  while (illegal.indexOf(char) !== -1);
    password += char;
  }
  $("#password").val(password);
  return false;
});

$("#copy-button").click(function (e) {
  copyfieldvalue(e, "password");
});

function copyfieldvalue(e, id){
  var field = document.getElementById(id);
  field.focus();
  field.setSelectionRange(0, field.value.length);
  var copysuccess = copySelectionText();
  if (copysuccess)
      showtooltip(e);
}

var tooltip, hidetooltiptimer;

function createtooltip(){
  tooltip = document.createElement('div');
  tooltip.style.cssText = 'position:absolute; background:black; color:white; padding:4px;z-index:10000;' + 'border-radius:2px; font-size:12px;box-shadow:3px 3px 3px rgba(0,0,0,.4);' + 'opacity:0;transition:opacity 0.3s';
  tooltip.innerHTML = 'Copied!';
  document.body.appendChild(tooltip);
}

function showtooltip(e){
  var evt = e || event;
  clearTimeout(hidetooltiptimer);
  tooltip.style.left = evt.pageX - 10 + 'px';
  tooltip.style.top = evt.pageY + 15 + 'px';
  tooltip.style.opacity = 1;
  hidetooltiptimer = setTimeout(function(){
    tooltip.style.opacity = 0;
  }, 2000);
}

function copySelectionText(){
  var copysuccess;
  try{
      copysuccess = document.execCommand("copy");
  } catch(e){
      copysuccess = false;
  }
  return copysuccess;
}

createtooltip();