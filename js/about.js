// ===== ACTIVATION DU HEADER (IDENTIQUE À TON PORTFOLIO) =====
document.addEventListener('DOMContentLoaded', function() {
  const header = document.querySelector('.main-header');
  if (header) {
    // Animation d'apparition du header (identique à ton portfolio)
    setTimeout(() => {
      header.style.opacity = '1';
      header.style.pointerEvents = 'auto';
      header.style.top = '2vh';
    }, 300);
  }

  // ===== EFFETS SUPPLÉMENTAIRES POUR LA PAGE ABOUT =====
  // Animation des sections au scroll (optionnel)
  const sections = document.querySelectorAll('.about-section, .skills-section, .recent-projects');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'all 0.6s ease';
    observer.observe(section);
  });

 // ===== GESTION DU CV (CORRECTION FONCTIONNELLE) =====
  const cvToggle = document.getElementById('cv-toggle');
  const cvPreview = document.getElementById('cv-preview');
  const cvClose = document.getElementById('cv-close');
  const cvEmbed = document.getElementById('cv-pdf');

  if (cvToggle && cvPreview && cvClose && cvEmbed) {
    // Afficher l'aperçu du CV
    cvToggle.addEventListener('click', function(e) {
      e.preventDefault(); // Empêche le comportement par défaut du bouton
      cvPreview.classList.add('visible');
      document.body.style.overflow = 'hidden';

      // Ajuste la taille du PDF
      const pdfWidth = 794; // Largeur A4 en pixels
      const pdfHeight = 1123; // Hauteur A4 portrait en pixels
      const windowHeight = window.innerHeight - 100;

      setTimeout(() => {
        cvEmbed.style.maxHeight = `${windowHeight - 100}px`;
      }, 100);
    });

    // Fermer l'aperçu (bouton ×)
    cvClose.addEventListener('click', function() {
      cvPreview.classList.remove('visible');
      document.body.style.overflow = 'auto';
    });

    // Fermer en cliquant en dehors du CV
    cvPreview.addEventListener('click', function(e) {
      if (e.target === cvPreview) {
        cvPreview.classList.remove('visible');
        document.body.style.overflow = 'auto';
      }
    });
  } else {
    console.error("Un élément du CV est manquant. Vérifie les IDs : cv-toggle, cv-preview, cv-close, cv-pdf");
  }

  // ===== ANIMATION DES SOUS-TITRES (SLIDE) =====
const subtitles = document.querySelectorAll(
  '.about-section h2, .skills-section h2, .recent-projects h2, .formation-section h2'
);

if (subtitles.length > 0) {
  // Déclenche l'animation après un léger délai pour laisser le temps au chargement
  setTimeout(() => {
    subtitles.forEach(subtitle => {
      subtitle.classList.add('visible');
    });
  }, 100); // Délai de 100ms pour éviter les saccades
}

// ===== ANIMATION DU GIF ASCII =====
  // Charger le fichier ascii.txt (à placer dans le même dossier que about.html)
  fetch('ascii.txt')
    .then(response => response.text())
    .then(text => {
      const asciiGifElement = document.getElementById('asciiGif');
      if (!asciiGifElement) return;

      // Séparer les frames par "=====" (ou un autre délimiteur si différent)
      const frames = text.split('kkkk').filter(frame => frame.trim() !== '');
      if (frames.length === 0) return;

      let currentFrame = 0;

      // Affiche la première frame
      asciiGifElement.textContent = frames[currentFrame];

      // Anime le GIF (change de frame toutes les 100ms)
      setInterval(() => {
        currentFrame = (currentFrame + 1) % frames.length;
        asciiGifElement.textContent = frames[currentFrame];
      }, 300); // Ajuste ce délai pour contrôler la vitesse de l'animation
    })
    .catch(error => {
      console.error('Erreur lors du chargement du GIF ASCII:', error);
      // Affiche un message d'erreur stylisé si le fichier n'est pas trouvé
      const asciiGifElement = document.getElementById('asciiGif');
      if (asciiGifElement) {
        asciiGifElement.textContent = "GIF ASCII\n(erreur de chargement)";
        asciiGifElement.style.color = "rgba(255, 100, 100, 0.8)";
      }
    });

      fetch('ascii-manon.txt') // Chemin vers ton fichier ASCII (à placer dans le même dossier)
    .then(response => response.text())
    .then(text => {
      const asciiPortraitElement = document.getElementById('asciiPortrait');
      if (asciiPortraitElement) {
        asciiPortraitElement.textContent = text;
      }
    })
    .catch(error => {
      console.error('Erreur lors du chargement du portrait ASCII:', error);
      const asciiPortraitElement = document.getElementById('asciiPortrait');
      if (asciiPortraitElement) {
        asciiPortraitElement.textContent = "PORTRAIT ASCII\n(erreur de chargement)";
        asciiPortraitElement.style.color = "rgba(255, 100, 100, 0.8)";
      }
    });

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


