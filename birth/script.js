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
    const screen15 = document.querySelector('#screen15');

    function checkButtonVisibility() {
        const screen3Top = screen3.offsetTop;
        const screen15Bottom = screen15.offsetTop + screen15.offsetHeight;
        const scrollPosition = window.pageYOffset;

        if (scrollPosition >= screen3Top && scrollPosition < screen15Bottom) {
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

function mobileParallax() {
    const parallaxBackground = document.querySelector('.parallax-background');
    if (!parallaxBackground) return;

    window.addEventListener('scroll', () => {
        const offset = window.pageYOffset;
        parallaxBackground.style.backgroundPositionY = offset * 0.5 + 'px';
    });
}

// Initialize the parallax effect
document.addEventListener('DOMContentLoaded', mobileParallax);

function startCountdown(elementId, finalNumber) {
    let currentNumber = 0;
    const interval = setInterval(() => {
        if (currentNumber >= finalNumber) {
            clearInterval(interval);
        } else {
            currentNumber++;
            document.getElementById(elementId).textContent = currentNumber + '€';
        }
    }, 100); // Adjust the speed as needed
}

document.addEventListener('DOMContentLoaded', () => {
    startCountdown('countdown', 400); // Replace 15 with your chosen number
});
