document.addEventListener('DOMContentLoaded', function() {
    const scrollButton = document.querySelector('.scroll-button');
    
    scrollButton.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector('#screen2').scrollIntoView({ behavior: 'smooth' });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const ctaButton = document.querySelector('.cta-button');

    ctaButton.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent the default anchor behavior
        const target = this.getAttribute('href');
        document.querySelector(target).scrollIntoView({ behavior: 'smooth' });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.next-button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            document.querySelector(target).scrollIntoView({ behavior: 'smooth' });
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const stickyButton = document.querySelector('.sticky-button');
    const screen3 = document.querySelector('#screen3');
    const screen14 = document.querySelector('#screen14');

    function checkButtonVisibility() {
        const screen3Top = screen3.offsetTop;
        const screen14Bottom = screen14.offsetTop + screen14.offsetHeight;
        const scrollPosition = window.pageYOffset;

        if (scrollPosition >= screen3Top && scrollPosition < screen14Bottom) {
            stickyButton.style.display = 'block';
            stickyButton.style.opacity = 1;
        } else {
            stickyButton.style.opacity = 0;
            setTimeout(() => { stickyButton.style.display = 'none'; }, 500);
        }
    }

    function smoothScroll(target, callback) {
        document.querySelector(target).scrollIntoView({ behavior: 'smooth' });
        setTimeout(callback, 600); // Timeout should be slightly longer than the smooth scroll duration
    }

    // Modify anchor link click event
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            smoothScroll(target, checkButtonVisibility);
        });
    });

    window.addEventListener('scroll', checkButtonVisibility);
    checkButtonVisibility();
});

document.addEventListener('DOMContentLoaded', function() {
    const pictureLinks = document.querySelectorAll('.picture-gallery .picture');

    pictureLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

function throttle(fn, wait) {
    let lastTime = 0;
    return function (...args) {
        const now = new Date().getTime();
        if (now - lastTime < wait) return;
        lastTime = now;
        return fn(...args);
    };
}

function mobileParallax() {
    const parallaxBackground = document.querySelector('.parallax-background');
    if (!parallaxBackground) return;

    const updateBackgroundPosition = () => {
        const offset = window.pageYOffset;
        parallaxBackground.style.backgroundPositionY = offset * 0.5 + 'px';
    };

    window.addEventListener('scroll', throttle(updateBackgroundPosition, 10));
}

document.addEventListener('DOMContentLoaded', mobileParallax);
