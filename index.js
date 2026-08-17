/* ============================
   NAVBAR — scroll shadow + hamburger
   ============================ */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
});

hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
    });
});

/* ============================
   PRODUCT CATEGORY TABS
   ============================ */
const tabs = document.querySelectorAll('.tab');
const productCards = document.querySelectorAll('.product-card');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const cat = tab.dataset.cat;

        productCards.forEach(card => {
            const show = cat === 'all' || card.dataset.cat === cat;
            card.classList.toggle('hidden', !show);

            // Trigger re-animation
            if (show) {
                card.style.animation = 'none';
                card.offsetHeight;   // reflow
                card.style.animation = '';
            }
        });
    });
});

/* ============================
   WISHLIST TOGGLE
   ============================ */
document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        btn.classList.toggle('active');
        const icon = btn.querySelector('i');
        icon.style.transform = 'scale(1.4)';
        setTimeout(() => { icon.style.transform = 'scale(1)'; }, 200);
    });
});

/* ============================
   NEWSLETTER FORM
   ============================ */
const newsletterForm = document.getElementById('newsletterForm');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const input = newsletterForm.querySelector('input');
        const btn = newsletterForm.querySelector('button');

        // Make sure input and button exist
        if (!input || !btn) return;

        btn.textContent = '✓ Subscribed!';
        btn.style.background = '#16a34a';

        input.value = '';
        input.disabled = true;
        btn.disabled = true;

        setTimeout(() => {
            btn.textContent = 'Subscribe';
            btn.style.background = '';
            input.disabled = false;
            btn.disabled = false;
        }, 4000);
    });
}

/* ============================
   SCROLL FADE-IN ANIMATIONS
   ============================ */
const fadeEls = document.querySelectorAll(
    '.promo-card, .product-card, .trust-item, .vintage-text, .vintage-gallery, .newsletter-inner, .footer-brand, .footer-links'
);

fadeEls.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

fadeEls.forEach(el => observer.observe(el));

/* ============================
   CART BADGE — simple counter
   ============================ */
let cartCount = 2;
const cartBadge = document.querySelector('.cart-badge');

document.querySelectorAll('.quick-view').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        cartCount++;
        cartBadge.textContent = cartCount;
        cartBadge.style.transform = 'scale(1.6)';
        setTimeout(() => { cartBadge.style.transform = 'scale(1)'; }, 200);
    });
});

cartBadge.style.transition = 'transform 0.2s ease';

// check what we have
// ============================================================
// HOMEPAGE - Show only 4 products in "Check What We Have"
// ============================================================
async function loadHomeProducts() {
    const container = document.querySelector(' .Product-Container');
    if (!container) return;

    container.innerHTML = `
        <div class="loading-state">
            <div class="spinner"></div>
            <p>Loading Products...</p>
        </div>
    `;

    try {
        const response = await fetch('https://fakestoreapi.com/products?limit=4');
        const data = await response.json();

        container.innerHTML = data.map(product => `
            <div class="Card" onclick="window.location.href='product_detail.html?id=${product.id}'" style="cursor:pointer;">
                <div class="img-box">
                    <img src="${product.image}" alt="${product.title}">
                </div>
                <h3 class="title">${product.title}</h3>
                <p class="category">${product.category}</p>
                <div class="card-bottom">
                    <p class="price">$${Number(product.price).toFixed(2)}</p>
                    <button class="card-cart-btn" onclick="event.stopPropagation(); addToCartFromHome(${product.id}, ${JSON.stringify(product).replace(/"/g, '&quot;')})">
                        <i class="fa-solid fa-cart-plus"></i>
                    </button>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error loading home products:', error);
        container.innerHTML = `
            <div class="error-state">
                <p>Failed to load products. Please try again later.</p>
            </div>
        `;
    }
}

// Cart from homepage (app.js may not be loaded on index)
function addToCartFromHome(id, product) {
    let cart = JSON.parse(localStorage.getItem('dinemarket_cart')) || [];
    let existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('dinemarket_cart', JSON.stringify(cart));

    // Update badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-badge').forEach(b => {
        b.textContent = totalItems;
        b.style.display = 'flex';
    });

    // Small feedback
    const btn = event.target.closest('.card-cart-btn');
    if (btn) {
        btn.innerHTML = '<i class="fa-solid fa-check"></i>';
        setTimeout(() => { btn.innerHTML = '<i class="fa-solid fa-cart-plus"></i>'; }, 1000);
    }
}

// ============================================================
// NAVBAR SCROLL + HAMBURGER  (keep existing index.js behaviour)
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    loadHomeProducts();
});

