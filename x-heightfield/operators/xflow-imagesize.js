(function () {


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


})();