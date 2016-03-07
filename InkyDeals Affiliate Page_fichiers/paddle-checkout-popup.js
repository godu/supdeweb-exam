jQuery(document).ready(function(){
	jQuery('body').append('<div id="paddleLoader" style="display:none;"></div>');
	var target = document.getElementById('paddleLoader');
	var spinner = new PaddleSpinner(opts).spin(target);

	jQuery('body').append(
		jQuery('<div>')
		.prop('id', 'paddle-checkout-popup-background')
		.css('display', 'none')
	).append(
		jQuery('<div>')
		.prop('id', 'paddle-checkout-popup-holder')
		.css('display', 'none')
		.append(
			jQuery('<div>')
			.prop('id', 'paddle-checkout-popup')
		)
	);

	function closePopup(){
		jQuery('#paddle-checkout-popup-background').hide();
		jQuery('#paddle-checkout-popup-holder').hide();
		jQuery('form.checkout').removeClass( 'processing' ).unblock();
		jQuery('#paddleLoader').hide();
	}

	jQuery('form.checkout').on(paddle_data.checkout_intercept, function(){

		var $form = jQuery( this );

		$form.addClass( 'processing' );

		var form_data = $form.data();

		if ( form_data["blockUI.isBlocked"] != 1 ) {
			$form.block({
				message: null,
				overlayCSS: {
					background: '#fff',
					opacity: 0.6
				}
			});
		}

		jQuery('#paddleLoader').fadeIn(150);
		jQuery.post(
			paddle_data.order_url,
			jQuery('form.checkout').serializeArray()
		).done(function(data){
			jQuery( 'body' ).trigger( 'update_checkout' );
			// May need to remove the wc tags
			data = data.replace(/.*<!--WC_START-->/, '').replace(/<!--WC_END-->.*/, '');
			data = JSON.parse(data);
			if(data.result == 'success') {
				data.checkout_url = data.checkout_url.replace('pay.paddle.com', 'checkout.paddle.com');

				jQuery('#paddle-checkout-popup-background').show();
				jQuery('#paddle-checkout-popup-holder').show();
				jQuery('#paddle-checkout-popup iframe').remove();
				jQuery('#paddle-checkout-popup').append(
					jQuery('<iframe>')
					.attr('src', data.checkout_url)
					.attr('frameborder', 0)
					.attr('allowtransparency', 'true')
					.css({opacity:0})
				);
				jQuery('#paddle-checkout-popup iframe').load(function() {
					jQuery('#paddleLoader').fadeOut(100);
					jQuery('#paddle-checkout-popup iframe').animate({opacity:1});
				});
			} else {
				// This error handling code is copied from the woocommerce checkout.js file

				if ( data.reload === 'true' ) {
					window.location.reload();
					return;
				}

				// Remove old errors
				jQuery( '.woocommerce-error, .woocommerce-message' ).remove();

				// Add new errors
				if ( data.messages ) {
					$form.prepend( data.messages );
				} else {
					$form.prepend( code );
				}

				// Cancel processing
				$form.removeClass( 'processing' ).unblock();

				// Lose focus for all fields
				$form.find( '.input-text, select' ).blur();

				// Scroll to top
				jQuery( 'html, body' ).animate({
					scrollTop: ( jQuery( 'form.checkout' ).offset().top - 100 )
				}, 1000 );

				// Trigger update in case we need a fresh nonce
				if ( data.refresh === 'true' ) {
					jQuery( 'body' ).trigger( 'update_checkout' );
				}

				jQuery( 'body' ).trigger( 'checkout_error' );

				// Remove the paddle popup, if visible
				closePopup();
			}
		});
		return false;
	});
	window.addEventListener("message", function(event) {
		if(event.origin.indexOf(paddle_data.domain) == -1) return;
				switch(event.data.action) {
					case 'complete':

						break;
					case 'close':
						closePopup();
						break;
				}
	}, false);
});
