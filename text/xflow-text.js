var XML3D = XML3D || {};
var Xflow = Xflow || {};

(function() {


XML3D.Font = function ( fontFamily, resolution, baseline, fontSize ) {
	// console.log(this);
	// console.log(fontFamily);
	// console.log(resolution);
	// console.log(baseline);
	// console.log(fontSize);
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
	this.ctx.fillStyle = 'rgba(255,255,255,1)';
	//this.ctx.addGrid(32);
	
	this.scale = this.resolution / this.texSize;
	this.offx = 0;
	this.offy = 0;
	// console.log(this);
};

XML3D.Font.prototype.getGlyph = function( cp ) {
	if (cp in this.glyphs) {
		// console.log("Reuse glyph for codepoint " + cp)
		return this.glyphs[cp];
	}
	
	// console.log("Create glyph for codepoint " + cp)
	
	var c = String.fromCharCode(cp);
	// console.log(this.ctx);
	
	var m = this.ctx.measureText(c);
	// console.log(m);

	if (this.offx + m.width >= this.texSize) {
		this.offy += this.resolution;
		this.offx = 0;
	}
	
	this.ctx.fillText(c, this.offx, this.offy + this.baseline);

	var g = {
		x: this.offx / this.texSize,
		y: this.offy / this.texSize,
		width: m.width / this.resolution,
		height: 1.0
	};
	
	this.glyphs[cp] = g;
	// console.log(g);

	this.offx += Math.ceil(m.width);
	if (this.offx >= this.texSize) {
		this.offy += this.resolution;
		this.offx = 0;
	}
	// console.log(this.offx + ", " + this.offy);
	
	return g;
};

XML3D.Font.prototype.getImageData = function() {
	return this.ctx.getImageData(0, 0, this.texSize, this.texSize);
};

var font = null;

function getFont(resolution, baseline, fontSize) {
	// console.log(resolution);
	// console.log(baseline);
	// console.log(fontSize);
	if (!font) {
		font = new XML3D.Font("Tahoma", 64, 50, 60);
		// font = new XML3D.Font("Tahoma", resolution, baseline, fontSize);
	}
	return font;
}

// var text = 'Hello World!';
// var text = 'Deutsches Forschungszentrum für Künstliche Intelligenz (DFKI) GmbH';


Xflow.registerOperator("xflow.text", {
    outputs: [
		{type: 'float3', name: 'position', customAlloc: true},
		{type: 'float3', name: 'normal', customAlloc: true},
		{type: 'float2', name: 'texcoord', customAlloc: true},
		{type: 'texture', name: 'bitmap', customAlloc: true}
	],
	
    params:  [
		{type: 'int', src: 'resolution'},
		{type: 'int', src: 'baseline'},
		{type: 'int', src: 'fontsize'},
		{type: 'int', src: 'text'}
    ],
	
    alloc: function(sizes, resolution, baseline, fontsize, text)
    {
		var vertices = 4*text.length;
		
		sizes['position'] = vertices;
		sizes['normal'] = vertices;
		sizes['texcoord'] = vertices;
		
		// console.log(resolution);
		// console.log(baseline);
		// console.log(fontsize);
		
		var font = getFont(resolution[0], baseline[0], fontsize[0]);
		// console.log(font);

		// var samplerConfig = new Xflow.SamplerConfig;
		// samplerConfig.setDefaults();
		// console.log(samplerConfig);
		sizes['bitmap'] = {
			imageFormat : {width: font.texSize, height: font.texSize} //,
			// samplerConfig : samplerConfig
		};
	},
	
    evaluate: function(position, normal, texcoord, bitmap, resolution, baseline, fontsize, text)
	{
		var font = getFont(resolution[0], baseline[0], fontsize[0])
		// console.log(font);
		
		var length = text.length;
		var i, j;
		var offx = 0.0;
		var offp = 0, offn = 0; offt = 0;

		for (j = 0; j < length; ++j)
		{
			var cp = text[j];
			var g = font.getGlyph(cp);
			// if (!g) g = font.defaultGlyph();
			if (!g) continue;

			// DEBUG:
			// g = {
				// x: 0.0,
				// y: 0.0,
				// width: 1.0,
				// height: 1.0
			// };
			
			for (i = 0; i < 4; ++i)
			{
				var x = i < 2 ? 0.0 : g.width;
				var y = i % 2 ? 0.0 : g.height;

				// console.log("cp: " + cp + ", offv: " + offv + ", i: " + i + ", offx: " + offx + ", x: " + x + ", y: " + y);
				
				//var k = offv + i;
				
				position[offp++] = offx + x;
				position[offp++] = 1.0 - y;
				position[offp++] = 0.0;
				
				normal[offn++] = 0.0;
				normal[offn++] = 0.0;
				normal[offn++] = 1.0;
				
				texcoord[offt++] = g.x + x*font.scale;
				texcoord[offt++] = 1.0 - (g.y + y*font.scale);
			}
			
			offx += g.width;
		}
		
		var tex = font.getImageData();
		bitmap.data.set(tex.data);
		
        return true;
    }
});


})();
