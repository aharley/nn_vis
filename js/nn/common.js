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

