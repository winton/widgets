var Trade = new Class({
  initialize: function(options) {
    var table = Global[options.table_id];
    var container = $(options.table_id);
    var draggables = container.getElements('.rows_cell');
    var droppables = $$(options.table_id.contains('mine') ? '.mine_target' : '.theirs_target');
    var total;
    
    var refreshTotal = function(droppable, price) {
      total = droppable.getElement('.total');
      if (!total) {
        total = new Element('div', {
          'class': 'total',
          html: '= $' + price
        });
        total.inject(droppables[0], 'top');
      } else {
        price += total.textContent.replace(/\D/g, '').toFloat();
        total.innerHTML = '= $' + price;
      }
    };
    
    var attachMove = function(div, price) {
      new Drag.Move(div, {
        onDrop: function(element) {
          price -= element.get('price');
          total.innerHTML = '= $' + price;
          if (price == 0) {
            total.destroy();
            total = null;
          }
          element.destroy();
        }
      });
    };
    
    draggables.each(function(item) {
      new Drag.Move(item, {
        droppables: droppables,
        onDrop: function(element, droppable) {
          element.setStyles({ top:0, left:0 });
          if (droppable) {
            var rows = table.rowFromParent(item.getParent());
            var img  = rows.map(function(div) {
              return div.getElement('img');
            }).clean()[0];
            var description = rows[options.column_indices.description].textContent;
            var price = rows[options.column_indices.price].textContent.replace('$', '').toFloat();
            var div = new Element('div', {
              'class': 'item',
              id: options.id + '_' + rows[0].id.split('_').getLast(),
              html: description,
              price: price
            });
            droppable.setStyle('background', '#F0EFEC');
            if ($(div.id)) return;
            refreshTotal(droppable, price);
            if (img) {
              new Element('br').inject(div, 'top');
              img.clone().inject(div, 'top');
            }
            div.inject(droppables[0], 'bottom');
            attachMove(div, price);
          }
        },
        onEnter: function(element, droppable) {
          droppable.setStyle('background', '#EFE0E2');
        },
        onLeave: function(element, droppable) {
          droppable.setStyle('background', '#F0EFEC');
          element.setStyles({ top:0, left:0 });
        }
      });
    });
    
    this.getDraggedIDs = function() {
      return droppables[0].getChildren().map(function(div) {
        return div.id.replace(/\D/g, '');
      }).clean().join(",");
    };
    
    droppables[0].getElements('.item').each(function(item) {
      refreshTotal(droppables[0], item.get('price').toFloat());
      attachMove(item, item.get('price'));
    });
  }
});