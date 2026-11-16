/* ================================================================
   BIRTHDAY UWU — MAIN JAVASCRIPT & SEAMLESS SPA ROUTER
   ----------------------------------------------------------------
   Fitur Utama:
   1. Persistent Continuous Background Music (TIDAK AKAN MATI / PUTUS)
   2. Seamless SPA Page Transition (Tanpa Reload Browser)
   3. Her Little Note (Modal Catatan Tersimpan di LocalStorage)
   4. Global Interactive Click Heart Burst
   5. Floating Hearts & Ambient Particles
   6. Polaroid Gallery Slideshow (Swipe, Tap, Keyboard, Mini Hearts)
   7. Hanging Photo Lightbox, Reasons Search & Auto-Scroll
   8. Birthday Letter Typewriter, Canvas Confetti & Love Reaction Toast
================================================================= */

(function () {
  'use strict';

  /* ================================================================
     1. PERSISTENT BACKGROUND MUSIC (Zero Interruption)
  ================================================================= */
  const MUSIC_STORAGE_KEY = 'bgMusicState';

  let bgMusic = document.getElementById('bgMusic');
  if (!bgMusic) {
    bgMusic = document.createElement('audio');
    bgMusic.id = 'bgMusic';
    bgMusic.loop = true;
    bgMusic.preload = 'auto';
    const source = document.createElement('source');
    source.src = 'assets/music.mp3';
    source.type = 'audio/mpeg';
    bgMusic.appendChild(source);
    document.body.appendChild(bgMusic);
  }

  let musicBtn = document.getElementById('musicBtn');
  if (!musicBtn) {
    musicBtn = document.createElement('button');
    musicBtn.id = 'musicBtn';
    musicBtn.className = 'music-btn';
    musicBtn.setAttribute('aria-label', 'play music');
    musicBtn.title = 'Play our song 🎵';
    musicBtn.innerHTML = '<span class="music-icon">🎵</span>';
    document.body.appendChild(musicBtn);
  }

  const musicIcon = musicBtn.querySelector('.music-icon');
  let noteInterval = null;

  function spawnMusicNote() {
    const notes = ['🎵', '🎶', '💫', '✨', '💖'];
    const note = document.createElement('span');
    note.className = 'music-note';
    note.textContent = notes[Math.floor(Math.random() * notes.length)];
    note.style.setProperty('--drift', (Math.random() * 50 - 25) + 'px');
    musicBtn.appendChild(note);
    setTimeout(() => note.remove(), 1500);
  }

  function setMusicUI(isPlaying) {
    musicBtn.classList.toggle('playing', isPlaying);
    musicIcon.textContent = isPlaying ? '🎶' : '🎵';
    clearInterval(noteInterval);
    if (isPlaying) noteInterval = setInterval(spawnMusicNote, 600);
  }

  function saveMusicState() {
    sessionStorage.setItem(MUSIC_STORAGE_KEY, JSON.stringify({
      playing: !bgMusic.paused,
      time: bgMusic.currentTime || 0
    }));
  }

  const savedMusicState = JSON.parse(sessionStorage.getItem(MUSIC_STORAGE_KEY) || 'null');

  function resumeMusic() {
    if (!savedMusicState || !savedMusicState.playing) return;
    bgMusic.currentTime = savedMusicState.time || 0;
    bgMusic.play().then(() => {
      setMusicUI(true);
    }).catch(() => {
      setMusicUI(false);
    });
  }

  if (savedMusicState) {
    if (bgMusic.readyState >= 1) {
      resumeMusic();
    } else {
      bgMusic.addEventListener('loadedmetadata', resumeMusic, { once: true });
    }
  }

  musicBtn.addEventListener('click', () => {
    if (bgMusic.paused) {
      bgMusic.play().then(() => {
        setMusicUI(true);
      }).catch(() => {});
    } else {
      bgMusic.pause();
      setMusicUI(false);
    }
    saveMusicState();
  });

  bgMusic.addEventListener('timeupdate', () => {
    if (!bgMusic.paused) saveMusicState();
  });

  window.addEventListener('beforeunload', saveMusicState);

  /* ================================================================
     2. GLOBAL INTERACTIVE CLICK HEART BURST
  ================================================================= */
  const burstHearts = ['💖', '💕', '✨', '🩷', '💙', '🌸', '💫'];
  document.addEventListener('pointerdown', (e) => {
    if (e.target.closest('input') || e.target.closest('textarea') || e.target.closest('button')) return;
    const count = 3;
    for (let i = 0; i < count; i++) {
      const heart = document.createElement('div');
      heart.className = 'burst-heart';
      heart.textContent = burstHearts[Math.floor(Math.random() * burstHearts.length)];
      heart.style.left = e.clientX + 'px';
      heart.style.top = e.clientY + 'px';
      heart.style.fontSize = (16 + Math.random() * 12) + 'px';
      heart.style.setProperty('--dx', (Math.random() * 80 - 40) + 'px');
      heart.style.setProperty('--rot', (Math.random() * 60 - 30) + 'deg');
      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 1000);
    }
  });

  /* ================================================================
     3. HER LITTLE NOTE — Persistent Note Modal
  ================================================================= */
  const NOTE_STORAGE_KEY = 'gfNoteContent';

  let noteBtn = document.getElementById('noteBtn');
  if (!noteBtn) {
    noteBtn = document.createElement('button');
    noteBtn.id = 'noteBtn';
    noteBtn.className = 'note-btn';
    noteBtn.setAttribute('aria-label', 'write a little note');
    noteBtn.title = 'Tulis catatan kecil 💌';
    noteBtn.innerHTML = '<span class="note-icon">📝</span>';
    document.body.appendChild(noteBtn);
  }

  let noteOverlay = document.getElementById('noteOverlay');
  if (!noteOverlay) {
    noteOverlay = document.createElement('div');
    noteOverlay.id = 'noteOverlay';
    noteOverlay.className = 'note-overlay';
    noteOverlay.innerHTML = `
      <div class="note-paper" id="notePaper">
        <button class="note-close" id="noteClose" aria-label="close note">✕</button>
        <h3 class="note-title">just for you to fill in 💌</h3>
        <p class="note-hint">Tulis apa aja yang mau kamu sampaikan, harapan, atau wishlist kita ke depannya~ ✨</p>
        <textarea id="noteTextarea" class="note-textarea" placeholder="Dear... aku mau bilang..."></textarea>
        <span class="note-saved" id="noteSaved">Saved ✓</span>
      </div>
    `;
    document.body.appendChild(noteOverlay);
  }

  const noteTextarea = document.getElementById('noteTextarea');
  const noteClose = document.getElementById('noteClose');
  const noteSavedTag = document.getElementById('noteSaved');

  if (noteTextarea) {
    noteTextarea.value = localStorage.getItem(NOTE_STORAGE_KEY) || '';

    function openNote() {
      noteOverlay.classList.add('open');
      setTimeout(() => noteTextarea.focus(), 200);
    }

    function closeNote() {
      noteOverlay.classList.remove('open');
    }

    noteBtn.addEventListener('click', openNote);
    noteClose.addEventListener('click', closeNote);

    noteOverlay.addEventListener('click', (e) => {
      if (e.target === noteOverlay) closeNote();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && noteOverlay.classList.contains('open')) closeNote();
    });

    let noteSaveTimeout = null;
    noteTextarea.addEventListener('input', () => {
      clearTimeout(noteSaveTimeout);
      noteSavedTag.classList.remove('show');
      noteSaveTimeout = setTimeout(() => {
        localStorage.setItem(NOTE_STORAGE_KEY, noteTextarea.value);
        noteSavedTag.classList.add('show');
        setTimeout(() => noteSavedTag.classList.remove('show'), 1600);
      }, 450);
    });
  }

  /* ================================================================
     4. FLOATING HEARTS & STARS BACKGROUND
  ================================================================= */
  const floatingBg = document.getElementById('floating-bg');
  const floatEmojis = ['💖', '✨', '🩷', '💫', '💙', '💜', '🌸'];

  if (floatingBg && !window._floatyIntervalStarted) {
    window._floatyIntervalStarted = true;
    function spawnFloaty() {
      const el = document.createElement('div');
      el.className = 'floaty';
      el.textContent = floatEmojis[Math.floor(Math.random() * floatEmojis.length)];
      el.style.left = Math.random() * 100 + 'vw';
      el.style.fontSize = (16 + Math.random() * 18) + 'px';
      const duration = 7 + Math.random() * 7;
      el.style.animationDuration = duration + 's';
      floatingBg.appendChild(el);
      setTimeout(() => el.remove(), duration * 1000);
    }
    setInterval(spawnFloaty, 650);
  }

  /* ================================================================
     5. PAGE INITIALIZERS
  ================================================================= */

  // ── A. GALLERY PAGE SLIDESHOW ──────────────────────────────────
  const galleryPhotos = [
    {
      src: "photos/photo1.jpeg",
      caption: "Thank you for being a part of my life... every day with you feels like a gift."
    },
    {
      src: "photos/photo2.jpeg",
      caption: "I hope that on this special day, you are surrounded by happiness and love."
    },
    {
      src: "photos/photo3.jpg",
      caption: "Every laugh, every hug, every little moment with you means the world to me."
    },
    {
      src: "photos/photo4.jpeg",
      caption: "Here's to many more adventures, and memories together, my love."
    }
  ];

  let galleryCleanup = null;

  function initGallery() {
    if (galleryCleanup) {
      galleryCleanup();
      galleryCleanup = null;
    }

    const photoEl = document.getElementById('currentPhoto');
    const captionEl = document.getElementById('currentCaption');
    const counterEl = document.getElementById('counter');
    const polaroidEl = document.getElementById('polaroid');
    const dotsWrap = document.getElementById('dots');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const photoStage = document.getElementById('photoStage');

    if (!photoEl || !polaroidEl) return;

    let currentIndex = 0;
    let isAnimating = false;
    const tilts = ['-3deg', '2deg', '-1.5deg', '3deg'];

    function renderSlide(newIndex) {
      if (isAnimating || newIndex === currentIndex) return;
      isAnimating = true;

      photoEl.classList.add('is-transitioning');
      captionEl.classList.add('is-transitioning');

      setTimeout(() => {
        currentIndex = newIndex;
        const data = galleryPhotos[currentIndex];

        photoEl.src = data.src;
        photoEl.alt = "memory " + (currentIndex + 1);
        captionEl.textContent = data.caption;
        if (counterEl) counterEl.textContent = `photo ${currentIndex + 1} of ${galleryPhotos.length}`;
        polaroidEl.style.setProperty('--tilt', tilts[currentIndex % tilts.length]);

        if (dotsWrap) {
          dotsWrap.querySelectorAll('.dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
          });
        }

        requestAnimationFrame(() => {
          photoEl.classList.remove('is-transitioning');
          captionEl.classList.remove('is-transitioning');
          isAnimating = false;
        });
      }, 400);
    }

    function goNext() {
      renderSlide((currentIndex + 1) % galleryPhotos.length);
    }

    function goPrev() {
      renderSlide((currentIndex - 1 + galleryPhotos.length) % galleryPhotos.length);
    }

    if (nextBtn) nextBtn.addEventListener('click', goNext);
    if (prevBtn) prevBtn.addEventListener('click', goPrev);

    if (dotsWrap) {
      dotsWrap.querySelectorAll('.dot').forEach((dot) => {
        dot.addEventListener('click', () => {
          renderSlide(parseInt(dot.dataset.index, 10));
        });
      });
    }

    function onKeyDown(e) {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    }
    document.addEventListener('keydown', onKeyDown);

    let touchStartX = 0;
    function onTouchStart(e) {
      touchStartX = e.changedTouches[0].screenX;
    }
    function onTouchEnd(e) {
      const touchEndX = e.changedTouches[0].screenX;
      const delta = touchEndX - touchStartX;
      if (Math.abs(delta) > 40) {
        if (delta < 0) goNext();
        else goPrev();
      }
    }

    if (photoStage) {
      photoStage.addEventListener('touchstart', onTouchStart, { passive: true });
      photoStage.addEventListener('touchend', onTouchEnd, { passive: true });
    }

    function onPolaroidClick(e) {
      const rect = polaroidEl.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const heart = document.createElement('span');
      heart.className = 'mini-heart';
      heart.textContent = ['💖', '💕', '✨', '🩷'][Math.floor(Math.random() * 4)];
      heart.style.left = x + 'px';
      heart.style.top = y + 'px';
      polaroidEl.appendChild(heart);

      setTimeout(() => heart.remove(), 1000);
    }
    polaroidEl.addEventListener('click', onPolaroidClick);
    polaroidEl.style.setProperty('--tilt', tilts[0]);

    galleryCleanup = function () {
      document.removeEventListener('keydown', onKeyDown);
      if (photoStage) {
        photoStage.removeEventListener('touchstart', onTouchStart);
        photoStage.removeEventListener('touchend', onTouchEnd);
      }
    };
  }

  // ── B. REASONS PAGE (Lightbox, Search, Auto-scroll) ───────────
  let reasonsInterval = null;
  let reasonsCleanup = null;

  function initReasons() {
    if (reasonsCleanup) {
      reasonsCleanup();
      reasonsCleanup = null;
    }

    const hangPhotos = document.querySelectorAll('.hang-photo img');
    const lightboxOverlay = document.getElementById('lightboxOverlay');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');

    if (lightboxOverlay && lightboxImg) {
      hangPhotos.forEach((img) => {
        img.addEventListener('click', () => {
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt || 'Memories';
          lightboxOverlay.classList.add('open');
        });
      });

      function closeLightbox() {
        lightboxOverlay.classList.remove('open');
      }

      if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

      lightboxOverlay.addEventListener('click', (e) => {
        if (e.target === lightboxOverlay) closeLightbox();
      });

      function onEscape(e) {
        if (e.key === 'Escape' && lightboxOverlay.classList.contains('open')) closeLightbox();
      }
      document.addEventListener('keydown', onEscape);

      reasonsCleanup = function () {
        document.removeEventListener('keydown', onEscape);
        clearInterval(reasonsInterval);
      };
    }

    // Search & Filter
    const reasonSearch = document.getElementById('reasonSearch');
    const reasonsList = document.getElementById('reasonsList');

    if (reasonSearch && reasonsList) {
      reasonSearch.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const items = reasonsList.querySelectorAll('li');
        items.forEach(li => {
          const text = li.textContent.toLowerCase();
          li.style.display = text.includes(query) ? 'flex' : 'none';
        });
      });
    }

    // Heart reaction per reason
    if (reasonsList) {
      reasonsList.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', (e) => {
          li.classList.toggle('loved');
          const heart = document.createElement('span');
          heart.className = 'burst-heart';
          heart.textContent = li.classList.contains('loved') ? '💖' : '🤍';
          heart.style.left = (e.clientX || 200) + 'px';
          heart.style.top = (e.clientY || 200) + 'px';
          heart.style.fontSize = '22px';
          heart.style.setProperty('--dx', '0px');
          heart.style.setProperty('--rot', '0deg');
          document.body.appendChild(heart);
          setTimeout(() => heart.remove(), 800);
        });
      });
    }

    // Continuous Auto-scroll Controller
    const reasonsBox = document.getElementById('reasonsBox');
    const toggleScrollBtn = document.getElementById('toggleScrollBtn');

    if (reasonsBox) {
      let isUserPaused = false;
      let isTempPaused = false;
      let resumeTimer = null;
      let isLooping = false;

      function tempPauseAutoScroll() {
        if (isUserPaused) return;
        isTempPaused = true;
        clearTimeout(resumeTimer);
        resumeTimer = setTimeout(() => {
          isTempPaused = false;
        }, 1500);
      }

      reasonsBox.addEventListener('wheel', tempPauseAutoScroll, { passive: true });
      reasonsBox.addEventListener('touchstart', tempPauseAutoScroll, { passive: true });

      if (toggleScrollBtn) {
        toggleScrollBtn.addEventListener('click', () => {
          isUserPaused = !isUserPaused;
          const icon = toggleScrollBtn.querySelector('.scroll-state-icon');
          const text = toggleScrollBtn.querySelector('.scroll-state-text');
          if (isUserPaused) {
            if (icon) icon.textContent = '▶️';
            if (text) text.textContent = 'Play Scroll';
            toggleScrollBtn.style.opacity = '0.7';
          } else {
            if (icon) icon.textContent = '⏸️';
            if (text) text.textContent = 'Auto Scroll';
            toggleScrollBtn.style.opacity = '1';
            isTempPaused = false;
          }
        });
      }

      function doScroll() {
        if (!isUserPaused && !isTempPaused && !isLooping) {
          const maxScroll = reasonsBox.scrollHeight - reasonsBox.clientHeight;
          if (maxScroll > 5) {
            reasonsBox.scrollTop += 1;
            if (reasonsBox.scrollTop >= maxScroll - 2) {
              isLooping = true;
              setTimeout(() => {
                reasonsBox.scrollTo({ top: 0, behavior: 'smooth' });
                setTimeout(() => {
                  isLooping = false;
                }, 800);
              }, 2200);
            }
          }
        }
      }

      clearInterval(reasonsInterval);
      reasonsInterval = setInterval(doScroll, 30);
    }
  }

  // ── C. LETTER PAGE (Typewriter, Confetti, Toast) ──────────────
  const letterMessage =
`My love,

Happy Anniversary to the most wonderful person I know. I don't think words can fully capture how grateful I am to have you in my life, but I'm going to try anyway.

You make every ordinary day feel special just by being in it. Your smile, your laugh, the way you care about everyone around you... it all makes me fall for you more every single day.

I hope this year brings you every single thing you've been hoping for, and so much more. I promise to be right beside you for all of it — the big moments and the tiny, quiet ones too.

Thank you for being exactly who you are. I love you more than words can say.

Happy Anniversary, my love. Here's to you and our forever. 🎂🥂💖`;

  let typeTimer = null;
  let fireConfettiFn = null;

  function initLetter() {
    clearTimeout(typeTimer);
    const letterEl = document.getElementById('letter-text');
    const skipBtn = document.getElementById('skipTypeBtn');
    let typeIndex = 0;

    function typeWriter() {
      if (!letterEl) return;
      if (typeIndex < letterMessage.length) {
        const chunk = letterMessage.slice(0, typeIndex + 1).replace(/\n/g, '<br>');
        letterEl.innerHTML = chunk + '<span class="cursor"></span>';
        typeIndex++;
        typeTimer = setTimeout(typeWriter, 20);
      } else {
        letterEl.innerHTML = letterMessage.replace(/\n/g, '<br>');
      }
    }

    if (skipBtn && letterEl) {
      skipBtn.style.display = 'inline-flex';
      skipBtn.addEventListener('click', () => {
        clearTimeout(typeTimer);
        typeIndex = letterMessage.length;
        letterEl.innerHTML = letterMessage.replace(/\n/g, '<br>');
        skipBtn.style.display = 'none';
      });
    }

    // Confetti Engine
    const canvas = document.getElementById('confetti-canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      let confettiPieces = [];
      const confettiColors = ['#ff70a6', '#ff9fc7', '#d6ecff', '#a8d8ff', '#e6d9ff', '#ffd4e5', '#ffffff', '#ffd166'];

      function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      function createConfetti() {
        confettiPieces = [];
        const count = 160;
        for (let i = 0; i < count; i++) {
          confettiPieces.push({
            x: Math.random() * canvas.width,
            y: -20 - Math.random() * canvas.height * 0.6,
            size: 7 + Math.random() * 8,
            color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
            speedY: 2.2 + Math.random() * 3.5,
            speedX: (Math.random() - 0.5) * 3,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 8,
            shape: Math.random() > 0.4 ? 'circle' : 'rect'
          });
        }
      }

      let confettiActive = false;
      let confettiFrames = 0;
      const maxConfettiFrames = 300;

      function animateConfetti() {
        if (!confettiActive) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        confettiPieces.forEach(p => {
          p.y += p.speedY;
          p.x += p.speedX;
          p.rotation += p.rotationSpeed;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation * Math.PI / 180);
          ctx.fillStyle = p.color;

          if (p.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
          }
          ctx.restore();
        });

        confettiFrames++;
        if (confettiFrames < maxConfettiFrames) {
          requestAnimationFrame(animateConfetti);
        } else {
          confettiActive = false;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }

      fireConfettiFn = function () {
        createConfetti();
        confettiActive = true;
        confettiFrames = 0;
        animateConfetti();
      };

      const replayBtn = document.getElementById('replayConfettiBtn');
      if (replayBtn) {
        replayBtn.addEventListener('click', fireConfettiFn);
      }
    }

    // Send Love Button & Storm
    const sendLoveBtn = document.getElementById('sendLoveBtn');
    const loveToast = document.getElementById('loveToast');

    if (sendLoveBtn) {
      sendLoveBtn.addEventListener('click', () => {
        if (fireConfettiFn) fireConfettiFn();
        if (loveToast) {
          loveToast.classList.add('show');
          setTimeout(() => loveToast.classList.remove('show'), 3500);
        }
        for (let i = 0; i < 20; i++) {
          setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'burst-heart';
            heart.textContent = burstHearts[Math.floor(Math.random() * burstHearts.length)];
            heart.style.left = (window.innerWidth * 0.2 + Math.random() * window.innerWidth * 0.6) + 'px';
            heart.style.top = (window.innerHeight * 0.4 + Math.random() * window.innerHeight * 0.4) + 'px';
            heart.style.fontSize = (22 + Math.random() * 20) + 'px';
            heart.style.setProperty('--dx', (Math.random() * 140 - 70) + 'px');
            heart.style.setProperty('--rot', (Math.random() * 80 - 40) + 'deg');
            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 1200);
          }, i * 60);
        }
      });
    }

    if (letterEl) {
      setTimeout(() => {
        typeWriter();
        if (fireConfettiFn) fireConfettiFn();
      }, 400);
    }
  }

  // ── D. MASTER INIT DETECTOR ────────────────────────────────────
  function initCurrentPage() {
    if (document.getElementById('gallery')) {
      initGallery();
    } else if (document.getElementById('reasons-page')) {
      initReasons();
    } else if (document.getElementById('letter-page')) {
      initLetter();
    }
  }

  // Expose global initializer functions so gallery.js / reasons.js can safely delegate
  window.initGallery = initGallery;
  window.initReasons = initReasons;
  window.initLetter = initLetter;
  window.initCurrentPage = initCurrentPage;

  // Run initial page setup
  initCurrentPage();

  /* ================================================================
     6. SEAMLESS SPA PAGE NAVIGATION (No Page Reload = Music Never Stops!)
  ================================================================= */
  let isNavigating = false;

  async function navigateTo(url, pushState = true) {
    if (isNavigating) return;
    isNavigating = true;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network error: ' + response.status);
      const html = await response.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Animasi transisi keluar
      document.body.classList.add('blur-out');

      setTimeout(() => {
        // 1. Ganti Title
        document.title = doc.title || document.title;

        // 2. Ganti Active Dot di Navigasi
        const newNav = doc.querySelector('.page-nav');
        const currentNav = document.querySelector('.page-nav');
        if (newNav && currentNav) {
          currentNav.innerHTML = newNav.innerHTML;
        }

        // 3. Ganti Konten Page
        const newPage = doc.querySelector('.page');
        const currentPage = document.querySelector('.page');
        if (newPage && currentPage) {
          currentPage.replaceWith(newPage);
        }

        // 4. Update Footer (ada di letter.html)
        const newFooter = doc.querySelector('footer');
        const currentFooter = document.querySelector('footer');
        if (newFooter) {
          if (currentFooter) currentFooter.replaceWith(newFooter);
          else document.body.appendChild(newFooter);
        } else if (currentFooter) {
          currentFooter.remove();
        }

        // 5. Update Canvas jika ada di halaman target
        const newCanvas = doc.getElementById('confetti-canvas');
        let currentCanvas = document.getElementById('confetti-canvas');
        if (newCanvas && !currentCanvas) {
          const c = document.createElement('canvas');
          c.id = 'confetti-canvas';
          document.body.insertBefore(c, document.body.firstChild);
        }

        // 6. Update URL browser
        if (pushState) {
          history.pushState({ url: url }, '', url);
        }

        // 7. Scroll ke atas
        window.scrollTo({ top: 0, behavior: 'instant' });

        // 8. Re-initialize script halaman baru
        initCurrentPage();

        // 9. Animasi transisi masuk
        document.body.classList.remove('blur-out');
        document.body.classList.remove('blur-in-start');

        isNavigating = false;
      }, 350);

    } catch (err) {
      // Fallback jika dibuka langsung tanpa local server pada browser yang restriktif terhadap file://
      console.warn('SPA Navigation fallback to default navigation:', err);
      saveMusicState();
      window.location.href = url;
    }
  }

  // Intercept semua klik link internal
  document.addEventListener('click', function (e) {
    const link = e.target.closest('a');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('javascript:')) return;

    e.preventDefault();
    navigateTo(href, true);
  });

  // Handle tombol Back / Forward di browser
  window.addEventListener('popstate', (e) => {
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';
    navigateTo(currentFile, false);
  });

  // Initial smooth blur-in removal
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.classList.remove('blur-in-start');
    });
  });

})();
