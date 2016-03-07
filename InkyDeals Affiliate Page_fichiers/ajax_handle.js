//handle the ajax requests

jQuery(document).ready(function ($) {
	//#subscribeModal #subscribeModalEmail
	$('#subscribeModalSubmit').on('click', function(){
		var $email = $('#subscribeModalEmail');
		var $formGroup = $('#subscribeModal .modal-body .form-group');

        $.post(_inky_app.admin_ajax, {action: 'subscribe_popup', subscribeModalEmail: $email.val()}, function (d) {
            if (d) {
				if(d.status == false) {
					$formGroup.addClass('has-error');
					$email.trigger('focus');
					$('#subscribeModal #subscribeModalError').text('(' + d.message + ')');
				} else if(d.status == true) {
					$('#subscribeModal .modal-header').remove();
					$('#subscribeModal .modal-body').html('<button type="button" class="close" data-dismiss="modal">&times;</button><div class="row"><h1 style="text-align: center;padding: 50px;">' + d.message + '</h1></div>');
				}
            } else {
				//console.log($email.val() + ' yeah');
            }
        }, 'JSON');
		
	});

    $('#login-check').on('submit', function () {
        $.post(_inky_app.admin_ajax, $(this).serialize(), function (d) {
            d = $.parseJSON(d);
            if (d && d.status && d.status == 'success') {
                window.location = window.location;
            }
        });
        return false;
    });

    $('#update-basic-details').on('submit', function () {
        $.post(_inky_app.admin_ajax, $(this).serialize(), function (d) {
            if (d && d.validation) {
                $('#account-modal').modal('show');
            } else {
            }
        });
        return false;
    });

    $('#register-form').on('submit', function () {
        $.post(_inky_app.admin_ajax, $(this).serialize(), function (d) {
            d = $.parseJSON(d);
            if (d && d.status && d.status == 'success') {
                window.location = window.location;
            }
        });
        return false;
    });

    /*$('#billing-form').on('submit', function () {
        var self = $(this);
        $.post(_inky_app.admin_ajax, $(this).serialize(), function (d) {
            if (d && d.validation) {
                $('#account-modal').modal('show');
            } else {
                var show_errors = self.find('.errors');
                console.log(show_errors);
                show_errors.html(d.errors);
            }
        });
        return false;
    });*/

    $('#change-password').on('submit', function () {
        var self = $(this);
        $.post(_inky_app.admin_ajax, $(this).serialize(), function (d) {
            if (d && d.validation) {
                $('#account-modal').modal('show');
            } else {
                var show_errors = self.find('.errors');
                show_errors.html(d.errors);
            }
        });
        return false;
    });



    //link triggers

    $('.login-popup').on('click', function () {
        $('#login-modal').modal({});
    });
});