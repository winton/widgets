var Upload = new Class({
  initialize: function(options) {
    var container = $(options.id);
    var upload = this.upload = new FancyUpload2(container.getElement('.status'), container.getElement('.list'), {
    	url:  options.upload_url,
    	path: options.flash_path,
    	data: { ebor_id: Global.ebor.id },
    	fieldName: 'Filedata',
    	onLoad: function() {
    		container.getElement('.status').show();
    		container.getElement('.fallback').destroy();
    	},
    	onAllComplete: function() {
    	  this.removeFile();
    	}
    });

    container.getElement('.browse').addEvent('click', function() {
    	upload.browse({'Images (*.jpg, *.jpeg, *.gif, *.png)': '*.jpg; *.jpeg; *.gif; *.png'});
    	return false;
    });
    
    container.getElement('.clear_list').addEvent('click', function() {
    	upload.removeFile();
    	return false;
    });

    container.getElement('.upload_file').addEvent('click', function() {
    	upload.upload();
    	return false;
    });
  }
});