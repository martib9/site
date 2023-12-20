document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    var stickyButton = document.querySelector('.sticky-button');
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                stickyButton.style.opacity = '1';
            } else {
                stickyButton.style.opacity = '0';
            }
        });
    }, {threshold: 0.5});
    
    var targetScreen = document.getElementById('screen3');
    observer.observe(targetScreen);
});