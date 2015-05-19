
var XML3D = XML3D || {};


(function() {

XML3D.shaders.register("polarmapping", {

	vertex : [
		"attribute vec3 position;",

		"varying vec3 fragPosition;",

		"uniform mat4 modelViewProjectionMatrix;",

		"void main(void) {",
		"    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);",
		"    fragPosition = position;",
		"}"
	].join("\n"),

	fragment : [
		"uniform sampler2D polarmapTexture;",

		"varying vec3 fragPosition;",

		"void main(void) {",
		"  vec3 color = 0.5 * fragPosition + vec3(0.5);",
		"  gl_FragColor = vec4(color, 1.0);",
		"}"
	].join("\n"),
	addDirectives: function() {},
	hasTransparency: function(params) {
		return false;
	},
	uniforms: {
	},
	samplers: {
		polarmapTexture : null
	},
	attributes: {
	}
});

})();