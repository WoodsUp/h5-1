var $ = require('jquery');

// 调整速度
var speedControl = 0.5;
module.exports = {
    initAnimationItems: function() {
        $('.animated').each(function () {
            var aniDuration, aniDelay;
            
            $(this).attr('data-origin-class', $(this).attr('class'));
            
            aniDuration = (parseFloat($(this).data('ani-duration')) * speedControl) + 's';
            aniDelay = (parseFloat($(this).data('ani-delay')) * speedControl) + 's';
            
            $(this).css({
                'visibility': 'hidden',
                'animation-duration': aniDuration,
                '-webkit-animation-duration': aniDuration,
                'animation-delay': aniDelay,
                '-webkit-animation-delay': aniDelay
            });
        });
    },

    playAnimation: function (swiper) {
        this.clearAnimation();
        
        var aniItems = swiper.slides[swiper.activeIndex].querySelectorAll('.animated');
        
        $(aniItems).each(function () {
            var aniName;
            $(this).css({ 'visibility': 'visible' });
            aniName = $(this).data('ani-name');
            $(this).addClass(aniName);
        });
    },

    clearAnimation: function () {
        $('.animated').each(function () {
            $(this).css({ 'visibility': 'hidden' });
            $(this).attr('class', $(this).data('origin-class'));
        });
    }
};