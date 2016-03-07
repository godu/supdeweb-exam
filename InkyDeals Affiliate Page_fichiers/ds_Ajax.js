jQuery(function($) {

	$(document).on('click', 'button[name=ds_unsubscribe]', function(e) {
		button = $(this);
		ds_unsubscribe = button.closest('label[for=ds_unsubscribe]');
		formData = button.closest('form').serializeArray();

		// remove to prevent subscribe over unsubscribe
	    $.each(formData, function(index, item) {
	        if (item.name == 'ds_subscribe') {
	            delete formData[index];
	        }
    	});

		formData.push({name: 'action', value: 'ds_unsubscribe'})
		//console.log(formData);
		$.post(_inky_app.admin_ajax, formData, function(meta)
		{
			//console.log(meta);
			if(meta != false) {
				meta = $.parseJSON(meta);
				// meta_type, email, message, id
				ds_unsubscribe.hide();
				//ds_unsubscribe.addClass('unsubscribed');
				button.closest('label').html(meta.message);
				ds_unsubscribe.fadeIn();
			} else {
				console.log('ds_Ajax: no data to output');
			}
		});
		e.preventDefault();
	});

});
