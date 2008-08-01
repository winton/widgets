<% templates.each do |template| -%>
<% id       = template.respond_to?(:keys) ? template.keys.first : template -%>
<% template = template.respond_to?(:keys) ? template[id]        : template -%>
$('<%= id %>').addEvent('click', function(e) {
  Global['<%= dialog_id %>'].render({ element: $('template_<%= template %>').render(<%= options.to_json %>) });
  return false;
});
<% end -%>
<% urls.each do |id, url| -%>
$('<%= id %>').addEvent('click', function(e) {
  Global['<%= dialog_id %>'].render({
    url: <%= url ? url.inspect : 'null' %> || this.get('href'),
    data: {
      authenticity_token: Global.authenticity_token,
      implementation: 'eborhood/widgets'
    }
  });
  return false;
});
<% end -%>