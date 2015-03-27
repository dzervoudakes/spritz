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
 * -Currently working on placement on newly duplicated layers in newDoc
 * -newDoc size must be dynamically generated, not hard-coded (and must export with even width and height values for retina)
 * -Must find a better way to shift between the documents (rather than specifying documents[0] and documents[1]
 */
	
	// The end result of this script will be a PNG image exported in the user's Desktop directory...
	//
	var spriteGroup = app.activeDocument.layerSets.getByName("SPRITE").layers;
	var saveFile = new File("~/Desktop/SPRITE.png");
	var exportPNG = new PNGSaveOptions();
		exportPNG.compression = 9;
		exportPNG.interlaced = false;
	
	// Saves SPRITE.png in the user's desktop directory: to be called in "buildSprite()" below
	//
	function exportSprite() {
		
		app.activeDocument = app.documents[1]; // WILL WORK ON THIS (see WIP notes)
		
		app.activeDocument.saveAs(saveFile, exportPNG, true);
		app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
	};
	
	// Collect all groups designated with the "SPRITE" label
	//
	function buildSprite() {
		
		// Create a new document called "SPRITE": collected sprite layers will be duplicated here
		//
		var newDoc = app.documents.add(UnitValue(800, "px"), UnitValue(600, "px"), 72, "SPRITE", NewDocumentMode.RGB, DocumentFill.TRANSPARENT);
		var layers = [];
		
		// Add each sprite layer to the array
		//
		for (var i = 0; i < spriteGroup.length; i++) {
			layers.push(spriteGroup[i]);
		}
		
		// Loop through the sprite layer array and duplicate each in the new document
		//
		for (var j = 0; j < layers.length; j++) {
			
			app.activeDocument = app.documents[0]; // WILL WORK ON THIS (see WIP notes)
			app.activeLayer = layers[j];
			
			var newLayer = app.activeLayer.duplicate(newDoc, ElementPlacement.PLACEATEND);
		}
		
		exportSprite();
	};
	
	// Build
	//
	buildSprite();