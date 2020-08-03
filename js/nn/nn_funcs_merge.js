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

function setupWeightArrays() {
    var maxWeight, minWeight;
    //console.log('doing setupWeightarrays');
    var i, j;
    hidden_weights_1a = Create2DArray(nHiddenNodes_1,nPixels);
    maxWeight = -100;
    minWeight = 100;
    for (i=1; i<=nHiddenNodes_1; i++){
	for (j=1; j<=nPixels; j++){
	    var weight = hidden_weights_1.e(i,j);
	    if (weight > maxWeight)
		maxWeight = weight;
	    if (weight < minWeight)
		minWeight = weight;
	}
    }
    for (i=1; i<=nHiddenNodes_1; i++){
	for (j=1; j<=nPixels; j++){
	    var weight = hidden_weights_1.e(i,j);
	    hidden_weights_1a[i-1][j-1] = (weight - minWeight)/(maxWeight-minWeight);
	}
    }
    
    hidden_weights_2a = Create2DArray(nHiddenNodes_2,nHiddenNodes_1);
    maxWeight = -100;
    minWeight = 100;
    for (i=1; i<=nHiddenNodes_2; i++){
	for (j=1; j<=nHiddenNodes_1; j++){
	    var weight = hidden_weights_2.e(i,j);
	    if (weight > maxWeight)
		maxWeight = weight;
	    if (weight < minWeight)
		minWeight = weight;
	}
    }
    for (i=1; i<=nHiddenNodes_2; i++){
	for (j=1; j<=nHiddenNodes_1; j++){
	    var weight = hidden_weights_2.e(i,j);
	    hidden_weights_2a[i-1][j-1] = (weight - minWeight)/(maxWeight-minWeight);
	}
    }
    
    final_weightsa = Create2DArray(nFinalNodes,nHiddenNodes_2);
    maxWeight = -100;
    minWeight = 100;
    for (i=1; i<=nFinalNodes; i++){
	for (j=1; j<=nHiddenNodes_2; j++){
	    var weight = final_weights.e(i,j);
	    if (weight > maxWeight)
		maxWeight = weight;
	    if (weight < minWeight)
		minWeight = weight;
	}
    }
    for (i=1; i<=nFinalNodes; i++){
	for (j=1; j<=nHiddenNodes_2; j++){
	    var weight = final_weights.e(i,j);
	    final_weightsa[i-1][j-1] = (weight - minWeight)/(maxWeight-minWeight);
	}
    }
    
}


function getNNOutput() {
    //console.log('getting nn output');
    var imageData = tinyCtx.getImageData(0, 0, 28, 28);
    
    var data = imageData.data;
    
    var pixel = 0;
    var input = new Array(nPixels);
    
    for(var i = 0, n = data.length; i < n; i += 4) {
	if (goodStart){
	    if (data[i]) {
		input[pixel] = ((data[i]/255)*1.275)-0.1;// * 1.175;
	    }
	    else {
		input[pixel] = -0.1;
	    }
	} else {
	    input[pixel] = 0;
	}
	allNodeInputs[pixel] = data[i]
	allNodeOutputs[pixel] = input[pixel];
	allNodeNums[pixel] = pixel+1;
	pixel++;
    }
    for (var i = 0; i < nPixels; i++) {
	if (input[i] == 0 || input[i] == -0.1) {
	    allZeroes = true;
	} else { 
	    //console.log('found ' + input[i]);
	    allZeroes = false;
	    break;
	}
    }
    
    //console.log(input.length);
    var input32 = reshapeArray(input);
    //console.log(input32.length);
    var inp = Vector.create(input32);
    //console.log(inp.inspect());
    var hidden_outputs_1 = Vector.Zero(nHiddenNodes_1);
    var hidden_outputs_1a = new Array(nHiddenNodes_1);
    var hidden_outputs_2 = Vector.Zero(nHiddenNodes_2);
    var hidden_outputs_2a = new Array(nHiddenNodes_2);
    var final_outputsa = new Array(nFinalNodes);
    
    //console.log('there are ' + nHiddenNodes_1 + ' hidden nodes');
    for (var i=1; i<=nHiddenNodes_1; i++){
	if (!allZeroes){
	    var weights = hidden_weights_1.row(i);		  
	    var sum = inp.dot(weights);
	    
	    //console.log('sum for node ' + i + ' = ' + sum);
	    sum += hidden_biases_1.e(i);
	    hidden_outputs_1a[i-1] = sigma(sum);
	    allNodeInputs[nPixels+i-1] = sum;
	    allNodeOutputs[nPixels+i-1]=hidden_outputs_1a[i-1];
	    //console.log('output for node ' + i + ' = ' + hidden_outputs_1a[i-1]);
	} else {
	    hidden_outputs_1a[i-1] = 0;
	    allNodeInputs[nPixels+i-1] = 0;
	    allNodeOutputs[nPixels+i-1]= 0;
	}
	allNodeNums[nPixels+i-1] = i;
    }
    hidden_outputs_1.setElements(hidden_outputs_1a);
    
    for (i=1; i<=nHiddenNodes_2; i++){
	if (!allZeroes){
	    var weights = hidden_weights_2.row(i);				  
	    var sum = hidden_outputs_1.dot(weights);
	    sum += hidden_biases_2.e(i);
	    hidden_outputs_2a[i-1] = sigma(sum);
	    allNodeInputs[nPixels+nHiddenNodes_1+i-1]=sum;
	    allNodeOutputs[nPixels+nHiddenNodes_1+i-1]=hidden_outputs_2a[i-1];
	    
	} else {
	    hidden_outputs_2a[i-1] = 0;
	    allNodeInputs[nPixels+nHiddenNodes_1+i-1]=0;
	    allNodeOutputs[nPixels+nHiddenNodes_1+i-1]=0;
	}
	allNodeNums[nPixels+nHiddenNodes_1+i-1] = i;
    }
    hidden_outputs_2.setElements(hidden_outputs_2a);
    
    var sums = final_weights.x(hidden_outputs_2);
    var newSums = sums.add(final_biases);
    
    for (i=1; i<=nFinalNodes; i++){
	if (!allZeroes){
	    final_outputsa[i-1] = sigma(newSums.e(i));
	    allNodeInputs[nPixels+nHiddenNodes_1+nHiddenNodes_2+i-1]=newSums.e(i);
	    allNodeOutputs[nPixels+nHiddenNodes_1+nHiddenNodes_2+i-1]=final_outputsa[i-1];
	} else {
	    final_outputsa[i-1] = 0;
	    allNodeInputs[nPixels+nHiddenNodes_1+nHiddenNodes_2+i-1]=0;
	    allNodeOutputs[nPixels+nHiddenNodes_1+nHiddenNodes_2+i-1]=0;
	}
	allNodeNums[nPixels+nHiddenNodes_1+nHiddenNodes_2+i-1] = i;
    }
    
    allNodeOutputsRaw = allNodeOutputs.slice();
    normalizeWithinLayer(allNodeOutputs);
    
    if (!allZeroes){
	var ind1 = maxInd(final_outputsa);
	finalOutputID = nPixels+nHiddenNodes_1+nHiddenNodes_2+i-1 + ind1 - 10;
	final_outputsa[ind] = -10;
	var ind2 = maxInd(final_outputsa);
	document.getElementById("ans1").innerHTML = ind1;
	document.getElementById("ans2").innerHTML = ind2;
    } else {
	document.getElementById("ans1").innerHTML = "";
	document.getElementById("ans2").innerHTML = "";
    }
    
    isComputed = true;
    
    
    //console.log('officially, output for node 1134 = ' + allNodeOutputsRaw[1134] + ", normalized to " + allNodeOutputs[1134]);
    
    updateCubes();
    //updateEdges();
    
    //console.log(imageData);
    imageData.data = null;
    imageData = null;
    //console.log(imageData);
};

function sigma(x) {
    return 1.7159*math.tanh(0.666667*x);
}
function reshapeArray(arr){
    // The input array walks along pixels ltr ltr ltr.
    // For proper input, we need it to walk ttb ttb ttb.
    var arr2 = new Array(784);
    for (count = 0; count < 784; count++){
	if (goodStart) {
	    arr2[count] = -0.1;
	} else {
	    arr2[count] = 0;
	}
    }
    for (count = 0; count < 784; count++){
	var row = math.floor(count/28);
	var col = (count)%28;
	var newInd = col*28 + row;
	arr2[newInd] = arr[count];
    }
    return arr2;
}
function maxInd(arr) {
    ind = 0;
    val = arr[0];
    for (i=1; i<arr.length; i++){
	if (arr[i]>val){
	    ind = i;
	    val = arr[i];
	}				
    }
    return ind;
}
function normalizeWithinLayer(arr) {
    var len = arr.length;

    var minPixel = 100;
    var minHidden1 = 100;
    var minHidden2 = 100;
    var minFinal = 100;
    
    var maxPixel = -100;
    var maxHidden1 = -100;
    var maxHidden2 = -100;
    var maxFinal = -100;
    for (var i=0;i<len;i++){
	if (i<nPixels) {
	    if (arr[i]>maxPixel)
		maxPixel = arr[i];
	    else if (arr[i]<minPixel)
		minPixel = arr[i];
	} else if (i < nPixels+nHiddenNodes_1) {
	    if (arr[i]>maxHidden1)
		maxHidden1 = arr[i];
	    else if (arr[i]<minHidden1)
		minHidden1 = arr[i];
	} else if (i < nPixels+nHiddenNodes_1+nHiddenNodes_2) {
	    if (arr[i]>maxHidden2)
		maxHidden2 = arr[i];
	    else if (arr[i]<minHidden2)
		minHidden2 = arr[i];
	} else {
	    if (arr[i]>maxFinal)
		maxFinal = arr[i];
	    else if (arr[i]<minFinal)
		minFinal = arr[i];
	}
    }
    if (minPixel==maxPixel){					
	allZeroes = true;
	for (var i=0;i<len;i++){
	    arr[i] = 0;					
	}
    } else {
	allZeroes = false;
	for (var i=0;i<len;i++){
	    if (i<nPixels) {
		arr[i] = (arr[i] - minPixel)/(maxPixel-minPixel);
	    } else if (i < nPixels+nHiddenNodes_1) {
		arr[i] = (arr[i] - minHidden1)/(maxHidden1-minHidden1);
	    } else if (i < nPixels+nHiddenNodes_1+nHiddenNodes_2) {
		arr[i] = (arr[i] - minHidden2)/(maxHidden2-minHidden2);
	    } else {
		arr[i] = (arr[i] - minFinal)/(maxFinal-minFinal);
	    }
	}
    }
}


function Create2DArray(rows,columns) {
    var x = new Array(rows);
    for (var i = 0; i < rows; i++) {
	x[i] = new Array(columns);
    }
    return x;
}
