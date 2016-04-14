(function () {


var XModelProto = Object.create(HTMLElement.prototype);

XModelProto.createdCallback = function() {
	this.root = this.createShadowRoot();
	var id = this.getAttribute('src');
	
	this.asset = document.querySelector(id);
	console.log(this.asset);
	if (!this.asset) return;
	
	var clone = document.importNode(this.asset, true);
	console.log(clone);
	
	var child = clone.firstElementChild;
	while (child) {
		this.root.appendChild(child);
		child = child.nextElementSibling;
	}
	
	this.traverseAsset(this, this.root);
};

XModelProto.attributeChangedCallback = function(attr, oldValue, newValue) {
	console.log(attr);
}

XModelProto.getOrCreateChild = function(node, childTag, childName) {
	var child = node.querySelector(childTag + "[name='" + childName + "']");

	if (!child) {
		child = document.createElement(childTag);
		child.setAttribute('name', childName);
		node.appendChild(child);
	}
	
	return child;
}

XModelProto.traverseAsset = function(modelNode, assetNode) {
	console.log(modelNode);
	
	var child = modelNode.firstElementChild;
	while (child) {
		console.log(child);
		var tag = child.localName;
		var name = child.getAttribute('name');
		
		if (name) {
			if (tag == 'data' || tag == 'mesh') {
				this.traverseAsset(child, this.getOrCreateChild(assetNode, tag, name));
			} else {
				var content = document.createElement('content');
				content.setAttribute('select', tag + "[name='" + name + "']");
				assetNode.appendChild(content);
			}
		}
		
		child = child.nextElementSibling;
	}
}


var XModelElement = document.registerElement('x-group', {
	prototype: Object.create(XModelProto)
});


})();