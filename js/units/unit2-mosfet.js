/* ==========================================================================
   unit2-mosfet.js - Unit II: MOSFET Physics & Current-Voltage Characteristics
   Solves Ideal & Real MOSFET equations, Pinch-off, and DC Load Line
   ========================================================================== */

(function() {
  const canvas = document.getElementById('mosfetIvCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const state = {
    vgs: 1.8,
    vds: 1.5,
    vth: 0.5,
    unCox: 200, // uA/V^2
    W: 10, // um
    L: 0.5, // um
    lambda: 0.08, // 1/V
    vdd: 2.5,
    rd: 1.5 // kOhms
  };

  function resize() {
    const parent = canvas.parentElement;
    if (!parent) return;
    const dpr = window.devicePixelRatio || 1;
    const w = parent.offsetWidth;
    const h = parent.offsetHeight;
    if (w === 0 || h === 0) return;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    renderPlot();
  }

  window.addEventListener('resize', resize);
  if ('ResizeObserver' in window && canvas.parentElement) {
    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas.parentElement);
  }

  function calcId(vgs, vds) {
    const vov = vgs - state.vth;
    if (vov <= 0) return 0;

    const betaFactor = state.unCox * 1e-3 * (state.W / state.L); // mA/V^2
    if (vds < vov) {
      // Triode
      return betaFactor * (vov * vds - 0.5 * vds * vds);
    } else {
      // Saturation
      return 0.5 * betaFactor * (vov * vov) * (1 + state.lambda * (vds - vov));
    }
  }

  function updateMetrics() {
    const vov = state.vgs - state.vth;
    const id = calcId(state.vgs, state.vds);

    let region = 'Cut-off';
    if (vov > 0) {
      if (state.vds < vov) region = 'Triode (Ohmic)';
      else region = 'Saturation (Pinch-off)';
    }

    const gm = vov > 0 ? (state.unCox * 1e-3 * (state.W / state.L) * vov) : 0; // mA/V = mS
    const ro = (state.lambda > 0 && id > 0) ? (1 / (state.lambda * id)) : 999; // kOhms

    const idEl = document.getElementById('mosIdVal');
    const vovEl = document.getElementById('mosVovVal');
    const gmEl = document.getElementById('mosGmVal');
    const roEl = document.getElementById('mosRoVal');
    const regEl = document.getElementById('mosRegionVal');

    if (idEl) idEl.textContent = id.toFixed(3) + ' mA';
    if (vovEl) vovEl.textContent = Math.max(0, vov).toFixed(2) + ' V';
    if (gmEl) gmEl.textContent = gm.toFixed(2) + ' mS';
    if (roEl) roEl.textContent = ro < 500 ? ro.toFixed(1) + ' kΩ' : '∞';

    if (regEl) {
      regEl.textContent = region;
      regEl.className = 'status-badge ' + (region.includes('Saturation') ? 'sat' : (region.includes('Triode') ? 'triode' : 'cutoff'));
    }

    const m3VovEl = document.getElementById('mos3dVovVal');
    const m3StateEl = document.getElementById('mos3dStateVal');
    const m3PinchEl = document.getElementById('mos3dPinchVal');

    if (m3VovEl) m3VovEl.textContent = Math.max(0, vov).toFixed(2) + ' V';
    if (m3StateEl) {
      m3StateEl.textContent = region.includes('Saturation') ? 'Saturation' : (region.includes('Triode') ? 'Triode' : 'Cut-off');
      m3StateEl.className = 'status-badge ' + (region.includes('Saturation') ? 'sat' : (region.includes('Triode') ? 'triode' : 'cutoff'));
    }
    if (m3PinchEl) {
      if (vov <= 0) m3PinchEl.textContent = 'None (Cut-off)';
      else if (state.vds < vov) m3PinchEl.textContent = 'Not pinched';
      else if (Math.abs(state.vds - vov) < 0.1) m3PinchEl.textContent = 'Drain edge';
      else m3PinchEl.textContent = 'Toward source';
    }

    if (window.mosfetChamber) {
      window.mosfetChamber.setVoltages(state.vgs, state.vds);
    }
  }

  function renderPlot() {
    updateMetrics();

    const parent = canvas.parentElement;
    if (!parent) return;
    const w = parent.offsetWidth;
    const h = parent.offsetHeight;
    if (w === 0 || h === 0) return;
    ctx.clearRect(0, 0, w, h);

    const padLeft = 70, padBottom = 44, padTop = 32, padRight = 36;
    const plotW = w - padLeft - padRight;
    const plotH = h - padTop - padBottom;

    const maxVds = 3.0;
    const maxId = 4.0; // mA

    function toScreen(vds, id) {
      return {
        x: padLeft + (vds / maxVds) * plotW,
        y: padTop + plotH - (id / maxId) * plotH
      };
    }

    // Draw Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    for (let v = 0; v <= maxVds + 0.01; v += 0.5) {
      const pt = toScreen(v, 0);
      ctx.beginPath();
      ctx.moveTo(pt.x, padTop);
      ctx.lineTo(pt.x, padTop + plotH);
      ctx.stroke();
    }
    for (let i = 0; i <= maxId + 0.01; i += 0.5) {
      const pt = toScreen(0, i);
      ctx.beginPath();
      ctx.moveTo(padLeft, pt.y);
      ctx.lineTo(padLeft + plotW, pt.y);
      ctx.stroke();
    }

    // Numeric Tick Labels on X-axis (V_DS)
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px JetBrains Mono, monospace';
    for (let v = 0; v <= maxVds + 0.01; v += 0.5) {
      const pt = toScreen(v, 0);
      if (v >= maxVds - 0.05) {
        ctx.textAlign = 'right';
        ctx.fillText(v.toFixed(1) + ' V', Math.min(w - 6, pt.x + 8), padTop + plotH + 18);
        ctx.textAlign = 'left';
      } else {
        ctx.fillText(v.toFixed(1) + ' V', pt.x - 14, padTop + plotH + 18);
      }
    }

    // Numeric Tick Labels on Y-axis (I_D)
    for (let i = 0; i <= maxId + 0.01; i += 1.0) {
      const pt = toScreen(0, i);
      ctx.fillText(i.toFixed(1) + ' mA', 8, pt.y + 4);
    }

    // Draw Axes
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(padLeft, padTop);
    ctx.lineTo(padLeft, padTop + plotH);
    ctx.lineTo(padLeft + plotW, padTop + plotH);
    ctx.stroke();

    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'bold 12px JetBrains Mono, monospace';
    ctx.fillText('V_DS (V)', padLeft + plotW - 75, padTop + plotH + 36);
    ctx.fillText('I_D (mA)', padLeft - 60, padTop - 12);

    // 1. Draw Pinch-off Parabola (Vds = Vgs - Vth locus)
    ctx.strokeStyle = 'rgba(244, 63, 94, 0.8)';
    ctx.lineWidth = 2.0;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    const betaFactor = state.unCox * 1e-3 * (state.W / state.L);
    for (let v = 0; v <= maxVds; v += 0.05) {
      const idSat = 0.5 * betaFactor * (v * v);
      const pt = toScreen(v, idSat);
      if (v === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // 2. Family of ID vs VDS Curves
    const vgsLevels = [0.8, 1.1, 1.4, 1.7, 2.0, 2.3];
    vgsLevels.forEach(level => {
      const isCur = Math.abs(level - state.vgs) < 0.15;
      ctx.strokeStyle = isCur ? '#38bdf8' : 'rgba(56, 189, 248, 0.3)';
      ctx.lineWidth = isCur ? 2.6 : 2.0;
      ctx.beginPath();

      for (let v = 0; v <= maxVds; v += 0.05) {
        const idVal = calcId(level, v);
        const pt = toScreen(v, idVal);
        if (v === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();

      const endPt = toScreen(maxVds, calcId(level, maxVds));
      ctx.fillStyle = isCur ? '#38bdf8' : '#64748b';
      ctx.font = '12px JetBrains Mono, monospace';
      ctx.fillText(`${level} V`, endPt.x - 30, endPt.y - 4);
    });

    // 3. Draw Active User Curve (Current Vgs) if not aligned with preset levels
    const isLevelMatch = vgsLevels.some(l => Math.abs(l - state.vgs) < 0.05);
    if (!isLevelMatch) {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      for (let v = 0; v <= maxVds; v += 0.04) {
        const idVal = calcId(state.vgs, v);
        const pt = toScreen(v, idVal);
        if (v === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();
    }

    // 4. Common-Source DC Load Line
    const idMaxLoad = state.vdd / state.rd;
    const ptLoadA = toScreen(0, idMaxLoad);
    const ptLoadB = toScreen(state.vdd, 0);

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(ptLoadA.x, ptLoadA.y);
    ctx.lineTo(ptLoadB.x, ptLoadB.y);
    ctx.stroke();

    // 5. Current Operating Point Q (Vds, Id)
    const curId = calcId(state.vgs, state.vds);
    const ptQ = toScreen(state.vds, curId);

    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(ptQ.x, ptQ.y, 6.5, 0, Math.PI * 2);
    ctx.fill();

    // Projection dashed lines
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(ptQ.x, ptQ.y);
    ctx.lineTo(ptQ.x, padTop + plotH);
    ctx.moveTo(ptQ.x, ptQ.y);
    ctx.lineTo(padLeft, ptQ.y);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px JetBrains Mono, monospace';
    ctx.fillText(`Q (${state.vds.toFixed(2)} V, ${curId.toFixed(3)} mA)`, ptQ.x + 10, ptQ.y - 12);

    // In-Canvas Legend Box
    const legX = padLeft + 16;
    const legY = padTop + 10;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.fillRect(legX, legY, 210, 85);
    ctx.strokeRect(legX, legY, 210, 85);

    ctx.font = '12px JetBrains Mono, monospace';

    // 1: Active ID curve
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(legX + 10, legY + 20); ctx.lineTo(legX + 35, legY + 20);
    ctx.stroke();
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText('ID vs VDS (Active)', legX + 44, legY + 24);

    // 2: Pinch-off Boundary
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 2.0;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(legX + 10, legY + 40); ctx.lineTo(legX + 35, legY + 40);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText('Pinch-off Boundary', legX + 44, legY + 44);

    // 3: DC Load Line
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(legX + 10, legY + 60); ctx.lineTo(legX + 35, legY + 60);
    ctx.stroke();
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText('DC Load Line', legX + 44, legY + 64);
  }

  resize();

  // Slider hooks
  const vgsSlider = document.getElementById('mosVgs');
  if (vgsSlider) {
    vgsSlider.addEventListener('input', (e) => {
      state.vgs = parseFloat(e.target.value);
      const el = document.getElementById('mosVgsVal');
      if (el) el.textContent = state.vgs + ' V';
      renderPlot();
    });
  }

  const vdsSlider = document.getElementById('mosVds');
  if (vdsSlider) {
    vdsSlider.addEventListener('input', (e) => {
      state.vds = parseFloat(e.target.value);
      const el = document.getElementById('mosVdsVal');
      if (el) el.textContent = state.vds + ' V';
      renderPlot();
    });
  }

  const vthSlider = document.getElementById('mosVth');
  if (vthSlider) {
    vthSlider.addEventListener('input', (e) => {
      state.vth = parseFloat(e.target.value);
      const el = document.getElementById('mosVthVal');
      if (el) el.textContent = state.vth + ' V';
      renderPlot();
    });
  }

  const wlSlider = document.getElementById('mosWl');
  if (wlSlider) {
    wlSlider.addEventListener('input', (e) => {
      state.W = parseFloat(e.target.value);
      const el = document.getElementById('mosWlVal');
      if (el) el.textContent = state.W;
      renderPlot();
    });
  }

  const lambdaSlider = document.getElementById('mosLambda');
  if (lambdaSlider) {
    lambdaSlider.addEventListener('input', (e) => {
      state.lambda = parseFloat(e.target.value);
      const el = document.getElementById('mosLambdaVal');
      if (el) el.textContent = state.lambda + ' V⁻¹';
      renderPlot();
    });
  }

  window.setMosfetPreset = function(pVgs, pVds, pVth, pLambda) {
    state.vgs = pVgs;
    state.vds = pVds;
    state.vth = pVth;
    state.lambda = pLambda;

    if (vgsSlider) { vgsSlider.value = pVgs; const el = document.getElementById('mosVgsVal'); if (el) el.textContent = pVgs + ' V'; }
    if (vdsSlider) { vdsSlider.value = pVds; const el = document.getElementById('mosVdsVal'); if (el) el.textContent = pVds + ' V'; }
    if (vthSlider) { vthSlider.value = pVth; const el = document.getElementById('mosVthVal'); if (el) el.textContent = pVth + ' V'; }
    if (lambdaSlider) { lambdaSlider.value = pLambda; const el = document.getElementById('mosLambdaVal'); if (el) el.textContent = pLambda + ' V⁻¹'; }

    renderPlot();
  };
})();
