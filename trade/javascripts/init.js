if (!$('<%= id %>').hasClass('accepted')) {
  [ 'trade_table_mine', 'trade_table_theirs' ].each(function(item) {
    Global[item].addEvents({
      newComplete: function(el, js) {
        Global.dialog.render({ element: el });
        eval(js);
      },
      editComplete: function(el, js) {
        Global.dialog.render({ element: el });
        eval(js);
      },
      deleteComplete: function(json) {},
      reloaded: function() {
        Global[item + '_<%= id %>'] = new Trade($merge(<%= options.to_json %>, { table_id: item }));
      }
    });
  });
  $('<%= id %>').getElement('.send').addEvent('click', function() {
    Global.indicator.show();
    var ids = this.id.split(',');
    new Request.HTML({
      url: '/trades',
      method: 'post',
      data: {
        'trade[first_trade_id]': ids[0],
        'trade[trade_to_id]': ids[1],
        'trade[from_ids]': Global.trade_table_mine_trade_builder.getDraggedIDs(),
        'trade[to_ids]': Global.trade_table_theirs_trade_builder.getDraggedIDs(),
        implementation: 'eborhood/widgets/form/dialog/trade',
        authenticity_token: Global.authenticity_token
      },
      evalScripts: false,
      onSuccess: function(tree, elements, html, js) {
        Global.dialog.render({ element: elements[0] });
        eval(js);
        Global.indicator.hide();
      }
    }).send();
  });
  $('<%= id %>').getElement('.cancel').addEvent('click', function() {
    var table = $('trades_table');
    var next = table.getNext();
    if (next) next.destroy();
    if (table.getPrevious()) table.getPrevious().fadeIn();
    table.fadeIn();
    Global.trades_table.reload();
    $('trade_table_history').hide();
  });
  var accept = $('<%= id %>').getElement('.accept');
  if (accept)
    accept.addEvent('click', function() {
      Global.indicator.show();
      new Request.HTML({
        url: '/trades/' + this.id,
        method: 'post',
        data: {
          '_method': 'put',
          'trade[accepted]': true,
          authenticity_token: Global.authenticity_token
        },
        evalScripts: false,
        onSuccess: function(tree, elements, html, js) {
          var table = $('trades_table');
          var next  = table.getNext();
          if (next) next.destroy();
          table.hide();
          elements[0].inject(table, 'after');
          eval(js);
          Global.indicator.hide();
        }
      }).send();
    });
}