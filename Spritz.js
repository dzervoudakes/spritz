/**
 * Spritz
 * https://github.com/DanZiti/Spritz
 * 
 * Generates sprite sheets from Photoshop groups/layers
 * 
 * Copyright (c) 2015 Dan Zervoudakes
 * Released under the MIT license
 * https://github.com/DanZiti/Spritz/blob/master/LICENSE
 *
 * WIP:
 * -Currently working on placement on newly duplicated layers in newDoc (first layer is correct, all the rest... not to much...)
 * -newDoc size must be dynamically generated, not hard-coded (and must export with even width and height values for retina)
 * -Must find a better way to shift between the documents (rather than specifying documents[0] and documents[1], try something with indexOf())
 * -If possible, export x/y coordinates of each SPRITE layer in a XML file - will be worked on at the tail-end
 */
	
	// The end result of this script will be a PNG image exported in the user's Desktop directory...
	//
	var spriteGroup = app.activeDocument.layerSets.getByName("SPRITE").layers;
	var saveFile = new File("~/Desktop/SPRITE.png");
	var exportPNG = new PNGSaveOptions();
		exportPNG.compression = 9;
		exportPNG.interlaced = false;
	
	var historyState = 0;
	
	// Saves SPRITE.png in the user's desktop directory: to be called in "buildSprite()" below...
	//
	function exportSprite() {
		
		app.activeDocument = app.documents[1]; // WILL WORK ON THIS (see WIP notes)
		
		app.activeDocument.saveAs(saveFile, exportPNG, true);
		app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
	};
	
	// History rollback function...
	//
	function revertHistory() {
		
		app.activeDocument = app.documents[0]; // WILL WORK ON THIS (see WIP notes)
		
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
		
		// Add each sprite layer to the array
		//
		for (var i = 0; i < spriteGroup.length; i++) {
			layers.push(spriteGroup[i]);
		}
		
		// Loop through the sprite layer array and duplicate each in the new document...
		//
		for (var j = 0; j < layers.length; j++) {
			
			historyState++;
			
			app.activeDocument = app.documents[0]; // WILL WORK ON THIS (see WIP notes)
			app.activeLayer = layers[j];
			
			// Only the first layer is pushed to the top-left of the new document
			//
			if (j === 0) {
				app.activeLayer.translate(-app.activeLayer.bounds[0], -app.activeLayer.bounds[1]);
			}
			
			else {
				app.activeLayer.translate(-layers[j - 1].bounds[2], -layers[j].bounds[1]); // TRANSLATE vs. MOVE(), etc.???!!!
			}
			
			var newLayer = app.activeLayer.duplicate(newDoc, ElementPlacement.PLACEATEND);
		}
		
		exportSprite();
		revertHistory();
	};
	
	// Build!
	//
	buildSprite();