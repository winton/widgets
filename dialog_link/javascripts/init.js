$('<%= id %>').addEvent('click', function(e) {
<% case resource_type -%>
<% when :url -%>
  Global.dialog.render({
    url: this.get('href'),
    data: {
      authenticity_token: Global.authenticity_token,
      implementation: 'eborhood/widgets'
    }
  });
<% when :template -%>
  Global.dialog.render({ element: $('template_<%= id %>').render(<%= options.to_json %>) });
<% end -%>
  return false;
});