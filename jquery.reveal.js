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
        var modalLocation = $(this).attr('data-reveal-id');
        $('#'+modalLocation).reveal($(this).data());
    });

/*---------------------------
 Extend and Execute
----------------------------*/

    $.fn.reveal = function(options) {
        
        
        var defaults = {  
            animation: 'fadeAndPop', // fade, fadeAndPop, none
            animationSpeed: 300, // how fast animtions are
            closeOnBackgroundClick: true, // if you click background will modal close?
            closeOnEscapeKey: true, // if you press the Escape key will modal close?,
            onClose: function(){},
            dismissModalClass: 'close-reveal-modal' // the class of a button or element that will close an open modal
        }; 
        
        // Extend dem' options
        options = $.extend(defaults, options); 
    
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
 Create Modal BG
----------------------------*/
            if(!modalBG.length) {
                modalBG = $('<div class="reveal-modal-bg" />').insertAfter(modal);
            }           
            
/*---------------------------
 Open and add Closing Listeners
----------------------------*/
            // Open Modal Immediately
            openModal();
            
            // Close Modal Listeners
            var closeButton = $('.' + options.dismissModalClass).bind('click.modalEvent', closeModal);
            
            if(options.closeOnBackgroundClick) {
                modalBG.css({"cursor":"pointer"});
                modalBG.bind('click.modalEvent', closeModal);
            }
            
            if(options.closeOnEscapeKey) {
                $(document).bind('keyup.modalEvent', function(event){
                    if(event.which == 27) {
                        closeModal();
                    }
                });
            }
            
/*---------------------------
 Open & Close Animations
----------------------------*/
            // Entrance Animations
            function openModal() {
                modalBG.unbind('click.modalEvent');
                $('.' + options.dismissModalClass).unbind('click.modalEvent');
                $(document).unbind('keyup.modalEvent');
                
                if(!locked) {
                    lockModal();
                    if(options.animation == "fadeAndPop") {
                        modal.css({
                            'top': $(document).scrollTop() - topOffset, 
                            'opacity': 0, 
                            'visibility': 'visible'
                        });
                        
                        modalBG.fadeIn(options.animationSpeed / 2);
                        modal.delay(options.animationSpeed / 2).animate({
                            "top": $(document).scrollTop() + topMeasure,
                            "opacity": 1
                        }, options.animationSpeed, unlockModal);                    
                    } else if(options.animation == "fade") {
                        modal.css({
                            'opacity': 0, 
                            'visibiliy': 'visible', 
                            'top': $(document).scrollTop() + topMeasure
                        });
                        
                        modalBG.fadeIn(options.animationSpeed / 2);
                        modal.delay(options.animationSpeed / 2).animate({"opacity": 1}, options.animationSpeed, unlockModal);                    
                    } else if(options.animation == "none") {
                        modal.css({
                            'visibility': 'visible', 
                            'top': $(document).scrollTop() + topMeasure
                        });
                        
                        modalBG.css({"display": "block"});   
                        unlockModal();          
                    }   
                }
            }       
            
            // Closing Animation
            function closeModal() {
                if(!locked) {
                    lockModal();
                    
                    var afterAnimation = function(){
                        modal.css({
                            'opacity': 1, 
                            'visibility': 'hidden', 
                            'top': topMeasure
                        });
                        
                        unlockModal();
                        options.onClose(this);
                    }
                    
                    if(options.animation == "fadeAndPop") {
                        modalBG.delay(options.animationSpeed).fadeOut(options.animationSpeed);

                        modal.animate({
                            "top":  $(document).scrollTop() - topOffset,
                            "opacity" : 0
                        }, options.animationSpeed / 2, afterAnimation);                   
                    } else if(options.animation == "fade") {
                        modalBG.delay(options.animationSpeed).fadeOut(options.animationSpeed);
                        
                        modal.animate({"opacity" : 0}, options.animationSpeed, afterAnimation);                 
                    } else if(options.animation == "none") {
                        modal.css({
                            'visibility': 'hidden', 
                            'top': topMeasure
                        });
                        
                        modalBG.css({'display': 'none'});  
                        options.onClose(this);
                    }               
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
            
        });
    };
})(jQuery);
        