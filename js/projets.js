// ===== NOUVEAU COMPORTEMENT DU HEADER =====
// ===== COMPORTEMENT DES HEADERS (VERSION CORRIGÉE POUR LES CATÉGORIES UNIQUEMENT) =====
document.addEventListener('DOMContentLoaded', function() {
  const header = document.querySelector('.main-header');
  const verticalNav = document.querySelector('.vertical-projects-nav');
  const carousel3D = document.querySelector('.carousel-3d'); // Section du carousel 3D
  const projectCategories = document.querySelectorAll('.project-category'); // Toutes les catégories
  let reduceTimeout;

  if (header && verticalNav && carousel3D && projectCategories.length > 0) {
    // Position initiale du header
    header.style.opacity = '1';
    header.style.pointerEvents = 'auto';
    header.style.top = '2vh';

    // Zone de détection du pseudo-bouton
    const buttonArea = {
      right: window.innerWidth - 20,
      top: 10,
      width: 40,
      height: 40
    };

    // Observer pour détecter quand on QUITTE le carousel 3D
    const carouselObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) {
            // Quand on quitte le carousel 3D (vers le bas) → active les headers réduits
            header.classList.add('reduced');
            verticalNav.classList.add('visible');
            verticalNav.classList.remove('hidden');
            // Show vertical nav on mobile when scrolling past carousel
            if (window.innerWidth <= 768) {
              verticalNav.style.opacity = '1';
              verticalNav.style.pointerEvents = 'auto';
            }
            clearTimeout(reduceTimeout);
          } else {
            // Quand on remonte vers le carousel 3D → headers normaux
            header.classList.remove('reduced');
            verticalNav.classList.remove('visible');
            verticalNav.classList.add('hidden');
            // Hide vertical nav on mobile when at top
            if (window.innerWidth <= 768) {
              verticalNav.style.opacity = '0';
              verticalNav.style.pointerEvents = 'none';
            }
            clearTimeout(reduceTimeout);
          }
        });
      },
      { threshold: 0.1, rootMargin: "-50px 0px 0px 0px" } // Déclenche quand le carousel est à 50px du haut
    );
    carouselObserver.observe(carousel3D);

    // Observer pour les catégories (uniquement pour les liens actifs)
    const linkObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const categoryId = entry.target.getAttribute('data-category');
            document.querySelectorAll('.vertical-nav-link').forEach(link => {
              link.classList.remove('active');
              if (link.getAttribute('href') === `#${categoryId}`) {
                link.classList.add('active');
              }
            });
          }
        });
      },
      { threshold: 0.5 }
    );
    projectCategories.forEach(category => linkObserver.observe(category));

    // Détection du survol du pseudo-bouton
    document.addEventListener('mousemove', (e) => {
      const isOverButton =
        e.clientX >= buttonArea.right - buttonArea.width &&
        e.clientX <= buttonArea.right &&
        e.clientY >= buttonArea.top &&
        e.clientY <= buttonArea.top + buttonArea.height;

      if (isOverButton && header.classList.contains('reduced')) {
        header.classList.remove('reduced');
        header.classList.add('extended');
        // Hide vertical nav on mobile when header extends
        if (window.innerWidth <= 768) {
          verticalNav.style.opacity = '0';
          verticalNav.style.pointerEvents = 'none';
        }
        clearTimeout(reduceTimeout);
      }
    });

    // Mobile click/touch handler for burger button
    header.addEventListener('click', () => {
      if (header.classList.contains('reduced') && window.innerWidth <= 768) {
        header.classList.remove('reduced');
        header.classList.add('extended');
        // Hide vertical nav on mobile when header extends
        verticalNav.style.opacity = '0';
        verticalNav.style.pointerEvents = 'none';
        clearTimeout(reduceTimeout);
      }
    });

    // Survol du header étendu = annule le timer
    header.addEventListener('mouseenter', () => {
      clearTimeout(reduceTimeout);
      // Hide vertical nav on mobile when header is extended
      if (window.innerWidth <= 768 && header.classList.contains('extended')) {
        verticalNav.style.opacity = '0';
        verticalNav.style.pointerEvents = 'none';
      }
    });

    // Sortie du survol = timer de 5s
    header.addEventListener('mouseleave', () => {
      if (header.classList.contains('extended')) {
        reduceTimeout = setTimeout(() => {
          header.classList.remove('extended');
          header.classList.add('reduced');
          // Show vertical nav on mobile when header reduces
          if (window.innerWidth <= 768) {
            verticalNav.style.opacity = '1';
            verticalNav.style.pointerEvents = 'auto';
          }
        }, 2000);
      }
    });

    // Clic sur les liens de navigation
    document.querySelectorAll('.vertical-nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetCategory = document.querySelector(`[data-category="${targetId}"]`);
        if (targetCategory) {
          targetCategory.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }


  // ===== CAROUSEL 3D =====
  const container = document.querySelector('.carousel-3d-container');
  const items = document.querySelectorAll('.carousel-3d-item');
  const prevButton = document.querySelector('.carousel-3d-prev');
  const nextButton = document.querySelector('.carousel-3d-next');
  const radius = 400;
  let currentAngle = 0;
  let animationId;
  let lastRotationTime = 0;
  const rotationDelay = 3000;

  if (container && items.length && prevButton && nextButton) {
    function positionItems() {
      items.forEach((item, index) => {
        const angle = currentAngle + (index * (2 * Math.PI / items.length));
        const x = radius * Math.sin(angle);
        const z = radius * Math.cos(angle);
        const scale = z / radius + 0.5;
        item.style.transform = `translateX(-50%) translate3d(${x}px, 0, ${z}px) scale(${scale})`;
        item.style.zIndex = Math.round(z + radius);
        item.classList.remove('active');
      });

      let closestIndex = 0;
      let closestZ = -Infinity;
      items.forEach((item, index) => {
        const angle = currentAngle + (index * (2 * Math.PI / items.length));
        const z = radius * Math.cos(angle);
        if (z > closestZ) {
          closestZ = z;
          closestIndex = index;
        }
      });
      items[closestIndex].classList.add('active');
    }

    function nextItem() {
      currentAngle -= 2 * Math.PI / items.length;
      positionItems();
    }

    function prevItem() {
      currentAngle += 2 * Math.PI / items.length;
      positionItems();
    }

    function animateCarousel(timestamp) {
      if (!lastRotationTime) lastRotationTime = timestamp;
      const elapsed = timestamp - lastRotationTime;
      if (elapsed > rotationDelay) {
        nextItem();
        lastRotationTime = timestamp;
      }
      animationId = requestAnimationFrame(animateCarousel);
    }

    prevButton.addEventListener('click', prevItem);
    nextButton.addEventListener('click', nextItem);
    positionItems();
    animationId = requestAnimationFrame(animateCarousel);

    container.addEventListener('mouseenter', () => {
      cancelAnimationFrame(animationId);
    });

    container.addEventListener('mouseleave', () => {
      lastRotationTime = performance.now();
      animationId = requestAnimationFrame(animateCarousel);
    });
  } else {
    console.error("Un élément du carousel 3D est manquant.");
  }

  // ===== CAROUSELS 2D (PAYSAGE) - VERSION DÉFINITIVE =====
const fullWidthCarousels = document.querySelectorAll('.full-width-carousel');
fullWidthCarousels.forEach((carousel) => {
  const slidesContainer = carousel.querySelector('.carousel-2d');
  const slides = slidesContainer ? Array.from(slidesContainer.children) : [];
  const prevButton = carousel.querySelector('.carousel-2d-prev');
  const nextButton = carousel.querySelector('.carousel-2d-next');

  if (slidesContainer && slides.length && prevButton && nextButton) {
    let currentSlide = 0;
    let slideInterval;
    let isVideoPlaying = false;
    let currentVideo = null;
    let currentHandlers = {};
    let iframeTimer = null;

    // Configuration initiale (inchangée)
    slidesContainer.style.display = 'flex';
    slidesContainer.style.width = `${slides.length * 100}%`;
    slides.forEach(slide => {
      slide.style.width = `${100 / slides.length}%`;
    });

    // Ajuste les médias au format paysage (Memory n°5)
    function adjustMedia() {
      slides.forEach(slide => {
        const img = slide.querySelector('img');
        const video = slide.querySelector('video');
        if (img) {
          img.style.width = '100%';
          img.style.height = '100%';
          img.style.objectFit = 'cover';
        }
        if (video) {
          video.style.width = '100%';
          video.style.height = '100%';
          video.style.objectFit = 'cover';
        }
      });
    }

    // Gestion sécurisée des vidéos
    function setupVideo(video) {
      const onPlay = () => {
        isVideoPlaying = true;
        stopAutoSlide();
      };
      const onEnded = () => {
        isVideoPlaying = false;
        startAutoSlide();
      };
      const onPause = () => {
        isVideoPlaying = false;
        startAutoSlide();
      };

      video.addEventListener('play', onPlay);
      video.addEventListener('ended', onEnded);
      video.addEventListener('pause', onPause);

      return { onPlay, onEnded, onPause };
    }

    // Vérifie le slide courant
    function checkCurrentSlide() {
      // Clear any existing iframe timer
      if (iframeTimer) {
        clearTimeout(iframeTimer);
        iframeTimer = null;
      }

      if (currentVideo) {
        currentVideo.removeEventListener('play', currentHandlers.onPlay);
        currentVideo.removeEventListener('ended', currentHandlers.onEnded);
        currentVideo.removeEventListener('pause', currentHandlers.onPause);
      }

      const video = slides[currentSlide].querySelector('video');
      const iframe = slides[currentSlide].querySelector('iframe.streamable-iframe');
      
      if (video) {
        currentVideo = video;
        currentHandlers = setupVideo(video);
        isVideoPlaying = !video.paused;
      } else if (iframe) {
        // Pour les iframes, démarrer un timer basé sur la durée estimée de la vidéo
        currentVideo = null;
        isVideoPlaying = false;
        
        // Obtenir la durée depuis l'attribut data-duration ou utiliser 30 secondes par défaut
        const duration = parseInt(iframe.getAttribute('data-duration')) || 30;
        
        // Après la durée de la vidéo, redémarrer l'auto-slide
        iframeTimer = setTimeout(() => {
          startAutoSlide();
        }, duration * 1000);
      } else {
        currentVideo = null;
        isVideoPlaying = false;
      }
    }

    function nextSlide(force = false) {
      if (isVideoPlaying && !force) return;
      
      // Clear iframe timer if exists
      if (iframeTimer) {
        clearTimeout(iframeTimer);
        iframeTimer = null;
      }
      
      // Arrêter la vidéo iframe si on quitte ce slide
      const currentIframe = slides[currentSlide].querySelector('iframe.streamable-iframe');
      if (currentIframe) {
        // Recharger l'iframe pour arrêter la vidéo
        const src = currentIframe.src;
        currentIframe.src = '';
        currentIframe.src = src;
      }
      
      isVideoPlaying = false;
      currentSlide = (currentSlide + 1) % slides.length;
      updateSlide();
      checkCurrentSlide();
      startAutoSlide();
    }

    function prevSlide(force = false) {
      if (isVideoPlaying && !force) return;
      
      // Clear iframe timer if exists
      if (iframeTimer) {
        clearTimeout(iframeTimer);
        iframeTimer = null;
      }
      
      // Arrêter la vidéo iframe si on quitte ce slide
      const currentIframe = slides[currentSlide].querySelector('iframe.streamable-iframe');
      if (currentIframe) {
        // Recharger l'iframe pour arrêter la vidéo
        const src = currentIframe.src;
        currentIframe.src = '';
        currentIframe.src = src;
      }
      
      isVideoPlaying = false;
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      updateSlide();
      checkCurrentSlide();
      startAutoSlide();
    }

    function updateSlide() {
      slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    function startAutoSlide() {
      if (!isVideoPlaying) {
        clearInterval(slideInterval);
        // Ne pas démarrer l'auto-slide si on est sur un iframe (Streamable)
        const hasIframe = slides[currentSlide].querySelector('iframe.streamable-iframe');
        if (!hasIframe) {
          slideInterval = setInterval(() => nextSlide(), 3000);
        }
      }
    }

    function stopAutoSlide() {
      clearInterval(slideInterval);
    }

    // Écouteurs des boutons (priorité absolue)
    nextButton.addEventListener('click', () => nextSlide(true)); // force=true ignore la vidéo
    prevButton.addEventListener('click', () => prevSlide(true)); // force=true ignore la vidéo

    // Comportement au survol
    carousel.addEventListener('mouseenter', stopAutoSlide);
    carousel.addEventListener('mouseleave', () => {
      if (!isVideoPlaying) startAutoSlide();
    });

    // Arrêter les vidéos lors du scroll
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      // Améliorer les performances avec les iframes
      document.documentElement.classList.add('scrolling');
      
      clearTimeout(scrollTimeout);
      
      // Arrêter les vidéos et iframes immédiatement
      slides.forEach(slide => {
        const video = slide.querySelector('video');
        const iframe = slide.querySelector('iframe.streamable-iframe');
        
        if (video && !video.paused) {
          video.pause();
        }
        if (iframe) {
          const src = iframe.src;
          iframe.src = '';
          iframe.src = src;
        }
      });
      
      isVideoPlaying = false;
      stopAutoSlide();
      
      // Redémarrer l'auto-slide après le scroll
      scrollTimeout = setTimeout(() => {
        document.documentElement.classList.remove('scrolling');
        checkCurrentSlide();
        startAutoSlide();
      }, 500);
    });

    // Initialisation
    adjustMedia();
    checkCurrentSlide();
    startAutoSlide();
    window.addEventListener('resize', adjustMedia);
  }
});

// ===== CAROUSEL PORTRAIT (AVEC DÉFILEMENT AUTO) =====
  const portraitCarousels = document.querySelectorAll('.portrait-carousel');

  portraitCarousels.forEach(carousel => {
    const slidesContainer = carousel.querySelector('.portrait-carousel-inner');
    const slides = Array.from(slidesContainer.children);
    let currentSlide = 0;
    let slideInterval;

    // Fonction pour passer au slide suivant
    function nextSlide() {
      currentSlide = (currentSlide + 1) % slides.length;
      slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
      });
    }

    // Démarre le défilement auto (3 secondes)
    function startAutoSlide() {
      slideInterval = setInterval(nextSlide, 3000);
    }

    // Initialisation
    startAutoSlide();

    // Pause au survol
    carousel.addEventListener('mouseenter', () => clearInterval(slideInterval));
    carousel.addEventListener('mouseleave', startAutoSlide);
  });


// ===== CAROUSEL PAYSAGE =====
  const landscapeCarousels = document.querySelectorAll('.landscape-carousel');

  landscapeCarousels.forEach(carousel => {
    const slidesContainer = carousel.querySelector('.carousel-2d');
    const slides = Array.from(slidesContainer.children);
    const prevButton = carousel.querySelector('.carousel-2d-prev');
    const nextButton = carousel.querySelector('.carousel-2d-next');

    if (!slidesContainer || slides.length === 0) return;

    let currentSlide = 0;
    let slideInterval;
    let iframeTimer = null;

    // Configuration initiale
    slidesContainer.style.display = 'flex';
    slidesContainer.style.width = `${slides.length * 100}%`;
    slides.forEach(slide => {
      slide.style.width = `${100 / slides.length}%`;
    });

    function checkCurrentSlide() {
      // Clear any existing iframe timer
      if (iframeTimer) {
        clearTimeout(iframeTimer);
        iframeTimer = null;
      }

      const iframe = slides[currentSlide].querySelector('iframe.streamable-iframe');
      
      if (iframe) {
        // Pour les iframes, démarrer un timer basé sur la durée estimée de la vidéo
        const duration = parseInt(iframe.getAttribute('data-duration')) || 60;
        
        // Après la durée de la vidéo, redémarrer l'auto-slide
        iframeTimer = setTimeout(() => {
          startAutoSlide();
        }, duration * 1000);
      }
    }

    function startAutoSlide() {
      clearInterval(slideInterval);
      // Ne pas démarrer l'auto-slide si on est sur un iframe (Streamable)
      const hasIframe = slides[currentSlide].querySelector('iframe.streamable-iframe');
      if (!hasIframe) {
        slideInterval = setInterval(() => nextSlide(), 3000);
      }
    }

    function stopAutoSlide() {
      clearInterval(slideInterval);
    }

    function goToSlide(index) {
      currentSlide = index;
      slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    function nextSlide(force = false) {
      // Clear iframe timer if exists
      if (iframeTimer) {
        clearTimeout(iframeTimer);
        iframeTimer = null;
      }
      
      // Arrêter la vidéo iframe si on quitte ce slide
      const currentIframe = slides[currentSlide].querySelector('iframe.streamable-iframe');
      if (currentIframe) {
        const src = currentIframe.src;
        currentIframe.src = '';
        currentIframe.src = src;
      }
      
      currentSlide = (currentSlide + 1) % slides.length;
      goToSlide(currentSlide);
      checkCurrentSlide();
      startAutoSlide();
    }

    function prevSlide(force = false) {
      // Clear iframe timer if exists
      if (iframeTimer) {
        clearTimeout(iframeTimer);
        iframeTimer = null;
      }
      
      // Arrêter la vidéo iframe si on quitte ce slide
      const currentIframe = slides[currentSlide].querySelector('iframe.streamable-iframe');
      if (currentIframe) {
        const src = currentIframe.src;
        currentIframe.src = '';
        currentIframe.src = src;
      }
      
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      goToSlide(currentSlide);
      checkCurrentSlide();
      startAutoSlide();
    }

    // Écouteurs des boutons
    nextButton.addEventListener('click', () => nextSlide(true));
    prevButton.addEventListener('click', () => prevSlide(true));

    // Comportement au survol
    carousel.addEventListener('mouseenter', stopAutoSlide);
    carousel.addEventListener('mouseleave', startAutoSlide);

    // Initialisation
    checkCurrentSlide();
    startAutoSlide();
  });


  // ===== MODALE POUR IMAGES AGRANDIES =====
  // ===== MODALE POUR IMAGES AGRANDIES (ÉTENDUE) =====
const modal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');
const modalDescription = document.getElementById('modal-description');

if (modal && modalImage && modalDescription) {
  // Sélectionne TOUTES les images cliquables (y compris les nouvelles)
  const clickableImages = document.querySelectorAll(
    '.carousel-2d-slide img, ' +  // Carousels existants
    '.portrait-carousel-slide img, ' + // Carousels portrait
    '.landscape-image-container img, ' + // NOUVEAU: Images paysage
    '.landscape-carousel .carousel-2d-slide img' // NOUVEAU: Images du carousel paysage
  );

  clickableImages.forEach(img => {
    img.addEventListener('click', function(e) {
      e.stopPropagation();
      const imgSrc = this.getAttribute('src');
      const description = this.getAttribute('alt') || 'Description indisponible';
      modalImage.setAttribute('src', imgSrc);
      modalDescription.textContent = description;
      modal.classList.add('visible');
      document.body.style.overflow = 'hidden';
    });
  });

  // Fermeture de la modale (inchangé)
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.classList.remove('visible');
      document.body.style.overflow = 'auto';
    }
  });

  // Fermeture avec Échap (inchangé)
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('visible')) {
      modal.classList.remove('visible');
      document.body.style.overflow = 'auto';
    }
  });
} else {
  console.error("Un élément de la modale est manquant.");
}


  // ===== FONCTIONNALITÉ DE SCROLL VERS LES CATÉGORIES =====
  const projectToCategoryMap = {
    "3d": "3d",
    "motion": "motion",
    "jeu": "jeu",
    "graphisme": "graphisme",
    "arts plastiques": "arts-plastiques"
  };

  function scrollToCategory(categoryId) {
    const categoryElement = document.querySelector(`[data-category="${categoryId}"]`);
    if (categoryElement) {
      categoryElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      console.warn(`Catégorie "${categoryId}" non trouvée.`);
    }
  }

  document.querySelectorAll('.project-card-overlay').forEach(overlay => {
    overlay.addEventListener('click', function(e) {
      e.stopPropagation();
      const projectName = this.querySelector('h3').textContent.toLowerCase().trim();
      const categoryId = projectToCategoryMap[projectName];
      if (categoryId) {
        scrollToCategory(categoryId);
      } else {
        console.warn(`Aucune catégorie trouvée pour le projet "${projectName}".`);
      }
    });
  });

  // ===== BOUTON DE REMONTÉE EN HAUT DE PAGE (CORRIGÉ) =====
  const backToTopButton = document.getElementById('back-to-top');

  if (backToTopButton && carousel3D) { // Vérification supplémentaire
    function toggleBackToTopButton() {
      const carousel3DPosition = carousel3D.getBoundingClientRect().top + window.scrollY;
      const isPastCarousel = window.scrollY > carousel3DPosition;

      if (isPastCarousel) {
        backToTopButton.classList.add('visible');
      } else {
        backToTopButton.classList.remove('visible');
      }
    }

    backToTopButton.addEventListener('click', function(e) {
      e.preventDefault();
      carousel3D.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });

    window.addEventListener('scroll', toggleBackToTopButton);
    window.addEventListener('resize', toggleBackToTopButton);
    toggleBackToTopButton(); // Initialisation
  } else {
    console.error("Le bouton de remontée ou le carousel 3D est manquant.");
  }

// ===== ANIMATION DES H2 (SLIDE DEPUIS LA GAUCHE) =====
const projectCategoryTitles = document.querySelectorAll('.project-category h2');

if (projectCategoryTitles.length > 0) {
  const titleObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else {
          entry.target.classList.remove('visible');
        }
      });
    },
    { threshold: 0.1 } // Déclenche quand 10% du h2 est visible
  );

  projectCategoryTitles.forEach(title => titleObserver.observe(title));
}

// ===== VIDEO SOUND ON HOVER/CLICK =====
const allVideos = document.querySelectorAll('video');

allVideos.forEach(video => {
  let isMobileClick = false;

  // Desktop: unmute on hover
  video.addEventListener('mouseenter', () => {
    if (window.innerWidth > 768 && !isMobileClick) {
      video.muted = false;
      video.volume = 0.4; // Set volume to 40%
    }
  });

  // Desktop: mute when leaving
  video.addEventListener('mouseleave', () => {
    if (window.innerWidth > 768 && !isMobileClick) {
      video.muted = true;
    }
  });

  // Mobile/Tablet: toggle mute on click/touch
  video.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      e.stopPropagation();
      video.muted = !video.muted;
      if (!video.muted) {
        video.volume = 0.4;
        isMobileClick = true;
      } else {
        isMobileClick = false;
      }
    }
  });

  video.addEventListener('touchstart', (e) => {
    e.stopPropagation();
    video.muted = !video.muted;
    if (!video.muted) {
      video.volume = 0.4;
      isMobileClick = true;
    } else {
      isMobileClick = false;
    }
  }, { passive: true });
});

});
