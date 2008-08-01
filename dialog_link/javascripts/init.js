<% templates.each do |template| -%>
<% id       = template.respond_to?(:keys) ? template.keys.first : template -%>
<% template = template.respond_to?(:keys) ? template[id]        : template -%>
<% el       = id.to_s[0..0] == '.' || id.to_s[0..0] == '#' ? "$$('#{id}')" : "$('#{id}')" -%>
<%= el %>.addEvent('click', function(e) {
  Global['<%= dialog_id %>'].render({ element: $('template_<%= template %>').render(<%= options.to_json %>) });
  return false;
});<% end -%>
<% urls.each do |url| -%>
<% id  = url.respond_to?(:keys) ? url.keys.first : url -%>
<% url = url.respond_to?(:keys) ? url[id]        : nil -%>
<% el  = id.to_s[0..0] == '.' || id.to_s[0..0] == '#' ? "$$('#{id}')" : "$('#{id}')" -%>
<%= el %>.addEvent('click', function(e) {
  Global['<%= dialog_id %>'].render({
    url: <%= url ? url.inspect : "this.get('href')" %>,
    data: {
      authenticity_token: Global.authenticity_token,
      implementation: <%= implementation.inspect %>
    }
  });
  return false;
});<% end -%>