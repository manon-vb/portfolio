// ===== ACTIVATION DU HEADER (IDENTIQUE À TON PORTFOLIO) =====
document.addEventListener('DOMContentLoaded', function() {
  // Animation du header
  const header = document.querySelector('.main-header');
  if (header) {
    setTimeout(() => {
      header.style.opacity = '1';
      header.style.pointerEvents = 'auto';
      header.style.top = '2vh';
    }, 300);
  }

  // ===== ANIMATIONS D'APPARITION DES SECTIONS =====
  const sections = document.querySelectorAll(
    '.personal-info-section, .social-section, .info-section'
  );

  sections.forEach((section, index) => {
    setTimeout(() => {
      section.classList.add('visible');
    }, 200 + (index * 200)); // Délai progressif
  });
  // ===== ANIMATION DES H2 (SLIDE) =====
const animatedSubtitles = document.querySelectorAll(
  '.social-section h2, .info-section h2'
);

if (animatedSubtitles.length > 0) {
  setTimeout(() => {
    animatedSubtitles.forEach((subtitle, index) => {
      subtitle.classList.add('visible');
    });
  }, 100); // Délai initial pour laisser le temps au chargement
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
