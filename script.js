// ====================================
// הגדרות עגלת קניות גלובליות
// ====================================
let cart = [];
let selectedPizza = null;

const TOPPING_PRICES = {
  "זיתים שחורים": 5,
  "זיתים ירוקים": 5,
  "עגבניה": 5,
  "פטריות": 5,
  "תירס": 5,
  "טונה": 7,
  "גבינה בולגרית": 7,
  "זיתי קלמטה": 7
};

function updateCart() {
  const cartItemsContainer = document.getElementById("cart-items");
  const totalContainer = document.getElementById("cart-total");
  if (!cartItemsContainer || !totalContainer) return;

  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `<span>${item.name}</span><span>₪${item.price}</span><button onclick="removeItem(${index})">❌</button>`;
    cartItemsContainer.appendChild(div);
  });

  totalContainer.innerText = `סה"כ: ₪${total}`;
}

function removeItem(index) {
  cart.splice(index, 1);
  updateCart();
}

function sendOrderToWhatsApp() {
  if (cart.length === 0) {
      alert("העגלה ריקה!");
      return;
  }

  let message = "*הזמנה חדשה מפיצה ברסלב:*\n\n";
  let total = 0;

  cart.forEach((item) => {
    message += `🍕 ${item.name} - ₪${item.price}\n`;
    total += item.price;
  });
  message += `\nסה"כ לתשלום: ₪${total}`;

  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/0543201912?text=${encoded}`, "_blank");
}


// ====================================
// כל הלוגיקה המרכזית לאחר טעינת ה-DOM
// ====================================
document.addEventListener('DOMContentLoaded', () => {

  // ------------------------------------
  // הגדרת משתנים כלליים
  // ------------------------------------
  const stickyNav = document.getElementById('sticky-nav');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const sections = document.querySelectorAll('section');
  const navLinksAll = document.querySelectorAll('.nav-link');
  const cartSidebar = document.getElementById("cart-sidebar");
  const toggleBtn = document.getElementById("cart-toggle");
  const modal = document.getElementById("toppings-modal");
  const cancelBtn = document.getElementById("cancel-toppings");
  const toppingsForm = document.getElementById("toppings-form");
  const addToppingsBtn = document.getElementById("add-toppings-btn");


  // ------------------------------------
  // סרגל ניווט דביק
  // ------------------------------------
  if (stickyNav) {
    window.addEventListener('scroll', () => {
      stickyNav.classList.toggle('visible', window.scrollY > 200);
    });
  }

  // ------------------------------------
  // תפריט המבורגר (מובייל)
  // ------------------------------------
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
      const isExpanded = hamburger.classList.contains('active');
      hamburger.setAttribute('aria-expanded', isExpanded);
    });

    // סגירת התפריט בלחיצה על קישור
    navLinksAll.forEach(link => {
      link.addEventListener('click', () => {
        if (hamburger.classList.contains('active')) {
          hamburger.classList.remove('active');
          navLinks.classList.remove('active');
          hamburger.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // ------------------------------------
  // הדגשת קישור פעיל בניווט לפי גלילה
  // ------------------------------------
  if (sections.length && navLinksAll.length) {
    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinksAll.forEach(link => link.classList.remove('active'));
          const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
          if (activeLink) {
            activeLink.classList.add('active');
          }
        }
      });
    };
    const observerOptions = { rootMargin: '-50% 0px -50% 0px', threshold: 0 };
    const sectionObserver = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => sectionObserver.observe(section));
  }

  // ------------------------------------
  // טעינת Particles.js
  // ------------------------------------
  if (document.getElementById('particles-js')) {
    particlesJS('particles-js', {
      particles: {
        number: { value: 50, density: { enable: true, value_area: 800 } },
        color: { value: '#ffc107' },
        shape: { type: 'circle' },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        line_linked: { enable: false },
        move: { enable: true, speed: 2, direction: 'top', random: true, straight: false, out_mode: 'out' },
      },
      interactivity: {
        detect_on: 'canvas',
        events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' } },
      },
      retina_detect: true,
    });
  }

  // ------------------------------------
  // אנימציות GSAP - גרסה מהירה
  // ------------------------------------
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo('.logo-symbol', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.2, ease: 'power1.out' });
    gsap.fromTo('.logo-text', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.2, delay: 0.05, ease: 'power1.out' });
    gsap.fromTo('.hero-title', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.25, delay: 0.1, ease: 'power1.out' });
    gsap.fromTo('.call-button', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.2, delay: 0.15, ease: 'power1.out' });

    document.querySelectorAll('[data-animate]').forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.2,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  }

  // ------------------------------------
  // פילטר תפריט
  // ------------------------------------
  const filterButtons = document.querySelectorAll('.filter-btn');
  const menuCards = document.querySelectorAll('.menu-card');

  if (filterButtons.length && menuCards.length) {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');
        filterButtons.forEach(btn => {
          btn.classList.remove('active');
          btn.setAttribute('aria-checked', 'false');
        });
        button.classList.add('active');
        button.setAttribute('aria-checked', 'true');

        if (typeof gsap !== 'undefined') {
            const visibleCards = [];
            gsap.to(menuCards, {
              opacity: 0, scale: 0.8, duration: 0.3, stagger: 0.03, ease: 'power2.in',
              onComplete: () => {
                menuCards.forEach(card => {
                  const cardFilter = card.getAttribute('data-filter');
                  const show = filter === 'all' || cardFilter === filter;
                  card.classList.toggle('hidden', !show);
                  if (show) visibleCards.push(card);
                });

                gsap.fromTo(visibleCards,
                  { opacity: 0, scale: 0.8, y: 20 },
                  { opacity: 1, scale: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'back.out(1.7)' }
                );
              }
            });
        } else { // Fallback for no GSAP
            menuCards.forEach(card => {
                const cardFilter = card.getAttribute('data-filter');
                const show = filter === 'all' || cardFilter === filter;
                card.classList.toggle('hidden', !show);
            });
        }
      });
    });
  }

  // ------------------------------------
  // טופס ביקורת
  // ------------------------------------
  const reviewForm = document.getElementById('review-form');
  const thankYouMessage = document.getElementById('thank-you-message');

  if (reviewForm && thankYouMessage) {
    reviewForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const review = document.getElementById('review').value.trim();

      if (!name || !phone || !review) {
        alert('אנא מלאו את כל השדות החובה.');
        return;
      }
      if (!/^0\d{9}$/.test(phone)) {
        alert('נא להזין מספר טלפון ישראלי תקין (10 ספרות).');
        return;
      }

      const whatsappUrl = `https://wa.me/972546243397?text=${encodeURIComponent(`*ביקורת חדשה מפיצה ברסלב:*\n\n*שם:* ${name}\n*טלפון:* ${phone}\n*ביקורת:* ${review}`)}`;
      window.open(whatsappUrl, '_blank');

      reviewForm.style.display = 'none';
      thankYouMessage.style.display = 'block';
      reviewForm.reset();

      setTimeout(() => {
          thankYouMessage.style.display = 'none';
          reviewForm.style.display = 'flex';
      }, 6000);
    });
  }

  // ------------------------------------
  // עגלת קניות ופופ-אפ תוספות
  // ------------------------------------
  
  if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        cartSidebar.classList.toggle("open");
      });
  }
  if (document.getElementById("order-btn")){
      document.getElementById("order-btn").addEventListener("click", sendOrderToWhatsApp);
  }

  document.querySelectorAll(".menu-card").forEach((card) => {
    card.style.cursor = "pointer";
    card.addEventListener("click", () => {
      const name = card.querySelector("h3").innerText;
      const priceText = card.querySelector(".menu-price").innerText.replace(/[₪\s]/g, "");
      const price = parseFloat(priceText.includes("/") ? priceText.split("/")[0] : priceText);
      selectedPizza = { name, basePrice: price };

      const lowerName = name.toLowerCase();
      const hasToppings = (lowerName.includes("פיצה") && !lowerName.includes("שוקולד")) || lowerName.includes("סלט") || lowerName.includes("פסטה");

      if (hasToppings && modal) {
        modal.style.display = "flex";
      } else {
        cart.push({ name: selectedPizza.name, price: selectedPizza.basePrice });
        updateCart();
        if (cartSidebar) cartSidebar.classList.add("open");
      }
    });
  });

  if (toppingsForm && modal && addToppingsBtn) {
    toppingsForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const selected = [...toppingsForm.querySelectorAll("input[name='topping']:checked")].map(input => input.value);
        let toppingsCost = selected.reduce((sum, topping) => sum + (TOPPING_PRICES[topping] || 0), 0);
        const nameWithToppings = selectedPizza.name + (selected.length ? ` (עם ${selected.join(", ")})` : " (בלי תוספות)");
        const finalPrice = selectedPizza.basePrice + toppingsCost;
        cart.push({ name: nameWithToppings, price: finalPrice });
        updateCart();
        modal.style.display = "none";
        if(cartSidebar) cartSidebar.classList.add("open");
        toppingsForm.reset();
        addToppingsBtn.textContent = "הוסף בלי תוספות";
    });

    toppingsForm.addEventListener("change", () => {
        const checked = toppingsForm.querySelectorAll("input[name='topping']:checked");
        addToppingsBtn.textContent = checked.length ? "הוסף עם תוספות לעגלה" : "הוסף בלי תוספות";
    });
  }

  if (cancelBtn && modal && addToppingsBtn) {
    cancelBtn.addEventListener("click", () => {
        modal.style.display = "none";
        if(toppingsForm) toppingsForm.reset();
        addToppingsBtn.textContent = "הוסף בלי תוספות";
    });
  }
});




document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    const targetId = link.getAttribute('href');
    const target = document.querySelector(targetId);

    if (target) {
      e.preventDefault();

      // גלילה חלקה (אם scroll-behavior לא עבד)
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // אפקט הדגשה
      target.classList.add('section-flash', 'section-pop');

      // הסרת האפקט אחרי שנייה
      setTimeout(() => {
        target.classList.remove('section-flash', 'section-pop');
      }, 1000);
    }
  });
});





