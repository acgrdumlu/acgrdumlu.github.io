
$.widget("custom.livePhoto", {
    options: {
        allsteps: 11,
        animationrate: 30,
        target: 50,
    },

    _create: function () {
        if ($(window).width() > 769) {
            this._update();
        }
        else {
            this._updateMobile();
        }
    },

    _update: function () {
        var animate = this;
        var element = animate.element;

        var timer = 0,
            x = 0,
            attr = 0,
            step = this.element[0].getBoundingClientRect().width,
            allsteps = animate.options.allsteps,
            ceil = allsteps * (step) - 1 * step;

        element.off('mouseover').on('mouseover', function () {
            clearInterval(timer);

            timer = setInterval(function () {
                animate._bgPosition(x);

                if (attr < -ceil) {
                    clearInterval(timer);
                } else {
                    attr -= step;
                }
                x = attr;
                x = -((x * 100) / ceil);

            }, animate.options.animationrate);
        });

        element.off('mouseout').on('mouseout', function () {
            clearInterval(timer);

            timer = setInterval(function () {
                animate._bgPosition(x);

                if (attr > -step) {
                    clearInterval(timer);
                } else {
                    attr += step;
                }

                x = attr;
                x = -((x * 100) / ceil);

            }, animate.options.animationrate);
        });

        $(window).resize(function () {
            step = element[0].getBoundingClientRect().width;
            ceil = allsteps * step - 1 * step;
        });
    },

    _updateMobile: function () {
        var animate = this;
        var element = animate.element;

        var x = 0,
            attr = 0,
            tmpAttr = 0,
            step = this.element[0].getBoundingClientRect().width,
            allsteps = animate.options.allsteps,
            ceil = allsteps * step - 1 * step;


        $(window).scroll(function (event) {
            event.preventDefault();

            var s = $(window).scrollTop(),
                d = animate.options.target,
                scrollPercent = (s / d) * 100,
                attrPos = (ceil / 100) * scrollPercent,
                scrollRev = Math.floor(scrollPercent / 100),
                countImg = parseInt(attrPos / step),
                currImg = countImg % (allsteps - 1);

            if (scrollRev % 2 == 1) {
                element.addClass('reverse');
            } else {
                element.removeClass('reverse');
            }

            if (!element.hasClass('reverse')) {
                attr = -(currImg * step)
            } else if (element.hasClass('reverse')) {
                tmpAttr = currImg * step;
                attr = -(ceil - tmpAttr);
            }

            x = attr;
            x = -(x * 100 / ceil);

            animate._bgPosition(x);
        });
    },

    _bgPosition: function (x) {
        if (x <= 100) {
            this.element.css('background-position', x + '%' + ' 0');
        }
    }
});
