
var Xflow = Xflow || {};
var XML3D = XML3D || {};

(function() {

var camController;

function setupCameraController()
{
	camController = XML3D.Xml3dSceneController.controllers[0];
	camController.detach();
	camController.mode = "panning";
	camController.useKeys = false;
	camController.useRaycasting = true;
	camController.attach();
}

XML3D.updateViewportSize = function (elem) {
	camController.camera.setResolution(elem.clientWidth,elem.clientHeight);
}

window.addEventListener('load', setupCameraController, false);

})();
