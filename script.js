// Language Toggle
const langBtns = document.querySelectorAll('.lang-btn');
const body = document.body;

langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;

        // Update active state on ALL lang buttons (desktop + mobile)
        langBtns.forEach(b => {
            b.classList.toggle('active', b.dataset.lang === lang);
        });

        // Update body classes
        body.classList.remove('ltr', 'rtl');
        body.classList.add(lang === 'ar' ? 'rtl' : 'ltr');

        // Update all text content
        document.querySelectorAll('[data-en][data-ar]').forEach(el => {
            // Skip elements that have children with data attributes (like the logo)
            if (el.querySelector('[data-en]')) return;
            el.textContent = el.dataset[lang];
        });

        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Close mobile menu on language switch
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(13, 27, 42, 1)';
    } else {
        navbar.style.background = 'rgba(13, 27, 42, 0.97)';
    }
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe service cards and features
document.querySelectorAll('.service-card, .feature').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Set initial language (English)
document.querySelector('[data-lang="en"]').click();

// ── Reviews ──────────────────────────────────────────────
const reviewForm   = document.getElementById('reviewForm');
const reviewsList  = document.getElementById('reviewsList');
const stars        = document.querySelectorAll('.star');
const ratingInput  = document.getElementById('ratingValue');

// Load saved reviews from localStorage
let reviews = JSON.parse(localStorage.getItem('sandekReviews') || '[]');
renderReviews();

// Star hover & click
stars.forEach(star => {
    star.addEventListener('mouseover', () => {
        const val = +star.dataset.value;
        stars.forEach(s => s.classList.toggle('hovered', +s.dataset.value <= val));
    });
    star.addEventListener('mouseout', () => {
        stars.forEach(s => s.classList.remove('hovered'));
    });
    star.addEventListener('click', () => {
        const val = +star.dataset.value;
        ratingInput.value = val;
        stars.forEach(s => s.classList.toggle('selected', +s.dataset.value <= val));
    });
});

// Form submit
reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name    = document.getElementById('reviewName').value.trim();
    const rating  = +ratingInput.value;
    const comment = document.getElementById('reviewComment').value.trim();

    if (!rating) {
        alert('Please select a star rating.');
        return;
    }

    const review = {
        name,
        rating,
        comment,
        date: new Date().toLocaleDateString('en-GB')
    };

    reviews.unshift(review);
    localStorage.setItem('sandekReviews', JSON.stringify(reviews));
    renderReviews();

    // Reset form
    reviewForm.reset();
    ratingInput.value = 0;
    stars.forEach(s => s.classList.remove('selected'));
});

function renderReviews() {
    if (reviews.length === 0) {
        reviewsList.innerHTML = '<p class="no-reviews">لا توجد تقييمات بعد. كن أول من يشارك رأيه!</p>';
        return;
    }
    reviewsList.innerHTML = reviews.map(r => `
        <div class="review-card">
            <div class="review-card-header">
                <span class="review-card-name">${escapeHtml(r.name)}</span>
                <span class="review-card-date">${r.date}</span>
            </div>
            <span class="review-card-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
            <p class="review-card-comment">${escapeHtml(r.comment)}</p>
        </div>
    `).join('');
}

function escapeHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

