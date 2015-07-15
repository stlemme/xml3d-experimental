var XML3D = XML3D || {};
var Xflow = Xflow || {};

(function() {


Xflow.registerOperator("xflow.text", {
    outputs: [
		{type: 'float3', name: 'position', customAlloc: true},
		{type: 'float3', name: 'normal', customAlloc: true},
		{type: 'float2', name: 'texcoord', customAlloc: true},
		{type: 'texture', name: 'bitmap', customAlloc: true}
	],
	
    params:  [
    ],
	
    alloc: function(sizes)
    {
		var vertices = 4;
		
		sizes['position'] = vertices;
		sizes['normal'] = vertices;
		sizes['texcoord'] = vertices;
		
		sizes['bitmap'] = {
			imageFormat : {width: 256, height: 256}
		};
	},
	
    evaluate: function(position, normal, texcoord, bitmap)
	{
		var w = bitmap.width;
		var h = bitmap.height;
		var d_out = bitmap.data;
		
		for (var y=0; y<h; y++) {
			for (var x=0; x<w; x++) {
				var idx = 4*(y*w+x);
				d_out[idx  ] = x;
				d_out[idx+1] = y;
				d_out[idx+2] = 0;
				d_out[idx+3] = 255;
			}
		}
		
		var offp = 0, offn = 0; offt = 0;

		var g = {x: 0.0, y: 0.0, width: 1.0, height: 1.0};
		
		for (var i = 0; i < 4; ++i)
		{
			var x = i < 2 ? 0.0 : g.width;
			var y = i % 2 ? 0.0 : g.height;

			position[offp++] = x;
			position[offp++] = 1.0 - y;
			position[offp++] = 0.0;
			
			normal[offn++] = 0.0;
			normal[offn++] = 0.0;
			normal[offn++] = 1.0;
			
			texcoord[offt++] = g.x + x;
			texcoord[offt++] = 1.0 - (g.y + y);
		}
		
        return true;
    }
});


})();
