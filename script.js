// AOS Initialization
AOS.init({
    duration: 1000,
    once: true,
    mirror: false,
});

// Sticky Navigation and Scroll-to-top
window.onscroll = function() {
    stickyNav();
    scrollFunction();
};

const header = document.querySelector(".header");
// Ensure header exists before trying to get its offsetTop
const sticky = header ? header.offsetTop : 0; // Fallback to 0 if header not found

function stickyNav() {
    if (window.scrollY > sticky) {
        header.classList.add("sticky-nav");
    } else {
        header.classList.remove("sticky-nav");
    }
}

const scrollToTopBtn = document.getElementById("scrollToTopBtn");

function scrollFunction() {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        scrollToTopBtn.style.display = "block";
    } else {
        scrollToTopBtn.style.display = "none";
    }
}

if (scrollToTopBtn) { // Check if button exists before adding event listener
    scrollToTopBtn.addEventListener("click", () => {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    });
}


// Hamburger Menu & Sidebar
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const sidebarLinks = document.querySelectorAll('.sidebar-link');

if (hamburger && sidebar) { // Check if elements exist
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        sidebar.classList.toggle('open');
        document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : 'auto';
    });

    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            sidebar.classList.remove('open');
            document.body.style.overflow = 'auto';
        });
    });
}

// Smooth Scrolling for Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Adjust for sticky header height
            const offsetTop = targetElement.offsetTop - (header ? header.offsetHeight : 0);
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const sidebarDarkModeToggle = document.getElementById('sidebarDarkModeToggle');

function setDarkMode(isDark) {
    if (isDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        if (darkModeToggle) darkModeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
        if (sidebarDarkModeToggle) sidebarDarkModeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        if (darkModeToggle) darkModeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
        if (sidebarDarkModeToggle) sidebarDarkModeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
    }
}

// Check for saved theme preference on load
const preferredTheme = localStorage.getItem('theme');
if (preferredTheme === 'dark') {
    setDarkMode(true);
} else {
    setDarkMode(false);
}

if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
        setDarkMode(!document.documentElement.hasAttribute('data-theme'));
    });
}
if (sidebarDarkModeToggle) {
    sidebarDarkModeToggle.addEventListener('click', () => {
        setDarkMode(!document.documentElement.hasAttribute('data-theme'));
    });
}


// Testimonial Carousel
const testimonialWrapper = document.getElementById('testimonialWrapper');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const carouselDots = document.getElementById('carouselDots');
const testimonialCards = document.querySelectorAll('.testimonial-card');

let currentIndex = 0;
let autoSlideInterval; // Variable to hold the interval ID

function updateCarousel() {
    if (!testimonialCards || testimonialCards.length === 0) return;

    const cardComputedStyle = getComputedStyle(testimonialCards[0]);
    // Calculate card width including its right margin for accurate scrolling
    const cardWidth = testimonialCards[0].offsetWidth +
                      parseFloat(cardComputedStyle.marginLeft) +
                      parseFloat(cardComputedStyle.marginRight);

    testimonialWrapper.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    updateDots();
}

function createDots() {
    if (!carouselDots || !testimonialCards || testimonialCards.length === 0) return;
    carouselDots.innerHTML = '';
    testimonialCards.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (index === currentIndex) {
            dot.classList.add('active');
        }
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
            resetAutoSlide(); // Reset timer on manual navigation
        });
        carouselDots.appendChild(dot);
    });
}

function updateDots() {
    document.querySelectorAll('.dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        nextBtn.click();
    }, 5000); // Change slide every 5 seconds
}

function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
}

if (prevBtn && nextBtn && testimonialWrapper && carouselDots) { // Check if carousel elements exist
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : testimonialCards.length - 1;
        updateCarousel();
        resetAutoSlide();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex < testimonialCards.length - 1) ? currentIndex + 1 : 0;
        updateCarousel();
        resetAutoSlide();
    });

    // Initialize carousel
    window.addEventListener('load', () => {
        updateCarousel();
        createDots();
        startAutoSlide(); // Start auto-slide on load
    });
    window.addEventListener('resize', updateCarousel); // Recalculate on resize
}


// Contact Form Submission
const contactForm = document.getElementById('contactForm');
if (contactForm) { // Check if form exists
    contactForm.addEventListener('submit', function(event) {
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        if (!fullName.trim() || !email.trim() || !message.trim()) {
            alert('Please fill in all required fields: Full Name, Email, and Message.');
            event.preventDefault();
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert('Please enter a valid email address.');
            event.preventDefault();
        } else {
            console.log('Form submitted to Formspree. Check your Formspree dashboard for submissions.');
        }
    });
}


// Newsletter Form Submission
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) { // Check if form exists
    newsletterForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const newsletterEmail = document.getElementById('newsletterEmail').value;

        if (!newsletterEmail) {
            alert('Please enter your email address to subscribe.');
            return;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail)) {
            alert('Please enter a valid email address.');
            return;
        }

        alert(`Subscribed!\n\nEmail: ${newsletterEmail}\n\n(This is a demo alert. In a real application, this email would be added to a mailing list or sent to a service.)`);

        newsletterForm.reset();
    });
}

// Set current year in footer
const currentYearSpan = document.getElementById('currentYear');
if (currentYearSpan) { // Check if element exists
    currentYearSpan.textContent = new Date().getFullYear();
}