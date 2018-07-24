/**
 * demo.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2018, Codrops
 * http://www.codrops.com
 */
{
	// From https://davidwalsh.name/javascript-debounce-function.
	function debounce(func, wait, immediate) {
		var timeout;
		return function() {
			var context = this, args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	};

	let winsize = {width: window.innerWidth, height: window.innerHeight};

	const DOM = {
		intro: document.querySelector('.intro'),
		slideshowImagesWrappers: document.querySelectorAll('.slideshow__item-img'),
		slideshowImages: document.querySelectorAll('.slideshow__item-img-inner')
	};

	class Panel {
		constructor(el) {
			this.DOM = {el: el};

			this.DOM.logo = DOM.intro.querySelector('.intro__logo');
			this.DOM.logoImg = this.DOM.logo.querySelector('.icon--arrowup');
			this.DOM.enter = DOM.intro.querySelector('.intro__enter');

			this.animatableElems = Array.from(DOM.intro.querySelectorAll('.animatable')).sort(() => 0.5 - Math.random());

			// set layout
			this.boxRect = this.DOM.el.getBoundingClientRect();
			this.layout();

			this.isOpen = true;
			this.initEvents();
		}
		layout() {
			this.DOM.el.style.transform = `scaleX(${winsize.width/this.boxRect.width}) scaleY(${winsize.height/this.boxRect.height})`;
			document.body.classList.remove('loading');
		}
		initEvents() {
			this.DOM.enter.addEventListener('click', (ev) => {
				ev.preventDefault();
				this.close();
			});

			this.DOM.logo.addEventListener('click', (ev) => {
				ev.preventDefault();
				this.open();
			});

			// Window resize
			this.onResize = () => {
				winsize = {width: window.innerWidth, height: window.innerHeight};
				if ( this.isOpen ) {
					this.layout();
				}
			};
			window.addEventListener('resize', debounce(() => this.onResize(), 10));
		}
		open() {
			if ( this.isOpen || this.isAnimating ) return;
			this.isOpen = true;
			this.isAnimating = true;

			DOM.intro.style.pointerEvents = 'auto';

			anime.remove(this.DOM.logoImg);
			anime({
				targets: this.DOM.logoImg,
				translateY: [{value: '-400%', duration: 200, easing: 'easeOutQuad'}, {value: ['200%', '0%'], duration: 700, easing: 'easeOutExpo'}]
			});

			anime.remove(this.animatableElems);
			anime({
				targets: this.animatableElems,
				duration: 1200,
				delay: (t,i) => 350 + i*30,
				easing: 'easeOutExpo',
				translateX: '0%',
				opacity: {
					value: 1,
					easing: 'linear',
					duration: 400
				}
			});

			const boxRect = this.DOM.el.getBoundingClientRect();
			anime.remove(this.DOM.el);
			anime({
				targets: this.DOM.el,
				scaleX: {value: winsize.width/boxRect.width, duration: 700, delay: 300, easing: 'easeOutExpo'},
				scaleY: {value: winsize.height/boxRect.height, duration: 300, easing: 'easeOutQuad'},
				complete: () => this.isAnimating = false
			});
		}
		close() {
			if ( !this.isOpen || this.isAnimating ) return;
			this.isOpen = false;
			this.isAnimating = true;

			DOM.intro.style.pointerEvents = 'none';

			anime.remove(this.DOM.logoImg);
			anime({
				targets: this.DOM.logoImg,
				translateY: [{value: '-400%', duration: 300, easing: 'easeOutQuad'}, {value: ['200%', '0%'], duration: 700, easing: 'easeOutExpo'}],
				rotate: [{value: 0, duration: 300}, {value: [90,0], duration: 1300, easing: 'easeOutElastic'}]
			});

			anime.remove(this.animatableElems);
			anime({
				targets: this.animatableElems,
				duration: 150,
				easing: 'easeOutQuad',
				translateX: '-30%',
				opacity: 0
			});

			anime.remove(this.DOM.el);
			anime({
				targets: this.DOM.el,
				duration: 1000,
				scaleX: {value: 1, duration: 300, easing: 'easeOutQuad'},
				scaleY: {value: 1, duration: 700, delay: 300, easing: 'easeOutExpo'},
				complete: () => this.isAnimating = false
			});

			anime.remove(DOM.slideshowImages);
			anime({
				targets: DOM.slideshowImages,
				duration: 1000,
				delay: (t,i) => i*60,
				easing: 'easeOutCubic',
				scale: [1.5,1]
			});
			anime.remove(DOM.slideshowImagesWrappers);
			anime({
				targets: DOM.slideshowImagesWrappers,
				duration: 1000,
				delay: (t,i) => i*60,
				easing: 'easeOutCubic',
				translateY: ['10%','0%']
			});
		}
	}

	const panel = new Panel(DOM.intro.querySelector('.intro__box'));
}


/**
 * demo.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2018, Codrops
 * http://www.codrops.com
 */
{
    const lineEq = (y2, y1, x2, x1, currentVal) => {
        // y = mx + b
        var m = (y2 - y1) / (x2 - x1), b = y1 - m * x1;
        return m * currentVal + b;
    };

    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const getRandomFloat = (min, max) => (Math.random() * (max - min) + min).toFixed(2);

    const setRange = (obj) => {
        for(let k in obj) {
            if( obj[k] == undefined ) {
                obj[k] = [0,0];
            }
            else if( typeof obj[k] === 'number' ) {
                obj[k] = [-1*obj[k],obj[k]];
            }
        }
    };

    // from http://www.quirksmode.org/js/events_properties.html#position
	const getMousePos = (e) => {
        let posx = 0;
        let posy = 0;
		if (!e) e = window.event;
		if (e.pageX || e.pageY) 	{
			posx = e.pageX;
			posy = e.pageY;
		}
		else if (e.clientX || e.clientY) 	{
			posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
		return { x : posx, y : posy }
	};

    class Item {
		constructor(el, options) {
            this.DOM = {el: el};

            this.options = {
                image: {
                    translation : {x: -10, y: -10, z: 0},
                    rotation : {x: 0, y: 0, z: 0}
                },
                title: {
                    translation : {x: 20, y: 10, z: 0}
                },
                text: {
                    translation : {x: 20, y: 50, z: 0},
                    rotation : {x: 0, y: 0, z: -20}
                },
                deco: {
                    translation : {x: -20, y: 0, z: 0},
                    rotation : {x: 0, y: 0, z: 3}
                },
                shadow: {
                    translation : {x: 30, y: 20, z: 0},
                    rotation : {x: 0, y: 0, z: -2},
                    reverseAnimation : {duration: 2, ease: 'Back.easeOut'}
                },
                content: {
                    translation : {x: 5, y: 3, z: 0}
                }
            };
            Object.assign(this.options, options);

            this.DOM.animatable = {};
            this.DOM.animatable.image = this.DOM.el.querySelector('.box__img');
            this.DOM.animatable.title = this.DOM.el.querySelector('.box__title');
            this.DOM.animatable.text = this.DOM.el.querySelector('.box__text');
            this.DOM.animatable.deco = this.DOM.el.querySelector('.box__deco');
            this.DOM.animatable.shadow = this.DOM.el.querySelector('.box__shadow');
            this.DOM.animatable.content = this.DOM.el.querySelector('.box__content');

            this.initEvents();
        }
        initEvents() {
            let enter = false;
            this.mouseenterFn = () => {
                if ( enter ) {
                    enter = false;
                };
                clearTimeout(this.mousetime);
                this.mousetime = setTimeout(() => enter = true, 40);
            };
            this.mousemoveFn = ev => requestAnimationFrame(() => {
                if ( !enter ) return;
                this.tilt(ev);
            });
            this.mouseleaveFn = (ev) => requestAnimationFrame(() => {
                if ( !enter || !allowTilt ) return;
                enter = false;
                clearTimeout(this.mousetime);

                for (let key in this.DOM.animatable ) {
                    if( this.DOM.animatable[key] == undefined || this.options[key] == undefined ) {continue;}
                    TweenMax.to(this.DOM.animatable[key],
                        this.options[key].reverseAnimation != undefined ? this.options[key].reverseAnimation.duration || 0 : 1.5, {
                        ease: this.options[key].reverseAnimation != undefined ? this.options[key].reverseAnimation.ease || 'Power2.easeOut' : 'Power2.easeOut',
                        x: 0,
                        y: 0,
                        z: 0,
                        rotationX: 0,
                        rotationY: 0,
                        rotationZ: 0
                    });
                }
            });
            this.DOM.el.addEventListener('mouseenter', this.mouseenterFn);
            this.DOM.el.addEventListener('mousemove', this.mousemoveFn);
            this.DOM.el.addEventListener('mouseleave', this.mouseleaveFn);
        }
        tilt(ev) {
            if ( !allowTilt ) return;
            const mousepos = getMousePos(ev);
            // Document scrolls.
            const docScrolls = {
                left : document.body.scrollLeft + document.documentElement.scrollLeft,
                top : document.body.scrollTop + document.documentElement.scrollTop
            };
            const bounds = this.DOM.el.getBoundingClientRect();
            // Mouse position relative to the main element (this.DOM.el).
            const relmousepos = {
                x : mousepos.x - bounds.left - docScrolls.left,
                y : mousepos.y - bounds.top - docScrolls.top
            };

            // Movement settings for the animatable elements.
            for (let key in this.DOM.animatable) {
                if ( this.DOM.animatable[key] == undefined || this.options[key] == undefined ) {
                    continue;
                }

                let t = this.options[key] != undefined ? this.options[key].translation || {x:0,y:0,z:0} : {x:0,y:0,z:0},
                    r = this.options[key] != undefined ? this.options[key].rotation || {x:0,y:0,z:0} : {x:0,y:0,z:0};

                setRange(t);
                setRange(r);

                const transforms = {
                    translation : {
                        x: (t.x[1]-t.x[0])/bounds.width*relmousepos.x + t.x[0],
                        y: (t.y[1]-t.y[0])/bounds.height*relmousepos.y + t.y[0],
                        z: (t.z[1]-t.z[0])/bounds.height*relmousepos.y + t.z[0],
                    },
                    rotation : {
                        x: (r.x[1]-r.x[0])/bounds.height*relmousepos.y + r.x[0],
                        y: (r.y[1]-r.y[0])/bounds.width*relmousepos.x + r.y[0],
                        z: (r.z[1]-r.z[0])/bounds.width*relmousepos.x + r.z[0]
                    }
                };

                TweenMax.to(this.DOM.animatable[key], 1.5, {
                    ease: 'Power1.easeOut',
                    x: transforms.translation.x,
                    y: transforms.translation.y,
                    z: transforms.translation.z,
                    rotationX: transforms.rotation.x,
                    rotationY: transforms.rotation.y,
                    rotationZ: transforms.rotation.z
                });
            }
        }
    }

    class Overlay {
        constructor() {
            this.DOM = {el: document.querySelector('.overlay')};
            this.DOM.reveal = this.DOM.el.querySelector('.overlay__reveal');
            this.DOM.items = this.DOM.el.querySelectorAll('.overlay__item');
            this.DOM.close = this.DOM.el.querySelector('.overlay__close');
        }
        show(contentItem) {
            this.contentItem = contentItem;
            this.DOM.el.classList.add('overlay--open');
            // show revealer
            TweenMax.to(this.DOM.reveal, .5, {
                ease: 'Power1.easeInOut',
                x: '0%',
                onComplete: () => {
                    // hide scroll
                    document.body.classList.add('preview-open');
                    // show preview
                    this.revealItem(contentItem);
                    // hide revealer
                    TweenMax.to(this.DOM.reveal, .5, {
                        delay: 0.2,
                        ease: 'Power3.easeOut',
                        x: '-100%'
                    });

                    this.DOM.close.style.opacity = 1;
                }
            });
        }
        revealItem() {
            this.contentItem.style.opacity = 1;

            let itemElems = [];
            itemElems.push(this.contentItem.querySelector('.box__shadow'));
            itemElems.push(this.contentItem.querySelector('.box__img'));
            itemElems.push(this.contentItem.querySelector('.box__title'));
            itemElems.push(this.contentItem.querySelector('.box__text'));
            itemElems.push(this.contentItem.querySelector('.box__deco'));
            itemElems.push(this.contentItem.querySelector('.overlay__content'));

            for (let el of itemElems) {
                if ( el == null ) continue;
                const bounds = el.getBoundingClientRect();
                const win = {width: window.innerWidth, height: window.innerHeight};
                TweenMax.to(el, lineEq(0.8, 1.2, win.width, 0, Math.abs(bounds.left+bounds.width - win.width)), {
                    ease: 'Expo.easeOut',
                    delay: 0.2,
                    startAt: {
                        x: `${lineEq(0, 800, win.width, 0, Math.abs(bounds.left+bounds.width - win.width))}`,
                        y: `${lineEq(-100, 100, win.height, 0, Math.abs(bounds.top+bounds.height - win.height))}`,
                        rotationZ: `${lineEq(5, 30, 0, win.width, Math.abs(bounds.left+bounds.width - win.width))}`
                    },
                    x: 0,
                    y: 0,
                    rotationZ: 0
                });
            }
        }
        hide() {
            this.DOM.el.classList.remove('overlay--open');

            // show revealer
            TweenMax.to(this.DOM.reveal, .5, {
                //delay: 0.15,
                ease: 'Power3.easeOut',
                x: '0%',
                onComplete: () => {
                    this.DOM.close.style.opacity = 0;
                    // show scroll
                    document.body.classList.remove('preview-open');
                    // hide preview
                    this.contentItem.style.opacity = 0;
                    // hide revealer
                    TweenMax.to(this.DOM.reveal, .5, {
                        delay: 0,
                        ease: 'Power3.easeOut',
                        x: '100%'
                    });
                }
            });
        }
    }

    class Grid {
        constructor(el) {
            this.DOM = {el: el};
            this.items = [];
            Array.from(this.DOM.el.querySelectorAll('a.grid__item')).forEach((item) => {
                const itemObj = new Item(item);
                this.items.push(itemObj);
                if ( !item.classList.contains('grid__item--noclick') ) {
                    itemObj.DOM.el.addEventListener('click', (ev) => {
                        ev.preventDefault();
                        this.openItem(document.querySelector(item.getAttribute('href')));
                    });
                }
            });

            this.overlay = new Overlay();
            this.overlay.DOM.close.addEventListener('click', () => this.closeItem());
        }
        openItem(contentItem) {
            if ( this.isPreviewOpen ) return;
            this.isPreviewOpen = true;
            allowTilt = false;
            this.overlay.show(contentItem);
            // "explode" grid..
            for (let item of this.items) {
                for (let key in item.DOM.animatable) {
                    const el = item.DOM.animatable[key];
                    if ( el ) {
                        const bounds = el.getBoundingClientRect();

                        let x;
                        let y;
                        const win = {width: window.innerWidth, height: window.innerHeight};

                        if ( bounds.top + bounds.height/2 < win.height/2 - win.height*.1 ) {
                            //x = getRandomInt(-250,-50);
                            //y = getRandomInt(20,100)*-1;
                            x = -1*lineEq(20, 600, 0, win.width, Math.abs(bounds.left+bounds.width - win.width));
                            y = -1*lineEq(20, 600, 0, win.width, Math.abs(bounds.left+bounds.width - win.width));
                        }
                        else if ( bounds.top + bounds.height/2 > win.height/2 + win.height*.1 ) {
                            //x = getRandomInt(-250,-50);
                            //y = getRandomInt(20,100);
                            x = -1*lineEq(20, 600, 0, win.width, Math.abs(bounds.left+bounds.width - win.width));
                            y = lineEq(20, 600, 0, win.width, Math.abs(bounds.left+bounds.width - win.width))
                        }
                        else {
                            //x = getRandomInt(300,700)*-1;
                            x = -1*lineEq(10, 700, 0, win.width, Math.abs(bounds.left+bounds.width - win.width));
                            y = getRandomInt(-25,25);
                        }

                        TweenMax.to(el, 0.4, {
                            ease: 'Power3.easeOut',
                            delay: lineEq(0, 0.3, 0, win.width, Math.abs(bounds.left+bounds.width - win.width)),
                            x: x,
                            y: y,
                            rotationZ: getRandomInt(-10,10),
                            opacity: 0
                        });
                    }
                }
            }
        }
        closeItem() {
            if ( !this.isPreviewOpen ) return;
            this.isPreviewOpen = false;
            this.overlay.hide();

            for (let item of this.items) {
                for (let key in item.DOM.animatable) {
                    const el = item.DOM.animatable[key];
                    if ( el ) {
                        const bounds = el.getBoundingClientRect();
                        const win = {width: window.innerWidth};
                        TweenMax.to(el, 0.6, {
                            ease: 'Expo.easeOut',
                            delay: .55 + lineEq(0, 0.2, 0, win.width, Math.abs(bounds.left+bounds.width - win.width)),
                            x: 0,
                            y: 0,
                            rotationZ: 0,
                            opacity: 1
                        });
                    }
                }
            }

            allowTilt = true;
        }
    }

    let allowTilt = true;
    new Grid(document.querySelector('.grid'));

    // Preload all the images in the page..
    imagesLoaded(document.querySelectorAll('.box__img'), () => document.body.classList.remove('loading'));
}
