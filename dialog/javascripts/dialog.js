var Dialog = new Class({
  Implements: Events,
  initialize: function(options) {
    var lightbox;
    var container = new Element('div', {
      'class': 'dialog',
      styles: {
        'z-index': 1001,
        width:     options.width,
        position:  'absolute',
        display:   'none'
      }
    });
    
    /*var indicator = new Element('div', {
      'class': 'indicator',
      html:    '<%= image :widgets, :dialog, "indicator.gif" %>',
      styles: {
        display: 'none',
        position: 'absolute',
        top:  5,
        left: 8
      }
    });
    indicator.inject(container, 'top');*/
    
    var close = new Element('div', {
      'class': 'close',
      html:    'x',
      styles: {
        position: 'absolute',
        top:  (options.corners ? options.corners.height : 0) - 1,
        left: options.width - (options.corners ? options.corners.width : 0) - 10
      },
      events: {
        click: function() { this.hide(); }.bind(this)
      }
    });
    close.inject(container, 'top');
    
    var content = new Element('div', { 'class': 'content' });
    content.inject(container, 'top');
    if (options.corners) {
      var imgs = [
        [ '<%= image :widgets, :dialog, "nw.png" %>', '', '<%= image :widgets, :dialog, "ne.png" %>' ],
        [ '<%= image :widgets, :dialog, "sw.png" %>', '', '<%= image :widgets, :dialog, "se.png" %>' ]
      ];
      var corner_top = Tbl('corners', imgs[0], 'px', options.corners.width, options.width - options.corners.width * 2, options.corners.width);
      var corner_bot = Tbl('corners', imgs[1], 'px', options.corners.width, options.width - options.corners.width * 2, options.corners.width);
      corner_top.inject(container, 'top');
      corner_bot.inject(container, 'bottom');
    }
    container.inject(document.body);
    
    this.hide = function() {
      container.fadeOut();
      if (lightbox) lightbox.hide();
      this.fireEvent('hide');
    }.bind(this);
    
    this.render = function(opts) {
      if (opts.html || opts.element || opts.url) {
        delete options.html;
        delete options.element;
        delete options.url;
      }
      $extend(options, opts);
      
      if (options.lightbox) {
        lightbox = lightbox || new Lightbox($merge(options.lightbox, {
          onClick: function() { this.hide(); }.bind(this)
        }));
        lightbox.show();
      }
      
      Global.indicator.show();
      content.empty();
      
      var finished = function() {
        Global.indicator.hide();
        container.center();
        container.fadeIn();
      };
      
      if (options.html) {
        content.innerHTML = options.html;
        finished();
      } else if (options.element) {
        options.element.inject(content);
        finished.delay(100);
      } else if (options.url) {
        new Request.HTML({
          url: options.url,
          data: $extend({ implementation: options.implementation }, options.data || {}),
          evalScripts: false,
          onSuccess: function(tree, elements, html, js) {
            elements[0].inject(content);
            eval(js);
            finished();
          }.bind(this)
        }).get();
      }
    };
  }
});

Element.implement({
  center: function() {
    this.setStyle('opacity', 0);
    this.show();
    
    var width 	= this.getSize().x;
    var height 	= this.getSize().y;

    this.setStyles({
      position: 'absolute',
      left: (Window.getWidth() / 2 - width / 2) + Window.getScrollLeft() + 'px',
      top:  (Window.getHeight() / 2 - height / 2) + Window.getScrollTop() + 'px'
    });
  }
});