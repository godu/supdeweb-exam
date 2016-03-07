jQuery(function($) {

	var ds_actions = $('#ds_actions');
	var ds_action = $('.ds_action');
	var ds_subscribe = ds_actions.find('label[for=ds_subscribe]');
	var ds_unsubscribe = ds_actions.find('label[for=ds_unsubscribe]');

	// move actions in submit div
	$('.user_comment_btns').prepend(ds_actions);

	$('.comment-reply-link').click(function() {
		$button = $(this);
		$comment = $button.closest('article.user_comment');
		if($comment.data('subscribed') == 'subscribed') {
			ds_action.hide();
			ds_unsubscribe.fadeIn();
		} else {
			ds_action.hide();
			ds_subscribe.fadeIn();
		}
	});

	$('#cancel-comment-reply-link, .reset-comment-form').click(function() {
		if(ds_actions.data('subscribed') === 'subscribed') {
			ds_action_default = 'ds_subscribe';
		} else {
			ds_action_default = 'ds_unsubscribe';
		}
		ds_action.hide();
		ds_actions.find('label[for=' + ds_action_default + ']').show();
	});

});
