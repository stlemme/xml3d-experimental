fetch("../../xml3d-components/bounding-box-inspector.html").then(function(response) {
	return response.text();
}).then(function(text) {
	var template = document.createElement("div");
	template.innerHTML = text;
	XML3D.registerComponent(template.querySelector("template"));
});

XML3D.BoundingBoxInspector = {};
XML3D.BoundingBoxInspector.showBoundingBox = function(element, optColor) {
	var bbox = document.createElement('float3');
	bbox.setAttribute('name', 'bbox');
	bbox.textContent = element.getWorldBoundingBox().toDOMString();
	
	var xbbox = document.createElement('x-bounding-box');
	xbbox.appendChild(bbox);
	
	if (optColor) {
		var color = document.createElement("float3");
		color.setAttribute("name", "diffuseColor");
		color.textContent = optColor.toDOMString();
		xbbox.appendChild(color);
	}
	
	element.parentElement.appendChild(xbbox);
}

XML3D.BoundingBoxInspector.hideBoundingBox = function(element) {
	var sibling = element;
	while (sibling = sibling.nextElementSibling) {
		if (sibling.nodeName == 'X-BOUNDING-BOX') {
			sibling.parentElement.removeChild(sibling);
			break;
		}
	}
}


