var Panel = new Class({
  initialize: function(options) {
    var container = $(options.id);
    var template  = $('template_' + options.id);
    this.render = function() {
      var rendered = template.render(eval(options.js_object));
      rendered.setStyle('opacity', 0);
      rendered.replaces(container);
      rendered.fade('in');
      container = rendered;
    };
    
    this.render();
  }
});