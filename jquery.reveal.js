/*
 * jQuery Reveal Plugin 1.0
 * www.ZURB.com
 * Copyright 2010, ZURB
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
*/


(function ($) {
    $('a[data-modal-id]').live('click', function (event) {
        event.preventDefault();
        var modalLocation = $(this).attr('data-modal-id');
        $('#' + modalLocation).modal($(this).data());
    });

    $.fn.modal = function (options) {
        var defaults = {
            animation: 'fadeAndPop',                // fade, fadeAndPop, none
            animationSpeed: 300,                    // how fast animtions are
            closeOnBackgroundClick: true,           // if you click background will modal close?
            dismissModalClass: 'close-modal', // the class of a button or element that will close an open modal
            scrollWithPage: true, //forces the modal to scroll when the user does
            useEscapeKey: true
        };
        var options = $.extend({}, defaults, options);

        return this.each(function () {
            var modal = $(this),
                    topMeasure = parseInt(modal.css('top')),
                    topOffset = modal.height() + topMeasure,
                    locked = false,
                    modalBg = $('.modal-bg');

            if (modalBg.length == 0) {
                modalBg = $('<div class="modal-bg" />').insertAfter(modal);
                modalBg.fadeTo('fast', 0.8);
            }

            function openAnimation() {
                modalBg.unbind('click.modalEvent');
                $('.' + options.dismissModalClass).unbind('click.modalEvent');
                if (!locked) {
                    lockModal();
                    if (options.animation == "fadeAndPop") {
                        modal.css({'top': ($(document).scrollTop() - topOffset), 'opacity': 0, 'visibility': 'visible', 'display': 'block'});
                        modalBg.fadeIn(options.animationSpeed / 2);
                        modal.delay(options.animationSpeed / 2).stop().animate({
                            "top": $(document).scrollTop() + topMeasure + 'px',
                            "opacity": 1
                        }, options.animationSpeed, unlockModal);
                    }
                    if (options.animation == "fade") {
                        modal.css({'opacity': 0, 'visibility': 'visible', 'top': $(document).scrollTop() + topMeasure});
                        modalBg.fadeIn(options.animationSpeed / 2);
                        modal.delay(options.animationSpeed / 2).animate({
                            "opacity": 1
                        }, options.animationSpeed, unlockModal);
                    }
                    if (options.animation == "none") {
                        modal.css({'visibility': 'visible', 'top': $(document).scrollTop() + topMeasure});
                        modalBg.css({"display": "block"});
                        unlockModal();
                    }
                    if (options.scrollWithPage) {
                        $(window).scroll(function() {
                            var top = jQuery(window).scrollTop();
                            modal.stop().animate({"top": top}, options.animationSpeed);
                        })
                    }
                }
                modal.unbind('modal:open', openAnimation);
            }

            modal.bind('modal:open', openAnimation);

            function closeAnimation() {
                if (!locked) {
                    lockModal();
                    if (options.scrollWithPage) {
                        $(window).unbind("scroll");
                    }
                    if (options.animation == "fadeAndPop") {
                        modalBg.delay(options.animationSpeed).fadeOut(options.animationSpeed);
                        modal.stop().animate({
                            "top":  ($(document).scrollTop() - topOffset) + 'px',
                            "opacity": 0
                        }, options.animationSpeed / 2, function () {
                            modal.css({'top': topMeasure, 'opacity': 1, 'visibility': 'hidden', 'display':'none'});
                            unlockModal();
                        });
                    }
                    if (options.animation == "fade") {
                        modalBg.delay(options.animationSpeed).fadeOut(options.animationSpeed);
                        modal.stop().animate({
                            "opacity" : 0
                        }, options.animationSpeed, function () {
                            modal.css({'opacity': 1, 'visibility': 'hidden', 'display':'none', 'top': topMeasure});
                            unlockModal();
                        });
                    }
                    if (options.animation == "none") {
                        modal.css({'visibility': 'hidden', 'top': topMeasure});
                        modalBg.css({'display': 'none'});
                    }
                }
                modal.unbind('modal:close', closeAnimation);
            }

            modal.bind('modal:close', closeAnimation);
            modal.trigger('modal:open');

            var closeButton = $('.' + options.dismissModalClass).bind('click.modalEvent', function () {
                modal.trigger('modal:close');
            });

            if (options.closeOnBackgroundClick) {
                modalBg.css({"cursor": "pointer"});
                modalBg.bind('click.modalEvent', function () {
                    modal.trigger('modal:close');
                });
            }

            if (options.useEscapeKey) {
                $('body').keyup(function (event) {
                    if (event.which === 27) { // 27 is the keycode for the Escape key
                        modal.trigger('modal:close');
                    }
                });
            }
            function unlockModal() {
                locked = false;
            }

            function lockModal() {
                locked = true;
            }
        });
    };
})(jQuery);