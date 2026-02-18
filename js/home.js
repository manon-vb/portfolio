document.addEventListener('DOMContentLoaded', function() {
  // --- ÉLÉMENTS DOM ---
  const heroText = document.querySelector('.hero-text');
  const line1 = document.querySelector('.line1');
  const line2 = document.querySelector('.line2');
  const line3 = document.querySelector('.line3');
  const lineBar = document.querySelector('.line-bar');
  const topLineRow = document.querySelector('.top-line-row');
  const header = document.querySelector('.main-header');
  const projectsSection = document.querySelector('.projects-section');
  const frontpageSection = document.querySelector('.frontpage-section');
  const gallery = document.querySelector('.projects-gallery');
  const featuredProject = document.querySelector('.featured-project');
  const aboutSection = document.querySelector('.about-section-new');

  // --- VARIABLES GLOBALES ---
  let hoverTimeout;
  let animationsCompleted = false;
  let galleryAutoScrollId = null;
  let isGalleryScrolling = false;
  let isGalleryPaused = false;
  let galleryScrollPosition = 0;
  let galleryScrollDirection = 1;
  const galleryScrollSpeed = 0.5;

  // ===== ANIMATIONS FRONTPAGE =====
  if (heroText && line1 && line2 && line3 && lineBar && topLineRow) {
    // Function to trigger hero animation
    function triggerHeroAnimation() {
      line1.style.transform = 'translateX(-150vw)';
      line2.style.transform = 'translateX(150vw)';
      line3.style.transform = 'translateX(-150vw)';
      lineBar.style.clipPath = 'inset(0 100% 0 0)';
      topLineRow.classList.add('hide-top');
    }

    // Check if mobile (touch device or small screen)
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      // On mobile: auto-trigger animation after delay
      setTimeout(() => {
        triggerHeroAnimation();
      }, 2000);
    } else {
      // On desktop: hover interaction
      heroText.addEventListener('mouseenter', () => {
        clearTimeout(hoverTimeout);
        hoverTimeout = setTimeout(() => {
          triggerHeroAnimation();
        }, 1000);
      });
      heroText.addEventListener('mouseleave', () => {
        clearTimeout(hoverTimeout);
      });
    }
  }

  // ===== FONCTION POUR ACTIVER LA SECTION PROJETS =====
  function activateProjectsSection() {
    if (!animationsCompleted) {
      header.classList.add('active');
      frontpageSection.style.opacity = '0';
      frontpageSection.style.transition = 'opacity 0.5s ease';

      setTimeout(() => {
        frontpageSection.style.display = 'none';
        projectsSection.style.opacity = '1';
        projectsSection.style.pointerEvents = 'auto';
        projectsSection.classList.add('active');

        // Animation du titre "Derniers projets" (déjà géré par CSS)
        // Animation du featured-project
        if (featuredProject) {
          featuredProject.style.opacity = '0';
          featuredProject.style.transform = 'translateX(-50px)';
          setTimeout(() => {
            featuredProject.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            featuredProject.style.opacity = '1';
            featuredProject.style.transform = 'translateX(0)';
          }, 100);
        }

        // Masque la galerie initialement (via JS pour éviter les clignotements)
        if (gallery) {
          gallery.style.opacity = '0';
          gallery.style.transform = 'translateY(20px)';
          setupGalleryScrollObserver(); // Configure l'observateur pour l'apparition au scroll
        }

        animationsCompleted = true;
      }, 500);
    }
  }

  // ===== DÉCLENCHEMENT APRES LES ANIMATIONS =====
  if (line3 && header && projectsSection && frontpageSection) {
    line3.addEventListener('transitionend', function(e) {
      if (e.propertyName === 'transform') {
        activateProjectsSection();
      }
    });
    window.addEventListener('load', function() {
      setTimeout(activateProjectsSection, 2000);
    });
  }

  // ===== CONFIGURATION DE L'OBSERVATEUR POUR LA GALERIE =====
  function setupGalleryScrollObserver() {
    if (!gallery) return;

    const galleryObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
          // Apparition de la galerie
          gallery.style.opacity = '1';
          gallery.style.transform = 'translateY(0)';
          startGalleryAutoScroll(); // Démarre le défilement automatique APRES l'apparition
          galleryObserver.unobserve(gallery);
        }
      });
    }, { threshold: 0.2 });

    galleryObserver.observe(gallery);
  }

  // ===== DÉFILEMENT AUTOMATIQUE DE LA GALERIE =====
  function startGalleryAutoScroll() {
    if (!gallery) return;

    function animateScroll(timestamp) {
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;

      if (!isGalleryScrolling && !isGalleryPaused) {
        const maxScroll = gallery.scrollWidth - gallery.clientWidth + 120;
        if (galleryScrollPosition >= maxScroll) {
          galleryScrollDirection = -1;
        } else if (galleryScrollPosition <= 0) {
          galleryScrollDirection = 1;
        }

        galleryScrollPosition += galleryScrollDirection * galleryScrollSpeed * (deltaTime / 16);
        gallery.scrollLeft = Math.min(Math.max(0, galleryScrollPosition), maxScroll);
      }
      galleryAutoScrollId = requestAnimationFrame(animateScroll);
    }

    let lastTime = 0;
    galleryAutoScrollId = requestAnimationFrame(animateScroll);

    // Gestion des événements de la galerie
    gallery.addEventListener('mousedown', () => {
      isGalleryScrolling = true;
      cancelAnimationFrame(galleryAutoScrollId);
      gallery.style.cursor = 'grabbing';
      gallery.style.userSelect = 'none';
    });

    gallery.addEventListener('mouseup', () => {
      isGalleryScrolling = false;
      gallery.style.cursor = 'grab';
      gallery.style.userSelect = '';
      galleryScrollPosition = gallery.scrollLeft;
      setTimeout(() => {
        galleryAutoScrollId = requestAnimationFrame(animateScroll);
      }, 500);
    });

    gallery.addEventListener('mousemove', (e) => {
      if (!isGalleryScrolling) return;
      e.preventDefault();
      const x = e.pageX - gallery.offsetLeft;
      const walk = (x - startX) * 2;
      gallery.scrollLeft = scrollLeft - walk;
      galleryScrollPosition = gallery.scrollLeft;
    });

    // Variables pour le drag-and-drop
    let startX, scrollLeft;
    gallery.addEventListener('mousedown', (e) => {
      startX = e.pageX - gallery.offsetLeft;
      scrollLeft = gallery.scrollLeft;
    });

    gallery.addEventListener('mouseenter', () => {
      isGalleryPaused = true;
      cancelAnimationFrame(galleryAutoScrollId);
    });

    gallery.addEventListener('mouseleave', () => {
      isGalleryPaused = false;
      if (!isGalleryScrolling) galleryAutoScrollId = requestAnimationFrame(animateScroll);
    });

    gallery.style.cursor = 'grab';
  }

  // ===== ANIMATION DE LA SECTION "À PROPOS" =====
  if (aboutSection) {
    const aboutObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          aboutSection.classList.add('visible');
          aboutObserver.unobserve(aboutSection);
        }
      });
    }, { threshold: 0.2 });

    aboutObserver.observe(aboutSection);
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
