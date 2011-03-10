/*
 * Dojo Reveal Plugin 1.0
 * www.ZURB.com
 * Copyright 2010, ZURB
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
*/


dojo.require("dijit._Widget");
dojo.require("dojo.parser");

dojo.addOnLoad(function () {
  dojo.declare("ZURB.Reveal", [dijit._Widget], {
    
    animation: 'fadeAndPop', //fade, fadeAndPop, none
    animationspeed: 300, //how fast animtions are
    closeonbackgroundclick: true, //if you click background will modal close?
    dismissmodalclass: 'close-reveal-modal', //the class of a button or element that will close an open modal
    locked: false,
    modalId: '',
    connections: [],
  
    postCreate: function () {      
      this.modal = dojo.byId(this.modalId);
      this.modalBG = dojo.query('.reveal-modal-bg');
      
      if (this.modalBG.length === 0) {
        dojo.place('<div class="reveal-modal-bg"></div>', this.modal, 'after');
        this.modalBG = dojo.query('.reveal-modal-bg');
			}
			
      this.connect(this.domNode, 'onclick', 'openModal');
      
    },
    
    openModal: function () {
      this.topMeasure = dojo.marginBox(this.modal).t;
      this.topOffset = dojo.position(this.modal).h + this.topMeasure;
      
      dojo.query('.' + this.dismissmodalclass).forEach(dojo.hitch(this, 'connectCloseModal'));
      
      if (this.closeonbackgroundclick) {
			  this.modalBG.style('cursor', 'pointer');
			  this.connections.push(this.connect(this.modalBG[0], 'onclick', 'closeModal'));
			}
			
      this.animate();
    },
    
    connectCloseModal: function (closeElement) {
      this.connections.push(this.connect(closeElement, 'onclick', 'closeModal'));
    },
    
    closeModal: function () {
      dojo.forEach(this.connections, dojo.hitch(this, 'disconnect'));
      if(!this.locked) {
				this.lockModal();
				switch (this.animation) {
				  case "none":
				    this.closeNone();
				    break;
				  case "fadeAndPop":
				    this.closeFadeAndPop();
				    break;
			    case "fade":
				    this.closeFade();
				    break;
				  default:
				}			
			}
    },
    
    animate: function () {
			if (!this.locked) {
				this.lockModal();
				switch (this.animation) {
				  case "none":
				    this.animateNone();
				    break;
				  case "fadeAndPop":
				    this.animateFadeAndPop();
				    break;
			    case "fade":
				    this.animateFade();
				    break;
				  default:
				}
			}
    },
    
    animateFadeAndPop: function () {
      dojo.style(this.modal, {
        'top': dojo._docScroll().y - this.topOffset + 'px',
        'opacity' : 0,
        'visibility' : 'visible'
      });

      this.modalBG.style({'display': 'block', 'opacity': 0});
      dojo.fadeIn({
        node: this.modalBG[0],
        duration: this.animationspeed / 2
      }).play();

      dojo.animateProperty({
        node: this.modal,
        properties: {
          top: dojo._docScroll().y + this.topMeasure,
          opacity : 1
        },
        duration: this.animationspeed,
        onEnd: dojo.hitch(this, "unlockModal"),
        delay: (this.animationspeed / 2)
      }).play();
    },
    
    closeFadeAndPop: function () {
      dojo.fadeOut({
        node: this.modalBG[0],
        duration: this.animationspeed,
        delay: this.animationspeed,
        onEnd: dojo.hitch(this, 'hideOverlay')
      }).play();
      
      dojo.animateProperty({
        node: this.modal,
        properties: {
          top:  dojo._docScroll().y - this.topOffset,
          opacity: 0
        },
        duration: this.animationspeed / 2,
        onEnd: dojo.hitch(this, 'closeFadeAndPopComplete')
      }).play();
    },
    
    closeFadeAndPopComplete: function () {
      dojo.style(this.modal, {
        top: this.topMeasure + 'px', 
        opacity : 1,
        visibility : 'hidden'
      });
      this.unlockModal();
    },
    
    animateFade: function () {
      this.modalBG.style({'display': 'block', 'opacity': 0});
      dojo.style(this.modal, {
        'opacity' : 0,
        'visibility' : 'visible',
        'top': dojo._docScroll().y + this.topMeasure + 'px'
      });

			dojo.fadeIn({
			  node: this.modalBG[0],
			  duration: this.animationspeed / 2
			}).play();
			dojo.animateProperty({
			  node: this.modal,
			  properties: {
			    "opacity" : 1
			  },
			  duration: this.animationspeed,
			  delay: this.animationspeed / 2,
			  onEnd: dojo.hitch(this, "unlockModal")
			}).play();
    },
    
    closeFade: function () {
      dojo.fadeOut({
        node: this.modalBG[0],
        duration: this.animationspeed,
        delay: this.animationspeed,
        onEnd: dojo.hitch(this, "hideOverlay")
      }).play();
      
      dojo.animateProperty({
        node: this.modal,
        properties: {
          "opacity" : 0
        },
        duration: this.animationspeed,
        onEnd: dojo.hitch(this, "closeFadeComplete")
      }).play();
    },
    
    closeFadeComplete: function () {
      dojo.style(this.modal, {
        'opacity' : 1,
        'visibility' : 'hidden',
        'top' : this.topMeasure + 'px'
      });
			this.unlockModal();
    },

    hideOverlay: function () {
      this.modalBG.style({'display': 'none'});
    },
    
    animateNone: function () {
      dojo.style(this.modal, {
        visibility: 'visible',
        top: dojo._docScroll().y + this.topMeasure
      });
			this.modalBG.style({
			  "display": "block",
			  "opacity": 1
			});	
			this.unlockModal();
    },
    
    closeNone: function () {
      dojo.style(this.modal, {
        visibility: 'hidden',
        top: this.topMeasure
      });
      this.modalBG.style("display", "none");
      this.unlockModal();
    },
    
    lockModal: function () {
      this.locked = true;
    },
    
    unlockModal: function () {
      this.locked = false;
    }
    
  });


  // Call the parser manually so it runs after the widget is defined
  dojo.parser.parse();
});