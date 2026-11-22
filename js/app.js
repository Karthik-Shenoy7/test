/* ==========================================================================
   app.js - Main Application Coordinator & Setup
   Initializes 3D Viewports, TOC Spy, KaTeX rendering, and Navigation
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize 3D Chambers
  if (typeof MOSFET3DChamber !== 'undefined' && document.getElementById('mosfet3dContainer')) {
    window.mosfetChamber = new MOSFET3DChamber('mosfet3dContainer');
  }

  if (typeof BJT3DChamber !== 'undefined' && document.getElementById('bjt3dContainer')) {
    window.bjtChamber = new BJT3DChamber('bjt3dContainer');
  }

  // Camera preset buttons for MOSFET 3D
  document.querySelectorAll('[data-view-mosfet]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-view-mosfet]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (window.mosfetChamber) {
        window.mosfetChamber.setCameraView(btn.dataset.viewMosfet);
      }
    });
  });

  // Camera preset buttons for BJT 3D
  document.querySelectorAll('[data-view-bjt]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-view-bjt]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (window.bjtChamber) {
        window.bjtChamber.setCameraView(btn.dataset.viewBjt);
      }
    });
  });

  // 2. Render all static KaTeX math elements
  function renderAllEquations() {
    if (typeof katex === 'undefined') {
      document.querySelectorAll('.eq[data-tex], .eq-inline[data-tex]').forEach(function(el) {
        var tex = el.getAttribute('data-tex');
        if (tex && !el.querySelector('.katex')) {
          el.textContent = tex;
          el.className += ' tex-raw-fallback';
        }
      });
      return;
    }

    document.querySelectorAll('.eq[data-tex]').forEach(el => {
      const tex = el.getAttribute('data-tex');
      try {
        katex.render(tex, el, {
          displayMode: true,
          throwOnError: false
        });
      } catch (err) {
        console.warn('KaTeX render error:', err);
      }
    });

    document.querySelectorAll('.eq-inline[data-tex]').forEach(el => {
      const tex = el.getAttribute('data-tex');
      try {
        katex.render(tex, el, {
          displayMode: false,
          throwOnError: false
        });
      } catch (err) {
        console.warn('KaTeX render error:', err);
      }
    });


  }
  window.renderAllMath = renderAllEquations;

  // Try rendering immediately or on KaTeX load
  if (typeof katex !== 'undefined') {
    renderAllEquations();
  } else {
    window.addEventListener('load', renderAllEquations);
  }

  // 3. Scroll Spy for Sidebar Table of Contents
  const sections = document.querySelectorAll('.lab-sec');
  const navLinks = document.querySelectorAll('.pl-toc li a');

  function updateActiveToc() {
    const scrollPos = window.scrollY + 120;
    let currentId = '';

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      if (href === currentId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveToc, { passive: true });
  updateActiveToc();

  // 4. Mobile nav hamburger toggle
  const hamburger = document.getElementById('navHamburger');
  const drawer    = document.getElementById('navDrawer');
  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => {
      const open = drawer.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    // Close drawer when any link inside it is clicked
    drawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        drawer.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
    // Close on Escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        drawer.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        hamburger.focus();
      }
    });
  }


  // 4b. Nav Dropdown keyboard accessibility
  function initNavDropdowns() {
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    dropdowns.forEach(dd => {
      const btn = dd.querySelector('.nav-dropdown-btn');
      const menu = dd.querySelector('.nav-dropdown-menu');
      if (!btn || !menu) return;

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = dd.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(open));
        if (open) {
          const first = menu.querySelector('a');
          if (first) first.focus();
        }
      });

      btn.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          dd.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
          const first = menu.querySelector('a');
          if (first) first.focus();
        }
      });

      menu.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          dd.classList.remove('open');
          btn.setAttribute('aria-expanded', 'false');
          btn.focus();
        }
      });
    });

    document.addEventListener('click', (e) => {
      dropdowns.forEach(dd => {
        if (!dd.contains(e.target)) {
          dd.classList.remove('open');
          const btn = dd.querySelector('.nav-dropdown-btn');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        }
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        dropdowns.forEach(dd => {
          if (dd.classList.contains('open')) {
            dd.classList.remove('open');
            const btn = dd.querySelector('.nav-dropdown-btn');
            if (btn) {
              btn.setAttribute('aria-expanded', 'false');
              btn.focus();
            }
          }
        });
      }
    });
  }
  initNavDropdowns();

  // 5. Circuit Analysis Studio
  if (typeof CircuitStudio !== 'undefined' && (document.getElementById('circuitPickerGrid') || document.getElementById('circuitPickerNav'))) {
    window.circuitStudio = new CircuitStudio();
  }

  // 6. BJT Formula Reference
  if (typeof FormulasPage !== 'undefined' && document.getElementById('formulasTableContainer')) {
    window.formulasPage = new FormulasPage();
  }

  // 7. Accessible Click-to-Zoom Lightbox for Course PDF Slide Photos
  function initSlideLightbox() {
    const slideImgs = document.querySelectorAll('.slide-photo-img');
    if (!slideImgs.length) return;

    let lightbox = document.getElementById('slideLightbox');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.id = 'slideLightbox';
      lightbox.className = 'lightbox-modal';
      lightbox.setAttribute('role', 'dialog');
      lightbox.setAttribute('aria-modal', 'true');
      lightbox.setAttribute('aria-label', 'Course slide photograph zoom');
      lightbox.innerHTML = `
        <div class="lightbox-content">
          <button type="button" class="lightbox-close-btn" id="lightboxCloseBtn" aria-label="Close zoomed image">Close (Esc)</button>
          <img id="lightboxImg" src="" alt="Zoomed slide photograph">
        </div>
      `;
      document.body.appendChild(lightbox);
    }

    const lightboxImg = document.getElementById('lightboxImg');
    const closeBtn = document.getElementById('lightboxCloseBtn');
    let lastActiveElement = null;

    function openLightbox(img) {
      lastActiveElement = document.activeElement;
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || 'Zoomed slide photograph';
      lightbox.classList.add('open');
      closeBtn.focus();
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      if (!lightbox.classList.contains('open')) return;
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
      if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
        lastActiveElement.focus();
      }
    }

    slideImgs.forEach(img => {
      img.setAttribute('tabindex', '0');
      img.setAttribute('role', 'button');
      img.setAttribute('aria-label', (img.alt || 'Slide image') + ' - Click to zoom');
      img.addEventListener('click', () => openLightbox(img));
      img.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(img);
        }
      });
    });

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) {
        closeLightbox();
      }
    });
  }
  initSlideLightbox();
});

window.launchCircuit = function(circuitId, branchId) {
  if (window.circuitStudio) {
    window.circuitStudio.selectCircuit(circuitId);
  } else {
    window.location.href = `studio.html?circuit=${encodeURIComponent(circuitId)}#circuit-studio`;
  }
};

window.setMosDeviceType = function(type) {
  const btnN = document.getElementById('btnNmos');
  const btnP = document.getElementById('btnPmos');
  if (btnN && btnP) {
    if (type === 'nmos') {
      btnN.classList.add('active');
      btnP.classList.remove('active');
    } else {
      btnP.classList.add('active');
      btnN.classList.remove('active');
    }
  }
  if (window.mosfetChamber) {
    window.mosfetChamber.setDeviceType(type);
  }
};


// - Hero Diode Clipper Live Scope -
(function initHeroScope() {
  const canvas = document.getElementById('heroScopeCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animId = null;
  let isVisible = true;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    const parent = canvas.parentElement;
    if (!parent) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = parent.offsetWidth * dpr;
    canvas.height = parent.offsetHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  window.addEventListener('resize', resize);
  resize();

  const ch1Color = getComputedStyle(document.documentElement).getPropertyValue('--scope-ch1').trim() || '#fbbf24';
  const ch2Color = getComputedStyle(document.documentElement).getPropertyValue('--scope-ch2').trim() || '#38bdf8';

  function draw(time) {
    const parent = canvas.parentElement;
    if (!parent) return;
    const w = parent.offsetWidth;
    const h = parent.offsetHeight;
    if (w === 0 || h === 0) return;

    ctx.clearRect(0, 0, w, h);

    // Graticule
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
    ctx.lineWidth = 1;
    const divsX = 10, divsY = 8;
    const stepX = w / divsX, stepY = h / divsY;

    for (let i = 0; i <= divsX; i++) {
      ctx.beginPath();
      ctx.moveTo(i * stepX, 0);
      ctx.lineTo(i * stepX, h);
      ctx.stroke();
    }
    for (let j = 0; j <= divsY; j++) {
      ctx.beginPath();
      ctx.moveTo(0, j * stepY);
      ctx.lineTo(w, j * stepY);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
    ctx.beginPath();
    ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2);
    ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h);
    ctx.stroke();

    const centerY = h / 2;
    const scaleY = (h / 2.6) / 10;
    const omega = prefersReduced ? 0 : 0.003;
    const vm = 8;
    const vd = 0.7;

    // CH1 - Vin (dashed)
    ctx.strokeStyle = ch1Color;
    ctx.lineWidth = 1.6;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    for (let x = 0; x < w; x++) {
      const t = x * 0.02 + time * omega;
      const vin = vm * Math.sin(t);
      const y = centerY - vin * scaleY;
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // CH2 - Vout (clipped)
    ctx.strokeStyle = ch2Color;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    for (let x = 0; x < w; x++) {
      const t = x * 0.02 + time * omega;
      const vin = vm * Math.sin(t);
      const vout = Math.min(vin, vd);
      const y = centerY - vout * scaleY;
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();

    if (isVisible && !prefersReduced) {
      animId = requestAnimationFrame(draw);
    }
  }

  // Pause when offscreen
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
        if (isVisible && !prefersReduced) {
          cancelAnimationFrame(animId);
          animId = requestAnimationFrame(draw);
        } else {
          cancelAnimationFrame(animId);
        }
      });
    }, { threshold: 0.1 });
    observer.observe(canvas);
  }

  animId = requestAnimationFrame(draw);
})();


// Theme switcher: Dark (default) / Light with localStorage persistence
(function() {
  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    document.querySelectorAll('#themeToggleBtn, .theme-toggle-btn').forEach(btn => {
      btn.textContent = theme === 'light' ? 'Light' : 'Dark';
    });
  }

  function initTheme() {
    const saved = localStorage.getItem('theme') || 'dark';
    applyTheme(saved);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', next);
    applyTheme(next);
  }

  document.addEventListener('DOMContentLoaded', initTheme);
  initTheme();

  document.addEventListener('click', (e) => {
    if (e.target && (e.target.id === 'themeToggleBtn' || e.target.classList.contains('theme-toggle-btn'))) {
      e.preventDefault();
      toggleTheme();
    }
  });
})();
