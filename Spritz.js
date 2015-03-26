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
 * -newDoc size must be dynamically generated, not hard-coded
 * -Must find a better way to shift between the documents (rather than specifying documents[0] and documents[1]
 * -Troubles with exportDocument() within "exportSprite()" function
 */
	
	// Collect open documents and prepare to export as JPG...
	//
	var openDoc = app.activeDocument;
	var spriteGroup = app.activeDocument.layerSets.getByName("SPRITE").layers; // Gather all layers within the "SPRITE" group
	var exportPNG = new ExportOptionsSaveForWeb();
		exportPNG.format = SaveDocumentType.PNG;
		exportPNG.includeProfile = false;
		exportPNG.interlaced = true;
		exportPNG.optimized = false;
		exportPNG.quality = 100;
	
	// Saves SPRITE.png in the same directory as the open file
	//
	function exportSprite() {
		app.activeDocument = app.documents[1]; // WILL WORK ON THIS (see WIP notes)
		//app.activeDocument.exportDocument("./SPRITE.png", ExportType.SAVEFORWEB, exportPNG);
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