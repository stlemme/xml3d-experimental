
(function() {


var font = {
	defaultGlyph: function() {
		return {
			width: 1.0,
			x: 0.0,
			y: 0.0
		};
	},
	
	getGlyph: function(char) { return null; },
	glyphs: {},
	
	resolution: 32.0,
	
};


var text = 'Hello W!';


Xflow.registerOperator("xflow.text", {
    outputs: [
		{type: 'float3', name: 'position', customAlloc: true},
		{type: 'float3', name: 'normal', customAlloc: true},
		{type: 'float2', name: 'texcoord', customAlloc: true},
		{type: 'int', name: 'index', customAlloc: true}
	],
	
    params:  [
		{type: 'int', src: 'resolution'}
    ],
	
    alloc: function(sizes, resolution)
    {
		var chars = text.length;
		var vertices = 4*chars;
		
		sizes['position'] = vertices;
		sizes['normal'] = vertices;
		sizes['texcoord'] = vertices;
		
		sizes['index'] = 6*chars;
    },
	
    evaluate: function(position, normal, texcoord, index, resolution)
	{
		var length = text.length;
		var i, j;
		var offx = 0.0, offv = 0, offi = 0;
		var scale = resolution / font.texSize;

		for (j = 0; j < length; ++j)
		{
			var cp = text.charCodeAt(j);
			var g = font.getGlyph(cp);
			if (!g) g = font.defaultGlyph();
				
			for (i = 0; i < 4; ++i)
			{
				var x = i < 2 ? 0.0 : g.width;
				var y = i % 2 ? 1.0 : 0.0;

				console.log("cp: " + cp + ", offv: " + offv + ", i: " + i + ", offx: " + offx + ", x: " + x + ", y: " + y);
				
				var k = offv + i;
				
				position[3*k  ] = offx + x;
				position[3*k+1] = y;
				position[3*k+2] = 0.0;
				
				normal[3*k  ] = 0.0;
				normal[3*k+1] = 0.0;
				normal[3*k+2] = 1.0;
				
				texcoord[2*k  ] = g.x + x*scale;
				texcoord[2*k+1] = g.y + y*scale;
			}
			
			offx += g.width;
			
			index[offi++] = offv+3;
			index[offi++] = offv+1;
			index[offi++] = offv+0;

			index[offi++] = offv+0;
			index[offi++] = offv+2;
			index[offi++] = offv+3;

			offv += 4;
		}
		
		console.log(position);
		console.log(index);
		
        return true;
    }
});


})();
