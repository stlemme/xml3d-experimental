(function () {


Xflow.registerOperator("xflow.lookat", {
	outputs: [ {type: 'float4x4', name: 'transform'} ],
	params:  [ {type: 'float3', source: 'eye'},
			   {type: 'float3', source: 'center'},
			   {type: 'float3', source: 'up'} ],
	evaluate: function(transform, eye, center, up) {
		throw new Error("Not used!");
	},
	evaluate_core: function(transform, eye, center, up) {
		XML3D.math.mat4.lookAt(transform, eye, center, up);
		XML3D.math.mat4.invert(transform, transform);
	}
});


})();