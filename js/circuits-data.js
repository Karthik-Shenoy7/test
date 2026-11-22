/* ==========================================================================
   circuits-data.js - Analog Circuits Odyssey Circuit Knowledge Base
   Curriculum: 25ECE211 (Analog Electronic Circuits I)
   Stage 1: BJT Small-Signal Analysis (Slides 65-72)
   Stage 2: MOSFET Basics & Amplifiers (Slides 73-127)
   Stage 3: Current Mirrors & Differential Amplifiers (Slides 128-154)
   ========================================================================== */

const circuitsData = {
  "bjt-ce-fixed": {
    "id": "bjt-ce-fixed",
    "family": "bjt",
    "name": "BJT Common-Emitter Fixed Bias Amplifier",
    "category": "BJT Amplifiers",
    "slideRef": "Slides 65-67, Fig. 5.25 & Fig. 5.151-5.153",
    "summary": "The basic bipolar common-emitter stage with base resistor RB and collector resistor RC. Provides high voltage gain with 180° phase inversion.",
    "svgType": "ce-fixed",
    "components": [
      {
        "id": "vcc",
        "name": "Supply Voltage (VCC)",
        "symbol": "V_{CC}",
        "unit": "V"
      },
      {
        "id": "rb",
        "name": "Base Resistor (RB)",
        "symbol": "R_B",
        "unit": "kΩ"
      },
      {
        "id": "rc",
        "name": "Collector Resistor (RC)",
        "symbol": "R_C",
        "unit": "kΩ"
      },
      {
        "id": "beta",
        "name": "Current Gain (β)",
        "symbol": "\\beta",
        "unit": ""
      },
      {
        "id": "ro",
        "name": "Early Resistance (ro)",
        "symbol": "r_o",
        "unit": "kΩ"
      },
      {
        "id": "rl",
        "name": "Load Resistor (RL)",
        "symbol": "R_L",
        "unit": "kΩ"
      }
    ],
    "defaultValues": {
      "vcc": 12,
      "rb": 470,
      "rc": 3,
      "beta": 100,
      "ro": 999999,
      "rl": 999999,
      "rsi": 0
    },
    "presets": [
      {
        "name": "Example 5.1 (Slide 65) - ro = ∞",
        "desc": "VCC = 12V, RB = 470kΩ, RC = 3kΩ, β = 100, ro = ∞",
        "values": {
          "vcc": 12,
          "rb": 470,
          "rc": 3,
          "beta": 100,
          "ro": 999999,
          "rl": 999999,
          "rsi": 0
        }
      },
      {
        "name": "Example 5.1 (Slide 65) - ro = 50 kΩ",
        "desc": "Compare effect of finite Early resistance ro = 50kΩ",
        "values": {
          "vcc": 12,
          "rb": 470,
          "rc": 3,
          "beta": 100,
          "ro": 50,
          "rl": 999999,
          "rsi": 0
        }
      },
      {
        "name": "Fig. 5.151 (Slide 66) - Problem 11",
        "desc": "VCC = 12V, RB = 220kΩ, RC = 2.2kΩ, β = 60, ro = 40kΩ",
        "values": {
          "vcc": 12,
          "rb": 220,
          "rc": 2.2,
          "beta": 60,
          "ro": 40,
          "rl": 999999,
          "rsi": 0
        }
      },
      {
        "name": "Fig. 5.153 (Slide 67) - Problem 13",
        "desc": "Dual Supply, RB = 390kΩ, RC = 5.6kΩ, β = 100, gos = 25µS (ro = 40kΩ)",
        "values": {
          "vcc": 20,
          "rb": 390,
          "rc": 5.6,
          "beta": 100,
          "ro": 40,
          "rl": 999999,
          "rsi": 0
        }
      }
    ],
    "equationGroups": [
      {
        "id": "dc-bias",
        "title": "DC Quiescent Analysis (Slide 65)",
        "componentsInvolved": [
          "vcc",
          "rb",
          "beta"
        ],
        "equations": [
          {
            "label": "Base Current IBQ",
            "tex": "I_{BQ} = \\frac{V_{CC} - V_{BE}}{R_B}",
            "slide": "Slide 65",
            "steps": [
              {
                "title": "Step 1: Kirchhoff's Voltage Law",
                "desc": "Apply KVL starting from the VCC supply line, traveling down through resistor RB and across the forward-biased base-emitter junction to ground:",
                "tex": "V_{CC} - I_B R_B - V_{BE} = 0"
              },
              {
                "title": "Step 2: Junction Voltage Drop",
                "desc": "For any forward-biased silicon NPN bipolar junction transistor in the active region, the base-to-emitter drop is approximately 0.7 V:",
                "tex": "V_{BE} \\approx 0.7\\text{ V}"
              },
              {
                "title": "Step 3: Solve for Base Current",
                "desc": "Rearranging the loop equation to isolate the quiescent base current IBQ:",
                "tex": "I_{BQ} = \\frac{V_{CC} - 0.7\\text{ V}}{R_B}"
              },
              {
                "title": "Step 4: Plug in Values (Example 5.1)",
                "desc": "With VCC = 12 V and RB = 470 kΩ:",
                "tex": "I_{BQ} = \\frac{12\\text{ V} - 0.7\\text{ V}}{470\\text{ k}\\Omega} = \\frac{11.3\\text{ V}}{470\\text{ k}\\Omega} = 24.04\\text{ }\\mu\\text{A}"
              }
            ]
          },
          {
            "label": "Emitter Current IEQ",
            "tex": "I_{EQ} = (\\beta + 1) I_{BQ}",
            "slide": "Slide 65",
            "steps": [
              {
                "title": "Step 1: Current Relationships",
                "desc": "The collector current is proportional to the base current by current gain β:",
                "tex": "I_C = \\beta I_B"
              },
              {
                "title": "Step 2: Sum Currents at Transistor",
                "desc": "Kirchhoff's Current Law dictates that the emitter current is the sum of base and collector currents:",
                "tex": "I_E = I_B + I_C = I_B + \\beta I_B = (\\beta + 1) I_B"
              },
              {
                "title": "Step 3: Numerical Result (Example 5.1)",
                "desc": "With β = 100 and IBQ = 24.04 µA:",
                "tex": "I_{EQ} = (100 + 1) \\times 24.04\\text{ }\\mu\\text{A} = 2.428\\text{ mA}"
              }
            ]
          }
        ]
      },
      {
        "id": "params",
        "title": "Small-Signal Parameters (Slide 65)",
        "componentsInvolved": [
          "beta"
        ],
        "equations": [
          {
            "label": "Dynamic Emitter Resistance re",
            "tex": "r_e = \\frac{V_T}{I_E} \\approx \\frac{26\\text{ mV}}{I_E}",
            "slide": "Slide 65 (Eq. 5.25)",
            "steps": [
              {
                "title": "Step 1: Shockley Diode Physics",
                "desc": "At room temperature (300 K), the thermal voltage VT is approximately 25.86 mV (standardized to 26 mV in the curriculum):",
                "tex": "V_T = \\frac{k T}{q} \\approx 26\\text{ mV}"
              },
              {
                "title": "Step 2: AC Dynamic Resistance Definition",
                "desc": "re is the slope of the forward-biased base-emitter junction characteristic at the Q-point:",
                "tex": "r_e = \\frac{26\\text{ mV}}{I_{EQ}\\text{ [mA]}} \\; [\\Omega]"
              },
              {
                "title": "Step 3: Numerical Value (Example 5.1)",
                "desc": "With IEQ = 2.428 mA:",
                "tex": "r_e = \\frac{26\\text{ mV}}{2.428\\text{ mA}} = 10.71\\text{ }\\Omega"
              }
            ]
          }
        ]
      },
      {
        "id": "impedance",
        "title": "Impedance Expressions (Slide 65)",
        "componentsInvolved": [
          "rb",
          "beta"
        ],
        "equations": [
          {
            "label": "Input Impedance Zi",
            "tex": "Z_i = R_B \\parallel \\beta r_e",
            "slide": "Slide 65",
            "steps": [
              {
                "title": "Step 1: Reflected Base Impedance",
                "desc": "The internal dynamic emitter resistance re appears multiplied by β when viewed from the base terminal:",
                "tex": "Z_b = \\beta r_e"
              },
              {
                "title": "Step 2: Parallel Input Resistor",
                "desc": "The external base bias resistor RB is in parallel with this reflected impedance Zb:",
                "tex": "Z_i = R_B \\parallel \\beta r_e = \\frac{R_B (\\beta r_e)}{R_B + \\beta r_e}"
              },
              {
                "title": "Step 3: Numerical Value (Example 5.1)",
                "desc": "With RB = 470 kΩ, β = 100, and re = 10.71 Ω (β*re = 1.071 kΩ):",
                "tex": "Z_i = 470\\text{ k}\\Omega \\parallel 1.071\\text{ k}\\Omega = 1.069\\text{ k}\\Omega"
              }
            ]
          },
          {
            "label": "Output Impedance Zo",
            "tex": "Z_o = R_C \\quad (r_o = \\infty)",
            "slide": "Slide 65",
            "steps": [
              {
                "title": "Step 1: Set Input Signal to Zero",
                "desc": "To find output impedance, set Vi = 0. This forces the AC base current Ib to zero, which deactivates the dependent current source (β*Ib = 0):",
                "tex": "V_i = 0 \\implies I_b = 0 \\implies \\beta I_b = 0"
              },
              {
                "title": "Step 2: Look into Collector Terminal",
                "desc": "Looking back into the collector node, the only path to AC ground is collector resistor RC (when transistor output resistance ro is infinite):",
                "tex": "Z_o = R_C = 3.0\\text{ k}\\Omega"
              }
            ]
          }
        ]
      },
      {
        "id": "gain",
        "title": "Voltage & Current Gains (Slide 65)",
        "componentsInvolved": [
          "rc",
          "beta"
        ],
        "equations": [
          {
            "label": "Voltage Gain Av",
            "tex": "A_v = -\\frac{R_C}{r_e}",
            "slide": "Slide 65",
            "steps": [
              {
                "title": "Step 1: AC Output Voltage",
                "desc": "The dependent current source directs current upward through RC toward ground, creating an inverted output voltage:",
                "tex": "V_o = -I_c R_C = -(\\beta I_b) R_C"
              },
              {
                "title": "Step 2: AC Input Voltage",
                "desc": "The input voltage appears directly across the base dynamic resistance:",
                "tex": "V_i = I_b (\\beta r_e)"
              },
              {
                "title": "Step 3: Compute Gain Ratio",
                "desc": "Dividing output voltage Vo by input voltage Vi cancels the base current term β*Ib:",
                "tex": "A_v = \\frac{V_o}{V_i} = \\frac{-(\\beta I_b) R_C}{I_b (\\beta r_e)} = -\\frac{R_C}{r_e}"
              },
              {
                "title": "Step 4: Numerical Value (Example 5.1)",
                "desc": "With RC = 3 kΩ and re = 10.71 Ω:",
                "tex": "A_v = -\\frac{3000\\text{ }\\Omega}{10.71\\text{ }\\Omega} = -280.11\\text{ V/V}"
              },
              {
                "title": "Step 5: Physical Interpretation",
                "desc": "The negative sign signifies a 180° phase inversion between the input signal and the amplified output."
              }
            ]
          }
        ]
      }
    ],
    "branches": [
      {
        "id": "branch-finite-ro",
        "name": "Branch 1: Add Finite Early Resistance ro",
        "whatChanged": "Added transistor internal output resistance ro in parallel with RC (Early effect, Slide 65e & 66)",
        "changedElement": "ro",
        "formulaDiffs": [
          {
            "name": "Output Impedance Zo",
            "before": "Z_o = R_C",
            "after": "Z_o = R_C \\parallel r_o"
          },
          {
            "name": "Voltage Gain Av",
            "before": "A_v = -\\frac{R_C}{r_e}",
            "after": "A_v = -\\frac{R_C \\parallel r_o}{r_e}"
          }
        ],
        "steps": [
          {
            "title": "Step 1: Early Effect Physics",
            "desc": "In real transistors, collector-emitter voltage modulates the base width, introducing a finite internal resistance ro from collector to emitter."
          },
          {
            "title": "Step 2: Output Shunting",
            "desc": "In the small-signal model, ro appears directly across collector resistor RC to ground:",
            "tex": "Z_o = R_C \\parallel r_o = \\frac{R_C r_o}{R_C + r_o}"
          },
          {
            "title": "Step 3: Gain Reduction",
            "desc": "The effective AC load decreases, reducing the voltage gain magnitude from -280 V/V down to -264 V/V (Example 5.1):",
            "tex": "A_v = -\\frac{R_C \\parallel r_o}{r_e}"
          }
        ],
        "impactText": "Lowers Zo from RC to RC || ro and reduces voltage gain magnitude."
      },
      {
        "id": "branch-finite-rl",
        "name": "Branch 2: Add External Load RL",
        "whatChanged": "Connected external AC load resistor RL via coupling capacitor C2 (Slide 67 Fig 5.153)",
        "changedElement": "rl",
        "formulaDiffs": [
          {
            "name": "Loaded Gain AvL",
            "before": "A_v = -\\frac{R_C}{r_e}",
            "after": "A_{vL} = -\\frac{R_C \\parallel R_L}{r_e}"
          }
        ],
        "steps": [
          {
            "title": "Step 1: AC Load Connection",
            "desc": "Output coupling capacitor C2 acts as an AC short circuit, placing load RL in parallel with RC for AC signals:",
            "tex": "R_L^{\\text{eff}} = R_C \\parallel R_L"
          },
          {
            "title": "Step 2: Loaded Voltage Gain",
            "desc": "The amplifier drives the combined parallel resistance, lowering output swing:",
            "tex": "A_{vL} = -\\frac{R_C \\parallel R_L}{r_e}"
          }
        ],
        "impactText": "Draws signal current and reduces the loaded voltage gain AvL."
      }
    ]
  },
  "bjt-ce-divider": {
    "id": "bjt-ce-divider",
    "family": "bjt",
    "name": "BJT Common-Emitter Voltage-Divider Bias",
    "category": "BJT Amplifiers",
    "slideRef": "Slides 68-71, Fig. 5.28 & Fig. 5.157",
    "summary": "Highly stable CE amplifier using a resistive divider (R1, R2) to set base voltage, with emitter resistor RE for thermal stabilization.",
    "svgType": "ce-divider",
    "components": [
      {
        "id": "vcc",
        "name": "Supply Voltage (VCC)",
        "symbol": "V_{CC}",
        "unit": "V"
      },
      {
        "id": "r1",
        "name": "Upper Divider (R1)",
        "symbol": "R_1",
        "unit": "kΩ"
      },
      {
        "id": "r2",
        "name": "Lower Divider (R2)",
        "symbol": "R_2",
        "unit": "kΩ"
      },
      {
        "id": "rc",
        "name": "Collector Resistor (RC)",
        "symbol": "R_C",
        "unit": "kΩ"
      },
      {
        "id": "re",
        "name": "Emitter Resistor (RE)",
        "symbol": "R_E",
        "unit": "kΩ"
      },
      {
        "id": "beta",
        "name": "Current Gain (β)",
        "symbol": "\\beta",
        "unit": ""
      },
      {
        "id": "ro",
        "name": "Early Resistance (ro)",
        "symbol": "r_o",
        "unit": "kΩ"
      }
    ],
    "defaultValues": {
      "vcc": 22,
      "r1": 56,
      "r2": 8.2,
      "rc": 6.8,
      "re": 1.5,
      "beta": 90,
      "ro": 999999,
      "rl": 999999,
      "rsi": 0
    },
    "presets": [
      {
        "name": "Example 5.2 (Slide 69) - ro = ∞",
        "desc": "VCC = 22V, R1 = 56kΩ, R2 = 8.2kΩ, RC = 6.8kΩ, RE = 1.5kΩ, β = 90, ro = ∞",
        "values": {
          "vcc": 22,
          "r1": 56,
          "r2": 8.2,
          "rc": 6.8,
          "re": 1.5,
          "beta": 90,
          "ro": 999999,
          "rl": 999999,
          "rsi": 0
        }
      },
      {
        "name": "Example 5.2 (Slide 69) - ro = 50 kΩ",
        "desc": "VCC = 22V, with finite Early resistance ro = 50kΩ",
        "values": {
          "vcc": 22,
          "r1": 56,
          "r2": 8.2,
          "rc": 6.8,
          "re": 1.5,
          "beta": 90,
          "ro": 50,
          "rl": 999999,
          "rsi": 0
        }
      }
    ],
    "equationGroups": [
      {
        "id": "dc-bias",
        "title": "DC Thevenin Analysis (Slide 68)",
        "componentsInvolved": [
          "vcc",
          "r1",
          "r2",
          "re",
          "beta"
        ],
        "equations": [
          {
            "label": "Thevenin Voltage VTH",
            "tex": "V_{TH} = \\frac{R_2}{R_1 + R_2} V_{CC}",
            "slide": "Slide 68",
            "steps": [
              {
                "title": "Step 1: Open-Circuit Voltage",
                "desc": "Disconnect the base terminal and find the open-circuit voltage produced by the R1-R2 voltage divider across VCC:",
                "tex": "V_{TH} = \\left(\\frac{R_2}{R_1 + R_2}\\right) V_{CC}"
              },
              {
                "title": "Step 2: Plug in Example Values",
                "desc": "With VCC = 22 V, R1 = 56 kΩ, and R2 = 8.2 kΩ:",
                "tex": "V_{TH} = \\left(\\frac{8.2\\text{ k}\\Omega}{56\\text{ k}\\Omega + 8.2\\text{ k}\\Omega}\\right) \\times 22\\text{ V} = 2.81\\text{ V}"
              }
            ]
          },
          {
            "label": "Thevenin Resistance RTH",
            "tex": "R_{TH} = R_1 \\parallel R_2",
            "slide": "Slide 68",
            "steps": [
              {
                "title": "Step 1: Short DC Supply to Ground",
                "desc": "To find Thevenin resistance, deactivate VCC by setting it to ground. Resistors R1 and R2 are in parallel:",
                "tex": "R_{TH} = R_1 \\parallel R_2 = \\frac{R_1 R_2}{R_1 + R_2}"
              },
              {
                "title": "Step 2: Plug in Example Values",
                "desc": "With R1 = 56 kΩ and R2 = 8.2 kΩ:",
                "tex": "R_{TH} = \\frac{56 \\times 8.2}{56 + 8.2} = 7.15\\text{ k}\\Omega"
              }
            ]
          }
        ]
      },
      {
        "id": "gain",
        "title": "Voltage Gain Av (Slide 68)",
        "componentsInvolved": [
          "rc",
          "beta"
        ],
        "equations": [
          {
            "label": "Voltage Gain Av (Bypassed)",
            "tex": "A_v = -\\frac{R_C \\parallel r_o}{r_e}",
            "slide": "Slide 68",
            "steps": [
              {
                "title": "Step 1: Bypass Capacitor Role",
                "desc": "The bypass capacitor CE acts as an AC short circuit across emitter resistor RE, placing the emitter terminal directly at signal ground."
              },
              {
                "title": "Step 2: Formula & Calculation",
                "desc": "The stage operates with full CE gain:",
                "tex": "A_v = -\\frac{R_C}{r_e} = -\\frac{6.8\\text{ k}\\Omega}{20.5\\text{ }\\Omega} = -331.71\\text{ V/V}"
              }
            ]
          }
        ]
      }
    ],
    "branches": [
      {
        "id": "branch-remove-ce",
        "name": "Branch 1: Remove CE (Unbypassed RE Degeneration)",
        "whatChanged": "Removed bypass capacitor CE, leaving RE unbypassed in the AC signal path (Slide 70 Fig 5.157)",
        "changedElement": "re",
        "formulaDiffs": [
          {
            "name": "Input Impedance Zi",
            "before": "Z_i = R_{TH} \\parallel \\beta r_e",
            "after": "Z_i = R_{TH} \\parallel \\beta(r_e + R_E)"
          },
          {
            "name": "Voltage Gain Av",
            "before": "A_v = -\\frac{R_C}{r_e}",
            "after": "A_v = -\\frac{R_C}{r_e + R_E} \\approx -\\frac{R_C}{R_E}"
          }
        ],
        "steps": [
          {
            "title": "Step 1: Negative Feedback Mechanism",
            "desc": "Without CE, AC current flows through RE, developing an opposing voltage at the emitter (series-series negative feedback)."
          },
          {
            "title": "Step 2: Reflected Base Impedance",
            "desc": "The resistance seen looking into the base is multiplied by (β + 1), dramatically increasing input impedance:",
            "tex": "Z_b = \\beta r_e + (\\beta + 1) R_E \\approx \\beta(r_e + R_E)"
          },
          {
            "title": "Step 3: Stabilized Voltage Gain",
            "desc": "The voltage gain decreases but becomes virtually immune to transistor beta variations, set cleanly by the resistor ratio RC / RE:",
            "tex": "A_v = -\\frac{R_C}{r_e + R_E} \\approx -\\frac{R_C}{R_E}"
          }
        ],
        "impactText": "Dramatically increases input impedance Zi and stabilizes gain against beta variations, at the cost of lower gain."
      },
      {
        "id": "branch-finite-ro-div",
        "name": "Branch 2: Add Finite Early Resistance ro",
        "whatChanged": "Added transistor internal output resistance ro in parallel with RC (Slide 69 Ex 5.2e)",
        "changedElement": "ro",
        "formulaDiffs": [
          {
            "name": "Output Impedance Zo",
            "before": "Z_o = R_C",
            "after": "Z_o = R_C \\parallel r_o"
          },
          {
            "name": "Voltage Gain Av",
            "before": "A_v = -\\frac{R_C}{r_e}",
            "after": "A_v = -\\frac{R_C \\parallel r_o}{r_e}"
          }
        ],
        "steps": [
          {
            "title": "Step 1: Early Resistance Shunting",
            "desc": "Finite ro connects between collector and emitter (AC ground via CE), in parallel with RC:"
          },
          {
            "title": "Step 2: Shunted Impedance & Gain",
            "desc": "Effective AC collector load becomes RC || ro, lowering voltage gain magnitude (Slide 69 Example 5.2e):",
            "tex": "Z_o = R_C \\parallel r_o, \\quad A_v = -\\frac{R_C \\parallel r_o}{r_e}"
          }
        ],
        "impactText": "Lowers Zo from RC to RC || ro and reduces voltage gain magnitude."
      },
      {
        "id": "branch-ce-load",
        "name": "Branch 3: Add External Load RL",
        "whatChanged": "Connected external AC load resistor RL via coupling capacitor C2 (Slide 70)",
        "changedElement": "rl",
        "formulaDiffs": [
          {
            "name": "Loaded Gain AvL",
            "before": "A_v = -\\frac{R_C}{r_e}",
            "after": "A_{vL} = -\\frac{R_C \\parallel R_L}{r_e}"
          }
        ],
        "steps": [
          {
            "title": "Step 1: External Load in Parallel",
            "desc": "Coupling capacitor C2 places RL in parallel with RC for signal frequencies."
          },
          {
            "title": "Step 2: Loaded Voltage Gain",
            "desc": "Signal current is shared between RC and RL, reducing stage output voltage:",
            "tex": "A_{vL} = -\\frac{R_C \\parallel R_L}{r_e}"
          }
        ],
        "impactText": "Draws signal current and reduces the loaded voltage gain AvL."
      }
    ]
  },
  "bjt-emitter-follower": {
    "id": "bjt-emitter-follower",
    "family": "bjt",
    "name": "BJT Emitter Follower (Common Collector)",
    "category": "BJT Amplifiers",
    "slideRef": "Slide 72, Fig. 5.159",
    "summary": "Common-collector stage with unity voltage gain, near 0° phase shift, very high input impedance, and very low output impedance (ideal buffer).",
    "svgType": "emitter-follower",
    "components": [
      {
        "id": "vcc",
        "name": "Supply Voltage (VCC)",
        "symbol": "V_{CC}",
        "unit": "V"
      },
      {
        "id": "rb",
        "name": "Base Resistor (RB)",
        "symbol": "R_B",
        "unit": "kΩ"
      },
      {
        "id": "re",
        "name": "Emitter Resistor (RE)",
        "symbol": "R_E",
        "unit": "kΩ"
      },
      {
        "id": "beta",
        "name": "Current Gain (β)",
        "symbol": "\\beta",
        "unit": ""
      },
      {
        "id": "rl",
        "name": "External Load (RL)",
        "symbol": "R_L",
        "unit": "kΩ"
      }
    ],
    "defaultValues": {
      "vcc": 12,
      "rb": 220,
      "re": 3.3,
      "beta": 120,
      "rl": 999999,
      "rsi": 0
    },
    "presets": [
      {
        "name": "Slide 72 Canonical",
        "desc": "VCC = 12V, RB = 220kΩ, RE = 3.3kΩ, β = 120 (Unity Buffer)",
        "values": {
          "vcc": 12,
          "rb": 220,
          "re": 3.3,
          "beta": 120,
          "rl": 999999,
          "rsi": 0
        }
      }
    ],
    "equationGroups": [
      {
        "id": "impedance",
        "title": "Impedance Expressions (Slide 72)",
        "componentsInvolved": [
          "beta",
          "re",
          "rb"
        ],
        "equations": [
          {
            "label": "Input Impedance Zi",
            "tex": "Z_i = R_B \\parallel [\\beta r_e + (\\beta + 1)R_E]",
            "slide": "Slide 72",
            "steps": [
              {
                "title": "Step 1: Impedance Reflection Rule",
                "desc": "Because emitter current is (β + 1) times base current, any resistance in the emitter appears multiplied by (β + 1) when seen from the base:",
                "tex": "Z_b = \\beta r_e + (\\beta + 1) R_E \\approx \\beta R_E"
              },
              {
                "title": "Step 2: Total Input Impedance",
                "desc": "Base resistor RB sits in parallel with Zb:",
                "tex": "Z_i = R_B \\parallel Z_b"
              }
            ]
          },
          {
            "label": "Output Impedance Zo",
            "tex": "Z_o = R_E \\parallel r_e \\approx r_e",
            "slide": "Slide 72",
            "steps": [
              {
                "title": "Step 1: Look into Emitter",
                "desc": "With input Vi shorted to ground, the impedance looking back into the emitter terminal is the parallel combination of RE and re:",
                "tex": "Z_o = R_E \\parallel r_e \\approx r_e"
              },
              {
                "title": "Step 2: Buffer Behavior",
                "desc": "Because re is very small (typically 10 to 25 Ω), Zo is extremely low, making this circuit an outstanding voltage buffer."
              }
            ]
          }
        ]
      },
      {
        "id": "gain",
        "title": "Voltage & Current Gains (Slide 72)",
        "componentsInvolved": [
          "re"
        ],
        "equations": [
          {
            "label": "Voltage Gain Av",
            "tex": "A_v = \\frac{R_E}{R_E + r_e} \\approx 1",
            "slide": "Slide 72",
            "steps": [
              {
                "title": "Step 1: Voltage Divider at Output",
                "desc": "The output voltage Vo is tapped directly across RE, which forms a simple voltage divider with re:",
                "tex": "V_o = V_i \\left(\\frac{R_E}{R_E + r_e}\\right)"
              },
              {
                "title": "Step 2: Near-Unity Result",
                "desc": "Since RE (e.g. 3.3 kΩ) is vastly larger than re (e.g. 15 Ω), the gain is positive and very close to unity (0.995 V/V). The output follows the input in amplitude and phase."
              }
            ]
          }
        ]
      }
    ],
    "branches": [
      {
        "id": "branch-ef-load",
        "name": "Branch 1: Add External Load RL",
        "whatChanged": "Connected external load resistor RL to the emitter terminal (Slide 72 Variation)",
        "changedElement": "rl",
        "formulaDiffs": [
          {
            "name": "Effective Emitter Load",
            "before": "R_E",
            "after": "R_E^{\\prime} = R_E \\parallel R_L"
          },
          {
            "name": "Loaded Gain Av",
            "before": "A_v = \\frac{R_E}{R_E + r_e}",
            "after": "A_v = \\frac{R_E \\parallel R_L}{(R_E \\parallel R_L) + r_e}"
          }
        ],
        "steps": [
          {
            "title": "Step 1: Emitter Shunting",
            "desc": "External load RL connects in parallel with emitter bias resistor RE:",
            "tex": "R_E^{\\prime} = R_E \\parallel R_L"
          },
          {
            "title": "Step 2: Buffer Performance Under Load",
            "desc": "Because output impedance Zo is extremely low (≈ re ≈ 10 to 25 Ω), the buffer maintains near-unity gain even when driving moderate loads:",
            "tex": "A_v = \\frac{R_E^{\\prime}}{R_E^{\\prime} + r_e} \\approx 0.98"
          }
        ],
        "impactText": "Demonstrates low-impedance buffer drive: output voltage stays close to input even under heavy resistive loading."
      }
    ]
  },
  "mosfet-cs-divider": {
    "id": "mosfet-cs-divider",
    "family": "mosfet",
    "name": "MOSFET Common-Source Amplifier (Voltage-Divider Bias)",
    "category": "MOSFET Amplifiers",
    "slideRef": "Slides 105-111, Fig 4.14, 4.15, Ex 4.3, Ex 4.4",
    "summary": "The fundamental MOS inverting voltage amplifier. Gate is biased by a resistive divider (R1, R2); signal enters gate and inverted amplified output is taken from drain.",
    "svgType": "cs-divider",
    "components": [
      {
        "id": "vdd",
        "name": "Supply Voltage (VDD)",
        "symbol": "V_{DD}",
        "unit": "V"
      },
      {
        "id": "r1",
        "name": "Upper Divider (R1)",
        "symbol": "R_1",
        "unit": "kΩ"
      },
      {
        "id": "r2",
        "name": "Lower Divider (R2)",
        "symbol": "R_2",
        "unit": "kΩ"
      },
      {
        "id": "rd",
        "name": "Drain Resistor (RD)",
        "symbol": "R_D",
        "unit": "kΩ"
      },
      {
        "id": "kn",
        "name": "Conduction Parameter (Kn)",
        "symbol": "K_n",
        "unit": "mA/V²"
      },
      {
        "id": "vtn",
        "name": "Threshold Voltage (VTN)",
        "symbol": "V_{TN}",
        "unit": "V"
      },
      {
        "id": "lambda",
        "name": "Channel-Length Mod (λ)",
        "symbol": "\\lambda",
        "unit": "V⁻¹"
      },
      {
        "id": "rsi",
        "name": "Source Resistance (RSi)",
        "symbol": "R_{Si}",
        "unit": "kΩ"
      },
      {
        "id": "rl",
        "name": "Load Resistor (RL)",
        "symbol": "R_L",
        "unit": "kΩ"
      }
    ],
    "defaultValues": {
      "vdd": 10,
      "r1": 70.9,
      "r2": 29.1,
      "rd": 5,
      "kn": 0.5,
      "vtn": 1.5,
      "lambda": 0,
      "rsi": 0,
      "rl": 999999
    },
    "presets": [
      {
        "name": "Slide 107-108 Example (Neaman Fig 4.14)",
        "desc": "VDD=10V, R1=70.9k, R2=29.1k, RD=5k, RSi=4k, Kn=0.5mA/V², VTN=1.5V, λ=0.01",
        "values": {
          "vdd": 10,
          "r1": 70.9,
          "r2": 29.1,
          "rd": 5,
          "kn": 0.5,
          "vtn": 1.5,
          "lambda": 0.01,
          "rsi": 4,
          "rl": 999999
        }
      },
      {
        "name": "Slide 109 Ex 4.3 (Zero RSi, ro = ∞)",
        "desc": "VDD=5V, R1=520k, R2=320k, RD=10k, RSi=0, Kn=0.2mA/V², VTN=0.8V, λ=0",
        "values": {
          "vdd": 5,
          "r1": 520,
          "r2": 320,
          "rd": 10,
          "kn": 0.2,
          "vtn": 0.8,
          "lambda": 0,
          "rsi": 0,
          "rl": 999999
        }
      }
    ],
    "equationGroups": [
      {
        "id": "dc-bias",
        "title": "DC Quiescent Analysis (Slides 107-108)",
        "componentsInvolved": [
          "vdd",
          "r1",
          "r2",
          "rd",
          "kn",
          "vtn"
        ],
        "equations": [
          {
            "label": "Gate Voltage VG = VGSQ",
            "tex": "V_G = V_{GS} = \\left( \\frac{R_2}{R_1 + R_2} \\right) V_{DD}",
            "slide": "Slide 107",
            "steps": [
              {
                "title": "Step 1: Circuit Principle (Zero Gate Current)",
                "desc": "Because the gate of a MOSFET is isolated by silicon dioxide (an electrical insulator), zero DC current flows into the gate terminal (IG = 0 A).",
                "tex": "I_G = 0\\text{ A}"
              },
              {
                "title": "Step 2: Unloaded Voltage Divider",
                "desc": "Resistors R1 and R2 form an unloaded voltage divider across supply voltage VDD:",
                "tex": "V_{GSQ} = V_G = \\left(\\frac{R_2}{R_1 + R_2}\\right) V_{DD}"
              },
              {
                "title": "Step 3: Plug in Numbers (Neaman Example)",
                "desc": "Substituting R1 = 70.9 kΩ, R2 = 29.1 kΩ, and VDD = 10 V:",
                "tex": "V_{GSQ} = \\left(\\frac{29.1\\text{ k}\\Omega}{70.9\\text{ k}\\Omega + 29.1\\text{ k}\\Omega}\\right) \\times 10\\text{ V} = \\left(\\frac{29.1}{100}\\right) \\times 10\\text{ V} = 2.91\\text{ V}"
              },
              {
                "title": "Step 4: Transistor State Check",
                "desc": "Because VGSQ (2.91 V) is greater than threshold voltage VTN (1.5 V), an inversion channel forms and the transistor turns ON."
              }
            ]
          },
          {
            "label": "Quiescent Drain Current IDQ",
            "tex": "I_{DQ} = K_n (V_{GSQ} - V_{TN})^2",
            "slide": "Slide 107",
            "steps": [
              {
                "title": "Step 1: Saturation Current Equation",
                "desc": "When biased in saturation, the drain current depends on the gate overdrive voltage (VGS - VTN):",
                "tex": "I_{DQ} = K_n (V_{GSQ} - V_{TN})^2"
              },
              {
                "title": "Step 2: Plug in Numbers",
                "desc": "With Kn = 0.5 mA/V², VGSQ = 2.91 V, and VTN = 1.5 V:",
                "tex": "I_{DQ} = 0.5\\text{ mA/V}^2 \\times (2.91\\text{ V} - 1.5\\text{ V})^2 = 0.5 \\times (1.41)^2 = 1.0\\text{ mA}"
              }
            ]
          },
          {
            "label": "Drain-to-Source Voltage VDSQ",
            "tex": "V_{DSQ} = V_{DD} - I_{DQ} R_D",
            "slide": "Slide 107",
            "steps": [
              {
                "title": "Step 1: KVL Down Drain Path",
                "desc": "The drain voltage is the supply voltage minus the voltage drop across drain resistor RD:",
                "tex": "V_{DSQ} = V_{DD} - I_{DQ} R_D"
              },
              {
                "title": "Step 2: Plug in Numbers",
                "desc": "With VDD = 10 V, IDQ = 1.0 mA, and RD = 5 kΩ:",
                "tex": "V_{DSQ} = 10\\text{ V} - (1.0\\text{ mA} \\times 5\\text{ k}\\Omega) = 10\\text{ V} - 5\\text{ V} = 5.0\\text{ V}"
              },
              {
                "title": "Step 3: Verify Saturation Condition",
                "desc": "For saturation, VDS must exceed the overdrive voltage (VGS - VTN). Here 5.0 V > 1.41 V, confirming the transistor is firmly in saturation!"
              }
            ]
          }
        ]
      },
      {
        "id": "params",
        "title": "Small-Signal Parameters (Slide 108)",
        "componentsInvolved": [
          "kn",
          "vtn",
          "lambda"
        ],
        "equations": [
          {
            "label": "Transconductance gm",
            "tex": "g_m = 2 K_n (V_{GSQ} - V_{TN}) = 2\\sqrt{K_n I_{DQ}}",
            "slide": "Slide 108",
            "steps": [
              {
                "title": "Step 1: Definition of Transconductance",
                "desc": "gm represents the change in drain current produced by a change in gate-source voltage at the operating point:",
                "tex": "g_m = \\frac{\\partial i_D}{\\partial v_{GS}} = 2 K_n (V_{GSQ} - V_{TN})"
              },
              {
                "title": "Step 2: Plug in Numbers",
                "desc": "With Kn = 0.5 mA/V² and overdrive voltage = 1.41 V:",
                "tex": "g_m = 2 \\times 0.5\\text{ mA/V}^2 \\times 1.41\\text{ V} = 1.41\\text{ mA/V} = 1.41\\text{ mS}"
              }
            ]
          },
          {
            "label": "Transistor Output Resistance ro",
            "tex": "r_o = \\frac{1}{\\lambda I_{DQ}}",
            "slide": "Slide 108",
            "steps": [
              {
                "title": "Step 1: Channel-Length Modulation",
                "desc": "Shortening of the inversion channel under high VDS causes a slight upward slope in ID, characterized by parameter λ:",
                "tex": "r_o = \\frac{1}{\\lambda I_{DQ}}"
              },
              {
                "title": "Step 2: Plug in Numbers",
                "desc": "With λ = 0.01 V⁻¹ and IDQ = 1.0 mA:",
                "tex": "r_o = \\frac{1}{0.01\\text{ V}^{-1} \\times 1.0\\text{ mA}} = 100\\text{ k}\\Omega"
              }
            ]
          }
        ]
      },
      {
        "id": "gain",
        "title": "Voltage Gain Av (Slide 106 & 108)",
        "componentsInvolved": [
          "rd",
          "rsi"
        ],
        "equations": [
          {
            "label": "Small-Signal Voltage Gain Av",
            "tex": "A_v = -g_m (r_o \\parallel R_D) \\left( \\frac{R_i}{R_i + R_{Si}} \\right)",
            "slide": "Slide 106 & Slide 108",
            "steps": [
              {
                "title": "Step 1: Input Divider Attenuation",
                "desc": "Signal source resistance RSi forms a divider with the amplifier input resistance Ri = R1 || R2:",
                "tex": "v_{gs} = v_i \\left(\\frac{R_i}{R_i + R_{Si}}\\right) = v_i \\left(\\frac{20.6\\text{ k}}{20.6\\text{ k} + 4\\text{ k}}\\right) = 0.837 v_i"
              },
              {
                "title": "Step 2: Output Voltage Generation",
                "desc": "The transconductance generator pushes current through the parallel combination of RD and ro:",
                "tex": "v_o = -g_m v_{gs} (r_o \\parallel R_D) = -(1.41\\text{ mS}) \\times (100\\text{ k} \\parallel 5\\text{ k}) v_{gs} = -6.71 v_{gs}"
              },
              {
                "title": "Step 3: Net Voltage Gain",
                "desc": "Multiplying the stage gain by the input division ratio:",
                "tex": "A_v = \\frac{v_o}{v_i} = -6.71 \\times 0.837 = -5.62\\text{ V/V}"
              }
            ]
          }
        ]
      }
    ],
    "branches": [
      {
        "id": "branch-finite-ro-cs",
        "name": "Branch 1: Add Channel-Length Modulation (Finite ro, λ > 0)",
        "whatChanged": "Added channel-length modulation parameter λ = 0.01 V⁻¹, creating finite ro = 100 kΩ (Slide 108)",
        "changedElement": "ro",
        "formulaDiffs": [
          {
            "name": "Output Resistance Ro",
            "before": "R_o = R_D",
            "after": "R_o = R_D \\parallel r_o"
          },
          {
            "name": "Voltage Gain Av",
            "before": "A_v = -g_m R_D",
            "after": "A_v = -g_m (R_D \\parallel r_o)"
          }
        ],
        "steps": [
          {
            "title": "Step 1: Channel Shortening Physics",
            "desc": "High drain-source voltage narrows the effective channel length, creating an internal transistor output resistance ro = 1 / (λ*IDQ).",
            "tex": "r_o = \\frac{1}{\\lambda I_{DQ}} = \\frac{1}{0.01\\text{ V}^{-1} \\times 1\\text{ mA}} = 100\\text{ k}\\Omega"
          },
          {
            "title": "Step 2: Output Resistance and Gain",
            "desc": "ro connects in parallel with RD, reducing stage gain from -7.05 down to -6.71 V/V:",
            "tex": "A_v = -g_m (R_D \\parallel r_o) = -(1.41\\text{ mS})(5\\text{ k} \\parallel 100\\text{ k}) = -6.71\\text{ V/V}"
          }
        ],
        "impactText": "Lowers output resistance Ro and reduces voltage gain magnitude."
      },
      {
        "id": "branch-add-rsi",
        "name": "Branch 2: Add Signal Generator Resistance (RSi > 0)",
        "whatChanged": "Added signal generator source resistance RSi = 4 kΩ (Slide 106 & 108)",
        "changedElement": "rsi",
        "formulaDiffs": [
          {
            "name": "Gate Signal vgs",
            "before": "v_{gs} = v_i",
            "after": "v_{gs} = v_i \\left( \\frac{R_i}{R_i + R_{Si}} \\right)"
          },
          {
            "name": "Overall Gain Av",
            "before": "A_v = -g_m (r_o \\parallel R_D)",
            "after": "A_v = -g_m (r_o \\parallel R_D) \\left( \\frac{R_i}{R_i + R_{Si}} \\right)"
          }
        ],
        "steps": [
          {
            "title": "Step 1: Input Voltage Attenuation",
            "desc": "Generator resistance RSi forms a voltage divider with the amplifier input resistance Ri = R1 || R2:",
            "tex": "\\frac{R_i}{R_i + R_{Si}} = \\frac{20.6\\text{ k}\\Omega}{20.6\\text{ k}\\Omega + 4\\text{ k}\\Omega} = 0.837"
          },
          {
            "title": "Step 2: Attenuated Overall Gain",
            "desc": "The input divider reduces net amplifier gain from -6.71 V/V down to -5.62 V/V (Neaman Example 4.14):",
            "tex": "A_v = -6.71 \\times 0.837 = -5.62\\text{ V/V}"
          }
        ],
        "impactText": "Attenuates input voltage signal, reducing overall system voltage gain."
      },
      {
        "id": "branch-cs-load",
        "name": "Branch 3: Add External Load RL",
        "whatChanged": "Connected external load resistance RL = 10 kΩ across drain output terminal",
        "changedElement": "rl",
        "formulaDiffs": [
          {
            "name": "Loaded Gain Av",
            "before": "A_v = -g_m R_D",
            "after": "A_{vL} = -g_m (R_D \\parallel R_L)"
          }
        ],
        "steps": [
          {
            "title": "Step 1: Load Shunting",
            "desc": "External load RL shunts RD, lowering the effective AC load impedance seen by the drain current generator."
          }
        ],
        "impactText": "Reduces voltage gain proportionally to the loading ratio."
      }
    ]
  },
  "mosfet-cs-degen": {
    "id": "mosfet-cs-degen",
    "family": "mosfet",
    "name": "MOSFET Common-Source with Source Degeneration",
    "category": "MOSFET Amplifiers",
    "slideRef": "Slides 112-114 (Razavi Chapter 3)",
    "summary": "CS stage with unbypassed source resistor RS. Introduces series-series negative feedback, linearizing the amplifier, reducing gain sensitivity, and increasing output impedance.",
    "svgType": "cs-degen",
    "components": [
      {
        "id": "vdd",
        "name": "Supply Voltage (VDD)",
        "symbol": "V_{DD}",
        "unit": "V"
      },
      {
        "id": "rd",
        "name": "Drain Resistor (RD)",
        "symbol": "R_D",
        "unit": "kΩ"
      },
      {
        "id": "rs",
        "name": "Source Resistor (RS)",
        "symbol": "R_S",
        "unit": "kΩ"
      },
      {
        "id": "gm",
        "name": "Transconductance (gm)",
        "symbol": "g_m",
        "unit": "mA/V"
      },
      {
        "id": "ro",
        "name": "Early Resistance (ro)",
        "symbol": "r_o",
        "unit": "kΩ"
      }
    ],
    "defaultValues": {
      "vdd": 5,
      "rd": 7,
      "rs": 0.5,
      "gm": 2,
      "ro": 999999,
      "rl": 999999,
      "rsi": 0
    },
    "presets": [
      {
        "name": "Slide 114 Example (Neaman Fig 3.30)",
        "desc": "VDD = 5V, RD = 7kΩ, RS = 0.5kΩ, gm = 2.0 mS",
        "values": {
          "vdd": 5,
          "rd": 7,
          "rs": 0.5,
          "gm": 2,
          "ro": 999999,
          "rl": 999999,
          "rsi": 0
        }
      }
    ],
    "equationGroups": [
      {
        "id": "gain-derivation",
        "title": "Degenerated Gain Derivation (Slide 112)",
        "componentsInvolved": [
          "rd",
          "rs",
          "gm"
        ],
        "equations": [
          {
            "label": "Degenerated Voltage Gain Av",
            "tex": "A_v = -\\frac{g_m R_D}{1 + g_m R_S} = -\\frac{R_D}{\\frac{1}{g_m} + R_S}",
            "slide": "Slide 112",
            "steps": [
              {
                "title": "Step 1: Input Loop KVL",
                "desc": "The applied input voltage Vin divides across the gate-to-source junction v1 and the source degeneration resistor RS:",
                "tex": "v_{in} = v_1 + (g_m v_1) R_S = v_1 (1 + g_m R_S)"
              },
              {
                "title": "Step 2: Effective Gate-Source Voltage",
                "desc": "Solving for the effective junction voltage v1 shows it is attenuated by the feedback factor (1 + gm*RS):",
                "tex": "v_1 = \\frac{v_{in}}{1 + g_m R_S}"
              },
              {
                "title": "Step 3: Output Voltage",
                "desc": "The drain current gm*v1 flows through load resistor RD:",
                "tex": "v_{out} = -(g_m v_1) R_D = -\\left(\\frac{g_m R_D}{1 + g_m R_S}\\right) v_{in}"
              },
              {
                "title": "Step 4: Tutor Rule of Thumb",
                "desc": "Dividing numerator and denominator by gm expresses the gain as the ratio of drain resistance to total source resistance:",
                "tex": "A_v = -\\frac{R_D}{\\frac{1}{g_m} + R_S} \\approx -\\frac{R_D}{R_S} \\quad (\\text{when } g_m R_S \\gg 1)"
              }
            ]
          }
        ]
      }
    ],
    "branches": [
      {
        "id": "branch-bypass-rs",
        "name": "Branch 1: Bypass RS with CS Capacitor",
        "whatChanged": "Added source bypass capacitor CS to ground (shorts RS for AC signals, Slide 114)",
        "changedElement": "rs",
        "formulaDiffs": [
          {
            "name": "Voltage Gain Av",
            "before": "A_v = -\\frac{g_m R_D}{1 + g_m R_S}",
            "after": "A_v = -g_m R_D"
          }
        ],
        "steps": [
          {
            "title": "Step 1: AC Ground at Source",
            "desc": "Capacitor CS provides an AC short to ground, removing source degeneration feedback for signal frequencies."
          },
          {
            "title": "Step 2: Maximum Stage Gain",
            "desc": "Full input voltage drops across the gate-source junction, increasing gain from -3.5 V/V up to -14.0 V/V:",
            "tex": "A_v = -g_m R_D = -(2.0\\text{ mS})(7.0\\text{ k}\\Omega) = -14.0\\text{ V/V}"
          }
        ],
        "impactText": "Significantly increases voltage gain magnitude by eliminating negative feedback."
      },
      {
        "id": "branch-active-cs-load",
        "name": "Branch 2: Swap RD for Active Current-Source Load",
        "whatChanged": "Replaced drain resistor RD with a PMOS current source transistor M2 (Slide 113)",
        "changedElement": "rd",
        "formulaDiffs": [
          {
            "name": "Output Resistance",
            "before": "R_{out} = R_D",
            "after": "R_{out} = r_{o1} \\parallel r_{o2}"
          },
          {
            "name": "Voltage Gain Av",
            "before": "A_v = -g_m R_D",
            "after": "A_v = -g_{m1}(r_{o1} \\parallel r_{o2})"
          }
        ],
        "steps": [
          {
            "title": "Step 1: High Dynamic Resistance",
            "desc": "A saturated PMOS transistor provides very high incremental resistance (ro2 ≈ 50-200 kΩ) without requiring high supply voltages."
          },
          {
            "title": "Step 2: High Gain Result",
            "desc": "Voltage gain increases by 20 to 40 dB:",
            "tex": "A_v = -g_{m1}(r_{o1} \\parallel r_{o2})"
          }
        ],
        "impactText": "Achieves high voltage gain without large resistor footprints, essential for integrated circuits."
      },
      {
        "id": "branch-diode-load",
        "name": "Branch 3: Swap RD for Diode-Connected Load",
        "whatChanged": "Replaced RD with a diode-connected PMOS transistor (gate tied to drain, Slide 113)",
        "changedElement": "rd",
        "formulaDiffs": [
          {
            "name": "Load Impedance",
            "before": "R_D",
            "after": "R_L \\approx \\frac{1}{g_{m2}}"
          },
          {
            "name": "Voltage Gain Av",
            "before": "A_v = -g_m R_D",
            "after": "A_v \\approx -\\frac{g_{m1}}{g_{m2}} = -\\sqrt{\\frac{(W/L)_1}{(W/L)_2}}"
          }
        ],
        "steps": [
          {
            "title": "Step 1: Diode-Connected Impedance",
            "desc": "The diode connection sets the incremental load resistance to approximately 1/gm2."
          },
          {
            "title": "Step 2: Aspect Ratio Gain",
            "desc": "Voltage gain becomes a geometric ratio of transistor dimensions, immune to temperature and threshold drift:",
            "tex": "A_v \\approx -\\sqrt{\\frac{(W/L)_1}{(W/L)_2}}"
          }
        ],
        "impactText": "Yields highly stable, process-independent gain determined purely by transistor aspect ratios."
      }
    ]
  },
  "mosfet-source-follower": {
    "id": "mosfet-source-follower",
    "family": "mosfet",
    "name": "MOSFET Common-Drain (Source Follower) Amplifier",
    "category": "MOSFET Amplifiers",
    "slideRef": "Slides 115-122, Fig 4.30, Ex 4.8, Ex 4.9, TYU 4.13",
    "summary": "MOS buffer amplifier. High input resistance, moderate-to-low output resistance (≈ 1/gm), positive voltage gain close to unity (0.8-0.95), and wide bandwidth.",
    "svgType": "source-follower",
    "components": [
      {
        "id": "vdd",
        "name": "Supply Voltage (VDD)",
        "symbol": "V_{DD}",
        "unit": "V"
      },
      {
        "id": "r1",
        "name": "Upper Gate Resistor (R1)",
        "symbol": "R_1",
        "unit": "kΩ"
      },
      {
        "id": "r2",
        "name": "Lower Gate Resistor (R2)",
        "symbol": "R_2",
        "unit": "kΩ"
      },
      {
        "id": "rs",
        "name": "Source Resistor (RS)",
        "symbol": "R_S",
        "unit": "kΩ"
      },
      {
        "id": "kn",
        "name": "Conduction Parameter (Kn)",
        "symbol": "K_n",
        "unit": "mA/V²"
      },
      {
        "id": "vtn",
        "name": "Threshold Voltage (VTN)",
        "symbol": "V_{TN}",
        "unit": "V"
      },
      {
        "id": "lambda",
        "name": "Channel-Length Mod (λ)",
        "symbol": "\\lambda",
        "unit": "V⁻¹"
      },
      {
        "id": "rsi",
        "name": "Signal Source Resistance (RSi)",
        "symbol": "R_{Si}",
        "unit": "kΩ"
      },
      {
        "id": "rl",
        "name": "External Load (RL)",
        "symbol": "R_L",
        "unit": "kΩ"
      }
    ],
    "defaultValues": {
      "vdd": 12,
      "r1": 162,
      "r2": 463,
      "rs": 0.75,
      "kn": 4,
      "vtn": 1.5,
      "lambda": 0.01,
      "rsi": 4,
      "rl": 999999
    },
    "presets": [
      {
        "name": "Slide 117 Example (Fig 4.30)",
        "desc": "VDD=12V, R1=162k, R2=463k, RS=0.75k, RSi=4k, Kn=4mA/V², VTN=1.5V, λ=0.01",
        "values": {
          "vdd": 12,
          "r1": 162,
          "r2": 463,
          "rs": 0.75,
          "kn": 4,
          "vtn": 1.5,
          "lambda": 0.01,
          "rsi": 4,
          "rl": 999999
        }
      }
    ],
    "equationGroups": [
      {
        "id": "gain",
        "title": "Buffer Voltage Gain Av (Slide 116)",
        "componentsInvolved": [
          "rs",
          "kn",
          "rsi"
        ],
        "equations": [
          {
            "label": "Voltage Gain Av",
            "tex": "A_v = \\frac{g_m(R_S \\parallel r_o)}{1 + g_m(R_S \\parallel r_o)} \\approx \\frac{R_S}{R_S + \\frac{1}{g_m}}",
            "slide": "Slide 116",
            "steps": [
              {
                "title": "Step 1: Output Node Equation",
                "desc": "The output signal voltage is tapped directly at the source across RS in parallel with ro:",
                "tex": "v_o = g_m v_{gs} (R_S \\parallel r_o)"
              },
              {
                "title": "Step 2: Relate vgs to Input and Output",
                "desc": "From KVL around the input loop, Vin equals the sum of gate-source voltage vgs and output voltage vo:",
                "tex": "v_{in} = v_{gs} + v_o \\implies v_{gs} = v_{in} - v_o"
              },
              {
                "title": "Step 3: Solve for Gain",
                "desc": "Substituting vgs and solving for the gain ratio Vo / Vin:",
                "tex": "A_v = \\frac{g_m (R_S \\parallel r_o)}{1 + g_m (R_S \\parallel r_o)}"
              },
              {
                "title": "Step 4: Buffer Behavior",
                "desc": "Because the denominator is (1 + gm*Reff) and the numerator is gm*Reff, the gain is always strictly positive and slightly less than 1 (e.g. 0.86 to 0.95)."
              }
            ]
          }
        ]
      }
    ],
    "branches": [
      {
        "id": "branch-sf-load",
        "name": "Branch 1: Add External Load RL",
        "whatChanged": "Connected external AC load RL at the source output terminal (Slide 122 Ex 4.9)",
        "changedElement": "rl",
        "formulaDiffs": [
          {
            "name": "Effective Load",
            "before": "R_S",
            "after": "R_S^{\\prime} = R_S \\parallel R_L"
          },
          {
            "name": "Voltage Gain Av",
            "before": "A_v = \\frac{g_m R_S}{1 + g_m R_S}",
            "after": "A_v = \\frac{g_m (R_S \\parallel R_L)}{1 + g_m (R_S \\parallel R_L)}"
          }
        ],
        "steps": [
          {
            "title": "Step 1: Source Shunting",
            "desc": "The external load RL connects in parallel with RS, lowering the effective source resistance to RS || RL."
          },
          {
            "title": "Step 2: Gain Under Load",
            "desc": "Because Ro is low (≈ 1/gm), the buffer gain drops only slightly (Ex 4.9: Av = 0.737 with RL = 1.35 kΩ):",
            "tex": "A_v = \\frac{g_m (R_S \\parallel R_L)}{1 + g_m (R_S \\parallel R_L)}"
          }
        ],
        "impactText": "Demonstrates low-impedance source-follower buffering: output voltage resists loading degradation."
      },
      {
        "id": "branch-sf-current-source",
        "name": "Branch 2: Replace RS with Constant Current Source IQ",
        "whatChanged": "Replaced source resistor RS with an active DC current source IQ (Slide 121 TYU 4.13)",
        "changedElement": "rs",
        "formulaDiffs": [
          {
            "name": "Source Resistance",
            "before": "R_S < \\infty",
            "after": "R_S \\to \\infty \\implies R_{\\text{eff}} = r_o"
          },
          {
            "name": "Buffer Gain Av",
            "before": "A_v = \\frac{g_m R_S}{1 + g_m R_S}",
            "after": "A_v = \\frac{g_m r_o}{1 + g_m r_o} \\approx 1"
          }
        ],
        "steps": [
          {
            "title": "Step 1: Infinite Source Impedance",
            "desc": "The current source presents near-infinite dynamic impedance, leaving ro as the sole pull-down path to AC ground."
          },
          {
            "title": "Step 2: Closer to Unity Gain",
            "desc": "With gm*ro typically 20 to 100, the gain improves to 0.98 V/V or higher."
          }
        ],
        "impactText": "Improves voltage gain closer to 1.0 and increases input signal swing range."
      }
    ]
  },
  "mosfet-common-gate": {
    "id": "mosfet-common-gate",
    "family": "mosfet",
    "name": "MOSFET Common-Gate Amplifier",
    "category": "MOSFET Amplifiers",
    "slideRef": "Slides 123-127, Ex 4.36, 4.38, Table 4.2",
    "summary": "Common-gate stage. Input signal is injected into the source terminal while gate is grounded via capacitor CG; output taken at drain. High voltage gain, unity current gain, low input impedance.",
    "svgType": "common-gate",
    "components": [
      {
        "id": "vdd",
        "name": "Positive Supply (V+)",
        "symbol": "V^+",
        "unit": "V"
      },
      {
        "id": "vss",
        "name": "Negative Supply (V-)",
        "symbol": "V^-",
        "unit": "V"
      },
      {
        "id": "rd",
        "name": "Drain Resistor (RD)",
        "symbol": "R_D",
        "unit": "kΩ"
      },
      {
        "id": "rl",
        "name": "Load Resistor (RL)",
        "symbol": "R_L",
        "unit": "kΩ"
      },
      {
        "id": "rsi",
        "name": "Source Resistance (RSi)",
        "symbol": "R_{Si}",
        "unit": "kΩ"
      },
      {
        "id": "gm",
        "name": "Transconductance (gm)",
        "symbol": "g_m",
        "unit": "mA/V"
      },
      {
        "id": "ro",
        "name": "Early Resistance (ro)",
        "symbol": "r_o",
        "unit": "kΩ"
      }
    ],
    "defaultValues": {
      "vdd": 5,
      "vss": -5,
      "rd": 4,
      "rl": 999999,
      "rsi": 50,
      "gm": 2,
      "ro": 999999
    },
    "presets": [
      {
        "name": "Slide 126 Example (Figures 4.36 & 4.38)",
        "desc": "V+ = 5V, V- = -5V, RD = 4kΩ, RL = 10kΩ, RSi = 50kΩ, gm = 2.0 mA/V",
        "values": {
          "vdd": 5,
          "vss": -5,
          "rd": 4,
          "rl": 10,
          "rsi": 50,
          "gm": 2,
          "ro": 999999
        }
      }
    ],
    "equationGroups": [
      {
        "id": "impedance",
        "title": "Terminal Impedances (Slide 125)",
        "componentsInvolved": [
          "gm",
          "rd"
        ],
        "equations": [
          {
            "label": "Low Input Resistance Ri",
            "tex": "R_i = \\frac{1}{g_m}",
            "slide": "Slide 125",
            "steps": [
              {
                "title": "Step 1: Signal Current Flow",
                "desc": "The input signal is applied directly to the source terminal. Current entering the source is equal to -gm*vgs:",
                "tex": "I_i = -g_m v_{gs}"
              },
              {
                "title": "Step 2: Gate is Grounded",
                "desc": "With the gate held at signal ground by capacitor CG, vgs = -vi, meaning vi = -vgs:",
                "tex": "R_i = \\frac{v_i}{I_i} = \\frac{-v_{gs}}{-g_m v_{gs}} = \\frac{1}{g_m}"
              },
              {
                "title": "Step 3: Numerical Value",
                "desc": "For gm = 2.0 mA/V, the input resistance is very low:",
                "tex": "R_i = \\frac{1}{2.0\\text{ mA/V}} = 500\\text{ }\\Omega"
              }
            ]
          }
        ]
      }
    ],
    "branches": [
      {
        "id": "branch-cg-load",
        "name": "Branch 1: Add External Load RL",
        "whatChanged": "Connected external load resistor RL = 10 kΩ at drain output (Slide 125 & 126)",
        "changedElement": "rl",
        "formulaDiffs": [
          {
            "name": "Voltage Gain Av",
            "before": "A_v = \\frac{g_m R_D}{1 + g_m R_{Si}}",
            "after": "A_v = \\frac{g_m (R_D \\parallel R_L)}{1 + g_m R_{Si}}"
          }
        ],
        "steps": [
          {
            "title": "Step 1: Drain Loading",
            "desc": "External load RL connects in parallel with RD, reducing the effective AC drain resistance to RD || RL = 4 kΩ || 10 kΩ = 2.86 kΩ."
          }
        ],
        "impactText": "Shunts drain load resistance and sets loaded voltage gain."
      },
      {
        "id": "branch-cg-ideal-source",
        "name": "Branch 2: Current Source Drive (RSi → ∞)",
        "whatChanged": "Driven by high-impedance current source (infinite RSi, Slide 125)",
        "changedElement": "rsi",
        "formulaDiffs": [
          {
            "name": "Current Gain Ai",
            "before": "A_i = \\frac{R_D}{R_D + R_L}\\frac{g_m R_{Si}}{1+g_m R_{Si}}",
            "after": "A_i = \\frac{R_D}{R_D + R_L} \\approx 1"
          }
        ],
        "steps": [
          {
            "title": "Step 1: Current Buffer Operation",
            "desc": "When driven by a high-impedance source (RSi >> 1/gm), all input current enters the low-impedance source terminal without attenuation, providing unity current gain."
          }
        ],
        "impactText": "Operates as a high-speed unity current buffer."
      }
    ]
  },
  "mosfet-current-mirror": {
    "id": "mosfet-current-mirror",
    "family": "diff",
    "name": "MOSFET Current Mirrors (NMOS & PMOS)",
    "category": "Current Mirrors",
    "slideRef": "Slides 128-137, Ex 01-06 (Razavi Chapter 9)",
    "summary": "Two-transistor active current source. Diode-connected MREF establishes gate bias from IREF; M1 copies/scales this current to load nodes with high output impedance.",
    "svgType": "current-mirror",
    "components": [
      {
        "id": "vdd",
        "name": "Supply Voltage (VDD)",
        "symbol": "V_{DD}",
        "unit": "V"
      },
      {
        "id": "iref",
        "name": "Reference Current (IREF)",
        "symbol": "I_{REF}",
        "unit": "mA"
      },
      {
        "id": "w_ref",
        "name": "Reference Aspect Ratio (W/L)REF",
        "symbol": "(W/L)_{REF}",
        "unit": ""
      },
      {
        "id": "w_1",
        "name": "Output Aspect Ratio (W/L)1",
        "symbol": "(W/L)_1",
        "unit": ""
      },
      {
        "id": "lambda",
        "name": "Channel-Length Mod (λ)",
        "symbol": "\\lambda",
        "unit": "V⁻¹"
      },
      {
        "id": "vds1",
        "name": "Output Drain Voltage (VDS1)",
        "symbol": "V_{DS1}",
        "unit": "V"
      }
    ],
    "defaultValues": {
      "vdd": 1.8,
      "iref": 0.3,
      "w_ref": 3,
      "w_1": 3,
      "lambda": 0,
      "vds1": 0.9
    },
    "presets": [
      {
        "name": "Slide 133 Ex 01 (Scaled Copy)",
        "desc": "IREF = 0.3 mA, (W/L)REF = 3, (W/L)1 = 5 (Icopy = 0.5 mA)",
        "values": {
          "vdd": 1.8,
          "iref": 0.3,
          "w_ref": 3,
          "w_1": 5,
          "lambda": 0,
          "vds1": 0.9
        }
      }
    ],
    "equationGroups": [
      {
        "id": "ideal-mirror",
        "title": "Ideal Scaling Ratio (Slide 131)",
        "componentsInvolved": [
          "iref",
          "w_ref",
          "w_1"
        ],
        "equations": [
          {
            "label": "Copied Current Icopy",
            "tex": "I_{copy} = I_{REF} \\frac{(W/L)_1}{(W/L)_{REF}}",
            "slide": "Slide 131",
            "steps": [
              {
                "title": "Step 1: Matched Gate Voltages",
                "desc": "Because the gates of MREF and M1 are tied directly together and their sources share common ground, both transistors experience the exact same VGS voltage:",
                "tex": "V_{GS,REF} = V_{GS1} = V_X"
              },
              {
                "title": "Step 2: Ratio of Drain Currents",
                "desc": "Both transistors operate in saturation. Writing the saturation current equations and taking their ratio cancels the process parameters (1/2 * μn * Cox):",
                "tex": "\\frac{I_{copy}}{I_{REF}} = \\frac{\\frac{1}{2}\\mu_n C_{ox} (W/L)_1 (V_X - V_{TH})^2}{\\frac{1}{2}\\mu_n C_{ox} (W/L)_{REF} (V_X - V_{TH})^2} = \\frac{(W/L)_1}{(W/L)_{REF}}"
              },
              {
                "title": "Step 3: Plug in Numbers (Slide 133)",
                "desc": "With IREF = 0.3 mA, (W/L)REF = 3, and (W/L)1 = 5:",
                "tex": "I_{copy} = 0.3\\text{ mA} \\times \\left(\\frac{5}{3}\\right) = 0.5\\text{ mA}"
              }
            ]
          }
        ]
      }
    ],
    "branches": [
      {
        "id": "branch-scaling-ratio",
        "name": "Branch 1: Scale Aspect Ratio ((W/L)1 ≠ (W/L)REF)",
        "whatChanged": "Scaled output transistor aspect ratio from (W/L)=3 up to (W/L)1=5 (Slide 133 Ex 01)",
        "changedElement": "w_1",
        "formulaDiffs": [
          {
            "name": "Copied Current",
            "before": "I_{copy} = I_{REF}",
            "after": "I_{copy} = I_{REF} \\frac{(W/L)_1}{(W/L)_{REF}}"
          }
        ],
        "steps": [
          {
            "title": "Step 1: Aspect Ratio Scaling",
            "desc": "Because both transistors share identical gate-source voltage VGS, the current ratio equals the aspect ratio:",
            "tex": "I_{copy} = 0.3\\text{ mA} \\times \\left(\\frac{5}{3}\\right) = 0.5\\text{ mA}"
          }
        ],
        "impactText": "Generates scaled copies of reference current (e.g. 0.5 mA from 0.3 mA reference)."
      },
      {
        "id": "branch-clm-error",
        "name": "Branch 2: Add Channel-Length Modulation (Finite ro, λ > 0)",
        "whatChanged": "Added channel-length modulation parameter λ = 0.1 V⁻¹ (Slide 131)",
        "changedElement": "lambda",
        "formulaDiffs": [
          {
            "name": "Copied Current",
            "before": "I_{copy} = I_{REF} \\frac{(W/L)_1}{(W/L)_{REF}}",
            "after": "I_{copy} = I_{REF} \\frac{(W/L)_1}{(W/L)_{REF}} \\left( \\frac{1 + \\lambda V_{DS1}}{1 + \\lambda V_{GS}} \\right)"
          },
          {
            "name": "Output Resistance",
            "before": "R_{out} = \\infty",
            "after": "R_{out} = r_{o1} = \\frac{1}{\\lambda I_{copy}}"
          }
        ],
        "steps": [
          {
            "title": "Step 1: VDS Difference Error",
            "desc": "Because VDS1 typically differs from VGS, channel-length modulation introduces a finite copying error and finite output resistance Rout."
          }
        ],
        "impactText": "Introduces finite output resistance and voltage-dependent copying error."
      },
      {
        "id": "branch-pmos-mirror",
        "name": "Branch 3: PMOS High-Side Current Mirror",
        "whatChanged": "Swapped NMOS for PMOS transistors tied to positive supply rail VDD (Slide 132)",
        "changedElement": "pmos",
        "formulaDiffs": [
          {
            "name": "Reference Rail",
            "before": "Tied to Ground (NMOS sinks current)",
            "after": "Tied to VDD (PMOS sources current)"
          }
        ],
        "steps": [
          {
            "title": "Step 1: High-Side Rail Biasing",
            "desc": "PMOS mirrors connect sources to VDD, sourcing current into load nodes (pull-up active loads)."
          }
        ],
        "impactText": "Sources current from positive supply rail into circuits, complementary to NMOS sinks."
      }
    ]
  },
  "mosfet-diff-pair": {
    "id": "mosfet-diff-pair",
    "family": "diff",
    "name": "MOS Differential Pair with Resistive Load",
    "category": "Differential Amplifiers",
    "slideRef": "Slides 138-152, Ex 10.36, 10.37 (Razavi Chapter 10)",
    "summary": "Symmetric source-coupled pair (M1, M2) biased by tail current source ISS. Rejects common-mode noise while providing high differential gain and immunity to supply bounce.",
    "svgType": "diff-pair",
    "components": [
      {
        "id": "vdd",
        "name": "Supply Voltage (VDD)",
        "symbol": "V_{DD}",
        "unit": "V"
      },
      {
        "id": "iss",
        "name": "Tail Current (ISS)",
        "symbol": "I_{SS}",
        "unit": "mA"
      },
      {
        "id": "rd",
        "name": "Drain Resistor (RD)",
        "symbol": "R_D",
        "unit": "kΩ"
      },
      {
        "id": "drd",
        "name": "Resistor Mismatch (ΔRD)",
        "symbol": "\\Delta R_D",
        "unit": "kΩ"
      },
      {
        "id": "rss",
        "name": "Tail Resistance (RSS)",
        "symbol": "R_{SS}",
        "unit": "kΩ"
      },
      {
        "id": "vcm",
        "name": "Common-Mode Input (VCM)",
        "symbol": "V_{CM}",
        "unit": "V"
      },
      {
        "id": "vth",
        "name": "Threshold Voltage (VTH)",
        "symbol": "V_{TH}",
        "unit": "V"
      },
      {
        "id": "kn",
        "name": "Device Parameter (Kn)",
        "symbol": "K_n",
        "unit": "mA/V²"
      }
    ],
    "defaultValues": {
      "vdd": 2.5,
      "iss": 1,
      "rd": 2,
      "drd": 0,
      "rss": 50,
      "vcm": 1.2,
      "vth": 0.5,
      "kn": 2
    },
    "presets": [
      {
        "name": "Slide 150-152 CMRR Analysis",
        "desc": "ISS = 1mA, RD = 2kΩ, ΔRD = 0.04kΩ (2%), RSS = 50kΩ",
        "values": {
          "vdd": 2.5,
          "iss": 1,
          "rd": 2,
          "drd": 0.04,
          "rss": 50,
          "vcm": 1.2,
          "vth": 0.5,
          "kn": 2
        }
      }
    ],
    "equationGroups": [
      {
        "id": "diff-gain",
        "title": "Differential Gain Adm (Slides 146-147)",
        "componentsInvolved": [
          "rd",
          "kn",
          "iss"
        ],
        "equations": [
          {
            "label": "Differential Voltage Gain Adm",
            "tex": "A_{dm} = -g_m R_D",
            "slide": "Slide 147",
            "steps": [
              {
                "title": "Step 1: Symmetry and Virtual Ground",
                "desc": "When purely differential inputs (+vid/2 and -vid/2) are applied, node P experiences equal and opposite voltage tendencies, maintaining a constant potential (virtual AC ground, vP = 0)."
              },
              {
                "title": "Step 2: Half-Circuit Analysis",
                "desc": "Because node P is at AC ground, the differential pair splits into two identical half-circuits, each behaving as a standard Common-Source amplifier:",
                "tex": "A_{dm} = \\frac{v_{out1} - v_{out2}}{v_{in1} - v_{in2}} = -g_m R_D"
              }
            ]
          }
        ]
      },
      {
        "id": "cmrr",
        "title": "Common-Mode Rejection Ratio (CMRR)",
        "componentsInvolved": [
          "rd",
          "drd",
          "rss"
        ],
        "equations": [
          {
            "label": "Common-Mode Rejection Ratio (CMRR)",
            "tex": "CMRR = \\frac{R_D}{\\Delta R_D}(1 + 2 g_m R_{SS})",
            "slide": "Slide 152",
            "steps": [
              {
                "title": "Step 1: Why Asymmetry Causes Corruption",
                "desc": "In an ideal symmetric circuit, common-mode noise affects both drains equally, producing zero differential output. But in reality, load resistors have a small manufacturing mismatch ΔRD."
              },
              {
                "title": "Step 2: Conversion Gain ACM-DM",
                "desc": "A change in common-mode input voltage ΔVCM alters tail current through RSS, which gets converted into an unwanted differential voltage across ΔRD:",
                "tex": "|A_{CM-DM}| = \\frac{\\Delta R_D}{\\frac{1}{g_m} + 2 R_{SS}}"
              },
              {
                "title": "Step 3: Calculate CMRR Ratio",
                "desc": "CMRR measures how strongly the amplifier prefers the desired differential signal over common-mode interference:",
                "tex": "CMRR = \\frac{|A_{dm}|}{|A_{CM-DM}|} = \\frac{R_D}{\\Delta R_D} (1 + 2 g_m R_{SS})"
              }
            ]
          }
        ]
      }
    ],
    "branches": [
      {
        "id": "branch-mismatch-cmrr",
        "name": "Branch 1: Add Load Resistor Mismatch (ΔRD > 0 for CMRR Analysis)",
        "whatChanged": "Introduced load resistor mismatch ΔRD = 0.04 kΩ (2%) and finite RSS = 50 kΩ (Slide 148-152)",
        "changedElement": "drd",
        "formulaDiffs": [
          {
            "name": "Common-Mode Conversion Gain",
            "before": "A_{CM-DM} = 0",
            "after": "|A_{CM-DM}| = \\frac{\\Delta R_D}{\\frac{1}{g_m} + 2R_{SS}}"
          },
          {
            "name": "Common-Mode Rejection Ratio",
            "before": "CMRR \\to \\infty",
            "after": "CMRR = \\frac{R_D}{\\Delta R_D}(1 + 2 g_m R_{SS})"
          }
        ],
        "steps": [
          {
            "title": "Step 1: Common-Mode to Differential Conversion",
            "desc": "In practice, load resistors have a small manufacturing mismatch ΔRD. Common-mode input noise modulates tail current through RSS, creating an unwanted differential offset across ΔRD:",
            "tex": "|A_{CM-DM}| = \\frac{\\Delta R_D}{\\frac{1}{g_m} + 2 R_{SS}}"
          },
          {
            "title": "Step 2: Finite CMRR Calculation (Slide 152)",
            "desc": "The common-mode rejection ratio drops from infinity to a finite value (e.g. 68 dB):",
            "tex": "CMRR = \\frac{|A_{dm}|}{|A_{CM-DM}|} = \\frac{R_D}{\\Delta R_D} (1 + 2 g_m R_{SS})"
          }
        ],
        "impactText": "Converts common-mode noise into differential error and establishes finite CMRR."
      }
    ]
  },
  "mosfet-diff-active": {
    "id": "mosfet-diff-active",
    "family": "diff",
    "name": "Differential Amplifier with Active Current-Mirror Load",
    "category": "Differential Amplifiers",
    "slideRef": "Slides 153-154 (Razavi Section 10.3)",
    "summary": "Differential pair with PMOS active current-mirror load (M3, M4). Performs differential-to-single-ended conversion while preserving full differential gain and doubling output signal current.",
    "svgType": "diff-active",
    "components": [
      {
        "id": "vdd",
        "name": "Supply Voltage (VDD)",
        "symbol": "V_{DD}",
        "unit": "V"
      },
      {
        "id": "iss",
        "name": "Tail Current (ISS)",
        "symbol": "I_{SS}",
        "unit": "mA"
      },
      {
        "id": "gm",
        "name": "Transconductance (gm)",
        "symbol": "g_m",
        "unit": "mA/V"
      },
      {
        "id": "ro2",
        "name": "NMOS Output Resistance (ro2)",
        "symbol": "r_{o2}",
        "unit": "kΩ"
      },
      {
        "id": "ro4",
        "name": "PMOS Output Resistance (ro4)",
        "symbol": "r_{o4}",
        "unit": "kΩ"
      },
      {
        "id": "rl",
        "name": "Load Resistor (RL)",
        "symbol": "R_L",
        "unit": "kΩ"
      }
    ],
    "defaultValues": {
      "vdd": 2.5,
      "iss": 1,
      "gm": 2,
      "ro2": 50,
      "ro4": 50,
      "rl": 999999
    },
    "presets": [
      {
        "name": "Slide 153-154 Canonical Active Load",
        "desc": "ISS = 1 mA, gm = 2.0 mS, ro2 = ro4 = 50 kΩ (Gain = 50 V/V = 34 dB)",
        "values": {
          "vdd": 2.5,
          "iss": 1,
          "gm": 2,
          "ro2": 50,
          "ro4": 50,
          "rl": 999999
        }
      }
    ],
    "equationGroups": [
      {
        "id": "active-gain",
        "title": "Active Load Current Doubling & Gain (Slide 153-154)",
        "componentsInvolved": [
          "gm",
          "ro2",
          "ro4"
        ],
        "equations": [
          {
            "label": "Single-Ended Voltage Gain Av",
            "tex": "A_v = g_m (r_{o2} \\parallel r_{o4})",
            "slide": "Slide 153",
            "steps": [
              {
                "title": "Step 1: Differential Signal Splitting",
                "desc": "When input voltage vid is applied across M1 and M2, M1 current increases by ΔI = gm*(vid/2) while M2 current decreases by ΔI."
              },
              {
                "title": "Step 2: Active Mirror Copies Signal",
                "desc": "Diode-connected load M3 senses ΔI and copies it into mirror transistor M4. At the output node, M4 injects +ΔI while M2 pulls -(-ΔI):",
                "tex": "I_{out} = \\Delta I + \\Delta I = 2 \\Delta I = g_m v_{id}"
              },
              {
                "title": "Step 3: Signal Current Doubling",
                "desc": "Both input transistors contribute in phase to the single output node, avoiding any loss of signal amplitude during differential-to-single-ended conversion."
              },
              {
                "title": "Step 4: Total Gain",
                "desc": "Multiplying signal current by the output node impedance (ro2 || ro4):",
                "tex": "A_v = g_m (r_{o2} \\parallel r_{o4})"
              }
            ]
          }
        ]
      }
    ],
    "branches": [
      {
        "id": "branch-active-loaded",
        "name": "Branch 1: Add External Resistive Load RL",
        "whatChanged": "Connected external resistive load RL = 25 kΩ from output node to ground (Slide 153)",
        "changedElement": "rl",
        "formulaDiffs": [
          {
            "name": "Output Resistance",
            "before": "R_o = r_{o2} \\parallel r_{o4}",
            "after": "R_o^{\\prime} = r_{o2} \\parallel r_{o4} \\parallel R_L"
          },
          {
            "name": "Voltage Gain Av",
            "before": "A_v = g_m (r_{o2} \\parallel r_{o4})",
            "after": "A_v = g_m (r_{o2} \\parallel r_{o4} \\parallel R_L)"
          }
        ],
        "steps": [
          {
            "title": "Step 1: Output Shunting",
            "desc": "Active load output impedance ro2 || ro4 is very high (25 kΩ). Connecting external load RL severely shunts this node, halving the voltage gain."
          }
        ],
        "impactText": "Reduces voltage gain when driving low resistive loads, demonstrating why an output buffer stage is needed in op-amps."
      }
    ]
  }
};

window.circuitsData = circuitsData;
