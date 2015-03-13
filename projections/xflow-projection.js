
var Xflow = Xflow || {};
var XML3D = XML3D || {};
	
(function() {

Xflow.registerOperator("xflow.ortho", {
    outputs: [
		{type: 'float4x4', name: 'perspective', customAlloc: true}
	],
	
    params:  [
        { type: 'float2', source: 'viewport' },
        { type: 'float', source: 'near' },
        { type: 'float', source: 'far' }
    ],
	
    alloc: function(sizes, viewport, near, far)
    {
        sizes['perspective'] = 1;
    },
	
    evaluate: function(perspective, viewport, near, far)
	{
		var w = viewport[0], h = viewport[1];
		var a = w / h;
		var r = a, l = -a, t = 1.0, b = -1.0, f = far[0], n = near[0];

		XML3D.math.mat4.ortho(perspective, l, r, b, t, n, f);
		console.log(perspective);
		
        return true;
    }
});


})();
