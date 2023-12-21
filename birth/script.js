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
    const screen2 = document.querySelector('#screen2');

    function toggleStickyButton() {
        const screen3Top = screen3.offsetTop;
        const scrollPosition = window.pageYOffset;

        if (scrollPosition >= screen3Top) {
            stickyButton.style.display = 'block'; // Show the button
            stickyButton.style.opacity = 1; // Fade in
        } else {
            stickyButton.style.opacity = 0; // Fade out
            setTimeout(() => { stickyButton.style.display = 'none'; }, 500); // Hide after fade out
        }
    }

    // Check button visibility on scroll and on load
    window.addEventListener('scroll', toggleStickyButton);
    toggleStickyButton();

    // Smooth scroll to Screen 2
    stickyButton.addEventListener('click', function(e) {
        e.preventDefault();
        screen2.scrollIntoView({ behavior: 'smooth' });
    });
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

