/*
Script: Lightbox.js
	A class that lightens or darkens the entire page

License:
	MIT-style license.
*/

var Lightbox = new Class({
  Implements: [ Events, Options ],
	initialize: function(options) {
	  this.setOptions(options);
	  
		this.box 	= new Element('div');
		this.fire	= this.fire.bind(this);
		
		this.box.setStyles({
		  background: this.options.color,
		  opacity:    this.options.opacity,
		  'z-index':  1000,
		  position:   'absolute'
		});
		this.box.inject(document.body);
		this.box.hide();
		this.box.addEvent('click', this.fire);
		
		window.addEvent('resize', function() {
			if (this.box && this.box.visible()) this.box.expand();
		}.bind(this));
	},
	fire: function() {
	  this.hide();
	  this.fireEvent('click');
	},
	hide: function(dialog, keep_lightbox) {
		if (!keep_lightbox)
			this.box.hide();
	},
	show: function(dialog) {
		this.box.expand();
		this.box.show();
	}
});

Lightbox.implement(new Events);
// onClick, onHide, onShow

Element.implement({
	expand: function() {
		this.setStyles({
			top: 		'0px',
			left: 	'0px',
			width: 	Window.getScrollWidth() + 'px',
			height: Window.getScrollHeight() + 'px'
		});
	}
});