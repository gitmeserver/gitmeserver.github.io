/**
 * 
 */
var FullScreen = new (function () {

        var fullscreen = function () {
            return new fullscreen.fn.init();
        };

        fullscreen.fn = fullscreen.prototype = {
            init: function () {

                this.prefixe = getFullScreenSupportVenderName();

                return this;
            },
            on: function (context, open, close) {

                if (!this.prefixe) return false;

                open = open || function () { };
                close = close || function () { };

                getFullScreenRequestMethod(context, this.prefixe);

                var that = this;

                bind(context, getFullScreenReadyStateChangeName(this.prefixe), function (e) {
                    if (getFullScreenEnableMethod(that.prefixe)) open.call(that, e);
                    else close.call(that, e);
                }, false);


                return this;
            },
            off: function () {

                if (!this.prefixe) return false;

                getFullScreenCancelMethod(this.prefixe);

                return this;
            }
        }

        function getFullScreenRequestMethod(context, prefixe) {

            if (!context) return false;

            prefixe = prefixe || '';

            if (prefixe === 'w3c') context.requestFullScreen();
            else if (prefixe === 'webkit') context.webkitRequestFullScreen();
            else if (prefixe === 'moz') context.mozRequestFullScreen();
        }

        function getFullScreenCancelMethod(prefixe) {

            prefixe = prefixe || '';

            if (prefixe === 'webkit') document.webkitCancelFullScreen();
            else if (prefixe === 'moz') document.mozCancelFullScreen();
            else if (prefixe === 'w3c') document.exitFullscreen();
            else document.cancelFullScreen();
        }

        function getFullScreenEnableMethod(prefixe) {

            prefixe = prefixe || '';

            if (prefixe === 'moz') {
                return document.mozFullScreen;
            }
            else if (prefixe === 'webkit') {
                return document.webkitIsFullScreen;
            }
            else {
                return document.fullScreen;
            }
        }

        function getFullScreenReadyStateChangeName(prefixe) {

            prefixe = prefixe || '';
            return prefixe + 'fullscreenchange';
        }

        function getFullScreenSupportVenderName() {

            var r = '';

            var venders = getFullScreenSupportVenders();
            for (var n in venders) {
                if (document[venders[n]['cancel']]) {
                    r = n;
                    break;
                }
            }

            return r;
        }

        function getFullScreenSupportVenders() {

            return {
                'w3c': {
                    'change': 'onfullscreenchange',
                    'request': 'requestFullscreen',
                    'error': 'onfullscreenerror',
                    'enabled': 'fullscreenEnabled',
                    'cancel': 'exitFullscreen',
                    'fullScreenElement': 'fullscreenElement'
                },
                'moz': {
                    'change': 'onmozfullscreenchange',
                    'request': 'mozRequestFullScreen',
                    'error': 'onmozfullscreenerror',
                    'cancel': 'mozCancelFullScreen',
                    'enabled': 'mozFullScreenEnabled',
                    'fullScreenElement': 'mozFullScreenElement'
                },
                'webkit': {
                    'change': 'onwebkitfullscreenchange',
                    'request': 'webkitRequestFullScreen',
                    'cancel': 'webkitCancelFullScreen',
                    'error': 'onwebkitfullscreenerror',
                    'fullScreenElement': 'webkitCurrentFullScreenElement'
                }
            };
        }

        fullscreen.fn.init.prototype = fullscreen.prototype;

        return fullscreen;

    } ())();

    window.onload = function () {

        var contextStart = document.getElementById('specialstuffStart');

        var btnStart = document.getElementById('fsbuttonStart');
        var btnEnd = document.getElementById('fsbuttonEnd');

        bind(btnStart, 'click', function () {
            FullScreen.on(contextStart, function (e) {
                btnStart.style.display = 'none';
                btnEnd.style.display = 'block';
            }, function (e) {
                btnStart.style.display = 'block';
                btnEnd.style.display = 'none';
            });
        }, false);

        bind(document, 'keyup', function (e) {
            // space key
            if (e.keyCode === 32) FullScreen.off();
        }, false);
    }

    function bind(elem, type, handler, capture) {
        type = typeof type === 'string' ? type : '';
        handler = typeof handler === 'function' ? handler : function () { ; };
        capture = capture || false;

        if (elem.addEventListener) {
            elem.addEventListener(type, handler, capture);
        }
        else if (elem.attachEvent) {
            elem.attachEvent('on' + type, handler);
        }

        return this;
    }
    