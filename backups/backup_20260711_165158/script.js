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
  const productDesc = card?.querySelector('.card-content p');

  const products = [
    {
      title: "Evo 600",
      desc: "Diseñado para operar de forma continua y silenciosa en clínicas, oficinas y hogares, sin interrumpir la actividad del espacio.",
      image: "assets/images/evo_600.png"
    },
    {
      title: "Evo 450",
      desc: "El modelo Evo 450 es ideal para espacios medianos, ofreciendo el mismo nivel de filtración médica y eliminación microbiológica en un tamaño más compacto.",
      image: "assets/images/evo_450.png"
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

  // Uses Carousel Section (ADAPTADOS A TODO TIPO DE AMBIENTE)
  const usesTrack = document.querySelector('.uses-track');
  const usesCards = document.querySelectorAll('.use-card');
  const usesPrev = document.querySelector('.uses-nav-btn.prev');
  const usesNext = document.querySelector('.uses-nav-btn.next');

  let currentUseIndex = 0;

  function getVisibleCardsCount() {
    return window.innerWidth >= 992 ? 3 : 1;
  }

  function updateUsesCarousel() {
    if (!usesTrack || usesCards.length === 0) return;
    const cardWidth = usesCards[0].getBoundingClientRect().width;
    const gap = 24; // 1.5rem gap matches CSS (24px)
    const offset = currentUseIndex * (cardWidth + gap);
    usesTrack.style.transform = `translateX(-${offset}px)`;

    // Enable/disable navigation buttons
    const visibleCount = getVisibleCardsCount();
    const maxIndex = usesCards.length - visibleCount;

    if (currentUseIndex <= 0) {
      usesPrev.style.opacity = '0.3';
      usesPrev.style.pointerEvents = 'none';
    } else {
      usesPrev.style.opacity = '1';
      usesPrev.style.pointerEvents = 'all';
    }

    if (currentUseIndex >= maxIndex) {
      usesNext.style.opacity = '0.3';
      usesNext.style.pointerEvents = 'none';
    } else {
      usesNext.style.opacity = '1';
      usesNext.style.pointerEvents = 'all';
    }
  }

  if (usesTrack && usesPrev && usesNext) {
    usesPrev.addEventListener('click', () => {
      if (currentUseIndex > 0) {
        currentUseIndex--;
        updateUsesCarousel();
      }
    });

    usesNext.addEventListener('click', () => {
      const visibleCount = getVisibleCardsCount();
      const maxIndex = usesCards.length - visibleCount;
      if (currentUseIndex < maxIndex) {
        currentUseIndex++;
        updateUsesCarousel();
      }
    });

    window.addEventListener('resize', () => {
      currentUseIndex = Math.min(currentUseIndex, usesCards.length - getVisibleCardsCount());
      if (currentUseIndex < 0) currentUseIndex = 0;
      updateUsesCarousel();
    });

    // Run layout calculations after DOM sets up
    setTimeout(updateUsesCarousel, 200);
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
});
