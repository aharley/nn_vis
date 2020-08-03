function createText(text, x, y) {
	group = new THREE.Group();
	group.position.x = x;
	group.position.y = y;
	group.name = 'text';
	scene.add( group );

	material = new THREE.MeshFaceMaterial( [ 
		new THREE.MeshPhongMaterial( { color: 0xFFFFFF, shading: THREE.FlatShading } ), // front
		new THREE.MeshPhongMaterial( { color: 0xFFFFFF, shading: THREE.SmoothShading } ) // side
	]);
	
	textGeo = new THREE.TextGeometry( text, {

		size: size,
		height: height,
		curveSegments: curveSegments,

		font: font,
		weight: weight,
		style: style,

		bevelThickness: bevelThickness,
		bevelSize: bevelSize,
		bevelEnabled: bevelEnabled,

		material: 1,
		extrudeMaterial: 1

	});

	textGeo.computeBoundingBox();
	textGeo.computeVertexNormals();

	if ( ! bevelEnabled ) {

		var triangleAreaHeuristics = 0.1 * ( height * size );

		for ( var i = 0; i < textGeo.faces.length; i ++ ) {
			
			var face = textGeo.faces[ i ];

			if ( face.materialIndex == 1 ) {

				for ( var j = 0; j < face.vertexNormals.length; j ++ ) {

					face.vertexNormals[ j ].z = 0;
					face.vertexNormals[ j ].normalize();

				}

				var va = textGeo.vertices[ face.a ];
				var vb = textGeo.vertices[ face.b ];
				var vc = textGeo.vertices[ face.c ];

				var s = THREE.GeometryUtils.triangleArea( va, vb, vc );

				if ( s > triangleAreaHeuristics ) {

					for ( var j = 0; j < face.vertexNormals.length; j ++ ) {

						face.vertexNormals[ j ].copy( face.normal );

					}

				}

			}

		}

	}

	var centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

	textMesh1 = new THREE.Mesh( textGeo, material );

	textMesh1.position.x = centerOffset;
	textMesh1.position.y = hover;
	textMesh1.position.z = -1;

	textMesh1.rotation.x = 0;
	textMesh1.rotation.y = Math.PI * 2;

	group.add( textMesh1 );

}
