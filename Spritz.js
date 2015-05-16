/**
 * Spritz
 * https://github.com/DanZiti/Spritz
 * 
 * Generates sprite sheets from Photoshop layers
 * 
 * Copyright (c) 2015 Dan Zervoudakes
 * Released under the MIT license
 * https://github.com/DanZiti/Spritz/blob/master/LICENSE
 * 
 * NOTE: This script only exports simple sprite sheets and does not provide the
 * coordinates of each element within the sprite. To find specific sprite coordinates
 * for use within your style sheets, I kindly suggest www.spritecow.com - it's just awesome.
 */
	
	// The end result of this script will be a png image exported in the user's Desktop directory...
	//
	var initialDoc = app.activeDocument;
	var spriteGroup = app.activeDocument.layerSets.getByName("SPRITE").layers;
	var saveFile = new File("~/Desktop/SPRITE.png");
	var exportPNG = new PNGSaveOptions();
		exportPNG.compression = 9;
		exportPNG.interlaced = false;
	
	var historyState = 0;
	
	// Export SPRITE.png in the user's desktop directory...
	//
	function exportSprite() {
		app.activeDocument.saveAs(saveFile, exportPNG, true);
		app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
	};
	
	// History rollback function...
	//
	function revertHistory() {
		
		app.activeDocument = initialDoc;
		
		var latestHistory = app.activeDocument.historyStates.length;
		var revertTo = latestHistory - (historyState + 1);
		
		app.activeDocument.activeHistoryState = app.activeDocument.historyStates[revertTo];
		app.activeDocument.save();
	};
	
	// Collect all groups designated with the "SPRITE" label...
	//
	function buildSprite() {
		
		// Create a new document called "SPRITE": collected sprite layers will be duplicated here...
		//
		var newDoc = app.documents.add(UnitValue(800, "px"), UnitValue(600, "px"), 72, "SPRITE", NewDocumentMode.RGB, DocumentFill.TRANSPARENT);
		var layers = [];
		var translateLeft = false;
		var newDocHeight = 0;
		
		// Add each sprite layer to the array
		//
		for (var i = 0; i < spriteGroup.length; i++) {
			layers.push(spriteGroup[i]);
		}
		
		// Loop through the sprite layer array and duplicate each in the new document...
		//
		for (var j = 0; j < layers.length; j++) {
			
			historyState++;
			
			app.activeDocument = initialDoc;
			app.activeLayer = layers[j];
			
			// Only the first layer is pushed to the top-left of the new document, the rest fall in line behind it
			//
			if (!translateLeft) {
				app.activeLayer.translate(-app.activeLayer.bounds[0], -app.activeLayer.bounds[1]);
				translateLeft = true;
			}
			
			else {
				app.activeLayer.translate(-app.activeLayer.bounds[0] + layers[j - 1].bounds[2], -app.activeLayer.bounds[1]);
			}
			
			var newLayer = app.activeLayer.duplicate(newDoc, ElementPlacement.PLACEATEND);
		}
		
		app.activeDocument = documents[documents.length - 1]; // newDoc created above
		
		// Resize canvas to only cover the width/height necessary for the sprite
		//
		for (var k = 0; k < layers.length; k++) {
			if (layers[k].bounds[3] > newDocHeight) {
				newDocHeight = layers[k].bounds[3];
			}
		}
		
		app.activeDocument.resizeCanvas(layers[layers.length - 1].bounds[2], newDocHeight, AnchorPosition.TOPLEFT);
		
		// Ensure the end result is an even width and height value for retina/double-resolution displays
		//
		var widthAdjust = (app.activeDocument.width.value % 2 === 0) ? 0 : 1;
		var heightAdjust = (app.activeDocument.height.value % 2 === 0) ? 0 : 1;
		
		if (widthAdjust === 1 || heightAdjust === 1) {
			app.activeDocument.resizeCanvas(app.activeDocument.width + widthAdjust, app.activeDocument.height + heightAdjust, AnchorPosition.TOPLEFT);
		}
		
		// Export, then revert history states
		//
		exportSprite();
		revertHistory();
	};
	
	// Do stuff!
	//
	buildSprite();
