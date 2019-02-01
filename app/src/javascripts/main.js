(function () {
    'use strict';

    // weixin sdk
    var setWx = require('./wx.js');
    setWx();

    // load dependencies
    var animationControl = require('./animation-control.js');

    // typing content
    var textArray = [
        '建材人，2018年，你还好吗？',
        '这一年，迎来了市场的寒冬，各品牌和门店之间竞争激烈',
        '新生群体消费需求差异化明显',
        '门店客流量减少，生意更加难做',
        '你隔壁商铺的老板换了又换，自己也是咬牙支撑担心坚持不下去',
        '但是，你和你的品牌绝不轻易放弃',
        '你努力开拓更多销售渠道，甚至赔本赚吆喝',
        '你跑工地、跑市场、跑渠道、披星戴月、风餐露宿',
        '忍受客户百般挑剔',
        '可回到家看到父母妻儿的欢声笑语，你觉得这一切都很值',
        '2019年，新年的钟声敲响了……',
    ];

    // typing animation
    $.fn.extend({
        typing: function(text, delay, speed) {
            var $this = this;
            if ($this.data('animating') === 'true') return;

            var _speed = speed || 100;
            var _delay = delay || 0;

            $this.data('animating', 'true');
            $this.text('');

            var i = 0;
            var len = text.length;
            var timeout = _delay - _speed < 0 ? 0 : _delay - _speed;
            window._typingAnimate = setTimeout(function() {
                window._intervalTimer = setInterval(function() {
                    if (i >= len) {
                        // swiper.unlockSwipes();
                        clearInterval(window._intervalTimer);
                        i = 0;
                        $this.data('animating', '');
                    } else {
                        // swiper.lockSwipes();
                        $this.text($this.text() + text[i]);
                        i += 1;
                    }
                }, _speed);
            }, timeout);
        },
        clearTyping: function () {
            $('#subtitle').text('');
            this.data('animating', '');
            clearTimeout(window._typingAnimate);
            clearInterval(window._intervalTimer);
        }
    });

    $(document).ready(function () {
        var bgMusic = $('audio').get(0);
        var $btnMusic = $('.btn-music');
        var $upArrow = $('.up-arrow');
        var $subtitle = $('#subtitle');

        // background music control
        $btnMusic.click(function () {
            if (bgMusic.paused) {
                bgMusic.play();
                $(this).removeClass('paused');
            } else {
                bgMusic.pause();
                $(this).addClass('paused');
            }
        });

        // init Swiper
        var mySwiper = new Swiper('.swiper-container', {
            mousewheelControl: true,
            hashnav: true,
            hashnavWatchState: true,
            effect: 'slide',    // slide, fade, coverflow or flip
            speed: 400,
            direction: 'horizontal',
            fade: {
                crossFade: false
            },
            coverflow: {
                rotate: 100,
                stretch: 0,
                depth: 300,
                modifier: 1,
                slideShadows: false     // do disable shadows for better performance
            },
            flip: {
                limitRotation: true,
                slideShadows: false     // do disable shadows for better performance
            },
            onInit: function (swiper) {
                animationControl.initAnimationItems();  // get items ready for animations
                animationControl.playAnimation(swiper); // play animations of the first slide
                if (swiper.activeIndex < 11) {
                    $subtitle.typing(textArray[swiper.activeIndex], 1500);
                }
            },
            onTransitionStart: function (swiper) {     // on the last slide, hide .btn-swipe
                if (swiper.activeIndex >= 10) {
                    $upArrow.hide();
                    if (swiper.activeIndex >= 11) {
                        $subtitle.hide();
                    } else {
                        $subtitle.show();
                        $subtitle.clearTyping();
                    }
                } else {
                    $upArrow.show();
                }
            },
            onTransitionEnd: function (swiper) {       // play animations of the current slide
                var $thisSlide = $('.swiper-slide-active');
                if ($thisSlide.hasClass('disable-slide-next')) {
                    swiper.lockSwipeToNext();
                } else {
                    swiper.unlockSwipeToNext();
                }
                animationControl.playAnimation(swiper);
                if (swiper.activeIndex < 11) {
                    $subtitle.typing(textArray[swiper.activeIndex], 1500);
                }
            },
            onTouchStart: function (swiper, event) {    // mobile devices don't allow audios to play automatically, it has to be triggered by a user event(click / touch).
                if (!$btnMusic.hasClass('paused') && bgMusic.paused) {
                    bgMusic.play();
                }
                swiper.slideNext();
            },
        });

        // hide loading animation since everything is ready
        $('.loading-overlay').slideUp();

        // jump to invitation
        $('#jump-to-invitation').on('touchend', function() {
            mySwiper.unlockSwipes();
            mySwiper.slideNext();
        });

        $('#J_form').on('submit', function(e) {
            e.preventDefault();
            var name = $('#J_username').val();
            var phone = $('#J_phone').val();
            console.log(name, phone);
            if (!name || !phone) {
                return alert('姓名和手机为必填项！');
            }
            if (!/[\S]+/.test(name)) {
                return alert('姓名输入不合法');
            }
            if (!/^1[356789][\d]{9}$/.test(phone)) {
                return alert('手机号输入错误');
            }
            var data = name + ',' + phone;
            var path = location.href;
            $.ajax({
                url: 'http://h5.wecareroom.com/api/admin/recommedTrack/saveRecommendTrack',
                type: 'POST',
                data: {
                    target: data,
                    urlPath: path
                },
                success: function(res) {
                    console.log(res);
                    if (res.status && res.status.error === 0) {
                        alert('参与成功！');
                    } else {
                        alert('参与失败！');
                    }
                }
            })
        });

        // 自动播放音乐
        if (window.WeixinJSBridge) {
            WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
                bgMusic.play();
            }, false);
        } else {
            document.addEventListener("WeixinJSBridgeReady", function () {
                WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
                    bgMusic.play();
                });
            }, false);
        }
    });
})();
