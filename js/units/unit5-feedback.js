/* ==========================================================================
   unit5-feedback.js - Unit V: Feedback Amplifiers & Oscillator Circuits
   Covers Feedback Topologies, Barkhausen Criterion, RC Phase Shift,
   Wien Bridge, Tuned LC, and Quartz Crystal Oscillators
   ========================================================================== */

(function() {
  // ---------------------------------------------------------
  // 1. FEEDBACK TOPOLOGIES & STABILITY
  // ---------------------------------------------------------
  const fbState = {
    topology: 'voltage-series', // 'voltage-series', 'voltage-shunt', 'current-series', 'current-shunt'
    openGain: 1000,
    beta: 0.04,
    zinBase: 10, // kOhms
    zoutBase: 5,  // kOhms
    bwBase: 20    // kHz
  };

  function updateFeedbackCalculations() {
    const loopGain = fbState.openGain * fbState.beta;
    const desens = 1 + loopGain;
    const closedGain = fbState.openGain / desens;
    const closedBw = fbState.bwBase * desens;

    let closedZin = 0, closedZout = 0;
    let typeName = '', idealType = '';

    if (fbState.topology === 'voltage-series') {
      typeName = 'Voltage-Series (Series-Shunt)';
      idealType = 'Voltage Amplifier (High Zin, Low Zout)';
      closedZin = fbState.zinBase * desens;
      closedZout = fbState.zoutBase / desens;
    } else if (fbState.topology === 'voltage-shunt') {
      typeName = 'Voltage-Shunt (Shunt-Shunt)';
      idealType = 'Transresistance Amplifier (Low Zin, Low Zout)';
      closedZin = fbState.zinBase / desens;
      closedZout = fbState.zoutBase / desens;
    } else if (fbState.topology === 'current-series') {
      typeName = 'Current-Series (Series-Series)';
      idealType = 'Transconductance Amplifier (High Zin, High Zout)';
      closedZin = fbState.zinBase * desens;
      closedZout = fbState.zoutBase * desens;
    } else {
      typeName = 'Current-Shunt (Shunt-Series)';
      idealType = 'Current Amplifier (Low Zin, High Zout)';
      closedZin = fbState.zinBase / desens;
      closedZout = fbState.zoutBase * desens;
    }

    // Update UI elements
    const gainEl = document.getElementById('fbClosedGainVal');
    const desensEl = document.getElementById('fbDesensVal');
    const zinEl = document.getElementById('fbZinVal');
    const zoutEl = document.getElementById('fbZoutVal');
    const bwEl = document.getElementById('fbBwVal');
    const typeEl = document.getElementById('fbTypeName');

    if (gainEl) gainEl.textContent = closedGain.toFixed(2) + ' V/V (' + (20 * Math.log10(closedGain)).toFixed(1) + ' dB)';
    if (desensEl) desensEl.textContent = desens.toFixed(1) + ' (Gain stabilized by ' + (100 - (100 / desens)).toFixed(1) + '%)';
    if (zinEl) zinEl.textContent = closedZin >= 1000 ? (closedZin / 1000).toFixed(2) + ' MΩ' : closedZin.toFixed(1) + ' kΩ';
    if (zoutEl) zoutEl.textContent = closedZout < 1 ? (closedZout * 1000).toFixed(0) + ' Ω' : closedZout.toFixed(2) + ' kΩ';
    if (bwEl) bwEl.textContent = (closedBw / 1000).toFixed(2) + ' MHz';
    if (typeEl) typeEl.textContent = typeName + ' - ' + idealType;
  }

  const fbSelect = document.getElementById('fbTopologySelect');
  if (fbSelect) {
    fbSelect.addEventListener('change', (e) => {
      fbState.topology = e.target.value;
      updateFeedbackCalculations();
    });
  }

  const betaSlider = document.getElementById('fbBeta');
  if (betaSlider) {
    betaSlider.addEventListener('input', (e) => {
      fbState.beta = parseFloat(e.target.value);
      document.getElementById('fbBetaVal').textContent = fbState.beta.toFixed(3);
      updateFeedbackCalculations();
    });
  }

  updateFeedbackCalculations();

  // ---------------------------------------------------------
  // 2. OSCILLATOR STUDIO & BARKHAUSEN CRITERION
  // ---------------------------------------------------------
  const oscCanvas = document.getElementById('oscillatorCanvas');
  if (oscCanvas) {
    const ctx = oscCanvas.getContext('2d');

    const oscState = {
      type: 'rc-phase', // 'rc-phase', 'wien', 'tuned-lc', 'crystal'
      loopGain: 1.0, // |A*beta|: <1 decays, =1 stable, >1 saturates
      R: 10, // kOhms
      C: 10, // nF
      L: 100, // uH (for LC)
      animFrame: null
    };

    let animId = null;
    let isVisible = true;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resizeOsc() {
      const parent = oscCanvas.parentElement;
      if (!parent) return;
      const dpr = window.devicePixelRatio || 1;
      const w = parent.offsetWidth;
      const h = parent.offsetHeight;
      if (w === 0 || h === 0) return;
      oscCanvas.width = w * dpr;
      oscCanvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawOscilloscope(performance.now());
    }

    window.addEventListener('resize', resizeOsc);
    if ('ResizeObserver' in window && oscCanvas.parentElement) {
      const ro = new ResizeObserver(() => resizeOsc());
      ro.observe(oscCanvas.parentElement);
    }
    resizeOsc();

    function calculateOscFrequency() {
      const { type, R, C, L } = oscState;
      let f0 = 0;
      let minGainReq = 0;
      let phaseDesc = '';

      const rOhms = R * 1e3;
      const cFarads = C * 1e-9;
      const lHenries = L * 1e-6;

      if (type === 'rc-phase') {
        // f0 = 1 / (2 * pi * R * C * sqrt(6))
        f0 = 1 / (2 * Math.PI * rOhms * cFarads * Math.sqrt(6));
        minGainReq = 29; // |Av| >= 29
        phaseDesc = '3 RC ladders (60° each = 180°) + CE Amplifier inversion (180°) = 360°';
      } else if (type === 'wien') {
        // f0 = 1 / (2 * pi * R * C)
        f0 = 1 / (2 * Math.PI * rOhms * cFarads);
        minGainReq = 3; // beta = 1/3 -> |Av| >= 3
        phaseDesc = 'Lead-lag bridge at resonance gives 0° phase shift; Non-inverting amp gives 0°';
      } else if (type === 'tuned-lc') {
        // f0 = 1 / (2 * pi * sqrt(L * C))
        f0 = 1 / (2 * Math.PI * Math.sqrt(lHenries * cFarads));
        minGainReq = 1.5;
        phaseDesc = 'LC Tank circuit resonance circulating reactive power; 180° feedback inversion';
      } else if (type === 'crystal') {
        // Quartz crystal high Q (~100,000) series resonance
        f0 = 4.0e6; // 4.000 MHz nominal
        minGainReq = 1.1;
        phaseDesc = 'Piezoelectric mechanical resonance; series resonant fs and parallel anti-resonant fp';
      }

      const freqEl = document.getElementById('oscFreqVal');
      const condEl = document.getElementById('oscBarkhausenStatus');
      const minGainEl = document.getElementById('oscMinGainVal');
      const phaseEl = document.getElementById('oscPhaseDesc');

      if (freqEl) {
        if (f0 >= 1e6) freqEl.textContent = (f0 / 1e6).toFixed(3) + ' MHz';
        else if (f0 >= 1e3) freqEl.textContent = (f0 / 1e3).toFixed(2) + ' kHz';
        else freqEl.textContent = f0.toFixed(1) + ' Hz';
      }

      if (minGainEl) minGainEl.textContent = `|A| ≥ ${minGainReq}`;
      if (phaseEl) phaseEl.textContent = phaseDesc;

      if (condEl) {
        if (Math.abs(oscState.loopGain - 1.0) < 0.03) {
          condEl.textContent = 'Barkhausen Met: |Aβ| = 1.00 → Sustained Stable Sine Wave';
          condEl.className = 'status-badge sat';
        } else if (oscState.loopGain < 1.0) {
          condEl.textContent = `Barkhausen Not Met: |Aβ| = ${oscState.loopGain.toFixed(2)} < 1 → Damped Oscillation (Decays to Zero)`;
          condEl.className = 'status-badge cutoff';
        } else {
          condEl.textContent = `Barkhausen Exceeded: |Aβ| = ${oscState.loopGain.toFixed(2)} > 1 → Nonlinear Rail Clipping Distortion`;
          condEl.className = 'status-badge triode';
        }
      }

      return { f0, minGainReq };
    }

    function drawOscilloscope(time) {
      const parent = oscCanvas.parentElement;
      if (!parent) return;
      const w = parent.offsetWidth;
      const h = parent.offsetHeight;
      if (w === 0 || h === 0) return;
      ctx.clearRect(0, 0, w, h);

      // Grid
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.lineWidth = 1;
      const divsX = 10;
      const divsY = 6;
      for (let i = 0; i <= divsX; i++) {
        ctx.beginPath();
        ctx.moveTo((i * w) / divsX, 0);
        ctx.lineTo((i * w) / divsX, h);
        ctx.stroke();
      }
      for (let j = 0; j <= divsY; j++) {
        ctx.beginPath();
        ctx.moveTo(0, (j * h) / divsY);
        ctx.lineTo(w, (j * h) / divsY);
        ctx.stroke();
      }

      const centerY = h / 2;
      const maxAmplitude = h * 0.38;

      // Numeric Tick Labels on Center Zero Axis and Voltage levels
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px JetBrains Mono, monospace';
      const vTicks = [
        { frac: 0.85, label: '+10 V' },
        { frac: 0.45, label: '+5 V' },
        { frac: -0.45, label: '-5 V' },
        { frac: -0.85, label: '-10 V' }
      ];
      vTicks.forEach(t => {
        ctx.fillText(t.label, 10, centerY - maxAmplitude * t.frac);
      });
      ctx.fillText('0 V', 10, centerY - 6);

      // Time ticks across X
      const xTicks = [
        { frac: 0.0, label: '0.0 ms', align: 'left' },
        { frac: 0.25, label: '2.5 ms', align: 'center' },
        { frac: 0.5, label: '5.0 ms', align: 'center' },
        { frac: 0.75, label: '7.5 ms', align: 'center' },
        { frac: 1.0, label: '10.0 ms', align: 'right' }
      ];
      xTicks.forEach(t => {
        ctx.textAlign = t.align;
        const xPos = t.align === 'right' ? (w - 6) : (t.align === 'left' ? 44 : t.frac * w);
        ctx.fillText(t.label, xPos, h - 8);
      });
      ctx.textAlign = 'left';

      // Center zero axis
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(w, centerY);
      ctx.stroke();

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.4;
      ctx.beginPath();

      const { loopGain } = oscState;
      const omega = prefersReduced ? 0 : 0.003;
      const tSec = time * omega;

      for (let x = 0; x < w; x++) {
        const theta = (x / w) * Math.PI * 6 + tSec;
        let amp = maxAmplitude;

        if (loopGain < 0.98) {
          const decayFactor = Math.exp(-0.006 * (1 - loopGain) * 200 * (x / w + (time % 2000) * 0.001));
          amp = maxAmplitude * decayFactor;
        } else if (loopGain > 1.02) {
          amp = maxAmplitude * Math.min(2.0, loopGain);
        }

        let yVal = amp * Math.sin(theta);
        if (loopGain > 1.03) {
          yVal = Math.max(-maxAmplitude * 0.95, Math.min(maxAmplitude * 0.95, yVal * 1.5));
        }

        const y = centerY - yVal;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // In-Canvas Legend Box
      const legX = w - 190;
      const legY = 12;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.fillRect(legX, legY, 175, 40);
      ctx.strokeRect(legX, legY, 175, 40);

      ctx.font = '12px JetBrains Mono, monospace';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(legX + 10, legY + 20); ctx.lineTo(legX + 35, legY + 20);
      ctx.stroke();
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText('v_out(t) (Sine)', legX + 44, legY + 24);

      if (isVisible && !prefersReduced) {
        animId = requestAnimationFrame(drawOscilloscope);
      }
    }

    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const wasVisible = isVisible;
          isVisible = entry.isIntersecting;
          if (!wasVisible && isVisible && !prefersReduced) {
            cancelAnimationFrame(animId);
            animId = requestAnimationFrame(drawOscilloscope);
          } else if (!isVisible) {
            cancelAnimationFrame(animId);
          }
        });
      }, { threshold: 0.1 });
      obs.observe(oscCanvas);
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animId);
      } else if (isVisible && !prefersReduced) {
        cancelAnimationFrame(animId);
        animId = requestAnimationFrame(drawOscilloscope);
      }
    });

    animId = requestAnimationFrame(drawOscilloscope);

    // Oscillator Type Radio Switcher
    const oscBtns = document.querySelectorAll('[data-osc-type]');
    oscBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        oscBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        oscState.type = btn.dataset.oscType;
        calculateOscFrequency();
      });
    });

    const loopGainSlider = document.getElementById('oscLoopGain');
    if (loopGainSlider) {
      loopGainSlider.addEventListener('input', (e) => {
        oscState.loopGain = parseFloat(e.target.value);
        document.getElementById('oscLoopGainVal').textContent = oscState.loopGain.toFixed(2);
        calculateOscFrequency();
      });
    }

    const rSlider = document.getElementById('oscR');
    if (rSlider) {
      rSlider.addEventListener('input', (e) => {
        oscState.R = parseFloat(e.target.value);
        document.getElementById('oscRVal').textContent = oscState.R + ' kΩ';
        calculateOscFrequency();
      });
    }

    const cSlider = document.getElementById('oscC');
    if (cSlider) {
      cSlider.addEventListener('input', (e) => {
        oscState.C = parseFloat(e.target.value);
        document.getElementById('oscCVal').textContent = oscState.C + ' nF';
        calculateOscFrequency();
      });
    }

    calculateOscFrequency();
  }
})();
