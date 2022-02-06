function config() {
    var userAgent = navigator.userAgent;
    if (userAgent.indexOf("Safari") > -1) {
        // 禁止苹果手机或ipad在放大缩小
        window.onload = function() {
            document.addEventListener('touchstart', function(event) {
                if (event.touches.length > 1) {
                    event.preventDefault(); //阻止元素的默认行为
                }
            })
            var lastTouchEnd = 0;
            document.addEventListener('touchend', function(event) {
                var now = (new Date()).getTime();
                if (now - lastTouchEnd <= 300) {
                    event.preventDefault();
                }
                lastTouchEnd = now; //当前为最后一次触摸
            }, false)
        }
    }
}