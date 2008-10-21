Global.video = new SWFObject("<%= widget_flash_path :widgets, :video, 'player.swf' %>", "ply", "320", "253", "9", "#FFFFFF");
Global.video.addParam("allowfullscreen","true");
Global.video.addParam("allowscriptaccess","always");
Global.video.addParam("flashvars","file=<%= video_path %>&image=<%= thumb_path %>");
Global.video.write("<%= id %>");