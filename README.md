# Spritz

_Sprite sheets with the quickness!_

Generates sprite sheets from Photoshop layers.

##### How to Use:

* Within your open PSD document, make a group called "SPRITE". Make sure any layers you wish to include in your sprite output are contained within this new group.
* Open "File > Scripts > Browse" and search for "Spritz.js" in your local directory. Once found, select it and click "Open".
* When loaded, Spritz will assemble all layers within the "SPRITE" group (top-to-bottom in order) in a new document called SPRITE.png which will be exported to your Desktop.

##### Recommended Use Case and Some Notes

* Spritz is not recommended for complex sprite sheet outputs. I recommended outputs with just a few items of similar width and height.
* The width of the exported sprite sheet is automatically calculated based on the number of items in the "SPRITE" group of your document, and has no width limit. (hence only recommended for smaller applications)
* The height of the exported sprite sheet is automatically adjusted to accommodate the tallest layer added to the "SPRITE" group of your document.
* All exported sprite sheets will have an even width value and an even height value, accounting for retina/double-resolution displays.

##### Pinpointing Coordinates for CSS

To find the appropriate CSS background-position for each item in newly exported sprite sheets, I kindly suggest you check out www.spritecow.com - it's just awesome.