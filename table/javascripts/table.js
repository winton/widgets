var Table = new Class({
  Implements: [ Events ],
  initialize: function(options) {
    this.options    = options;
    var container   = $(options.id);
    var indicator   = container.getElement('.indicator');
    var table_links = container.getElement('.title .links');
    var categories  = container.getElements('.categories div').filter(function(el) { return el != indicator; });
    var headers, rows, menu, pagination;
    var me = this;
    
    this.load = function() {
      if (options.load_on_start)
        this.reload();

      table_links.getElements('a').addEvent('click', function() {
        var table_link = options.table_links.filter(function(item) {
          return item.title == this.textContent;
        }, this)[0];
        new Request.HTML({
          url: this.get('href'),
          evalScripts: false,
          onSuccess: function(tree, elements, html, js) {
            me.fireEvent((this.textContent.toLowerCase() + ' complete').replace(' ', '-').camelCase(), [ elements[0], js ]);
          }.bind(this),
          data: {
            authenticity_token: Global.authenticity_token,
            implementation: table_link.implementation
          }
        }).get();
        return false;
      });
      
      categories.addEvent('click', function() {
        categories.removeClass('selected');
        categories.addClass('selectable');
        this.removeClass('selectable');
        this.addClass('selected');
        me.reload({ category: this.id, page: 1 });
        return false;
      });
    };
    
    this.reload = function(params, text_content) {
      if (!options.index_url) {
        container.hide();
        return;
      }
      this.fireEvent('reloadStart');
      indicator.fadeIn();
      table_links.hide();
      text_content = text_content || container.getElement('.headers .on');
      if ($type(text_content) == 'element')
        text_content = text_content.textContent;
      new Request.JSON({
        url: options.index_url,
        onSuccess: function(json){
          $extend(options, json);
          if (!headers) { // create headers
            var columns = options.columns.map(function(item) {
              return '<div class="arrow down"></div>' + item + '';
            });
            headers = Tbl('headers', columns, '%', options.widths);
            headers.getElements('.cell').addClass('off');
            headers.inject(container, 'bottom');
            this.attachHeaders();
          }
          this.reloadRows();
          this.reloadPagination();
          if (text_content)
            rows.zebra('zebra_highlight', options.columns.length+1, options.columns.indexOf(text_content));
          indicator.hide();
          table_links.fadeIn();
          this.fireEvent('reloaded');
        }.bind(this)
      }).get(
        $type(params) == 'string' ?
          params :
          $merge({ per_page: options.per_page, page: options.page, order: options.order, category: options.category }, params || {}));
    };
    
    this.reloadPagination = function() {
      if (pagination)
        pagination.destroy();
      pagination = new Element('div', { html: options.pagination });
      pagination.inject(container, 'bottom');
      pagination.getElements('a').addEvent('click', function() {
        me.reload(this.getProperty('href'));
        return false;
      });
    };
    
    this.reloadRows = function() {
      if (rows)
        rows.destroy();
      var template = $(options.no_results_template);
      if (template) {
        var no_results = $(options.id + '_no_results');
        if (no_results) no_results.destroy();
        if (options.data.length == 0 && !options.category) {
          if (template)
            template.render(options).inject(container, 'before');
          if (container.visible()) container.fadeOut();
          return;
        } else
          container.fadeIn();
      }
      rows = Tbl('rows', options.data, '%', options.widths);
      rows.getChildren().filter(function(item) { return item.hasClass('parent'); }).each(function(item, index) {
        var id_index = index / options.columns.length;
        if (index % options.columns.length == 0 && options.ids[id_index])
          item.id = options.id + '_' + options.ids[id_index];
      });
      rows.inject(container, 'bottom');
      rows.zebra('zebra', options.columns.length+1);
      this.attachRows();
    };
    
    this.attachRows = function() {
      var r = rows.getElements('.rows_cell');
      r.addEvent('mouseenter', function() {
        var row = me.rowFromParent(this.getParent());
        row.each(function(item) {
          if (item.hasClass('zebra_highlight')) item.set('was_highlighted', true);
          else item.addClass('zebra_highlight');
        });
        me.fireEvent('mouseenter', [row]);
      });
      r.addEvent('mouseleave', function() {
        var row = me.rowFromParent(this.getParent());
        row.each(function(item) {
          if (item.get('was_highlighted')) return;
          item.removeClass('zebra_highlight');
        });
        me.fireEvent('mouseleave', [row]);
      });
      r.addEvent('click', function(e) {
        var send = function(row_link) {
          var id = me.idFromParent(e.target.getParent('.parent'));
          if (row_link.direct) {
            window.location = row_link.url.replace(':id', id);
            return false;
          }
          if (row_link.indicator)
            Global.indicator.show();
          if (row_link.url.contains('.json'))
            new Request({
              url: row_link.url.replace(':id', id),
              method: row_link.method || me.methodFromTitle(row_link.title),
              data: $extend({
                id: me.idFromParent(e.target.getParent('.parent')),
                authenticity_token: Global.authenticity_token,
                implementation: row_link.implementation
              }, (row_link.data || {})),
              onSuccess: function(json){
                if (json.trim() == '')
                  me.reload();
                me.fireEvent((row_link.title.toLowerCase() + ' complete').replace(' ', '-').camelCase(), json);
                if (row_link.indicator)
                  Global.indicator.hide();
              }.bind(this)
            }).send();
          else
            new Request.HTML({
              url: row_link.url.replace(':id', id),
              method: row_link.method || me.methodFromTitle(row_link.title),
              data: $extend({
                id: me.idFromParent(e.target.getParent('.parent')),
                authenticity_token: Global.authenticity_token,
                implementation: row_link.implementation
              }, (row_link.data || {})),
              evalScripts: false,
              onSuccess: function(tree, elements, html, js) {
                me.fireEvent((row_link.title.toLowerCase() + ' complete').replace(' ', '-').camelCase(), [ elements[0], js ]);
                if (row_link.indicator)
                  Global.indicator.hide();
              }
            }).send();
          return true;
        };
        if (options.row_click)
          send(options.row_click);
        else {
          if (menu) menu.destroy();
          if (options.row_links.length == 0) return true;
          me.menu = menu = new Element('div', {
            'class': 'table_widget_menu',
            styles: {
              top: e.page.y,
              left: e.page.x,
              opacity: 0
            },
            html: options.row_links.map(function(item) {
              return '<a href="#" style="' + (item.style || '') + '">' + item.title + '</a>';
            }).join('<br/>')
          });
          menu.inject(document.body, 'bottom');
          menu.getElements('a').addEvent('click', function() {
            var row_link = options.row_links.filter(function(item) {
              return item.title == this.textContent;
            }, this)[0];
            send(row_link);
            menu.fade('out');
            return false;
          });
          menu.fade('in');
        }
        return false;
      });
      document.addEvent('click', function(e) {
        if (e.target != menu && menu)
          menu.destroy();
      });
    };
    
    this.methodFromTitle = function(title) {
      return title.contains('Delete') || title.contains('Remove') ? 'delete' : 'get';    
    };
    
    this.rowFromParent = function(parent) {
      var parents = $A([ parent ]), el = parent;
      if (!el.hasClass('first')) {
        while(el && !el.hasClass('first')) {
          el = el.getPrevious();
          parents.unshift(el);
        }
      }
      el = parent;
      if (!el.hasClass('last')) {
        while(el && !el.hasClass('last')) {
          el = el.getNext();
          parents.push(el);
        }
      }
      return parents;
    };
    
    this.idFromParent = function(parent) {
      return this.rowFromParent(parent).filter(function(item) {
        return item.hasClass('first');
      })[0].id.split('_').getLast();
    };
    
    this.attachHeaders = function() {
      var h = headers.getElements('.headers_cell');
      h = h.filter(function(item) { return options.sortable[item.textContent]; });
      h.addEvent('mouseenter', function() {
        if (this.get('sort')) return;
        this.removeClass('off');
        this.addClass('on');
      });
      h.addEvent('mouseleave', function() {
        if (this.get('sort')) return;
        this.removeClass('on');
        this.addClass('off');
      });
      h.addEvent('click', function() {
        if (!this.get('sort')) {
          var other = h.filter(function(item) { return item != this; }.bind(this));
          other.removeClass('on');
          other.addClass('off');
          other.set('sort', null);
          other.getFirst().setStyle('opacity', 0);
          this.getFirst().setStyle('opacity', 1);
          this.set('sort', 'desc');
        }
        var sort = this.get('sort');
        if (sort == 'asc') {
          this.getFirst().removeClass('down');
          this.getFirst().addClass('up');
          this.set('sort', 'desc');
        } else if (sort == 'desc') {
          this.getFirst().removeClass('up');
          this.getFirst().addClass('down');
          this.set('sort', 'asc');
        }
        me.reload({ order: options.sortable[this.textContent] + ' ' + this.get('sort') }, this.textContent);
      });
    };
    
    this.dataFromHidden = function(specific_rows) {
      var data = [];
      (specific_rows || rows.getChildren()).each(function(row) {
        if (row.hasClass('first'))
          data.push({ id: this.idFromParent(row) });
        row.getElements('input').each(function(input) {
          data.getLast()[input.name] = input.value;
        });
      }.bind(this));
      return data;
    };
    
    this.load();
  }
});