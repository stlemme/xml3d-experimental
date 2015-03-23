

(function() {

Xflow.registerOperator("xflow.ortho", {
    outputs: [
		{type: 'float4x4', name: 'perspective', customAlloc: true}
	],
	
    params:  [
        { type: 'float2', source: 'viewport' },
        { type: 'float', source: 'near' },
        { type: 'float', source: 'far' },
		{ type: 'float', source: 'zoom'}
    ],
	
    alloc: function(sizes, viewport, near, far, zoom)
    {
        sizes['perspective'] = 1;
    },
	
    evaluate: function(perspective, viewport, near, far, zoom)
	{
		var w = viewport[0], h = viewport[1];
		var a = (w / h) * zoom[0];
		var r = a, l = -a, t = zoom[0], b = -zoom[0], f = far[0], n = near[0];

		XML3D.math.mat4.ortho(perspective, l, r, b, t, n, f);
		console.log(perspective);
		
        return true;
    }
});


})();
