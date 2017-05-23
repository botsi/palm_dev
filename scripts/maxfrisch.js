(function() {
    if ("ontouchstart" in window && !/chrome/i.test(navigator.userAgent)) {
        var g, h, i, e = function(a, c) {
                return 5 < Math.abs(a[0] - c[0]) || 5 < Math.abs(a[1] - c[1])
            },
            m = function(a, c) {
                for (var b = a, f = c.toUpperCase(); b !== document.body;) {
                    if (!b || b.nodeName === f) return b;
                    b = b.parentNode
                }
                return null
            };
        document.addEventListener("touchstart", function(a) {
            this.startXY = [a.touches[0].clientX, a.touches[0].clientY];
            this.treshold = !1
        }, !1);
        document.addEventListener("touchmove", function(a) {
            if (this.treshold) return !1;
            this.threshold =
                e(this.startXY, [a.touches[0].clientX, a.touches[0].clientY])
        }, !1);
        document.addEventListener("touchend", function(a) {
            if (!this.treshold && !e(this.startXY, [a.changedTouches[0].clientX, a.changedTouches[0].clientY])) {
                var c = a.changedTouches[0],
                    b = document.createEvent("MouseEvents");
                b.initMouseEvent("click", !0, !0, window, 0, c.screenX, c.screenY, c.clientX, c.clientY, !1, !1, !1, !1, 0, null);
                b.simulated = !0;
                a.target.dispatchEvent(b)
            }
        }, !1);
        document.addEventListener("click", function(a) {
            var c = Date.now(),
                b = c - g,
                f = a.clientX,
                e = a.clientY,
                j = [Math.abs(h - f), Math.abs(i - e)],
                d = m(a.target, "A") || a.target,
                k = "A" === d.nodeName,
                l = window.navigator.standalone && k && a.target.getAttribute("href");
            g = c;
            h = f;
            i = e;
            if (!a.simulated && (500 > b || 1500 > b && 50 > j[0] && 50 > j[1]) || l)
                if (a.preventDefault(), a.stopPropagation(), !l) return !1;
            window.navigator.standalone && k && d.getAttribute("href") && (window.location = d.getAttribute("href"));
            d && d.classList && (d.classList.add("m-focus"), window.setTimeout(function() {
                d.classList.remove("m-focus")
            }, 150))
        }, !0)
    }
})();;
(function(document) {
    window.MBP = window.MBP || {};
    MBP.viewportmeta = document.querySelector && document.querySelector('meta[name="viewport"]');
    MBP.ua = navigator.userAgent;
    MBP.scaleFix = function() {
        if (MBP.viewportmeta && /iPhone|iPad|iPod/.test(MBP.ua) && !/Opera Mini/.test(MBP.ua)) {
            MBP.viewportmeta.content = 'width=device-width, minimum-scale=1.0, maximum-scale=1.0';
            document.addEventListener('gesturestart', MBP.gestureStart, false);
        }
    };
    MBP.gestureStart = function() {
        MBP.viewportmeta.content = 'width=device-width, minimum-scale=0.25, maximum-scale=1.6';
    };
    MBP.BODY_SCROLL_TOP = false;
    MBP.getScrollTop = function() {
        var win = window;
        var doc = document;
        return win.pageYOffset || doc.compatMode === 'CSS1Compat' && doc.documentElement.scrollTop || doc.body.scrollTop || 0;
    };
    MBP.hideUrlBar = function() {
        var win = window;
        if (!location.hash && MBP.BODY_SCROLL_TOP !== false) {
            win.scrollTo(0, MBP.BODY_SCROLL_TOP === 1 ? 0 : 1);
        }
    };
    MBP.hideUrlBarOnLoad = function() {
        var win = window;
        var doc = win.document;
        var bodycheck;
        if (!location.hash && win.addEventListener) {
            window.scrollTo(0, 1);
            MBP.BODY_SCROLL_TOP = 1;
            bodycheck = setInterval(function() {
                if (doc.body) {
                    clearInterval(bodycheck);
                    MBP.BODY_SCROLL_TOP = MBP.getScrollTop();
                    MBP.hideUrlBar();
                }
            }, 15);
            win.addEventListener('load', function() {
                setTimeout(function() {
                    if (MBP.getScrollTop() < 20) {
                        MBP.hideUrlBar();
                    }
                }, 0);
            });
        }
    };
    MBP.autogrow = function(element, lh) {
        function handler(e) {
            var newHeight = this.scrollHeight;
            var currentHeight = this.clientHeight;
            if (newHeight > currentHeight) {
                this.style.height = newHeight + 3 * textLineHeight + 'px';
            }
        }
        var setLineHeight = (lh) ? lh : 12;
        var textLineHeight = element.currentStyle ? element.currentStyle.lineHeight : getComputedStyle(element, null).lineHeight;
        textLineHeight = (textLineHeight.indexOf('px') == -1) ? setLineHeight : parseInt(textLineHeight, 10);
        element.style.overflow = 'hidden';
        element.addEventListener ? element.addEventListener('keyup', handler, false) : element.attachEvent('onkeyup', handler);
    };
    MBP.enableActive = function() {
        document.addEventListener('touchstart', function() {}, false);
    };
    MBP.preventZoom = function() {
        var formFields = document.querySelectorAll('input, select, textarea');
        var contentString = 'width=device-width,initial-scale=1,maximum-scale=';
        var i = 0;
        for (i = 0; i < formFields.length; i++) {
            formFields[i].onfocus = function() {
                MBP.viewportmeta.content = contentString + '1';
            };
            formFields[i].onblur = function() {
                MBP.viewportmeta.content = contentString + '10';
            };
        }
    };
    MBP.startupImage = function() {
        var portrait;
        var landscape;
        var pixelRatio;
        var head;
        var link1;
        var link2;
        pixelRatio = window.devicePixelRatio;
        head = document.getElementsByTagName('head')[0];
        if (navigator.platform === 'iPad') {
            portrait = pixelRatio === 2 ? 'img/startup/startup-tablet-portrait-retina.png' : 'img/startup/startup-tablet-portrait.png';
            landscape = pixelRatio === 2 ? 'img/startup/startup-tablet-landscape-retina.png' : 'img/startup/startup-tablet-landscape.png';
            link1 = document.createElement('link');
            link1.setAttribute('rel', 'apple-touch-startup-image');
            link1.setAttribute('media', 'screen and (orientation: portrait)');
            link1.setAttribute('href', portrait);
            head.appendChild(link1);
            link2 = document.createElement('link');
            link2.setAttribute('rel', 'apple-touch-startup-image');
            link2.setAttribute('media', 'screen and (orientation: landscape)');
            link2.setAttribute('href', landscape);
            head.appendChild(link2);
        } else {
            portrait = pixelRatio === 2 ? "img/startup/startup-retina.png" : "img/startup/startup.png";
            link1 = document.createElement('link');
            link1.setAttribute('rel', 'apple-touch-startup-image');
            link1.setAttribute('href', portrait);
            head.appendChild(link1);
        }
    };
})(document);;
(function($, window, undefined) {
    function queryStringToObject(qstr) {
        var result = {},
            nvPairs = ((qstr || "").replace(/^\?/, "").split(/&/)),
            i, pair, n, v;
        for (i = 0; i < nvPairs.length; i++) {
            var pstr = nvPairs[i];
            if (pstr) {
                pair = pstr.split(/=/);
                n = pair[0];
                v = pair[1];
                if (result[n] === undefined) {
                    result[n] = v;
                } else {
                    if (typeof result[n] !== "object") {
                        result[n] = [result[n]];
                    }
                    result[n].push(v);
                }
            }
        }
        return result;
    }
    $(document).bind("pagebeforechange", function(e, data) {
        if (typeof data.toPage === "string") {
            var u = $.mobile.path.parseUrl(data.toPage);
            if ($.mobile.path.isEmbeddedPage(u)) {
                var u2 = $.mobile.path.parseUrl(u.hash.replace(/^#/, ""));
                if (u2.search) {
                    if (!data.options.dataUrl) {
                        data.options.dataUrl = data.toPage;
                    }
                    data.options.pageData = queryStringToObject(u2.search);
                    data.toPage = u.hrefNoHash + "#" + u2.pathname;
                }
            }
        }
    });
})(jQuery, window);;
eval(function(p, a, c, k, e, r) {
    e = function(c) {
        return (c < a ? '' : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36))
    };
    if (!''.replace(/^/, String)) {
        while (c--) r[e(c)] = k[c] || e(c);
        k = [function(e) {
            return r[e]
        }];
        e = function() {
            return '\\w+'
        };
        c = 1
    };
    while (c--)
        if (k[c]) p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
    return p
}('7 p(a){a=a||{};5.8.1N.2h(2,32);2.L=a.1u||"";2.1D=a.1q||H;2.P=a.1H||0;2.E=a.1B||1f 5.8.1U(0,0);2.B=a.W||1f 5.8.2t(0,0);2.S=a.11||q;2.1n=a.1l||"28";2.1k=a.D||{};2.1G=a.1E||"34";2.M=a.19||"2W://2Q.5.2L/2I/2G/2F/1v.2z";3(a.19===""){2.M=""}2.1i=a.1r||1f 5.8.1U(1,1);2.Y=a.1s||H;2.1a=a.1p||H;2.1K=a.2k||"2g";2.17=a.1m||H;2.4=q;2.w=q;2.X=q;2.16=q;2.15=q;2.13=q;2.12=q;2.O=q}p.r=1f 5.8.1N();p.r.22=7(){6 a;6 d=2;6 c=7(e){e.1Z=U;3(e.18){e.18()}};6 b=7(e){e.2S=H;3(e.1Y){e.1Y()}3(!d.17){c(e)}};3(!2.4){2.4=1g.2K("2J");2.1d();3(t 2.L.1w==="u"){2.4.J=2.F()+2.L}v{2.4.J=2.F();2.4.1b(2.L)}2.2y()[2.1K].1b(2.4);2.1F();3(2.4.9.A){2.O=U}v{3(2.P!==0&&2.4.Z>2.P){2.4.9.A=2.P;2.4.9.2u="2s";2.O=U}v{a=2.24();2.4.9.A=(2.4.Z-a.14-a.T)+"R";2.O=H}}2.1t(2.1D);3(!2.17){2.X=5.8.s.I(2.4,"2n",c);2.16=5.8.s.I(2.4,"1L",c);2.15=5.8.s.I(2.4,"2m",c);2.1o=5.8.s.I(2.4,"2l",7(e){2.9.1J="2j"})}2.12=5.8.s.I(2.4,"2i",b);5.8.s.Q(2,"2f")}};p.r.F=7(){6 a="";3(2.M!==""){a="<2e";a+=" 2d=\'"+2.M+"\'";a+=" 2c=T";a+=" 9=\'";a+=" W: 2b;";a+=" 1J: 2a;";a+=" 29: "+2.1G+";";a+="\'>"}N a};p.r.1F=7(){6 a;3(2.M!==""){a=2.4.27;2.w=5.8.s.I(a,\'1L\',2.1I())}v{2.w=q}};p.r.1I=7(){6 a=2;N 7(e){e.1Z=U;3(e.18){e.18()}a.1v();5.8.s.Q(a,"26")}};p.r.1t=7(d){6 m;6 n;6 e=0,G=0;3(!d){m=2.25();3(m 39 5.8.38){3(!m.23().37(2.B)){m.36(2.B)}n=m.23();6 a=m.35();6 h=a.Z;6 f=a.21;6 k=2.E.A;6 l=2.E.1j;6 g=2.4.Z;6 b=2.4.21;6 i=2.1i.A;6 j=2.1i.1j;6 o=2.20().31(2.B);3(o.x<(-k+i)){e=o.x+k-i}v 3((o.x+g+k+i)>h){e=o.x+g+k+i-h}3(2.1a){3(o.y<(-l+j+b)){G=o.y+l-j-b}v 3((o.y+l+j)>f){G=o.y+l+j-f}}v{3(o.y<(-l+j)){G=o.y+l-j}v 3((o.y+b+l+j)>f){G=o.y+b+l+j-f}}3(!(e===0&&G===0)){6 c=m.30();m.2Z(e,G)}}}};p.r.1d=7(){6 i,D;3(2.4){2.4.2Y=2.1n;2.4.9.2X="";D=2.1k;2V(i 2U D){3(D.2R(i)){2.4.9[i]=D[i]}}3(t 2.4.9.1h!=="u"&&2.4.9.1h!==""){2.4.9.2P="2O(1h="+(2.4.9.1h*2N)+")"}2.4.9.W="2M";2.4.9.V=\'1y\';3(2.S!==q){2.4.9.11=2.S}}};p.r.24=7(){6 c;6 a={1e:0,1c:0,14:0,T:0};6 b=2.4;3(1g.1x&&1g.1x.1V){c=b.2H.1x.1V(b,"");3(c){a.1e=C(c.1T,10)||0;a.1c=C(c.1S,10)||0;a.14=C(c.1R,10)||0;a.T=C(c.1W,10)||0}}v 3(1g.2E.K){3(b.K){a.1e=C(b.K.1T,10)||0;a.1c=C(b.K.1S,10)||0;a.14=C(b.K.1R,10)||0;a.T=C(b.K.1W,10)||0}}N a};p.r.2D=7(){3(2.4){2.4.2C.2B(2.4);2.4=q}};p.r.1A=7(){2.22();6 a=2.20().2A(2.B);2.4.9.14=(a.x+2.E.A)+"R";3(2.1a){2.4.9.1c=-(a.y+2.E.1j)+"R"}v{2.4.9.1e=(a.y+2.E.1j)+"R"}3(2.Y){2.4.9.V=\'1y\'}v{2.4.9.V="1X"}};p.r.2T=7(a){3(t a.1l!=="u"){2.1n=a.1l;2.1d()}3(t a.D!=="u"){2.1k=a.D;2.1d()}3(t a.1u!=="u"){2.1Q(a.1u)}3(t a.1q!=="u"){2.1D=a.1q}3(t a.1H!=="u"){2.P=a.1H}3(t a.1B!=="u"){2.E=a.1B}3(t a.1p!=="u"){2.1a=a.1p}3(t a.W!=="u"){2.1z(a.W)}3(t a.11!=="u"){2.1P(a.11)}3(t a.1E!=="u"){2.1G=a.1E}3(t a.19!=="u"){2.M=a.19}3(t a.1r!=="u"){2.1i=a.1r}3(t a.1s!=="u"){2.Y=a.1s}3(t a.1m!=="u"){2.17=a.1m}3(2.4){2.1A()}};p.r.1Q=7(a){2.L=a;3(2.4){3(2.w){5.8.s.z(2.w);2.w=q}3(!2.O){2.4.9.A=""}3(t a.1w==="u"){2.4.J=2.F()+a}v{2.4.J=2.F();2.4.1b(a)}3(!2.O){2.4.9.A=2.4.Z+"R";3(t a.1w==="u"){2.4.J=2.F()+a}v{2.4.J=2.F();2.4.1b(a)}}2.1F()}5.8.s.Q(2,"2x")};p.r.1z=7(a){2.B=a;3(2.4){2.1A()}5.8.s.Q(2,"1O")};p.r.1P=7(a){2.S=a;3(2.4){2.4.9.11=a}5.8.s.Q(2,"2w")};p.r.2v=7(){N 2.L};p.r.1C=7(){N 2.B};p.r.33=7(){N 2.S};p.r.2r=7(){2.Y=H;3(2.4){2.4.9.V="1X"}};p.r.2q=7(){2.Y=U;3(2.4){2.4.9.V="1y"}};p.r.2p=7(c,b){6 a=2;3(b){2.B=b.1C();2.13=5.8.s.2o(b,"1O",7(){a.1z(2.1C())})}2.1M(c);3(2.4){2.1t()}};p.r.1v=7(){3(2.w){5.8.s.z(2.w);2.w=q}3(2.X){5.8.s.z(2.X);5.8.s.z(2.16);5.8.s.z(2.15);5.8.s.z(2.1o);2.X=q;2.16=q;2.15=q;2.1o=q}3(2.13){5.8.s.z(2.13);2.13=q}3(2.12){5.8.s.z(2.12);2.12=q}2.1M(q)};', 62, 196, '||this|if|div_|google|var|function|maps|style||||||||||||||||InfoBox|null|prototype|event|typeof|undefined|else|closeListener_|||removeListener|width|position_|parseInt|boxStyle|pixelOffset_|getCloseBoxImg_|yOffset|false|addDomListener|innerHTML|currentStyle|content_|closeBoxURL_|return|fixedWidthSet_|maxWidth_|trigger|px|zIndex_|right|true|visibility|position|eventListener1_|isHidden_|offsetWidth||zIndex|contextListener_|moveListener_|left|eventListener3_|eventListener2_|enableEventPropagation_|stopPropagation|closeBoxURL|alignBottom_|appendChild|bottom|setBoxStyle_|top|new|document|opacity|infoBoxClearance_|height|boxStyle_|boxClass|enableEventPropagation|boxClass_|eventListener4_|alignBottom|disableAutoPan|infoBoxClearance|isHidden|panBox_|content|close|nodeType|defaultView|hidden|setPosition|draw|pixelOffset|getPosition|disableAutoPan_|closeBoxMargin|addClickHandler_|closeBoxMargin_|maxWidth|getCloseClickHandler_|cursor|pane_|click|setMap|OverlayView|position_changed|setZIndex|setContent|borderLeftWidth|borderBottomWidth|borderTopWidth|Size|getComputedStyle|borderRightWidth|visible|preventDefault|cancelBubble|getProjection|offsetHeight|createInfoBoxDiv_|getBounds|getBoxWidths_|getMap|closeclick|firstChild|infoBox|margin|pointer|relative|align|src|img|domready|floatPane|apply|contextmenu|default|pane|mouseover|dblclick|mousedown|addListener|open|hide|show|auto|LatLng|overflow|getContent|zindex_changed|content_changed|getPanes|gif|fromLatLngToDivPixel|removeChild|parentNode|onRemove|documentElement|mapfiles|en_us|ownerDocument|intl|div|createElement|com|absolute|100|alpha|filter|www|hasOwnProperty|returnValue|setOptions|in|for|http|cssText|className|panBy|getCenter|fromLatLngToContainerPixel|arguments|getZIndex|2px|getDiv|setCenter|contains|Map|instanceof'.split('|'), 0, {}));

function enableSwipe() {
    delete swipey;
    var swipey = {
        slideContainer: null,
        wrapper: null,
        slides: null,
        distanceX: 0,
        startX: 0,
        preferredWidth: 0,
        preferredHeight: 0,
        direction: "",
        timer: null,
        timerCounter: 0,
        isTouchStart: false,
        maxDistance: 0,
        currentDistance: 0,
        toggleCounter: 1,
        videoplaying: 0,
        initSwipey: function() {
            window.setTimeout(function() {
                window.scrollTo(0, 1);
            }, 100);
            swipey.wrapper = $('#gallery-container').get(0);
            swipey.slideContainer = $('#gallery').get(0);
            swipey.slides = $('.gallery-item');
            swipey.preferredWidth = $(window).width();
            swipey.preferredHeight = $(document).height() - 124;
            swipey.wrapper.style.width = swipey.preferredWidth + "px";
            swipey.wrapper.style.height = swipey.preferredHeight + "px";
            swipey.slideContainer.style.width = swipey.slides.length * swipey.preferredWidth + "px";
            swipey.slideContainer.style.height = swipey.preferredHeight + "px";
            swipey.maxDistance = swipey.slides.length * swipey.preferredWidth;
            swipey.initEvents();
        },
        initEvents: function() {
            swipey.wrapper.addEventListener("touchstart", swipey.startHandler, false);
            swipey.wrapper.addEventListener("touchmove", swipey.moveHandler, false);
            swipey.wrapper.addEventListener("touchend", swipey.endHandler, false);
        },
        startHandler: function(event) {
            swipey.startX = event.touches[0].pageX;
            swipey.startY = event.touches[0].pageY;
            swipey.timer = setInterval(function() {
                swipey.timerCounter++;
            }, 10);
            swipey.isTouchStart = true;
            event.preventDefault();
        },
        moveHandler: function(event) {
            if (swipey.isTouchStart) {
                swipey.distanceX = event.touches[0].pageX - swipey.startX;
                swipey.distanceY = event.touches[0].pageY - swipey.startY;
                swipey.slideContainer.style.webkitTransform = "translate3d(" + (swipey.distanceX + swipey.currentDistance) + "px, 0,0)";
            }
        },
        endHandler: function(event) {
            clearInterval(swipey.timer);
            if (swipey.distanceX > 0) {
                swipey.direction = "right";
            }
            if (swipey.distanceX < 0) {
                swipey.direction = "left";
            }
            if ((swipey.direction == "right" && swipey.currentDistance == 0) || (swipey.direction == "left" && swipey.currentDistance == -(swipey.maxDistance - swipey.preferredWidth))) {
                swipey.comeBack();
                if (Math.abs(swipey.distanceX) < 10) {
                    swipey.toggleFullscreen(event);
                }
            } else if (swipey.timerCounter < 30 && swipey.distanceX > 10) {
                swipey.moveRight();
            } else if (swipey.timerCounter < 30 && swipey.distanceX < -10) {
                swipey.moveLeft();
            } else if (swipey.distanceX <= -(swipey.preferredWidth / 2)) {
                swipey.moveLeft();
            } else if (swipey.distanceX >= (swipey.preferredWidth / 2)) {
                swipey.moveRight();
            } else {
                swipey.comeBack();
                swipey.toggleFullscreen(event);
            }
            swipey.timerCounter = 0;
            swipey.isTouchStart = false;
            swipey.distanceX = 0;
        },
        moveLeft: function() {
            if ($('video').length > 0) {
                $('video')[0].pause();
            }
            swipey.currentDistance += -swipey.preferredWidth;
            swipey.slideContainer.style.webkitTransitionDuration = 300 + "ms";
            swipey.slideContainer.style.webkitTransform = "translate3d(" + swipey.currentDistance + "px, 0,0)";
        },
        moveRight: function() {
            if ($('video').length > 0) {
                $('video')[0].pause();
            }
            swipey.currentDistance += swipey.preferredWidth;
            swipey.slideContainer.style.webkitTransitionDuration = 300 + "ms";
            swipey.slideContainer.style.webkitTransform = "translate3d(" + swipey.currentDistance + "px, 0,0)";
        },
        comeBack: function() {
            swipey.slideContainer.style.webkitTransitionDuration = 250 + "ms";
            swipey.slideContainer.style.webkitTransitionTimingFunction = "ease-out";
            swipey.slideContainer.style.webkitTransform = "translate3d(" + swipey.currentDistance + "px, 0,0)";
        },
        toggleFullscreen: function(touchevent) {
            if (currentplace == 21 && $(touchevent.srcElement).prop('tagName').toLowerCase() == 'video') {
                if (swipey.videoplaying == 1) {
                    $('video')[0].pause();
                    swipey.videoplaying = 0;
                } else {
                    $('video')[0].play();
                    swipey.videoplaying = 1
                }
            } else {
                swipey.toggleCounter++;
                if (swipey.toggleCounter % 2 == 0) {
                    swipey.preferredHeight = $(document).height();
                    swipey.preferredWidth = $(window).width();
                    $('#gallery-container').addClass('container-fullscreen');
                    $(swipey.slideContainer).addClass('fullscreen');
                } else {
                    swipey.preferredHeight = $(document).height() - 124;
                    $('#gallery-container').removeClass('container-fullscreen');
                    $(swipey.slideContainer).removeClass('fullscreen');
                }
                swipey.wrapper.style.width = swipey.preferredWidth + "px";
                swipey.wrapper.style.height = swipey.preferredHeight + "px";
                swipey.slideContainer.style.height = swipey.preferredHeight + "px";
            }
        }
    };
    window.swipeyObj = swipey;
    swipeyObj.initSwipey();
};;
var routes = [
    [8.543699, 47.37675, 8.543898, 47.376474, 8.544027, 47.375955, 8.543994, 47.375522, 8.543941, 47.375399, 8.543833, 47.37472, 8.543844, 47.374476, 8.543705, 47.373728, 8.543774, 47.373434, 8.543748, 47.373205, 8.54326, 47.373183, 8.543275, 47.372815, 8.543759, 47.372845, 8.543785, 47.372598, 8.543866, 47.372293, 8.543796, 47.371868, 8.543855, 47.371668, 8.54415, 47.371326, 8.543276, 47.370996, 8.542986, 47.370989, 8.542836, 47.371817, 8.542176, 47.371722, 8.542085, 47.371595, 8.541865, 47.371508, 8.541747, 47.371508, 8.541586, 47.371504, 8.541468, 47.371559, 8.54099, 47.371483, 8.54113, 47.370934, 8.541339, 47.370869, 8.541173, 47.370549, 8.541929, 47.370614, 8.541892, 47.369895, 8.542975, 47.37, 8.543286, 47.370077, 8.543565, 47.369521, 8.543496, 47.369118, 8.545228, 47.367595, 8.545593, 47.367163, 8.54592, 47.36685, 8.546526, 47.36636, 8.547009, 47.365986, 8.547884, 47.36644, 8.547567, 47.366611, 8.547186, 47.366919, 8.547605, 47.367065, 8.547202, 47.367319, 8.547068, 47.367352, 8.546832, 47.367254, 8.546183, 47.367879, 8.546945, 47.36822, 8.547245, 47.368344, 8.548061, 47.369219, 8.548908, 47.370095, 8.549311, 47.370505, 8.550619, 47.371915, 8.550721, 47.372209, 8.550678, 47.372427, 8.55055, 47.37266, 8.549772, 47.374298, 8.549632, 47.374531, 8.549477, 47.374672, 8.548624, 47.376619, 8.54805, 47.376518, 8.547197, 47.376318],
    [8.503547, 47.381295, 8.49977, 47.378636, 8.498633, 47.377648, 8.499792, 47.377386, 8.503633, 47.377589, 8.503911, 47.377604, 8.503976, 47.377321, 8.503793, 47.377183, 8.507098, 47.375446, 8.506991, 47.375279, 8.508182, 47.374625, 8.508503, 47.374749, 8.509115, 47.374509, 8.509952, 47.375039, 8.50948, 47.375323, 8.510735, 47.37594, 8.512666, 47.377183, 8.515048, 47.376122, 8.517559, 47.37541, 8.519179, 47.375047, 8.521518, 47.374487, 8.522269, 47.37432, 8.524339, 47.374276, 8.525026, 47.374291, 8.526839, 47.375541, 8.528867, 47.373666, 8.528974, 47.373404, 8.530337, 47.373652, 8.531635, 47.373426, 8.533545, 47.372874, 8.533566, 47.3723, 8.533244, 47.371988, 8.531849, 47.370781, 8.532729, 47.370273],
    [8.564744, 47.37089, 8.565195, 47.370818, 8.565774, 47.371225, 8.566375, 47.37012, 8.566761, 47.369219, 8.566922, 47.368812, 8.565812, 47.368304, 8.565806, 47.368227, 8.565157, 47.368118, 8.565103, 47.368184, 8.564267, 47.368028, 8.564996, 47.3668, 8.565645, 47.365764, 8.566343, 47.364772, 8.566353, 47.364638, 8.566402, 47.364579, 8.565162, 47.36374, 8.564626, 47.363522, 8.563247, 47.363035, 8.561783, 47.362508, 8.560715, 47.362127, 8.560436, 47.361992, 8.560265, 47.36176, 8.559959, 47.361952, 8.559455, 47.362101, 8.558468, 47.362599, 8.55799, 47.36293, 8.557867, 47.362937, 8.55711, 47.363511, 8.557094, 47.363595, 8.556381, 47.363969, 8.554589, 47.36463, 8.554106, 47.364765, 8.553194, 47.365143, 8.55232, 47.365481, 8.551311, 47.365713, 8.55033, 47.365797, 8.549933, 47.365866, 8.548892, 47.366153, 8.548404, 47.366313, 8.547353, 47.365684, 8.546966, 47.365473, 8.546569, 47.365339, 8.545765, 47.365117, 8.545545, 47.365059, 8.54533, 47.365005, 8.544359, 47.366527, 8.544397, 47.366549, 8.54422, 47.366829, 8.544236, 47.36697, 8.544263, 47.36709, 8.545094, 47.367127]
]
var data = [{
    "uid": "1",
    "title": "Rosenhof, Brunnen",
    "lat": 47.372858,
    "lng": 8.543321,
    "route": 1,
    "images": ['Skulpturen im Rosenhof, Aufnahme 1968.', 'Der Bildhauer Peter Meister bat Max Frisch 1967 um einen Text, den er dann in den Muschelkalk meisselte.', 'Rosenhof-Skulptur des Bildhauers Peter Meister.'],
    "zoom": [1, 1, 0],
    "info": ['Baugeschichtliches Archiv der Stadt Zürich', '„Zürcher Brunnen“. Herausgeber: Wasserversorgung Zürich, 1993.', 'Max Frisch-Archiv, Zürich'],
    "quote": 'Max Frisch, Tagebuch 1966-1971, Suhrkamp Verlag 1972',
    "text": '<p>In Zürichs Altstadt findet sich der Rosenhof – ein kleiner, von Wohnhäusern und Restaurants umgebener Platz, der von März bis Dezember zu neuem Leben erwacht, wenn nämlich Künstler und Händler aus aller Welt an ihren Marktständen ihre Schätze zeigen. Das Zentrum dieses Spektakels bildet seit 1967 ein Brunnen, der als Kunstwerk deklariert werden musste, um dort mit Bewilligung der Stadt Zürich stehen zu dürfen.<br />Die Brunnen-Skulptur gestaltet Peter Meister; Max Frisch wird gebeten, eine Inschrift zum Thema «Chronik 1967» zu verfassen. Es ist die Zeit der offenen Intervention der USA im Vietnamkrieg und der Bombardierung Nordvietnams durch reguläre US-Kampftruppen. Frischs Text macht den Brunnen nicht nur zu einem Mahnmal für die Opfer des Vietnamkriegs, sondern zu einem historischen Denkmal gegen jede Form der kriegerischen Auseinandersetzung.</p><p><i>HIER RUHT \/ 1967 NIEMAND \/ kein grosser \/ zeitGENOSSE / ZÜRCHER \/ patriot \/ denker und \/ REFORMATOR \/ STAATSMANN \/ DER SCHWEIZ \/ oder REBELL \/ im XX. jahrhundert \/ weitsichtiger \/ BEGRÜNDER \/ PLANER \/ der ZUKUNFT \/ der freiheit \/ die trotzdem kommt \/ usw. \/ 1967 \/ kein berühmter flüchtling \/ wohnte hier oder starb unge- \/ fähr hier zum ruhm unserer \/ vaterstadt. kein ketzer wurde \/ hier verbrannt. hier kam es \/ zu keinem Sieg. keine sage, \/ die uns ehrt, erfordert hier \/ ein denkmal aus stein. hier \/ gedenke unserer taten heute \/ dies denkmal ist frei \/ hier ruht kein kalter krieger \/ dieser stein, der stumm ist, \/ wurde errichtet zur zeit des krieges in VIETNAM \/ 1967</i></p>'
}, {
    "uid": "2",
    "title": "Bodega Española",
    "lat": 47.37123,
    "lng": 8.54406,
    "route": 1,
    "images": ['Die „Bodega Española“: seit 1874 eine Zürcher Institution.', 'Peter Bichsel, einer der Schriftsteller, die Max Frisch in der „Bodega“ zum Gespräch traf. Hier die beiden bei ihrer ersten Begegnung im Stadthaus Zürich im Jahr 1965.', 'Essen mit spanischem Ambiente in der „Bodega“.', 'Die Bodega Española: Weinhandlung und Restaurantbetrieb in einem.'],
    "info": ['Bodega Espanola, Zürich', 'Pia Zanetti, Zürich', 'Bodega Espanola, Zürich', 'Bodega Espanola, Zürich'],
    "quote": 'Peter Bichsel, In: du. Die Zeitschrift der Kultur, Heft Nr. 12/Dezember 1991',
    "text": '<p>In diesem gemütlichen spanischen Lokal in der Zürcher Altstadt unweit des Grossmünsters ist Max Frisch oft anzutreffen. Die Patina-Atmosphäre des 1874 eröffneten zweigeschossigen Lokals mit Holzvertäfelungen, Eisenofen und spanischen Theaterillustrationen an den Wänden dürfte sich seit Frischs Zeiten kaum verändert haben. Nach Aussagen seiner zweiten Ehefrau Marianne ist die Bodega eine seiner Lieblingskneipen. Hier kann man herrlich einen ganzen Abend verplaudern – wie es auch Max Frisch häufig tut.<br />Die Bodega findet, wenn teilweise auch verschlüsselt, Eingang in Frischs Werk. Auch der Goldschmied in Frischs Erzählung Bodega Gorgot aus dem Tagebuch 1966-1971 sitzt allabendlich in der Bodega, während er sich mehr und mehr von seinem Leben und seiner Umwelt entfremdet.<br />Frischs enger Freund Peter Bichsel erinnert sich an eine denkwürdige Begegnung mit Max Frisch in der Bodega. Kurze Zeit nach der Uraufführung eines neuen Stücks von Frisch, „Biografie. Ein Spiel“, trifft man sich im Frühjahr 1968 in der Bodega:<br /></p><p><i>"Biografie", damals kannte ich ihn bereits. Ich traf ihn zufällig in der Bodega, und er zwang mich, in die Aufführung am Schauspielhaus zu gehen und wartete in der Bodega, bis ich zurückkam und erzählte. Ich war erschüttert und aufgewühlt. Was ich damals aber noch nicht wusste - es war nicht nur der Beginn des Abschieds vom Leben, es war - fast bewusst - der Abschied vom Theater. Das Spiel war entlarvt.</i></p>'
}, {
    "uid": "3",
    "title": "Hotel Storchen",
    "lat": 47.371355,
    "lng": 8.541865,
    "route": 1,
    "images": ['Das Geschäft „Magazine Storchen“ wurde 1938 abgerissen, Aufnahme 1938. ', 'Anstelle des Geschäftes „Magazine Storchen“ wurde Ende der 1930er Jahre das „Hotel zum Storchen“ errichtet.', 'Im Hotel Storchen traf sich Max Frisch unter anderem mit seinem Verleger Siegfried Unseld, um die Max Frisch-Stiftung zu gründen. Hier sieht man die beiden auf der Frankfurter Buchmesse im Jahr 1976.', 'Szene aus dem Film „Zürich-Transit“, der 1992 in der alten „Storchen-Bar“ gedreht wurde.'],
    "zoom": [1, 1, 0, 1],
    "info": ['Baugeschichtliches Archiv der Stadt Zürich', 'Baugeschichtliches Archiv der Stadt Zürich', 'Max Frisch-Archiv, Zürich', 'Filmstill aus „Zürich – Transit“; Regie Hilde Bechert, München'],
    "quote": 'Max Frisch, Mein Name sei Gantenbein, Suhrkamp Verlag 1964',
    "text": '<p>«Was wäre wenn…?» Wenn es zum Beispiel durch eine Verwechslung dazu käme, dass einer in der Zeitung von seinem eigenen Tod liest, und dann als heimlicher Beobachter an seiner Beerdigung teilnimmt? Im Filmskript Zürich-Transit, das auf einer Episode des 1964 erschienenen Romans Mein Name sei Gantenbein beruht, wird eben dieses skurrile Szenario durchgespielt.<br />In der Verfilmung des Skripts von Hilde Bechert im Jahr 1992 ist das traditionsreiche Hotel «Storchen» in unmittelbarer Nähe der Zürcher Rathausbrücke Schauplatz eines Leichenmahls.</p><p><i>„Jetzt stand er in der Wirtschaft, wo die Trauergemeinde sich nachher zu versammeln gedachte, und trank einen Grappa, dann ein Bier, dann einen zweiten Grappa, ohne seinen Mantel abzulegen. Ein unmögliches Etablissement, fand er, ein Café im Heimatstil. Für den Leichenschmaus war das obere Stockwerk bestellt.“</i></p><p>Im Jahr 1979 treffen sich zudem im Hotel Storchen  Max Frisch, sein Verleger Siegfried Unseld und weitere Personen, um die Gründung einer Max Frisch-Stiftung in die Wege zu leiten.</p>'
}, {
    "uid": "4",
    "title": "Kirche St. Peter",
    "lat": 47.37114,
    "lng": 8.54069,
    "route": 1,
    "images": ['Der bald 80-jährige Max Frisch in seiner Zürcher Wohnung in der Stadelhoferstrasse 28.', '1982 hielt Max Frisch bei der Abdankungsfeier für seinen Freund Peter Noll die Totenrede. 1984 erschienen Nolls „Diktate über Sterben & Tod“ zusammen mit Frischs Totenrede.'],
    "info": ['Max Frisch-Archiv, Zürich', 'Max Frisch-Archiv, Zürich'],
    "quote": 'Max Frisch, Totenrede, In: Peter Noll, Diktate über Sterben & Tod, Pendo Verlag 1984<br >Max Frisch, 15. Mai 1911 - 4. April 1991: Totenfeier in der Kirche St. Peter, Zürich am 9. April 1991, Selbstverlag',
    "text": '<p>"Was hat in der Kirche ein Agnostiker zu sagen?" fragt Max Frisch zu Beginn seiner Totenrede für seinen Freund Peter Noll im Jahr 1982. Frisch hält die Rede gut evangelisch "als Person ohne Amt" und endet mit dem Eingeständnis einer Sehnsucht:</p><p><i>"Der Verstorbene, hat inzwischen eine Erfahrung, die mir erst noch bevorsteht und die sich nicht vermitteln lässt - es geschehe denn durch eine Offenbarung im Glauben."</i></p><p>Frisch äussert zur Verwunderung vieler den Wunsch, die Trauerfeier für ihn möge in einer Kirche stattfinden. Die evangelisch-reformierte Kirchgemeinde St. Peter in Zürich ist seit Generationen der „liberalen Theologie“ verpflichtet und gewährt dem am 4. April 1991 Verstorbenen dessen Bitte.<br />Frisch selbst bereitet die Trauerfeier bis ins kleinste Detail vor. So zeichnet er genau auf, wo der Sarg, wo die Blumen, wo die Musiker zu stehen haben. Auf seinen Wunsch hin verliest seine letzte Lebensgefährtin Karin Pilliod-Hatzky eine kurze Erklärung des Verstorbenen. Danach sprechen seine Freunde Michel Seigner und Peter Bichsel. Reden von offiziellen Vertretern der Stadt Zürich oder des Bundes verbittet sich Frisch ebenso wie zuvor schon Pfarrer und Segen am Totenbett.</p><p>In der Totenrede des Freundes Michel Seigner heisst es:<br /><i>«Auch Max’ letzte Mitteilung am Morgen vor seinem Tod,<br />zwischen Schmerz-, Dämmer- und Wachzustand, ist ein Plan:<br />"Ich plane es Schiff –" / "Es isch es Kapitänsschiff –" und auf die<br />Frage: "Und du wärsch dänn de Kapitän?" antwortet er: "Nei,<br />jetzt müend d Lüt sälber für sich luege."»'
}, {
    "uid": "5",
    "title": "Elfuhrgeläute auf der Münsterbrücke",
    "lat": 47.369955,
    "lng": 8.542498,
    "route": 1,
    "images": ['Münsterbrücke mit Blick auf das Grossmünster, Aufnahme 1940.', 'Passanten auf der Münsterbrücke mit Blick auf die Kirche Fraumünster, Aufnahme 1940.', 'Herbst 1965: Max Frisch bei den Dreharbeiten zum geplanten Filmprojekt „Zürich-Transit“ auf der Münsterbrücke.', 'Herbst 1965: Max Frisch auf der Münsterbrücke, links davon ist die Wasserkirche zu sehen.'],
    "info": ['Baugeschichtliches Archiv der Stadt Zürich', 'Baugeschichtliches Archiv der Stadt Zürich', 'Pia Zanetti, Zürich', 'Pia Zanetti, Zürich'],
    "quote": 'Max Frisch, Mein Name sei Gantenbein, Suhrkamp Verlag 1964',
    "text": '<p>Die Münsterbrücke oder Helmhausbrücke verbindet die beiden Kirchen Fraumünster und Grossmünster. Die mit Natursteinen gemauerte Bogenbrücke wird als schönste Limmatbrücke Zürichs bezeichnet und ist der älteste noch im Originalzustand erhaltene Limmatübergang der Stadt.</p><p>Auch wenn sich Max Frisch immer wieder an Zürich reibt und die kritische Auseinandersetzung mit seiner Vaterstadt sucht, so ist die Stadt an der Limmat doch eine der grossen und dauerhaftesten Lieben in seinem Leben. Aus diesem ambivalenten Verhältnis schöpft er Inspiration und Ermutigung. Ein Zeichen der Verbundenheit mit Zürich ist das Elfuhrgeläute der Kirchen in der Innenstadt. Die Beschreibung des Glockengeläuts fehlt in keinem seiner Werke. Für ihn ist es ein vertrautes Stück Heimat wie auch für seine Protagonisten Stiller, Gantenbein und Faber.</p><p><i>«[...] während des Elfuhrgeläutes, das zehn Minuten dauerte —<br />es gehört zu meinen frohesten Erinnerungen, dieses Elfuhrgeläute;<br />am besten, finde ich, tönt es, wenn man über die<br />Helmhausbrücke schlendert, dann mischt es sich von allen<br />Türmen über dem Wasser… Vielleicht hat sich die Leiche drum<br />gerade dort verfangen.»</i></p>'
}, {
    "uid": "6",
    "title": "Café Terrasse",
    "lat": 47.367771,
    "lng": 8.544595,
    "route": 1,
    "images": ['Das Gebäude, in dem sich das Café „Terrasse“ befindet. Aufnahme 1966.', 'Eingang zum Café „Terrasse“, Aufnahme 1926.', 'Zum Kreis der „Samstagsbündler“, die sich in den 1940er Jahren im Café Terrasse trafen, gehörten auch das Künstlerpaar Yoshida und Eugen Früh. Hier sieht man Max Frisch (am Ofen lehnend) bei einem Fest der Frühs.'],
    "zoom": [1, 1, 0],
    "info": ['Baugeschichtliches Archiv der Stadt Zürich', 'Baugeschichtliches Archiv der Stadt Zürich', 'Eugen + Yoshida Früh-Stiftung, Zürich'],
    "quote": 'Max Frisch, Tagebuch 1946-1949, Suhrkamp Verlag 1950',
    "text": '<p>Im Café Terrasse, das auch heute noch durch seine eleganten und grosszügigen Räumlichkeiten imponiert, skizziert Max Frisch vieles in die blauen Notizbüchlein. Später finden diese Notizen Eingang in sein erstes Tagebuch. Das „Terrasse“ ist eines seiner Stammcafés, wo er oft alleine am Tisch sitzt und schreibt; es bleibt bis Anfang der 1950er Jahre sein heimischer Rückkehr- und Rückzugsort.<br />Bereits 1946 notiert er in dem früher wie heute beliebten Restaurantgarten unter dem Eintrag „Café de la Terrasse“:</p><p><i>«Ringsum die brandende Stadt, arbeitsam und rege, das Hupen der Wagen, das hohle Dröhnen von den Brücken – und hier diese grünende Insel der Stille, der Musse. (…) Es ist Samstag. Es ist elf Uhr, die Stunde, wie ich sie liebe: alles in uns ist noch wach, heiter ohne Überschwang, fast munter wie das rieselnde Baumlicht über den marmornen Tischlein, nüchtern, ohne die Hast einer wachsenden Verzweiflung, ohne die abendlichen Schatten der Melancholie...»</i></p><p>Das Café am Limmatquai ist in den 1940er und 1950er Jahren ein wichtiger Treffpunkt des Zürcher Kulturlebens. Um den Kunstmaler Eugen Früh und Max Frisch bildet sich ein aussergewöhnlicher Freundeskreis: die «Samstagsbündler». Zum harten Kern, der sich ab 1943 jeden Samstag um elf Uhr im «Terrasse» trifft, gehören Buchhändler, Galeristen, Künstler und Schriftsteller.</p><p>Hier liest Frisch vermutlich auch die Zeitungsnotiz zu einem rätselhaften Mordfall, die ihn zu seinem Drama «Graf Öderland» inspiriert. Dieses Stück gelangt 1951 im Zürcher Schauspielhaus zur Uraufführung. Und viel später erinnert er sich noch sehr genau, dass im „Terrasse“ die Prosaskizze zu „Der andorranische Jude“, Keimzelle seines Stücks „Andorra“, entstanden ist.<br >Ab 1946 bricht Frisch zu Reisen durch das zerstörte Nachkriegseuropa auf. Die dort entstandenen Notizen verarbeitet er an einem Marmortisch im Café Terrasse. Sie werden später zu einem beredten Zeugnis einer zerrissenen Zeit.</p>'
}, {
    "uid": "7",
    "title": "Café Odeon",
    "lat": 47.367820,
    "lng": 8.545156,
    "route": 1,
    "images": ['Im 1910 erbauten „Usterhof“ befindet sich das Café Odeon, das 2011 sein 100-jähriges Bestehen gefeiert hat. Aufnahme 1955.', 'Interieur im Café Odeon, Aufnahme 1943.', 'Das „Café Odeon“ warb stets für die gepflegte Kaffeehauskultur.', 'Das „Café Odeon“, seit über 100 Jahren ein Ort der Einkehr und des Gesprächs.', 'Eingang zum „Café Odeon“, Aufnahme 1982.', 'Das „Café Odeon“ heute, auch auf dem Boulevard einladend.'],
    "zoom": [1, 1, 0, 1, 1, 1],
    "info": ['Baugeschichtliches Archiv der Stadt Zürich', 'Baugeschichtliches Archiv der Stadt Zürich', 'Café Odeon', 'Café Odeon', 'Volker Hage/Max Frisch-Archiv, Zürich', 'Café Odeon'],
    "quote": 'Max Frisch, Tagebuch 1946-1949, Suhrkamp Verlag 1950',
    "text": '<p>Auch im – dem «Café Terrasse» gegenüberliegenden – «Café Odeon» verkehrt Max Frisch regelmässig. Hier allerdings nicht zum Plaudern wie in der Bodega Español, sondern zum Philosophieren, Schreiben und zum Austausch mit Kollegen.</p><p>Mit dem legendären Café teilt Frisch das Jahr seiner Geburt: 1911. Das typische Wiener Kaffeehaus im Jugendstil wird seit seiner Eröffnung vor allem von Künstlern, Bohemiens und Literaten aufgesucht. Kehren in den Anfangszeiten die Dadaisten und Exilanten wie Lenin oder Mussolini hier ein, so wird das „Odeon“ nach 1933 gerade für die aus Nazideutschland Emigrierten und Ausgebürgerten zur Drehscheibe und Heimat. Heinrich Mann nannte es sogar „ein fröhliches Exil“.</p><p>Zahlreiche Einträge in Frischs Tagebuch 1946-1949 sind mit «Café Odeon» betitelt.</p><p><i>«Gestern vormittag im Odeon höre ich, wie jemand am Nebentisch meinen Namen sagt, viel Genaues höre ich nicht, sehe aber, dass der Mann, der mich persönlich nicht kennt, mit dem Namen einen deutlichen Hass verbindet, nicht nur Geringschätzung, sondern Hass. Soll ich mich vorstellen? Ich tue es nicht, zahle, nehme den Mantel und gehe.»</i></p>'
}, {
    "uid": "8",
    "title": "Kronenhalle",
    "lat": 47.367593,
    "lng": 8.545722,
    "route": 1,
    "images": ['Restaurant Kronenhalle, Aufnahme 1947', 'Max Frisch feiert mit den Schauspielern die Uraufführung seines Stücks „Andorra“ im Restaurant "Kronenhalle" im Jahr 1961.', 'Max Frisch 1963 im Gespräch mit Friedrich Dürrenmatt im Restaurant "Kronenhalle".', 'Die Schauspielerin Therese Giehse gehörte ebenfalls zu den Gästen der „Kronenhalle“. Die Aufnahme stammt von der Uraufführung von Max Frischs Stück „Don Juan oder Die Liebe zur Geometrie“ im Jahr 1953.'],
    "zoom": [1, 1, 0],
    "info": ['Baugeschichtliches Archiv der Stadt Zürich', 'Jack Metzger/ETH-Bibliothek Zürich, Bildarchiv', 'Jack Metzger/ETH-Bibliothek Zürich, Bildarchiv', 'Max Frisch-Archiv, Zürich'],
    "quote": 'Eintrag von Max Frisch in das Gästebuch der Kronenhalle',
    "text": '<p>Frischs drittes Stammlokal mit Tradition ist die „Kronenhalle“, eine alteingesessene Zürcher Institution. Auch wenn dieses altehrwürdige, gutbürgerliche Restaurant von 1862 mit seinen holzvertäfelten Wänden und seinen echten Gemälden von Picasso, Miro, Braque oder Chagall heute in jedem Reiseführer zu finden ist, so hat es sich doch etwas von seinem diskreten Charme und seiner herzlichen Atmosphäre bewahrt. Verkehren hier zu früheren Zeiten Geistesgrössen wie James Joyce oder Eugène Ionesco, so mischen sich heute auch zahlungskräftige Touristen unter die Gäste.</p><p>In der Kronenhalle treffen sich Max Frisch und Friedrich Dürrenmatt während der Zeit ihrer Freundschaft immer wieder zum Essen, hier werden zusammen mit Therese Giehse oder Maria Becker die Premieren seiner Theaterstücke im nahen Schauspielhaus begossen. So auch die Premiere seines Stückes „Andorra“, das im November 1961 seine Uraufführung erlebt. Und hierher lädt Frisch gerne auch Gäste aus dem Ausland ein.</p><p>Ein Foto von Frisch und Dürrenmatt hängt noch heute in der Brasserie, und im Gästebuch kann man die folgende Widmung von Frisch nachlesen:</p><p><i>Max Frisch<br />Immer wieder und<br />noch mal —<br />8. 2. 1977</i></p>'
}, {
    "uid": "9",
    "title": "Stadelhofer Passage, letzte Wohnung von Max Frisch",
    "lat": 47.36746,
    "lng": 8.54715,
    "route": 1,
    "images": ['Max Frisch zog 1983 in die neu erbaute „Stadelhoferpassage“, wo er bis zu seinem Tod im Jahr 1991 wohnte. Aufnahme von 1989', 'Die Dachterrasse der Wohnung.', 'Einblick in den Wohnbereich von Max Frisch, Aufnahme 1991.', 'Der Arbeitsplatz des Schriftstellers in der Wohnung an der Stadelhoferstrasse 28 im Jahr 1991.'],
    "info": ['Baugeschichtliches Archiv der Stadt Zürich', 'Yvonne Böhler/Max Frisch-Archiv, Zürich', 'Yvonne Böhler/Max Frisch-Archiv, Zürich', 'Yvonne Böhler/Max Frisch-Archiv, Zürich'],
    "quote": 'Max Frisch, Mitten in der Stadt, In: Stadelhofer Passage 1984, Spaltenstein Holding AG Zürich, 1984',
    "text": '<p>Max Frisch wechselt ein Leben lang die Wohnorte. Neben Zürich sind es Rom, New York und Berlin, wo er jeweils für mehrere Monate im Jahr seine Zelte aufschlägt. Nach seiner Rückkehr aus New York im Jahr 1983 bezieht er eine zweigeschossige Maisonettewohnung in der damals neu erbauten Stadelhofer Passage. Diese bewohnt er bis zu seinem Tod. Von hier aus pendelt er zu seinem Haus im Tessin, wo er nach wie vor viel Zeit verbringt.</p><p><i>«In der Stadelhoferpassage gefällt´s mir: Ich erreiche zu Fuss die Buchhandlung Rohr, die Kronenhalle und den Bratwurst-Stand und die Apotheke, […], sowie das Kunsthaus, dazu fünf Kinos und vier Kioske […]. Von der Terrasse aus sehe ich ein wenig Grossmünster und Sankt Peter, die Luft ist voller Abgase, ich weiss, aber ich will ja nicht ewig leben.»</i></p><p>In den letzten Lebensjahren zieht sich Frisch mehr und mehr aus der Öffentlichkeit zurück. Er schreibt nur noch wenig. Seine letzten grösseren Auftritte hat er 1986 mit seiner Solothurner Rede über die gescheiterte Aufklärung in postmodernen Zeiten. Als öffentlicher Fürsprecher der Volksinitiative zur Abschaffung der Schweizer Armee und mit seinem letzten Theaterstück „Jonas und sein Veteran“ sorgt er 1989 für eine landesweite Diskussion.<br />Am 4. April 1991 stirbt Max Frisch in seiner Wohnung. Eine Gedenktafel verweist auf seine letzte Wohnstätte.</p>'
}, {
    "uid": "10",
    "title": "Schauspielhaus Zürich",
    "lat": 47.37026,
    "lng": 8.54922,
    "route": 1,
    "images": ['Ein Kommen und Gehen vor dem Schauspielhaus, undatiertes Foto, ca. 1935.', 'Urbanes Leben auf dem Heimplatz vor dem Schauspielhaus, Aufnahme 1945', 'Max Frisch und Regisseur Kurt Hirschfeld im Schauspielhaus; während Proben zu Max Frischs Drama „Andorra“, das dort 1961 uraufgeführt wurde.', 'Max Frisch zusammen mit dem Regisseur Benno Besson (links), der 1989 die Uraufführung von „Jonas und sein Veteran“ am Schauspielhaus inszeniert hat.'],
    "zoom": [1, 1, 1, 0],
    "info": ['Baugeschichtliches Archiv der Stadt Zürich', 'Baugeschichtliches Archiv der Stadt Zürich', 'Jack Metzger/ETH-Bibliothek Zürich, Bildarchiv', 'Jürg Bohlen/Max Frisch-Archiv, Zürich'],
    "quote": 'Max Frisch, Tagebuch 1946-1949, Suhrkamp Verlag 1950',
    "text": '<p>Das Zürcher Schauspielhaus am «Pfauen», das im Jahr 1901 eröffnet wird, erlebt seine Blütezeit von 1933 bis 1945: Zahlreiche Schriftsteller, Dramaturgen, Schauspieler, Film- und Theaterregisseure, Bühnenbildner und Musiker, die aus dem faschistischen Deutschland fliehen müssen, finden hier eine Wirkungsstätte und verhelfen dem Schauspielhaus zu internationaler Anerkennung.<br />Der Theaterregisseur und Dramaturg Kurt Hirschfeld ermutigt Max Frisch, der seit seiner Jugend eine Affinität zum Theater hat, Stücke zu schreiben. Bereits im März 1945 wird das Requiem Nun singen sie wieder uraufgeführt, im Jahr darauf folgen die Romanze Santa Cruz und die Farce Die Chinesische Mauer. In diesem Umfeld lernt Frisch neben vielen Theatergrössen auch Bertolt Brecht kennen, mit dem er in dessen Zürcher Jahren (1947–1949) in regelmässigem und anregendem Kontakt steht.</p><p>Fast alle Dramen von Max Frisch finden ihre Uraufführung am Zürcher Schauspielhaus. Dabei lässt es sich Frisch nicht nehmen, so oft wie möglich  den Proben für seine Stücke beizuwohnen. Sie ermöglichen ihm, in Diskussionen mit den Schauspielern, Regisseuren und Intendanten Einfluss auf die Inszenierungen zu nehmen. „Emphatisch glücklich“ verliess er die Proben.</p><p><i>«Heute wieder einmal an einer Probe, und da ich eine Stunde zu früh war, verzog ich mich in eine Loge, wo es dunkel ist wie in einer Beichtnische. […] Nur gelegentlich ging ein Arbeiter über die Bühne […] — kurz darauf erscheint eine Schauspielerin, die gerade einen Apfel isst, während sie in Mantel und Hut über die leere Bühne geht; sie sagt dem Arbeiter guten Morgen, nichts weiter, und dann wieder die Stille, die leere Bühne […]. Die kleine Szene, die sich draussen auf der Strasse tausendfach ergibt, warum wirkte sie hier so anders, so viel stärker?»</i></p>'
}, {
    "uid": "11",
    "title": "Kantonales Realgymnasium",
    "lat": 47.37214,
    "lng": 8.55010,
    "route": 1,
    "images": ['Von 1924 bis 1930 absolvierte Max Frisch das kantonale Realgymnasium, Aufnahme 1930.', '1930, Klasse 6 AR am Kantonalen Realgymnasium. 2. Reihe links, in Knickerbockern ist Max Frisch zu sehen.'],
    "zoom": [1, 0],
    "info": ['Baugeschichtliches Archiv der Stadt Zürich', 'Max Frisch-Archiv, Zürich'],
    "quote": 'Max Frisch, Tagebuch 1946-1949, Suhrkamp Verlag 1950',
    "text": '<p>Von 1924 bis zur Maturität im Jahr 1930 besucht Max Frisch das Kantonale Realgymnasium an der Rämistrasse 56. Hier lernt er seinen langjährigen Freund und späteren Förderer Werner Coninx kennen. Nach der Schule begleitet Frisch seinen Freund nach Hause, denn die Stunden mit ihm sind für Frisch mit  grossem Gewinn verbunden. So hört er im Haus der Coninx zum ersten Mal von Nietzsche, von Spengler oder von Schopenhauer. Hier findet er auch Zugang zu klassischer Musik, indem er mit seinem Freund abendelang Plattenaufnahmen hört.</p><p>Frischs Lesestoff in jungen Jahren beschränkt sich fast ausschliesslich auf <i>Don Quixote</i> und <i>Onkel Toms Hütte</i>. Weit mehr kann er sich für Fussball begeistern.</p><p>In Frischs Schulzeit fallen auch prägende Theatererlebnisse im Zürcher Schauspielhaus, die er später immer wieder als Auslöser für seine anhaltende Begeisterung für das Theater und seine Hinwendung zum Dramenschreiben nennt.</p><p><i>«[…] Bis zur Matur, die ich natürlich als überflüssig, förmlich, lächerlich und spiessig erachtete und nur dem Vater zuliebe machen musste, entstanden noch drei oder vier weitere Schauspiele, darunter eine Komödie der Ehe (ich hatte noch nie ein Mädchen geküsst), ferner eine Farce über die Eroberung des Mondes. Das einzige, was die Welt von alledem anerkannte, war die Matur. Der Gang an die Universität war unvermeidlich […] Gedichte gelangen nie.»</i></p>'
}, {
    "uid": "12",
    "title": "Universität Zürich",
    "lat": 47.37464,
    "lng": 8.54899,
    "route": 1,
    "images": ['Blick auf die 1912-14 erbaute Universität Zürich. Max Frisch studierte hier von 1930 bis 1934 Germanistik.  ', 'Die Universität Zürich, Aufnahme 1942.', 'Kommilitonen aus dem Germanistikstudium an der Universität. Das Foto wurde 1930 vermutlich von Max Frisch aufgenommen.', 'Max Frisch als Student im Jahr 1934.'],
    "info": ['Baugeschichtliches Archiv der Stadt Zürich', 'Baugeschichtliches Archiv der Stadt Zürich', 'Max Frisch-Archiv, Zürich', 'Max Frisch-Archiv, Zürich'],
    "quote": 'Max Frisch, Was bin ich (I), In: Zürcher Student, 1932',
    "text": '<p>Von 1930 bis 1934 studiert Max Frisch an der Universität Zürich Germanistik. Er besucht nicht nur Vorlesungen und Proseminare so bekannter Schweizer Geistesgrössen wie Walter Muschg oder Robert Faesi, sondern hört auch fachfremde Vorlesungen, unter anderen in Kunstgeschichte bei Heinrich Wölfflin.</p><p>Neben dem Studium verdingt sich Max Frisch als freier Mitarbeiter für verschiedene Zeitungen wie die «Neue Zürcher Zeitung» und den «Tages-Anzeiger». Nach dem plötzlichen Tod seines Vaters unterbricht Frisch sein Studium: Er muss jetzt seinen Lebensunterhalt gänzlich selbst verdienen, und auch seine Mutter ist auf seine finanzielle Unterstützung angewiesen. Diese äusseren Umstände verstärken Frischs existentielle Zweifel, die er in einem seiner ersten Prosatexte Was bin ich?, entstanden 1932, pointiert beschreibt: Welchen Weg soll er für sein Leben einschlagen: Soll er seiner literarischen Neigung nachgehen oder einen bürgerlichen Brotberuf erlernen?</p><p><i>«Vor einer Woche war ich ja noch Student. Und heute? Was bin ich denn heute? Ich empfehle mich schriftlich, telephonisch, mündlich. Und das lege ich alles mit einer Selbstsicherheit hin wie irgendein Schauspieler, der zum neuntenmal in derselben Rolle auftritt. Aber jedes Wort, mit dem ich diese Herren hinter den Schreibtischen von meiner Befähigung zu überzeugen suche, springt auf mich selber zurück mit einem Fragezeichen.»</i></p>'
}, {
    "uid": "13",
    "title": "ETH Zürich",
    "lat": 47.37651,
    "lng": 8.54810,
    "route": 1,
    "images": ['Studierende der Architektur an der ETH, Aufnahme 1941.', 'Von 1936 bis 1940 studierte Max Frisch Architektur an der Eidgenössischen Technischen Hochschule (ETH), im Bild die Diplomurkunde.', 'Erste Räumlichkeiten des Max Frisch-Archivs an der ETH Zürich.', 'Seit 2008 ist das Max Frisch-Archiv (MFA) organisatorisch der ETH-Bibliothek eingegliedert. Hier der Filmregisseur Volker Schlöndorff beim Quellenstudium im MFA im Jahr 2011.'],
    "info": ['Baugeschichtliches Archiv der Stadt Zürich', 'Max Frisch-Archiv, Zürich', 'Barbara Davatz/Max Frisch-Archiv, Zürich', 'Max Frisch-Archiv, Zürich'],
    "quote": 'Max Frisch, Entwürfe zu einem dritten Tagebuch, Suhrkamp Verlag 2010',
    "text": '<p>Im Jahr 1936 entscheidet sich Max Frisch für einen bürgerlichen Lebensentwurf. Zeitgleich beschliesst er, das Schreiben ganz aufzugeben und verbrennt in der Folge sämtliche bis dahin verfassten Texte. Es sollen auch Tagebücher darunter gewesen sein. Frisch beginnt ein Architekturstudium an der Eidgenössischen Technischen Hochschule, das ihm sein wohlhabender Jugendfreund Werner Coninx mit einer Summe von 16‘000 Franken finanziert.</p><p>Zu seinen Lehrern zählen unter anderen die Schweizer Architekten William Dunkel und Otto Rudolf Salvisberg sowie der Architekturkritiker Peter Meyer.<br />Nach dem Erhalt seines Diploms im Jahr 1940 arbeitet Frisch überwiegend als Architekt; der Schriftstellerei kann er sich vorerst nur in seiner Freizeit widmen. Nachdem er 1943 den Wettbewerb zum Bau des Freibads Letzigraben gewonnen hat, unterhält er ein eigenes Büro mit einem kleinen Team von Mitarbeitern.</p><p>An der ETH Zürich wird im Jahr 1980 auf Initiative des Schriftstellers das Max Frisch-Archiv eingerichtet, das sich heute an der ETH-Bibliothek befindet. Es ist eine eigenständige wissenschaftliche Einrichtung, die Frischs literarischen Nachlass betreut, pflegt und ergänzt und der Forschung zugänglich macht.</p><p><i>«Wenn ich in der Eidgenössischen Technischen Hochschule (Hauptgebäude) das Schild lese: MAX FRISCH ARCHIV — wie fühlt man sich:<br />wichtig? ausgeliefert? beschützt? bestattet? dankbar? historisch? Die Frage, wen das Material, das sich da anhäuft, je interessieren soll, die Frage nach dem öffentlichen Bedürfnis also habe ich nicht zu beantworten.»'
}, {
    "uid": "14",
    "title": "Freibad Letzigraben",
    "lat": 47.38022,
    "lng": 8.50122,
    "route": 2,
    "images": ['Freibadanlage Letzigraben im Bau. Aufnahme von 1948.', 'Max Frisch im Rohbau des Pavillon-Restaurants des Freibades, 1948.', 'Die Freibadanlage Letzigraben ist das bedeutendste Projekt, das Max Frisch realisierte. Aufnahme 1951', 'Am 18. Juni 1949 wird das erste und einzige öffentliche Bauwerk des Architekten Max Frisch eingeweiht.'],
    "info": ['Baugeschichtliches Archiv der Stadt Zürich', 'Max Frisch-Archiv, Zürich', 'Baugeschichtliches Archiv der Stadt Zürich', 'Lea Wolgensinger/Max Frisch-Archiv, Zürich'],
    "quote": 'Max Frisch, Tagebuch 1946-1949, Suhrkamp Verlag 1950',
    "text": '<p>Das Quartierbad Letzigraben ist das bedeutendste Projekt, das Max Frisch in seiner aktiven Zeit als Architekt realisiert. 1943 gewinnt er den ersten Preis beim Wettbewerb der Stadt Zürich, den diese für den Bau einer neuen Freibadanlage ausgeschrieben hat. Es gelingt Frisch, 64 Konkurrenten aus dem Feld zu schlagen. Das Preisgeld von 3\'000 Schweizer Franken und die Aussicht auf eine mehrjährige Beschäftigung mit dem Bau lassen ihn ein eigenes Architekturbüro gründen. Kriegsbedingt kann mit dem Bau des Freibades jedoch erst 1947 begonnen werden.<br />Einmal nimmt Frisch auch den aus dem US-Exil zurückgekehrten Bertolt Brecht mit auf die Baustelle, der sich sehr lobend über Frischs Arbeit äussert. „Frisch, Sie haben einen ehrlichen Beruf“. Architektonische Besonderheiten des «Volksbades» sind seine offene, weiträumige Anlage, der erste Zehn-Meter-Sprungturm der Schweiz sowie der im funktional-sachlichen Landistil erbaute Restaurantpavillon. Die gesamte Badeanlage steht heute unter Denkmalschutz. Im Tagebuch 1946-1949 hält Frisch den Fortgang der Bauarbeiten fest; auch der Tag der Eröffnung am 18. Juni 1949 wird beschrieben:</p><p><i>«Heute, Samstag achtzehnter Juni, ist die Anlage eröffnet worden. Sonniges Wetter und viel Volk. Sie schwimmen, springen von den Türmen. Die Rasen sind voll von Menschen, halb nackt und halb bunt, und es ist etwas wie ein wirkliches Fest; ein paar alte Leutchen, die natürlich nicht baden, bewundern die vielen Blumen, und der Pavillon mit den blauweissen Stores, der auf dem Galgenhügel steht, hat stürmischen Betrieb. Noch wird alles, bevor es benutzt wird, wie ein neues Spielzeug betrachtet; nur die Kinder planschen drauflos, als wäre es immer so gewesen.»</i></p>'
}, {
    "uid": "15",
    "title": "Friedhof Sihlfeld",
    "lat": 47.37593,
    "lng": 8.50462,
    "route": 2,
    "images": ['Friedhofsstille. Aufnahme aus dem Jahr 1914.', 'Herbst 1965: Max Frisch zusammen mit seiner Frau Marianne bei den Dreharbeiten zum geplanten Film „Zürich-Transit“.', 'Grabstein des Schriftstellers Gottfried Keller.', 'Grabstein von Henri Dunant, Gründer des Internationalen Komitees vom Roten Kreuz.', 'Grabstein der Schriftstellerin Johanna Spyri', 'Die friedliche Atmosphäre des Friedhofs lädt zum Spazieren und Verweilen ein.'],
    "info": ['Baugeschichtliches Archiv der Stadt Zürich', 'Pia Zanetti, Zürich', 'Stadt Zürich', 'Stadt Zürich', 'Stadt Zürich', 'Stadt Zürich'],
    "quote": 'Max Frisch, Zürich-Transit, Skizze eines Films, Suhrkamp Verlag 1966',
    "text": '<p>Der traditionsreiche Friedhof Sihlfeld wird 1877 als Zentralfriedhof eröffnet und bildet heute die grösste zusammenhängende Grünfläche der Innenstadt Zürichs. Viele Zürcher Persönlichkeiten sind hier bestattet; somit widerspiegelt der Friedhof auch das politische, wirtschaftliche und kulturelle Leben Zürichs. Im Sihlfeld ruhen beispielsweise Gottfried Keller, Johanna Spyri, August Bebel oder Marie und Albert Heim-Vögtlin. Eines der meistbesuchten Gräber ist jenes von Henri Dunant, dem Begründer der internationalen Rotkreuzbewegung. Auch der 2009 verstorbene Zürcher Schriftsteller Hugo Loetscher liegt hier begraben.</p><p>Der Friedhof Sihlfeld ist Anfang der 1990er Jahre Schauplatz des düster-sarkastischen Filmprojekts Zürich-Transit, das auf einer Episode in Max Frischs Roman Mein Name sei Gantenbein basiert: Durch eine Verwechslung wird der Geschäftsmann Theo Ehrismann für tot gehalten; er entscheidet sich, dieses Missverständnis nicht aufzuklären, sondern seinen offiziellen Tod als einmalige Chance zu begreifen, um nicht in sein altes Leben zurückkehren zu müssen. Im Filmskript wird beschrieben, wie der Protagonist sein eigenes Begräbnis beobachtet:</p><p><i>«Friedhofstille. Ein Gartenrechen auf Kies mit Herbstlaub. Es regnet immer noch. Jugendstil-Pforte. Am Ende einer Allee sieht man die Kuppel des Krematoriums. Ein grauer Tag ohne fernen Horizont. Ausser dem Gärtner, der Laub recht, kein Mensch. Dann Ehrismann in seinem hellen Regenmantel: er kommt durch die Jugendstil-Pforte und geht mitten auf der Zufahrtstrasse, die Ledermappe in der Hand, wie zu einer beruflichen Zusammenkunft.»</i></p>'
}, {
    "uid": "16",
    "title": "Lochergut",
    "lat": 47.37571,
    "lng": 8.51712,
    "route": 2,
    "images": ['Lochergut. Neues Wohnen im aufstrebenden Zürich. Aufnahme 1966.', 'Lochergut. Wohnungsklingel von M. Frisch. Lifthalt 7. Max Frisch lebte von 1965 bis 1968 im obersten Stockwerk.', 'Bereits 1951/52 hielt sich Max Frisch in New York auf, wo er sich von der Skyline der Stadt fasziniert zeigte. Später lebte er im Lochergut Zürich ebenfalls in einem «Wolkenkratzer». Die vorliegende Aufnahme stammt aus dem Jahr 1972'],
    "info": ['Baugeschichtliches Archiv der Stadt Zürich', 'Baugeschichtliches Archiv der Stadt Zürich', 'Jürgen Becker/Max Frisch-Archiv, Zürich'],
    "quote": 'Max Frisch, Cum grano salis, 1953, In: Gesammelte Werke, Suhrkamp Verlag 1976 und Max Frisch. Pro Helvetia Dossier, Reihe Literatur 2, 1981',
    "text": '<p>Im Jahr 1952 kehrt Max Frisch nach einem ersten Aufenthalt in den USA nach Zürich zurück, fasziniert von den dort gesammelten Eindrücken in modernem Städtebau und Hochhausarchitektur. In einer Rede vor Zürcher Architekten 1953 lässt er seiner Begeisterung freien Lauf:</p><p><i>«Mit Freude steht der Heimkehrende vor den ersten zürcherischen Hochhäusern; auch wenn man nicht sagen kann, dass sie ragen, so zeigen sie doch bereits, wie viel Himmel es noch gäbe auch über der Schweiz, wenn wir uns nicht ducken würden. […] Wie zögernd und unlustig wir den Massstab unserer Städte ändern, wie wehmütig, wie widerspenstig und halbbatzig. […] Die Idee, unsere Altstadt abzuschnüren vom Verkehr und als Reminiszenz zu pflegen, ist schön. Und daneben, im geziemenden Abstand, baue man die Stadt unserer Zeit!»</i></p><p>1955 verfasst er mit zwei Mitstreitern das Manifest „achtung: die Schweiz“, in dem er vorschlägt, auf die Landesausstellung Expo64 zu verzichten und stattdessen eine Musterstadt zu bauen.<br />Als Mitte der 1960er Jahre in der Badenerstrasse in Zürich nach Plänen des Architekten Karl Flatz die Hochhaussiedlung Lochergut gebaut wird, zieht Max Frisch mit seiner zweiten Ehefrau Marianne dort ein. Sie bewohnen als  Mieter der ersten Stunde eine Zweieinhalb-Zimmer-Wohnung im obersten Stockwerk. Allerdings gelingt es ihnen nicht, sich dort heimisch zu fühlen, so dass sie bereits nach drei Jahren wieder ausziehen.</p><p><i>«Es war ein ideologischer Entschluss dahinzugehen: Ich wollte nicht in dem mir bekannten, schöneren Zürich wohnen, sondern in einer anderen Sozialstruktur. Es hat sich dann aber kein Kontakt ergeben. Ich glaube nicht, dass es an mir gelegen hat, sondern an der Situation in diesem Haus. Ich bin nicht lange dort geblieben. -»</i></p>'
}, {
    "uid": "17",
    "title": "Buchhandlung am Helvetiaplatz, Volkshaus",
    "lat": 47.37545,
    "lng": 8.52716,
    "route": 2,
    "images": ['Max Frisch besuchte sehr oft die Genossenschafts-Buchhandlung am Helvetiaplatz. Aufnahme von 1950.', 'Am 23. April 1948 trug Bert Brecht dem Zürcher Publikum in der Katakombe sein berühmt gewordenes Gedicht »An die Nachgeborenen« vor. Die einleitenden Worte an diesem Abend sprach Max Frisch.'],
    "info": ['Baugeschichtliches Archiv der Stadt Zürich', 'Max Frisch-Archiv, Zürich'],
    "quote": 'Marthe Kauer, Die Katakombe. Zürichs Literatenkeller, Pendo Verlag 1991',
    "text": '<p>Die Buchhandlung im Volkshaus, eine ehemalige «Genossenschafts-Buchhandlung», wird jahrzehntelang von der legendären Buchhändlerin Marthe Kauer geleitet. Wie viele engagierte Schriftsteller, Künstler und Intellektuelle geht auch Max Frisch in der politisch links ausgerichteten Buchhandlung am Helvetiaplatz ein und aus. Im Keller, der so genannten «Katakombe», finden regelmässig Lesungen statt. Unter anderen sind Bertolt Brecht, Walter Mehring, Mascha Kaléko, Friedrich Dürrenmatt und Max Frisch zu Gast. Marthe Kauer erinnert sich:</p><p><i>«Max Frisch war schon in jungen Jahren Gast bei uns. […] Sein erstes Theaterstück NUN SINGEN SIE WIEDER (1945) war mit grossem Erfolg am Zürcher Schauspielhaus uraufgeführt worden. Wir hiessen ihn herzlich willkommen und freuten uns, dass er es nicht verschmäht hatte, aus den Höhen des Pfauentheaters in die Tiefe unserer Katakombe herabzusteigen. […] Elf Jahre später […] sassen wir mit ihm zusammen und hörten, dass er nicht aus HOMO FABER, wie vorgesehen, vortrage […], sondern aus einem Theaterstück, das noch nicht veröffentlicht sei, BIEDERMANN UND DIE BRANDSTIFTER heisse es.»</i></p><p>Am 23. April 1948 trägt Bert Brecht dem Zürcher Publikum in der Katakombe sein berühmt gewordenes Gedicht »An die Nachgeborenen« vor. Es wird zu einem der wichtigsten Texte der deutschen Exilliteratur. Die einleitenden Worte zu diesem Abend spricht Max Frisch.</p>'
}, {
    "uid": "18",
    "title": "Ehemaliges Architekturbüro Max Frisch",
    "lat": 47.37029,
    "lng": 8.53297,
    "route": 2,
    "images": ['Von 1943 bis 1955 befand sich das Architekturbüro von Max Frisch im Haus rechts im Bild. Das Haus wurde 1870 errichtet und 1967 abgerissen. Aufnahme 1907.', 'Anstelle des 1870 erbauten Hauses steht seit 1970 das Hochhaus des Architektenvereins SIA. Aufnahme 1971.', 'Situationsplan der Architekten Haefeli und Moser vom Schwimmbad Allenmoos, das 1938/39 in Zürich erbaut wurde; der Bau war Vorbild für Max Frischs Freibad Letzigraben.', 'Modell für eine Neue Stadt, die so genannte „Etagencity“, die Max Frisch 1955 theoretisch postulierte.'],
    "info": ['Baugeschichtliches Archiv der Stadt Zürich', 'Baugeschichtliches Archiv der Stadt Zürich', 'Max Frisch-Archiv, Zürich', 'Max Frisch-Archiv, Zürich'],
    "quote": 'Max Frisch, Tagebuch 1946-1949, Suhrkamp Verlag 1950<br />Max Frisch, Montauk, Suhrkamp Verlag 1975',
    "text": '<p><i>«Ob der Beruf eines Architekten, sofern ich dazu taugte, diese Beziehung zur Welt herzustellen vermochte, ließ sich nicht entscheiden, solange alles nur Papier blieb; was mich insbesondere zu diesem Beruf bewogen hatte, war ja das andere, das Unpapierne, Greifbare, Handwerkliche, die stoffliche Gestalt, und erst das wirkliche Bauen, vor allem die Verwirklichung eigner Entwürfe konnte zeigen, ob nicht auch dieser zweite Anlauf verfehlt war.»</i></p><p>Nach Studium und Gewinn eines Wettbewerbs gründet Max Frisch Ende 1943 sein eigenes Architekturbüro. Es befindet sich in der Selnaustrasse 16 in einem Altbau, der heute abgerissen und durch ein Hochhaus des Schweizerischen Ingenieur- und Architektenvereins ersetzt worden ist. Frisch und sein kleines Team arbeiten mehrere Jahre lang hauptsächlich an der Realisierung des Freibads Letzigraben. Darüber hinaus beteiligt sich Frisch mit Entwürfen an zahlreichen Wettbewerben und plant eigene Projekte wie etwa eine Künstlersiedlung am Stadtrand von Zürich. Realisiert werden aber neben dem Freibad lediglich drei private Wohnhäuser und diverse Umbauten. Nach dem Entschluss, sich von seiner Familie zu trennen und sich ganz der Schriftstellerei zu widmen, übernimmt im Jahr 1955 Frischs langjähriger Mitarbeiter Hannes Trösch das Büro.</p><p><i>«Eine Zeitlang geht beides nebeneinander, der Bau und die Proben auf der Bühne. Um acht Uhr ins Büro; um zehn Uhr fahre ich ins Schauspielhaus zu den Proben, sitze als Laie im Parkett und höre. Wenn die Schauspieler nach Hause gehen, um Texte zu lernen, fahre ich zur Baustelle und sehe, wie sie den Sprungturm ausschalen, anderswo Platten verlegen [...]. Es ist mir bewusst, dass das eine volle Zeit ist Tag für Tag; nicht ohne fachliche Sorgen [...].»</i></p>'
}, {
    "uid": "19",
    "title": "Coninx Museum",
    "lat": 47.36919,
    "lng": 8.56661,
    "route": 3,
    "images": ['Max Frischs Schulfreund Werner Coninx (1911-1980) wohnte in diesem Haus. ', 'Werner Coninx, Sohn des Gründers der Zürcher Tageszeitung „Tagesanzeiger“ und Jugendfreund von Max Frisch.', '1975 veröffentlicht Max Frisch seine Erzählung „Montauk“. Darin erinnert er sich an seinen Schulfreund Werner Coninx. Im Bild der gleichnamige Ort Montauk an der Ostspitze von Long Island.'],
    "info": ['Baugeschichtliches Archiv der Stadt Zürich', 'Max Frisch-Archiv, Zürich', 'Caspar Kemper/Max Frisch-Archiv, Zürich'],
    "quote": 'Max Frisch, Montauk, Suhrkamp Verlag 1975',
    "text": 'Max Frischs Schul- und Jugendfreund Werner Coninx entstammt der vermögenden Verlegerfamilie Otto Coninx-Girardet, die unter anderem die Züricher Tages-Anzeiger AG gegründet hat. Werner finanziert dem 25-jährigen Max Frisch das Architekturstudium.<br />Zwischen 1945 und 1980 baut der spätere Kunstsammler und Maler Werner Coninx eine der grössten privaten Kunstsammlungen in der Schweiz auf. Das Museum Coninx in der Heuelstrassse 32, in dem die Sammlung seit 1986 der Öffentlichkeit zugänglich ist, befindet sich in der elterlichen Villa. Hier besucht Frisch oft seinen Freund Werner, bevor sich die beiden in den 1950er Jahren entfremden.<br />In seiner Erzählung Montauk widmet Frisch der Freundschaft mit «W.» einen langen Text:</p><p><i>«Er weiss es und ich weiss es, was er für mich getan hat. […] Was soll W. mit meiner lebenslänglichen Dankesschuld? Und zudem weiss ich, dass ich alles in allem vor diesem Menschen nicht bestehen kann. In der Klasse war er immer der Erste, kein Streber; er war intelligenter als die andern, ohne es auf die leichte Schulter nehmen zu können, dass er intelligenter war, und so war er auch gewissenhaft; es war ihm eher peinlich, wenn die Lehrer ihn lobten. Um nicht einen Musterschüler abzugeben, konnte er ganz ruppig sein gegenüber den Lehrern. Nach der Schule begleitete ich ihn nach Hause, was für mich ein grosser Umweg war, aber ein Gewinn; durch ihn hörte ich zum ersten Mal von Nietzsche, von Oswald Spengler, von Schopenhauer.»</i></p>'
}, {
    "uid": "20",
    "title": "Geburtshaus Max Frisch",
    "lat": 47.36275,
    "lng": 8.56111,
    "route": 3,
    "images": ['Am 15. Mai 1911 wird Max Frisch in der Heliosstrasse 31 in Zürich geboren.', 'Max Frisch (2.v.l.) im Kreise von Spielkameraden, vermutlich 1922.', 'Max Frischs Mutter Karolina Frisch-Wildermuth (1875-1966) in der Wohnung an der Heliosstrasse.', 'Max Frischs Vater Franz Bruno Frisch (1871-1932), Baumeister und Architekt.'],
    "info": ['Volker Hage/Max Frisch-Archiv, Zürich', 'Max Frisch-Archiv, Zürich', 'Max Frisch-Archiv, Zürich', 'Max Frisch-Archiv, Zürich'],
    "quote": 'Max Frisch, Die Schweiz als Heimat?, 1974, In: Gesammelte Werke, Suhrkamp Verlag 1976 und Max Frisch, Tagebuch 1966-1971, Suhrkamp Verlag 1972',
    "text": '<p>Am 15. Mai 1911 wird Max Frisch in der Heliosstrasse 31 in Zürich geboren. Das Viertel liegt im Quartier Hottingen, einer einstigen Bauerngemeinde, die 1893 eingemeindet wird. Um 1900 ist es von Bürgern aus dem Mittelstand, Angestellten und Handwerkern, bevölkert. Das Bild des Viertels prägen  Villen in grünen Gärten, grosse und kleine Einfamilienhäuser zwischen kleinen gewachsenen oder geplanten Plätzen. Etwas später folgen erste Wohnblocks und Mehrfamilienhäuser. Die so entstandenen Bauten sind im Vergleich zu anderen Quartieren in ihrer Form recht einheitlich und prägen das Quartier.</p><p>Frischs Kindheit fällt in die Zeit des ersten Weltkriegs; er schreibt später von verschiedenen Armutserfahrungen, die er in dieser Zeit machen muss. Die Spielkameraden sind in der Regel älter als er, weshalb er öfter Mutproben bestehen muss und sich gezwungen sieht, sich anzupassen, um dazu zu gehören und akzeptiert zu sein:</p><p><i>«Ich bin in der Helios-Strasse geboren… Quartier als Heimat; dazu gehört das erste Schulhaus (es steht noch) sowie eine Metzgerei, wo ich Fliegen fangen darf für meinen Laubfrosch, ferner ein Tunnel der Kanalisation (zwischen Hegibach und Hornbach): hier stehe ich gebückt, ein Knirps, barfuss im stinkigen Abwasser, erschreckt durch den Hall der eigenen Stimme, […] in der Ferne das viel zu kleine Loch mit Tageslicht – Angst also auch, Überwindung der Angst um der Zugehörigkeit willen: lieber durch die Scheisswässer waten als im Quartier ein Aussenseiter sein.»</i><br />Als Sechzigjähriger meint Frisch im Rückblick, er habe wohl am liebsten mit Kriegskindern aus Wien gespielt; <i>«sie wussten andere Spiele, aber es ging nur heimlich, und als ich ertappt wurde, war es eine Schmach; ich war ein Abtrünniger.»</i></p>'
}, {
    "uid": "21",
    "title": "Zürichsee",
    "lat": 47.36536,
    "lng": 8.54518,
    "route": 3,
    "images": ['Max Frisch als etwa 10-Jähriger auf dem Zürichsee.', 'Max Frisch. Gespräche im Alter, 1985/1986 in Zürich und Berzona von Philippe Pilliod aufgenommen.', ],
    "info": ['Max Frisch-Archiv, Zürich', 'Max Frisch-Archiv, Zürich'],
    "quote": 'Max Frisch, Tagebuch 1946-1949, Suhrkamp Verlag 1950',
    "text": '<p>Naturerfahrungen sind für Max Frisch existenziell. In seinem Werk geben sie Seelenlandschaften wieder, untermalen Gemütszustände. Frisch liebt seine Heimatstadt Zürich nicht zuletzt wegen des Sees. Hier fährt er in den 1940er Jahren tagtäglich mit dem Fahrrad am Ufer entlang zur Arbeit ins Büro, hier badet er mit Bertolt Brecht, hier segelt Stiller, der Protagonist seines gleichnamigen Romans, mit seiner Geliebten Sibylle, hier sieht der blinde Gantenbein den See glitzern und blinken. Der Zürichsee, mal lieblich, mal heimatlich, mit seinem wechselweise silbergrauen, blauen oder grünen Wasserspiegel wird für Frisch zu einem Sehnsuchtsort.</p><p><i>«Am See. Oft am Morgen, wenn ich an die Arbeit fahre, steige ich vom Rad, erlaube mir eine Zigarette; das Rad schliesse ich nicht ab, damit ich nicht zu lange verweile, hier wo das Wasser an die Ufersteine spielt. […]<br />Schon lange hat es acht Uhr geschlagen; man denkt an die Hunderttausend, die jetzt an ihren Pültchen sitzen, und das schlechte Gewissen, ich weiss, es wird mich erfassen, sobald ich das Rad wieder besteige.<br />Am Wasser aber fühle ich mich frei, und alles, was auf dem Land sich tut, liegt hinter mir und nicht auf meinem Weg; ich weiss genau um meine Versäumnisse, die sich mehren mit jedem Glockenschlag; aber die Schwäne sind wirklicher, das plötzliche Geräusch der Wellen und das blinkende Gekringel auf dem Kieselgrund, das Kreischen der Möwen, die auf den Bojen sitzen. Oft, während ich hier sitze, immer öfter wundert es mich, warum wir nicht einfach aufbrechen – Wohin?»</i></p>'
}];;
var colours = [{
    featureType: "administrative",
    elementType: "all",
    stylers: [{
        hue: "#000000"
    }, {
        saturation: -100
    }],
    suppressInfoWindows: true
}, {
    featureType: "landscape",
    elementType: "all",
    stylers: [{
        hue: "#000000"
    }, {
        saturation: -100
    }]
}, {
    featureType: "poi",
    elementType: "all",
    stylers: [{
        hue: "#000000"
    }, {
        saturation: -100
    }, {
        visibility: 'off'
    }]
}, {
    featureType: "road",
    elementType: "all",
    stylers: [{
        hue: "#000000"
    }, {
        saturation: -100
    }]
}, {
    featureType: "transit",
    elementType: "all",
    stylers: [{
        hue: "#000000"
    }, {
        saturation: -100
    }]
}, {
    featureType: "water",
    elementType: "all",
    stylers: [{
        hue: "#0000ff"
    }, {
        lightness: -25
    }, {
        saturation: -75
    }]
}];
var styledMapOptions = {
    name: "Max Frisch Map",
    minZoom: 7
};
var myStyledMap = new google.maps.StyledMapType(colours, styledMapOptions);
var map, currentplace = 0,
    currenttooltip, mapInitialized = false,
    positionwatcher = false,
    userpos, mypos, poly, currentrouteid = 0,
    redrawroute = true,
    scrollToTooltip = true;
markerwidth = 36;
markerheight = 45;
markerbase = 9;
markerimg = ['img/markerimg0_h.png', 'img/markerimg1_h.png', 'img/markerimg2_h.png'];
shadowimg = 'img/markershadow_h.png';
var markernumbered = [];
for (var j = 0; j < 3; j++) {
    markernumbered[j] = [];
    for (var i = 0; i < 14; i++) {
        markernumbered[j][i] = new google.maps.MarkerImage(markerimg[j], new google.maps.Size(markerwidth, markerheight), new google.maps.Point(markerwidth * i, 0), new google.maps.Point(markerbase, markerheight), new google.maps.Size(504, markerheight));
    }
}
var markerstorage = new Array();
var markershadow = new google.maps.MarkerImage('img/markershadow_h.png', new google.maps.Size(markerwidth, markerheight), new google.maps.Point(0, 0), new google.maps.Point(markerbase, markerheight), new google.maps.Size(markerwidth, markerheight));
var markershape = {
    coord: [0, 0, markerbase * 2, 0, markerbase * 2, markerheight, 0, markerheight, 0, 0],
    type: 'poly'
};
var audio = new Audio();
$('div[data-role="dialog"]').live('pagebeforeshow', function(e, ui) {
    ui.prevPage.addClass("ui-dialog-background");
});
$('div[data-role="dialog"]').live('pagehide', function(e, ui) {
    $(".ui-dialog-background ").removeClass("ui-dialog-background");
});

function createMarker(data) {
    var markerLatlng = new google.maps.LatLng(data.lat, data.lng);
    var marker = new google.maps.Marker({
        position: markerLatlng,
        map: map,
        title: data.title,
        shadow: markershadow,
        icon: markernumbered[data.route - 1][0],
        shape: markershape,
        optimized: false,
    });
    markerstorage.push(marker);
    var boxText = $('<div class="tooltip" onClick="openSingle(' + data.uid + ')">' + data.title + '</div>')[0];
    var tooltipoffset = new google.maps.Size(-134, -22);
    var myOptions = {
        content: boxText,
        disableAutoPan: false,
        maxWidth: 0,
        pixelOffset: tooltipoffset,
        alignBottom: true,
        closeBoxURL: '',
        zIndex: null,
        boxClass: 'tooltip-container',
        infoBoxClearance: new google.maps.Size(5, 5),
        isHidden: false,
        pane: "floatPane",
        enableEventPropagation: true
    };
    var ib = new InfoBox(myOptions);
    marker.tooltip = ib;
    marker.uid = data.uid;
    google.maps.event.addListener(marker, 'click', function() {
        closeTooltip();
        currenttooltip = ib;
        ib.open(map, marker);
    });
}

function openSingle(id) {
    scrollToTooltip = false;
    $.mobile.changePage('#single?uid=' + id);
}

function closeTooltip() {
    if (currenttooltip) currenttooltip.close();
}

function findLocation() {
    if ($('#localize').hasClass('act') == true) {
        $('#localize').removeClass('act');
        navigator.geolocation.clearWatch(positionwatcher);
        mypos.setMap(null);
        mypos = false;
    } else {
        positionwatcher = navigator.geolocation.watchPosition(function(position) {
            $('#localize').addClass('act');
            userpos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            if (mypos) {
                mypos.setPosition(userpos);
            } else {
                mypos = new google.maps.Marker({
                    position: userpos,
                    map: map,
                    icon: new google.maps.MarkerImage('img/markermypos.png', new google.maps.Size(33, 33), new google.maps.Point(0, 0), new google.maps.Point(8, 8), new google.maps.Size(16, 16)),
                    optimized: false
                });
                map.panTo(userpos);
            }
        }, function(error) {
            if (error.code != 1) {
                alert('Ihre momentane Position kann leider nicht festgestellt werden');
            }
            navigator.geolocation.clearWatch(positionwatcher);
        });
    }
}

function initializeMap() {
    var newrouteid = location.href.split('walkid=')[1];
    if (newrouteid != currentrouteid) {
        redrawroute = true;
        currentrouteid = newrouteid;
    }
    if (!mapInitialized) {
        mapInitialized = true;
        initializeMapWithPos();
    } else {
        window.setTimeout(function() {
            google.maps.event.trigger(map, 'resize');
        }, 300, true);
        mapLoaded();
    }
}
$(window).resize(function() {
    $('#map_canvas').height($(window).height());
    $('#map_canvas').width($(window).width());
    if (map) {
        google.maps.event.trigger(map, 'resize');
    }
    $('div[data-role="page"]').height($(window).height());
});

function initializeMapWithPos() {
    var myOptions = {
        zoom: 14,
        center: getMapCenter(),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        navigationControl: false,
        streetViewControl: false,
        noClear: true,
        zoomControl: navigator.userAgent.match(/(Android|BlackBerry)/) !== null ? true : false,
        zoomControlOptions: {
            position: google.maps.ControlPosition.TOP_RIGHT,
            style: google.maps.ZoomControlStyle.SMALL
        }
    };
    $('#map_canvas').height($(window).height());
    $('#map_canvas').width($(window).width());
    map = new google.maps.Map($('#map_canvas')[0], myOptions);
    map.mapTypes.set('colouredMap', myStyledMap);
    map.setMapTypeId('colouredMap');
    for (var i in data) {
        createMarker(data[i]);
    }
    google.maps.event.addListener(map, 'click', function(event) {
        closeTooltip();
    });
    map.controls[google.maps.ControlPosition.TOP_LEFT].push($('#localize')[0]);
    google.maps.event.addDomListener($('#localize')[0], 'click', function() {
        findLocation();
    });
    poly = new google.maps.Polyline({
        map: map,
        path: [],
        strokeColor: "#333399",
        strokeOpacity: 1.0,
        strokeWeight: 2
    });
    mapLoaded();
}

function mapLoaded() {
    if (redrawroute) {
        redrawroute = false;
        calcRoute(currentrouteid);
    }
    if (currentplace > 0) {
        for (var i = 0; i < markerstorage.length; i++) {
            if (markerstorage[i].uid == currentplace) {
                if (scrollToTooltip) {
                    map.panTo(new google.maps.LatLng(data[i].lat, data[i].lng));
                } else {
                    scrollToTooltip = true;
                }
                closeTooltip();
                currenttooltip = markerstorage[i].tooltip;
                currenttooltip.open(map, markerstorage[i]);
                return true;
            }
        }
    }
}

function calcRoute() {
    var pointcounter = 0;
    for (var i = 0; i < data.length; i++) {
        if (data[i].route == currentrouteid) {
            pointcounter++;
            markerstorage[i].setIcon(markernumbered[data[i].route - 1][pointcounter]);
        } else {
            markerstorage[i].setIcon(markernumbered[data[i].route - 1][0]);
        }
    }
    poly.getPath().clear();
    var currentroute = routes[currentrouteid - 1];
    tm = [];
    for (var j = 0; j < currentroute.length; j = j + 2) {
        poly.getPath().push(new google.maps.LatLng(currentroute[j + 1], currentroute[j]));
    }
    setMapCenter();
}

function setMapCenter() {
    if (currentrouteid == 1) {
        map.setZoom(15);
    } else if (currentrouteid == 2) {
        map.setZoom(13);
    } else if (currentrouteid == 3) {
        map.setZoom(14);
    }
    map.panTo(getMapCenter());
}

function getMapCenter() {
    var newcenter;
    if (currentrouteid == 1) {
        newcenter = new google.maps.LatLng(47.37184, 8.54551);
    } else if (currentrouteid == 2) {
        newcenter = new google.maps.LatLng(47.37544, 8.51670);
    } else if (currentrouteid == 3) {
        newcenter = new google.maps.LatLng(47.36397, 8.55586);
    }
    return newcenter;
}
$('#walks').live('pagebeforeshow', function(event) {
    closeTooltip();
    currenttooltip = false;
    currentplace = 0;
});
$('#walk-info-1').live('pagebeforeshow', function(event) {
    loadRoutesList(1);
});
$('#walk-info-2').live('pagebeforeshow', function(event) {
    loadRoutesList(2);
});
$('#walk-info-3').live('pagebeforeshow', function(event) {
    loadRoutesList(3);
});

function loadRoutesList(routeid) {
    var listText = '<ul>';
    for (var i = 0; i < data.length; i++) {
        if (data[i].route == routeid) {
            listText += '<li><a data-uid="' + data[i].uid + '" >' + data[i].title + '</a></li>';
        }
    }
    listText += '</ul>';
    $('#walk-info-' + routeid + ' .routes-list').html(listText).find('ul').listview().click(function(e) {
        e.preventDefault();
        currentplace = $(e.target).data('uid');
        history.back();
        return false;
    });
}
$('#walk').live('pagebeforeshow', function(event) {
    $('#walk-header-title').html('');
});
$('#walk').live('pageshow', function(event) {
    var currentwalkid = location.href.split('walkid=')[1];
    $('#walk-header-title').html(['Altstadt', 'Zürich-West', 'Zürich-Ost'][currentwalkid - 1]);
    $('#button-info').attr('href', '#walk-info-' + currentwalkid);
    initializeMap();
});

function secondsToTime(s) {
    var mins = parseInt(s / 60);
    var secs = parseInt(s - (mins * 60));
    if (secs < 10) {
        secs = '0' + secs;
    }
    return mins + ':' + secs
}

function createGalleryCounter(l, act) {
    var gallerycounter = '';
    for (var i = 0; i < l; i++) {
        gallerycounter += (i == act) ? '<div class="act"></div>' : '<div></div>';
    }
    return gallerycounter;
}
$('#single').live('pagebeforeshow', function(event) {
    if (currentplace != location.href.split('uid=')[1]) {
        currentplace = location.href.split('uid=')[1];
        var mydata = data[currentplace - 1];
        if (currentrouteid == 0) {
            currentrouteid = mydata['route'] ? mydata['route'] : 1;
        }
        $('#single-back').attr('href', '#walk?walkid=' + currentrouteid);
        $('#single-header').html('<div id="single-header-inner">' + mydata['title']) + '</div>';
        $('#button-single-info').attr('href', '#single-info?' + currentplace);
        var gallery = $('#gallery');
        gallery.html('');
        gallery.css('-webkit-transform', '');
        var images = mydata['images'];
        var imageshtml = '';
        var nozoom = '';
        for (var i = 0; i < images.length; i++) {
            if (mydata['zoom']) {
                nozoom = mydata['zoom'][i] === 0 ? ' nozoom' : '';
            }
            imageshtml += '<div class="gallery-item">' + '<div class="gallery-image' + nozoom + '" style="background-image: url(data/img/' + currentplace + 'img' + i + '.jpg), url(css/images/ajax-loader.gif)"></div>' + '<div class="gallery-counter">' + createGalleryCounter(images.length, i) + '</div>' + '<div class="gallery-text"><p>' + images[i] + '</p></div>' + '</div>';
        }
        gallery.append(imageshtml);
        $('.gallery-counter').width(images.length * 15);
        if (currentplace == 21) {
            $('.gallery-image').last().html('<video id="videoplayer" poster="data/img/21img1.jpg" width="100%" onclick="if(/Android/.test(navigator.userAgent))this.play();"><source src="data/video/21.mp4" type="video/mp4" /><source src="index.files/21.webm" type="video/webm" /><source src="index.files/21.ogv" type="video/ogg" /></video>').css('background-image', 'none');
            $('#single-back').live('click', function(e) {
                if ($('#videoplayer').length > 0) $('video')[0].pause();
                e.preventDefault();
                return false;
            });
        }
        var wWidth = $(window).width();
        $('.gallery-item').width(wWidth);
        enableSwipe();
        startAudio(currentplace, $('#location-sound'));
    }
});

function startAudio(track, container) {
    audio.src = 'data/sound/' + track + '.mp3';
    audio.load();
    container.html('<a class="play"></a>\
   <div class="time-container">\
       <div class="timecode"></div>\
       <div class="duration"></div>\
       <div class="progress-container">\
        <div class="progress"></div>\
       </div>\
    </div>');
    audio.addEventListener('timeupdate', function() {
        var length = audio.duration;
        var currentsecs = audio.currentTime;
        var progress = (currentsecs / length) * 100;
        $(container).find('.progress').css({
            'width': Math.round(progress) + '%'
        });
        $(container).find('.duration').html(secondsToTime(length));
        $('.timecode').html(secondsToTime(currentsecs));
    }, false);
    var playing = false;
    $(container).on('click', '.play', function(e) {
        if (playing == false) {
            audio.play();
            $(container).find('.time-container').show();
            $(this).addClass('act');
            playing = true;
        } else {
            audio.pause();
            $(container).find('.time-container').hide();
            $(this).removeClass('act');
            playing = false;
        }
        e.preventDefault();
        return false;
    });
    $('#single-back').live('click', function() {
        audio.pause();
        $(container).find('.time-container').hide();
        $(container).find('.time-container').removeClass('act');
        playing = false;
    });
}
$('#info').live('pagebeforehide', function(event) {
    audio.pause();
});
$('#single').live('pageshow', function(event) {});
$('#single-info').live('pagebeforeshow', function(event) {
    var curdata = data[currentplace - 1];
    $('#single-info-title').html('<div id="single-info-title-inner">' + curdata.title + '</div>');
    var txt = curdata.text;
    txt += '<h3>Zitat aus</h3><p>' + curdata.quote + '</p>';
    var captions = curdata.info;
    txt += '<h3>Bildnachweise</h3>';
    for (var i = 1; i <= captions.length; i++) {
        txt += '<p>Bild ' + i + ': ' + captions[i - 1] + '</p>';
    }
    txt += $('#single-info-text').html(txt);
});
$('#single-info').live('pagebeforehide', function(event) {
    $('#single-info-text').html('');
});
$('#info').live('pagebeforeshow', function(event) {
    startAudio('begruessung', $('#introduction-sound'));
});
