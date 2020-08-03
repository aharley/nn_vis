function setupWeightArrays() {
	var maxWeight, minWeight;
	var i, j, k, l;
	
	
	conv_weights_1a = [];
	for (i=0;i<nConvFilters_1;i++) {
		conv_weights_1a[i] = Create2DArray(filterSize_1,filterSize_1);
		for (j=0;j<filterSize_1;j++) {
			for (k=0;k<filterSize_1;k++) {
				conv_weights_1a[i][j][k] = conv_nodes[0][i].e(j+1,k+1);
			}
		}
	}
	for (i=0;i<nConvFilters_1;i++) {
		maxWeight = -100;
		minWeight = 100;
		for (k=0;k<filterSize_1;k++) {
			for (l=0;l<filterSize_1;l++) {
				var weight = conv_weights_1a[i][k][l];					
				if (weight < minWeight)
					minWeight = weight;
				else if (weight > maxWeight)
					maxWeight = weight;
			}
		}
		
		for (k=0;k<filterSize_1;k++) {
			for (l=0;l<filterSize_1;l++) {
				var weight = conv_weights_1a[i][k][l];
				weight = (weight - minWeight)/(maxWeight-minWeight);
				conv_weights_1a[i][k][l] = weight;					
			}
		}
	}
	
	
	nKeepers = [];
	for (i=0; i<nConvFilters_2; i++){
		nKeepers[i] = 0;
		for (j=0; j<nConvFilters_1; j++) {
			nKeepers[i] = nKeepers[i] + keepers.e(j+1,i+1);
		}
		//console.log('keepers = ' + nKeepers[i]);
	}
	
	keeperIndices = Create2DArray(nConvFilters_2,nConvFilters_1);
	for (i=0; i<nConvFilters_2; i++){
		var keeperCount = 0;
		for (j=0; j<nConvFilters_1; j++) {
			keeperIndices[i][j] = keeperCount;		
			//console.log('keeperIndices[' + i + '][' + j + ']  = ' + keeperIndices[i][j]);			
			if (keepers.e(j+1,i+1)) {
				keeperCount++;				
			}
		}		
	}
	
	
	conv_weights_2a = [];
	for (i=0;i<nConvFilters_2;i++) {
		conv_weights_2a[i] = [];
	}
	for (i=0;i<nConvFilters_2;i++) {
		var keeperCount = 0;
		for (l=0;l<nConvFilters_1;l++) {
			if (keepers.e(l+1,i+1)) {
				conv_weights_2a[i][l] = Create2DArray(filterSize_1,filterSize_1);
				for (j=0;j<filterSize_1;j++) {
					for (k=0;k<filterSize_1;k++) {
						conv_weights_2a[i][l][j][k] = conv_nodes[1][i][keeperCount].e(j+1,k+1);
					}
				}
				keeperCount++;
			}
		}
	}
	for (i=0;i<nConvFilters_2;i++) {
		for (l=0;l<nConvFilters_1;l++) {
			if (keepers.e(l+1,i+1)) {
				maxWeight = -100;
				minWeight = 100;
				for (j=0;j<filterSize_1;j++) {
					for (k=0;k<filterSize_1;k++) {
						var weight = conv_weights_2a[i][l][j][k];
						if (weight < minWeight)
							minWeight = weight;
						else if (weight > maxWeight)
							maxWeight = weight;
					}
				}
			
				for (j=0;j<filterSize_1;j++) {
					for (k=0;k<filterSize_1;k++) {
						var weight = conv_weights_2a[i][l][j][k];
						weight = (weight - minWeight)/(maxWeight-minWeight);
						conv_weights_2a[i][l][j][k] = weight;
					}
				}
			}
			
		}
	}
	
	
	hidden_weights_1a = Create2DArray(nHiddenNodes_1,nPixels);
	maxWeight = -100;
	minWeight = 100;
	for (i=1; i<=nHiddenNodes_1; i++){
		for (j=1; j<=nConvNodes_2_down; j++){
			var weight = hidden_weights_1.e(i,j);
			if (weight > maxWeight)
				maxWeight = weight;
			if (weight < minWeight)
				minWeight = weight;
		}
	}
	for (i=1; i<=nHiddenNodes_1; i++){
		for (j=1; j<=nConvNodes_2_down; j++){
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
	var i, j, m, n, k, f;
	imageData = tinyCtx.getImageData(0, 0, 28, 28);
	
	var data = imageData.data;
	
	for (i=0; i<nNodes; i++) {
		allNodeInputs[i] = 0;
		allNodeOutputs[i] = 0;
		allNodeNums[i] = i+1;
		allNodeOutputsRaw[i] = 0;
	}
	
	var pixel = 0;
	input = new Array(nPixels);
	raw_input = new Array(nPixels);
	
	for(i = 0, n = data.length; i < n; i += 4) {
		if (goodStart){
			if (data[i]) {
			  input[pixel] = ((data[i]/255)*1.275)-0.1;// * 1.175;
			    raw_input[pixel] = data[i];
			}
			else {
			  input[pixel] = -0.1;
			    raw_input[pixel] = 0;
			}
		} else {
			input[pixel] = 0;
		    raw_input[pixel] = 0;
		}
		pixel++;
	}
	allZeroes = false;
	
	input32 = reshapeAndPadArray(input); // this is how matlab likes it.
	input32transpose = reshapeArray(input32); // this is how java likes it.

	data32 = reshapeAndPadArray(raw_input); // this is how matlab likes it.
	data32transpose = reshapeArray(data32); // this is how java likes it.
    
	for (i=0; i<nPixels; i++) {
		allNodeInputs[i] = data32transpose[i];
		allNodeOutputs[i] = input32transpose[i];
		allNodeNums[i] = i+1;
	}
		
	var image = reshapeToMat(input32);
	
	var convLayer = 0;
	var inputImageSize = 32;
	
	var halfFilter = math.floor(filterSize_1/2);
	var count = nPixels;
	
	var featMapArray_1 = [];
	var outputImageSize = inputImageSize - halfFilter;
	for (f=0; f<nConvFilters_1; f++) {
		var outputImage = Create2DArray(outputImageSize,outputImageSize);
		featMapArray_1[f] = Create2DArray(outputImageSize,outputImageSize);
		for (i=halfFilter; i<inputImageSize-halfFilter; i++) {
			for (j=halfFilter; j<inputImageSize-halfFilter; j++) {
				outputImage[i][j] = 0;
				for (m=-halfFilter; m<=halfFilter; m++) {
					for (n=-halfFilter; n<=halfFilter; n++) {
						outputImage[i][j] = outputImage[i][j] + image[i+m][j+n] * conv_nodes[convLayer][f].e(m+halfFilter+1,n+halfFilter+1);
					}
				}				
				var convOut = outputImage[i][j];
				featMapArray_1[f][i][j] = sigma(convOut + conv_biases_1.e(f+1));
   			        allNodeInputs[count] = convOut + conv_biases_1.e(f+1);
				allNodeOutputs[count] = sigma(convOut + conv_biases_1.e(f+1));
				allNodeOutputsRaw[count] = sigma(convOut + conv_biases_1.e(f+1));
				allNodeNums[count] = count-nPixels-28*28*f+1;
				count++;
			}
		}
	}
	//console.log('got count = ' + count); // 1024 + 28*28*6 = 5728	
	
	var downMapSize = (outputImageSize-halfFilter)/2;
	var downMaps_1 = [];
	for (f=0; f<nConvFilters_1; f++) {
		downMaps_1[f] = maxPool(featMapArray_1[f], 2, outputImageSize);
		for (i=0;i<downMapSize;i++){
			for (j=0;j<downMapSize;j++){
				var outputHere = downMaps_1[f][i][j];
				allNodeInputs[count] = outputHere; 
				allNodeOutputs[count] = outputHere;
				allNodeOutputsRaw[count] = outputHere;
				allNodeNums[count] = count-nPixels-nConvNodes_1-14*14*f+1;
				count++
			}
		}
	}
	//console.log('got count = ' + count); // 1024 + 28*28*6 + 14*14*6 = 6904
	
	var featMapArray_2 = [];
	convLayer = 1;
	halfFilter = math.floor(filterSize_2/2);
	inputImageSize = downMapSize;
	outputImageSize = inputImageSize - halfFilter;
	for (f=0; f<nConvFilters_2; f++) {
		var outputImage = Create2DArray(outputImageSize,outputImageSize);
		featMapArray_2[f] = Create2DArray(outputImageSize,outputImageSize);
		for (i=halfFilter; i<inputImageSize-halfFilter; i++) {
			for (j=halfFilter; j<inputImageSize-halfFilter; j++) {
				var convOut = 0;
				var keeperCount = 0;
				for (k=0; k<nConvFilters_1; k++) {
					if (keepers.e(k+1,f+1)){
						image = downMaps_1[k];
						outputImage[i][j] = 0;
						for (m=-halfFilter; m<=halfFilter; m++) {
							for (n=-halfFilter; n<=halfFilter; n++) {								
								outputImage[i][j] = outputImage[i][j] + image[i+m][j+n] * conv_nodes[convLayer][f][keeperCount].e(m+halfFilter+1,n+halfFilter+1);
							}
						}
						convOut = convOut + outputImage[i][j];
						keeperCount++;
					}
				}
				featMapArray_2[f][i][j] = sigma(convOut + conv_biases_2.e(f+1));
			        allNodeInputs[count] = convOut + conv_biases_2.e(f+1);
				allNodeOutputs[count] = sigma(convOut + conv_biases_2.e(f+1));
				allNodeOutputsRaw[count] = sigma(convOut + conv_biases_2.e(f+1));
				allNodeNums[count] = count-nPixels-nConvNodes_1-nConvNodes_1_down-10*10*f+1;				
				count++;
			}
		}
	}
	//console.log('got count = ' + count); // 1024 + 28*28*6 + 14*14*6 + 10*10*16 = 8504
	
	downMapSize = (outputImageSize-halfFilter)/2;
	downMaps_2 = [];
	var inputArray = [];
	for (f=0; f<nConvFilters_2; f++) {
		downMaps_2[f] = maxPool(featMapArray_2[f], 2, outputImageSize);
		for (i=0;i<downMapSize;i++){
			for (j=0;j<downMapSize;j++){
				var outputHere = downMaps_2[f][i][j];
				allNodeInputs[count] = outputHere; 
				allNodeOutputs[count] = outputHere;
				allNodeOutputsRaw[count] = outputHere;
				allNodeNums[count] = count-nPixels-nConvNodes_1-nConvNodes_1_down-nConvNodes_2-5*5*f+1;
				inputArray[count-nPixels-nConvNodes_1-nConvNodes_1_down-nConvNodes_2] = downMaps_2[f][j][i];
				count++
			}
		}
	}
	//console.log('got count = ' + count); // 1024 + 28*28*6 + 14*14*6 + 10*10*16 + 5*5*16 = 8904
	var fcCountStart = count;
	var inp = Vector.create(inputArray);
	
	var hidden_outputs_1 = Vector.Zero(nHiddenNodes_1);
	var hidden_outputs_1a = new Array(nHiddenNodes_1);
	var hidden_outputs_2 = Vector.Zero(nHiddenNodes_2);
	var hidden_outputs_2a = new Array(nHiddenNodes_2);
	var final_outputsa = new Array(nFinalNodes);
	
	for (i=1; i<=nHiddenNodes_1; i++){
	  if (!allZeroes){
		  var weights = hidden_weights_1.row(i);		  
		  var sum = inp.dot(weights);
		  sum += hidden_biases_1.e(i);
		  hidden_outputs_1a[i-1] = sigma(sum);
		  allNodeInputs[fcCountStart+i-1] = sum;
		  allNodeOutputs[fcCountStart+i-1]=hidden_outputs_1a[i-1];
	  } else {
		  hidden_outputs_1a[i-1] = 0;
		  allNodeInputs[fcCountStart+i-1] = 0;
		  allNodeOutputs[fcCountStart+i-1]= 0;
	  }
	  allNodeNums[fcCountStart+i-1] = i;
	}
	hidden_outputs_1.setElements(hidden_outputs_1a);
	
	for (i=1; i<=nHiddenNodes_2; i++){
	  if (!allZeroes){
		  var weights = hidden_weights_2.row(i);				  
		  var sum = hidden_outputs_1.dot(weights);
		  sum += hidden_biases_2.e(i);
		  hidden_outputs_2a[i-1] = sigma(sum);
		  allNodeInputs[fcCountStart+nHiddenNodes_1+i-1]=sum;
		  allNodeOutputs[fcCountStart+nHiddenNodes_1+i-1]=hidden_outputs_2a[i-1];
		  
	  } else {
		  hidden_outputs_2a[i-1] = 0;
		  allNodeInputs[fcCountStart+nHiddenNodes_1+i-1]=0;
		  allNodeOutputs[fcCountStart+nHiddenNodes_1+i-1]=0;
	  }
	  allNodeNums[fcCountStart+nHiddenNodes_1+i-1] = i;
	}
	hidden_outputs_2.setElements(hidden_outputs_2a);
	
	var sums = final_weights.x(hidden_outputs_2);
	var newSums = sums.add(final_biases);
	
	for (i=1; i<=nFinalNodes; i++){
	  if (!allZeroes){
		final_outputsa[i-1] = sigma(newSums.e(i));
		allNodeInputs[fcCountStart+nHiddenNodes_1+nHiddenNodes_2+i-1]=newSums.e(i);
		allNodeOutputs[fcCountStart+nHiddenNodes_1+nHiddenNodes_2+i-1]=final_outputsa[i-1];
	  } else {
		final_outputsa[i-1] = 0;
		allNodeInputs[fcCountStart+nHiddenNodes_1+nHiddenNodes_2+i-1]=0;
		allNodeOutputs[fcCountStart+nHiddenNodes_1+nHiddenNodes_2+i-1]=0;
	  }
		allNodeNums[fcCountStart+nHiddenNodes_1+nHiddenNodes_2+i-1] = i;
	}
	
	allNodeOutputsRaw = allNodeOutputs.slice();
	normalizeWithinLayer(allNodeOutputs);
	
	if (!allZeroes){
		ind1 = maxInd(final_outputsa);
		finalOutputID = fcCountStart+nHiddenNodes_1+nHiddenNodes_2+i-1 + ind1 - 10;
		final_outputsa[ind] = -10;
		ind2 = maxInd(final_outputsa);
		document.getElementById("ans1").innerHTML = ind1;
		document.getElementById("ans2").innerHTML = ind2;
	} else {
		document.getElementById("ans1").innerHTML = "";
		document.getElementById("ans2").innerHTML = "";
	}
	
	isComputed = true;

	updateCubes();
	updateEdges();
	
	imageData.data = null;
	imageData = null;	
};

function sigma(x) {
	return 1.7159*math.tanh(0.666667*x);
}

function reshapeAndPadArray(arr){
	// The input array walks along pixels ltr ltr ltr.
	// For proper input, we need it to walk ttb ttb ttb.
	var arr2 = new Array(1024);
	for (count = 0; count < 1024; count++){
		if (goodStart) {
			arr2[count] = -0.1;
		} else {
			arr2[count] = 0;
		}
	}
	for (count = 0; count < 784; count++){
		var row = math.floor(count/28)+2;
		var col = (count)%28+2;
		var newInd = col*32 + row;
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
	var i,j;
	var len = arr.length;

	var minPixel = 100;
	var minHidden1 = 100;
	var minHidden2 = 100;
	var minFinal = 100;
	
	var maxPixel = -100;
	var minConv1 = [100, 100, 100, 100, 100, 100];
	var minConv2 = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100];
	var maxConv1 = [-100, -100, -100, -100, -100, -100];
	var maxConv2 = [-100, -100, -100, -100, -100, -100, -100, -100, -100, -100, -100, -100, -100, -100, -100, -100];
	var minConv1_down = [100, 100, 100, 100, 100, 100];
	var minConv2_down = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100];
	var maxConv1_down = [-100, -100, -100, -100, -100, -100];
	var maxConv2_down = [-100, -100, -100, -100, -100, -100, -100, -100, -100, -100, -100, -100, -100, -100, -100, -100];
	var maxHidden1 = -100;
	var maxHidden2 = -100;
	var maxFinal = -100;
	for (i=0;i<len;i++){
		if (i<nPixels) {
			if (arr[i]>maxPixel)
				maxPixel = arr[i];
			else if (arr[i]<minPixel)
				minPixel = arr[i];
		} else if (i < nPixels+nConvNodes_1) {
			for (j=1; j<=nConvFilters_1; j++) {
				if(i>=nPixels+28*28*(j-1) && i<nPixels+28*28*j) {
					if (arr[i]>maxConv1[j-1])
						maxConv1[j-1] = arr[i];					
					else if (arr[i]<minConv1[j-1])
						minConv1[j-1] = arr[i];					
				}
			}
		} else if (i < nPixels+nConvNodes_1+nConvNodes_1_down) {
			for (j=1; j<=nConvFilters_1; j++) {
				if(i>=nPixels+nConvNodes_1+14*14*(j-1) && i<nPixels+nConvNodes_1+14*14*j) {
					if (arr[i]>maxConv1_down[j-1])
						maxConv1_down[j-1] = arr[i];					
					else if (arr[i]<minConv1_down[j-1])
						minConv1_down[j-1] = arr[i];					
				}
			}
		} else if (i < nPixels+nConvNodes_1+nConvNodes_1_down+nConvNodes_2) {
			for (j=1; j<=nConvFilters_2; j++) {
				if(i>=nPixels+nConvNodes_1+nConvNodes_1_down+10*10*(j-1) && i<nPixels+nConvNodes_1+nConvNodes_1_down+10*10*j) {
					if (arr[i]>maxConv2[j-1])
						maxConv2[j-1] = arr[i];					
					else if (arr[i]<minConv2[j-1])
						minConv2[j-1] = arr[i];					
				}
			}
		} else if (i < nPixels+nConvNodes_1+nConvNodes_1_down+nConvNodes_2+nConvNodes_2_down+nHiddenNodes_1) {
			if (arr[i]>maxHidden1)
				maxHidden1 = arr[i];
			else if (arr[i]<minHidden1)
				minHidden1 = arr[i];
		} else if (i < nPixels+nConvNodes_1+nConvNodes_1_down+nConvNodes_2+nConvNodes_2_down+nHiddenNodes_1+nHiddenNodes_2) {
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
		for (i=0;i<len;i++){
			arr[i] = 0;					
		}
	} else {
		allZeroes = false;
		for (i=0;i<len;i++){
			if (i<nPixels) {
				arr[i] = (arr[i] - minPixel)/(maxPixel-minPixel);
			} else if (i < nPixels+nConvNodes_1) {
				for (j=1; j<=nConvFilters_1; j++) {
					if(i>=nPixels+28*28*(j-1) && i<nPixels+28*28*j) {
						arr[i] = (arr[i] - minConv1[j-1])/(maxConv1[j-1]-minConv1[j-1]);
					}
				}
			} else if (i < nPixels+nConvNodes_1+nConvNodes_1_down) {
				for (j=1; j<=nConvFilters_1; j++) {
					if(i>=nPixels+nConvNodes_1+14*14*(j-1) && i<nPixels+nConvNodes_1+14*14*j) {
						arr[i] = (arr[i] - minConv1_down[j-1])/(maxConv1_down[j-1]-minConv1_down[j-1]);
					}
				}
			} else if (i < nPixels+nConvNodes_1+nConvNodes_1_down+nConvNodes_2) {
				for (j=1; j<=nConvFilters_2; j++) {
					if(i>=nPixels+nConvNodes_1+nConvNodes_1_down+10*10*(j-1) && i<nPixels+nConvNodes_1+nConvNodes_1_down+10*10*j) {
						arr[i] = (arr[i] - minConv2[j-1])/(maxConv2[j-1]-minConv2[j-1]);
					}
				}
			} else if (i < nPixels+nConvNodes_1+nConvNodes_1_down+nConvNodes_2+nConvNodes_2_down+nHiddenNodes_1) {
				arr[i] = (arr[i] - minHidden1)/(maxHidden1-minHidden1);
			} else if (i < nPixels+nConvNodes_1+nConvNodes_1_down+nConvNodes_2+nConvNodes_2_down+nHiddenNodes_1+nHiddenNodes_2) {
				arr[i] = (arr[i] - minHidden2)/(maxHidden2-minHidden2);
			} else {
				arr[i] = (arr[i] - minFinal)/(maxFinal-minFinal);
			}
		}
	}
}

function reshapeToMat(vectIm){
	var newIm = Create2DArray(32,32);
	for (count = 0; count < 1024; count++){
		var row = (count % 32);   
		var col = math.floor(count/32);
		newIm[row][col] = vectIm[count];
	}
	return newIm;
}

function reshapeArray(arr){
	// The input array walks along pixels ltr ltr ltr.
	// For proper input, we need it to walk ttb ttb ttb.
	var arrayLength = arr.length;
	var arr2 = new Array(1024);
	for (count = 0; count < 1024; count++){
		if (goodStart) {
			arr2[count] = -0.1;
		} else {
			arr2[count] = 0;
		}
	}
	for (count = 0; count < 1024; count++){
		var row = math.floor(count/32);
		var col = (count)%32;
		var newInd = col*32 + row;
		arr2[newInd] = arr[count];
	}
	return arr2;
}


function Create2DArray(rows,columns) {
   var x = new Array(rows);
   for (var i = 0; i < rows; i++) {
       x[i] = new Array(columns);
   }
   return x;
}

function maxPool(inputMap, poolSize, inputImageSize) {
	
	// for the first layer at least, the input image is padded by 2 rows and 2 cols
	var i,j,m,n;
	var stride = poolSize;
	var downMapSize = inputImageSize/poolSize;
	var downMap = Create2DArray(downMapSize,downMapSize);
	var prevHalfFilter = 2;
	var halfFilter = poolSize/2;
	var pixCount = 0;
	var downi=0, downj=0;
	for (i=prevHalfFilter; i<=inputImageSize-prevHalfFilter; i+=stride) {
		downj = 0;
		for (j=prevHalfFilter; j<=inputImageSize-prevHalfFilter; j+=stride) {
			var max = -100;
			for (m=0; m<poolSize; m++) {
					for (n=0; n<poolSize; n++) {
						var temp = inputMap[i+m][j+n];
						if (temp > max)
							max = temp;
					}
			}
			downMap[downi][downj] = max;
			pixCount++;
			downj++;
		}
		downi++;
	}
	return downMap;
	
}
