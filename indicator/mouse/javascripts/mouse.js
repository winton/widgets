var Indicator = new Class({
	initialize: function(image, x, y) {
		var container = new Element('div', {
		  html: '<img src="/images/' + image + '" />',
		  styles: { position: 'absolute', opacity: 0, 'z-index': 5000, display: 'none' }
		});
		container.inject(document.body, 'bottom');
		document.addEvent('mousemove', function(e) {
			container.setStyles({
				top: 	e.page.y + (y || 7) + 'px',
				left: e.page.x + (x || 7) + 'px'
			});
		});
		this.show = function() { container.fadeIn(); };
		this.hide = function() { container.fadeOut(); };
	}
});