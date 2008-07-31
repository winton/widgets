var Upload = new Class({
  initialize: function(options) {
    var container = $(options.id);
    var swiffy = new FancyUpload2(container.getElement('.status'), container.getElement('.list'), {
    	url: options.upload_url,
    	data: { person_id: Global.ebor.id },
    	fieldName: 'Filedata',
    	path: '/flash/Swiff.Uploader.swf',
    	onLoad: function() {
    		container.getElement('.status').show();
    		container.getElement('.fallback').destroy();
    	}
    });

    container.getElement('.browse').addEvent('click', function() {
    	swiffy.browse({'Images (*.jpg, *.jpeg, *.gif, *.png)': '*.jpg; *.jpeg; *.gif; *.png'});
    	return false;
    });
    
    container.getElement('.clear_list').addEvent('click', function() {
    	swiffy.removeFile();
    	return false;
    });

    container.getElement('.upload_file').addEvent('click', function() {
    	swiffy.upload();
    	return false;
    });
  }
});