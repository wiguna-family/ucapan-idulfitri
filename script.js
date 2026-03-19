/* ============================================
   Idul Fitri Landing Page - Main Script
   Features: Particles, Confetti, Beduk, Audio,
             Parallax, Scroll Reveal, WhatsApp Share
   ============================================ */

// =============================================
// CONFIG — Ubah nama pengirim di sini
// =============================================
const SENDER_NAME = "Keluarga Besar Wiguna Family";
const SHARE_MESSAGE = `Selamat Hari Raya Idul Fitri 1447 H! 🌙✨\nMohon Maaf Lahir dan Batin.\n\nDari: ${SENDER_NAME}`;

// =============================================
// INITIALIZATION
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    // Set sender name in the message card
    const senderEl = document.getElementById('sender-name');
    if (senderEl) senderEl.textContent = SENDER_NAME;

    // Init all modules
    initAOS();
    initParticles();
    initConfetti();
    initBeduk();
    initAudioPlayer();
    initParallax();
    initWhatsAppShare();
});

// =============================================
// AOS (Animate On Scroll) Initialization
// =============================================
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 80,
        });
    }
}

// =============================================
// STAR PARTICLES (Canvas)
// =============================================
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let stars = [];
    const STAR_COUNT = 120;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createStars() {
        stars = [];
        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.8 + 0.2,
                twinkleSpeed: Math.random() * 0.02 + 0.005,
                twinkleDir: Math.random() > 0.5 ? 1 : -1,
                fallSpeed: Math.random() * 0.15 + 0.02,
                // Some stars are golden, most are white
                color: Math.random() > 0.8
                    ? `rgba(212, 168, 67, `    // gold
                    : `rgba(255, 255, 255, `,  // white
            });
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        stars.forEach(s => {
            // Twinkle
            s.opacity += s.twinkleSpeed * s.twinkleDir;
            if (s.opacity >= 1) { s.opacity = 1; s.twinkleDir = -1; }
            if (s.opacity <= 0.15) { s.opacity = 0.15; s.twinkleDir = 1; }

            // Slow fall
            s.y += s.fallSpeed;
            if (s.y > canvas.height + 5) {
                s.y = -5;
                s.x = Math.random() * canvas.width;
            }

            // Draw
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
            ctx.fillStyle = s.color + s.opacity.toFixed(2) + ')';
            ctx.fill();

            // Add glow to bigger stars
            if (s.radius > 1.5) {
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.radius * 3, 0, Math.PI * 2);
                ctx.fillStyle = s.color + (s.opacity * 0.15).toFixed(2) + ')';
                ctx.fill();
            }
        });

        requestAnimationFrame(animate);
    }

    resize();
    createStars();
    animate();

    window.addEventListener('resize', () => {
        resize();
        createStars();
    });
}

// =============================================
// CONFETTI BURST (on first load)
// =============================================
function initConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const COLORS = ['#d4a843', '#f0d27a', '#ffd700', '#0d7a3e', '#2ecc71', '#ffffff', '#e74c3c'];
    const PARTICLE_COUNT = 100;
    let particles = [];
    let animationId;
    let startTime = Date.now();

    // Create confetti particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
            x: canvas.width / 2 + (Math.random() - 0.5) * 200,
            y: canvas.height / 2,
            vx: (Math.random() - 0.5) * 12,
            vy: (Math.random() - 0.8) * 15 - 5,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            size: Math.random() * 8 + 3,
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 10,
            gravity: 0.15,
            opacity: 1,
            shape: Math.random() > 0.5 ? 'rect' : 'circle',
        });
    }

    function animateConfetti() {
        const elapsed = Date.now() - startTime;

        // Fade out after 2.5 seconds, remove canvas after 4s
        if (elapsed > 4000) {
            cancelAnimationFrame(animationId);
            canvas.style.display = 'none';
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.x += p.vx;
            p.vy += p.gravity;
            p.y += p.vy;
            p.rotation += p.rotSpeed;
            p.vx *= 0.99;

            // Fade out
            if (elapsed > 2500) {
                p.opacity -= 0.02;
                if (p.opacity < 0) p.opacity = 0;
            }

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.globalAlpha = p.opacity;
            ctx.fillStyle = p.color;

            if (p.shape === 'rect') {
                ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
            } else {
                ctx.beginPath();
                ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        });

        animationId = requestAnimationFrame(animateConfetti);
    }

    // Small delay so user sees the burst
    setTimeout(() => animateConfetti(), 300);
}

// =============================================
// BEDUK (Drum) Interaction
// =============================================
function initBeduk() {
    const container = document.getElementById('beduk-container');
    const ripple = document.getElementById('beduk-ripple');
    const counterEl = document.getElementById('beduk-counter');
    if (!container) return;

    let hitCount = 0;

    // Create a synthesized beduk sound using Web Audio API
    function playBedukSound() {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

            // Deep bass hit
            const osc1 = audioCtx.createOscillator();
            const gain1 = audioCtx.createGain();
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(80, audioCtx.currentTime);
            osc1.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.3);
            gain1.gain.setValueAtTime(0.8, audioCtx.currentTime);
            gain1.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
            osc1.connect(gain1);
            gain1.connect(audioCtx.destination);
            osc1.start();
            osc1.stop(audioCtx.currentTime + 0.5);

            // Impact noise
            const osc2 = audioCtx.createOscillator();
            const gain2 = audioCtx.createGain();
            osc2.type = 'triangle';
            osc2.frequency.setValueAtTime(150, audioCtx.currentTime);
            osc2.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.15);
            gain2.gain.setValueAtTime(0.4, audioCtx.currentTime);
            gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
            osc2.connect(gain2);
            gain2.connect(audioCtx.destination);
            osc2.start();
            osc2.stop(audioCtx.currentTime + 0.2);

            // Low resonance
            const osc3 = audioCtx.createOscillator();
            const gain3 = audioCtx.createGain();
            osc3.type = 'sine';
            osc3.frequency.setValueAtTime(55, audioCtx.currentTime);
            gain3.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gain3.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
            osc3.connect(gain3);
            gain3.connect(audioCtx.destination);
            osc3.start();
            osc3.stop(audioCtx.currentTime + 0.8);
        } catch (e) {
            console.warn('Audio not supported:', e);
        }
    }

    container.addEventListener('click', () => {
        // Play sound
        playBedukSound();

        // Bounce animation
        container.classList.remove('hit');
        // Trigger reflow
        void container.offsetWidth;
        container.classList.add('hit');

        // Ripple effect
        ripple.classList.remove('animate');
        void ripple.offsetWidth;
        ripple.classList.add('animate');

        // Update counter
        hitCount++;
        if (counterEl) {
            if (hitCount === 1) {
                counterEl.textContent = `Takbir! 🎉`;
            } else {
                counterEl.textContent = `Allahu Akbar! x${hitCount} 🎉`;
            }
        }
    });
}

// =============================================
// TAKBIRAN AUDIO PLAYER
// Menggunakan audio takbiran asli (MP3)
// =============================================
function initAudioPlayer() {
    const toggleBtn = document.getElementById('audio-toggle');
    if (!toggleBtn) return;

    // Audio takbiran dari sumber publik
    // Ganti URL di bawah ini dengan file takbiran MP3 milik Anda sendiri jika diperlukan
    const TAKBIRAN_URL = 'https://blog-static.mamikos.com/wp-content/uploads/2023/03/Download-MP3-Takbiran-1.mp3';

    const audio = new Audio(TAKBIRAN_URL);
    audio.loop = true;       // Loop otomatis
    audio.volume = 0.7;      // Volume default 70%
    audio.preload = 'auto';  // Preload audio

    let isPlaying = false;

    // Coba auto-play (kebanyakan browser akan blokir, tapi tombol tetap tersedia)
    audio.play().then(() => {
        isPlaying = true;
        toggleBtn.textContent = '🔊';
        toggleBtn.classList.add('playing');
        toggleBtn.title = 'Pause Takbiran';
    }).catch(() => {
        // Browser memblokir autoplay — user harus klik tombol
        isPlaying = false;
        toggleBtn.textContent = '🔇';
        toggleBtn.title = 'Klik untuk memutar Takbiran';
    });

    toggleBtn.addEventListener('click', () => {
        if (isPlaying) {
            // Pause
            audio.pause();
            isPlaying = false;
            toggleBtn.textContent = '🔇';
            toggleBtn.classList.remove('playing');
            toggleBtn.title = 'Play Takbiran';
        } else {
            // Play
            audio.play().then(() => {
                isPlaying = true;
                toggleBtn.textContent = '🔊';
                toggleBtn.classList.add('playing');
                toggleBtn.title = 'Pause Takbiran';
            }).catch(err => {
                console.warn('Gagal memutar audio:', err);
            });
        }
    });

    // Tampilkan error jika audio gagal dimuat
    audio.addEventListener('error', () => {
        console.warn('Audio takbiran gagal dimuat. Pastikan URL audio valid.');
        toggleBtn.title = 'Audio tidak tersedia';
    });
}

// =============================================
// PARALLAX EFFECT (Hero)
// =============================================
function initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax-hero');
    if (!parallaxElements.length) return;

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        parallaxElements.forEach(el => {
            const speed = parseFloat(el.dataset.speed) || 0.03;
            el.style.transform = `translateY(${scrollY * speed * 100}px)`;
        });
    }, { passive: true });
}

// =============================================
// WHATSAPP SHARE
// =============================================
function initWhatsAppShare() {
    const shareBtn = document.getElementById('share-wa');
    if (!shareBtn) return;

    const waText = encodeURIComponent(SHARE_MESSAGE);
    shareBtn.href = `https://wa.me/?text=${waText}`;
}
