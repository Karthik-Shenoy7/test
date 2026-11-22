/* ==========================================================================
   unit1-diode-bjt.js - Unit I: Diode Applications & BJT Analysis
   Clippers, Clampers, DC Load Line, Biasing, and Small-Signal re Modeling
   ========================================================================== */

(function() {
  // ---------------------------------------------------------
  // 1. DIODE CLIPPER & CLAMPER OSCILLOSCOPE
  // ---------------------------------------------------------
  const scopeCanvas = document.getElementById('diodeScopeCanvas');
  if (scopeCanvas) {
    const ctx = scopeCanvas.getContext('2d');
    let mode = 'clipper-pos'; // clipper-pos, clipper-neg, clipper-biased, clamper-pos, clamper-neg
    let vm = 10; // Peak amplitude in Volts
    let vbias = 3.0; // Bias DC voltage
    let vd = 0.7; // Diode knee voltage
    let animId = null;
    let isVisible = true;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resizeScope() {
      const parent = scopeCanvas.parentElement;
      if (!parent) return;
      const dpr = window.devicePixelRatio || 1;
      const w = parent.offsetWidth;
      const h = parent.offsetHeight;
      if (w === 0 || h === 0) return;
      scopeCanvas.width = w * dpr;
      scopeCanvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawOscilloscope(performance.now());
    }

    window.addEventListener('resize', resizeScope);
    if ('ResizeObserver' in window && scopeCanvas.parentElement) {
      const ro = new ResizeObserver(() => resizeScope());
      ro.observe(scopeCanvas.parentElement);
    }
    resizeScope();

    function drawOscilloscope(time) {
      const parent = scopeCanvas.parentElement;
      if (!parent) return;
      const w = parent.offsetWidth;
      const h = parent.offsetHeight;
      if (w === 0 || h === 0) return;
      ctx.clearRect(0, 0, w, h);

      const ch1Color = getComputedStyle(document.documentElement).getPropertyValue('--scope-ch1').trim() || '#fbbf24';
      const ch2Color = getComputedStyle(document.documentElement).getPropertyValue('--scope-ch2').trim() || '#38bdf8';

      // A. Graticule / Grid (Phosphor Cyan)
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.lineWidth = 1;
      const divsX = 10;
      const divsY = 8;
      const stepX = w / divsX;
      const stepY = h / divsY;

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

      // Center Axes
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.moveTo(w / 2, 0);
      ctx.lineTo(w / 2, h);
      ctx.stroke();

      const centerY = h / 2;
      const scaleY = (h / 2.8) / 16; // 16V full range
      const omega = prefersReduced ? 0 : 0.003;

      // Numeric Tick Labels on Axes (Volts on Y-axis, ms on X-axis)
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px JetBrains Mono, monospace';
      ctx.textAlign = 'left';
      const yTicks = [12, 8, 4, -4, -8, -12];
      yTicks.forEach(val => {
        const yPos = centerY - val * scaleY;
        if (yPos > 20 && yPos < h - 20) {
          ctx.fillText((val > 0 ? '+' : '') + val + ' V', 8, yPos + 4);
        }
      });
      ctx.fillText('0 V', 8, centerY - 6);

      // X-axis time ticks
      const tTicks = [
        { frac: 0.0, label: '0.0 ms', align: 'left' },
        { frac: 0.25, label: '2.5 ms', align: 'center' },
        { frac: 0.5, label: '5.0 ms', align: 'center' },
        { frac: 0.75, label: '7.5 ms', align: 'center' },
        { frac: 1.0, label: '10.0 ms', align: 'right' }
      ];
      tTicks.forEach(t => {
        ctx.textAlign = t.align;
        const xPos = t.align === 'right' ? (w - 6) : (t.align === 'left' ? 44 : t.frac * w);
        ctx.fillText(t.label, xPos, h - 8);
      });
      ctx.textAlign = 'left';

      // B. Draw Input Waveform (Channel 1 - Yellow Dashed)
      ctx.strokeStyle = ch1Color;
      ctx.lineWidth = 2.0;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        const t = x * 0.02 + time * omega;
        const vin = vm * Math.sin(t);
        const y = centerY - vin * scaleY;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // C. Draw Output Waveform (Channel 2 - Solid Cyan)
      ctx.strokeStyle = ch2Color;
      ctx.lineWidth = 2.4;
      ctx.beginPath();

      for (let x = 0; x < w; x++) {
        const t = x * 0.02 + time * omega;
        const vin = vm * Math.sin(t);
        let vout = vin;

        if (mode === 'clipper-pos') {
          vout = Math.min(vin, vd);
        } else if (mode === 'clipper-neg') {
          vout = Math.max(vin, -vd);
        } else if (mode === 'clipper-biased') {
          vout = Math.min(vin, vbias + vd);
        } else if (mode === 'clamper-pos') {
          vout = vin + (vm - vd);
        } else if (mode === 'clamper-neg') {
          vout = vin - (vm - vd);
        }

        const y = centerY - vout * scaleY;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      if (isVisible && !prefersReduced) {
        animId = requestAnimationFrame(drawOscilloscope);
      }
    }

    // Pause animation when off-screen or tab hidden
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
      obs.observe(scopeCanvas);
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

    // Controls hook
    const modeSelect = document.getElementById('diodeMode');
    if (modeSelect) {
      modeSelect.addEventListener('change', (e) => {
        mode = e.target.value;
      });
    }

    const vmSlider = document.getElementById('diodeVm');
    if (vmSlider) {
      vmSlider.addEventListener('input', (e) => {
        vm = parseFloat(e.target.value);
        const el = document.getElementById('diodeVmVal');
        if (el) el.textContent = vm + ' V';
      });
    }

    const vbiasSlider = document.getElementById('diodeVbias');
    if (vbiasSlider) {
      vbiasSlider.addEventListener('input', (e) => {
        vbias = parseFloat(e.target.value);
        const el = document.getElementById('diodeVbiasVal');
        if (el) el.textContent = vbias + ' V';
      });
    }

    // Presets
    window.setDiodePreset = function(presetMode, pVm, pVb) {
      mode = presetMode;
      vm = pVm;
      vbias = pVb;
      if (modeSelect) modeSelect.value = presetMode;
      if (vmSlider) {
        vmSlider.value = pVm;
        const el = document.getElementById('diodeVmVal');
        if (el) el.textContent = pVm + ' V';
      }
      if (vbiasSlider) {
        vbiasSlider.value = pVb;
        const el = document.getElementById('diodeVbiasVal');
        if (el) el.textContent = pVb + ' V';
      }
    };
  }

  // ---------------------------------------------------------
  // 2. BJT DC LOAD LINE & BIASING ANALYZER
  // ---------------------------------------------------------
  const bjtCanvas = document.getElementById('bjtLoadLineCanvas');
  if (bjtCanvas) {
    const ctx = bjtCanvas.getContext('2d');

    let vcc = 16.0;
    let rb = 330; // kOhms
    let rc = 1.8; // kOhms
    let re = 0.82; // kOhms
    let beta = 120;
    let biasType = 'divider'; // 'fixed', 'emitter', 'divider'

    function resizeBjt() {
      const parent = bjtCanvas.parentElement;
      if (!parent) return;
      const dpr = window.devicePixelRatio || 1;
      const w = parent.offsetWidth;
      const h = parent.offsetHeight;
      if (w === 0 || h === 0) return;
      bjtCanvas.width = w * dpr;
      bjtCanvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      renderBjtLoadLine();
    }

    window.addEventListener('resize', resizeBjt);
    if ('ResizeObserver' in window && bjtCanvas.parentElement) {
      const ro = new ResizeObserver(() => resizeBjt());
      ro.observe(bjtCanvas.parentElement);
    }

    function calculateBjtQPoint() {
      let ibq = 0, icq = 0, vceq = 0;
      const vbe = 0.7;

      if (biasType === 'fixed') {
        ibq = (vcc - vbe) / rb; // mA
        icq = beta * ibq;
        vceq = vcc - icq * rc;
      } else if (biasType === 'emitter') {
        ibq = (vcc - vbe) / (rb + (beta + 1) * re);
        icq = beta * ibq;
        vceq = vcc - icq * (rc + re);
      } else {
        const r1 = 39; // kOhm
        const r2 = 4.7; // kOhm
        const vth = vcc * (r2 / (r1 + r2));
        const rth = (r1 * r2) / (r1 + r2);
        ibq = (vth - vbe) / (rth + (beta + 1) * re);
        icq = beta * ibq;
        vceq = vcc - icq * (rc + re);

        const approxSat = (beta * re) >= (10 * r2);
        const condEl = document.getElementById('bjtApproxCond');
        if (condEl) {
          condEl.textContent = `β·RE = ${(beta * re).toFixed(1)} kΩ ${approxSat ? '≥' : '<'} 10·R2 (${(10 * r2).toFixed(1)} kΩ) → ${approxSat ? 'Approx Valid' : 'Use Exact Analysis'}`;
          condEl.style.color = approxSat ? '#34d399' : '#fbbf24';
        }
      }

      const icsat = vcc / (rc + (biasType === 'fixed' ? 0 : re));
      let region = 'Active';
      if (vceq <= 0.2) {
        region = 'Saturation';
        vceq = 0.2;
        icq = icsat;
      } else if (icq <= 0) {
        region = 'Cut-off';
        icq = 0;
        vceq = vcc;
      }

      const ibEl = document.getElementById('bjtIbqVal');
      const icEl = document.getElementById('bjtIcqVal');
      const vceEl = document.getElementById('bjtVceqVal');
      const regEl = document.getElementById('bjtRegionVal');

      if (ibEl) ibEl.textContent = (ibq * 1000).toFixed(1) + ' µA';
      if (icEl) icEl.textContent = icq.toFixed(2) + ' mA';
      if (vceEl) vceEl.textContent = vceq.toFixed(2) + ' V';
      if (regEl) {
        regEl.textContent = region;
        regEl.className = 'status-badge ' + (region === 'Active' ? 'active-bjt' : (region === 'Saturation' ? 'sat' : 'cutoff'));
      }

      const reSmall = 26 / (icq > 0 ? icq : 0.001); // Ohms
      const reEl = document.getElementById('bjtReVal');
      if (reEl) reEl.textContent = reSmall.toFixed(1) + ' Ω';

      let av = 0;
      if (biasType === 'emitter') {
        av = -(rc * 1000) / (reSmall + re * 1000);
      } else {
        av = -(rc * 1000) / reSmall;
      }
      const avEl = document.getElementById('bjtAvVal');
      if (avEl) avEl.textContent = av.toFixed(1);

      return { ibq, icq, vceq, icsat, region };
    }

    function renderBjtLoadLine() {
      const parent = bjtCanvas.parentElement;
      if (!parent) return;
      const w = parent.offsetWidth;
      const h = parent.offsetHeight;
      if (w === 0 || h === 0) return;
      ctx.clearRect(0, 0, w, h);

      const padLeft = 70, padBottom = 44, padTop = 32, padRight = 36;
      const plotW = w - padLeft - padRight;
      const plotH = h - padTop - padBottom;

      const q = calculateBjtQPoint();

      const maxVce = Math.max(25, vcc * 1.25);
      const maxIc = Math.max(12, q.icsat * 1.35);

      function toScreen(vce, ic) {
        return {
          x: padLeft + (vce / maxVce) * plotW,
          y: padTop + plotH - (ic / maxIc) * plotH
        };
      }

      // Draw Grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 1;
      for (let v = 0; v <= maxVce; v += 5) {
        const pt = toScreen(v, 0);
        ctx.beginPath();
        ctx.moveTo(pt.x, padTop);
        ctx.lineTo(pt.x, padTop + plotH);
        ctx.stroke();
      }
      for (let i = 0; i <= maxIc; i += 2) {
        const pt = toScreen(0, i);
        ctx.beginPath();
        ctx.moveTo(padLeft, pt.y);
        ctx.lineTo(padLeft + plotW, pt.y);
        ctx.stroke();
      }

      // Numeric Tick Labels on X-axis (V_CE)
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px JetBrains Mono, monospace';
      for (let v = 0; v <= maxVce; v += 5) {
        const pt = toScreen(v, 0);
        if (v >= maxVce) {
          ctx.textAlign = 'right';
          ctx.fillText(v + ' V', Math.min(w - 6, pt.x + 8), padTop + plotH + 18);
          ctx.textAlign = 'left';
        } else {
          ctx.fillText(v + ' V', pt.x - 12, padTop + plotH + 18);
        }
      }

      // Numeric Tick Labels on Y-axis (I_C)
      for (let i = 0; i <= maxIc; i += 2) {
        const pt = toScreen(0, i);
        ctx.fillText(i + ' mA', 10, pt.y + 4);
      }

      // Draw Axes
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(padLeft, padTop);
      ctx.lineTo(padLeft, padTop + plotH);
      ctx.lineTo(padLeft + plotW, padTop + plotH);
      ctx.stroke();

      // Axis Titles
      ctx.fillStyle = '#cbd5e1';
      ctx.font = 'bold 12px JetBrains Mono, monospace';
      ctx.fillText('V_CE (V)', padLeft + plotW - 75, padTop + plotH + 36);
      ctx.fillText('I_C (mA)', padLeft - 60, padTop - 12);

      // Draw Family of Characteristic Curves (IB curves)
      const ibSteps = [10, 25, 40, 60, 80, 100]; // uA
      ctx.lineWidth = 2.0;
      ibSteps.forEach(ibVal => {
        const icSatLevel = (beta * ibVal) / 1000;
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.beginPath();
        for (let v = 0; v <= maxVce; v += 0.5) {
          const icCur = icSatLevel * (1 - Math.exp(-v / 0.5)) * (1 + v / 60);
          const pt = toScreen(v, icCur);
          if (v === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();
      });

      // Draw DC Load Line
      const ptA = toScreen(0, q.icsat);
      const ptB = toScreen(vcc, 0);

      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(ptA.x, ptA.y);
      ctx.lineTo(ptB.x, ptB.y);
      ctx.stroke();

      // Annotate End Points
      ctx.fillStyle = '#f43f5e';
      ctx.font = '12px JetBrains Mono, monospace';
      ctx.fillText(`IC(sat) = ${q.icsat.toFixed(1)} mA`, ptA.x + 8, ptA.y + 4);
      ctx.fillText(`VCC = ${vcc} V`, ptB.x - 40, ptB.y - 12);

      // Draw Q-Point
      const ptQ = toScreen(q.vceq, q.icq);
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(ptQ.x, ptQ.y, 6.5, 0, Math.PI * 2);
      ctx.fill();

      // Q-point dashed projection lines
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(ptQ.x, ptQ.y);
      ctx.lineTo(ptQ.x, padTop + plotH);
      ctx.moveTo(ptQ.x, ptQ.y);
      ctx.lineTo(padLeft, ptQ.y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Label Q-Point
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px JetBrains Mono, monospace';
      ctx.fillText(`Q (${q.vceq.toFixed(1)} V, ${q.icq.toFixed(2)} mA)`, ptQ.x + 10, ptQ.y - 12);

      // In-Canvas Legend Box
      const legX = padLeft + plotW - 190;
      const legY = padTop + 10;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.fillRect(legX, legY, 180, 75);
      ctx.strokeRect(legX, legY, 180, 75);

      ctx.font = '12px JetBrains Mono, monospace';

      // Item 1: IB Curves
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.moveTo(legX + 10, legY + 20); ctx.lineTo(legX + 35, legY + 20);
      ctx.stroke();
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText('IB Curves', legX + 44, legY + 24);

      // Item 2: DC Load Line
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(legX + 10, legY + 42); ctx.lineTo(legX + 35, legY + 42);
      ctx.stroke();
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText('DC Load Line', legX + 44, legY + 46);

      // Item 3: Q-Point
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(legX + 22, legY + 62, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText('Q-Point', legX + 44, legY + 66);
    }

    resizeBjt();

    // Event listeners
    const vccSlider = document.getElementById('bjtVcc');
    if (vccSlider) {
      vccSlider.addEventListener('input', (e) => {
        vcc = parseFloat(e.target.value);
        const el = document.getElementById('bjtVccVal');
        if (el) el.textContent = vcc + ' V';
        renderBjtLoadLine();
      });
    }

    const rcSlider = document.getElementById('bjtRc');
    if (rcSlider) {
      rcSlider.addEventListener('input', (e) => {
        rc = parseFloat(e.target.value);
        const el = document.getElementById('bjtRcVal');
        if (el) el.textContent = rc + ' kΩ';
        renderBjtLoadLine();
      });
    }

    const rbSlider = document.getElementById('bjtRb');
    if (rbSlider) {
      rbSlider.addEventListener('input', (e) => {
        rb = parseFloat(e.target.value);
        const el = document.getElementById('bjtRbVal');
        if (el) el.textContent = rb + ' kΩ';
        renderBjtLoadLine();
      });
    }

    const reSlider = document.getElementById('bjtRe');
    if (reSlider) {
      reSlider.addEventListener('input', (e) => {
        re = parseFloat(e.target.value);
        const el = document.getElementById('bjtReValInput');
        if (el) el.textContent = re + ' kΩ';
        renderBjtLoadLine();
      });
    }

    const betaSlider = document.getElementById('bjtBeta');
    if (betaSlider) {
      betaSlider.addEventListener('input', (e) => {
        beta = parseFloat(e.target.value);
        const el = document.getElementById('bjtBetaVal');
        if (el) el.textContent = beta;
        renderBjtLoadLine();
      });
    }

    const biasRadios = document.querySelectorAll('input[name="bjtBias"]');
    biasRadios.forEach(r => {
      r.addEventListener('change', (e) => {
        biasType = e.target.value;
        renderBjtLoadLine();
      });
    });

    window.setBjtPreset = function(pType, pVcc, pRc, pRb, pRe, pBeta) {
      biasType = pType;
      vcc = pVcc;
      rc = pRc;
      rb = pRb;
      re = pRe;
      beta = pBeta;

      biasRadios.forEach(r => { r.checked = (r.value === pType); });
      if (vccSlider) { vccSlider.value = pVcc; const el = document.getElementById('bjtVccVal'); if (el) el.textContent = pVcc + ' V'; }
      if (rcSlider) { rcSlider.value = pRc; const el = document.getElementById('bjtRcVal'); if (el) el.textContent = pRc + ' kΩ'; }
      if (rbSlider) { rbSlider.value = pRb; const el = document.getElementById('bjtRbVal'); if (el) el.textContent = pRb + ' kΩ'; }
      if (reSlider) { reSlider.value = pRe; const el = document.getElementById('bjtReValInput'); if (el) el.textContent = pRe + ' kΩ'; }
      if (betaSlider) { betaSlider.value = pBeta; const el = document.getElementById('bjtBetaVal'); if (el) el.textContent = pBeta; }

      renderBjtLoadLine();
    };
  }
})();
