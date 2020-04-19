(function () {
    var hamburger;
    var navbar;
    document.addEventListener('DOMContentLoaded', function () {
        hamburger = document.getElementById('hamburger');
        navbar = document.getElementById('aside');
        hamburger.addEventListener('click', toggle);
    });

    function toggle() {
        if (hamburger.classList.contains('is-active')) {
            hamburger.classList.remove('is-active');
            navbar.classList.remove('is-active');
        } else {
            hamburger.classList.add('is-active');
            navbar.classList.add('is-active');
        }
    }
})();