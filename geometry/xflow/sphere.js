var XML3D = XML3D || {};
var Xflow = Xflow || {};


(function() {


Xflow.registerOperator("xflow.sphere", {
    outputs: [
		{type: 'float3', name: 'position', customAlloc: true},
		{type: 'float3', name: 'normal', customAlloc: true},
		{type: 'int', name: 'index', customAlloc: true}
	],
	
    params:  [
		{type: 'int4', src: 'segments', array: true},
		{type: 'float2', src: 'phi', array: true} //,
		// {type: 'float', src: 'theta'}
    ],
	
    alloc: function(sizes, segments, phi)
    {
		var widthSegments = segments[0];
		var heightSegments = segments[1];
		
		var vertices = (widthSegments+1)*(heightSegments+1);
		sizes['position'] = vertices;
		sizes['normal'] = vertices;
		
		var triangles = 2*widthSegments*heightSegments;
		/* if (theta[0] === 0) */ triangles -= widthSegments;
		/* if (theta[1] === 1) */ triangles -= widthSegments;
		sizes['index'] = 3*triangles;
		
		console.log(sizes);
	},
	
    evaluate: function(position, normal, index, segments, phi)
	{
		var x, y;
		var vertices = [];
		var i = 0, j = 0;
		
		var widthSegments = segments[0];
		var heightSegments = segments[1];
		// DEBUG
		phi = [0, 1];
		
		var phiStart = 2*Math.PI * phi[0];
		var phiLength = 2*Math.PI * phi[1];
		var thetaStart = 0; // 2*Math.PI * theta[0];
		var thetaLength = 2*Math.PI; // * theta[1];
		
		console.log(position.length);
		console.log(normal.length);
		console.log(index.length);

		for ( y = 0; y <= heightSegments; y ++ ) {

			var verticesRow = [];
			// var uvsRow = [];

			for ( x = 0; x <= widthSegments; x ++ ) {

				var u = x / widthSegments;
				var v = y / heightSegments;

				var sinTheta = Math.sin( thetaStart + v * thetaLength );
				var cosTheta = Math.cos( thetaStart + v * thetaLength );
				var sinPhi = Math.sin( phiStart + u * phiLength );
				var cosPhi = Math.cos( phiStart + u * phiLength );
				
				// var vertex = XML3D.vec3.create();
				position[3*i  ] = -cosPhi * sinTheta;
				position[3*i+1] =  cosTheta;
				position[3*i+2] =  sinPhi * sinTheta;

				normal[3*i  ] = -cosPhi * sinTheta;
				normal[3*i+1] =  cosTheta;
				normal[3*i+2] =  sinPhi * sinTheta;
				// this.vertices.push( vertex );

				verticesRow.push( i );
				// uvsRow.push( new XML3D.vec2.fromValues( u, 1-v ) );

				i++;
			}

			vertices.push( verticesRow );
			// uvs.push( uvsRow );

		}

		for ( y = 0; y < heightSegments; y ++ ) {

			for ( x = 0; x < widthSegments; x ++ ) {

				var v1 = vertices[ y   ][ x+1 ];
				var v2 = vertices[ y   ][ x   ];
				var v3 = vertices[ y+1 ][ x   ];
				var v4 = vertices[ y+1 ][ x+1 ];

				// var n1 = this.vertices[ v1 ].clone().normalize();
				// var n2 = this.vertices[ v2 ].clone().normalize();
				// var n3 = this.vertices[ v3 ].clone().normalize();
				// var n4 = this.vertices[ v4 ].clone().normalize();

				// var uv1 = uvs[ y   ][ x+1 ].clone();
				// var uv2 = uvs[ y   ][ x   ].clone();
				// var uv3 = uvs[ y+1 ][ x   ].clone();
				// var uv4 = uvs[ y+1 ][ x+1 ].clone();

				if ( Math.abs( position[ 3*v1+1 ] ) === 1 ) {

					// uv1.x = ( uv1.x + uv2.x ) / 2;
					// this.faces.push( new THREE.Face3( v1, v3, v4, [ n1, n3, n4 ] ) );
					index[j++] = v1;
					index[j++] = v3;
					index[j++] = v4;
					// this.faceVertexUvs[ 0 ].push( [ uv1, uv3, uv4 ] );

				} else if ( Math.abs( position[ 3*v3+1 ] ) === 1 ) {

					// uv3.x = ( uv3.x + uv4.x ) / 2;
					// this.faces.push( new THREE.Face3( v1, v2, v3, [ n1, n2, n3 ] ) );
					index[j++] = v1;
					index[j++] = v2;
					index[j++] = v3;
					// this.faceVertexUvs[ 0 ].push( [ uv1, uv2, uv3 ] );

				} else {

					// this.faces.push( new THREE.Face3( v1, v2, v4, [ n1, n2, n4 ] ) );
					index[j++] = v1;
					index[j++] = v2;
					index[j++] = v4;
					// this.faceVertexUvs[ 0 ].push( [ uv1, uv2, uv4 ] );

					// this.faces.push( new THREE.Face3( v2, v3, v4, [ n2.clone(), n3, n4.clone() ] ) );
					index[j++] = v2;
					index[j++] = v3;
					index[j++] = v4;
					// this.faceVertexUvs[ 0 ].push( [ uv2.clone(), uv3, uv4.clone() ] );

				}

			}

		}
		
        return true;
    }
});


})();
