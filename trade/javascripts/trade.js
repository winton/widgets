var Trade = new Class({
  initialize: function(options) {
    var table = Global[options.table_id];
    var container = $(options.table_id);
    var draggables = container.getElements('.rows_cell');
    var droppables = $$(options.table_id.contains('mine') ? '.mine_target' : '.theirs_target');
    var total = container.getElement('.total');
    
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
            var price = rows[options.column_indices.price].textContent.replace(/\D/g, '').toFloat();
            var div = new Element('div', {
              'class': 'item',
              id: options.id + '_' + price + '_' + rows[0].id.split('_').getLast(),
              html: description
            });
            droppable.setStyle('background', '#F0EFEC');
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
            if (img) {
              img.clone().inject(div, 'top');
              new Element('br').inject(div, 'top');
            }
            div.inject(droppables[0], 'bottom');
            new Drag.Move(div, {
              onDrop: function(element) {
                var id = element.id.split('_');
                price -= id[id.length - 2];
                total.innerHTML = '= $' + price;
                if (price == 0) {
                  total.destroy();
                  total = null;
                }
                element.destroy();
              }
            });
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
  }
});