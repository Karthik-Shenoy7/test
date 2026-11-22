/* ==========================================================================
   unit3-amplifiers.js - Unit III: MOS Amplifier Configurations & AC Analysis
   Common-Source (CS), Common-Drain (CD / Source Follower), Common-Gate (CG)
   ========================================================================== */

(function() {
  const canvas = document.getElementById('ampBodeCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const state = {
    config: 'cs-deg', // 'cs-core', 'cs-deg', 'cd', 'cg'
    gm: 4.0, // mS (mA/V)
    ro: 40.0, // kOhms
    rd: 5.0, // kOhms
    rs: 0.5, // kOhms (source degeneration)
    rl: 10.0, // kOhms
    cgs: 50, // fF
    cgd: 20  // fF
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
    renderBodePlot();
  }
  window.addEventListener('resize', resize);
  if ('ResizeObserver' in window && canvas.parentElement) {
    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas.parentElement);
  }

  function calculateAmpMetrics() {
    const { config, gm, ro, rd, rs, rl } = state;
    let av = 0, zin = 0, zout = 0, bandwidthMhz = 100;

    const rLoadEff = (rd * rl) / (rd + rl);

    if (config === 'cs-core') {
      // Basic Common-Source
      // Av = -gm * (rLoadEff || ro)
      const rTotal = (rLoadEff * ro) / (rLoadEff + ro);
      av = -gm * rTotal;
      zin = 1000; // kOhm (dominated by gate resistance)
      zout = (rd * ro) / (rd + ro);
      // Miller capacitance: Cin = Cgs + Cgd * (1 + |Av|)
      const cin = state.cgs + state.cgd * (1 + Math.abs(av));
      bandwidthMhz = 1000 / (2 * Math.PI * 0.5 * cin * 1e-3);
    } else if (config === 'cs-deg') {
      // CS with Source Degeneration
      // Av ≈ -gm * rLoadEff / (1 + gm * rs)
      av = -(gm * rLoadEff) / (1 + gm * rs);
      zin = 1000;
      // Zout looking into drain with degeneration is boosted: ro * (1 + gm*rs)
      const roBoosted = ro * (1 + gm * rs);
      zout = (rd * roBoosted) / (rd + roBoosted);
      const cin = state.cgs / (1 + gm * rs) + state.cgd * (1 + Math.abs(av));
      bandwidthMhz = 1500 / (2 * Math.PI * 0.5 * cin * 1e-3);
    } else if (config === 'cd') {
      // Common Drain (Source Follower)
      // Av ≈ gm * (rs || rl) / (1 + gm * (rs || rl)) < 1
      const rSourceEff = (rs * rl) / (rs + rl);
      av = (gm * rSourceEff) / (1 + gm * rSourceEff);
      zin = 2000; // Very high
      zout = (rs * (1 / gm)) / (rs + (1 / gm)); // Very low output impedance!
      bandwidthMhz = 450; // High bandwidth
    } else if (config === 'cg') {
      // Common Gate
      // Av ≈ +gm * rLoadEff (Non-inverting)
      av = gm * rLoadEff;
      zin = 1 / gm; // Very low input impedance ≈ 1/gm
      zout = rd;
      bandwidthMhz = 600; // No Miller effect!
    }

    // Update UI Elements
    const avEl = document.getElementById('ampAvVal');
    const zinEl = document.getElementById('ampZinVal');
    const zoutEl = document.getElementById('ampZoutVal');
    const bwEl = document.getElementById('ampBwVal');
    const schTitleEl = document.getElementById('ampSchTitle');

    if (avEl) avEl.textContent = av.toFixed(2) + ' V/V (' + (20 * Math.log10(Math.max(0.01, Math.abs(av)))).toFixed(1) + ' dB)';
    if (zinEl) zinEl.textContent = zin >= 1000 ? '∞ (~1 MΩ)' : (zin * 1000).toFixed(0) + ' Ω';
    if (zoutEl) zoutEl.textContent = zout < 1 ? (zout * 1000).toFixed(0) + ' Ω' : zout.toFixed(2) + ' kΩ';
    if (bwEl) bwEl.textContent = bandwidthMhz.toFixed(0) + ' MHz';

    if (schTitleEl) {
      const titles = {
        'cs-core': 'Common-Source (CS) Core Stage',
        'cs-deg': 'CS Stage with Source Degeneration (RS)',
        'cd': 'Common-Drain (Source Follower Buffer)',
        'cg': 'Common-Gate (CG) Current Buffer'
      };
      schTitleEl.textContent = titles[config];
    }

    updateSchematicSvg();
    return { av, zin, zout, bandwidthMhz };
  }

  function updateSchematicSvg() {
    const svgBox = document.getElementById('ampSchematicSvg');
    if (!svgBox) return;

    const { config } = state;
    let svgHtml = '';

    if (config === 'cs-core' || config === 'cs-deg') {
      svgHtml = `
        <svg viewBox="0 0 320 240" width="100%" height="220" xmlns="http://www.w3.org/2000/svg">
          <!-- VDD Rail -->
          <line x1="80" y1="20" x2="240" y2="20" stroke="#f59e0b" stroke-width="2"/>
          <text x="160" y="14" fill="#f59e0b" font-size="12" font-family="monospace" text-anchor="middle">VDD</text>
          
          <!-- Drain Resistor RD -->
          <line x1="160" y1="20" x2="160" y2="45" stroke="#94a3b8" stroke-width="2"/>
          <rect x="150" y="45" width="20" height="40" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
          <text x="180" y="70" fill="#38bdf8" font-size="11" font-family="monospace">RD</text>
          <line x1="160" y1="85" x2="160" y2="105" stroke="#94a3b8" stroke-width="2"/>

          <!-- Output Node -->
          <circle cx="160" cy="100" r="3" fill="#38bdf8"/>
          <line x1="160" y1="100" x2="220" y2="100" stroke="#38bdf8" stroke-width="2"/>
          <!-- Coupling Cap & Vout -->
          <line x1="220" y1="92" x2="220" y2="108" stroke="#38bdf8" stroke-width="2"/>
          <line x1="226" y1="92" x2="226" y2="108" stroke="#38bdf8" stroke-width="2"/>
          <line x1="226" y1="100" x2="260" y2="100" stroke="#38bdf8" stroke-width="2"/>
          <text x="270" y="104" fill="#38bdf8" font-size="12" font-family="monospace">Vout</text>

          <!-- NMOS Transistor M1 -->
          <line x1="160" y1="105" x2="160" y2="115" stroke="#94a3b8" stroke-width="2"/>
          <line x1="145" y1="115" x2="175" y2="115" stroke="#94a3b8" stroke-width="2"/>
          <line x1="145" y1="120" x2="175" y2="120" stroke="#f59e0b" stroke-width="3"/>
          <line x1="145" y1="125" x2="175" y2="125" stroke="#94a3b8" stroke-width="2"/>
          <text x="185" y="124" fill="#94a3b8" font-size="11" font-family="monospace">M1</text>
          
          <!-- Gate Input -->
          <line x1="160" y1="120" x2="110" y2="120" stroke="#94a3b8" stroke-width="2"/>
          <circle cx="110" cy="120" r="3" fill="#fbbf24"/>
          <text x="75" y="124" fill="#fbbf24" font-size="12" font-family="monospace">Vin</text>

          <!-- Source & Degeneration RS -->
          <line x1="160" y1="125" x2="160" y2="145" stroke="#94a3b8" stroke-width="2"/>
          ${config === 'cs-deg' ? `
            <rect x="150" y="145" width="20" height="40" fill="#1e293b" stroke="#34d399" stroke-width="2"/>
            <text x="180" y="170" fill="#34d399" font-size="11" font-family="monospace">RS</text>
            <line x1="160" y1="185" x2="160" y2="205" stroke="#94a3b8" stroke-width="2"/>
          ` : `
            <line x1="160" y1="145" x2="160" y2="205" stroke="#94a3b8" stroke-width="2"/>
          `}

          <!-- Ground -->
          <line x1="145" y1="205" x2="175" y2="205" stroke="#94a3b8" stroke-width="2"/>
          <line x1="150" y1="210" x2="170" y2="210" stroke="#94a3b8" stroke-width="2"/>
          <line x1="155" y1="215" x2="165" y2="215" stroke="#94a3b8" stroke-width="2"/>
        </svg>
      `;
    } else if (config === 'cd') {
      svgHtml = `
        <svg viewBox="0 0 320 240" width="100%" height="220" xmlns="http://www.w3.org/2000/svg">
          <!-- VDD to Drain directly -->
          <line x1="80" y1="20" x2="240" y2="20" stroke="#f59e0b" stroke-width="2"/>
          <text x="160" y="14" fill="#f59e0b" font-size="12" font-family="monospace" text-anchor="middle">VDD</text>
          <line x1="160" y1="20" x2="160" y2="85" stroke="#94a3b8" stroke-width="2"/>

          <!-- NMOS M1 -->
          <line x1="145" y1="85" x2="175" y2="85" stroke="#94a3b8" stroke-width="2"/>
          <line x1="145" y1="90" x2="175" y2="90" stroke="#f59e0b" stroke-width="3"/>
          <line x1="145" y1="95" x2="175" y2="95" stroke="#94a3b8" stroke-width="2"/>
          <text x="185" y="94" fill="#94a3b8" font-size="11" font-family="monospace">M1</text>

          <!-- Gate Vin -->
          <line x1="160" y1="90" x2="110" y2="90" stroke="#94a3b8" stroke-width="2"/>
          <circle cx="110" cy="90" r="3" fill="#fbbf24"/>
          <text x="75" y="94" fill="#fbbf24" font-size="12" font-family="monospace">Vin</text>

          <!-- Source Output Node -->
          <line x1="160" y1="95" x2="160" y2="120" stroke="#94a3b8" stroke-width="2"/>
          <circle cx="160" cy="115" r="3" fill="#38bdf8"/>
          <line x1="160" y1="115" x2="240" y2="115" stroke="#38bdf8" stroke-width="2"/>
          <text x="250" y="119" fill="#38bdf8" font-size="12" font-family="monospace">Vout (Buffer)</text>

          <!-- Source Resistor RS -->
          <line x1="160" y1="120" x2="160" y2="135" stroke="#94a3b8" stroke-width="2"/>
          <rect x="150" y="135" width="20" height="40" fill="#1e293b" stroke="#34d399" stroke-width="2"/>
          <text x="180" y="160" fill="#34d399" font-size="11" font-family="monospace">RS</text>
          <line x1="160" y1="175" x2="160" y2="205" stroke="#94a3b8" stroke-width="2"/>

          <!-- Ground -->
          <line x1="145" y1="205" x2="175" y2="205" stroke="#94a3b8" stroke-width="2"/>
          <line x1="150" y1="210" x2="170" y2="210" stroke="#94a3b8" stroke-width="2"/>
        </svg>
      `;
    } else {
      // Common Gate
      svgHtml = `
        <svg viewBox="0 0 320 240" width="100%" height="220" xmlns="http://www.w3.org/2000/svg">
          <!-- VDD Rail -->
          <line x1="80" y1="20" x2="240" y2="20" stroke="#f59e0b" stroke-width="2"/>
          <text x="160" y="14" fill="#f59e0b" font-size="12" font-family="monospace" text-anchor="middle">VDD</text>
          
          <!-- Drain Resistor RD -->
          <line x1="160" y1="20" x2="160" y2="45" stroke="#94a3b8" stroke-width="2"/>
          <rect x="150" y="45" width="20" height="40" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
          <text x="180" y="70" fill="#38bdf8" font-size="11" font-family="monospace">RD</text>
          <line x1="160" y1="85" x2="160" y2="105" stroke="#94a3b8" stroke-width="2"/>

          <!-- Output Node -->
          <circle cx="160" cy="100" r="3" fill="#38bdf8"/>
          <line x1="160" y1="100" x2="230" y2="100" stroke="#38bdf8" stroke-width="2"/>
          <text x="240" y="104" fill="#38bdf8" font-size="12" font-family="monospace">Vout</text>

          <!-- NMOS M1 -->
          <line x1="145" y1="105" x2="175" y2="105" stroke="#94a3b8" stroke-width="2"/>
          <line x1="145" y1="110" x2="175" y2="110" stroke="#f59e0b" stroke-width="3"/>
          <line x1="145" y1="115" x2="175" y2="115" stroke="#94a3b8" stroke-width="2"/>
          <text x="185" y="114" fill="#94a3b8" font-size="11" font-family="monospace">M1</text>

          <!-- Gate grounded for AC (VBias DC) -->
          <line x1="160" y1="110" x2="105" y2="110" stroke="#94a3b8" stroke-width="2"/>
          <text x="65" y="114" fill="#94a3b8" font-size="11" font-family="monospace">VB (AC Gnd)</text>

          <!-- Source is Vin! -->
          <line x1="160" y1="115" x2="160" y2="170" stroke="#94a3b8" stroke-width="2"/>
          <circle cx="160" cy="140" r="3" fill="#fbbf24"/>
          <line x1="160" y1="140" x2="110" y2="140" stroke="#fbbf24" stroke-width="2"/>
          <text x="75" y="144" fill="#fbbf24" font-size="12" font-family="monospace">Vin</text>

          <!-- Current source / RS to Gnd -->
          <rect x="150" y="170" width="20" height="30" fill="#1e293b" stroke="#34d399" stroke-width="2"/>
          <text x="180" y="190" fill="#34d399" font-size="11" font-family="monospace">IS</text>
        </svg>
      `;
    }
    svgBox.innerHTML = svgHtml;
  }

  function renderBodePlot() {
    const metrics = calculateAmpMetrics();

    const parent = canvas.parentElement;
    if (!parent) return;
    const w = parent.offsetWidth;
    const h = parent.offsetHeight;
    if (w === 0 || h === 0) return;
    ctx.clearRect(0, 0, w, h);

    const padLeft = 60, padBottom = 40, padTop = 30, padRight = 30;
    const plotW = w - padLeft - padRight;
    const plotH = h - padTop - padBottom;

    // Freq Range: 100 kHz (1e5) to 10 GHz (1e10) -> 5 decades
    const minDec = 5;
    const maxDec = 10;
    const decRange = maxDec - minDec;

    const maxDb = 40;
    const minDb = -20;
    const dbRange = maxDb - minDb;

    function toScreen(freqHz, gainDb) {
      const dec = Math.log10(freqHz);
      const x = padLeft + ((dec - minDec) / decRange) * plotW;
      const y = padTop + ((maxDb - gainDb) / dbRange) * plotH;
      return { x, y };
    }

    // Draw Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let d = minDec; d <= maxDec; d++) {
      const pt = toScreen(Math.pow(10, d), 0);
      ctx.beginPath();
      ctx.moveTo(pt.x, padTop);
      ctx.lineTo(pt.x, padTop + plotH);
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px JetBrains Mono, monospace';
      const label = d === 6 ? '1MHz' : (d === 8 ? '100MHz' : (d === 9 ? '1GHz' : '10^' + d));
      if (d === maxDec - 1 || d === maxDec) {
        ctx.textAlign = 'right';
        ctx.fillText(label, Math.min(w - 6, pt.x + 8), padTop + plotH + 18);
        ctx.textAlign = 'left';
      } else {
        ctx.fillText(label, pt.x - 12, padTop + plotH + 18);
      }
    }

    for (let db = minDb; db <= maxDb; db += 10) {
      const pt = toScreen(1e5, db);
      ctx.beginPath();
      ctx.moveTo(padLeft, pt.y);
      ctx.lineTo(padLeft + plotW, pt.y);
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px JetBrains Mono, monospace';
      ctx.fillText(db + 'dB', padLeft - 38, pt.y + 4);
    }

    // Axes
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padLeft, padTop);
    ctx.lineTo(padLeft, padTop + plotH);
    ctx.lineTo(padLeft + plotW, padTop + plotH);
    ctx.stroke();

    // Plot Frequency Response Curve
    const midbandDb = 20 * Math.log10(Math.max(0.01, Math.abs(metrics.av)));
    const f3db = metrics.bandwidthMhz * 1e6;

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.4;
    ctx.beginPath();

    const points = 120;
    for (let i = 0; i <= points; i++) {
      const dec = minDec + (i / points) * decRange;
      const freq = Math.pow(10, dec);
      // Single pole rolloff: A(f) = A0 / sqrt(1 + (f/f3db)^2)
      const gainRatio = 1 / Math.sqrt(1 + Math.pow(freq / f3db, 2));
      const gainDb = midbandDb + 20 * Math.log10(gainRatio);

      const pt = toScreen(freq, gainDb);
      if (i === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    }
    ctx.stroke();

    // Mark 3dB Bandwidth Corner
    const pt3db = toScreen(f3db, midbandDb - 3);
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(pt3db.x, pt3db.y, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = '12px JetBrains Mono, monospace';
    ctx.fillText(`-3dB Bandwidth (${metrics.bandwidthMhz.toFixed(0)} MHz)`, pt3db.x + 8, pt3db.y - 8);

    // In-Canvas Legend Box
    const legX = padLeft + plotW - 200;
    const legY = padTop + 10;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.fillRect(legX, legY, 190, 60);
    ctx.strokeRect(legX, legY, 190, 60);

    ctx.font = '12px JetBrains Mono, monospace';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(legX + 10, legY + 20); ctx.lineTo(legX + 35, legY + 20);
    ctx.stroke();
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText('|Av| Gain (dB)', legX + 44, legY + 24);

    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(legX + 22, legY + 42, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText('-3dB Corner', legX + 44, legY + 46);
  }

  resize();

  // Topology Switcher buttons
  const topoBtns = document.querySelectorAll('[data-amp-cfg]');
  topoBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      topoBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.config = btn.dataset.ampCfg;
      renderBodePlot();
    });
  });

  // Sliders
  const gmSlider = document.getElementById('ampGm');
  if (gmSlider) {
    gmSlider.addEventListener('input', (e) => {
      state.gm = parseFloat(e.target.value);
      document.getElementById('ampGmVal').textContent = state.gm + ' mS';
      renderBodePlot();
    });
  }

  const rdSlider = document.getElementById('ampRd');
  if (rdSlider) {
    rdSlider.addEventListener('input', (e) => {
      state.rd = parseFloat(e.target.value);
      document.getElementById('ampRdVal').textContent = state.rd + ' kΩ';
      renderBodePlot();
    });
  }

  const rsSlider = document.getElementById('ampRs');
  if (rsSlider) {
    rsSlider.addEventListener('input', (e) => {
      state.rs = parseFloat(e.target.value);
      document.getElementById('ampRsVal').textContent = state.rs + ' kΩ';
      renderBodePlot();
    });
  }
})();
