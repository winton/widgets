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
      Global.<%= id %> = new Trade($merge(<%= options.to_json %>, { table_id: item }));
    }
  });
});