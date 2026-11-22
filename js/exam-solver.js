/* ==========================================================================
   exam-solver.js - Interactive Numerical Exam Problem Solver & Concept Quiz
   Solves the exact examination, descriptive, and multiple-choice questions
   from the 25ECE211 PDF with step-by-step mathematical working & live scoring
   ========================================================================== */

const examProblems = {
  // -------------------------------------------------------------
  // Unit I - Fig Q1(b) / Review Q1: Emitter Follower DC Analysis
  // -------------------------------------------------------------
  'u1-emitter-follower': {
    title: 'Unit I: Emitter Follower DC Analysis (Model Exam Q1b)',
    pdfRef: 'Page 9, Fig. Q1(b) & Page 5, Review Q1',
    description: 'Determine IB, IC, IE, VB, VC, VE, VCE and VBC for the voltage divider biased emitter follower network.',
    defaultInputs: {
      vcc: 12.0,
      r1: 22.0, // kOhms
      r2: 82.0, // kOhms
      re: 1.2,  // kOhms
      beta: 110,
      vbe: 0.7
    },
    solve: function(inputs) {
      const { vcc, r1, r2, re, beta, vbe } = inputs;
      const rth = (r1 * r2) / (r1 + r2);
      const vth = vcc * (r2 / (r1 + r2));

      const ib = (vth - vbe) / (rth + (beta + 1) * re); // mA
      const ic = beta * ib; // mA
      const ie = (beta + 1) * ib; // mA

      const ve = ie * re; // V
      const vb = ve + vbe; // V
      const vc = vcc;
      const vce = vc - ve;
      const vbc = vb - vc;

      let steps = [
        {
          step: '1. Thevenin Equivalent at Transistor Base',
          math: `\\begin{aligned}
            V_{TH} &= V_{CC} \\cdot \\frac{R_2}{R_1 + R_2} = ${vcc} \\cdot \\frac{${r2}}{${r1} + ${r2}} = \\mathbf{${vth.toFixed(3)}\\text{ V}} \\\\[4pt]
            R_{TH} &= R_1 \\parallel R_2 = \\frac{${r1} \\times ${r2}}{${r1} + ${r2}} = \\mathbf{${rth.toFixed(3)}\\text{ k}\\Omega}
          \\end{aligned}`
        },
        {
          step: '2. Base, Collector & Emitter Currents',
          math: `\\begin{aligned}
            I_B &= \\frac{V_{TH} - V_{BE}}{R_{TH} + (\\beta + 1)R_E} = \\frac{${vth.toFixed(3)} - ${vbe}}{${rth.toFixed(3)} + (${beta} + 1)(${re})} = \\mathbf{${(ib * 1000).toFixed(2)}\\text{ }\\mu\\text{A}} \\\\[4pt]
            I_C &= \\beta I_B = ${beta} \\times ${(ib * 1000).toFixed(2)}\\mu\\text{A} = \\mathbf{${ic.toFixed(3)}\\text{ mA}} \\\\[4pt]
            I_E &= (\\beta + 1)I_B = \\mathbf{${ie.toFixed(3)}\\text{ mA}}
          \\end{aligned}`
        },
        {
          step: '3. Terminal Voltages (VB, VC, VE)',
          math: `\\begin{aligned}
            V_E &= I_E \\times R_E = ${ie.toFixed(3)}\\text{mA} \\times ${re}\\text{k}\\Omega = \\mathbf{${ve.toFixed(3)}\\text{ V}} \\\\[4pt]
            V_B &= V_E + V_{BE} = ${ve.toFixed(3)} + ${vbe} = \\mathbf{${vb.toFixed(3)}\\text{ V}} \\\\[4pt]
            V_C &= V_{CC} = \\mathbf{${vc.toFixed(2)}\\text{ V}}
          \\end{aligned}`
        },
        {
          step: '4. Inter-terminal Voltages (VCE, VBC)',
          math: `\\begin{aligned}
            V_{CE} &= V_C - V_E = ${vc.toFixed(2)} - ${ve.toFixed(3)} = \\mathbf{${vce.toFixed(3)}\\text{ V}} \\\\[4pt]
            V_{BC} &= V_B - V_C = ${vb.toFixed(3)} - ${vc.toFixed(2)} = \\mathbf{${vbc.toFixed(3)}\\text{ V}} \\quad (\\text{Reverse Biased})
          \\end{aligned}`
        }
      ];

      return {
        results: {
          'I_B': (ib * 1000).toFixed(2) + ' µA',
          'I_C': ic.toFixed(3) + ' mA',
          'I_E': ie.toFixed(3) + ' mA',
          'V_B': vb.toFixed(3) + ' V',
          'V_C': vc.toFixed(2) + ' V',
          'V_E': ve.toFixed(3) + ' V',
          'V_CE': vce.toFixed(3) + ' V',
          'V_BC': vbc.toFixed(3) + ' V'
        },
        steps
      };
    }
  },

  // -------------------------------------------------------------
  // Unit II - Fig Q5b / Review Q1: MOSFET Sizing for Saturation
  // -------------------------------------------------------------
  'u2-mosfet-sizing': {
    title: 'Unit II: MOSFET Sizing in Saturation (Exam Q5b & Review Q1)',
    pdfRef: 'Page 7, Review Q1 & Page 18, Fig. Q5b',
    description: 'Design the Common-Source circuit with RS = 100Ω and RD = 500Ω for a 200mV drop across RS. Find min W/L for saturation and R1, R2 for Zin >= 30kΩ.',
    defaultInputs: {
      vdd: 1.8,
      vdropRs: 0.2,
      rs: 0.1,      // kOhms
      rd: 0.5,      // kOhms
      unCox: 200,   // uA/V^2
      vth: 0.4,
      zinMin: 30.0  // kOhms
    },
    solve: function(inputs) {
      const { vdd, vdropRs, rs, rd, unCox, vth, zinMin } = inputs;
      const id = vdropRs / rs; // mA
      const vs = vdropRs;
      const vd = vdd - id * rd;
      const vds = vd - vs;

      const vgsMax = vds + vth;
      const vovMax = vgsMax - vth;

      const unCox_mA = unCox * 1e-3;
      const wlMin = (2 * id) / (unCox_mA * (vovMax * vovMax));

      const vg = vs + vgsMax;
      const ratio = vg / vdd;
      const r1 = (zinMin / (1 - ratio));
      const r2 = (zinMin / ratio);

      const steps = [
        {
          step: '1. Determine Bias Current ID and Node Voltages',
          math: `\\begin{aligned}
            I_D &= \\frac{V_{RS}}{R_S} = \\frac{${vdropRs}\\text{ V}}{${rs}\\text{ k}\\Omega} = \\mathbf{${id.toFixed(2)}\\text{ mA}} \\\\[4pt]
            V_S &= ${vdropRs}\\text{ V}, \\quad V_D = V_{DD} - I_D R_D = ${vdd} - (${id} \\times ${rd}) = \\mathbf{${vd.toFixed(2)}\\text{ V}} \\\\[4pt]
            V_{DS} &= V_D - V_S = ${vd.toFixed(2)} - ${vs.toFixed(2)} = \\mathbf{${vds.toFixed(2)}\\text{ V}}
          \\end{aligned}`
        },
        {
          step: '2. Saturation Condition & Minimum W/L Sizing',
          math: `\\begin{aligned}
            \\text{For saturation: } V_{DS} &\\ge V_{GS} - V_{TH} \\implies (V_{GS} - V_{TH})_{\\max} = V_{DS} = ${vds.toFixed(2)}\\text{ V} \\\\[4pt]
            I_D &= \\frac{1}{2}\\mu_n C_{ox}\\left(\\frac{W}{L}\\right)(V_{GS} - V_{TH})^2 \\\\[4pt]
            \\left(\\frac{W}{L}\\right)_{\\min} &= \\frac{2 I_D}{\\mu_n C_{ox} (V_{GS} - V_{TH})_{\\max}^2} = \\frac{2 \\times ${id}\\text{ mA}}{0.2\\text{ mA/V}^2 \\times (${vovMax.toFixed(2)})^2} = \\mathbf{${wlMin.toFixed(2)}}
          \\end{aligned}`
        },
        {
          step: '3. Voltage Divider Resistors (R1, R2) for Zin ≥ 30 kΩ',
          math: `\\begin{aligned}
            V_G &= V_S + V_{GS} = ${vs.toFixed(2)} + ${(vs + vovMax).toFixed(2)} = \\mathbf{${vg.toFixed(2)}\\text{ V}} \\\\[4pt]
            \\frac{R_2}{R_1 + R_2} &= \\frac{V_G}{V_{DD}} = \\frac{${vg.toFixed(2)}}{${vdd}} = ${(ratio).toFixed(3)} \\\\[4pt]
            Z_{in} &= R_1 \\parallel R_2 = ${zinMin}\\text{ k}\\Omega \\implies \\mathbf{R_1 = ${r1.toFixed(1)}\\text{ k}\\Omega}, \\quad \\mathbf{R_2 = ${r2.toFixed(1)}\\text{ k}\\Omega}
          \\end{aligned}`
        }
      ];

      return {
        results: {
          'I_D': id.toFixed(2) + ' mA',
          'V_DS': vds.toFixed(2) + ' V',
          'V_GS (max)': vgsMax.toFixed(2) + ' V',
          '(W/L)_min': wlMin.toFixed(2),
          'R_1': r1.toFixed(1) + ' kΩ',
          'R_2': r2.toFixed(1) + ' kΩ'
        },
        steps
      };
    }
  },

  // -------------------------------------------------------------
  // Unit III - Exam Q1b: Source Follower Design with Power Budget
  // -------------------------------------------------------------
  'u3-source-follower': {
    title: 'Unit III: Source Follower Buffer Design (Model Exam Q1b)',
    pdfRef: 'Page 13, Mid Sem II Model Exam Q1(b)',
    description: 'Design the NMOS source follower for ID = 1mA, Av = 0.8, VTH = 0.5V, unCox = 100uA/V^2, VDD = 1.8V, lambda = 0, RG = 50kΩ.',
    defaultInputs: {
      id: 1.0,     // mA
      av: 0.8,    // V/V
      vth: 0.5,
      unCox: 100, // uA/V^2
      vdd: 1.8,
      rg: 50.0    // kOhms
    },
    solve: function(inputs) {
      const { id, av, vth, unCox, vdd, rg } = inputs;
      const gmRs = av / (1 - av); // 0.8 / 0.2 = 4.0
      const rs = 1.5; // kOhms
      const gm = gmRs / rs; // mS
      const vov = (2 * id) / gm; // V
      const vgs = vth + vov;
      const unCox_mA = unCox * 1e-3;
      const wl = (2 * id) / (unCox_mA * vov * vov);

      const steps = [
        {
          step: '1. Small-Signal Voltage Gain Expression',
          math: `\\begin{aligned}
            A_v &= \\frac{g_m R_S}{1 + g_m R_S} = ${av} \\\\[4pt]
            g_m R_S &= \\frac{A_v}{1 - A_v} = \\frac{${av}}{1 - ${av}} = \\mathbf{${gmRs.toFixed(1)}}
          \\end{aligned}`
        },
        {
          step: '2. Sizing RS, Transconductance gm and Overdrive Voltage',
          math: `\\begin{aligned}
            \\text{Selecting } R_S &= ${rs}\\text{ k}\\Omega \\implies g_m = \\frac{${gmRs.toFixed(1)}}{${rs}\\text{ k}\\Omega} = \\mathbf{${gm.toFixed(2)}\\text{ mS}} \\\\[4pt]
            g_m &= \\frac{2 I_D}{V_{GS} - V_{TH}} \\implies (V_{GS} - V_{TH}) = \\frac{2 \\times ${id}\\text{ mA}}{${gm.toFixed(2)}\\text{ mS}} = \\mathbf{${vov.toFixed(2)}\\text{ V}} \\\\[4pt]
            V_{GS} &= V_{TH} + (V_{GS} - V_{TH}) = ${vth} + ${vov.toFixed(2)} = \\mathbf{${vgs.toFixed(2)}\\text{ V}}
          \\end{aligned}`
        },
        {
          step: '3. Aspect Ratio (W/L) Calculation',
          math: `\\begin{aligned}
            \\left(\\frac{W}{L}\\right) &= \\frac{2 I_D}{\\mu_n C_{ox} (V_{GS} - V_{TH})^2} = \\frac{2 \\times ${id}\\text{ mA}}{0.1\\text{ mA/V}^2 \\times (${vov.toFixed(2)})^2} = \\mathbf{${wl.toFixed(1)}}
          \\end{aligned}`
        }
      ];

      return {
        results: {
          'A_v': av.toFixed(2),
          'g_m': gm.toFixed(2) + ' mS',
          'R_S': rs.toFixed(2) + ' kΩ',
          'V_GS': vgs.toFixed(2) + ' V',
          'W/L': wl.toFixed(1)
        },
        steps
      };
    }
  },

  // -------------------------------------------------------------
  // Unit IV - Fig Q7(b): NMOS & PMOS Multi-Stage Current Mirror
  // -------------------------------------------------------------
  'u4-current-mirror': {
    title: 'Unit IV: Current Mirror Scaling & Icopy (Exam Q7b)',
    pdfRef: 'Page 19, Model Exam Fig. Q7(b) & Page 12, Review Q1',
    description: 'Calculate Icopy in the cascaded NMOS/PMOS current mirror where (W/L)n = (W/L)p and transistor multipliers are M_REF=1, M1=5, M2=1, M3=2, M4=3.',
    defaultInputs: {
      iref: 0.4,
      mRef: 1,
      m1: 5,
      mP1: 1,
      mP2: 2,
      m3: 3
    },
    solve: function(inputs) {
      const { iref, mRef, m1, mP1, mP2, m3 } = inputs;
      const i1 = iref * (m1 / mRef);
      const i2 = i1 * (mP2 / mP1);
      const icopy = i2 * (m3 / 1);

      const steps = [
        {
          step: '1. Primary NMOS Current Mirror Stage',
          math: `\\begin{aligned}
            I_1 &= I_{REF} \\cdot \\frac{(W/L)_1}{(W/L)_{REF}} = ${iref}\\text{ mA} \\times \\frac{${m1}}{${mRef}} = \\mathbf{${i1.toFixed(2)}\\text{ mA}}
          \\end{aligned}`
        },
        {
          step: '2. Cascaded PMOS Top Mirror Stage',
          math: `\\begin{aligned}
            I_2 &= I_1 \\cdot \\frac{(W/L)_{P2}}{(W/L)_{P1}} = ${i1.toFixed(2)}\\text{ mA} \\times \\frac{${mP2}}{${mP1}} = \\mathbf{${i2.toFixed(2)}\\text{ mA}}
          \\end{aligned}`
        },
        {
          step: '3. Final Output Copy Current Icopy',
          math: `\\begin{aligned}
            I_{copy} &= I_2 \\cdot \\frac{(W/L)_3}{(W/L)_{REF}} = \\mathbf{${icopy.toFixed(2)}\\text{ mA}}
          \\end{aligned}`
        }
      ];

      return {
        results: {
          'I_REF': iref.toFixed(2) + ' mA',
          'I_1 (NMOS 5x)': i1.toFixed(2) + ' mA',
          'I_2 (PMOS 2x)': i2.toFixed(2) + ' mA',
          'I_copy (Final)': icopy.toFixed(2) + ' mA'
        },
        steps
      };
    }
  }
};

// -------------------------------------------------------------
// Part A: 20 Multiple-Choice Exam Questions & Concept Practice
// -------------------------------------------------------------
const examQuizData = [
  {
    q: "1. Which of the following is the correct relationship between base and emitter current of a BJT?",
    opts: ["IB = β IE", "IB = IE", "IB = (β + 1) IE", "IE = (β + 1) IB"],
    ans: 3,
    ref: "Page 15, Q1 (CO-1, L1)",
    exp: "Since IE = IB + IC and IC = β·IB, we have IE = IB + β·IB = (β + 1)·IB."
  },
  {
    q: "2. For a fixed bias circuit, what are the coordinates of end points of DC load line?",
    opts: ["(VCC, 0) and (0, VCC/RC)", "(0, VCC) and (VCC/RC, 0)", "(VCC, 0) and (0, VCC/RB)", "(0, VCC) and (VCC/RB, 0)"],
    ans: 0,
    ref: "Page 15, Q2 (CO-1, L2)",
    exp: "When IC = 0, VCE = VCC (cutoff point on x-axis). When VCE = 0, IC(sat) = VCC / RC (saturation point on y-axis)."
  },
  {
    q: "3. To perform DC analysis of voltage divider bias circuit using approximate analysis, the condition that must be satisfied is:",
    opts: ["β·re ≥ 10·R2", "β·RE ≥ 10·R2", "β·re ≤ 10·R2", "β·RE ≤ 10·R2"],
    ans: 1,
    ref: "Page 15, Q3 (CO-1, L2)",
    exp: "Approximate analysis assumes base current IB is negligible compared to the divider current through R2. This requires the input resistance looking into the base Zb ≈ β·RE to be at least 10 times R2 (β·RE ≥ 10·R2)."
  },
  {
    q: "4. A coupling Capacitor acts as:",
    opts: ["A DC short", "An AC open", "A DC open and AC short", "A DC short and an AC open"],
    ans: 2,
    ref: "Page 15, Q4 (CO-1, L1)",
    exp: "XC = 1/(2πfC). For DC (f = 0), XC = ∞ (open circuit), isolating DC bias stages. For signal AC frequencies, XC ≈ 0 (short circuit), passing the AC signal."
  },
  {
    q: "5. Reducing all DC sources to zero is one of the steps in getting the:",
    opts: ["DC equivalent circuit", "AC equivalent circuit", "Complete amplifier circuit", "Voltage divider biased circuit"],
    ans: 1,
    ref: "Page 15, Q5 (CO-1, L1)",
    exp: "In small-signal AC analysis, all constant DC supplies (VCC, VDD) are connected to AC ground (zero potential)."
  },
  {
    q: "6. Which is NOT true for a BJT emitter follower?",
    opts: ["Its voltage gain is less than or equal to 1", "It provides very high current gain", "High input impedance and low output impedance", "Input and output voltages are out of phase by 180 degrees"],
    ans: 3,
    ref: "Page 15, Q6 (CO-1, L2)",
    exp: "In an emitter follower (Common Collector), the output at the emitter is in phase (0° phase shift) with the base input signal."
  },
  {
    q: "7. In the AC analysis of BJT circuits, the effect of base width modulation can be neglected by considering:",
    opts: ["ro = 0", "ro ≥ 10·RE", "ro ≥ 10·re", "ro = ∞"],
    ans: 3,
    ref: "Page 15, Q7 (CO-1, L2)",
    exp: "Base width modulation (Early effect) produces a finite output resistance ro = VA/IC. Neglecting it corresponds to ideal infinite output resistance (ro = ∞)."
  },
  {
    q: "8. The value of RE to be considered while performing DC analysis of the bypassed circuit shown in Page 16 is:",
    opts: ["0.47 kΩ", "1.2 kΩ", "1.67 kΩ", "0 Ω"],
    ans: 2,
    ref: "Page 16, Q8 (CO-1, L2)",
    exp: "For DC analysis, bypass capacitor CE acts as an open circuit. Therefore, both series resistors are active: RE = 1.2 kΩ + 0.47 kΩ = 1.67 kΩ."
  },
  {
    q: "9. Saturation region of an N-MOSFET is defined by which voltage conditions?",
    opts: ["VGS > VTH and VDS ≥ VGS - VTH", "VGS < VTH", "VGS > VTH and VDS < VGS - VTH", "VGS < VTH and VDS < VGS - VTH"],
    ans: 0,
    ref: "Page 16, Q9 (CO-2, L2)",
    exp: "To turn the channel on, VGS > VTH. For saturation (pinch-off at drain edge), VDS must be greater than or equal to the overdrive voltage (VDS ≥ VGS - VTH)."
  },
  {
    q: "10. For a MOSFET operating in saturation, if channel width W is doubled, drain current ID changes by a factor of:",
    opts: ["0.5", "4", "2", "No change"],
    ans: 2,
    ref: "Page 16, Q10 (CO-2, L2)",
    exp: "ID = (1/2)·μn·Cox·(W/L)·(VGS - VTH)². ID is directly proportional to W, so doubling W doubles ID (factor of 2)."
  },
  {
    q: "11. Which parameter represents channel-length modulation in the small-signal model of a MOSFET?",
    opts: ["gm", "ro", "vGS", "μn"],
    ans: 1,
    ref: "Page 16, Q11 (CO-2, L1)",
    exp: "ro = 1 / (λ·ID) models the finite slope of the ID - VDS curve caused by channel length modulation in saturation."
  },
  {
    q: "12. If a MOSFET is to be used as a linear amplifier, it must operate in the:",
    opts: ["Cut-off region", "Triode region", "Saturation region", "Both cut-off and triode region"],
    ans: 2,
    ref: "Page 16, Q12 (CO-2, L2)",
    exp: "In saturation, the MOSFET behaves as a voltage-controlled current source with high output impedance, providing maximum linear voltage gain."
  },
  {
    q: "13. When VDS is increased beyond pinch-off, the pinch-off point moves:",
    opts: ["Towards the source region", "Towards the drain region", "Towards bottom of bulk", "Away from source region"],
    ans: 0,
    ref: "Page 16, Q13 (CO-2, L2)",
    exp: "Increasing VDS causes the depletion region at the drain to widen, pulling the pinch-off point towards the source and shortening the effective channel length (ΔL)."
  },
  {
    q: "14. For M1 with VTH = 0.4V, gate at 1V, source at 0.2V, drain at 0.2V: determine the region of operation:",
    opts: ["Cut-off region", "Triode region", "Saturation region", "Sub threshold conduction"],
    ans: 1,
    ref: "Page 16, Q14 (CO-2, L3)",
    exp: "VGS = 1 - 0.2 = 0.8V > VTH (channel on). VDS = 0.2 - 0.2 = 0V < VGS - VTH (0.4V). Therefore, it operates in the Triode (ohmic) region."
  },
  {
    q: "15. In the triode region, the channel between source and drain acts as a:",
    opts: ["Variable capacitance", "Variable inductance", "Variable resistance", "None of the mentioned"],
    ans: 2,
    ref: "Page 17, Q15 (CO-2, L1)",
    exp: "For small VDS, ID is linear with VDS: rDS = 1 / [μn·Cox·(W/L)·(VGS - VTH)], behaving as a voltage-controlled variable resistor."
  },
  {
    q: "16. Sub-threshold conduction of a MOSFET means:",
    opts: ["Conduction of MOSFET for gate voltages below the threshold voltage", "Saturation of velocity of charge carriers at high electric field", "Increase of charge carriers in depletion region when body voltage decreases", "The variation in drain current due to pinch-off movement"],
    ans: 0,
    ref: "Page 17, Q16 (CO-2, L2)",
    exp: "Even when VGS < VTH, weak inversion creates an exponential sub-threshold diffusion current (leakage)."
  },
  {
    q: "17. The type of power amplifier that exhibits crossover distortion in its output is:",
    opts: ["Class A", "Class B", "Class C", "Class AB"],
    ans: 1,
    ref: "Page 17, Q17 (CO-4, L1)",
    exp: "Class B push-pull complementary pairs exhibit crossover distortion around zero input because neither transistor conducts until |Vin| exceeds VBE/VTH (~0.7V)."
  },
  {
    q: "18. Which of the following statements is NOT correct for a differential amplifier?",
    opts: ["Amplifies the difference between two input signals", "Rejects the common mode signals", "Output voltage is given by Vo = Ad·Vd + Ac·Vc", "Ideal value of CMRR for differential amplifier is 0"],
    ans: 3,
    ref: "Page 17, Q18 (CO-4, L2)",
    exp: "An ideal differential amplifier completely rejects common-mode noise (Ac = 0), so ideal CMRR = |Ad / Ac| = ∞, NOT 0!"
  },
  {
    q: "19. If output is measured between two Drain terminals of a MOS differential pair, it is configured as:",
    opts: ["Dual Input Balanced Output", "Dual Input Unbalanced Output", "Single Input Balanced Output", "Single Input Unbalanced Output"],
    ans: 0,
    ref: "Page 17, Q19 (CO-4, L2)",
    exp: "Measuring differential output between both drain nodes is called Balanced (or double-ended) output. Two input signals = Dual Input Balanced Output."
  },
  {
    q: "20. What is crossover distortion in power amplifiers?",
    opts: ["Distortion occurred due to resistors", "Distortion occurred due to capacitors", "Distortion occurred due to inductors", "Effect occurred during switching of transistor after every half cycle"],
    ans: 3,
    ref: "Page 17, Q20 (CO-4, L1)",
    exp: "Crossover distortion is the deadband interval occurring when switching from the NPN/NMOS pull-up device to the PNP/PMOS pull-down device as the signal crosses through zero."
  }
];

window.ExamSolver = {
  currentProbKey: 'u1-emitter-follower',
  quizAnswers: {},

  init: function() {
    this.renderTabs();
    this.loadProblem(this.currentProbKey);
  },

  renderTabs: function() {
    const nav = document.getElementById('examTabsNav');
    if (!nav) return;
    nav.innerHTML = '';

    // Numerical Problems
    Object.keys(examProblems).forEach(key => {
      const prob = examProblems[key];
      const btn = document.createElement('button');
      btn.className = 'exam-tab-btn' + (key === this.currentProbKey ? ' active' : '');
      btn.textContent = prob.title.split(':')[0] + ' Numerical';
      btn.addEventListener('click', () => {
        document.querySelectorAll('.exam-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.loadProblem(key);
      });
      nav.appendChild(btn);
    });

    // Quiz Tab
    const quizBtn = document.createElement('button');
    quizBtn.className = 'exam-tab-btn' + (this.currentProbKey === 'quiz' ? ' active' : '');
    quizBtn.textContent = ' Part A: 20-Question Concept Quiz';
    quizBtn.style.borderColor = 'var(--accent-amber)';
    quizBtn.addEventListener('click', () => {
      document.querySelectorAll('.exam-tab-btn').forEach(b => b.classList.remove('active'));
      quizBtn.classList.add('active');
      this.loadQuiz();
    });
    nav.appendChild(quizBtn);
  },

  loadProblem: function(key) {
    this.currentProbKey = key;
    const prob = examProblems[key];
    const container = document.getElementById('examProblemContent');
    if (!container) return;

    // Show standard problem layout
    container.style.display = 'grid';
    const quizContainer = document.getElementById('examQuizContainer');
    if (quizContainer) quizContainer.style.display = 'none';

    document.getElementById('examProbTitle').textContent = prob.title;
    document.getElementById('examProbRef').textContent = ' PDF Reference: ' + prob.pdfRef;
    document.getElementById('examProbDesc').textContent = prob.description;

    const inputsBox = document.getElementById('examInputsBox');
    inputsBox.innerHTML = '';
    const currentValues = { ...prob.defaultInputs };

    Object.keys(currentValues).forEach(param => {
      const fieldDiv = document.createElement('div');
      fieldDiv.className = 'ctl-group';
      fieldDiv.innerHTML = `
        <div class="ctl-header">
          <label style="color:#cbd5e1; font-size:0.82rem; font-family:monospace;">${param}</label>
          <span class="val" id="examVal_${param}">${currentValues[param]}</span>
        </div>
        <input type="number" step="any" class="exam-input-num" data-param="${param}" value="${currentValues[param]}" 
          style="background:#090e18; border:1px solid #1e293b; color:#38bdf8; padding:6px 10px; border-radius:4px; font-family:monospace; width:100%; outline:none;">
      `;
      inputsBox.appendChild(fieldDiv);
    });

    const updateSolution = () => {
      document.querySelectorAll('.exam-input-num').forEach(inp => {
        currentValues[inp.dataset.param] = parseFloat(inp.value) || 0;
        const valSpan = document.getElementById(`examVal_${inp.dataset.param}`);
        if (valSpan) valSpan.textContent = inp.value;
      });

      const sol = prob.solve(currentValues);
      this.renderResults(sol);
    };

    inputsBox.addEventListener('input', updateSolution);
    updateSolution();
  },

  loadQuiz: function() {
    this.currentProbKey = 'quiz';
    const container = document.getElementById('examProblemContent');
    if (container) container.style.display = 'none';

    document.getElementById('examProbTitle').textContent = 'Model Examination Paper: Part A Concept Assessment (20 Marks)';
    document.getElementById('examProbRef').textContent = ' PDF Reference: Pages 15-17, 25EC211 Model Exam Paper (OMR Format)';
    document.getElementById('examProbDesc').textContent = 'Test your fundamental understanding across Units I to IV. Click any option for instant evaluation and step-by-step reasoning.';

    let quizContainer = document.getElementById('examQuizContainer');
    if (!quizContainer) {
      quizContainer = document.createElement('div');
      quizContainer.id = 'examQuizContainer';
      quizContainer.className = 'card';
      quizContainer.style.marginTop = '20px';
      container.parentElement.appendChild(quizContainer);
    }
    quizContainer.style.display = 'block';

    let html = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom:1px solid var(--border-subtle); padding-bottom:12px;">
        <h4 style="color:#fff; font-size:1.1rem;">Course Learning Objective Assessment (CO-1 to CO-5)</h4>
        <div id="quizScoreBadge" class="status-badge active-bjt" style="font-size:0.9rem;">Score: 0 / 20</div>
      </div>
      <div style="display:flex; flex-direction:column; gap:20px;">
    `;

    examQuizData.forEach((item, qIdx) => {
      html += `
        <div class="problem-box" style="padding:18px;" id="quizQ_${qIdx}">
          <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
            <strong style="color:#f1f5f9; font-size:0.95rem;">${item.q}</strong>
            <span style="font-family:monospace; font-size:0.75rem; color:var(--text-dim);">${item.ref}</span>
          </div>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:10px; margin-bottom:12px;">
            ${item.opts.map((opt, oIdx) => `
              <button type="button" class="exp-preset-btn quiz-opt-btn" data-q="${qIdx}" data-o="${oIdx}" 
                style="padding:10px 14px; font-size:0.86rem; border-radius:6px; cursor:pointer; text-align:left;">
                <strong>${String.fromCharCode(65 + oIdx)})</strong> ${opt}
              </button>
            `).join('')}
          </div>
          <div class="quiz-feedback" id="quizFb_${qIdx}" style="display:none; padding:10px 14px; border-radius:6px; font-size:0.85rem; font-family:monospace;"></div>
        </div>
      `;
    });

    html += `</div>`;
    quizContainer.innerHTML = html;

    // Attach click listeners
    quizContainer.querySelectorAll('.quiz-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const qIdx = parseInt(btn.dataset.q);
        const oIdx = parseInt(btn.dataset.o);
        const item = examQuizData[qIdx];
        const fbBox = document.getElementById(`quizFb_${qIdx}`);

        // Disable options for this question
        const optBtns = document.querySelectorAll(`[data-q="${qIdx}"]`);
        optBtns.forEach(b => b.disabled = true);

        if (oIdx === item.ans) {
          btn.style.background = 'rgba(16, 185, 129, 0.25)';
          btn.style.borderColor = '#10b981';
          btn.style.color = '#34d399';
          fbBox.style.display = 'block';
          fbBox.style.background = 'rgba(16, 185, 129, 0.12)';
          fbBox.style.border = '1px solid #10b981';
          fbBox.style.color = '#a7f3d0';
          fbBox.innerHTML = `<strong>Correct!</strong> ${item.exp}`;
          this.quizAnswers[qIdx] = true;
        } else {
          btn.style.background = 'rgba(244, 63, 94, 0.25)';
          btn.style.borderColor = '#f43f5e';
          btn.style.color = '#fda4af';
          // Highlight correct answer
          const correctBtn = document.querySelector(`[data-q="${qIdx}"][data-o="${item.ans}"]`);
          if (correctBtn) {
            correctBtn.style.background = 'rgba(16, 185, 129, 0.25)';
            correctBtn.style.borderColor = '#10b981';
          }
          fbBox.style.display = 'block';
          fbBox.style.background = 'rgba(244, 63, 94, 0.12)';
          fbBox.style.border = '1px solid #f43f5e';
          fbBox.style.color = '#fecdd3';
          fbBox.innerHTML = `Wrong: <strong>Incorrect.</strong> Correct answer is <strong>${String.fromCharCode(65 + item.ans)}</strong>.<br>${item.exp}`;
          this.quizAnswers[qIdx] = false;
        }

        // Update score
        const score = Object.values(this.quizAnswers).filter(Boolean).length;
        const total = Object.keys(this.quizAnswers).length;
        const badge = document.getElementById('quizScoreBadge');
        if (badge) {
          badge.textContent = `Score: ${score} / ${examQuizData.length} (${total} attempted)`;
        }
      });
    });
  },

  renderResults: function(solution) {
    const resBox = document.getElementById('examResultsGrid');
    if (resBox) {
      resBox.innerHTML = '';
      Object.keys(solution.results).forEach(k => {
        const pill = document.createElement('div');
        pill.className = 'metric';
        pill.innerHTML = `
          <div class="lbl">${k}</div>
          <div class="val">${solution.results[k]}</div>
        `;
        resBox.appendChild(pill);
      });
    }

    const stepsBox = document.getElementById('examStepsList');
    if (stepsBox) {
      stepsBox.innerHTML = '';
      solution.steps.forEach(s => {
        const card = document.createElement('div');
        card.className = 'step-card';
        card.innerHTML = `
          <h5>${s.step}</h5>
          <div class="eq-box" data-tex="${s.math.replace(/"/g, '&quot;')}">${s.math}</div>
        `;
        stepsBox.appendChild(card);
      });

      if (window.katex) {
        stepsBox.querySelectorAll('.eq-box').forEach(el => {
          try {
            katex.render(el.getAttribute('data-tex'), el, { displayMode: true, throwOnError: false });
          } catch(e) {}
        });

      }
    }
  }
};

window.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('examTabsNav')) {
    window.ExamSolver.init();
  }
});
