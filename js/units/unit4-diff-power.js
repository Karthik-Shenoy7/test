/* ==========================================================================
   unit4-diff-power.js - Unit IV: Differential Amplifiers, Current Mirrors,
   and Power Output Stages (Class A & Class B Crossover Distortion)
   ========================================================================== */

(function() {
  // ---------------------------------------------------------
  // 1. MOS DIFFERENTIAL PAIR SIMULATOR
  // ---------------------------------------------------------
  const diffCanvas = document.getElementById('diffPairCanvas');
  if (diffCanvas) {
    const ctx = diffCanvas.getContext('2d');

    const state = {
      vid: 0.15, // Differential input (V)
      vcm: 1.2,  // Common mode input (V)
      iss: 1.0,  // Tail current (mA)
      rd: 4.0,   // Drain load (kOhms)
      rss: 50.0, // Tail resistance (kOhms)
      vov: 0.35  // Overdrive voltage (V)
    };

    function resizeDiff() {
      const parent = diffCanvas.parentElement;
      if (!parent) return;
      const dpr = window.devicePixelRatio || 1;
      const w = parent.offsetWidth;
      const h = parent.offsetHeight;
      if (w === 0 || h === 0) return;
      diffCanvas.width = w * dpr;
      diffCanvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      renderDiffPair();
    }

    window.addEventListener('resize', resizeDiff);
    if ('ResizeObserver' in window && diffCanvas.parentElement) {
      const ro = new ResizeObserver(() => resizeDiff());
      ro.observe(diffCanvas.parentElement);
    }

    function calcDiffMetrics() {
      const { vid, iss, rd, rss, vov } = state;

      const gm = iss / vov; // mS
      const adm = gm * rd; // Differential gain
      const acm = (gm * rd) / (1 + 2 * gm * rss); // Common mode gain
      const cmrrDb = 20 * Math.log10(adm / Math.max(1e-4, acm));

      let id1 = iss / 2;
      let id2 = iss / 2;

      const normVid = vid / vov;
      if (Math.abs(normVid) <= Math.SQRT2) {
        const delta = (iss / 2) * normVid * Math.sqrt(Math.max(0, 1 - 0.25 * normVid * normVid));
        id1 = iss / 2 + delta;
        id2 = iss / 2 - delta;
      } else if (normVid > Math.SQRT2) {
        id1 = iss;
        id2 = 0;
      } else {
        id1 = 0;
        id2 = iss;
      }

      const admEl = document.getElementById('diffAdmVal');
      const acmEl = document.getElementById('diffAcmVal');
      const cmrrEl = document.getElementById('diffCmrrVal');
      const id1El = document.getElementById('diffId1Val');
      const id2El = document.getElementById('diffId2Val');

      if (admEl) admEl.textContent = adm.toFixed(2) + ' V/V (' + (20 * Math.log10(adm)).toFixed(1) + ' dB)';
      if (acmEl) acmEl.textContent = acm.toFixed(4) + ' V/V';
      if (cmrrEl) cmrrEl.textContent = cmrrDb.toFixed(1) + ' dB';
      if (id1El) id1El.textContent = id1.toFixed(3) + ' mA';
      if (id2El) id2El.textContent = id2.toFixed(3) + ' mA';

      return { id1, id2, adm, acm, cmrrDb };
    }

    function renderDiffPair() {
      calcDiffMetrics();

      const parent = diffCanvas.parentElement;
      if (!parent) return;
      const w = parent.offsetWidth;
      const h = parent.offsetHeight;
      if (w === 0 || h === 0) return;
      ctx.clearRect(0, 0, w, h);

      const padLeft = 70, padBottom = 44, padTop = 32, padRight = 36;
      const plotW = w - padLeft - padRight;
      const plotH = h - padTop - padBottom;

      const maxVid = 0.8; // +/- 0.8 V
      const maxI = state.iss * 1.25;

      function toScreen(vid, iVal) {
        const x = padLeft + ((vid + maxVid) / (2 * maxVid)) * plotW;
        const y = padTop + plotH - (iVal / maxI) * plotH;
        return { x, y };
      }

      // Grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 1;
      for (let v = -maxVid; v <= maxVid + 0.01; v += 0.2) {
        const pt = toScreen(v, 0);
        ctx.beginPath();
        ctx.moveTo(pt.x, padTop);
        ctx.lineTo(pt.x, padTop + plotH);
        ctx.stroke();
      }
      for (let i = 0; i <= maxI + 0.01; i += 0.25) {
        const pt = toScreen(0, i);
        ctx.beginPath();
        ctx.moveTo(padLeft, pt.y);
        ctx.lineTo(padLeft + plotW, pt.y);
        ctx.stroke();
      }

      // Numeric Tick Labels on X-axis (Vid)
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px JetBrains Mono, monospace';
      for (let v = -maxVid; v <= maxVid + 0.01; v += 0.4) {
        const pt = toScreen(v, 0);
        if (v >= maxVid - 0.05) {
          ctx.textAlign = 'right';
          ctx.fillText((v >= 0 ? '+' : '') + v.toFixed(1) + ' V', Math.min(w - 6, pt.x + 8), padTop + plotH + 18);
          ctx.textAlign = 'left';
        } else {
          ctx.fillText((v >= 0 ? '+' : '') + v.toFixed(1) + ' V', pt.x - 18, padTop + plotH + 18);
        }
      }

      // Numeric Tick Labels on Y-axis (Drain Currents)
      for (let i = 0; i <= maxI + 0.01; i += 0.5) {
        const pt = toScreen(0, i);
        ctx.fillText(i.toFixed(1) + ' mA', 8, pt.y + 4);
      }

      // Center Vertical Axis (Vid = 0)
      const ptZero = toScreen(0, 0);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(ptZero.x, padTop);
      ctx.lineTo(ptZero.x, padTop + plotH);
      ctx.stroke();

      // Horizontal Axis
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(padLeft, padTop + plotH);
      ctx.lineTo(padLeft + plotW, padTop + plotH);
      ctx.stroke();

      // Axis Titles
      ctx.fillStyle = '#cbd5e1';
      ctx.font = 'bold 12px JetBrains Mono, monospace';
      ctx.fillText('v_id = v_in1 - v_in2 (V)', padLeft + plotW - 140, padTop + plotH + 36);
      ctx.fillText('Drain Currents (mA)', padLeft - 60, padTop - 12);

      // Plot ID1 Curve (Cyan)
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      const steps = 100;
      for (let i = 0; i <= steps; i++) {
        const v = -maxVid + (i / steps) * (2 * maxVid);
        const norm = v / state.vov;
        let id1Val = 0;
        if (Math.abs(norm) <= Math.SQRT2) {
          id1Val = state.iss / 2 + (state.iss / 2) * norm * Math.sqrt(Math.max(0, 1 - 0.25 * norm * norm));
        } else if (norm > Math.SQRT2) {
          id1Val = state.iss;
        } else {
          id1Val = 0;
        }
        const pt = toScreen(v, id1Val);
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();

      // Plot ID2 Curve (Amber)
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2.4;
      ctx.setLineDash([6, 3]);
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const v = -maxVid + (i / steps) * (2 * maxVid);
        const norm = v / state.vov;
        let id2Val = 0;
        if (Math.abs(norm) <= Math.SQRT2) {
          id2Val = state.iss / 2 - (state.iss / 2) * norm * Math.sqrt(Math.max(0, 1 - 0.25 * norm * norm));
        } else if (norm > Math.SQRT2) {
          id2Val = 0;
        } else {
          id2Val = state.iss;
        }
        const pt = toScreen(v, id2Val);
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Current Operating Point for ID1 and ID2
      const m = calcDiffMetrics();
      const ptQ1 = toScreen(state.vid, m.id1);
      const ptQ2 = toScreen(state.vid, m.id2);

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(ptQ1.x, ptQ1.y, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(ptQ2.x, ptQ2.y, 6, 0, Math.PI * 2);
      ctx.fill();

      // In-Canvas Legend Box
      const legX = padLeft + 16;
      const legY = padTop + 10;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.fillRect(legX, legY, 170, 60);
      ctx.strokeRect(legX, legY, 170, 60);

      ctx.font = '12px JetBrains Mono, monospace';

      // 1: ID1
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(legX + 10, legY + 20); ctx.lineTo(legX + 35, legY + 20);
      ctx.stroke();
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText('ID1 (M1)', legX + 44, legY + 24);

      // 2: ID2
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2.4;
      ctx.setLineDash([5, 3]);
      ctx.beginPath();
      ctx.moveTo(legX + 10, legY + 42); ctx.lineTo(legX + 35, legY + 42);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText('ID2 (M2)', legX + 44, legY + 46);
    }

    resizeDiff();

    // Event listeners
    const vidSlider = document.getElementById('diffVid');
    if (vidSlider) {
      vidSlider.addEventListener('input', (e) => {
        state.vid = parseFloat(e.target.value);
        const el = document.getElementById('diffVidVal');
        if (el) el.textContent = (state.vid >= 0 ? '+' : '') + state.vid.toFixed(2) + ' V';
        renderDiffPair();
      });
    }

    const issSlider = document.getElementById('diffIss');
    if (issSlider) {
      issSlider.addEventListener('input', (e) => {
        state.iss = parseFloat(e.target.value);
        const el = document.getElementById('diffIssVal');
        if (el) el.textContent = state.iss.toFixed(1) + ' mA';
        renderDiffPair();
      });
    }

    const rdSlider = document.getElementById('diffRd');
    if (rdSlider) {
      rdSlider.addEventListener('input', (e) => {
        state.rd = parseFloat(e.target.value);
        const el = document.getElementById('diffRdVal');
        if (el) el.textContent = state.rd.toFixed(1) + ' kΩ';
        renderDiffPair();
      });
    }

    const rssSlider = document.getElementById('diffRss');
    if (rssSlider) {
      rssSlider.addEventListener('input', (e) => {
        state.rss = parseFloat(e.target.value);
        const el = document.getElementById('diffRssVal');
        if (el) el.textContent = state.rss.toFixed(0) + ' kΩ';
        renderDiffPair();
      });
    }

    const vovSlider = document.getElementById('diffVov');
    if (vovSlider) {
      vovSlider.addEventListener('input', (e) => {
        state.vov = parseFloat(e.target.value);
        const el = document.getElementById('diffVovVal');
        if (el) el.textContent = state.vov.toFixed(2) + ' V';
        renderDiffPair();
      });
    }

    window.setDiffPreset = function(pVid, pIss, pRd, pRss, pVov) {
      state.vid = pVid;
      state.iss = pIss;
      state.rd = pRd;
      state.rss = pRss;
      state.vov = pVov;

      if (vidSlider) { vidSlider.value = pVid; const el = document.getElementById('diffVidVal'); if (el) el.textContent = (pVid >= 0 ? '+' : '') + pVid.toFixed(2) + ' V'; }
      if (issSlider) { issSlider.value = pIss; const el = document.getElementById('diffIssVal'); if (el) el.textContent = pIss.toFixed(1) + ' mA'; }
      if (rdSlider) { rdSlider.value = pRd; const el = document.getElementById('diffRdVal'); if (el) el.textContent = pRd.toFixed(1) + ' kΩ'; }
      if (rssSlider) { rssSlider.value = pRss; const el = document.getElementById('diffRssVal'); if (el) el.textContent = pRss.toFixed(0) + ' kΩ'; }
      if (vovSlider) { vovSlider.value = pVov; const el = document.getElementById('diffVovVal'); if (el) el.textContent = pVov.toFixed(2) + ' V'; }

      renderDiffPair();
    };
  }

  // ---------------------------------------------------------
  // 2. CLASS A vs CLASS B POWER OUTPUT STAGE
  // ---------------------------------------------------------
  const powerCanvas = document.getElementById('powerAmpCanvas');
  if (powerCanvas) {
    const ctx = powerCanvas.getContext('2d');
    let ampClass = 'classB';
    let vDeadzone = 0.65;
    let driveAmp = 3.0;

    function resizePower() {
      const parent = powerCanvas.parentElement;
      if (!parent) return;
      const dpr = window.devicePixelRatio || 1;
      const w = parent.offsetWidth;
      const h = parent.offsetHeight;
      if (w === 0 || h === 0) return;
      powerCanvas.width = w * dpr;
      powerCanvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      renderPowerWaveforms();
    }

    window.addEventListener('resize', resizePower);
    if ('ResizeObserver' in window && powerCanvas.parentElement) {
      const ro = new ResizeObserver(() => resizePower());
      ro.observe(powerCanvas.parentElement);
    }

    function renderPowerWaveforms() {
      const parent = powerCanvas.parentElement;
      if (!parent) return;
      const w = parent.offsetWidth;
      const h = parent.offsetHeight;
      if (w === 0 || h === 0) return;
      ctx.clearRect(0, 0, w, h);

      // Oscilloscope background grid
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
      const scaleY = (h / 2.6) / 4.0;

      // Numeric Tick Labels on Center Zero Axis and Voltage levels
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px JetBrains Mono, monospace';
      const vLevels = [3, 2, 1, -1, -2, -3];
      vLevels.forEach(val => {
        const yPos = centerY - val * scaleY;
        ctx.fillText((val > 0 ? '+' : '') + val + ' V', 10, yPos + 4);
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

      // Draw Zero Axis
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(w, centerY);
      ctx.stroke();

      // Deadzone Band (Class B Crossover Zone)
      if (ampClass === 'classB' && vDeadzone > 0) {
        ctx.fillStyle = 'rgba(244, 63, 94, 0.15)';
        ctx.fillRect(0, centerY - vDeadzone * scaleY, w, 2 * vDeadzone * scaleY);

        ctx.fillStyle = '#f43f5e';
        ctx.font = '12px JetBrains Mono, monospace';
        ctx.fillText(`Crossover Deadband (±${vDeadzone.toFixed(2)} V)`, 70, centerY - vDeadzone * scaleY - 6);
      }

      // Input Sine Wave (Dashed Yellow)
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.8)';
      ctx.lineWidth = 2.0;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        const theta = (x / w) * Math.PI * 4; // 2 complete cycles
        const vin = driveAmp * Math.sin(theta);
        const y = centerY - vin * scaleY;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Output Waveform (Solid Cyan)
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.4;
      ctx.beginPath();

      for (let x = 0; x < w; x++) {
        const theta = (x / w) * Math.PI * 4;
        const vin = driveAmp * Math.sin(theta);
        let vout = 0;

        if (ampClass === 'classA') {
          vout = vin;
        } else {
          if (vin > vDeadzone) {
            vout = vin - vDeadzone;
          } else if (vin < -vDeadzone) {
            vout = vin + vDeadzone;
          } else {
            vout = 0;
          }
        }

        const y = centerY - vout * scaleY;
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
      ctx.fillRect(legX, legY, 175, 60);
      ctx.strokeRect(legX, legY, 175, 60);

      ctx.font = '12px JetBrains Mono, monospace';

      // 1: Vin
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2.0;
      ctx.setLineDash([5, 3]);
      ctx.beginPath();
      ctx.moveTo(legX + 10, legY + 20); ctx.lineTo(legX + 35, legY + 20);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText('Vin (Input)', legX + 44, legY + 24);

      // 2: Vout
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(legX + 10, legY + 42); ctx.lineTo(legX + 35, legY + 42);
      ctx.stroke();
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText('Vout (Output)', legX + 44, legY + 46);
    }

    resizePower();

    // Event listeners
    const deadzoneSlider = document.getElementById('powerDeadzone') || document.getElementById('powerVbeDrop');
    const deadzoneVal = document.getElementById('powerDeadzoneVal') || document.getElementById('powerVbeVal');

    const classBtns = document.querySelectorAll('button[data-power-class], input[name="powerClass"]');
    classBtns.forEach(btn => {
      const handler = () => {
        ampClass = btn.getAttribute('data-power-class') || btn.value;
        classBtns.forEach(b => { if (b.classList) b.classList.remove('active'); });
        if (btn.classList) btn.classList.add('active');

        const etaEl = document.getElementById('powerEtaVal') || document.getElementById('powerEffVal');
        const condEl = document.getElementById('powerCondAngle') || document.getElementById('powerCondVal');
        const thdEl = document.getElementById('powerThdVal') || document.getElementById('powerDistVal');

        if (ampClass === 'classA') {
          if (etaEl) etaEl.textContent = '25.0% (Max Theor)';
          if (condEl) condEl.textContent = '360° (Full Cycle Conduction)';
          if (thdEl) thdEl.textContent = '< 0.5% (Clean Linear)';
          if (deadzoneSlider) deadzoneSlider.disabled = true;
          if (deadzoneVal) deadzoneVal.textContent = 'N/A (Class A: continuous conduction)';
        } else {
          if (etaEl) etaEl.textContent = '78.5% (Max Theor)';
          if (condEl) condEl.textContent = '180° (Half Cycle Conduction)';
          if (thdEl) thdEl.textContent = '~ 8.5% (Crossover Distortion)';
          if (deadzoneSlider) deadzoneSlider.disabled = false;
          if (deadzoneVal) deadzoneVal.textContent = vDeadzone.toFixed(2) + ' V';
        }

        renderPowerWaveforms();
      };
      btn.addEventListener('click', handler);
      btn.addEventListener('change', handler);
    });

    if (deadzoneSlider) {
      deadzoneSlider.addEventListener('input', (e) => {
        vDeadzone = parseFloat(e.target.value);
        if (deadzoneVal) deadzoneVal.textContent = vDeadzone.toFixed(2) + ' V';
        renderPowerWaveforms();
      });
    }

    const driveSlider = document.getElementById('powerDrive');
    if (driveSlider) {
      driveSlider.addEventListener('input', (e) => {
        driveAmp = parseFloat(e.target.value);
        const el = document.getElementById('powerDriveVal');
        if (el) el.textContent = driveAmp.toFixed(1) + ' V';
        renderPowerWaveforms();
      });
    }
  }
})();
