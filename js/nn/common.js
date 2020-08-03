function applyVertexColors( g, c ) {
    var count = 0;
    g.faces.forEach( function( f ) {

	var n = ( f instanceof THREE.Face3 ) ? 3 : 4;					
	for( var j = 0; j < n; j ++ ) {

	    f.vertexColors[ j ] = c;
	    count++;
	}

    } );
    //console.log('applied colors to ' + count + 'vertices');

}
function applySpecialVertexColors( g ) {
    
    var faceCount = 0;				
    var color = new THREE.Color();
    color.setHex( Math.random() * 0xffffff )
    var cubeNum = 0;
    g.faces.forEach( function( f ) {
	faceCount++;
	cubeNum = faceCount/12;
	if (faceCount % 12 == 1) {
	    color = new THREE.Color();
	    color.setHex( Math.random() * 0xffffff )
	}
	if (faceCount <= 12) {
	    color = new THREE.Color();
	    color.setHex( 0x0000ff )
	}
	var n = ( f instanceof THREE.Face3 ) ? 3 : 4;
	for( var j = 0; j < n; j ++ ) {
	    f.vertexColors[ j ] = color;
	}
    });
}
function updateTinyBoard() {
    if (goodStart){
	var imageData = customBoard.getImg();
	
	var newCanvas = $("<canvas>")
	    .attr("width", imageData.width)
	    .attr("height", imageData.height)[0];
	
	newCanvas.getContext("2d").putImageData(imageData, 0, 0);
	tinyCtx.drawImage(newCanvas, 0, 0);
	getNNOutput();
    }
}

function updateCubes() {
    var r, g, b, id;
    var numChildren = scene.children.length;
    for ( var i = 0; i<numChildren; i++) {
	if ( scene.children[i].name == 'cubes' ){
	    var object = scene.children[i];
	    
	    var geometry = object.geometry;
	    var faceCount = 0;						
	    geometry.faces.forEach( function( f ) {
		faceCount++;
		if (faceCount % 12 == 1) {								
		    id = math.floor(faceCount/12);
		    if (isComputed){									
			var v = allNodeOutputs[id];
			var colorNum = math.round(v*99);
			r = redLookup[colorNum];
			g = greenLookup[colorNum];
			b = blueLookup[colorNum];
		    } else {
			r=0; g=0; b=0;
		    }
		    color = new THREE.Color();
		    color.setRGB( r,g,b )
		}
		var n = ( f instanceof THREE.Face3 ) ? 3 : 4;
		for( var j = 0; j < n; j ++ ) {
		    f.vertexColors[ j ] = color;
		}
	    });
	    geometry.colorsNeedUpdate = true;
	    geometry.verticesNeedUpdate = true;
	}
    }
}
function drawEdges() {
    //console.log('draw edges');
    var lineMat = new THREE.LineBasicMaterial({
	color: 0x0000ff,
	transparent:true, 
	linewidth: 2
    });
    var lineGeom = new THREE.Geometry();
    lineGeom.dynamic = true;
    var line = new THREE.Line(lineGeom, lineMat);
    line.name = 'edges';
    scene.add(line);
}


