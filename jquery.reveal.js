/*
 * jQuery Reveal Plugin 1.0
 * www.ZURB.com
 * Copyright 2010, ZURB
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
*/


(function($) {

/*---------------------------
 Defaults for Reveal
----------------------------*/

/*---------------------------
 Listener for data-reveal-id attributes
----------------------------*/

	$('a[data-reveal-id]').live('click', function(e) {
	  e.preventDefault();
	  var modalId = $(this).data('reveal-id');

	  // Add ajax pulling
	  if ($(this).data('url')) {

	    // Should we load the modal within a different container?
	    var loadWithin = ( $(this).data('reveal-loadwithin') ? $(this).data('reveal-loadwithin') : 'body');

      // If there isn't a pen yet, make one
      if (!$('#reveal-pen').length) { $(loadWithin).append('<div id="reveal-pen"></div>'); }

      if ($('#'+modalId).length) {
        // Kill any previous versions of the content, if it exists, and make sure it's in the pen
        $('#'+modalId).empty().appendTo('#reveal-pen');
      } else {
        // If the modal doesn't exist, create it
        $('#reveal-pen').append('<div style="display:none;" id="'+modalId+'" class="reveal-modal"></div>');
      }
    }

	  // Start the revealer
		$('#'+modalId).reveal($(this).data());
	});

/*---------------------------
 Extend and Execute
----------------------------*/

    $.fn.reveal = function(options) {
        var defaults = {
	    	animation: 'fadeAndPop', //fade, fadeAndPop, none
		    animationspeed: 300, //how fast animtions are
		    closeonbackgroundclick: true, //if you click background will modal close?
		    closeonescapekey: true, //if you press escape will modal close?
		    dismissmodalclass: 'close-reveal-modal', //the class of a button or element that will close an open modal
		    url: false, //optional url for pulling content via ajax
		    ajaxloaderimage: '/images/ajax-loader.gif' //optional path to ajax loader spinny thing
    	};

        //Extend dem' options
        var options = $.extend({}, defaults, options);
        return this.each(function() {

/*---------------------------
 Global Variables
----------------------------*/
        	var modal = $(this),
        		topMeasure  = parseInt(modal.css('top')),
				    topOffset = modal.height() + topMeasure,
          	locked = false,
				    modalBG = $('.reveal-modal-bg');

/*---------------------------
 Ajax Loader Image
----------------------------*/
          if (options.url) {
      	    // Open the ajax loader box
      	    modal.append('<img src="'+options.ajaxloaderimage+'" border="0" alt="" class="reveal-loader" />');
      	  }

/*---------------------------
 Create Modal BG
----------------------------*/
			    if(modalBG.length == 0) {
				    modalBG = $('<div class="reveal-modal-bg" />').insertAfter(modal);
			    }

/*---------------------------
 Open & Close Animations
----------------------------*/
    			//Entrance Animations
    			modal.bind('reveal:open', function () {
    			  modalBG.unbind('click.modalEvent');
    				$('.' + options.dismissmodalclass).unbind('click.modalEvent');
    				if(!locked) {
    					lockModal();
    					if(options.animation == "fadeAndPop") {
    						modal.css({'top': $(document).scrollTop()-topOffset, 'opacity' : 0, 'visibility' : 'visible', 'display' : 'block' });
    						modalBG.fadeIn(options.animationspeed/2);
    						modal.delay(options.animationspeed/2).animate({
    							"top": $(document).scrollTop()+topMeasure + 'px',
    							"opacity" : 1
    						}, options.animationspeed,unlockModal(), function() {
    						  loadContent();
    						});
    					} else if(options.animation == "fade") {
    						modal.css({'opacity' : 0, 'visibility' : 'visible', 'display' : 'block', 'top': $(document).scrollTop()+topMeasure});
    						modalBG.fadeIn(options.animationspeed/2);
    						modal.delay(options.animationspeed/2).animate({
    							"opacity" : 1
    						}, options.animationspeed,unlockModal(), function() {
    						  loadContent();
    						});
    					} else if(options.animation == "none") {
    						modal.css({'visibility' : 'visible', 'display' : 'block', 'top':$(document).scrollTop()+topMeasure});
    						modalBG.css({"display":"block"});
    						loadContent();
    						unlockModal();
    					}
    				}
    				modal.unbind('reveal:open');
    			});

    			//Closing Animation
    			modal.bind('reveal:close', function () {
    			  if(!locked) {
    					lockModal();
    					if(options.animation == "fadeAndPop") {
    						modalBG.delay(options.animationspeed).fadeOut(options.animationspeed);
    						modal.animate({
    							"top":  $(document).scrollTop()-topOffset + 'px',
    							"opacity" : 0
    						}, options.animationspeed/2, function() {
    							modal.css({'top':topMeasure, 'opacity' : 1, 'visibility' : 'hidden'});
    							unlockModal();
    						});
    					} else if(options.animation == "fade") {
    						modalBG.delay(options.animationspeed).fadeOut(options.animationspeed);
    						modal.animate({ 'opacity' : 0}, options.animationspeed).fadeOut(options.animationspeed, function() {
    						  modal.css({'visibility' : 'hidden', 'top' : topMeasure});
    						})
    					} else if(options.animation == "none") {
    						modal.css({'visibility' : 'hidden', 'top' : topMeasure});
    						modalBG.css({'display' : 'none'});
    					}
    				}
    				modal.unbind('reveal:close');
    			});

/*---------------------------
 Open and add Closing Listeners
----------------------------*/
          //Open Modal Immediately
        	modal.trigger('reveal:open')

    			if(options.closeonbackgroundclick) {
    				modalBG.css({"cursor":"pointer"})
    				modalBG.bind('click.modalEvent', function () {
    				  modal.trigger('reveal:close')
    				});
    			}

    			if (options.closeonescapekey) {
    			  $('body').keyup(function(e) {
              if(e.which===27){ modal.trigger('reveal:close'); } // 27 is the keycode for the Escape key
      			});
      		}

      		modal.find('.' + options.dismissmodalclass).live('click.modalEvent', function () {
      		  modal.trigger('reveal:close')
      		});

/*---------------------------
 Load Content (basically load via ajax, or do nothing)
----------------------------*/
          function loadContent() {
            if (options.url) {
              modal.append('<div style="display:none;" class="reveal-effect-container"></div>').contents('.reveal-effect-container').load(options.url, function() {
          	    modal.find('.reveal-loader').fadeOut('fast',function() {
          	      $(this).remove();
          	      // Effects
          	      if (options.animation == "fade" || options.animation == "fadeAndPop") {
          	        modal.contents('.reveal-effect-container').fadeIn(function() {
            	        $(this).contents().unwrap();
            	      });
            	    } else {
            	      modal.contents('.reveal-effect-container').show().contents().unwrap();
            	    }
          	      modal.trigger('reveal:complete');
          	    });
          	  });
          	} else {
          	  modal.trigger('reveal:complete');
          	}
          }


/*---------------------------
 Animations Locks
----------------------------*/
    			function unlockModal() {
    				locked = false;
    			}
    			function lockModal() {
    				locked = true;
    			}

        });//each call
    }//orbit plugin call
})(jQuery);

