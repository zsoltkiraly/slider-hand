/*
Slider hand - Code by Zsolt Király
v1.0.0 - 2019-07-23
*/

'use strict';
var sliderHand = function() {

    var condition = true;
    var positionArr= [];

    function _DOMWidth(id, c) {
        const inner = id.querySelector('.slider-hand-container .slider-hand-inner'),
              sliderHandContainer = id.querySelector('.slider-hand-container'),
              el = inner.querySelectorAll('ul.slider-hand-ul li');

        let pieceSlashResolution;

        sliderHandContainer.style.margin = '0px -' + c.sustenance + 'px';

        if (window.matchMedia('(min-width: ' + (c.tablet.resolution + 1) + 'px)').matches) {

            pieceSlashResolution = c.desktop.piece;

            if(c.desktop.piece >= el.length) {
                condition = false;

            } else {
                condition = true;
            }

        }  else if (window.matchMedia('(min-width: ' + (c.mobile.resolution + 1) + 'px) and (max-width: ' + c.tablet.resolution + 'px)').matches) {

            pieceSlashResolution = c.tablet.piece;

            if(c.tablet.piece >= el.length) {
                condition = false;

            } else {
                condition = true;
            }

        }  else if(window.matchMedia('(max-width: ' + c.mobile.resolution + 'px)').matches) {

            pieceSlashResolution = c.mobile.piece;

            if(c.mobile.piece >= el.length) {
                condition = false;

            } else {
                condition = true;
            }
        }

        let elementWidth = Math.ceil(sliderHandContainer.offsetWidth / pieceSlashResolution);
        inner.style.width = Math.ceil(el.length * elementWidth) + 'px';

        //Jump to the beginning
        inner.style.marginLeft = '0px';
        positionArr.length = 0;

        for (let [index, value] of el.entries()) {
            value.style.width = elementWidth + 'px';
            value.style.margin = '0px ' + c.sustenance + 'px';

            if(index <= el.length - pieceSlashResolution) {
                if(index == 0) {
                    
                    positionArr.push(0);
                } else {
                    
                    positionArr.push(index * elementWidth);
                }
            }
        }
    }


    function _mouseAndTouchEvents(id, c) {
        const inner = id.querySelector('.slider-hand-container .slider-hand-inner'),
              sliderHandContainer = id.querySelector('.slider-hand-container');

        
        var startX = 0,
            distX = 0,
            helpAtTheBeginningAndEnd = 100,
            sliderGetMarginLeft,
            totalWidth = parseFloat(inner.style.width, 10),
            sliderWidth = sliderHandContainer.offsetWidth,
            marginLeftMaximum = totalWidth - sliderWidth;


        function _setDimension() {
            totalWidth = parseFloat(inner.style.width, 10),
            sliderWidth = sliderHandContainer.offsetWidth,
            marginLeftMaximum = totalWidth - sliderWidth;
        }

        window.addEventListener('resize', function() { _setDimension(); });
        window.addEventListener("orientationchange", function() { setTimeout( ()=> { _setDimension(); },100) });

        function _down(event, device) {
            if(condition) {
                if(event.cancelable) {
                    event.preventDefault();
                }

                if(device) {
                    let touchobj = event.changedTouches[0];

                    startX = touchobj.clientX;

                } else {
                    startX = event.clientX;
                }

                id.classList.add('catch');
        
                let inner = id.querySelector('.slider-hand-container .slider-hand-inner');
                sliderGetMarginLeft = parseFloat(inner.style.marginLeft, 10);
            }
        }


        function _move(event, device) {

            if(condition) {
                if(event.cancelable) {
                    event.preventDefault();
                }
    
                if(id.classList.contains('catch')) {
    
                    if(device) {
                        let touchobj = event.changedTouches[0];
    
                        distX = (startX - touchobj.clientX) * -1;
        
                    } else {
                        distX = (startX - event.clientX) * -1;
                    }
                    
                    if(sliderGetMarginLeft + distX <= 0 && sliderGetMarginLeft + distX >= (marginLeftMaximum * -1)) {
                        inner.style.marginLeft = (sliderGetMarginLeft + distX) + 'px';
                    }
                }
            }
        }


        function _up(event) {
            if(condition) {
                if(event.cancelable) {
                    event.preventDefault();
                }

                sliderGetMarginLeft = parseFloat(inner.style.marginLeft, 10);

                id.classList.remove('catch');
                
                function _behaviorAtTheBeginningAndEnd() {
                    if(sliderGetMarginLeft >= helpAtTheBeginningAndEnd * -1) {

                        inner.style.transition = 'margin-left .3s ease-out';
                        inner.style.marginLeft = '0px';

                        setTimeout(()=>{
                            inner.style.transition = '';
                        }, 300);
                    }

                    if(((marginLeftMaximum - helpAtTheBeginningAndEnd)* -1) >= sliderGetMarginLeft) {
                        inner.style.transition = 'margin-left .3s ease-out';
                        inner.style.marginLeft = marginLeftMaximum * -1 + 'px';

                        setTimeout(()=>{
                            inner.style.transition = '';
                        }, 300);
                    }
                }

                if(distX > 0) {
                    _behaviorAtTheBeginningAndEnd();
                    
                } else {
                    _behaviorAtTheBeginningAndEnd();
                }

                if(c.closest) {
                    let closestEl = positionArr.reduce(function(prev, curr) {
                        return (Math.abs(curr - (sliderGetMarginLeft * -1)) < Math.abs(prev - (sliderGetMarginLeft * -1)) ? curr : prev);
                    });
    
                    inner.style.transition = 'margin-left .3s ease-out';
                    inner.style.marginLeft = closestEl * -1 + 'px';
    
                    setTimeout(()=>{
                        inner.style.transition = '';
                    }, 300);
                }
            }
        }


        id.addEventListener('mousedown', function(event) { _down(event, false); });
        id.addEventListener('mousemove', function(event) { _move(event, false); });
        window.addEventListener('mouseup', function(event) { _up(event); });

        id.addEventListener('touchstart', function(event) { _down(event, true); });
        id.addEventListener('touchmove', function(event) { _move(event, true); });
        window.addEventListener('touchend', function(event) { _up(event); });
    }


    function app(config) {

        const sliderHandId = document.querySelector('#' + config.id + '');

        if(sliderHandId) {
            _DOMWidth(sliderHandId, config);
            _mouseAndTouchEvents(sliderHandId, config);

            window.addEventListener('resize', function() {
                _DOMWidth(sliderHandId, config);
            });
        }
    }
    return {
        app:app
    }
}();