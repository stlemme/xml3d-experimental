(function () {

var mat4 = XML3D.math.mat4;
var vec3 = XML3D.math.vec3;
var vec4 = XML3D.math.vec4;

var useShadow = false;

var TransformProto = Object.create(HTMLElement.prototype);

TransformProto.createdCallback = function() {
	var root = useShadow ? this.createShadowRoot() : this;
	this.child = document.createElement('float4x4');
	this.child.setAttribute('name', 'transform');
	this.updateMatrix();
	root.appendChild(this.child);
}

TransformProto.attributeChangedCallback = function(attr, oldValue, newValue) {
	this.updateMatrix();
}

var TMP = mat4.create();

TransformProto.attr = function (attr, type, def) {
	return type.fromDOMString(this.getAttribute(attr) || def);
}

TransformProto.updateMatrix = function () {
    var tr = this.attr('translation', vec3, '0 0 0');
    var ro = this.attr('rotation', vec4, '1 0 0 0');

    mat4.fromTranslation(TMP, tr);
    mat4.rotate(TMP, TMP, ro[3], ro);

	this.child.textContent = mat4.toDOMString(TMP);
};


var TransformElement = document.registerElement('x-data', {
	prototype: TransformProto
});


})();