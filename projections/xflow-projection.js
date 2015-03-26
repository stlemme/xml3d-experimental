

(function() {

Xflow.registerOperator("xflow.ortho", {
    outputs: [
		{type: 'float4x4', name: 'perspective', customAlloc: true}
	],
	
    params:  [
        { type: 'float2', source: 'viewport' },
        { type: 'float', source: 'near' },
        { type: 'float', source: 'far' },
		{ type: 'float', source: 'vovy'}
    ],
	
    alloc: function(sizes, viewport, near, far, vovy)
    {
        sizes['perspective'] = 1;
    },
	
    evaluate: function(perspective, viewport, near, far, vovy)
	{
		var w = viewport[0], h = viewport[1];
		var y = 0.5 * vovy[0];
		var a = (w / h) * y;
		var r = a, l = -a, t = y, b = -y, f = far[0], n = near[0];

		XML3D.math.mat4.ortho(perspective, l, r, b, t, n, f);
		console.log(perspective);
		
        return true;
    }
});


Xflow.registerOperator("xflow.isometric", {
    outputs: [
		{type: 'float4x4', name: 'perspective', customAlloc: true}
	],
	
    params:  [
        { type: 'float2', source: 'viewport' },
        { type: 'float', source: 'near' },
        { type: 'float', source: 'far' },
		{ type: 'float', source: 'vovy'}
    ],
	
    alloc: function(sizes, viewport, near, far, vovy)
    {
        sizes['perspective'] = 1;
    },
	
    evaluate: function(perspective, viewport, near, far, vovy)
	{
		var w = viewport[0], h = viewport[1];
		var y = 0.5 * vovy[0];
		var a = (w / h) * y;
		var r = a, l = -a, t = y, b = -y, f = far[0], n = near[0];
		
		perspective[0] =  1.0; perspective[4] =  0.0; perspective[ 8] =  0.0; perspective[12] =  0.0;
		perspective[1] =  0.0; perspective[5] =  1.0; perspective[ 9] =  0.0; perspective[13] =  0.0;
		perspective[2] =  0.0; perspective[6] =  0.0; perspective[10] =  1.0; perspective[14] =  0.0;
		perspective[3] =  0.0; perspective[7] =  0.0; perspective[11] =  0.0; perspective[15] =  1.0;
		

		XML3D.math.mat4.ortho(perspective, l, r, b, t, n, f);
		console.log(perspective);
		
        return true;
    }
});


})();
