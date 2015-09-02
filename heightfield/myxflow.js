

Xflow.registerOperator("xflow.vertexNormal", {
	outputs: [	{type: 'float3', name: 'normal', customAlloc: true} ],
	params:  [  {type: 'float3', source: 'position', array: true },
				{type: 'int', source: 'index', array: true },
				{type: 'string', source: 'type', array: true } ],
	alloc: function(sizes, position, index, type)
	{
		sizes['normal'] = (position.length/3);
	},
	evaluate: function(normal, position, index, type, info) {
		var vl = position.length;
		
		for (var i=0; i < normal.length; i++)
			normal[i] = 0;

		var il = index.length;
		var is = 0;
		var ic = 3;
		if (type[0] == 'tristrips') {
			var il = index.length-2;
			var is = 0;
			var ic = 1;
		}

		for (var j=is; j < il; j+=ic) {
			
			// n ← n + Normalize(Normal(v, j))
			var A = 3*index[j  ];
			var B = 3*index[j+1];
			var C = 3*index[j+2];

			if (type[0] == 'tristrips') {
				if (j % 2 > 0) {
					var D = A;
					A = C; C = D;
				}
			}
			
			var Ax = position[A  ];
			var Ay = position[A+1];
			var Az = position[A+2];

			var Bx = position[B  ];
			var By = position[B+1];
			var Bz = position[B+2];

			var Cx = position[C  ];
			var Cy = position[C+1];
			var Cz = position[C+2];
			
			var Ux = Bx - Ax;
			var Uy = By - Ay;
			var Uz = Bz - Az;
			
			var Vx = Cx - Ax;
			var Vy = Cy - Ay;
			var Vz = Cz - Az;
			
			var S = [
				Uy*Vz - Uz*Vy,
				Uz*Vx - Ux*Vz,
				Ux*Vy - Uy*Vx
			];
			
			// normalize
			// var l = Math.sqrt(S[0]*S[0]+S[1]*S[1]+S[2]*S[2]);
			for (var k=0; k<3; k++) {
				// var n = S[k] / l;
				var n = S[k];
				normal[A+k] += n;
				normal[B+k] += n;
				normal[C+k] += n;
			};
		}
			
			// v[i].n ← Normalize(n)
			// var l = Math.sqrt(n[0]*n[0]+n[1]*n[1]+n[2]*n[2]);
			// for (var k=0; k<3; k++) normal[k] = n[k] / l;
		// }
		
		for (var i=0; i < normal.length; i+=3) {
			var l = Math.sqrt(normal[i]*normal[i]+normal[i+1]*normal[i+1]+normal[i+2]*normal[i+2]);
			normal[i  ] = normal[i  ] / l;
			normal[i+1] = normal[i+1] / l;
			normal[i+2] = normal[i+2] / l;
		}
		// console.log(normal);
	}
});


Xflow.registerOperator("xflow.vizNormals", {
	outputs: [	{type: 'float3', name: 'position', customAlloc: true} ],
	params:  [  {type: 'float3', source: 'position' },
				{type: 'float3', source: 'normal' } ],
	alloc: function(sizes, position, normal)
	{
		sizes['position'] = 2*(position.length/3);
	},
	evaluate: function(result, position, normal, info) {
		// console.log(info);
		// console.log(position);
		// console.log(normal);
		for(var i=0; i < info.iterateCount; i++) {
			result[6*i  ] = position[3*i  ];
			result[6*i+1] = position[3*i+1];
			result[6*i+2] = position[3*i+2];

			result[6*i+3] = position[3*i  ] + normal[3*i  ];
			result[6*i+4] = position[3*i+1] + normal[3*i+1];
			result[6*i+5] = position[3*i+2] + normal[3*i+2];
		}
		// console.log(result);
	}
});


Xflow.registerOperator("xflow.imagesize", {
	outputs: [	{type: 'int', name: 'size', customAlloc: true} ],
	params:  [  {type: 'texture', source: 'image' } ],
	alloc: function(sizes, image)
	{
		sizes['size'] = 2;
	},
	evaluate: function(size, image) {
		size[0] = image.width;
		size[1] = image.height;
	}
});



Xflow.registerOperator("xflow.elevation", {
	outputs: [	{type: 'float', name: 'elevation', customAlloc: true} ],
	params:  [  {type: 'texture', source: 'heightmap' } ],
	alloc: function(sizes, heightmap)
	{
		sizes['elevation'] = heightmap.width * heightmap.height;
	},
	evaluate: function(elevation, heightmap) {
		// console.log(heightmap);
		var l = heightmap.width * heightmap.height;
		// var sum = 0.0;
		for (var i = 0; i < l; i++) {
			elevation[i] = heightmap.data[4*i] / 255.0;
			// sum += elevation[i];
		}
		// console.log(elevation);
		// console.log("Average:" + sum);
	}
});



/**
 * Grid Generation
 */
Xflow.registerOperator("xflow.mygrid", {
    outputs: [	{type: 'float3', name: 'position', customAlloc: true},
				{type: 'float3', name: 'normal', customAlloc: true},
				{type: 'float2', name: 'texcoord', customAlloc: true},
				{type: 'int', name: 'index', customAlloc: true}],
    params:  [  {type: 'int', source: 'size', array: true},
				{type: 'string', source: 'type', array: true}],
    alloc: function(sizes, size, type)
    {
        var s = size[0];
        var t = (size.length > 1) ? size[1] : s;
        sizes['position'] = s* t;
        sizes['normal'] = s* t;
        sizes['texcoord'] = s* t;
		if (type[0] == 'tristrips') {
			// tristrips
			sizes['index'] = (s*t) + (s-1)*(t-2);
		} else {
			// triangles
			sizes['index'] = (s-1) * (t-1) * 6;
		}
    },
    evaluate: function(position, normal, texcoord, index, size, type) {
		var s = size[0];
        var t = (size.length > 1) ? size[1] : s;
		var l = s*t;
		
        // Create Positions
		for(var i = 0; i < l; i++) {
			var offset = i*3;
			position[offset] =  (((i % s) / (s-1))-0.5)*2;
			position[offset+1] = 0;
			position[offset+2] = ((Math.floor(i/t) / (t-1))-0.5)*2;
			// position[offset+2] = ((Math.floor(i/s) / (s-1))-0.5)*2;
		}

        // Create Normals
		for(var i = 0; i < l; i++) {
			var offset = i*3;
			normal[offset] =  0;
			normal[offset+1] = 1;
			normal[offset+2] = 0;
		}
        // Create Texture Coordinates
		for(var i = 0; i < l; i++) {
			var offset = i*2;
			// tx in range [0..1] not [0..1)
            texcoord[offset] = (i%s) / s;
            texcoord[offset+1] = 1.0 - (Math.floor(i/t) / t);
            // texcoord[offset] = (i%s) / (s-1);
            // texcoord[offset+1] = 1.0 - (Math.floor(i/t) / (t-1));
            // texcoord[offset+1] = Math.floor(i/s) / (s-1);
		}


		if (type[0] == 'tristrips') {

			// Create Indices for trianglestrips
			var i = 0
			for (var row=0; row<t-1; row++) {
				if ( (row%2)==0 ) { // even rows
					for (var col=0; col<s; col++) {
						index[i++] = col + row * s;
						index[i++] = col + (row+1) * s;
					}
				} else { // odd rows
					for (var col=s-1; col>0; col--) {
						index[i++] = col + (row+1) * s;
						index[i++] = col - 1 + + row * s;
					}
				}
			}
			
		} else {
			
			// Create Indices for triangles
			var tl = (s-1) * (t-1);
			var offset = 0;
			for (var i = 0; i < tl; i++) {
				var base = i + Math.floor(i / (s-1));
				index[offset++] = base + 1;
				index[offset++] = base;
				index[offset++] = base + s;
				index[offset++] = base + s;
				index[offset++] = base + s + 1;
				index[offset++] = base + 1;
			}

		}
	}
});

