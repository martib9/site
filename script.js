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

function startCountup(elementId, finalNumber) {
    let currentNumber = 0;
    const element = document.getElementById(elementId);
    const interval = setInterval(() => {
        if (currentNumber > finalNumber) {
            clearInterval(interval);
        } else {
            element.textContent = currentNumber + ' € +';
            currentNumber++;
        }
    }, 6); // Adjust the speed as needed
}

function isElementSignificantlyInViewPort(el) {
    const rect = el.getBoundingClientRect();
    const elemTop = rect.top;
    const elemBottom = rect.bottom;

    // Check if more than 50% of the element is visible
    const isVisible = elemTop < window.innerHeight && elemBottom >= window.innerHeight / 2;
    return isVisible;
}

let countupStarted = false;
function onScroll() {
    const screen16 = document.getElementById('screen16');
    if (isElementSignificantlyInViewPort(screen16) && !countupStarted) {
        countupStarted = true;
        startCountup('countdown', 500); // Ends countup at 500
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('scroll', onScroll);
});
function createFireworkParticle() {
    const particle = document.createElement('div');
    particle.classList.add('firework-particle');
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
    particle.style.width = particle.style.height = `${Math.random() * 30 + 10}px`; // Bigger size
    document.getElementById('fireworks').appendChild(particle);

    setTimeout(() => particle.remove(), 1000);
}

function startFireworks() {
    const interval = setInterval(createFireworkParticle, 100); // More frequent particles
    setTimeout(() => clearInterval(interval), 10000); // Run fireworks for 10 seconds
}

document.addEventListener('DOMContentLoaded', () => {
    startFireworks();
});
