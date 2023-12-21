document.addEventListener('DOMContentLoaded', function() {
    // Handle the click event on the scroll button in the first screen
    const scrollButton = document.querySelector('#screen1 .scroll-button');
    if (scrollButton) {
        scrollButton.addEventListener('click', function(e) {
            e.preventDefault();
            // Scroll smoothly to the second screen
            document.querySelector('#screen2').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Add any additional JavaScript functionality here
    // This can include handling other events, animations, etc.
});
