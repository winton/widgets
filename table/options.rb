{
  :id => 'table',
  
  # Rows per page
  :per_page => 10,
  
  # Table's title
  # :title => 'Some resource',
  :title => nil,

  # Categories appear under the title and above the table
  #:categories => [ 
  #  { :all => 'All' },
  #  { :section_1 => 'Section 1' },
  #  { :section_2 => 'Section 2' }
  #],
  :categories => [],

  # Index action of some resource
  #:index_url => '/some_resource.json',
  :index_url => nil,

  # Links displayed in top right corner of table
  # See examples/controller.rb
  #:table_links => [
  #  { :title => 'New', :url => '/some_resource/new' }
  #],
  :table_links => [],  

  # Links displayed when row is clicked
    # :resource should return HTML or JSON depending on URL extension
      # HTML should be a form
      # JSON should be { message: '' } or true
  #:row_links => [
  #  { :title => 'Edit',   :url => '/some_resource/:id/edit' },
  #  { :title => 'Delete', :url => '/some_resource/:id.json' }
  #]
  :row_links => []
}