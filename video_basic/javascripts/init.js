window.addEvent('domready', function() {
  Global = Global || {};
  Global.video = new SWFObject("<%= flash_path :widgets, :video_basic, 'player.swf' %>", "ply", "320", "264", "9", "#FFFFFF");
  Global.video.addParam("allowfullscreen","true");
  Global.video.addParam("allowscriptaccess","always");
  Global.video.addParam("flashvars","file=<%= video_path %>&image=<%= thumb_path %>");
  Global.video.write("<%= id %>");
});