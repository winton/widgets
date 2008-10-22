if ($("<%= id %>")) {
  Global.video = new SWFObject("<%= widget_flash_path :widgets, :video, 'player.swf' %>", "ply", "320", "259", "9", "#FFFFFF");
  Global.video.addParam("allowfullscreen","true");
  Global.video.addParam("allowscriptaccess","always");
  Global.video.addParam("flashvars","file=<%= video_path %>&image=<%= thumb_path %>");
  Global.video.write("<%= id %>");
} else {
  var timer, complete = true;
  var fn = function() {
    if (complete) {
      complete = false;
      new Request.HTML({
        url: '/media_files/<%= file_id %>/encoded_status',
        method: 'post',
        data: { authenticity_token: Global.authenticity_token, implementation: "#{params[:implementation]}" },
        evalScripts: false,
        onSuccess: function(tree, elements, html, js) {
          complete = true;
          if (html.trim() == '') return;  
          if ($chk(html.toInt())) {
            $$('.video_indicator .status_bar').setStyle('width', (html.toInt() / 100) * 204);
          } else {
            $clear(timer);
            (function() {
              Global.media_file_dialog.render({ element: elements[0] });
              Global.media_files_table.reload();
              eval(js);
            }).delay(2000);
          }
        }
      }).send();
    }
  };
  fn();
  timer = (fn).periodical(10000);
  Global.media_file_dialog.addEvent('hide', function() { $clear(timer); });
}