//jQuery functions for page tasks
String.prototype.pad = function(sz, c, where) {
	c = (c !== null && c !== '') ? c : ' ';
	where = (where !== undefined && where.trim() !== '') ? where : 'before';
	ret = this;
	if (this.length < sz) {
		for (i = 0; i < (sz - this.length); i++) {
			if (where === 'before') ret = c + ret;
			else ret += c;
		}
		return ret;
	}

	return this;
};


// Custom checkbox styling
(function() {
	jQuery.fn.customRadioCheck = function() {

		var total = this.length;
		return this.each(function(i) {

			//alert(i);
			var $this = jQuery(this);
			var $span = jQuery('<span/>');
			if (i == total - 1) {
				var is_last_index = true;
			}


			$span.addClass('custom-' + ($this.is(':checkbox') ? 'check' : 'radio'));
			$span.insertAfter($this);

			$this.parent('label').addClass('custom-label')
				.attr('onclick', ''); // Fix clicking label in iOS
			$this.css({
				position: 'absolute',
				visibility: 'hidden'
			});
			$span.css({
				cursor: 'pointer'
			});

			if ($this.prop('checked') == true) {
				$span.addClass('checked');
				$span.closest('tr').addClass('focus');
			}


			// Events
			$this.on({
				change: function() {
					if ($this.is(':radio')) {
						var is_in_table = $this.closest('table');
						if (is_in_table.length != 0) {
							if ($this.prop('checked') == true) {
								$this.closest('table').find('.custom-radio').removeClass('checked');
								$this.closest('table').find('tr').removeClass('focus');
							}
						} else {
							$this.closest('*[data-rel=optgroup]').find('.custom-radio').removeClass('checked');
						}
					}
					$span.toggleClass('checked', $this.is(':checked'));
					$span.closest('tr').toggleClass('focus', $this.is(':checked'));
				},
				focus: function() {
					$span.addClass('focus');
				},
				blur: function() {
					$span.removeClass('focus');
				}
			});
		});
	};
}());

//TODO: move away from jquery to angular for better flexibility/modularity
jQuery(document).ready(function($) {
	//timer element cache
	var dealCache = null;
	var timerTables = null;
	var dealTimer = null;
	var lazyLoadTimer = null;


	$('#tab-description img[data-original]').lazyload({
		'effect': 'fadeIn',
		'threshold': 450
	});


	//show comments directly if we have the hash present in url
	if (window.location.href.toString().match(/#comments$/g)) {
		var tab = $('.nav-tabs a[href="#tab-reviews"]');
		tab.tab('show');

		$('html, body').animate({
			scrollTop: tab.offset().top - 60
		}, 1000);
	}

	//my account functionality ... show each download count based on the json data
	if (typeof wc_customer_downloads !== 'undefined') {
		for (var key in wc_customer_downloads) {
			if (wc_customer_downloads.hasOwnProperty(key)) {
				$('span[data-product=' + key + ']').text(wc_customer_downloads[key]);
			}
		}
	}

	//update the download count when user clicks on a button
	$('.download-element a.btn, .download-element .download-title > a').on('click', function() {
		var target = $(this).closest('div').parent().find('span[data-product]');
		if (target.length == 0) return;
		var val = parseInt(target.text()) || 1;

		target.text(val + 1);
	});


	//botstrap tooltips
	$('[data-toggle="tooltip"]').tooltip({
		placement: 'bottom',
		title: function() {
			return 'Expires in';
		}
	});

	/*
	    //hide the default radios if we have js enabled ... if nojs or errors leave the fields visible
	    $('.payment_methods input[type=radio]').hide();
	    var checked = $('.payment_methods input[type=radio]:checked');

	    //checkout payments list checkmark functionality
	    $('.payment_methods').on('click', 'li', function () {
	        $(this).siblings().removeClass('payment-selected');
	        $(this).addClass('payment-selected');
	        $(this).closest('.payment_methods').find('input[type=radio]').prop('checked', true);
	        $(this).find('input[type=radio]').prop('checked', true);
	    })

	*/
	//cancel comments functionality and comments functionality
	$('button.reset-comment-form').on('click', function() {
		var cancel_link = $('#cancel-comment-reply-link:visible');
		if (cancel_link) cancel_link.click();
	});

	//hide the rating when comment is a reply
	$('.comment-reply-link').on('click', function() {
		$('.review_stars_container').hide();
	});

	//show the above when is level 0 comment
	$('#cancel-comment-reply-link').on('click', function() {
		$('.review_stars_container').show();
	});

	//variable product variation table
	$('.variations').on('click', 'td:last-child', function() {
		var item = $(this).prev('td').find('input[type=radio]');
		item.prop('checked', true);
		item.change();
	});

	$('.variations tr td').each(function() {
		var theText = $(this).text();
		var regex = /([\$][0-9,.]+)$/g;

		var matches = new Array();


		while ((matches = regex.exec(theText)) !== null) {

			$(this).html(theText.replace(matches[0], '<b>' + matches[0] + '</b>'));

		}
	});


	//stars functionality
	$('.review_stars_container .featured_details li')
		.on('mouseenter', function() {
			$(this)
				.prevAll('li')
				.andSelf()
				.children("span")
				.removeClass('b_inactive_rating')
				.addClass('b_ylow_fill');
			$(this)
				.nextAll('li')
				.children("span")
				.addClass('b_inactive_rating')
				.removeClass('b_ylow_fill');
		})
		.on('click', function() {
			var elm = $('#commentform').find('input[name=rating]');
			var rating_val = $(this).parent().find('span.b_ylow_fill').length;
			//console.log('A:' + rating_val);
			elm.val(rating_val);
			$(this).siblings().removeClass('active-star');
			$(this).addClass('active-star');
		})
		.on('mouseleave', function() {
			if ($(this).parent().find('li.active-star').length > 0) {
				$(this).parent().find('li.active-star')
					.prevAll()
					.andSelf()
					.children('span')
					.removeClass('b_inactive_rating')
					.addClass('b_ylow_fill');
				$(this).parent().find('li.active-star')
					.nextAll('li')
					.children('span')
					.removeClass('b_ylow_fill')
					.addClass('b_inactive_rating');
			} else {
				$(this).parent().find('li')
					.children('span')
					.removeClass('b_ylow_fill')
					.addClass('b_inactive_rating');
			}
		});


	//customize bootstrap for country changed
	//TODO: refactor/remove this via the stylesheets
	$('body').on('country_to_state_changed', function(e, country, where_div) {
		where_div.find("input[type=text][id*=billing]:not('.form-control'),select[id*=billing]:not('.form-control')")
			.not(':hidden')
			.addClass('form-control');
	});


	//copy functionality via zclip
	$(".view_deal_btn[data-code-copy]").zclip({
		path: _inky_app.theme_assets + '/js/zero_clipboard/ZeroClipboard.swf',
		copy: function(e) {
			if (_inky_app.is_user_logged) return $(this).data('code-copy');
			return '';
		},
		beforeCopy: function() {
			if (!_inky_app.is_user_logged) {
				$('#coupon_modal').modal({
					keyboard: false
				});
				return false;
			}
			return true;
		},
		afterCopy: function() {
			if (_inky_app.is_user_logged) {
				var w = $(this).outerWidth();
				var h = $(this).outerHeight();
				var o = $(this).text();

				$(this).css('width', w + 'px').css('height', h + 'px').css('line-height', '2px');
				$(this).html($('<span class="glyphicon glyphicon-ok"></span>').css('line-height', '4px')).append($('<span> COPIED</span>'));

				var self = this;
				setTimeout(function() {
					$(self).html(o).css('width', '').css('height', '').css('line-height', '');
				}, 2000);
			}
		}
	});

	//widget hover effect for the deal
	$('.deal_box')
		.on('mouseenter', function() {
			var div_overlay = $('<div class="deal_overlay"><div><a href="' + $('a:eq(0)', this).prop('href') + '" target="_top">View deal</a></div></div>')
			$(this).find('a:eq(0)').append(div_overlay);
			div_overlay.fadeIn('medium');
		}).on("mouseleave", function() {
			$(this).find('.deal_overlay').remove();
		});


	//dropdowns for the deal pages
	$("a[data-filter-dropdown]").popover({
		html: true,
		content: function() {
			return $($(this).data('filter-dropdown')).parent().html();
		},
		title: function() {
			return '';
		},
		trigger: 'focus',
		placement: 'bottom'
	});

	//"anchor" functionality ... used mostly for moving from a comments link to the actual comments
	$('a[data-tab-toggle]').click(function() {
		var tab = $(this).data('tab-toggle');
		var tabParent = $(this).data('tab-parent');
		$(tabParent).find('a[href=\'' + tab + '\']').tab('show');
		$('html, body').animate({
			scrollTop: $(tabParent).offset().top
		}, 1000);
		return false;
	});

	$('.dropdown').on('click', function() {
		$('#' + $(this).data('dropdown-target')).slideToggle('normal');
	});

	//handle events emitted by woocommerce js
	$('body').on('updated_checkout', function() {
		//handle tooltip update
		$('[data-toggle="tooltip"]').tooltip({
			placement: 'bottom',
			title: function() {
				return 'Expires in';
			}
		});
	});

	$('.checkout_billing_fields input, .checkout_billing_fields select').on('focus', function() {
		$(this).closest('p').addClass('active');
	});

	$('.checkout_billing_fields input, .checkout_billing_fields select').on('blur', function() {
		$(this).closest('p').removeClass('active');
	});

	// style the checkbox/radio inputs
	$('input[type=checkbox], input[type=radio]').customRadioCheck();

	// postmatic changes
	if($('#respond')) {
		$unsubscribe_div = $('.prompt-unsubscribe');
		$('#respond #commentform .user_comment_btns .btn.btn-info').before($unsubscribe_div);
		$('#prompt_comment_unsubscribe').attr('class', 'btn btn-danger');
	}

	//handle timer update on listings/homepage/single-product pages
	dealTimer = setInterval(function() {
		//cache the areas that need to be updated
		//this might need refactoring in case of infinite scroll plugin or ajax loading of content
		if (dealCache === null) dealCache = $('.deal_info');
		if (timerTables === null) timerTables = $('.timer_table');


		//var server_gmt_offset = (typeof _inky_app != 'undefined') ? parseInt(_inky_app.gmt_offset) : 0;
		//var local_date = new Date();
		//var local_gmt_offset = local_date.getTimezoneOffset() * 60000;

		if (dealCache !== null) {
			dealCache.each(function() {
				var remTime = $(this).data('remaining-time');

				if (remTime !== undefined && parseInt(remTime)) {

					var diff = remTime * 1000;
					var days = Math.floor(diff / (1000 * 60 * 60 * 24));
					diff -= days * (1000 * 60 * 60 * 24);
					var hours = Math.floor(diff / (1000 * 60 * 60));
					diff -= hours * (1000 * 60 * 60);
					var mins = Math.floor(diff / (1000 * 60));
					diff -= mins * (1000 * 60);
					var seconds = Math.floor(diff / (1000));
					diff -= seconds * (1000);


					var update_elm = $(this).find('.time-show');
					if (remTime == 0) {
						update_elm.html('Expired');
					} else {
						if (days <= 0) {
							update_elm.html(' ' + hours + 'h: ' + mins + 'm: ' + seconds + 's');
						} else {
							if (days > 20) {
								update_elm.html('Exp. soon');
							} else {
								update_elm.html(days + ' days');
							}
						}
					}
					$(this).data('remaining-time', remTime - 1);
				} else {
					$(this).find('.time-show:first-child').html('Expired');
				}
			});
		}

		if (timerTables !== null) {
			timerTables.each(function() {
				var remTime = $(this).data('time-remaining');
				var elTg = $(this).find('.timer-show');
				var tbl = $(this);

				if (remTime !== undefined && parseInt(remTime) > 0) {

					if (remTime <= 60 * 60 * 24 * 365) {
						if (tbl.is(':hidden')) {
							tbl.show();
							tbl.parent().find('.expiring-soon').remove();
						}

						var diff = new Date(remTime * 1000);
						var days = Math.floor(diff / (1000 * 60 * 60 * 24));
						diff -= days * (1000 * 60 * 60 * 24);
						var hours = Math.floor(diff / (1000 * 60 * 60));
						diff -= hours * (1000 * 60 * 60);
						var mins = Math.floor(diff / (1000 * 60));
						diff -= mins * (1000 * 60);
						var seconds = Math.floor(diff / (1000));
						var content = days.toString().pad(2, '0') + 'd: ' + hours.toString().pad(2, '0') + 'h: ' + mins.toString().pad(2, '0') + 'm: ' + seconds.toString().pad(2, '0') + 's';
						elTg.text(content);
						diff -= seconds * (1000);

						$(this).data('time-remaining', remTime - 1);
					} else {
						if (tbl.is(":visible")) tbl.hide();
						var w = tbl.parent().find('.expiring-soon');
						if (w.length == 0)
							var d = $('<div class="expiring-soon"><span>EXPIRING SOON</span></div>');
						else d = w.first();
						tbl.parent().append(d);
					}
				} else {
					tbl.parent().html('<div class="expiring-soon"><span>DEAL EXPIRED</span></div>');
				}
			});
		}

		if (dealCache === null && timerTables === null) clearInterval(dealTimer);

	}, 1000);

	$('.dropdown').on('show.bs.dropdown', function(e) {
		$(this).find('.dropdown-menu').first().stop(true, true).slideDown(50);
		$(this).find('input[type=text]:eq(0)').focus();
	});

	// slideup animation on drodown
	$('.dropdown').on('hide.bs.dropdown', function(e) {
		$(this).find('.dropdown-menu').first().stop(true, true).slideUp(50);
	});

	$('.dropdown-toggle').dropdown();

	// Fix input element click problem
	$('.dropdown input, .dropdown label').click(function(e) {
		e.stopPropagation();
	});

	var offset = $(".navbar").offset();

	//sticky topbar functionality
	$(window).scroll(function() {
		if ($(document).scrollTop() > offset.top) {
			$('.navbar').addClass('fixed');
			$('.to-top').fadeIn('medium');
		} else {
			$('.navbar').siblings('div:visible').first().prop('style', '');
			$('.navbar').removeClass('fixed');
			$('.to-top').fadeOut('medium');
		}
	});

	$('.to-top-char').on('click', function() {
		$('html,body').animate({
			scrollTop: 0
		}, 350);
	});

	//show/hide top search functionality
	$('#search_ui_btn').on('click', function() {
		var targetElm = $($(this).data('ui-show'));
		if (targetElm.is(":hidden")) {
			var guideElm = $('.navbar');
			var guideOfs = guideElm.offset();
			var elmPos = guideOfs.top;
			targetElm.css('display', 'block').css('top', elmPos).animate({
				height: '65px',
				opacity: 1
			}, 300);
		} else {
			targetElm.animate({
				height: '-=90px',
				opacity: 0
			}, 300, function() {
				$(this).css('display', 'none')
			});
		}

	});


	// fix order pay height
	function order_pay_fix() {
		var wHe = $(window).height();
		var pWa = $('#page_wrapper').height();

		if ($('.copyright_notice').hasClass('order-pay-fix')) {
			if (wHe < pWa) {
				$('.copyright_notice.order-pay-fix').removeClass('order-pay-fix');
			} else {
				$('.copyright_notice').addClass('order-pay-fix');
			}
		}
	}

	order_pay_fix();
	$(window).resize(function() {
		order_pay_fix();
	});


	/* contentModal BEGIN */
	$('#tab-description a img').each(function() {
		var link = $(this).parent().attr('href');
		var checkExtension = /\.(jpe?g|png|gif)$/g;
		if (checkExtension.test(link)) {
			$(this).parent().attr('data-toggle', 'modal');
			$(this).parent().attr('data-target', '#contentModal');
			$(this).parent('a').addClass('overlay');
		}
	});
	$('#contentModal').on('show.bs.modal', function(event) {
		var button = $(event.relatedTarget);
		var link = button.attr('href');
		$(this).append('<img src="' + link + '" />');
	});
	$('#contentModal').on('hide.bs.modal', function(event) {
		$(this).find('img').remove();
	});
	/* contentModal END */


	// fix location confirmation checkbox
	$('#location_confirmation').click(function() {
		$(this).parent().find('.custom-check').toggleClass('checked', $(this).attr('checked'));
	});

	$(document).on('click', '.gfield_checkbox span.custom-check', function() {
		$(this).closest('input[type="checkbox"]').click();
		//console.log(114322);
	});

});
