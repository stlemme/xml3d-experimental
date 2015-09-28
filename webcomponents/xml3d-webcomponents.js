(function () {

var useShadow = true;

var XCompProto = Object.create(HTMLElement.prototype);

XCompProto.createdCallback = function() {
	this.root = useShadow ? this.createShadowRoot() : this;
	var id = this.getAttribute('data-src');
	
	this.template = document.querySelector(id);
	if (!this.template) return;
	
	var clone = document.importNode(this.template.content, true);
	this.root.appendChild(clone);
	
	// console.log(this.root.firstElementChild);
	
	this.handlers = {};
	for (var i = 0; i < this.template.attributes.length; i++) {
		var attr = this.template.attributes[i];
		var attrName = attr.localName;
		var place = this.place('.//node()[text()="{{'+attrName+'}}"]');
		// console.log(place);
		if (!place) place = this.place('.//@*[.="{{'+attrName+'}}"]');
		// console.log(place);
		if (!place) continue;
		
		var handler = (function(elem, value) {
			return function (newValue) {
				if (!newValue) newValue = value;
				elem.textContent = newValue;
			};
		})(place, attr.textContent);
		
		handler(this.getAttribute(attrName));
		this.handlers[attrName] = handler;
	}
};

XCompProto.place = function (path) {
	var context = useShadow ? this.root.firstElementChild : this.root;
	return document.evaluate(path, context, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
};

XCompProto.attributeChangedCallback = function(attr, oldValue, newValue) {
	// console.log(attr);
	var handler = this.handlers[attr];
	if (!handler) return;
	handler(newValue);
}


var XDataElement = document.registerElement('x-data', {
	prototype: Object.create(XCompProto)
});

var XGroupElement = document.registerElement('x-group', {
	prototype: Object.create(XCompProto)
});


})();