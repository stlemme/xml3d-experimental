(function () {


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


})();