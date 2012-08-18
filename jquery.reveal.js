/*
 * jQuery Reveal Plugin 1.0
 * www.ZURB.com
 * Copyright 2010, ZURB
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
*/
jQuery.fn.center = function () {
  var $ = jQuery; // handle no conflict mode
  var oWin = $(window);
  this.css({
    'position':'absolute',
    'top':Math.abs(((oWin.height() - this.outerHeight()) / 2) + oWin.scrollTop()),
    'left':Math.abs(((oWin.width() - this.outerWidth()) / 2) + oWin.scrollLeft())
  });
  return this;
};

(function($) {

/*---------------------------
 Defaults for Reveal
----------------------------*/
   
/*---------------------------
 Listener for data-reveal-id attributes
----------------------------*/

	$('a[data-reveal-id]').live('click', function(e) {
		e.preventDefault();
		var modalLocation = $(this).attr('data-reveal-id');
		$('#'+modalLocation).reveal($(this).data());
	});

/*---------------------------
 Extend and Execute
----------------------------*/

    $.fn.reveal = function(options) {
        
        
        var defaults = {  
	    	animation: 'fadeAndPop', //fade, fadeAndPop, none
		    animationspeed: 300, //how fast animtions are
		    closeonbackgroundclick: true, //if you click background will modal close?
		    dismissmodalclass: 'close-reveal-modal' //the class of a button or element that will close an open modal
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
/*--------------------------*/

			if($('.reveal-modal').length > 1) {
				var index_highest = 0;
				$('.reveal-modal').each(function(){
					var index_current = parseInt($(this).css("z-index"), 10);
					if(index_current > index_highest) {
						index_highest = index_current;
					}
				});
				modal.css('z-index',index_highest + 2);
			};
/*---------------------------
 Create Modal BG
----------------------------*/
			/*if(modalBG.length == 0) {
				modalBG = $('<div class="reveal-modal-bg" />').insertAfter(modal);
			}*/		    
			if(modalBG.length == 0) {
				modalBG = $('<div class="reveal-modal-bg" />').insertAfter(modal);
			} else  {
				modalBG.css('z-index',modal.css('z-index')-1);
			}     
/*---------------------------
 Open & Close Animations
----------------------------*/
			//Entrance Animations
			modal.bind('reveal:open', function () {
			  modalBG.unbind('click.modalEvent');
				//$('.' + options.dismissmodalclass).unbind('click.modalEvent');
				if(!locked) {
					lockModal();
					if(options.animation == "fadeAndPop") {
						modal.css({'top': $(document).scrollTop()-topOffset, 'opacity' : 0, 'visibility' : 'visible'});
						modalBG.fadeIn(options.animationspeed/2);
						modal.delay(options.animationspeed/2).animate({
							"top": $(document).scrollTop()+topMeasure + 'px',
							"opacity" : 1
						}, options.animationspeed,unlockModal());					
					}
					modal.center();
					if(options.animation == "fade") {
						modal.css({'opacity' : 0, 'visibility' : 'visible'}); //, 'top': $(document).scrollTop()+topMeasure
						modalBG.fadeIn(options.animationspeed/2);
						modal.delay(options.animationspeed/2).animate({
							"opacity" : 1
						}, options.animationspeed,unlockModal());					
					} 
					if(options.animation == "none") {
						modal.css({'visibility' : 'visible', 'top':$(document).scrollTop()+topMeasure});
						modalBG.css({"display":"block"});	
						unlockModal()				
					}
				}
				modal.unbind('reveal:open');
			}); 	

			//Closing Animation
			modal.bind('reveal:close', function () {
			  if(!locked) {
					lockModal();
					if(options.animation == "fadeAndPop") {
						if($('.reveal-modal').length == 1) modalBG.delay(options.animationspeed).fadeOut(options.animationspeed);
						modal.animate({
							"top":  $(document).scrollTop()-topOffset + 'px',
							"opacity" : 0
						}, options.animationspeed/2, function() {
							modal.css({'top':topMeasure, 'opacity' : 1, 'visibility' : 'hidden'});
							unlockModal();
						});					
					}  	
					if(options.animation == "fade") {
						if($('.reveal-modal').length == 1) modalBG.delay(options.animationspeed).fadeOut(options.animationspeed);
						modal.animate({
							"opacity" : 0
						}, options.animationspeed, function() {
							modal.css({'opacity' : 1, 'visibility' : 'hidden', 'top' : topMeasure});
							unlockModal();
						});					
					}  	
					if(options.animation == "none") {
						modal.css({'visibility' : 'hidden', 'top' : topMeasure});
						if($('.reveal-modal').length == 1) modalBG.css({'display' : 'none'});	
					}		
				}
				modal.remove();
				if($('.reveal-modal').length > 0) {
					var index_highest = 0;
					$('.reveal-modal').each(function(){
						var index_current = parseInt($(this).css("z-index"), 10);
						if(index_current > index_highest) {
							index_highest = index_current;
						}
					});
					modalBG.css('z-index',index_highest -1);
				} else {			
					modalBG.remove();
				}
				modal.unbind('reveal:close');	
			});     
   	
/*---------------------------
 Open and add Closing Listeners
----------------------------*/
        	//Open Modal Immediately
    	modal.trigger('reveal:open')
			
			//Close Modal Listeners
			var closeButton = $('.' + options.dismissmodalclass).not('.binded').each(function(index) {
				$(this).addClass('binded');
				$(this).bind('click.modalEvent', function () {
					  modal.trigger('reveal:close')
					  //$('.reveal-modal').trigger('reveal:close')
					});
			});
			if(options.closeonbackgroundclick) {
				modalBG.css({"cursor":"pointer"})
				modalBG.bind('click.modalEvent', function () {
				  modal.trigger('reveal:close')
				});
			}
			$('body').keyup(function(e) {
        		if(e.which===27){ modal.trigger('reveal:close'); } // 27 is the keycode for the Escape key
			});
			
			
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
        
