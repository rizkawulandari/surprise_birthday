/**
 * ============================================================================
 * PROJECT: A LITTLE UNIVERSE FOR YOU
 * An Interactive Romantic Birthday Surprise Website for Mas 🤍
 * Date: November 19, 2026
 *
 * EDITABLE QUICK REFERENCE:
 * 1. Recipient Details: See CONFIG.recipient below
 * 2. Audio Settings: See CONFIG.audio below
 * 3. Photo Gallery: See Section 3 in index.html & assets/images/
 * 4. Letter Content: See Section 4 in index.html
 * 5. Wishes List: See Section 5 in index.html
 * ============================================================================
 */

/* ==========================================================================
   CONFIG & CUSTOMIZATION
   ========================================================================== */
const CONFIG = {
  // Recipient details
  recipient: {
    name: "Mas",
    emoji: "🤍",
    birthdayDate: "19 November 2026",
    tagline: "Tonight, the universe celebrates you."
  },

  // Audio track configuration
  audio: {
    filePath: "assets/audio/birthday-music.mp3",
    fallbackWav: "assets/audio/birthday-music.wav",
    autoFallbackToSynth: true // Uses Web Audio API piano synth if mp3 is missing/blocked
  },

  // Celestial Stars & Meteors
  stars: {
    countMobile: 110,
    countDesktop: 220,
    shootingStarIntervalMs: 4000
  }
};

/* ==========================================================================
   STATE MANAGEMENT
   ========================================================================== */
const STATE = {
  isMusicPlaying: false,
  isEnvelopeOpen: false,
  audioContext: null,
  synthInterval: null,
  confettiTriggered: false
};

/* ==========================================================================
   DOM ELEMENTS
   ========================================================================== */
const DOM = {
  universeCanvas: document.getElementById('universe-canvas'),
  confettiCanvas: document.getElementById('birthday-confetti-canvas'),
  cursorGlow: document.getElementById('cursor-glow'),
  musicToggle: document.getElementById('music-toggle'),
  bgMusic: document.getElementById('bg-music'),
  btnOpenSurprise: document.getElementById('btn-open-surprise'),
  btnBurstStars: document.getElementById('btn-burst-stars'),
  envelopeWrapper: document.getElementById('envelope-wrapper'),
  waxSeal: document.getElementById('wax-seal'),
  letterSheet: document.getElementById('letter-sheet'),
  letterControls: document.getElementById('letter-controls'),
  btnToggleEnvelope: document.getElementById('btn-toggle-envelope'),
  envelopeActionText: document.getElementById('envelope-action-text'),
  btnReplay: document.getElementById('btn-replay'),
  navDots: document.querySelectorAll('.nav-dot'),
  revealItems: document.querySelectorAll('.reveal-item'),
  polaroidCards: document.querySelectorAll('.polaroid-card'),
  photoModal: document.getElementById('photo-modal'),
  modalImg: document.getElementById('modal-img'),
  modalCaption: document.getElementById('modal-caption'),
  modalTag: document.getElementById('modal-tag'),
  modalClose: document.getElementById('modal-close'),
  modalBackdrop: document.querySelector('.modal-backdrop'),
  glowingHeart: document.querySelector('.glowing-heart')
};

/* ==========================================================================
   INITIALIZATION ON DOM LOAD
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initUniverseCanvas();
  initConfettiCanvas();
  initIntersectionObserver();
  initAudioSystem();
  initEnvelopeInteraction();
  initPolaroidModal();
  initSideNavigation();
  initInteractiveParticles();
  initCustomCursor();
  initReplayButton();
  initActionButtons();
});

/* ==========================================================================
   1. UNIVERSE CANVAS: Twinkling Stars, Constellations, & Shooting Meteors
   ========================================================================== */
function initUniverseCanvas() {
  const canvas = DOM.universeCanvas;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let stars = [];
  let shootingStars = [];

  // Star colors: Champagne gold, soft cream, dusty rose, starlight cyan
  const starColors = ['#E9D9B8', '#F5EFE5', '#D9AAB7', '#FFFFFF', '#D1E3FF'];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createStars();
  }

  function createStars() {
    stars = [];
    const count = width < 768 ? CONFIG.stars.countMobile : CONFIG.stars.countDesktop;

    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.8 + 0.4,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        baseAlpha: Math.random() * 0.7 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
        driftSpeedX: (Math.random() - 0.5) * 0.08,
        driftSpeedY: (Math.random() - 0.5) * 0.08
      });
    }
  }

  function addShootingStar() {
    if (document.hidden) return;
    const startX = Math.random() * (width * 0.8) + (width * 0.1);
    const startY = Math.random() * (height * 0.4);
    const length = Math.random() * 120 + 80;
    const speed = Math.random() * 8 + 10;
    const angle = (Math.PI / 4) + (Math.random() * 0.2 - 0.1); // ~45 degrees

    shootingStars.push({
      x: startX,
      y: startY,
      len: length,
      speed: speed,
      dx: Math.cos(angle) * speed,
      dy: Math.sin(angle) * speed,
      alpha: 1,
      life: 1,
      decay: Math.random() * 0.015 + 0.015
    });
  }

  // Shooting star periodic trigger
  setInterval(addShootingStar, CONFIG.stars.shootingStarIntervalMs);
  setTimeout(addShootingStar, 1200);

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Draw faint constellation lines between nearby stars
    ctx.lineWidth = 0.5;
    const maxDist = width < 768 ? 70 : 95;
    for (let i = 0; i < stars.length; i += 2) {
      for (let j = i + 1; j < stars.length; j += 4) {
        const dx = stars[i].x - stars[j].x;
        const dy = stars[i].y - stars[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const lineAlpha = (1 - dist / maxDist) * 0.14 * stars[i].baseAlpha;
          ctx.strokeStyle = `rgba(233, 217, 184, ${lineAlpha})`;
          ctx.beginPath();
          ctx.moveTo(stars[i].x, stars[i].y);
          ctx.lineTo(stars[j].x, stars[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw and update stars
    for (let s of stars) {
      s.twinklePhase += s.twinkleSpeed;
      const alpha = Math.max(0.1, Math.min(1, s.baseAlpha + Math.sin(s.twinklePhase) * 0.35));

      // Gentle starlight drift
      s.x += s.driftSpeedX;
      s.y += s.driftSpeedY;
      if (s.x < 0) s.x = width;
      if (s.x > width) s.x = 0;
      if (s.y < 0) s.y = height;
      if (s.y > height) s.y = 0;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = s.color;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();

      // Subtle golden diffraction spike on bright stars
      if (s.size > 1.6 && alpha > 0.7) {
        ctx.strokeStyle = 'rgba(233, 217, 184, 0.25)';
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(s.x - s.size * 3, s.y);
        ctx.lineTo(s.x + s.size * 3, s.y);
        ctx.moveTo(s.x, s.y - s.size * 3);
        ctx.lineTo(s.x, s.y + s.size * 3);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Draw and update shooting stars
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const ss = shootingStars[i];
      ss.x += ss.dx;
      ss.y += ss.dy;
      ss.life -= ss.decay;

      if (ss.life <= 0) {
        shootingStars.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, ss.life);

      const grad = ctx.createLinearGradient(
        ss.x, ss.y,
        ss.x - ss.dx * (ss.len / ss.speed),
        ss.y - ss.dy * (ss.len / ss.speed)
      );
      grad.addColorStop(0, '#FFFFFF');
      grad.addColorStop(0.3, '#E9D9B8');
      grad.addColorStop(0.7, '#D9AAB7');
      grad.addColorStop(1, 'transparent');

      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(ss.x, ss.y);
      ctx.lineTo(
        ss.x - ss.dx * (ss.len / ss.speed),
        ss.y - ss.dy * (ss.len / ss.speed)
      );
      ctx.stroke();

      // Leading starlight glow head
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(ss.x, ss.y, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
}

/* ==========================================================================
   2. BIRTHDAY CONFETTI & GOLDEN STARDUST CANNON
   Sophisticated champagne gold & dusty rose particles
   ========================================================================== */
let triggerConfettiBurst = null;

function initConfettiCanvas() {
  const canvas = DOM.confettiCanvas;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];

  function resize() {
    const parent = canvas.parentElement;
    width = canvas.width = parent.clientWidth || window.innerWidth;
    height = canvas.height = parent.clientHeight || window.innerHeight;
  }

  const colors = [
    '#E9D9B8', // champagne gold
    '#F7E5B5', // bright gold
    '#D9AAB7', // dusty rose
    '#F5EFE5', // soft cream
    '#D4AF37'  // rich metallic gold
  ];

  function addBurst(count = 45, originX = null, originY = null) {
    const x = originX !== null ? originX : width / 2;
    const y = originY !== null ? originY : height * 0.35;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      const isStar = Math.random() > 0.5;

      particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.5,
        gravity: 0.08,
        friction: 0.98,
        size: Math.random() * 4 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.12,
        life: 1,
        decay: Math.random() * 0.01 + 0.008,
        isStar: isStar
      });
    }
  }

  triggerConfettiBurst = addBurst;

  function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= p.friction;
      p.rotation += p.rotSpeed;
      p.life -= p.decay;

      if (p.life <= 0 || p.y > height + 20) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;

      if (p.isStar) {
        drawStar(ctx, 0, 0, 4, p.size, p.size * 0.4);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  resize();
  loop();
}

/* ==========================================================================
   3. BACKGROUND MUSIC & ROMANTIC PIANO SYNTHESIZER
   Dual Mode: Native Audio + Web Audio API Ambient Romantic Piano Fallback
   ========================================================================== */
function initAudioSystem() {
  const toggleBtn = DOM.musicToggle;
  const audio = DOM.bgMusic;

  let audioUnlocked = false;

  // Initialize Web Audio API Piano Synthesizer as resilient fallback
  function startPianoSynth() {
    if (STATE.synthInterval) return;

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!STATE.audioContext) {
        STATE.audioContext = new AudioCtx();
      }
      if (STATE.audioContext.state === 'suspended') {
        STATE.audioContext.resume();
      }

      // Gentle romantic melody in F Major / D Minor
      // Notes: F3, C4, E4, A4, C5, D5, E5, F5
      const noteFreqs = {
        'F3': 174.61, 'A3': 220.00, 'C4': 261.63, 'D4': 293.66,
        'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00,
        'Bb4': 466.16, 'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46
      };

      const sequence = [
        { note: 'F3', dur: 2.5, gain: 0.3 },
        { note: 'C4', dur: 1.8, gain: 0.2 },
        { note: 'E4', dur: 1.8, gain: 0.2 },
        { note: 'A4', dur: 2.2, gain: 0.25 },
        { note: 'C5', dur: 2.8, gain: 0.28 },
        { note: 'A4', dur: 1.5, gain: 0.2 },
        { note: 'D5', dur: 2.4, gain: 0.26 },
        { note: 'C5', dur: 2.0, gain: 0.22 },
        { note: 'E5', dur: 2.5, gain: 0.28 },
        { note: 'D5', dur: 1.8, gain: 0.2 },
        { note: 'A4', dur: 2.0, gain: 0.22 },
        { note: 'F4', dur: 2.5, gain: 0.25 }
      ];

      let noteIdx = 0;

      function playNextNote() {
        if (!STATE.isMusicPlaying || !STATE.audioContext) return;
        const item = sequence[noteIdx];
        noteIdx = (noteIdx + 1) % sequence.length;

        playPianoTone(noteFreqs[item.note] || 440, item.dur, item.gain);
      }

      STATE.synthInterval = setInterval(playNextNote, 850);
      playNextNote();
    } catch (e) {
      console.warn("Web Audio API not supported in this browser:", e);
    }
  }

  function playPianoTone(freq, duration, peakGain) {
    if (!STATE.audioContext) return;
    const ctx = STATE.audioContext;
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    // Warm second harmonic
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, now);

    // Exponential acoustic decay
    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.linearRampToValueAtTime(peakGain, now + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration + 0.1);
    osc2.stop(now + duration + 0.1);
  }

  function stopPianoSynth() {
    if (STATE.synthInterval) {
      clearInterval(STATE.synthInterval);
      STATE.synthInterval = null;
    }
  }

  // Play music with graceful fallback
  function playMusic() {
    STATE.isMusicPlaying = true;
    toggleBtn.classList.add('playing');
    toggleBtn.setAttribute('title', 'Pause romantic background music');

    if (audio) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.log("Audio file playback blocked or missing, using Web Audio romantic piano synth.", err);
          if (CONFIG.audio.autoFallbackToSynth) {
            startPianoSynth();
          }
        });
      }
    } else if (CONFIG.audio.autoFallbackToSynth) {
      startPianoSynth();
    }
  }

  function pauseMusic() {
    STATE.isMusicPlaying = false;
    toggleBtn.classList.remove('playing');
    toggleBtn.setAttribute('title', 'Play romantic background music');

    if (audio && !audio.paused) {
      audio.pause();
    }
    stopPianoSynth();
  }

  function toggleMusic() {
    if (STATE.isMusicPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleMusic);
  }

  // Hook into window for button trigger
  window.startUniverseMusic = playMusic;
  window.toggleUniverseMusic = toggleMusic;
}

/* ==========================================================================
   4. SECTION 4 — INTERACTIVE 3D ENVELOPE & WAX SEAL
   ========================================================================== */
function initEnvelopeInteraction() {
  const wrapper = DOM.envelopeWrapper;
  const waxSeal = DOM.waxSeal;
  const toggleBtn = DOM.btnToggleEnvelope;
  const controls = DOM.letterControls;
  const actionText = DOM.envelopeActionText;

  if (!wrapper) return;

  function openEnvelope() {
    if (STATE.isEnvelopeOpen) return;
    STATE.isEnvelopeOpen = true;

    wrapper.classList.add('is-open');
    wrapper.setAttribute('aria-expanded', 'true');
    if (controls) controls.classList.remove('hidden');
    if (actionText) actionText.textContent = "Surat telah terbuka 🤍";

    // Little burst of stardust around envelope
    if (triggerConfettiBurst) {
      const rect = wrapper.getBoundingClientRect();
      createSparkleExplosion(rect.left + rect.width / 2, rect.top + 160);
    }
  }

  function closeEnvelope() {
    if (!STATE.isEnvelopeOpen) return;
    STATE.isEnvelopeOpen = false;

    wrapper.classList.remove('is-open');
    wrapper.setAttribute('aria-expanded', 'false');
    if (controls) controls.classList.add('hidden');
    if (actionText) actionText.textContent = "Click the wax seal to open";
  }

  if (waxSeal) {
    waxSeal.addEventListener('click', (e) => {
      e.stopPropagation();
      openEnvelope();
    });
  }

  wrapper.addEventListener('click', () => {
    if (!STATE.isEnvelopeOpen) {
      openEnvelope();
    }
  });

  wrapper.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!STATE.isEnvelopeOpen) openEnvelope();
      else closeEnvelope();
    }
  });

  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeEnvelope();
    });
  }
}

/* ==========================================================================
   5. POLAROID MODAL LIGHTBOX
   ========================================================================== */
function initPolaroidModal() {
  const modal = DOM.photoModal;
  const img = DOM.modalImg;
  const caption = DOM.modalCaption;
  const tag = DOM.modalTag;
  const closeBtn = DOM.modalClose;
  const backdrop = DOM.modalBackdrop;

  if (!modal || !img) return;

  function openModal(photoSrc, captionText, tagText, altText) {
    img.src = photoSrc;
    img.alt = altText || "Enlarged Memory Photo";
    caption.textContent = captionText || "";
    tag.textContent = tagText || "";

    modal.classList.add('is-active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('is-active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  DOM.polaroidCards.forEach(card => {
    card.addEventListener('click', () => {
      const photoSrc = card.getAttribute('data-photo-src');
      const captionText = card.getAttribute('data-caption');
      const tagText = card.getAttribute('data-tag');
      const imgEl = card.querySelector('img');
      const altText = imgEl ? imgEl.alt : "";

      openModal(photoSrc, captionText, tagText, altText);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   6. INTERSECTION OBSERVER: Scroll-triggered Animations & Nav Sync
   ========================================================================== */
function initIntersectionObserver() {
  const sections = document.querySelectorAll('.section');
  const navDots = DOM.navDots;

  // Reveal elements on scroll
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  DOM.revealItems.forEach(item => revealObserver.observe(item));

  // Section observer for updating navigation dots & triggering Section 2 confetti
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;

        // Update nav dots
        navDots.forEach(dot => {
          if (dot.getAttribute('data-target') === id) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        });

        // Trigger stardust burst when entering birthday section for the first time
        if (id === 'section-birthday' && !STATE.confettiTriggered && triggerConfettiBurst) {
          STATE.confettiTriggered = true;
          triggerConfettiBurst(60);
          setTimeout(() => triggerConfettiBurst(35), 700);
        }
      }
    });
  }, {
    threshold: 0.45
  });

  sections.forEach(sec => sectionObserver.observe(sec));
}

/* ==========================================================================
   7. SIDE NAVIGATION & SMOOTH SCROLL
   ========================================================================== */
function initSideNavigation() {
  DOM.navDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const targetId = dot.getAttribute('data-target');
      const targetSec = document.getElementById(targetId);
      if (targetSec) {
        targetSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ==========================================================================
   8. ROMANTIC CLICK PARTICLES & STARDUST EXPLOSIONS
   ========================================================================== */
function initInteractiveParticles() {
  const symbols = ['✦', '✧', '🤍', '✨', '⋆'];

  document.addEventListener('click', (e) => {
    // Avoid spawning directly on buttons or controls if distracting
    const target = e.target;
    if (target.closest('.modal-dialog')) return;

    createClickParticle(e.clientX, e.clientY);
  });

  function createClickParticle(x, y) {
    const p = document.createElement('span');
    p.className = 'click-particle';
    p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    p.style.left = `${x}px`;
    p.style.top = `${y}px`;

    const dx = (Math.random() - 0.5) * 80;
    const dy = (Math.random() - 0.5) * 60 - 30;
    p.style.setProperty('--dx', `${dx}px`);
    p.style.setProperty('--dy', `${dy}px`);

    const colors = ['#E9D9B8', '#D9AAB7', '#F5EFE5', '#FFFFFF'];
    p.style.color = colors[Math.floor(Math.random() * colors.length)];

    document.body.appendChild(p);

    setTimeout(() => {
      if (p.parentNode) p.parentNode.removeChild(p);
    }, 1400);
  }
}

function createSparkleExplosion(x, y) {
  for (let i = 0; i < 18; i++) {
    setTimeout(() => {
      const p = document.createElement('span');
      p.className = 'click-particle';
      p.textContent = Math.random() > 0.5 ? '✦' : '✨';
      p.style.left = `${x}px`;
      p.style.top = `${y}px`;

      const dx = (Math.random() - 0.5) * 160;
      const dy = (Math.random() - 0.5) * 140;
      p.style.setProperty('--dx', `${dx}px`);
      p.style.setProperty('--dy', `${dy}px`);
      p.style.color = '#E9D9B8';

      document.body.appendChild(p);
      setTimeout(() => {
        if (p.parentNode) p.parentNode.removeChild(p);
      }, 1400);
    }, i * 35);
  }
}

/* ==========================================================================
   9. CUSTOM DESKTOP CURSOR GLOW
   ========================================================================== */
function initCustomCursor() {
  const cursor = DOM.cursorGlow;
  if (!cursor) return;

  let mouseX = -100, mouseY = -100;
  let cursorX = -100, cursorY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.opacity = '1';
  });

  window.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  });

  function renderCursor() {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;

    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;

    requestAnimationFrame(renderCursor);
  }

  renderCursor();
}

/* ==========================================================================
   10. BUTTONS & REPLAY EXPERIENCE
   ========================================================================== */
function initActionButtons() {
  // Section 1: "Open Your Little Surprise"
  if (DOM.btnOpenSurprise) {
    DOM.btnOpenSurprise.addEventListener('click', () => {
      // Start music upon romantic user interaction
      if (window.startUniverseMusic) {
        window.startUniverseMusic();
      }

      // Smooth scroll to Section 2
      const targetSec = document.getElementById('section-birthday');
      if (targetSec) {
        targetSec.scrollIntoView({ behavior: 'smooth' });
      }

      // Initial stardust blast
      if (triggerConfettiBurst) {
        setTimeout(() => triggerConfettiBurst(50), 600);
      }
    });
  }

  // Section 2: "Send Birthday Stardust"
  if (DOM.btnBurstStars) {
    DOM.btnBurstStars.addEventListener('click', (e) => {
      const rect = DOM.btnBurstStars.getBoundingClientRect();
      if (triggerConfettiBurst) {
        triggerConfettiBurst(45, rect.left + rect.width / 2, rect.top);
      }
    });
  }

  // Section 6: Glowing heart interaction
  if (DOM.glowingHeart) {
    DOM.glowingHeart.addEventListener('click', (e) => {
      const rect = DOM.glowingHeart.getBoundingClientRect();
      createSparkleExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2);
    });
  }
}

function initReplayButton() {
  const btn = DOM.btnReplay;
  if (!btn) return;

  btn.addEventListener('click', () => {
    // Scroll back to the very beginning
    const firstSec = document.getElementById('section-secret');
    if (firstSec) {
      firstSec.scrollIntoView({ behavior: 'smooth' });
    }

    // Reset confetti trigger so it can re-trigger when scrolling down again
    STATE.confettiTriggered = false;

    // Small stardust celebration
    if (triggerConfettiBurst) {
      setTimeout(() => triggerConfettiBurst(35), 400);
    }
  });
}
