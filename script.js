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

  // Hero Carousel Logic (Automatic and Dot indicator controls)
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroDots = document.querySelectorAll('.hero-dots .dot');
  let currentHeroSlide = 0;

  function showHeroSlide(index) {
    if (heroSlides.length === 0) return;
    heroSlides.forEach(slide => slide.classList.remove('active'));
    heroDots.forEach(dot => dot.classList.remove('active'));
    
    currentHeroSlide = (index + heroSlides.length) % heroSlides.length;
    
    heroSlides[currentHeroSlide].classList.add('active');
    heroDots[currentHeroSlide].classList.add('active');
  }

  if (heroSlides.length > 0) {
    heroDots.forEach((dot, index) => {
      dot.addEventListener('click', () => showHeroSlide(index));
    });
    
    // Auto-advance hero carousel every 5 seconds
    setInterval(() => {
      showHeroSlide(currentHeroSlide + 1);
    }, 5000);
  }

  // Product Carousel Logic (Arrow navigation controls)
  const prevBtn = document.querySelector('.nav-btn.prev');
  const nextBtn = document.querySelector('.nav-btn.next');
  const card = document.querySelector('.product-card');
  const productImage = card.querySelector('.card-image-wrapper img');
  const productTitle = card.querySelector('.card-content h3');
  const productDesc = card.querySelector('.card-content p');

  const products = [
    {
      title: "Evo 600",
      desc: "Los sistemas ecoviox son purificadores de aire que cuentan con las tecnologías más efectivas para reducir la carga microbiológica en suspensión y en las superficies.",
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
});
