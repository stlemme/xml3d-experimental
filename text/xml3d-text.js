var XML3D = XML3D || {};

(function() {


XML3D.attachText = function( text, elemId ) {
	console.log(elemId + ": " + text);
	
	var elem = document.getElementById(elemId);
	if (!elem) return;
	
	var chars = new Int32Array(text.length);
	for (var i = 0; i < text.length; ++i)
		chars[i] = text.charCodeAt(i);
	console.log(chars);
	elem.setScriptValue(chars);
};


})();
