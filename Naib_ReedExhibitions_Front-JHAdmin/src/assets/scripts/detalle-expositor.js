(function() {
    var slider = document.querySelectorAll('.slider');
    slider.forEach(function(el) {
        el.addEventListener('mousedown', function(ev) {
            const {
                left,
                width
            } = el.getBoundingClientRect();
            const percent = (ev.clientX - left) / width * 100;
            render(el, percent);
            document.onmousemove = function(ev) {
                const percent = (ev.clientX - left) / width * 100;
                render(el, percent);
            };
            document.onmouseup = function(ev) {
                document.onmousemove = null;
            };
        });
        el.addEventListener('touchstart', function(ev) {
            const {
                left,
                width
            } = el.getBoundingClientRect();
            const percent = (ev.touches[0].clientX - left) / width * 100;
            render(el, percent);
            document.ontouchmove = function(ev) {
                const percent = (ev.touches[0].clientX - left) / width * 100;
                render(el, percent);
            };
            document.ontouchend = function(ev) {
                document.ontouchmove = null;
            };
        });
        el.addEventListener('keydown', function(ev) {
            el.focus();
            let percent = Number(getComputedStyle(el).getPropertyValue('--percent'));
            switch (ev.keyCode) {
                case 37:
                    percent -= 1;
                    break;
                case 39:
                    percent += 1;
                    break;
                default:
                    break;
            }

            render(el, percent);
        });
    });



    function render(el, percent) {
        percent = Math.min(Math.max(0, percent), 100);
        el.style.setProperty('--percent', parseInt(percent, 0));
    }

})();