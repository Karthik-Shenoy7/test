/* ==========================================================================
   formulas-page.js - Master Comparison Tables & Searchable Formulas
   Curriculum: 25ECE211 (Analog Electronic Circuits I)
   Stage 1: BJT Small-Signal Formulas Comparison
   Stage 2: MOSFET Amplifiers Formulas Comparison
   Stage 3: Current Mirrors & Differential Amplifiers Comparison
   ========================================================================== */

const formulasTableData = [
  {
    "family": "bjt-ce",
    "familyName": "BJT Common-Emitter Configurations (Slides 65-71)",
    "circuitId": "bjt-ce-fixed",
    "branchId": null,
    "variationName": "CE Fixed Bias (ro = ∞)",
    "slide": "Slide 65 (Fig 5.25)",
    "zi": "R_B \\parallel \\beta r_e",
    "zo": "R_C",
    "av": "-\\frac{R_C}{r_e}",
    "ai": "-\\beta \\frac{R_B}{R_B + \\beta r_e}",
    "whatChanged": "Base configuration: fixed base bias resistor RB, ideal transistor (ro = ∞)"
  },
  {
    "family": "bjt-ce",
    "familyName": "BJT Common-Emitter Configurations (Slides 65-71)",
    "circuitId": "bjt-ce-fixed",
    "branchId": "branch-finite-ro",
    "variationName": "CE Fixed Bias (Finite ro, Early Effect)",
    "slide": "Slide 65 (part e) & Slide 66",
    "zi": "R_B \\parallel \\beta r_e",
    "zo": "R_C \\parallel r_o",
    "av": "-\\frac{R_C \\parallel r_o}{r_e}",
    "ai": "-\\beta \\frac{R_B}{R_B + \\beta r_e}",
    "whatChanged": "Added finite transistor output resistance ro in parallel with RC"
  },
  {
    "family": "bjt-ce",
    "familyName": "BJT Common-Emitter Configurations (Slides 65-71)",
    "circuitId": "bjt-ce-fixed",
    "branchId": "branch-finite-rl",
    "variationName": "CE Fixed Bias (With External Load RL)",
    "slide": "Slide 67 (Fig 5.153)",
    "zi": "R_B \\parallel \\beta r_e",
    "zo": "R_C",
    "av": "-\\frac{R_C \\parallel R_L}{r_e}",
    "ai": "A_v \\frac{Z_i}{R_L}",
    "whatChanged": "Connected external AC load resistor RL via coupling capacitor"
  },
  {
    "family": "bjt-ce",
    "familyName": "BJT Common-Emitter Configurations (Slides 65-71)",
    "circuitId": "bjt-ce-divider",
    "branchId": null,
    "variationName": "CE Voltage Divider (Bypassed RE, ro = ∞)",
    "slide": "Slide 68 & Slide 69 (Ex 5.2)",
    "zi": "(R_1 \\parallel R_2) \\parallel \\beta r_e",
    "zo": "R_C",
    "av": "-\\frac{R_C}{r_e}",
    "ai": "-\\beta \\frac{R_{TH}}{R_{TH} + \\beta r_e}",
    "whatChanged": "Bypass capacitor CE shorts RE to signal ground for maximum AC gain"
  },
  {
    "family": "bjt-ce",
    "familyName": "BJT Common-Emitter Configurations (Slides 65-71)",
    "circuitId": "bjt-ce-divider",
    "branchId": "branch-remove-ce",
    "variationName": "CE Voltage Divider (Unbypassed RE Degeneration)",
    "slide": "Slide 70 (Fig. 5.157)",
    "zi": "(R_1 \\parallel R_2) \\parallel \\beta(r_e + R_E)",
    "zo": "R_C",
    "av": "-\\frac{R_C}{r_e + R_E} \\approx -\\frac{R_C}{R_E}",
    "ai": "-\\beta \\frac{R_{TH}}{R_{TH} + Z_b}",
    "whatChanged": "Removed CE: unbypassed RE provides negative feedback (higher Zi, stable gain)"
  },
  {
    "family": "bjt-ce",
    "familyName": "BJT Common-Emitter Configurations (Slides 65-71)",
    "circuitId": "bjt-ce-divider",
    "branchId": "branch-finite-ro-div",
    "variationName": "CE Voltage Divider (Bypassed RE, Finite ro)",
    "slide": "Slide 69 (Ex 5.2e)",
    "zi": "(R_1 \\parallel R_2) \\parallel \\beta r_e",
    "zo": "R_C \\parallel r_o",
    "av": "-\\frac{R_C \\parallel r_o}{r_e}",
    "ai": "-\\beta \\frac{R_{TH}}{R_{TH} + \\beta r_e}",
    "whatChanged": "Early effect considered: internal ro in parallel with RC lowers Zo and Av"
  },
  {
    "family": "bjt-ce",
    "familyName": "BJT Common-Emitter Configurations (Slides 65-71)",
    "circuitId": "bjt-ce-divider",
    "branchId": "branch-ce-load",
    "variationName": "CE Voltage Divider (Loaded with RL)",
    "slide": "Slide 70 (Variation)",
    "zi": "(R_1 \\parallel R_2) \\parallel \\beta r_e",
    "zo": "R_C",
    "av": "-\\frac{R_C \\parallel R_L}{r_e}",
    "ai": "A_v \\frac{Z_i}{R_L}",
    "whatChanged": "External AC load RL shunts RC"
  },
  {
    "family": "bjt-ef",
    "familyName": "BJT Emitter Follower / Common Collector (Slide 72)",
    "circuitId": "bjt-emitter-follower",
    "branchId": null,
    "variationName": "Emitter Follower (No-Load Buffer)",
    "slide": "Slide 72 (Fig. 5.159)",
    "zi": "R_B \\parallel [\\beta r_e + (\\beta + 1)R_E]",
    "zo": "R_E \\parallel r_e \\approx r_e",
    "av": "\\frac{R_E}{R_E + r_e} \\approx 1",
    "ai": "(\\beta + 1)\\frac{R_B}{R_B + Z_b}",
    "whatChanged": "Output taken at Emitter terminal: high Zi, very low Zo, non-inverting unity gain"
  },
  {
    "family": "bjt-ef",
    "familyName": "BJT Emitter Follower / Common Collector (Slide 72)",
    "circuitId": "bjt-emitter-follower",
    "branchId": "branch-ef-load",
    "variationName": "Emitter Follower (With External Load RL)",
    "slide": "Slide 72 (Variation)",
    "zi": "R_B \\parallel \\beta(r_e + R_E \\parallel R_L)",
    "zo": "(R_E \\parallel R_L) \\parallel r_e",
    "av": "\\frac{R_E \\parallel R_L}{(R_E \\parallel R_L) + r_e}",
    "ai": "A_v \\frac{Z_i}{R_L}",
    "whatChanged": "External load RL shunts RE: low Zo allows driving heavy loads without gain drop"
  },
  {
    "family": "mosfet-cs",
    "familyName": "MOSFET Common-Source Configurations (Slides 105-114)",
    "circuitId": "mosfet-cs-divider",
    "branchId": null,
    "variationName": "CS Stage (Canonical, RSi = 0, ro = ∞)",
    "slide": "Slides 108 & 109 (Ex 4.3)",
    "zi": "R_1 \\parallel R_2",
    "zo": "R_D",
    "av": "-g_m R_D",
    "ai": "\\infty \\text{ (Insulated Gate)}",
    "whatChanged": "Base CS stage with voltage-divider biasing, ideal transistor (ro = ∞) and ideal voltage source (RSi = 0)"
  },
  {
    "family": "mosfet-cs",
    "familyName": "MOSFET Common-Source Configurations (Slides 105-114)",
    "circuitId": "mosfet-cs-divider",
    "branchId": "branch-finite-ro-cs",
    "variationName": "CS Stage (Finite ro, λ > 0)",
    "slide": "Slide 108 (Ex 4.3)",
    "zi": "R_1 \\parallel R_2",
    "zo": "R_D \\parallel r_o",
    "av": "-g_m (R_D \\parallel r_o)",
    "ai": "\\infty",
    "whatChanged": "Added channel-length modulation (λ > 0), lowering output resistance and gain"
  },
  {
    "family": "mosfet-cs",
    "familyName": "MOSFET Common-Source Configurations (Slides 105-114)",
    "circuitId": "mosfet-cs-divider",
    "branchId": "branch-add-rsi",
    "variationName": "CS Stage (Generator Resistance RSi > 0)",
    "slide": "Slide 106 & 108",
    "zi": "R_1 \\parallel R_2",
    "zo": "R_D \\parallel r_o",
    "av": "-g_m (r_o \\parallel R_D) \\frac{R_i}{R_i + R_{Si}}",
    "ai": "\\infty",
    "whatChanged": "Signal generator resistance RSi forms input divider with Ri, attenuating gate voltage"
  },
  {
    "family": "mosfet-cs",
    "familyName": "MOSFET Common-Source Configurations (Slides 105-114)",
    "circuitId": "mosfet-cs-divider",
    "branchId": "branch-cs-load",
    "variationName": "CS Stage (With External Load RL)",
    "slide": "Slide 106 (Coupled Load)",
    "zi": "R_1 \\parallel R_2",
    "zo": "R_D \\parallel r_o",
    "av": "-g_m (r_o \\parallel R_D \\parallel R_L) \\frac{R_i}{R_i + R_{Si}}",
    "ai": "A_v \\frac{R_i}{R_L}",
    "whatChanged": "Connected AC load RL at drain output terminal"
  },
  {
    "family": "mosfet-cs",
    "familyName": "MOSFET Common-Source Configurations (Slides 105-114)",
    "circuitId": "mosfet-cs-degen",
    "branchId": null,
    "variationName": "CS with Source Degeneration (Unbypassed RS)",
    "slide": "Slide 112 (Razavi Ch 3)",
    "zi": "R_1 \\parallel R_2 \\text{ or } \\infty",
    "zo": "R_D",
    "av": "-\\frac{g_m R_D}{1 + g_m R_S} \\approx -\\frac{R_D}{R_S}",
    "ai": "\\infty",
    "whatChanged": "Unbypassed RS provides negative feedback, stabilizing gain against gm drift"
  },
  {
    "family": "mosfet-cs",
    "familyName": "MOSFET Common-Source Configurations (Slides 105-114)",
    "circuitId": "mosfet-cs-degen",
    "branchId": "branch-bypass-rs",
    "variationName": "CS with Bypassed RS (Capacitor CS)",
    "slide": "Slide 114 (Neaman Fig 3.30)",
    "zi": "R_1 \\parallel R_2",
    "zo": "R_D",
    "av": "-g_m R_D",
    "ai": "\\infty",
    "whatChanged": "Added bypass capacitor CS across RS: restores maximum stage voltage gain"
  },
  {
    "family": "mosfet-cs",
    "familyName": "MOSFET Common-Source Configurations (Slides 105-114)",
    "circuitId": "mosfet-cs-degen",
    "branchId": "branch-active-cs-load",
    "variationName": "CS with Active Current-Source Load",
    "slide": "Slide 113 (Razavi)",
    "zi": "R_1 \\parallel R_2",
    "zo": "r_{o1} \\parallel r_{o2}",
    "av": "-g_{m1}(r_{o1} \\parallel r_{o2})",
    "ai": "\\infty",
    "whatChanged": "Replaced passive RD with PMOS current source for ultra-high dynamic load resistance"
  },
  {
    "family": "mosfet-cs",
    "familyName": "MOSFET Common-Source Configurations (Slides 105-114)",
    "circuitId": "mosfet-cs-degen",
    "branchId": "branch-diode-load",
    "variationName": "CS with Diode-Connected PMOS Load",
    "slide": "Slide 113 (Razavi)",
    "zi": "R_1 \\parallel R_2",
    "zo": "\\frac{1}{g_{m2}} \\parallel r_{o1} \\approx \\frac{1}{g_{m2}}",
    "av": "-\\frac{g_{m1}}{g_{m2}} = -\\sqrt{\\frac{(W/L)_1}{(W/L)_2}}",
    "ai": "\\infty",
    "whatChanged": "Replaced RD with diode-connected PMOS: gain is set purely by transistor aspect ratio geometry"
  },
  {
    "family": "mosfet-cd-cg",
    "familyName": "Common-Drain & Common-Gate Amplifiers (Slides 115-127)",
    "circuitId": "mosfet-source-follower",
    "branchId": null,
    "variationName": "Source Follower (Unloaded Buffer)",
    "slide": "Slides 118 & 120",
    "zi": "R_1 \\parallel R_2",
    "zo": "R_S \\parallel \\frac{1}{g_m}",
    "av": "\\frac{g_m R_S}{1 + g_m R_S} < 1",
    "ai": "\\infty",
    "whatChanged": "Output taken at source: high Ri, low Ro buffer, in-phase near-unity voltage gain"
  },
  {
    "family": "mosfet-cd-cg",
    "familyName": "Common-Drain & Common-Gate Amplifiers (Slides 115-127)",
    "circuitId": "mosfet-source-follower",
    "branchId": "branch-sf-load",
    "variationName": "Source Follower (With External Load RL)",
    "slide": "Slide 122 (Ex 4.9)",
    "zi": "R_1 \\parallel R_2",
    "zo": "(R_S \\parallel R_L) \\parallel \\frac{1}{g_m}",
    "av": "\\frac{g_m (R_S \\parallel R_L)}{1 + g_m (R_S \\parallel R_L)}",
    "ai": "A_v \\frac{R_i}{R_L}",
    "whatChanged": "Connected external load RL at source: output resistance resists gain degradation"
  },
  {
    "family": "mosfet-cd-cg",
    "familyName": "Common-Drain & Common-Gate Amplifiers (Slides 115-127)",
    "circuitId": "mosfet-source-follower",
    "branchId": "branch-sf-current-source",
    "variationName": "Source Follower (Active Current Source Bias)",
    "slide": "Slide 121 (TYU 4.13)",
    "zi": "R_1 \\parallel R_2",
    "zo": "r_o \\parallel \\frac{1}{g_m} \\approx \\frac{1}{g_m}",
    "av": "\\frac{g_m r_o}{1 + g_m r_o} \\approx 1",
    "ai": "\\infty",
    "whatChanged": "Replaced RS with constant current source IQ: near-infinite dynamic pull-down raises gain closer to 1.0"
  },
  {
    "family": "mosfet-cd-cg",
    "familyName": "Common-Drain & Common-Gate Amplifiers (Slides 115-127)",
    "circuitId": "mosfet-common-gate",
    "branchId": null,
    "variationName": "Common-Gate Amplifier (Base Stage)",
    "slide": "Slide 124 (Razavi)",
    "zi": "\\frac{1}{g_m}",
    "zo": "R_D",
    "av": "\\frac{g_m R_D}{1 + g_m R_{Si}}",
    "ai": "\\frac{g_m R_{Si}}{1 + g_m R_{Si}}",
    "whatChanged": "Gate AC grounded, input at source: very low Ri = 1/gm, non-inverting gain"
  },
  {
    "family": "mosfet-cd-cg",
    "familyName": "Common-Drain & Common-Gate Amplifiers (Slides 115-127)",
    "circuitId": "mosfet-common-gate",
    "branchId": "branch-cg-load",
    "variationName": "Common-Gate Amplifier (With External Load RL)",
    "slide": "Slides 125 & 126",
    "zi": "\\frac{1}{g_m}",
    "zo": "R_D \\parallel R_L",
    "av": "\\frac{g_m (R_D \\parallel R_L)}{1 + g_m R_{Si}}",
    "ai": "\\frac{R_D}{R_D + R_L}\\frac{g_m R_{Si}}{1 + g_m R_{Si}}",
    "whatChanged": "Connected external AC load RL at drain output terminal"
  },
  {
    "family": "mosfet-cd-cg",
    "familyName": "Common-Drain & Common-Gate Amplifiers (Slides 115-127)",
    "circuitId": "mosfet-common-gate",
    "branchId": "branch-cg-ideal-source",
    "variationName": "Common-Gate Amplifier (Current Drive RSi → ∞)",
    "slide": "Slide 125 (Unity Current Buffer)",
    "zi": "\\frac{1}{g_m}",
    "zo": "R_D",
    "av": "\\frac{R_D}{R_{Si}} \\to 0",
    "ai": "\\frac{R_D}{R_D + R_L} \\approx 1",
    "whatChanged": "Driven by high-impedance current source: functions as high-speed unity current buffer"
  },
  {
    "family": "diff-mirrors",
    "familyName": "Current Mirrors & Differential Amplifiers (Slides 128-154)",
    "circuitId": "mosfet-current-mirror",
    "branchId": null,
    "variationName": "Matched NMOS Mirror ((W/L)1 = (W/L)REF, λ = 0)",
    "slide": "Slides 129 & 130",
    "zi": "\\frac{1}{g_{m,\\text{ref}}}",
    "zo": "\\infty",
    "av": "N/A \\text{ (Current Source)}",
    "ai": "I_{\\text{copy}} = I_{\\text{REF}}",
    "whatChanged": "Base 1:1 matched mirror: identical VGS generates identical saturation current"
  },
  {
    "family": "diff-mirrors",
    "familyName": "Current Mirrors & Differential Amplifiers (Slides 128-154)",
    "circuitId": "mosfet-current-mirror",
    "branchId": "branch-scaling-ratio",
    "variationName": "Scaled NMOS Current Mirror ((W/L)1 ≠ (W/L)REF)",
    "slide": "Slide 133 (Ex 01)",
    "zi": "\\frac{1}{g_{m,\\text{ref}}}",
    "zo": "\\infty",
    "av": "N/A",
    "ai": "I_{\\text{copy}} = I_{\\text{REF}} \\frac{(W/L)_1}{(W/L)_{\\text{REF}}}",
    "whatChanged": "Scaled output transistor aspect ratio: copies current with precise geometric multiplication"
  },
  {
    "family": "diff-mirrors",
    "familyName": "Current Mirrors & Differential Amplifiers (Slides 128-154)",
    "circuitId": "mosfet-current-mirror",
    "branchId": "branch-clm-error",
    "variationName": "NMOS Current Mirror with Channel-Length Modulation (λ > 0)",
    "slide": "Slide 131",
    "zi": "\\frac{1}{g_{m,\\text{ref}}}",
    "zo": "r_{o1} = \\frac{1}{\\lambda I_{\\text{copy}}}",
    "av": "N/A",
    "ai": "I_{\\text{copy}} = I_{\\text{REF}} \\frac{W_1}{W_{\\text{ref}}} \\left( \\frac{1 + \\lambda V_{DS1}}{1 + \\lambda V_{GS}} \\right)",
    "whatChanged": "Finite Early voltage / λ creates finite Rout and copying error when VDS1 ≠ VGS"
  },
  {
    "family": "diff-mirrors",
    "familyName": "Current Mirrors & Differential Amplifiers (Slides 128-154)",
    "circuitId": "mosfet-current-mirror",
    "branchId": "branch-pmos-mirror",
    "variationName": "PMOS High-Side Current Mirror",
    "slide": "Slide 132",
    "zi": "\\frac{1}{g_{mp}}",
    "zo": "r_{op}",
    "av": "N/A",
    "ai": "I_{\\text{source}} = I_{\\text{REF}} \\frac{(W/L)_p}{(W/L)_{\\text{ref}}}",
    "whatChanged": "Swapped NMOS for PMOS: sources current from positive rail VDD instead of sinking"
  },
  {
    "family": "diff-mirrors",
    "familyName": "Current Mirrors & Differential Amplifiers (Slides 128-154)",
    "circuitId": "mosfet-diff-pair",
    "branchId": null,
    "variationName": "MOS Diff Pair with Resistive Load (Matched, ΔRD = 0)",
    "slide": "Slides 138-147 (Razavi Ch 10)",
    "zi": "\\infty \\text{ (Differential Gate)}",
    "zo": "R_D \\text{ (per side)}",
    "av": "A_{dm} = -g_m R_D",
    "ai": "\\infty",
    "whatChanged": "Symmetric source-coupled pair with tail current ISS; rejects common-mode input variations"
  },
  {
    "family": "diff-mirrors",
    "familyName": "Current Mirrors & Differential Amplifiers (Slides 128-154)",
    "circuitId": "mosfet-diff-pair",
    "branchId": "branch-mismatch-cmrr",
    "variationName": "MOS Diff Pair (CMRR Analysis with Mismatch ΔRD)",
    "slide": "Slides 148-152 (CMRR)",
    "zi": "\\infty",
    "zo": "R_D",
    "av": "CMRR = \\frac{R_D}{\\Delta R_D}(1 + 2 g_m R_{SS})",
    "ai": "\\infty",
    "whatChanged": "Load resistor mismatch ΔRD and finite RSS convert common-mode noise into differential offset"
  },
  {
    "family": "diff-mirrors",
    "familyName": "Current Mirrors & Differential Amplifiers (Slides 128-154)",
    "circuitId": "mosfet-diff-active",
    "branchId": null,
    "variationName": "Diff Amplifier with Active Current-Mirror Load",
    "slide": "Slides 153-154 (Razavi)",
    "zi": "\\infty",
    "zo": "r_{o2} \\parallel r_{o4}",
    "av": "A_v = g_m (r_{o2} \\parallel r_{o4})",
    "ai": "\\infty",
    "whatChanged": "PMOS mirror load doubles signal current (Iout = 2ΔI = gm*vid) and converts to single-ended output"
  },
  {
    "family": "diff-mirrors",
    "familyName": "Current Mirrors & Differential Amplifiers (Slides 128-154)",
    "circuitId": "mosfet-diff-active",
    "branchId": "branch-active-loaded",
    "variationName": "Active Load Diff Amp (With External Load RL)",
    "slide": "Slide 153 (Loaded)",
    "zi": "\\infty",
    "zo": "r_{o2} \\parallel r_{o4} \\parallel R_L",
    "av": "A_v = g_m (r_{o2} \\parallel r_{o4} \\parallel R_L)",
    "ai": "A_v \\frac{R_i}{R_L}",
    "whatChanged": "External resistive load RL shunts high active output impedance ro2 || ro4"
  }
];

class FormulasPage {
  constructor() {
    this.searchQuery = '';
    this.init();
  }

  init() {
    this.render();
    const searchInput = document.getElementById('formulaSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase();
        this.render();
      });
    }
  }

  render() {
    const container = document.getElementById('formulasTableContainer');
    if (!container) return;

    // Filter items
    const filtered = formulasTableData.filter(item => {
      if (!this.searchQuery) return true;
      const q = this.searchQuery;
      return item.variationName.toLowerCase().includes(q) ||
             item.familyName.toLowerCase().includes(q) ||
             item.slide.toLowerCase().includes(q) ||
             item.whatChanged.toLowerCase().includes(q);
    });

    // Group by family
    const families = {};
    filtered.forEach(item => {
      if (!families[item.familyName]) families[item.familyName] = [];
      families[item.familyName].push(item);
    });

    let html = '';

    if (Object.keys(families).length === 0) {
      container.innerHTML = `
        <div style="padding:40px; text-align:center; color:var(--text-muted);">
          No circuit formulas matched "<strong>${this.searchQuery}</strong>".
        </div>
      `;
      return;
    }

    Object.keys(families).forEach(famName => {
      const items = families[famName];
      html += `
        <div class="card" style="margin-bottom:28px; overflow-x:auto;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; border-bottom:1px solid var(--border-subtle); padding-bottom:10px;">
            <h4 style="color:#fff; font-size:1.05rem; margin:0;">
              ${famName}
            </h4>
            <span class="status-badge" style="background:rgba(56,189,248,0.15); color:var(--accent-cyan);">
              ${items.length} Configurations
            </span>
          </div>
          <table style="width:100%; border-collapse:collapse; font-size:0.86rem; text-align:left;">
            <thead>
              <tr style="border-bottom:1px solid var(--border-card); color:var(--accent-cyan); font-family:var(--font-mono); font-size:0.78rem;">
                <th style="padding:10px 12px; width:150px;">Circuit Schematic</th>
                <th style="padding:10px 12px; width:180px;">Circuit / Variation</th>
                <th style="padding:10px 12px; width:90px;">Slide Ref</th>
                <th style="padding:10px 12px; min-width:130px;">Input Impedance Zi</th>
                <th style="padding:10px 12px; min-width:120px;">Output Impedance Zo</th>
                <th style="padding:10px 12px; min-width:140px;">Voltage Gain Av</th>
                <th style="padding:10px 12px; max-width:200px;">What Changed</th>
                <th style="padding:10px 12px; text-align:right;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(r => `
                <tr style="border-bottom:1px solid rgba(255,255,255,0.04); transition:background 0.15s ease;">
                  <td style="padding:8px 12px; vertical-align:middle;">
                    <div style="width:140px; height:95px; background:#09090b; border:1px solid #27272a; border-radius:6px; overflow:hidden; display:flex; align-items:center; justify-content:center; cursor:pointer;"
                         onclick="window.launchCircuit('${r.circuitId}', '${r.branchId || ''}')" title="Click to open in Circuit Studio">
                      ${typeof getCircuitSvg === 'function' ? getCircuitSvg(r.circuitId, r.branchId, null, 140, 95) : '<span style="font-size:0.75rem; color:#71717a;">Schematic</span>'}
                    </div>
                  </td>
                  <td style="padding:12px; font-weight:600; color:#fff; vertical-align:middle;">
                    ${r.variationName}
                  </td>
                  <td style="padding:12px; font-family:var(--font-mono); font-size:0.75rem; color:var(--text-dim); white-space:nowrap; vertical-align:middle;">
                    ${r.slide}
                  </td>
                  <td style="padding:12px; font-family:var(--font-mono); color:var(--text-code); vertical-align:middle;">
                    <div class="eq-inline" data-tex="${r.zi.replace(/"/g, '&quot;')}">${r.zi}</div>
                  </td>
                  <td style="padding:12px; font-family:var(--font-mono); color:var(--text-code); vertical-align:middle;">
                    <div class="eq-inline" data-tex="${r.zo.replace(/"/g, '&quot;')}">${r.zo}</div>
                  </td>
                  <td style="padding:12px; font-family:var(--font-mono); color:var(--text-code); vertical-align:middle;">
                    <div class="eq-inline" data-tex="${r.av.replace(/"/g, '&quot;')}">${r.av}</div>
                  </td>
                  <td style="padding:12px; font-size:0.82rem; color:var(--text-muted); max-width:200px; vertical-align:middle;">
                    ${r.whatChanged}
                  </td>
                  <td style="padding:12px; text-align:right; vertical-align:middle;">
                    <a href="studio.html#circuit-studio" class="btn sm" onclick="window.launchCircuit('${r.circuitId}', '${r.branchId || ''}')" style="font-size:0.75rem; white-space:nowrap;">
                      Explore Studio →
                    </a>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    });

    container.innerHTML = html;

    // Render KaTeX formulas: directly render all .eq-inline elements
    if (window.katex) {
      container.querySelectorAll('.eq-inline').forEach(el => {
        const tex = el.getAttribute('data-tex');
        if (tex) {
          try {
            katex.render(tex, el, { displayMode: false, throwOnError: false });
          } catch(e) {
            el.textContent = tex;
          }
        }
      });

    }
  }
}

window.FormulasPage = FormulasPage;
window.launchCircuit = function(circuitId, branchId) { window.location.href = `studio.html#circuit-studio`;
  if (window.circuitStudio) {
    window.circuitStudio.selectCircuit(circuitId);
    if (branchId) {
      window.circuitStudio.currentBranchId = branchId;
      window.circuitStudio.renderBranchSelector();
      window.circuitStudio.renderSchematic();
      window.circuitStudio.renderEquations();
      window.circuitStudio.renderCalculator();
    }
    // Also scroll smoothly into view
    const el = document.getElementById('circuit-studio');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
};
