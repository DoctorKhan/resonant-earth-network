// Resonant Earth Network - Navigation JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (mobileMenuButton && mobileNav) {
        mobileMenuButton.addEventListener('click', function() {
            mobileNav.classList.toggle('active');
            
            // Animate hamburger menu
            const spans = mobileMenuButton.querySelectorAll('span');
            if (mobileNav.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (mobileNav && !event.target.closest('.navbar')) {
            mobileNav.classList.remove('active');
            const spans = mobileMenuButton.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
    
    // Active page highlighting
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || 
            (currentPage === '' && href === 'index.html') ||
            (currentPage === 'index.html' && href.startsWith('#'))) {
            link.classList.add('active');
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 100; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (mobileNav) {
                    mobileNav.classList.remove('active');
                }
            }
        });
    });
    
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe all cards and sections
    document.querySelectorAll('.card, .section').forEach(el => {
        observer.observe(el);
    });
});

// Navigation HTML template
function createNavigation(currentPage = '') {
    return `
        <nav class="navbar">
            <div class="nav-container">
                <a href="index.html" class="logo">
                    <img src="assets/rn-logo.png" alt="Resonant Earth Network Logo">
                    Resonant Earth Network
                </a>
                
                <div class="nav-links">
                    <a href="index.html#vision" class="nav-link">Vision</a>
                    <a href="index.html#features" class="nav-link">Features</a>
                    <a href="index.html#palawan" class="nav-link">Palawan</a>
                    <a href="business-model.html" class="nav-link">Business</a>
                    <a href="water-quality.html" class="nav-link">Water Quality</a>
                    <a href="tokenomics.html" class="nav-link">Tokenomics</a>
                    <a href="index.html#community" class="nav-link">Community</a>
                    <a href="index.html#join" class="nav-link cta-button">Join Waitlist</a>
                </div>
                
                <div class="mobile-menu-button">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
            
            <div class="mobile-nav">
                <a href="index.html#vision" class="mobile-nav-link">Vision</a>
                <a href="index.html#features" class="mobile-nav-link">Features</a>
                <a href="index.html#palawan" class="mobile-nav-link">Palawan</a>
                <a href="business-model.html" class="mobile-nav-link">Business Model</a>
                <a href="water-quality.html" class="mobile-nav-link">Water Quality</a>
                <a href="tokenomics.html" class="mobile-nav-link">Tokenomics</a>
                <a href="index.html#community" class="mobile-nav-link">Community</a>
                <a href="index.html#join" class="mobile-nav-link cta-button" style="margin: 1rem 2rem; text-align: center; border-radius: 2rem;">Join Waitlist</a>
            </div>
        </nav>
    `;
}

// Footer HTML template
function createFooter() {
    return `
        <footer style="background: linear-gradient(135deg, #1f2937, #111827); color: white; padding: 4rem 0 2rem; margin-top: 6rem;">
            <div class="container">
                <div class="grid grid-4" style="margin-bottom: 3rem;">
                    <div>
                        <h4 style="color: white; margin-bottom: 1rem;">Resonant Earth</h4>
                        <p style="color: #9ca3af; font-size: 0.95rem;">Building regenerative ecovillages powered by Web3 governance and sustainable living practices.</p>
                    </div>
                    <div>
                        <h4 style="color: white; margin-bottom: 1rem;">Locations</h4>
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin-bottom: 0.5rem;"><a href="index.html#palawan" style="color: #9ca3af; text-decoration: none;">Palawan, Philippines</a></li>
                            <li style="margin-bottom: 0.5rem;"><a href="business-model.html" style="color: #9ca3af; text-decoration: none;">Cox's Bazar, Bangladesh</a></li>
                            <li style="margin-bottom: 0.5rem;"><a href="business-model.html" style="color: #9ca3af; text-decoration: none;">Costa Rica</a></li>
                            <li style="margin-bottom: 0.5rem;"><a href="business-model.html" style="color: #9ca3af; text-decoration: none;">Portugal</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 style="color: white; margin-bottom: 1rem;">Resources</h4>
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin-bottom: 0.5rem;"><a href="tokenomics.html" style="color: #9ca3af; text-decoration: none;">Tokenomics</a></li>
                            <li style="margin-bottom: 0.5rem;"><a href="water-quality.html" style="color: #9ca3af; text-decoration: none;">Water Quality</a></li>
                            <li style="margin-bottom: 0.5rem;"><a href="business-model.html" style="color: #9ca3af; text-decoration: none;">Business Model</a></li>
                            <li style="margin-bottom: 0.5rem;"><a href="#" style="color: #9ca3af; text-decoration: none;">Whitepaper</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 style="color: white; margin-bottom: 1rem;">Connect</h4>
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin-bottom: 0.5rem;"><a href="#" style="color: #9ca3af; text-decoration: none;">Discord Community</a></li>
                            <li style="margin-bottom: 0.5rem;"><a href="#" style="color: #9ca3af; text-decoration: none;">Twitter</a></li>
                            <li style="margin-bottom: 0.5rem;"><a href="#" style="color: #9ca3af; text-decoration: none;">Telegram</a></li>
                            <li style="margin-bottom: 0.5rem;"><a href="#" style="color: #9ca3af; text-decoration: none;">Newsletter</a></li>
                        </ul>
                    </div>
                </div>
                
                <div style="border-top: 1px solid #374151; padding-top: 2rem; text-align: center;">
                    <p style="color: #9ca3af; margin: 0;">&copy; 2024 Resonant Earth Network. Building a regenerative future together.</p>
                </div>
            </div>
        </footer>
    `;
}
