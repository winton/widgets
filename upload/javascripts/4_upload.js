var Upload = new Class({
  initialize: function(options) {
    var container = $(options.id);
    var browse = container.getElement('.browse');
    var upload = this.upload = new FancyUpload2(container.getElement('.status'), container.getElement('.list'), {
    	url:  options.upload_url,
    	path: options.flash_path,
    	repositionDelay: options.reposition_delay,
    	data: { ebor_id: Global.ebor.id },
    	fieldName: 'Filedata',
    	onLoad: function() {
    		container.getElement('.status').show();
    		container.getElement('.fallback').destroy();
    	},
    	onAllComplete: function() {
    	  this.removeFile();
    	},
    	//debug: true,
    	target: browse
    });

    browse.addEvent('click', function() {
    	upload.browse({
    	  'Images (*.jpg, *.jpeg, *.gif, *.png, *.bmp, *.tiff)': '*.jpg; *.jpeg; *.gif; *.png; *.bmp; *.tiff',
    	  'Audio (*.mp3, *.mp4, *.mid, *.ogg, *.wav)': '*.mp3; *.mp4; *.mid; *.ogg; *.wav',
    	  'Video (*.asf, *.avi, *.mpg, *.mov, *.flv)': '*.asf; *.avi; *.mpg; *.mov; *.flv'
    	});
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