(function () {


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


})();