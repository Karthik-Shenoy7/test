/* ==========================================================================
   circuit-studio.js - Interactive Circuit Studio & Derivation Explorer
   Curriculum: 25ECE211 (Analog Electronic Circuits I)
   Stage 1: BJT Small-Signal Analysis
   Stage 2: MOSFET Amplifiers (CS, CD, CG)
   Stage 3: Current Mirrors & Differential Amplifiers
   ========================================================================== */

// Helper to generate SVG schematic for any circuit & branch
function getCircuitSvg(circuitId, branchId, activeComp, width, height) {
  width = width || 380;
  height = height || 260;
  const isMini = width < 250;
  const svgWidth = isMini ? width : '100%';
  const svgHeight = isMini ? height : '100%';

  const bgFill = (comp) => activeComp === comp ? '#3f3f46' : '#27272a';
  const strokeColor = (comp, isChanged) => isChanged ? '#f43f5e' : (activeComp === comp ? '#fafafa' : '#71717a');

  // 1. BJT CE Fixed
  if (circuitId === 'bjt-ce-fixed') {
    const isRo = branchId === 'branch-finite-ro';
    const isRl = branchId === 'branch-finite-rl';
    return `
      <svg viewBox="0 0 380 270" width="${svgWidth}" height="${svgHeight}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="background:#09090b; border-radius:4px; max-width:100%; height:auto;">
        <line x1="80" y1="20" x2="280" y2="20" stroke="#f59e0b" stroke-width="2"/>
        <text x="180" y="15" fill="#f59e0b" font-size="11" font-family="monospace" text-anchor="middle">VCC</text>
        <line x1="120" y1="20" x2="120" y2="45" stroke="#a1a1aa" stroke-width="2"/>
        <g class="comp-click" data-comp="rb">
          <rect x="110" y="45" width="20" height="40" fill="${bgFill('rb')}" stroke="${strokeColor('rb')}" stroke-width="2"/>
          <text x="88" y="70" fill="#fafafa" font-size="11" font-family="monospace">RB</text>
        </g>
        <line x1="120" y1="85" x2="120" y2="135" stroke="#a1a1aa" stroke-width="2"/>
        <line x1="220" y1="20" x2="220" y2="45" stroke="#a1a1aa" stroke-width="2"/>
        <g class="comp-click" data-comp="rc">
          <rect x="210" y="45" width="20" height="40" fill="${bgFill('rc')}" stroke="${strokeColor('rc')}" stroke-width="2"/>
          <text x="238" y="70" fill="#fafafa" font-size="11" font-family="monospace">RC</text>
        </g>
        <line x1="220" y1="85" x2="220" y2="115" stroke="#a1a1aa" stroke-width="2"/>
        <line x1="120" y1="135" x2="175" y2="135" stroke="#a1a1aa" stroke-width="2"/>
        <line x1="120" y1="135" x2="50" y2="135" stroke="#a1a1aa" stroke-width="2"/>
        <line x1="50" y1="127" x2="50" y2="143" stroke="#fafafa" stroke-width="2"/>
        <line x1="56" y1="127" x2="56" y2="143" stroke="#fafafa" stroke-width="2"/>
        <circle cx="25" cy="135" r="3" fill="#fbbf24"/>
        <text x="18" y="125" fill="#fbbf24" font-size="11" font-family="monospace">Vi</text>
        <g class="comp-click" data-comp="beta">
          <line x1="175" y1="120" x2="175" y2="150" stroke="#f1f5f9" stroke-width="3"/>
          <line x1="175" y1="125" x2="220" y2="115" stroke="#a1a1aa" stroke-width="2"/>
          <line x1="175" y1="145" x2="220" y2="155" stroke="#a1a1aa" stroke-width="2"/>
          <polygon points="212,151 220,155 215,160" fill="#10b981"/>
          <text x="182" y="142" fill="#10b981" font-size="10" font-family="monospace">β</text>
        </g>
        <circle cx="220" cy="115" r="3" fill="#fafafa"/>
        <line x1="220" y1="115" x2="270" y2="115" stroke="#fafafa" stroke-width="2"/>
        <line x1="270" y1="107" x2="270" y2="123" stroke="#fafafa" stroke-width="2"/>
        <line x1="276" y1="107" x2="276" y2="123" stroke="#fafafa" stroke-width="2"/>
        <line x1="276" y1="115" x2="330" y2="115" stroke="#fafafa" stroke-width="2"/>
        <text x="338" y="119" fill="#fafafa" font-size="12" font-family="monospace">Vo</text>
        <line x1="220" y1="155" x2="220" y2="230" stroke="#a1a1aa" stroke-width="2"/>
        <line x1="205" y1="230" x2="235" y2="230" stroke="#a1a1aa" stroke-width="2"/>
        <line x1="210" y1="235" x2="230" y2="235" stroke="#a1a1aa" stroke-width="2"/>
        ${isRo ? `
          <g class="comp-click" data-comp="ro">
            <line x1="220" y1="115" x2="255" y2="115" stroke="#f43f5e" stroke-width="1.5" stroke-dasharray="3,3"/>
            <line x1="255" y1="115" x2="255" y2="135" stroke="#f43f5e" stroke-width="1.5"/>
            <rect x="247" y="135" width="16" height="35" fill="#881337" stroke="#f43f5e" stroke-width="2"/>
            <text x="268" y="157" fill="#f43f5e" font-size="10" font-family="monospace">ro</text>
            <line x1="255" y1="170" x2="255" y2="200" stroke="#f43f5e" stroke-width="1.5"/>
            <line x1="255" y1="200" x2="220" y2="200" stroke="#f43f5e" stroke-width="1.5" stroke-dasharray="3,3"/>
          </g>
        ` : ''}
        ${isRl ? `
          <g class="comp-click" data-comp="rl">
            <line x1="330" y1="115" x2="330" y2="150" stroke="#34d399" stroke-width="1.5"/>
            <rect x="322" y="150" width="16" height="35" fill="#064e3b" stroke="#34d399" stroke-width="2"/>
            <text x="344" y="172" fill="#34d399" font-size="10" font-family="monospace">RL</text>
            <line x1="330" y1="185" x2="330" y2="220" stroke="#34d399" stroke-width="1.5"/>
            <line x1="320" y1="220" x2="340" y2="220" stroke="#34d399" stroke-width="2"/>
          </g>
        ` : ''}
      </svg>
    `;
  }

  // 2. BJT CE Voltage Divider
  if (circuitId === 'bjt-ce-divider') {
    const isNoCe = branchId === 'branch-remove-ce';
    return `
      <svg viewBox="0 0 380 270" width="${svgWidth}" height="${svgHeight}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="background:#09090b; border-radius:4px; max-width:100%; height:auto;">
        <line x1="80" y1="20" x2="280" y2="20" stroke="#f59e0b" stroke-width="2"/>
        <text x="180" y="15" fill="#f59e0b" font-size="11" font-family="monospace" text-anchor="middle">VCC</text>
        <line x1="120" y1="20" x2="120" y2="40" stroke="#a1a1aa" stroke-width="2"/>
        <rect x="110" y="40" width="20" height="36" fill="${bgFill('r1')}" stroke="${strokeColor('r1')}" stroke-width="2"/>
        <text x="88" y="62" fill="#fafafa" font-size="11" font-family="monospace">R1</text>
        <line x1="120" y1="76" x2="120" y2="125" stroke="#a1a1aa" stroke-width="2"/>
        <rect x="110" y="125" width="20" height="36" fill="${bgFill('r2')}" stroke="${strokeColor('r2')}" stroke-width="2"/>
        <text x="88" y="148" fill="#fafafa" font-size="11" font-family="monospace">R2</text>
        <line x1="120" y1="161" x2="120" y2="230" stroke="#a1a1aa" stroke-width="2"/>
        <line x1="110" y1="230" x2="130" y2="230" stroke="#a1a1aa" stroke-width="2"/>
        <line x1="220" y1="20" x2="220" y2="40" stroke="#a1a1aa" stroke-width="2"/>
        <rect x="210" y="40" width="20" height="36" fill="${bgFill('rc')}" stroke="${strokeColor('rc')}" stroke-width="2"/>
        <text x="238" y="62" fill="#fafafa" font-size="11" font-family="monospace">RC</text>
        <line x1="220" y1="76" x2="220" y2="105" stroke="#a1a1aa" stroke-width="2"/>
        <line x1="120" y1="100" x2="175" y2="100" stroke="#a1a1aa" stroke-width="2"/>
        <line x1="120" y1="100" x2="60" y2="100" stroke="#a1a1aa" stroke-width="2"/>
        <line x1="60" y1="92" x2="60" y2="108" stroke="#fafafa" stroke-width="2"/>
        <line x1="66" y1="92" x2="66" y2="108" stroke="#fafafa" stroke-width="2"/>
        <circle cx="30" cy="100" r="3" fill="#fbbf24"/>
        <text x="20" y="92" fill="#fbbf24" font-size="11" font-family="monospace">Vi</text>
        <line x1="175" y1="88" x2="175" y2="114" stroke="#f1f5f9" stroke-width="3"/>
        <line x1="175" y1="93" x2="220" y2="105" stroke="#a1a1aa" stroke-width="2"/>
        <line x1="175" y1="109" x2="220" y2="120" stroke="#a1a1aa" stroke-width="2"/>
        <polygon points="212,117 220,120 215,124" fill="#10b981"/>
        <circle cx="220" cy="105" r="3" fill="#fafafa"/>
        <line x1="220" y1="105" x2="290" y2="105" stroke="#fafafa" stroke-width="2"/>
        <text x="300" y="109" fill="#fafafa" font-size="12" font-family="monospace">Vo</text>
        <line x1="220" y1="120" x2="220" y2="155" stroke="#a1a1aa" stroke-width="2"/>
        <rect x="210" y="155" width="20" height="36" fill="${bgFill('re')}" stroke="${isNoCe ? '#f43f5e' : strokeColor('re')}" stroke-width="2"/>
        <text x="238" y="176" fill="#fafafa" font-size="11" font-family="monospace">RE</text>
        <line x1="220" y1="191" x2="220" y2="230" stroke="#a1a1aa" stroke-width="2"/>
        <line x1="210" y1="230" x2="230" y2="230" stroke="#a1a1aa" stroke-width="2"/>
        ${!isNoCe ? `
          <line x1="220" y1="140" x2="270" y2="140" stroke="#fafafa" stroke-width="1.5"/>
          <line x1="270" y1="140" x2="270" y2="160" stroke="#fafafa" stroke-width="1.5"/>
          <line x1="262" y1="160" x2="278" y2="160" stroke="#fafafa" stroke-width="2"/>
          <line x1="262" y1="166" x2="278" y2="166" stroke="#fafafa" stroke-width="2"/>
          <text x="286" y="166" fill="#fafafa" font-size="10" font-family="monospace">CE</text>
          <line x1="270" y1="166" x2="270" y2="210" stroke="#fafafa" stroke-width="1.5"/>
          <line x1="270" y1="210" x2="220" y2="210" stroke="#fafafa" stroke-width="1.5"/>
        ` : `
          <text x="255" y="150" fill="#f43f5e" font-size="10" font-family="monospace">CE REMOVED</text>
        `}
      </svg>
    `;
  }

  // 3. BJT Emitter Follower
  if (circuitId === 'bjt-emitter-follower') {
    const isRl = branchId === 'branch-ef-load';
    return `
      <svg viewBox="0 0 380 270" width="${svgWidth}" height="${svgHeight}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="background:#09090b; border-radius:4px; max-width:100%; height:auto;">
        <line x1="80" y1="20" x2="280" y2="20" stroke="#f59e0b" stroke-width="2"/>
        <text x="180" y="15" fill="#f59e0b" font-size="11" font-family="monospace" text-anchor="middle">VCC</text>
        <line x1="120" y1="20" x2="120" y2="45" stroke="#a1a1aa" stroke-width="2"/>
        <rect x="110" y="45" width="20" height="40" fill="${bgFill('rb')}" stroke="${strokeColor('rb')}" stroke-width="2"/>
        <text x="88" y="70" fill="#fafafa" font-size="11" font-family="monospace">RB</text>
        <line x1="120" y1="85" x2="120" y2="110" stroke="#a1a1aa" stroke-width="2"/>
        <line x1="120" y1="110" x2="50" y2="110" stroke="#a1a1aa" stroke-width="2"/>
        <line x1="50" y1="102" x2="50" y2="118" stroke="#fafafa" stroke-width="2"/>
        <line x1="56" y1="102" x2="56" y2="118" stroke="#fafafa" stroke-width="2"/>
        <circle cx="25" cy="110" r="3" fill="#fbbf24"/>
        <text x="18" y="100" fill="#fbbf24" font-size="11" font-family="monospace">Vi</text>
        <line x1="120" y1="110" x2="175" y2="110" stroke="#a1a1aa" stroke-width="2"/>
        <line x1="220" y1="20" x2="220" y2="100" stroke="#a1a1aa" stroke-width="2"/>
        <line x1="175" y1="95" x2="175" y2="125" stroke="#f1f5f9" stroke-width="3"/>
        <line x1="175" y1="100" x2="220" y2="100" stroke="#a1a1aa" stroke-width="2"/>
        <line x1="175" y1="120" x2="220" y2="135" stroke="#a1a1aa" stroke-width="2"/>
        <polygon points="212,131 220,135 215,140" fill="#10b981"/>
        <circle cx="220" cy="135" r="3" fill="#fafafa"/>
        <line x1="220" y1="135" x2="290" y2="135" stroke="#fafafa" stroke-width="2"/>
        <text x="300" y="139" fill="#fafafa" font-size="11" font-family="monospace">Vo (Buffer)</text>
        <line x1="220" y1="135" x2="220" y2="165" stroke="#a1a1aa" stroke-width="2"/>
        <rect x="210" y="165" width="20" height="40" fill="${bgFill('re')}" stroke="${strokeColor('re')}" stroke-width="2"/>
        <text x="238" y="190" fill="#fafafa" font-size="11" font-family="monospace">RE</text>
        <line x1="220" y1="205" x2="220" y2="235" stroke="#a1a1aa" stroke-width="2"/>
        <line x1="210" y1="235" x2="230" y2="235" stroke="#a1a1aa" stroke-width="2"/>
        ${isRl ? `
          <line x1="290" y1="135" x2="290" y2="170" stroke="#34d399" stroke-width="1.5"/>
          <rect x="282" y="170" width="16" height="35" fill="#064e3b" stroke="#34d399" stroke-width="2"/>
          <text x="304" y="190" fill="#34d399" font-size="10" font-family="monospace">RL</text>
          <line x1="290" y1="205" x2="290" y2="235" stroke="#34d399" stroke-width="1.5"/>
          <line x1="280" y1="235" x2="300" y2="235" stroke="#34d399" stroke-width="2"/>
        ` : ''}
      </svg>
    `;
  }

  // 4. MOSFET CS Divider
  if (circuitId === 'mosfet-cs-divider') {
    const isRsiZero = branchId === 'branch-ideal-source';
    return `
      <svg viewBox="0 0 380 270" width="${svgWidth}" height="${svgHeight}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="background:#09090b; border-radius:4px; max-width:100%; height:auto;">
        <line x1="80" y1="20" x2="280" y2="20" stroke="#f59e0b" stroke-width="2"/>
        <text x="180" y="15" fill="#f59e0b" font-size="11" font-family="monospace" text-anchor="middle">VDD = 10V</text>
        <line x1="120" y1="20" x2="120" y2="40" stroke="#a1a1aa" stroke-width="2"/>
        <rect x="110" y="40" width="20" height="36" fill="${bgFill('r1')}" stroke="${strokeColor('r1')}" stroke-width="2"/>
        <text x="88" y="62" fill="#fafafa" font-size="11" font-family="monospace">R1</text>
        <line x1="120" y1="76" x2="120" y2="125" stroke="#a1a1aa" stroke-width="2"/>
        <rect x="110" y="125" width="20" height="36" fill="${bgFill('r2')}" stroke="${strokeColor('r2')}" stroke-width="2"/>
        <text x="88" y="148" fill="#fafafa" font-size="11" font-family="monospace">R2</text>
        <line x1="120" y1="161" x2="120" y2="230" stroke="#a1a1aa" stroke-width="2"/>
        <line x1="110" y1="230" x2="130" y2="230" stroke="#a1a1aa" stroke-width="2"/>
        <line x1="220" y1="20" x2="220" y2="40" stroke="#a1a1aa" stroke-width="2"/>
        <rect x="210" y="40" width="20" height="36" fill="${bgFill('rd')}" stroke="${strokeColor('rd')}" stroke-width="2"/>
        <text x="238" y="62" fill="#fafafa" font-size="11" font-family="monospace">RD</text>
        <line x1="220" y1="76" x2="220" y2="110" stroke="#a1a1aa" stroke-width="2"/>
        <line x1="120" y1="100" x2="165" y2="100" stroke="#a1a1aa" stroke-width="2"/>
        ${!isRsiZero ? `
          <rect x="50" y="93" width="24" height="14" fill="#27272a" stroke="#71717a" stroke-width="1.5"/>
          <text x="54" y="87" fill="#a1a1aa" font-size="9" font-family="monospace">RSi</text>
          <line x1="74" y1="100" x2="90" y2="100" stroke="#a1a1aa" stroke-width="1.5"/>
        ` : `
          <line x1="50" y1="100" x2="90" y2="100" stroke="#10b981" stroke-width="2"/>
        `}
        <line x1="90" y1="93" x2="90" y2="107" stroke="#fafafa" stroke-width="2"/>
        <line x1="95" y1="93" x2="95" y2="107" stroke="#fafafa" stroke-width="2"/>
        <line x1="95" y1="100" x2="120" y2="100" stroke="#a1a1aa" stroke-width="2"/>
        <circle cx="30" cy="100" r="3" fill="#fbbf24"/>
        <text x="18" y="94" fill="#fbbf24" font-size="11" font-family="monospace">Vi</text>
        <!-- NMOS Symbol -->
        <g class="comp-click" data-comp="kn">
          <line x1="165" y1="88" x2="165" y2="120" stroke="#fafafa" stroke-width="3"/>
          <line x1="172" y1="90" x2="172" y2="100" stroke="#f1f5f9" stroke-width="2.5"/>
          <line x1="172" y1="104" x2="172" y2="114" stroke="#f1f5f9" stroke-width="2.5"/>
          <line x1="172" y1="95" x2="220" y2="110" stroke="#a1a1aa" stroke-width="2"/>
          <line x1="172" y1="110" x2="220" y2="125" stroke="#a1a1aa" stroke-width="2"/>
          <polygon points="172,110 182,106 182,114" fill="#fafafa"/>
        </g>
        <circle cx="220" cy="110" r="3" fill="#fafafa"/>
        <line x1="220" y1="110" x2="290" y2="110" stroke="#fafafa" stroke-width="2"/>
        <text x="300" y="114" fill="#fafafa" font-size="12" font-family="monospace">Vo</text>
        <!-- Source to Ground -->
        <line x1="220" y1="125" x2="220" y2="230" stroke="#a1a1aa" stroke-width="2"/>
        <line x1="210" y1="230" x2="230" y2="230" stroke="#a1a1aa" stroke-width="2"/>
      </svg>
    `;
  }

  // 5. MOSFET CS with Degeneration
  if (circuitId === 'mosfet-cs-degen') {
    const isBypassed = branchId === 'branch-bypass-rs';
    return `
      <svg viewBox="0 0 380 270" width="${svgWidth}" height="${svgHeight}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="background:#09090b; border-radius:4px; max-width:100%; height:auto;">
        <line x1="100" y1="20" x2="260" y2="20" stroke="#f59e0b" stroke-width="2"/>
        <text x="180" y="15" fill="#f59e0b" font-size="11" font-family="monospace" text-anchor="middle">VDD</text>
        <line x1="180" y1="20" x2="180" y2="45" stroke="#a1a1aa" stroke-width="2"/>
        <rect x="170" y="45" width="20" height="36" fill="${bgFill('rd')}" stroke="${strokeColor('rd')}" stroke-width="2"/>
        <text x="198" y="67" fill="#fafafa" font-size="11" font-family="monospace">RD</text>
        <line x1="180" y1="81" x2="180" y2="105" stroke="#a1a1aa" stroke-width="2"/>
        <circle cx="180" cy="105" r="3" fill="#fafafa"/>
        <line x1="180" y1="105" x2="260" y2="105" stroke="#fafafa" stroke-width="2"/>
        <text x="270" y="109" fill="#fafafa" font-size="12" font-family="monospace">Vout</text>
        <!-- NMOS Transistor M1 -->
        <line x1="140" y1="100" x2="140" y2="128" stroke="#fafafa" stroke-width="3"/>
        <line x1="147" y1="102" x2="147" y2="110" stroke="#f1f5f9" stroke-width="2.5"/>
        <line x1="147" y1="118" x2="147" y2="126" stroke="#f1f5f9" stroke-width="2.5"/>
        <line x1="147" y1="106" x2="180" y2="105" stroke="#a1a1aa" stroke-width="2"/>
        <line x1="147" y1="122" x2="180" y2="135" stroke="#a1a1aa" stroke-width="2"/>
        <line x1="80" y1="114" x2="140" y2="114" stroke="#a1a1aa" stroke-width="2"/>
        <circle cx="70" cy="114" r="3" fill="#fbbf24"/>
        <text x="50" y="118" fill="#fbbf24" font-size="11" font-family="monospace">Vin</text>
        <line x1="180" y1="135" x2="180" y2="160" stroke="#a1a1aa" stroke-width="2"/>
        <rect x="170" y="160" width="20" height="36" fill="${bgFill('rs')}" stroke="${isBypassed ? '#f43f5e' : strokeColor('rs')}" stroke-width="2"/>
        <text x="198" y="182" fill="#fafafa" font-size="11" font-family="monospace">RS</text>
        <line x1="180" y1="196" x2="180" y2="230" stroke="#a1a1aa" stroke-width="2"/>
        <line x1="170" y1="230" x2="190" y2="230" stroke="#a1a1aa" stroke-width="2"/>
        ${isBypassed ? `
          <line x1="180" y1="148" x2="225" y2="148" stroke="#fafafa" stroke-width="1.5"/>
          <line x1="225" y1="148" x2="225" y2="168" stroke="#fafafa" stroke-width="1.5"/>
          <line x1="217" y1="168" x2="233" y2="168" stroke="#fafafa" stroke-width="2"/>
          <line x1="217" y1="174" x2="233" y2="174" stroke="#fafafa" stroke-width="2"/>
          <text x="238" y="174" fill="#fafafa" font-size="10" font-family="monospace">CS</text>
          <line x1="225" y1="174" x2="225" y2="215" stroke="#fafafa" stroke-width="1.5"/>
          <line x1="225" y1="215" x2="180" y2="215" stroke="#fafafa" stroke-width="1.5"/>
        ` : ''}
      </svg>
    `;
  }

  // 6. MOSFET Source Follower
  if (circuitId === 'mosfet-source-follower') {
    const isRl = branchId === 'branch-sf-load';
    return `
      <svg viewBox="0 0 380 270" width="${svgWidth}" height="${svgHeight}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="background:#09090b; border-radius:4px; max-width:100%; height:auto;">
        <line x1="80" y1="20" x2="280" y2="20" stroke="#f59e0b" stroke-width="2"/>
        <text x="180" y="15" fill="#f59e0b" font-size="11" font-family="monospace" text-anchor="middle">VDD</text>
        <line x1="120" y1="20" x2="120" y2="45" stroke="#a1a1aa" stroke-width="2"/>
        <rect x="110" y="45" width="20" height="38" fill="${bgFill('r1')}" stroke="${strokeColor('r1')}" stroke-width="2"/>
        <text x="88" y="68" fill="#fafafa" font-size="11" font-family="monospace">R1</text>
        <line x1="120" y1="83" x2="120" y2="125" stroke="#a1a1aa" stroke-width="2"/>
        <rect x="110" y="125" width="20" height="38" fill="${bgFill('r2')}" stroke="${strokeColor('r2')}" stroke-width="2"/>
        <text x="88" y="148" fill="#fafafa" font-size="11" font-family="monospace">R2</text>
        <line x1="120" y1="163" x2="120" y2="230" stroke="#a1a1aa" stroke-width="2"/>
        <line x1="110" y1="230" x2="130" y2="230" stroke="#a1a1aa" stroke-width="2"/>
        <line x1="220" y1="20" x2="220" y2="95" stroke="#a1a1aa" stroke-width="2"/>
        <line x1="120" y1="105" x2="165" y2="105" stroke="#a1a1aa" stroke-width="2"/>
        <circle cx="30" cy="105" r="3" fill="#fbbf24"/>
        <text x="20" y="98" fill="#fbbf24" font-size="11" font-family="monospace">Vi</text>
        <line x1="30" y1="105" x2="120" y2="105" stroke="#a1a1aa" stroke-width="2"/>
        <line x1="165" y1="92" x2="165" y2="122" stroke="#fafafa" stroke-width="3"/>
        <line x1="172" y1="95" x2="220" y2="95" stroke="#a1a1aa" stroke-width="2"/>
        <line x1="172" y1="118" x2="220" y2="125" stroke="#a1a1aa" stroke-width="2"/>
        <circle cx="220" cy="125" r="3" fill="#fafafa"/>
        <line x1="220" y1="125" x2="290" y2="125" stroke="#fafafa" stroke-width="2"/>
        <text x="300" y="129" fill="#fafafa" font-size="11" font-family="monospace">Vo (Buffer)</text>
        <line x1="220" y1="125" x2="220" y2="155" stroke="#a1a1aa" stroke-width="2"/>
        <rect x="210" y="155" width="20" height="38" fill="${bgFill('rs')}" stroke="${strokeColor('rs')}" stroke-width="2"/>
        <text x="238" y="178" fill="#fafafa" font-size="11" font-family="monospace">RS</text>
        <line x1="220" y1="193" x2="220" y2="230" stroke="#a1a1aa" stroke-width="2"/>
        <line x1="210" y1="230" x2="230" y2="230" stroke="#a1a1aa" stroke-width="2"/>
        ${isRl ? `
          <line x1="290" y1="125" x2="290" y2="160" stroke="#34d399" stroke-width="1.5"/>
          <rect x="282" y="160" width="16" height="35" fill="#064e3b" stroke="#34d399" stroke-width="2"/>
          <text x="304" y="180" fill="#34d399" font-size="10" font-family="monospace">RL</text>
          <line x1="290" y1="195" x2="290" y2="230" stroke="#34d399" stroke-width="1.5"/>
          <line x1="280" y1="230" x2="300" y2="230" stroke="#34d399" stroke-width="2"/>
        ` : ''}
      </svg>
    `;
  }

  // 7. MOSFET Common Gate
  if (circuitId === 'mosfet-common-gate') {
    return `
      <svg viewBox="0 0 380 270" width="${svgWidth}" height="${svgHeight}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="background:#09090b; border-radius:4px; max-width:100%; height:auto;">
        <line x1="120" y1="20" x2="260" y2="20" stroke="#f59e0b" stroke-width="2"/>
        <text x="190" y="15" fill="#f59e0b" font-size="11" font-family="monospace" text-anchor="middle">V+ = 5V</text>
        <line x1="220" y1="20" x2="220" y2="45" stroke="#a1a1aa" stroke-width="2"/>
        <rect x="210" y="45" width="20" height="36" fill="${bgFill('rd')}" stroke="${strokeColor('rd')}" stroke-width="2"/>
        <text x="238" y="67" fill="#fafafa" font-size="11" font-family="monospace">RD</text>
        <line x1="220" y1="81" x2="220" y2="105" stroke="#a1a1aa" stroke-width="2"/>
        <circle cx="220" cy="105" r="3" fill="#fafafa"/>
        <line x1="220" y1="105" x2="280" y2="105" stroke="#fafafa" stroke-width="2"/>
        <text x="290" y="109" fill="#fafafa" font-size="11" font-family="monospace">Vo</text>
        <!-- Gate grounded via CG -->
        <line x1="140" y1="100" x2="140" y2="130" stroke="#fafafa" stroke-width="3"/>
        <line x1="140" y1="115" x2="105" y2="115" stroke="#a1a1aa" stroke-width="2"/>
        <line x1="105" y1="108" x2="105" y2="122" stroke="#fafafa" stroke-width="2"/>
        <line x1="99" y1="108" x2="99" y2="122" stroke="#fafafa" stroke-width="2"/>
        <text x="95" y="98" fill="#fafafa" font-size="9" font-family="monospace">CG</text>
        <line x1="99" y1="115" x2="75" y2="115" stroke="#a1a1aa" stroke-width="2"/>
        <line x1="75" y1="108" x2="75" y2="122" stroke="#a1a1aa" stroke-width="2"/>
        <!-- Transistor leads -->
        <line x1="147" y1="105" x2="220" y2="105" stroke="#a1a1aa" stroke-width="2"/>
        <line x1="147" y1="125" x2="220" y2="135" stroke="#a1a1aa" stroke-width="2"/>
        <!-- Source Input -->
        <circle cx="220" cy="135" r="3" fill="#fbbf24"/>
        <line x1="220" y1="135" x2="220" y2="175" stroke="#a1a1aa" stroke-width="2"/>
        <circle cx="220" cy="175" r="4" fill="none" stroke="#fbbf24" stroke-width="2"/>
        <text x="235" y="180" fill="#fbbf24" font-size="10" font-family="monospace">IQ = 1mA</text>
        <line x1="220" y1="195" x2="220" y2="230" stroke="#f43f5e" stroke-width="2"/>
        <text x="190" y="242" fill="#f43f5e" font-size="11" font-family="monospace">V- = -5V</text>
      </svg>
    `;
  }

  // 8. MOSFET Current Mirror
  if (circuitId === 'mosfet-current-mirror') {
    return `
      <svg viewBox="0 0 380 270" width="${svgWidth}" height="${svgHeight}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="background:#09090b; border-radius:4px; max-width:100%; height:auto;">
        <line x1="60" y1="20" x2="320" y2="20" stroke="#f59e0b" stroke-width="2"/>
        <text x="190" y="15" fill="#f59e0b" font-size="11" font-family="monospace" text-anchor="middle">VDD</text>
        <!-- IREF Source -->
        <line x1="120" y1="20" x2="120" y2="50" stroke="#a1a1aa" stroke-width="2"/>
        <circle cx="120" cy="65" r="15" fill="none" stroke="#fbbf24" stroke-width="2"/>
        <polygon points="120,73 115,62 125,62" fill="#fbbf24"/>
        <text x="80" y="70" fill="#fbbf24" font-size="10" font-family="monospace">IREF</text>
        <line x1="120" y1="80" x2="120" y2="125" stroke="#a1a1aa" stroke-width="2"/>
        <!-- MREF Diode Connected -->
        <line x1="120" y1="125" x2="150" y2="125" stroke="#a1a1aa" stroke-width="2"/>
        <line x1="150" y1="110" x2="150" y2="140" stroke="#fafafa" stroke-width="3"/>
        <line x1="120" y1="100" x2="150" y2="100" stroke="#a1a1aa" stroke-width="2"/>
        <line x1="120" y1="100" x2="120" y2="125" stroke="#a1a1aa" stroke-width="2"/>
        <!-- Tie Gates Together -->
        <line x1="150" y1="125" x2="230" y2="125" stroke="#fafafa" stroke-width="2"/>
        <text x="180" y="120" fill="#fafafa" font-size="9" font-family="monospace" text-anchor="middle">Node X</text>
        <!-- M1 Output Transistor -->
        <line x1="230" y1="110" x2="230" y2="140" stroke="#fafafa" stroke-width="3"/>
        <line x1="240" y1="115" x2="270" y2="115" stroke="#a1a1aa" stroke-width="2"/>
        <line x1="240" y1="135" x2="270" y2="135" stroke="#a1a1aa" stroke-width="2"/>
        <line x1="270" y1="70" x2="270" y2="115" stroke="#fafafa" stroke-width="2"/>
        <circle cx="270" cy="70" r="3" fill="#fafafa"/>
        <text x="280" y="75" fill="#fafafa" font-size="11" font-family="monospace">Icopy</text>
        <!-- Grounds -->
        <line x1="160" y1="155" x2="160" y2="220" stroke="#a1a1aa" stroke-width="2"/>
        <line x1="150" y1="220" x2="170" y2="220" stroke="#a1a1aa" stroke-width="2"/>
        <line x1="270" y1="135" x2="270" y2="220" stroke="#a1a1aa" stroke-width="2"/>
        <line x1="260" y1="220" x2="280" y2="220" stroke="#a1a1aa" stroke-width="2"/>
      </svg>
    `;
  }

  // 9. MOS Differential Pair
  if (circuitId === 'mosfet-diff-pair') {
    return `
      <svg viewBox="0 0 380 270" width="${svgWidth}" height="${svgHeight}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="background:#09090b; border-radius:4px; max-width:100%; height:auto;">
        <line x1="60" y1="20" x2="320" y2="20" stroke="#f59e0b" stroke-width="2"/>
        <text x="190" y="15" fill="#f59e0b" font-size="11" font-family="monospace" text-anchor="middle">VDD</text>
        <!-- RD1 & RD2 -->
        <line x1="130" y1="20" x2="130" y2="45" stroke="#a1a1aa" stroke-width="2"/>
        <rect x="120" y="45" width="20" height="36" fill="${bgFill('rd')}" stroke="${strokeColor('rd')}" stroke-width="2"/>
        <text x="95" y="67" fill="#fafafa" font-size="11" font-family="monospace">RD</text>
        <line x1="250" y1="20" x2="250" y2="45" stroke="#a1a1aa" stroke-width="2"/>
        <rect x="240" y="45" width="20" height="36" fill="${bgFill('rd')}" stroke="${strokeColor('rd')}" stroke-width="2"/>
        <text x="265" y="67" fill="#fafafa" font-size="11" font-family="monospace">RD+ΔRD</text>
        <!-- Outputs Vout1 & Vout2 -->
        <circle cx="130" cy="95" r="3" fill="#fafafa"/>
        <text x="85" y="100" fill="#fafafa" font-size="10" font-family="monospace">Vout1</text>
        <circle cx="250" cy="95" r="3" fill="#fafafa"/>
        <text x="260" y="100" fill="#fafafa" font-size="10" font-family="monospace">Vout2</text>
        <!-- M1 & M2 Pair -->
        <line x1="130" y1="81" x2="130" y2="115" stroke="#a1a1aa" stroke-width="2"/>
        <line x1="250" y1="81" x2="250" y2="115" stroke="#a1a1aa" stroke-width="2"/>
        <line x1="110" y1="120" x2="110" y2="148" stroke="#fafafa" stroke-width="3"/>
        <line x1="60" y1="134" x2="110" y2="134" stroke="#a1a1aa" stroke-width="2"/>
        <circle cx="50" cy="134" r="3" fill="#fbbf24"/>
        <text x="35" y="138" fill="#fbbf24" font-size="10" font-family="monospace">Vin1</text>
        <line x1="270" y1="120" x2="270" y2="148" stroke="#fafafa" stroke-width="3"/>
        <line x1="270" y1="134" x2="320" y2="134" stroke="#a1a1aa" stroke-width="2"/>
        <circle cx="330" cy="134" r="3" fill="#fbbf24"/>
        <text x="338" y="138" fill="#fbbf24" font-size="10" font-family="monospace">Vin2</text>
        <!-- Common Source Node P -->
        <line x1="130" y1="140" x2="190" y2="165" stroke="#a1a1aa" stroke-width="2"/>
        <line x1="250" y1="140" x2="190" y2="165" stroke="#a1a1aa" stroke-width="2"/>
        <circle cx="190" cy="165" r="3" fill="#a855f7"/>
        <text x="195" y="163" fill="#a855f7" font-size="10" font-family="monospace">P</text>
        <!-- Tail Current Source ISS -->
        <line x1="190" y1="165" x2="190" y2="185" stroke="#a1a1aa" stroke-width="2"/>
        <circle cx="190" cy="198" r="12" fill="none" stroke="#fbbf24" stroke-width="2"/>
        <polygon points="190,205 185,195 195,195" fill="#fbbf24"/>
        <text x="210" y="202" fill="#fbbf24" font-size="10" font-family="monospace">ISS</text>
        <line x1="190" y1="210" x2="190" y2="235" stroke="#a1a1aa" stroke-width="2"/>
        <line x1="180" y1="235" x2="200" y2="235" stroke="#a1a1aa" stroke-width="2"/>
      </svg>
    `;
  }

  // 10. MOS Diff Amp with Active Load
  return `
    <svg viewBox="0 0 380 270" width="${svgWidth}" height="${svgHeight}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="background:#09090b; border-radius:4px; max-width:100%; height:auto;">
      <line x1="60" y1="20" x2="320" y2="20" stroke="#f59e0b" stroke-width="2"/>
      <text x="190" y="15" fill="#f59e0b" font-size="11" font-family="monospace" text-anchor="middle">VDD</text>
      <!-- Active Mirror Load M3, M4 (PMOS) -->
      <line x1="130" y1="20" x2="130" y2="50" stroke="#a1a1aa" stroke-width="2"/>
      <line x1="250" y1="20" x2="250" y2="50" stroke="#a1a1aa" stroke-width="2"/>
      <line x1="120" y1="50" x2="140" y2="50" stroke="#a855f7" stroke-width="3"/>
      <line x1="240" y1="50" x2="260" y2="50" stroke="#a855f7" stroke-width="3"/>
      <line x1="130" y1="50" x2="250" y2="50" stroke="#a855f7" stroke-width="1.5"/>
      <circle cx="130" cy="50" r="3" fill="#a855f7"/>
      <line x1="130" y1="50" x2="130" y2="80" stroke="#a855f7" stroke-width="1.5"/>
      <text x="95" y="48" fill="#a855f7" font-size="10" font-family="monospace">M3 (Diode)</text>
      <text x="268" y="48" fill="#a855f7" font-size="10" font-family="monospace">M4 (Mirror)</text>
      <!-- Single Ended Output Vout -->
      <circle cx="250" cy="90" r="3" fill="#fafafa"/>
      <line x1="250" y1="90" x2="310" y2="90" stroke="#fafafa" stroke-width="2"/>
      <text x="315" y="94" fill="#fafafa" font-size="11" font-family="monospace">Vout</text>
      <!-- Input Pair M1, M2 -->
      <line x1="130" y1="80" x2="130" y2="115" stroke="#a1a1aa" stroke-width="2"/>
      <line x1="250" y1="90" x2="250" y2="115" stroke="#a1a1aa" stroke-width="2"/>
      <circle cx="50" cy="134" r="3" fill="#fbbf24"/>
      <line x1="50" y1="134" x2="110" y2="134" stroke="#a1a1aa" stroke-width="2"/>
      <text x="35" y="138" fill="#fbbf24" font-size="10" font-family="monospace">+ΔV</text>
      <circle cx="330" cy="134" r="3" fill="#fbbf24"/>
      <line x1="270" y1="134" x2="330" y2="134" stroke="#a1a1aa" stroke-width="2"/>
      <text x="338" y="138" fill="#fbbf24" font-size="10" font-family="monospace">-ΔV</text>
      <!-- Tail Current Source ISS -->
      <line x1="130" y1="140" x2="190" y2="165" stroke="#a1a1aa" stroke-width="2"/>
      <line x1="250" y1="140" x2="190" y2="165" stroke="#a1a1aa" stroke-width="2"/>
      <circle cx="190" cy="195" r="12" fill="none" stroke="#fbbf24" stroke-width="2"/>
      <polygon points="190,202 185,192 195,192" fill="#fbbf24"/>
      <text x="210" y="200" fill="#fbbf24" font-size="10" font-family="monospace">ISS</text>
      <line x1="190" y1="207" x2="190" y2="235" stroke="#a1a1aa" stroke-width="2"/>
      <line x1="180" y1="235" x2="200" y2="235" stroke="#a1a1aa" stroke-width="2"/>
    </svg>
  `;
}




function _getCircuitsData() {
  return (typeof window !== 'undefined' && window.circuitsData) ? window.circuitsData : (typeof circuitsData !== 'undefined' ? circuitsData : {});
}

class CircuitStudio {
  constructor() {
    this.currentCircuitId = 'bjt-ce-fixed';
    this.currentBranchId = null; // null = Base Circuit
    this.activeComponent = null;
    this.values = {};
    this.init();
  }

  init() {
    const params = new URLSearchParams(window.location.search);
    const targetCircuit = params.get('circuit');
    if (targetCircuit && _getCircuitsData()[targetCircuit]) {
      this.currentCircuitId = targetCircuit;
    }
    this.renderPicker();
    this.selectCircuit(this.currentCircuitId);
  }

  renderPicker() {
    const grid = document.getElementById('circuitPickerGrid') || document.getElementById('circuitPickerNav');
    if (!grid) return;
    grid.innerHTML = '';

    Object.keys(_getCircuitsData()).forEach(id => {
      const c = _getCircuitsData()[id];
      const card = document.createElement('div');
      card.className = `circuit-picker-card ${id === this.currentCircuitId ? 'active' : ''}`;
      card.dataset.id = id;
      card.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:4px; align-items:flex-start; margin-bottom:6px;">
          <span class="slide-tag">${c.slideRef || c.slide || ""}</span>
          <span style="font-size:0.75rem; color:var(--text-dim); text-transform:uppercase; letter-spacing:0.04em;">${c.category.toUpperCase()}</span>
        </div>
        <div class="circuit-name">${c.name}</div>
        <div class="circuit-meta">${c.branches ? c.branches.length : 0} Branch Variations</div>
      `;
      card.addEventListener('click', () => this.selectCircuit(id));
      grid.appendChild(card);
    });
  }

  selectCircuit(circuitId) {
    if (!_getCircuitsData()[circuitId]) return;
    this.currentCircuitId = circuitId;
    this.currentBranchId = null;
    this.activeComponent = null;

    const c = _getCircuitsData()[circuitId];
    this.values = { ...c.defaultValues };

    // Update active picker card
    document.querySelectorAll('.circuit-picker-card').forEach(card => {
      card.classList.toggle('active', card.dataset.id === circuitId);
    });

    this.renderHeader();
    this.renderBranchSelector();
    this.renderSchematic();
    this.renderEquations();
    this.renderCalculator();
  }

  renderHeader() {
    const c = _getCircuitsData()[this.currentCircuitId];
    if (!c) return;
    const titleEl = document.getElementById('circuitCurrentTitle') || document.getElementById('circuitStudioTitle');
    const badgeEl = document.getElementById('circuitCurrentSlideBadge') || document.getElementById('circuitStudioSlideRef');
    const descEl = document.getElementById('circuitStudioDesc');
    if (titleEl) titleEl.textContent = c.name;
    if (badgeEl) badgeEl.textContent = c.slideRef || c.slide || "";
    if (descEl) descEl.textContent = c.description || '';
  }

  renderBranchSelector() {
    const tabsContainer = document.getElementById('circuitBranchTabs') || document.getElementById('circuitBranchBar');
    if (!tabsContainer) return;
    tabsContainer.innerHTML = '';

    const c = _getCircuitsData()[this.currentCircuitId];

    // Base Tab
    const baseTab = document.createElement('button');
    baseTab.type = 'button';
    baseTab.className = `circuit-branch-tab ${this.currentBranchId === null ? 'active' : ''}`;
    baseTab.innerHTML = `<strong>Base Circuit</strong><br><small style="color:var(--text-dim);">Slide Reference</small>`;
    baseTab.addEventListener('click', () => {
      this.currentBranchId = null;
      this.activeComponent = null;
      this.renderBranchSelector();
      this.renderSchematic();
      this.renderEquations();
      this.renderCalculator();
    });
    tabsContainer.appendChild(baseTab);

    // Branch Tabs
    if (c.branches && c.branches.length > 0) {
      c.branches.forEach((b, idx) => {
        const tab = document.createElement('button');
        tab.type = 'button';
        tab.className = `circuit-branch-tab ${this.currentBranchId === b.id ? 'active' : ''}`;
        tab.innerHTML = `<strong>Branch ${idx + 1}</strong><br><small style="color:var(--accent-rose);">${b.changedElement.toUpperCase()}</small>`;
        tab.addEventListener('click', () => {
          this.currentBranchId = b.id;
          this.activeComponent = b.changedElement;
          this.renderBranchSelector();
          this.renderSchematic();
          this.renderEquations();
          this.renderCalculator();
        });
        tabsContainer.appendChild(tab);
      });
    }
  }

  renderSchematic() {
    const container = document.getElementById('circuitSchematicContainer') || document.getElementById('circuitStudioSvg');
    if (!container) return;

    container.innerHTML = getCircuitSvg(
      this.currentCircuitId,
      this.currentBranchId,
      this.activeComponent,
      380,
      270
    );

    // Click interactive components in SVG
    container.querySelectorAll('.comp-click').forEach(el => {
      el.style.cursor = 'pointer';
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        this.highlightComponent(el.dataset.comp);
      });
    });
  }

  highlightComponent(compId) {
    this.activeComponent = (this.activeComponent === compId) ? null : compId;
    this.renderSchematic();
    this.renderEquations();
  }

  renderEquations() {
    const list = document.getElementById('circuitEquationsList');
    if (!list) return;
    list.innerHTML = '';

    const c = _getCircuitsData()[this.currentCircuitId];
    const isBranch = this.currentBranchId !== null;
    const branch = isBranch ? c.branches.find(b => b.id === this.currentBranchId) : null;

    // Branch impact banner if branch active
    if (branch) {
      const banner = document.createElement('div');
      banner.className = 'card';
      banner.style.borderLeft = '4px solid var(--accent-rose)';
      banner.style.marginBottom = '16px';
      banner.style.padding = '14px 18px';

      let diffRows = '';
      if (branch.formulaDiffs && branch.formulaDiffs.length > 0) {
        diffRows = `
          <div style="background:#141416; padding:10px 14px; border-radius:6px; border:1px solid #27272a; margin-bottom:12px;">
            <strong style="color:var(--accent-cyan); font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Formula Changes:</strong>
            <ul style="margin-top:6px; padding-left:18px; font-size:0.85rem; list-style:none;">
              ${branch.formulaDiffs.map(d => `
                <li style="margin-bottom:8px; display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                  <strong style="color:#cbd5e1;">${d.name}:</strong>
                  <span style="color:#a1a1aa;">Before:</span> <span class="eq-inline" data-tex="${d.before}"></span>
                  <span style="color:var(--accent-rose); font-weight:bold;">→ After:</span> <span class="eq-inline" data-tex="${d.after}"></span>
                </li>
              `).join('')}
            </ul>
          </div>
        `;
      }

      // Branch Steps
      let branchStepsHtml = '';
      if (branch.steps && branch.steps.length > 0) {
        branchStepsHtml = `
          <button type="button" class="btn sm secondary show-branch-working-btn" data-target="branchWorkingStepsBox" style="font-size:0.75rem; padding:4px 10px; margin-top:4px;">
            Show Branch Derivation
          </button>
          <div id="branchWorkingStepsBox" class="calc-breakdown-box" style="display:none; margin-top:12px;">
            ${branch.steps.map(s => `
              <div class="step-card" style="margin-bottom:10px; background:#141416; border-left:3px solid var(--accent-rose); padding:10px 14px; border-radius:6px;">
                <h5 style="color:var(--accent-rose); font-size:0.85rem; margin:0 0 4px; font-weight:700;">${s.title}</h5>
                <p style="font-size:0.85rem; color:#cbd5e1; margin:0 0 6px; line-height:1.5;">${s.desc}</p>
                ${s.tex ? `<div class="eq-box" style="margin:4px 0 2px;"><div class="eq" data-tex="${s.tex.replace(/"/g, '&quot;')}">${s.tex}</div></div>` : ''}
              </div>
            `).join('')}
          </div>
        `;
      }

      banner.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <span class="status-badge" style="background:rgba(244,63,94,0.15); color:#fb7185; border:1px solid rgba(244,63,94,0.3);">Branch Variation</span>
          <strong style="color:#fff; font-size:0.9rem;">${branch.whatChanged}</strong>
        </div>
        <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:10px;">${branch.impactText}</p>
        ${diffRows}
        ${branchStepsHtml}
      `;
      list.appendChild(banner);
    }

    // Equation Groups
    c.equationGroups.forEach(grp => {
      const isHighlighted = this.activeComponent && grp.componentsInvolved && grp.componentsInvolved.includes(this.activeComponent);
      const grpCard = document.createElement('div');
      grpCard.className = 'card eq-group-block';
      if (isHighlighted) {
        grpCard.style.border = '2px solid var(--accent-cyan)';
        grpCard.style.background = 'rgba(56,189,248,0.06)';
      }

      let inner = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid var(--border-subtle); padding-bottom:6px;">
          <h4 style="color:#fff; font-size:0.95rem; margin:0;">${grp.title}</h4>
          ${isHighlighted ? '<span class="status-badge" style="background:#3f3f46; color:#fff;">Linked Component</span>' : ''}
        </div>
      `;

      grp.equations.forEach((eq, idx) => {
        const eqId = `eq_${grp.id}_${idx}`;
        
        let stepsHtml = '';
        if (eq.steps && Array.isArray(eq.steps)) {
          stepsHtml = eq.steps.map(s => `
            <div class="step-card" style="margin-bottom:10px; background:#141416; border-left:3px solid var(--accent-cyan); padding:10px 14px; border-radius:6px;">
              <h5 style="color:var(--accent-cyan); font-size:0.85rem; margin:0 0 4px; font-weight:700;">${s.title}</h5>
              <p style="font-size:0.85rem; color:#cbd5e1; margin:0 0 6px; line-height:1.5;">${s.desc}</p>
              ${s.tex ? `<div class="eq-box" style="margin:4px 0 2px;"><div class="eq" data-tex="${s.tex.replace(/"/g, '&quot;')}">${s.tex}</div></div>` : ''}
            </div>
          `).join('');
        } else if (eq.working) {
          stepsHtml = `<div class="step-card" style="margin-bottom:10px; background:#141416; border-left:3px solid var(--accent-purple); padding:10px 14px; border-radius:6px;"><p style="font-size:0.85rem; color:#cbd5e1; line-height:1.5;">${eq.working}</p></div>`;
        }

        inner += `
          <div style="margin-bottom:14px; padding-bottom:12px; border-bottom:1px dashed rgba(255,255,255,0.06);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
              <span style="font-size:0.85rem; font-weight:600; color:var(--accent-cyan);">${eq.label}</span>
              <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-dim);">${eq.slide}</span>
            </div>
            <div class="eq-box" style="margin-bottom:8px; overflow-x:auto;">
              <div class="eq" data-tex="${eq.tex.replace(/"/g, '&quot;')}">${eq.tex}</div>
            </div>
            <button type="button" class="btn sm secondary show-working-btn" data-target="${eqId}" style="font-size:0.75rem; padding:3px 8px;">
              Show Working
            </button>
            <div id="${eqId}" class="calc-breakdown-box" style="display:none; margin-top:12px;">
              ${stepsHtml}
            </div>
          </div>
        `;
      });

      grpCard.innerHTML = inner;
      list.appendChild(grpCard);
    });

    // Wire expandable working buttons
    list.querySelectorAll('.show-working-btn, .show-branch-working-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.target);
        if (target) {
          const isShown = target.style.display !== 'none';
          target.style.display = isShown ? 'none' : 'block';
          btn.textContent = isShown ? (btn.classList.contains('show-branch-working-btn') ? 'Show Branch Derivation' : 'Show Working') : 'Hide Working';
          if (!isShown && window.katex) {
            target.querySelectorAll('.eq[data-tex]').forEach(el => {
              try {
                katex.render(el.getAttribute('data-tex'), el, { displayMode: true, throwOnError: false });
              } catch(e) {}
            });
            target.querySelectorAll('.eq-inline[data-tex]').forEach(el => {
              try {
                katex.render(el.getAttribute('data-tex'), el, { displayMode: false, throwOnError: false });
              } catch(e) {}
            });
          }
        }
      });
    });

    // KaTeX display render
    if (window.katex) {
      list.querySelectorAll('.eq[data-tex]').forEach(el => {
        try {
          katex.render(el.getAttribute('data-tex'), el, { displayMode: true, throwOnError: false });
        } catch(e) {}
      });
      list.querySelectorAll('.eq-inline[data-tex]').forEach(el => {
        try {
          katex.render(el.getAttribute('data-tex'), el, { displayMode: false, throwOnError: false });
        } catch(e) {}
      });

    }
  }

  renderCalculator() {
    const inputContainer = document.getElementById('circuitCalcInputs');
    const resultContainer = document.getElementById('circuitCalcResults');
    const presetContainer = document.getElementById('circuitCalcPresets');
    if (!inputContainer || !resultContainer) return;

    inputContainer.innerHTML = '';
    resultContainer.innerHTML = '';

    const c = _getCircuitsData()[this.currentCircuitId];

    // Presets
    if (presetContainer && c.presets) {
      presetContainer.innerHTML = '';
      c.presets.forEach(p => {
        const pBtn = document.createElement('button');
        pBtn.type = 'button';
        pBtn.className = 'exp-preset-btn';
        pBtn.style.padding = '6px 10px';
        pBtn.style.fontSize = '0.78rem';
        pBtn.innerHTML = `<strong>${p.name}</strong><br><small style="color:var(--text-dim);">${p.desc}</small>`;
        pBtn.addEventListener('click', () => {
          this.values = { ...p.values };
          this.renderCalculator();
          this.renderSchematic();
        });
        presetContainer.appendChild(pBtn);
      });
    }

    // Input fields
    c.components.forEach(comp => {
      const div = document.createElement('div');
      div.className = 'ctl-group';
      const curVal = this.values[comp.id] !== undefined ? this.values[comp.id] : 0;
      const displayVal = curVal >= 99999 ? '∞' : curVal;

      div.innerHTML = `
        <div class="ctl-header">
          <label style="color:#cbd5e1; font-size:0.8rem; font-family:var(--font-mono);">${comp.name}</label>
          <span class="val" id="calcReadout_${comp.id}">${displayVal} ${comp.unit}</span>
        </div>
        <input type="number" step="any" class="circuit-calc-in" data-comp="${comp.id}" value="${curVal >= 99999 ? '' : curVal}" placeholder="${curVal >= 99999 ? '∞' : ''}"
          style="background:#141416; border:1px solid #27272a; color:#fafafa; padding:6px 10px; border-radius:4px; font-family:monospace; width:100%; outline:none;">
      `;
      inputContainer.appendChild(div);
    });

    const updateCalc = (changedComp) => {
      inputContainer.querySelectorAll('.circuit-calc-in').forEach(inp => {
        const val = inp.value === '' ? 999999 : parseFloat(inp.value) || 0;
        this.values[inp.dataset.comp] = val;
        const span = document.getElementById(`calcReadout_${inp.dataset.comp}`);
        if (span) span.textContent = (val >= 99999 ? '∞' : val);
      });

      if (changedComp) {
        const compEl = document.querySelector(`.comp-click[data-comp="${changedComp}"]`);
        if (compEl) {
          compEl.style.transition = 'opacity 150ms ease';
          compEl.style.opacity = '0.35';
          setTimeout(() => {
            compEl.style.opacity = '1';
          }, 150);
        }
      }

      resultContainer.innerHTML = '';

      if (this.currentBranchId === null) {
        // Base circuit only
        const metrics = this.computeMetricsFor(this.currentCircuitId, null, this.values);
        Object.keys(metrics).forEach(k => {
          const pill = document.createElement('div');
          pill.className = 'metric';
          pill.innerHTML = `
            <div class="lbl">${k}</div>
            <div class="val">${metrics[k]}</div>
          `;
          resultContainer.appendChild(pill);
        });
      } else {
        // Side-by-side Base vs Branch comparison
        const baseMetrics = this.computeMetricsFor(this.currentCircuitId, null, this.values);
        const branchMetrics = this.computeMetricsFor(this.currentCircuitId, this.currentBranchId, this.values);

        const table = document.createElement('div');
        table.style.width = '100%';
        table.style.background = '#141416';
        table.style.border = '1px solid #27272a';
        table.style.borderRadius = '4px';
        table.style.overflow = 'hidden';

        let rowsHtml = `
          <table style="width:100%; border-collapse:collapse; font-size:0.84rem; text-align:left;">
            <thead>
              <tr style="border-bottom:1px solid #27272a; background:#141416; color:var(--accent-cyan); font-family:var(--font-mono); font-size:0.75rem;">
                <th style="padding:8px 12px;">Parameter</th>
                <th style="padding:8px 12px;">Base Circuit</th>
                <th style="padding:8px 12px; color:#fb7185;">Branch Variation</th>
                <th style="padding:8px 12px;">Impact</th>
              </tr>
            </thead>
            <tbody>
        `;

        const allKeys = Object.keys(branchMetrics);
        allKeys.forEach(k => {
          const bVal = baseMetrics[k] !== undefined ? baseMetrics[k] : '-';
          const brVal = branchMetrics[k];
          const isDiff = bVal !== brVal;
          rowsHtml += `
            <tr style="border-bottom:1px solid rgba(255,255,255,0.03); background:${isDiff ? 'rgba(244,63,94,0.04)' : 'transparent'};">
              <td style="padding:8px 12px; font-weight:600; color:#cbd5e1;">${k}</td>
              <td style="padding:8px 12px; font-family:var(--font-mono); color:#a1a1aa;">${bVal}</td>
              <td style="padding:8px 12px; font-family:var(--font-mono); color:${isDiff ? '#fb7185' : '#e2e8f0'}; font-weight:${isDiff ? 'bold' : 'normal'};">${brVal}</td>
              <td style="padding:8px 12px; font-size:0.78rem; color:${isDiff ? '#fb7185' : 'var(--text-dim)'};">${isDiff ? 'Modified' : 'Unchanged'}</td>
            </tr>
          `;
        });

        rowsHtml += `</tbody></table>`;
        table.innerHTML = rowsHtml;
        resultContainer.appendChild(table);
      }
    };

    inputContainer.addEventListener('input', (e) => {
      const comp = e.target ? e.target.dataset.comp : null;
      updateCalc(comp);
    });
    updateCalc();
  }

  computeMetricsFor(circuitId, branchId, v) {
    const c = _getCircuitsData()[circuitId];
    if (!c) return {};

    const isBranch = branchId !== null;
    const branch = isBranch ? c.branches.find(b => b.id === branchId) : null;
    const changedElem = branch ? branch.changedElement : null;

    // --- 1. BJT CE Fixed ---
    if (circuitId === 'bjt-ce-fixed') {
      const ib = (v.vcc - 0.7) / v.rb;
      const ie = (v.beta + 1) * ib;
      const re = 26 / Math.max(0.001, ie);
      const betaRe = (v.beta * re) / 1000;
      const zi = (v.rb * betaRe) / (v.rb + betaRe);
      let zo = v.rc;
      if (branchId === 'branch-finite-ro' && v.ro < 50000) {
        zo = (v.rc * v.ro) / (v.rc + v.ro);
      }
      let av = -(zo * 1000) / re;
      if (branchId === 'branch-finite-rl' && v.rl < 50000) {
        const zeff = (v.rc * v.rl) / (v.rc + v.rl);
        av = -(zeff * 1000) / re;
      }
      return {
        'IBQ (Base)': (ib * 1000).toFixed(2) + ' µA',
        'IEQ (Emitter)': ie.toFixed(3) + ' mA',
        're (Dynamic)': re.toFixed(2) + ' Ω',
        'Zi (Input)': zi.toFixed(2) + ' kΩ',
        'Zo (Output)': zo.toFixed(2) + ' kΩ',
        'Av (Voltage Gain)': av.toFixed(2) + ' V/V'
      };
    }

    // --- 2. BJT CE Divider ---
    if (circuitId === 'bjt-ce-divider') {
      const rth = (v.r1 * v.r2) / (v.r1 + v.r2);
      const vth = v.vcc * (v.r2 / (v.r1 + v.r2));
      const ib = (vth - 0.7) / (rth + (v.beta + 1) * v.re);
      const ie = (v.beta + 1) * ib;
      const re = 26 / Math.max(0.001, ie);

      let zi, zo = v.rc, av;
      if (branchId === 'branch-remove-ce') {
        // Unbypassed RE
        const zb = (v.beta * re) / 1000 + (v.beta + 1) * v.re;
        zi = (rth * zb) / (rth + zb);
        av = -(v.rc * 1000) / (re + v.re * 1000);
      } else {
        // Bypassed RE
        const betaRe = (v.beta * re) / 1000;
        zi = (rth * betaRe) / (rth + betaRe);
        if (branchId === 'branch-finite-ro-div' && v.ro < 50000) {
          zo = (v.rc * v.ro) / (v.rc + v.ro);
        }
        let zeff = zo;
        if (branchId === 'branch-ce-load' && v.rl < 50000) {
          zeff = (v.rc * v.rl) / (v.rc + v.rl);
        }
        av = -(zeff * 1000) / re;
      }
      return {
        'VTH (Divider)': vth.toFixed(2) + ' V',
        'IEQ (Emitter)': ie.toFixed(3) + ' mA',
        're (Dynamic)': re.toFixed(2) + ' Ω',
        'Zi (Input)': zi.toFixed(2) + ' kΩ',
        'Zo (Output)': zo.toFixed(2) + ' kΩ',
        'Av (Voltage Gain)': av.toFixed(2) + ' V/V'
      };
    }

    // --- 3. BJT Emitter Follower ---
    if (circuitId === 'bjt-emitter-follower') {
      const ib = (v.vcc - 0.7) / (v.rb + (v.beta + 1) * v.re);
      const ie = (v.beta + 1) * ib;
      const re = 26 / Math.max(0.001, ie);
      let reff = v.re;
      if (branchId === 'branch-ef-load' && v.rl < 50000) {
        reff = (v.re * v.rl) / (v.re + v.rl);
      }
      const zb = (v.beta * re) / 1000 + (v.beta + 1) * reff;
      const zi = (v.rb * zb) / (v.rb + zb);
      const zo = ((reff * 1000) * re) / ((reff * 1000) + re);
      const av = (reff * 1000) / ((reff * 1000) + re);
      return {
        'IEQ (Emitter)': ie.toFixed(3) + ' mA',
        're (Dynamic)': re.toFixed(2) + ' Ω',
        'Zi (High Input)': zi.toFixed(1) + ' kΩ',
        'Zo (Low Output Buffer)': zo.toFixed(2) + ' Ω',
        'Av (Unity Buffer)': av.toFixed(3) + ' V/V'
      };
    }

    // --- 4. MOSFET CS Divider ---
    if (circuitId === 'mosfet-cs-divider') {
      const vg = (v.r2 / (v.r1 + v.r2)) * v.vdd;
      const vov = Math.max(0, vg - v.vtn);
      const id = v.kn * Math.pow(vov, 2);
      const vds = v.vdd - id * v.rd;
      const gm = 2 * v.kn * vov;

      const ri = (v.r1 * v.r2) / (v.r1 + v.r2);
      let roEff = v.rd;
      if (branchId === 'branch-finite-ro-cs') {
        const ro = v.lambda > 0 && id > 0 ? (1 / (v.lambda * id)) : 100;
        roEff = (v.rd * ro) / (v.rd + ro);
      }
      let rLout = roEff;
      if (branchId === 'branch-cs-load' && v.rl < 50000) {
        rLout = (roEff * v.rl) / (roEff + v.rl);
      }
      const rsi = branchId === 'branch-add-rsi' ? (v.rsi || 4.0) : 0;
      const inputDiv = ri / (ri + rsi);
      const av = -gm * rLout * inputDiv;

      return {
        'VGSQ (Gate)': vg.toFixed(2) + ' V',
        'IDQ (Drain)': id.toFixed(3) + ' mA',
        'VDSQ (Drain)': vds.toFixed(2) + ' V',
        'gm (Transconductance)': gm.toFixed(2) + ' mA/V',
        'Ri (Input)': ri.toFixed(1) + ' kΩ',
        'Ro (Output)': roEff.toFixed(2) + ' kΩ',
        'Av (Voltage Gain)': av.toFixed(2) + ' V/V'
      };
    }

    // --- 5. MOSFET CS Degeneration ---
    if (circuitId === 'mosfet-cs-degen') {
      let av;
      let ro = v.rd;
      if (branchId === 'branch-bypass-rs') {
        av = -v.gm * v.rd;
      } else if (branchId === 'branch-active-cs-load') {
        ro = 25.0; // ro1 || ro2
        av = -v.gm * ro;
      } else if (branchId === 'branch-diode-load') {
        av = -Math.sqrt(2.0); // -sqrt((W/L)1 / (W/L)2)
        ro = 1 / v.gm;
      } else {
        // Base: unbypassed RS
        av = (-v.gm * v.rd) / (1 + v.gm * v.rs);
      }
      return {
        'gm (Transconductance)': v.gm.toFixed(2) + ' mA/V',
        'Ro (Output)': ro.toFixed(1) + ' kΩ',
        'RS (Source)': branchId === 'branch-bypass-rs' ? '0 (Bypassed)' : v.rs.toFixed(2) + ' kΩ',
        'Av (Voltage Gain)': av.toFixed(2) + ' V/V',
        'Feedback Mode': branchId === 'branch-bypass-rs' ? 'None (Full Gain)' : 'Source Degenerated'
      };
    }

    // --- 6. MOSFET Source Follower ---
    if (circuitId === 'mosfet-source-follower') {
      const ri = (v.r1 * v.r2) / (v.r1 + v.r2);
      const vg = (v.r2 / (v.r1 + v.r2)) * v.vdd;
      const rs = v.rs;
      let id = 1.0;
      let vs = 2.0;
      for (let i = 0; i < 15; i++) {
        const vgs = vg - vs;
        id = vgs > v.vtn ? v.kn * Math.pow(vgs - v.vtn, 2) : 0;
        vs = id * rs;
      }
      const gm = 2 * Math.sqrt(v.kn * Math.max(0.001, id));
      let reff = rs;
      if (branchId === 'branch-sf-load' && v.rl < 50000) {
        reff = (rs * v.rl) / (rs + v.rl);
      } else if (branchId === 'branch-sf-current-source') {
        reff = 100.0; // Near-infinite pull down
      }
      const ro_out = (reff * (1 / gm)) / (reff + 1 / gm);
      const av = (gm * reff) / (1 + gm * reff);
      return {
        'IDQ (Drain)': id.toFixed(3) + ' mA',
        'gm (Transconductance)': gm.toFixed(2) + ' mA/V',
        'Ri (Input Gate)': ri.toFixed(1) + ' kΩ',
        'Ro (Output Buffer)': (ro_out * 1000).toFixed(1) + ' Ω',
        'Av (Buffer Gain)': av.toFixed(3) + ' V/V'
      };
    }

    // --- 7. MOSFET Common Gate ---
    if (circuitId === 'mosfet-common-gate') {
      const ri = (1 / v.gm) * 1000;
      let rload = v.rd;
      if (branchId === 'branch-cg-load' && v.rl < 50000) {
        rload = (v.rd * v.rl) / (v.rd + v.rl);
      }
      const rsi_k = branchId === 'branch-cg-ideal-source' ? 999999 : (v.rsi || 50) / 1000;
      const av = branchId === 'branch-cg-ideal-source' ? 0.0 : (v.gm * rload) / (1 + v.gm * rsi_k);
      const ai = branchId === 'branch-cg-ideal-source' ? 1.0 : (v.rd / (v.rd + (v.rl < 50000 ? v.rl : 10))) * ((v.gm * rsi_k) / (1 + v.gm * rsi_k));
      return {
        'gm (Transconductance)': v.gm.toFixed(2) + ' mA/V',
        'Ri (Low Input)': ri.toFixed(1) + ' Ω',
        'Ro (Output)': rload.toFixed(1) + ' kΩ',
        'Av (Non-Inverting)': av.toFixed(2) + ' V/V',
        'Ai (Current Gain)': ai.toFixed(3) + ' A/A'
      };
    }

    // --- 8. MOSFET Current Mirror ---
    if (circuitId === 'mosfet-current-mirror') {
      const ratio = branchId === 'branch-scaling-ratio' ? (v.w_1 / v.w_ref) : 1.0;
      const idealCopy = v.iref * ratio;
      let actualCopy = idealCopy;
      let rout = '∞ (Ideal)';
      if (branchId === 'branch-clm-error') {
        const lambda = v.lambda > 0 ? v.lambda : 0.1;
        actualCopy = idealCopy * ((1 + lambda * v.vds1) / (1 + lambda * 0.9));
        rout = (1 / (lambda * actualCopy)).toFixed(1) + ' kΩ';
      }
      return {
        'IREF (Reference)': v.iref.toFixed(3) + ' mA',
        'Ratio (W/L)1 / (W/L)ref': ratio.toFixed(2),
        'Icopy (Output)': actualCopy.toFixed(3) + ' mA',
        'Rout (Incremental)': rout,
        'Rail Polarity': branchId === 'branch-pmos-mirror' ? 'Pull-Up (PMOS to VDD)' : 'Pull-Down (NMOS to GND)'
      };
    }

    // --- 9. MOS Differential Pair ---
    if (circuitId === 'mosfet-diff-pair') {
      const id_branch = v.iss / 2;
      const gm = Math.sqrt(v.kn * v.iss);
      const adm = -gm * v.rd;
      const drd = branchId === 'branch-mismatch-cmrr' ? 0.04 : 0;
      const rss = branchId === 'branch-mismatch-cmrr' ? v.rss : 999999;
      const acm_dm = drd === 0 ? 0 : drd / (1 / gm + 2 * rss);
      const cmrr = acm_dm === 0 ? 999999 : Math.abs(adm / acm_dm);
      const cmrr_db = cmrr >= 999999 ? '∞ (Ideal)' : (20 * Math.log10(cmrr)).toFixed(1) + ' dB';
      return {
        'ID1 = ID2': id_branch.toFixed(3) + ' mA',
        'gm (Pair)': gm.toFixed(2) + ' mA/V',
        'Adm (Diff Gain)': adm.toFixed(2) + ' V/V',
        'ACM-DM (Mismatch)': acm_dm === 0 ? '0 (Ideal Rejection)' : acm_dm.toFixed(4) + ' V/V',
        'CMRR': cmrr >= 999999 ? '∞' : cmrr.toFixed(1),
        'CMRR (dB)': cmrr_db
      };
    }

    // --- 10. MOS Diff Active Load ---
    if (circuitId === 'mosfet-diff-active') {
      const ro = (v.ro2 * v.ro4) / (v.ro2 + v.ro4);
      let roEff = ro;
      if (branchId === 'branch-active-loaded' && v.rl < 50000) {
        roEff = (ro * v.rl) / (ro + v.rl);
      }
      const av = v.gm * roEff;
      return {
        'gm (Input Pair)': v.gm.toFixed(2) + ' mA/V',
        'Ro (Active Output)': roEff.toFixed(1) + ' kΩ',
        'Av (Single-Ended Gain)': av.toFixed(1) + ' V/V',
        'Av (dB)': (20 * Math.log10(av)).toFixed(1) + ' dB',
        'Current Injection': '2ΔI (Active Mirror Doubled)'
      };
    }

    return {};
  }
}

window.CircuitStudio = CircuitStudio;
window.getCircuitSvg = getCircuitSvg;
