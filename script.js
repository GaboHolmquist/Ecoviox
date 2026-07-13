document.addEventListener('DOMContentLoaded', () => {
  // Intersection Observer for scroll animations
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // Mobile Hamburger Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close menu when clicking on any link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // Product Carousel Logic (Arrow navigation controls)
  const prevBtn = document.querySelector('.nav-btn.prev');
  const nextBtn = document.querySelector('.nav-btn.next');
  const card = document.querySelector('.product-card');
  const productImage = card?.querySelector('.card-image-wrapper img');
  const productTitle = card?.querySelector('.card-content h3');
  const productPrice = card?.querySelector('.card-price');
  const productDesc = card?.querySelector('.card-desc');

  const products = [
    {
      title: "Evo 600",
      desc: "Diseñado para operar de forma continua y silenciosa en clínicas, oficinas y hogares, sin interrumpir la actividad del espacio.",
      image: "assets/images/evo_600.png",
      price: "Precio: $650.000 CLP"
    },
    {
      title: "Evo 450",
      desc: "El modelo Evo 450 es ideal para espacios medianos, ofreciendo el mismo nivel de filtración médica y eliminación microbiológica en un tamaño más compacto.",
      image: "assets/images/evo_450.png",
      price: "Precio: $420.000 CLP"
    }
  ];

  let currentProductIndex = 0;

  function updateProduct(index) {
    if (!card || !productImage || !productTitle || !productDesc) return;
    
    currentProductIndex = (index + products.length) % products.length;
    const currentProduct = products[currentProductIndex];

    // Smooth transition
    card.style.opacity = '0.5';
    card.style.transform = 'translateY(10px)';

    setTimeout(() => {
      productImage.src = currentProduct.image;
      productImage.alt = currentProduct.title;
      productTitle.textContent = currentProduct.title;
      if (productPrice) productPrice.textContent = currentProduct.price;
      productDesc.textContent = currentProduct.desc;
      
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 250);
  }

  if (prevBtn && nextBtn && card) {
    card.style.transition = 'all 0.3s ease';
    prevBtn.addEventListener('click', () => updateProduct(currentProductIndex - 1));
    nextBtn.addEventListener('click', () => updateProduct(currentProductIndex + 1));
  }

  // Uses Carousel Section (ADAPTADOS A TODO TIPO DE AMBIENTE) - Infinite Loop
  const usesTrack = document.querySelector('.uses-track');
  const usesPrev = document.querySelector('.uses-nav-btn.prev');
  const usesNext = document.querySelector('.uses-nav-btn.next');

  if (usesTrack && usesPrev && usesNext) {
    let isTransitioning = false;

    function getVisibleCount() {
      return window.innerWidth >= 992 ? 3 : 1;
    }

    function getCardWidthAndGap() {
      const cards = usesTrack.querySelectorAll('.use-card');
      if (cards.length === 0) return { width: 0, gap: 0 };
      const width = cards[0].getBoundingClientRect().width;
      const gap = 24; // Matches 1.5rem CSS gap (24px)
      return { width, gap };
    }

    function updateCenterCard(targetIndex = null) {
      const cards = usesTrack.querySelectorAll('.use-card');
      cards.forEach(c => c.classList.remove('center-card'));
      
      if (targetIndex !== null) {
        if (cards[targetIndex]) {
          cards[targetIndex].classList.add('center-card');
        }
        return;
      }

      const visibleCount = getVisibleCount();
      const centerIndex = visibleCount === 3 ? 1 : 0;
      if (cards[centerIndex]) {
        cards[centerIndex].classList.add('center-card');
      }
    }

    function handleNext() {
      if (isTransitioning) return;
      isTransitioning = true;

      const { width, gap } = getCardWidthAndGap();
      const offset = width + gap;

      // Calculate which card will be in the center next
      const nextCenter = getVisibleCount() === 3 ? 2 : 1;
      updateCenterCard(nextCenter);

      // Animate track to the left
      usesTrack.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
      usesTrack.style.transform = `translateX(-${offset}px)`;

      usesTrack.addEventListener('transitionend', function handler() {
        usesTrack.removeEventListener('transitionend', handler);
        
        // Append first child to the end
        const firstCard = usesTrack.firstElementChild;
        usesTrack.appendChild(firstCard);

        // Reset track position instantly
        usesTrack.style.transition = 'none';
        usesTrack.style.transform = 'translateX(0)';
        
        // Reset center card class according to the new DOM positions
        updateCenterCard();
        isTransitioning = false;
      });
    }

    function handlePrev() {
      if (isTransitioning) return;
      isTransitioning = true;

      const { width, gap } = getCardWidthAndGap();
      const offset = width + gap;

      // Prepend last card instantly
      usesTrack.style.transition = 'none';
      const lastCard = usesTrack.lastElementChild;
      usesTrack.insertBefore(lastCard, usesTrack.firstElementChild);

      // Adjust offset to maintain visual position
      usesTrack.style.transform = `translateX(-${offset}px)`;

      // Force a reflow to make the transition play
      usesTrack.offsetHeight;

      // Calculate center card for the previous slide
      const prevCenter = getVisibleCount() === 3 ? 1 : 0;
      updateCenterCard(prevCenter);

      // Slide right to 0
      usesTrack.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
      usesTrack.style.transform = 'translateX(0)';

      usesTrack.addEventListener('transitionend', function handler() {
        usesTrack.removeEventListener('transitionend', handler);
        updateCenterCard();
        isTransitioning = false;
      });
    }

    usesNext.addEventListener('click', handleNext);
    usesPrev.addEventListener('click', handlePrev);

    // Initial setup with short delay to ensure widths are rendered
    setTimeout(updateCenterCard, 150);

    // Recalculate on window resize
    window.addEventListener('resize', () => {
      usesTrack.style.transition = 'none';
      usesTrack.style.transform = 'translateX(0)';
      updateCenterCard();
    });
  }

  // FAQ Accordion Toggle
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    if (question && answer) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all items
        faqItems.forEach(el => {
          el.classList.remove('active');
          const ans = el.querySelector('.faq-answer');
          if (ans) ans.style.maxHeight = null;
        });

        // Open active
        if (!isActive) {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + "px";
        }
      });
    }
  });

  // Contact Form Submission Handler (Google Sheets Web App Integration)
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      submitBtn.textContent = 'Enviando...';
      submitBtn.disabled = true;

      const formData = new FormData(contactForm);
      const data = {
        nombre: formData.get('name'),
        email: formData.get('email'),
        mensaje: formData.get('message'),
        fecha: new Date().toLocaleString()
      };

      // CONFIGURACIÓN: Reemplaza esta URL con tu enlace de Google Apps Script cuando lo crees
      const GOOGLE_SCRIPT_URL = 'DEJA_TU_URL_DE_GOOGLE_APPS_SCRIPT_AQUI';

      if (GOOGLE_SCRIPT_URL === 'DEJA_TU_URL_DE_GOOGLE_APPS_SCRIPT_AQUI') {
        alert('Por favor, configura tu URL de Google Apps Script en el archivo script.js para procesar el formulario.');
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
        return;
      }

      fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Omit CORS errors on client side
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(() => {
        // Show elegant success animation inside the glass form
        contactForm.innerHTML = `
          <div class="success-message" style="text-align: center; padding: 2rem 0; animation: fadeIn 0.5s ease-out;">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#0071e3" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 1.2rem;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <h3 style="font-family: var(--font-heading); font-size: 1.6rem; margin-bottom: 0.5rem; font-weight: bold;">¡Mensaje Enviado!</h3>
            <p style="color: var(--text-secondary); font-size: 1rem;">Hemos recibido tus datos correctamente y nos contactaremos contigo a la brevedad.</p>
          </div>
        `;
      })
      .catch(error => {
        console.error('Error al enviar el formulario:', error);
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
        alert('Hubo un error al procesar el envío. Por favor, intenta nuevamente.');
      });
    });
  }
});
