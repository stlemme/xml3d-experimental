
var XML3D = XML3D || {};


(function() {


XML3D.shaders.register("polarmapping", {

	vertex: [
		"attribute vec3 position;",

		"varying vec3 fragPosition;",

		"uniform mat4 modelViewProjectionMatrix;",

		"void main(void) {",
		"   fragPosition = position;",
		"   gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);",
		"}"
	].join("\n"),

	fragment: [
		"uniform sampler2D polarmapTexture;",

		"varying vec3 fragPosition;",

		"void main(void) {",
		"    float PI = 3.14159265358979323846264;",
		"    vec3 p = normalize(fragPosition);",
		"    vec2 uv;",
		"    uv.x = (atan(p.z, p.x) + PI) / (2.*PI);",
		"    uv.y = (asin(p.y) + 0.5*PI) / PI;",
		"    vec3 color = texture2D(polarmapTexture, uv).rgb;",
		"    gl_FragColor = vec4(color, 1.0);",
		"}"
	].join("\n"),
	samplers: {
        polarmapTexture : null
	},
	uniforms: {
	},
	attributes: {
	}
});


})();