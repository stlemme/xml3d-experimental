var XML3D = XML3D || {};

(function() {


XML3D.Font = function ( fontFamily, resolution, baseline, fontSize ) {
	console.log(this);
	console.log(fontFamily);
	console.log(resolution);
	console.log(baseline);
	console.log(fontSize);
	this.resolution = resolution;
	this.texSize = 512;

	this.style = fontSize + "px " + fontFamily;
	this.baseline = baseline;

	this.glyphs = {};
	
	this.canvas = document.createElement('canvas');
	this.canvas.width = this.texSize;
	this.canvas.height = this.texSize;
	document.getElementById('debug').appendChild(this.canvas);
	
	this.ctx = this.canvas.getContext('2d');
	this.ctx.font = this.style;
	this.ctx.grid
	
	this.scale = this.resolution / this.texSize;
	this.offx = 0;
	this.offy = 0;
	console.log(this);
};


XML3D.Font.prototype.defaultGlyph = function() {
	return {
		width: 1.0,
		x: 0.0,
		y: 0.0
	};
};


XML3D.Font.prototype.getGlyph = function( cp ) {
	if (cp in this.glyphs)
		return this.glyphs[cp];
	
	console.log("Create glyph for codepoint " + cp)
	
	var c = String.fromCharCode(cp);
	console.log(this.ctx);
	
	var m = this.ctx.measureText(c);
	console.log(m);
	
	this.ctx.fillText(c, this.offx, this.offy + this.baseline);

	var g = {
		x: this.offx / this.texSize,
		y: this.offy / this.texSize,
		width: m.width / this.resolution
	};
	
	this.glyphs[cp] = g;
	console.log(g);

	this.offx += Math.ceil(m.width);
	if (this.offx >= this.texSize) {
		this.offy += this.resolution;
		this.offx = 0;
	}
	console.log(this.offx + ", " + this.offy);
	
	return g;
};

XML3D.Font.prototype.getImageData = function() {
	return this.ctx.getImageData(0, 0, this.texSize, this.texSize);
};

var font = null;

function getFont(resolution, baseline, fontSize) {
	console.log(resolution);
	console.log(baseline);
	console.log(fontSize);
	if (!font) {
		font = new XML3D.Font("Tahoma", 32, 20, 30);
		// font = new XML3D.Font("Tahoma", resolution, baseline, fontSize);
	}
	return font;
}

var text = 'Hello World!';


Xflow.registerOperator("xflow.text", {
    outputs: [
		{type: 'float3', name: 'position', customAlloc: true},
		{type: 'float3', name: 'normal', customAlloc: true},
		{type: 'float2', name: 'texcoord', customAlloc: true},
		{type: 'int', name: 'index', customAlloc: true},
		{type: 'texture', name: 'bitmap', customAlloc: true}
	],
	
    params:  [
		{type: 'int', src: 'resolution'},
		{type: 'int', src: 'baseline'},
		{type: 'int', src: 'fontsize'}
    ],
	
    alloc: function(sizes, resolution, baseline, fontsize)
    {
		var chars = text.length;
		var vertices = 4*chars;
		
		sizes['position'] = vertices;
		sizes['normal'] = vertices;
		sizes['texcoord'] = vertices;
		
		sizes['index'] = 6*chars;

		console.log(resolution);
		console.log(baseline);
		console.log(fontsize);
		
		var font = getFont(resolution[0], baseline[0], fontsize[0]);
		console.log(font);

		// var samplerConfig = new Xflow.SamplerConfig;
		// samplerConfig.setDefaults();
		// console.log(samplerConfig);
		sizes['bitmap'] = {
			imageFormat : {width: font.texSize, height: font.texSize} //,
			// samplerConfig : samplerConfig
		};
	},
	
    evaluate: function(position, normal, texcoord, index, bitmap, resolution, baseline, fontsize)
	{
		var font = getFont(resolution[0], baseline[0], fontsize[0])
		console.log(font);
		
		var length = text.length;
		var i, j;
		var offx = 0.0, offv = 0, offi = 0;
		var scale = font.resolution / font.texSize;

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
		
		var tex = font.getImageData();
		console.log(tex);
		
		console.log(bitmap);
		var d = bitmap.data;
		d.set(tex.data);
		
		for (var i = 3; i < d.length; ++i)
			d[i] = 255;
		
        return true;
    }
});


})();
