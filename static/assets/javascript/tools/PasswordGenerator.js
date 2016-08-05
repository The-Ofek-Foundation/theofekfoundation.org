$("#generate-form").submit(function () {
	var password = "", length = $("input[name=length]").val(), illegal = $("input[name=illegal]").val(), char;
	for (var i = 0; i < length; i++) {
		do {
			char = String.fromCharCode(Math.random() * 95 + 32 | 0);
		}	while (illegal.indexOf(char) !== -1);
		password += char;
	}
	$("#password").val(password);
	return false;
});

$("#copy-button").click(function (e) {
	copyFieldValue(e, "password");
});

function copyFieldValue(e, id){
	var field = document.getElementById(id);
	field.focus();
	field.setSelectionRange(0, field.value.length);
	var copySuccess = copySelectionText();
	if (copySuccess)
			showtooltip(e);
}

var tooltip, hideTooltipTimer;

function createTooltip(){
	tooltip = document.createElement('div');
	tooltip.style.cssText = 'position:absolute; background:black; color:white; padding:4px;z-index:10000;' + 'border-radius:2px; font-size:12px;box-shadow:3px 3px 3px rgba(0,0,0,.4);' + 'opacity:0;transition:opacity 0.3s';
	tooltip.innerHTML = 'Copied!';
	document.body.appendChild(tooltip);
}

function showtooltip(e){
	var evt = e || event;
	clearTimeout(hideTooltipTimer);
	tooltip.style.left = evt.pageX - 10 + 'px';
	tooltip.style.top = evt.pageY + 15 + 'px';
	tooltip.style.opacity = 1;
	hideTooltipTimer = setTimeout(function(){
		tooltip.style.opacity = 0;
	}, 2000);
}

function copySelectionText(){
	var copySuccess;
	try{
		copySuccess = document.execCommand("copy");
	} catch(e){
		copySuccess = false;
	}
	return copySuccess;
}

createTooltip();