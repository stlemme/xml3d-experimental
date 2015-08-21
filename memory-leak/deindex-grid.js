
var Xflow = Xflow || {};
var XML3D = XML3D || {};
	
(function() {


bi = 0;


Xflow.registerOperator("xflow.deindex", {
    outputs: [
		{type: 'float3', name: 'position', customAlloc: true},
		{type: 'float3', name: 'normal', customAlloc: true},
		{type: 'float2', name: 'texcoord', customAlloc: true},
		{type: 'float3', name: 'barycentric', customAlloc: true}
	],
    params:  [
        { type: 'float3', source: 'position', array: true },
		{ type: 'float3', source: 'normal', array: true },
		{ type: 'float2', source: 'texcoord', array: true },
        { type: 'int', source: 'index' }
    ],
    alloc: function(sizes, position, normal, texcoord, index)
    {
        sizes['position'] = index.length;
		sizes['normal'] = index.length;
		sizes['texcoord'] = index.length;
		sizes['barycentric'] = index.length;

 		console.log('xflow.deindex - ' + index.length);
    },
	
	// evaluate_core: function(out_position, out_normal, out_texcoord, out_barycentric, position, normal, texcoord, index)
	// {
		// console.log("info: " + info);
		
		// var idx3 = 3*index[0];
		// var idx2 = 2*index[0];
		
		// out_position[0] = position[idx3  ];
		// out_position[1] = position[idx3+1];
		// out_position[2] = position[idx3+2];
	
		// out_normal[0] = normal[idx3  ];
		// out_normal[1] = normal[idx3+1];
		// out_normal[2] = normal[idx3+2];

		// out_texcoord[0] = texcoord[idx2  ];
		// out_texcoord[1] = texcoord[idx2+1];

		// out_barycentric[0] = 0;
		// out_barycentric[1] = 0;
		// out_barycentric[2] = 0;
		
		// out_barycentric[(bi++)%3] = 1;
	// },
	
    evaluate: function(out_position, out_normal, out_texcoord, out_barycentric, position, normal, texcoord, index, info)
	{
 		console.log('xflow.deindex - ' + index.length + ' - ' + out_position.length/3 + ' - ' + out_normal.length/3 + ' - ' + out_texcoord.length/2 + ' - ' + out_barycentric.length/3);
		
		var offp = 0;
		var offn = 0;
		var offt = 0;
		var offb = 0;

        for (var i = 0; i < index.length; i++)
		{
			var idx3 = 3*index[i];
			var idx2 = 2*index[i];
			
			//positions
            out_position[offp++] = position[idx3  ];
            out_position[offp++] = position[idx3+1];
            out_position[offp++] = position[idx3+2];
			
			//normals
			out_normal[offn++] = normal[idx3  ];
            out_normal[offn++] = normal[idx3+1];
            out_normal[offn++] = normal[idx3+2];
			
			//texcoords
			out_texcoord[offt++] = texcoord[idx2  ];
			out_texcoord[offt++] = texcoord[idx2+1];
			
			//barycentrics
			out_barycentric[offb++] = 0;
			out_barycentric[offb++] = 0;
			out_barycentric[offb  ] = 0;
			
			out_barycentric[offb++ - (i%3)] = 1;
        }


        return true;
    }
});


})();
