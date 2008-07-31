var Panel = new Class({
  initialize: function(options) {
    var container = $(options.id);
    var template  = $('template_' + options.id);
    var obj = eval(options.js_object);
    
    this.render = function() {
      var rendered = template.render(obj);
      rendered.setStyle('opacity', 0);
      rendered.replaces(container);
      rendered.fade('in');
    };
    
    this.render();
  }
});