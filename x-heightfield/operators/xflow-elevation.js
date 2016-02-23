(function () {


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


})();