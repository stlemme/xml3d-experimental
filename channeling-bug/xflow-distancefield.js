var XML3D = XML3D || {};
var Xflow = Xflow || {};

(function() {

Xflow.registerOperator("xflow.distancefield", {
    outputs: [
		{type: 'texture', name: 'result', customAlloc: true}
	],
	
    params:  [
		{type: 'texture', name: 'image'}
    ],
	
    alloc: function(sizes, image)
    {
		sizes['result'] = {
			imageFormat : {
				width: image.width,
				height: image.height
			}
		};
	},
	
    evaluate: function(result, image)
	{
		var w = result.width;
		var h = result.height;
		var d_out = result.data;
		
		for (var y=0; y<h; y++) {
			for (var x=0; x<w; x++) {
				var idx = 4*(y*w+x);
				d_out[idx  ] = Math.abs(x-y);
				d_out[idx+1] = 0;
				d_out[idx+2] = 0;
				d_out[idx+3] = 255;
			}
		}
		
		// console.log(d_out);
		
        return true;
    }
});


})();
