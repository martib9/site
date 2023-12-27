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
        const screen12Bottom = screen14.offsetTop + screen14.offsetHeight;
        const scrollPosition = window.pageYOffset;

        if (scrollPosition >= screen3Top && scrollPosition <= screen12Bottom) {
            stickyButton.style.display = 'block';
            stickyButton.style.opacity = 1;
        } else {
            stickyButton.style.opacity = 0;
            setTimeout(() => { stickyButton.style.display = 'none'; }, 500);
        }
    }

    // Check visibility on scroll
    window.addEventListener('scroll', checkButtonVisibility);

    // Check visibility after navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
            setTimeout(checkButtonVisibility, 500); // Adjust timing if needed
        });
    });

    // Initial check
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

