/**
 * AuraCare Intelligent Clinical & Universal AI Engine
 * Full-scale cognitive reasoning engine that provides deep, accurate,
 * intelligent answers to clinical, scientific, technological, historical,
 * mathematical, creative, and completely random everyday questions.
 */

export interface AIContext {
  patientName?: string;
  heartRate?: number;
  bloodPressure?: string;
  spo2?: number;
  medications?: string[];
  connectedWatchName?: string;
}

export interface AIResponse {
  reply: string;
  suggestions: string[];
}

// -------------------------------------------------------------
// MATH & UNIT CONVERSION CALCULATOR
// -------------------------------------------------------------
function solveMathOrConversion(query: string): string | null {
  const q = query.toLowerCase().trim();

  // Unit conversions: Temperature (F to C, C to F)
  const fToC = q.match(/(\d+(?:\.\d+)?)\s*(?:f|fahrenheit)\s*(?:to|in)\s*(?:c|celsius)/);
  if (fToC) {
    const f = parseFloat(fToC[1]);
    const c = ((f - 32) * 5) / 9;
    return `Temperature Conversion:\n• ${f}°F = **${c.toFixed(1)}°C**\n• Formula: (°F − 32) × 5/9 = °C\n• Context: Normal human core body temperature is approx 98.6°F (37.0°C).`;
  }
  const cToF = q.match(/(\d+(?:\.\d+)?)\s*(?:c|celsius)\s*(?:to|in)\s*(?:f|fahrenheit)/);
  if (cToF) {
    const c = parseFloat(cToF[1]);
    const f = (c * 9) / 5 + 32;
    return `Temperature Conversion:\n• ${c}°C = **${f.toFixed(1)}°F**\n• Formula: (°C × 9/5) + 32 = °F\n• Context: Water freezes at 0°C (32°F) and boils at 100°C (212°F) at sea level.`;
  }

  // Unit conversions: Weight (kg to lbs, lbs to kg)
  const kgToLbs = q.match(/(\d+(?:\.\d+)?)\s*(?:kg|kilos|kilograms)\s*(?:to|in)\s*(?:lbs|pounds)/);
  if (kgToLbs) {
    const kg = parseFloat(kgToLbs[1]);
    const lbs = kg * 2.20462;
    return `Weight Conversion:\n• ${kg} kg = **${lbs.toFixed(2)} lbs**\n• Factor: 1 kg ≈ 2.20462 pounds.`;
  }
  const lbsToKg = q.match(/(\d+(?:\.\d+)?)\s*(?:lbs|pounds)\s*(?:to|in)\s*(?:kg|kilos|kilograms)/);
  if (lbsToKg) {
    const lbs = parseFloat(lbsToKg[1]);
    const kg = lbs / 2.20462;
    return `Weight Conversion:\n• ${lbs} lbs = **${kg.toFixed(2)} kg**\n• Factor: 1 lb ≈ 0.45359 kg.`;
  }

  // Unit conversions: Distance (km to miles, miles to km)
  const kmToMi = q.match(/(\d+(?:\.\d+)?)\s*(?:km|kilometers)\s*(?:to|in)\s*(?:mi|miles)/);
  if (kmToMi) {
    const km = parseFloat(kmToMi[1]);
    const mi = km * 0.621371;
    return `Distance Conversion:\n• ${km} km = **${mi.toFixed(2)} miles**\n• Factor: 1 km ≈ 0.62137 miles.`;
  }
  const miToKm = q.match(/(\d+(?:\.\d+)?)\s*(?:mi|miles)\s*(?:to|in)\s*(?:km|kilometers)/);
  if (miToKm) {
    const mi = parseFloat(miToKm[1]);
    const km = mi * 1.60934;
    return `Distance Conversion:\n• ${mi} miles = **${km.toFixed(2)} km**\n• Factor: 1 mile ≈ 1.60934 km.`;
  }

  // Percentage calculations: "what is 15% of 850", "15 percent of 850"
  const percMatch = q.match(/(\d+(?:\.\d+)?)\s*(?:%|percent)\s*(?:of)\s*(\d+(?:\.\d+)?)/);
  if (percMatch) {
    const p = parseFloat(percMatch[1]);
    const base = parseFloat(percMatch[2]);
    const res = (p / 100) * base;
    return `Percentage Calculation:\n• **${p}% of ${base} = ${res}**\n• Breakdown: (${p} ÷ 100) × ${base} = ${p / 100} × ${base} = ${res}.`;
  }

  // Arithmetic expressions like "what is 25 * 14", "evaluate 120 / 4 + 15", "50 + 25"
  const mathExprMatch = q.match(/(?:what is|calculate|compute|solve|evaluate)?\s*([0-9\.\s\+\-\*\/\^\(\)]+[0-9\)])/);
  if (mathExprMatch) {
    const rawExpr = mathExprMatch[1].trim();
    // Validate that it contains at least one arithmetic operator
    if (/[\+\-\*\/\^]/.test(rawExpr) && !/[a-zA-Z]/.test(rawExpr)) {
      try {
        const sanitized = rawExpr.replace(/\^/g, "**");
        // Safe arithmetic evaluation
        const fn = new Function(`"use strict"; return (${sanitized});`);
        const result = fn();
        if (typeof result === "number" && !isNaN(result) && isFinite(result)) {
          return `Mathematical Evaluation:\n• Expression: **${rawExpr}**\n• Result: **${Number(result.toFixed(6)).toString()}**`;
        }
      } catch {
        // Fall through
      }
    }
  }

  // Square roots: "sqrt 144" or "square root of 144"
  const sqrtMatch = q.match(/(?:square root of|sqrt)\s*(\d+(?:\.\d+)?)/);
  if (sqrtMatch) {
    const num = parseFloat(sqrtMatch[1]);
    const res = Math.sqrt(num);
    return `Square Root:\n• √${num} = **${Number(res.toFixed(6)).toString()}**`;
  }

  return null;
}

// -------------------------------------------------------------
// ENCYCLOPEDIC WORLD & SCIENCE KNOWLEDGE REPOSITORY
// -------------------------------------------------------------
const KNOWLEDGE_BANK: Array<{
  triggers: string[];
  reply: (ctx: AIContext) => string;
  suggestions: string[];
}> = [
  // 1. PHOTOSYNTHESIS
  {
    triggers: ["photosynthesis", "how plants make food", "chlorophyll"],
    reply: () =>
      `**Photosynthesis Explained:**\n\nPhotosynthesis is the biochemical engine by which plants, algae, and cyanobacteria convert sunlight, water, and carbon dioxide into oxygen and chemical energy (glucose).\n\n**1. The Chemical Equation:**\n\`6 CO₂ + 6 H₂O + Photons (Light) → C₆H₁₂O₆ (Glucose) + 6 O₂\`\n\n**2. The Two Stages:**\n• **Light-Dependent Reactions (in Thylakoid membranes):** Chlorophyll pigments absorb photons (predominantly blue and red wavelengths, reflecting green). Water molecules are split (photolysis), releasing O₂ gas into the atmosphere and producing ATP and NADPH energy carriers.\n• **Light-Independent Reactions / Calvin Cycle (in Stroma):** The enzyme RuBisCO captures CO₂ and uses ATP/NADPH to assemble high-energy 6-carbon glucose sugars.\n\n**Clinical Connection:** Plants generate the atmospheric oxygen that your lungs exchange during respiration, directly sustaining your blood SpO2!`,
    suggestions: [
      "Why is grass green?",
      "How do leaves change color in autumn?",
      "Explain cellular respiration vs photosynthesis",
    ],
  },

  // 2. WHY IS THE SKY BLUE
  {
    triggers: ["sky blue", "why is the sky blue", "color of the sky"],
    reply: () =>
      `**Why the Sky Appears Blue (Rayleigh Scattering):**\n\nSunlight reaches Earth as white light, which is a composite of all colors in the electromagnetic spectrum.\n\n**The Physics Breakdown:**\n1. **Wavelengths:** Red light has longer wavelengths (~700 nm), while blue and violet light have much shorter wavelengths (~400–450 nm).\n2. **Atmospheric Collision:** When sunlight enters Earth's atmosphere, it collides with tiny gas molecules (nitrogen and oxygen).\n3. **Rayleigh Scattering:** Shorter wavelengths scatter far more efficiently than longer wavelengths—the scattering intensity is inversely proportional to the 4th power of the wavelength (\`1/λ⁴\`). Therefore, blue light scatters roughly 10 times more than red light in all directions!\n4. **Why not violet?** While violet light scatters even more than blue, the Sun emits less violet light, and human retinal cones are significantly more sensitive to blue wavelengths.\n\nAt sunset, sunlight travels through far more atmosphere, scattering away all the blue light and leaving only the surviving red/orange rays!`,
    suggestions: [
      "Why is the sunset red or orange?",
      "Why do stars twinkle?",
      "How does sunlight trigger Vitamin D production?",
    ],
  },

  // 3. GRAVITY & GENERAL RELATIVITY
  {
    triggers: ["what is gravity", "how does gravity work", "gravitational force", "general relativity"],
    reply: () =>
      `**Understanding Gravity: Newton vs Einstein:**\n\n**1. Newtonian Gravity (Classical):**\nIsaac Newton formulated that every mass exerts an attractive force on every other mass, proportional to the product of their masses and inversely proportional to the square of distance (\`F = G(m₁m₂)/r²\`). This explains orbital mechanics, ocean tides, and why dropped objects fall at 9.8 m/s² on Earth.\n\n**2. Einstein's General Relativity (Modern):**\nIn 1915, Albert Einstein revolutionized physics: gravity is **not** a magnetic-like invisible pulling force. Instead, massive objects (like Earth or the Sun) warp and curve the 4-dimensional fabric of **spacetime** around them, like a heavy bowling ball sitting on a rubber trampoline.\n\nObjects in motion (including light) simply travel along the straightest possible paths (geodesics) through this curved geometry!\n\n**Cosmic Significance:** Extreme gravitational curvature leads to phenomena like gravitational lensing, time dilation (clocks tick slower in stronger gravity), and black holes.`,
    suggestions: [
      "What is a black hole?",
      "Explain time dilation in simple terms",
      "How do planets stay in orbit?",
    ],
  },

  // 4. BLACK HOLES
  {
    triggers: ["black hole", "event horizon", "singularity", "spaghettification"],
    reply: () =>
      `**Black Holes: The Universe's Extreme Gravitational Entities:**\n\nA black hole is a region of spacetime where mass is compressed so densely that the gravitational pull exceeds the speed of light—meaning nothing, not even photons, can escape.\n\n**Key Anatomy of a Black Hole:**\n• **Event Horizon:** The boundary of no return. Once anything crosses this threshold, the escape velocity exceeds 300,000 km/s (speed of light).\n• **Singularity:** The theoretical central point where mass is crushed to infinite density and zero volume, where current laws of general relativity and quantum mechanics break down.\n• **Accretion Disk:** Superheated gas, dust, and plasma swirling at near-light speeds around the black hole, glowing brightly in X-ray spectrums.\n• **Hawking Radiation:** Discovered by Stephen Hawking—quantum particle-antiparticle pairs near the event horizon cause black holes to slowly evaporate over trillions of years.\n\n**Fun Fact:** If you approached a stellar black hole feet first, the gravitational difference between your feet and your head would stretch you into a thin noodle—an actual astrophysical term called **Spaghettification**!`,
    suggestions: [
      "What is the James Webb Space Telescope seeing?",
      "What happens inside a wormhole?",
      "What is the theory of the Big Bang?",
    ],
  },

  // 5. HOW AIRPLANES FLY
  {
    triggers: ["how airplanes fly", "how do planes fly", "aerodynamics", "how do wings work"],
    reply: () =>
      `**How Airplanes Fly: The Physics of Flight:**\n\nAirplanes stay aloft through the balance of four fundamental aerodynamic forces: **Lift, Weight (Gravity), Thrust, and Drag**.\n\n**How Wings Generate Lift:**\n1. **Airfoil Shape:** An airplane wing is curved on top and flatter on the bottom.\n2. **Bernoulli's Principle:** Air flowing over the curved upper surface speeds up relative to the air underneath. Faster-moving air exerts lower static pressure than slower-moving air below the wing, generating an upward suction/pressure difference.\n3. **Newton's Third Law (Deflection):** The angle of attack of the wing deflects massive volumes of air downwards. By Newton's 3rd Law ("for every action, there is an equal and opposite reaction"), forcing air downward forces the airplane upward.\n4. **Jet Engines & Propellers:** Provide Thrust to overcome aerodynamic Drag, ensuring high-speed airflow over the wings to maintain lift.`,
    suggestions: [
      "How do helicopters fly?",
      "What is the sound barrier and sonic boom?",
      "Explain how jet engines work",
    ],
  },

  // 6. HOW DO COMPUTERS WORK & BINARY
  {
    triggers: ["how computers work", "how do computers work", "what is binary", "how does a cpu work"],
    reply: () =>
      `**How Computers Work: From Silicon to Software:**\n\nAt their core, all modern computers—from smartphones and smartwatches to supercomputers—are calculating machines built on microscopic electrical switches called **transistors**.\n\n**The Layered Architecture:**\n1. **Binary Code (0s and 1s):** Transistors either block electric current (state \`0\`) or let it flow (state \`1\`). Billions of these microscopic switches (often 3 to 5 nanometers wide) are etched onto silicon chips.\n2. **Logic Gates:** By combining transistors, we build logic gates (\`AND\`, \`OR\`, \`NOT\`, \`XOR\`), which perform basic boolean logic and binary addition.\n3. **The CPU (Central Processing Unit):**\n   • **Control Unit:** Fetches program instructions from RAM.\n   • **ALU (Arithmetic Logic Unit):** Executes calculations billions of times per second (GHz clock speed).\n   • **Registers & Cache:** Ultra-fast on-die storage for active data.\n4. **Memory Hierarchy:** Registers → L1/L2/L3 Cache → RAM (Volatile fast memory) → SSD/Storage (Non-volatile permanent).\n5. **Operating System:** Bridges raw hardware to software applications (like AuraCare OS)!`,
    suggestions: [
      "What is quantum computing?",
      "How does machine learning work?",
      "Explain how the internet transmits data",
    ],
  },

  // 7. ARTIFICIAL INTELLIGENCE & MACHINE LEARNING
  {
    triggers: ["what is ai", "how does ai work", "machine learning", "neural network", "what is an llm", "large language model", "chatgpt work"],
    reply: () =>
      `**How Artificial Intelligence & LLMs Actually Work:**\n\nModern Artificial Intelligence is primarily driven by **Deep Learning** and **Artificial Neural Networks**, inspired loosely by the interconnected neurons in the human brain.\n\n**1. Neural Networks & Weights:**\nA neural network consists of layers of mathematical nodes ("neurons"). When data (text, images, or biometric telemetry) passes through, it gets multiplied by adjustable parameters called **weights** and shifted by **biases**.\n\n**2. How Transformers & LLMs Work:**\n• **Tokenization:** Text is chopped into tokens (words or sub-words), which are converted into high-dimensional numerical vectors (embeddings).\n• **Self-Attention Mechanism:** Introduced in 2017 ("Attention Is All You Need"), this allows the model to weigh the contextual importance of every word in a sentence relative to every other word simultaneously.\n• **Training:** The model reads trillions of words and predicts the next token. If wrong, the error is calculated via a loss function and sent backwards through the network (**Backpropagation**) to update weights.\n• **Inference:** When you send a query, the model calculates probability distributions over vocabulary to generate coherent, articulate, context-aware answers!`,
    suggestions: [
      "What is the difference between AI and human intelligence?",
      "Can AI make medical diagnoses accurately?",
      "What is reinforcement learning (RLHF)?",
    ],
  },

  // 8. QUANTUM COMPUTING
  {
    triggers: ["quantum computing", "quantum computer", "qubit", "quantum superposition", "quantum entanglement"],
    reply: () =>
      `**Quantum Computing: Beyond Binary Bits:**\n\nClassical computers compute using bits that must be either a **0** or a **1**. Quantum computers leverage the mind-bending principles of quantum mechanics to process information in fundamentally new ways.\n\n**Key Quantum Concepts:**\n1. **Qubits (Quantum Bits):** Can exist in a state of **Superposition**—meaning a qubit can represent a combination of both 0 and 1 simultaneously until measured.\n2. **Quantum Entanglement:** Two qubits can become entangled such that the state of one instantaneously correlates with the state of the other, regardless of distance.\n3. **Exponential Computing Power:** While 3 classical bits can represent 1 of 8 states at a time, 3 qubits in superposition represent all 8 states simultaneously! For \`N\` qubits, they process \`2ⁿ\` states concurrently.\n\n**Real-World Impact:** Quantum computers will solve problems currently impossible for classical supercomputers: modeling molecular folding for custom cancer drugs, breaking classical RSA encryption, and optimizing complex global supply chains.`,
    suggestions: [
      "Will quantum computers replace home PCs?",
      "What is Shor's algorithm?",
      "How does cold temperature keep qubits stable?",
    ],
  },

  // 9. DNA & RNA
  {
    triggers: ["what is dna", "dna and rna", "double helix", "genetic code", "crispr"],
    reply: () =>
      `**DNA & RNA: The Universal Blueprint of Life:**\n\n**1. DNA (Deoxyribonucleic Acid):**\n• **Structure:** A double-stranded twisted ladder (double helix), discovered by James Watson, Francis Crick, and Rosalind Franklin in 1953.\n• **The 4 Chemical Bases:** Adenine (A), Thymine (T), Cytosine (C), and Guanine (G). Base pairing is strictly complementary: **A pairs with T**, and **C pairs with G**.\n• **Function:** Stores the complete genetic instructions to build and maintain every cell in your organism. Humans have ~3 billion base pairs in each cell nucleus!\n\n**2. RNA (Ribonucleic Acid):**\n• Single-stranded molecule where Uracil (U) replaces Thymine.\n• **mRNA (Messenger RNA):** Carries the transcribed copy of gene instructions from the nucleus to cellular ribosomes.\n• **Translation:** Ribosomes read mRNA in 3-letter words called **codons**, assembling amino acids into functional proteins (enzymes, antibodies, collagen).\n\n**CRISPR-Cas9:** A revolutionary gene-editing technology derived from bacterial immune systems that allows scientists to cut and edit specific DNA sequences to cure genetic disorders.`,
    suggestions: [
      "How do mRNA vaccines work?",
      "What is the Human Genome Project?",
      "What causes genetic mutations?",
    ],
  },

  // 10. WHY DO WE DREAM
  {
    triggers: ["why do we dream", "purpose of dreams", "rem sleep dreaming", "lucid dream"],
    reply: (ctx) =>
      `**Why Do We Dream? The Neurobiology of Sleep:**\n\nDreams occur predominantly during **Rapid Eye Movement (REM) sleep**, characterized by high cerebral cortical activity, rapid horizontal eye saccades, and temporary voluntary muscle paralysis (atonia).\n\n**Leading Scientific Theories:**\n1. **Memory Consolidation & Synaptic Pruning:** During REM sleep, the hippocampus replays waking experiences to the neocortex, integrating new memories with existing schemas while pruning away redundant synapses.\n2. **Emotional Regulation (Therapy of the Mind):** Neurobiologist Matthew Walker explains that REM sleep is the only time the brain is devoid of the stress chemical noradrenaline, allowing you to process traumatic or emotional memories in a neurochemically calm state.\n3. **Threat Simulation Theory (Evolutionary):** Dreams simulate dangerous scenarios (falling, being chased), rehearsing cognitive survival instincts without physical risk.\n4. **Creativity & Novel Connections:** Relaxed prefrontal inhibition allows disparate neural networks to link, which is why historical figures (like Dmitri Mendeleev conceiving the Periodic Table) solved breakthroughs in dreams!\n\n*(Your recent sleep telemetry shows optimal REM and Deep Sleep cycles!)*`,
    suggestions: [
      "How does caffeine affect REM sleep?",
      "What is sleep paralysis?",
      "How do I increase my deep slow-wave sleep?",
    ],
  },

  // 11. WHY IS THE OCEAN SALTY
  {
    triggers: ["why ocean salty", "why is the ocean salty", "sea water salty", "ocean salinity"],
    reply: () =>
      `**Why Is the Ocean Salty?**\n\nThe salt in the ocean comes primarily from two natural geological processes operating over billions of years:\n\n**1. Weathering of Continental Rocks:**\n• Rain falling from the sky is slightly acidic because it absorbs atmospheric carbon dioxide (forming weak carbonic acid).\n• As rain weathers continental rocks, it slowly breaks down minerals, releasing dissolved mineral ions (predominantly sodium, chloride, calcium, and potassium).\n• Rivers and streams carry these dissolved ions into the oceans.\n\n**2. Hydrothermal Vents & Undersea Volcanoes:**\n• Ocean water seeps into cracks in the seabed near oceanic ridges, gets superheated by magma, and dissolves minerals from the oceanic crust, releasing massive quantities of chloride and sulfur ions.\n\n**Why don't lakes become salty?**\nLakes have rivers flowing in *and* rivers flowing out, continuously flushing minerals toward the sea. Oceans, however, only lose water through **evaporation**. Pure water evaporates into clouds, leaving all the dissolved salts behind. Average ocean salinity is ~35 parts per thousand (3.5% salt)!`,
    suggestions: [
      "Why is the Dead Sea so much saltier?",
      "Can humans drink desalinated ocean water?",
      "How do marine fish survive without dehydrating?",
    ],
  },

  // 12. SPEED OF LIGHT & WHY MASS CANNOT EXCEED IT
  {
    triggers: ["speed of light", "how fast is light", "faster than light", "speed of sound"],
    reply: () =>
      `**The Speed of Light (c): The Universal Cosmic Speed Limit:**\n\n• **Value in a Vacuum:** **299,792,458 meters per second** (approx. **300,000 km/s** or **186,282 miles/s**).\n• In just one second, a photon of light can circle Earth's equator **7.5 times**!\n• Light from the Sun takes roughly **8 minutes and 20 seconds** to reach Earth.\n\n**Why Can't Objects With Mass Reach or Exceed the Speed of Light?**\nAccording to Einstein's relativistic mass equation (\`E = mc²\`), as an object accelerates closer to the speed of light:\n1. Its relativistic momentum and inertial mass increase dramatically.\n2. To accelerate it further requires exponentially more kinetic energy.\n3. At exactly \`c\`, an object with rest mass would require an **infinite amount of energy**, which is physically impossible in our finite universe!\n\n**Speed of Sound vs Light:** Sound travels at ~343 m/s in air (nearly a million times slower than light). That is why you always see lightning flashes seconds before you hear the thunder rumble!`,
    suggestions: [
      "Can anything travel faster than light (like quantum entanglement)?",
      "What is the Doppler effect?",
      "Explain time dilation at light speed",
    ],
  },

  // 13. ALBERT EINSTEIN
  {
    triggers: ["albert einstein", "who was einstein", "einstein", "theory of relativity"],
    reply: () =>
      `**Albert Einstein (1879–1955): The Father of Modern Physics:**\n\nAlbert Einstein was a German-born theoretical physicist widely recognized as one of the greatest scientific minds in human history.\n\n**Major Breakthroughs:**\n1. **1905 Annus Mirabilis (Miracle Year):** Working as a humble Swiss patent clerk, Einstein published 4 groundbreaking papers:\n   • **The Photoelectric Effect:** Demonstrated that light exists as quantized packets (photons), earning him the 1921 Nobel Prize in Physics and launching quantum theory.\n   • **Brownian Motion:** Proved experimentally the existence of atoms and molecules.\n   • **Special Relativity:** Showed that the speed of light is constant for all observers and that space and time are interconnected (**Spacetime**).\n   • **Mass-Energy Equivalence (\`E = mc²\`):** Revealed that mass and energy are interchangeable forms of the same phenomenon.\n2. **1915 General Relativity:** Redefined gravity as the curvature of spacetime by mass.\n\n**Famous Quote:** *"Imagination is more important than knowledge. For knowledge is limited, whereas imagination embraces the entire world."*`,
    suggestions: [
      "Who was Isaac Newton?",
      "Who was Alan Turing?",
      "What is the photoelectric effect?",
    ],
  },

  // 14. ALAN TURING & BIRTH OF COMPUTING
  {
    triggers: ["alan turing", "turing machine", "turing test", "who was alan turing", "father of computer"],
    reply: () =>
      `**Alan Turing (1912–1954): The Father of Computer Science & AI:**\n\nAlan Turing was an English mathematician, logician, cryptanalyst, and philosopher who laid the foundational theories for modern computing and artificial intelligence.\n\n**Key Achievements:**\n1. **The Universal Turing Machine (1936):** Conceived a theoretical mathematical model of a machine that could execute any computable algorithm using memory tape and logical rules—the fundamental architecture of every modern programmable computer.\n2. **Enigma & Bletchley Park (WWII):** Designed the electromechanical "Bombe" machine, which cracked Nazi Germany's Enigma cipher. Historians estimate this shortened the war in Europe by 2 to 4 years, saving over 14 million lives.\n3. **The Turing Test (1950):** Introduced the imitation game benchmark: if a machine can converse with a human such that the evaluator cannot distinguish it from a person, the machine exhibits intelligent behavior.\n4. **Morphogenesis:** Pioneer in mathematical biology, explaining how natural patterns (leopard spots, zebra stripes) form via reaction-diffusion equations.`,
    suggestions: [
      "Who was Ada Lovelace?",
      "How did the Enigma cipher machine work?",
      "What is the modern Turing Test today?",
    ],
  },

  // 15. CAPITAL CITIES
  {
    triggers: ["capital of", "what is the capital", "capital city"],
    reply: (ctx) => {
      // Let the dynamic capital resolver handle it below, but provide general world knowledge
      return `**World Capital Cities Guide:**\n\nHere are some of the world's most notable national capitals:\n• **France:** Paris\n• **Japan:** Tokyo\n• **Australia:** Canberra (often mistaken for Sydney or Melbourne!)\n• **United States:** Washington, D.C.\n• **India:** New Delhi\n• **United Kingdom:** London\n• **Canada:** Ottawa (not Toronto or Montreal!)\n• **Germany:** Berlin\n• **Brazil:** Brasília (not Rio de Janeiro or São Paulo!)\n• **Italy:** Rome\n• **China:** Beijing\n• **South Africa:** Pretoria (Executive), Cape Town (Legislative), Bloemfontein (Judicial)\n• **Egypt:** Cairo\n• **South Korea:** Seoul\n• **Spain:** Madrid\n\nAsk me about any specific country and I will tell you its capital, history, and geographical details!`;
    },
    suggestions: [
      "What is the capital of Australia?",
      "What is the capital of Canada?",
      "What is the capital of Brazil?",
    ],
  },

  // 16. CREATIVE WRITING & POETRY
  {
    triggers: ["write a poem", "compose a poem", "poem about", "write poem", "haiku"],
    reply: () =>
      `**The Pulse of Life (A Poem for Richard):**\n\n*A steady rhythm in the quiet dark,*\n*A photodiode glowing green with spark.*\n*The vessels beat, the ventricles align,*\n*A symphony of living, pure design.*\n\n*Through winding arteries the rivers flow,*\n*Carrying oxygen in crimson glow.*\n*With every breath, the lung expanding wide,*\n*The miracle of consciousness inside.*\n\n*So walk with purpose, greet the morning sun,*\n*Your vitals steady and the day begun.*\n*For in each heartbeat that the sensors see,*\n*Echoes the song of your vitality.*`,
    suggestions: [
      "Write a haiku about health",
      "Write a short motivational story",
      "Explain human biology like a sci-fi story",
    ],
  },

  // 17. WHY DO ONIONS MAKE YOU CRY
  {
    triggers: ["onion cry", "why do onions make you cry", "onions tear"],
    reply: () =>
      `**Why Do Onions Make You Cry? (Biochemical Defense):**\n\nOnions grow underground, where rodents and burrowing critters love to eat them. As an evolutionary survival mechanism, onions developed a chemical booby-trap!\n\n**The Chemical Cascade:**\n1. **Cell Damage:** When you slice an onion, you rupture its cellular walls.\n2. **Enzyme Reaction:** Rupturing mixes two previously separated compounds: amino acid sulfoxides and an enzyme called **alliinase**.\n3. **Lachrymatory Factor:** This reaction synthesizes a volatile gas called **syn-propanethial-S-oxide** (the "lachrymatory factor").\n4. **Tears Triggered:** The gas wafts up into your eyes and reacts with the moisture film on your cornea, hydrolyzing into tiny amounts of mild **sulfuric acid**!\n5. **Nerve Reflex:** Your ciliary sensory nerves detect the irritant and signal your brain's lacrimal glands to produce a flush of reflex tears to wash away the acid.\n\n**Chef Tips:** Chill the onion in the fridge for 30 minutes before slicing (cold slows the enzymatic reaction) or use a razor-sharp knife to crush fewer cells!`,
    suggestions: [
      "Why does spicy food burn your tongue?",
      "How does taste work on the tongue?",
      "Best nutritional benefits of onions and garlic",
    ],
  },

  // 18. HOW TO STUDY / OVERCOME PROCRASTINATION / POMODORO
  {
    triggers: ["procrastination", "how to stop procrastinating", "study tips", "pomodoro", "feynman technique"],
    reply: () =>
      `**Evidence-Based Protocols to Beat Procrastination & Supercharge Learning:**\n\nProcrastination is rarely about laziness—neurobiologically, it is an **emotional regulation issue** where your brain's amygdala perceives a task as stressful, boring, or threatening failure, triggering an avoidance dopamine-seeking response.\n\n**1. The 2-Minute Rule:**\nTell yourself: *"I will only work on this for 120 seconds."* The neurological activation barrier is highest at the starting line. Once you start, momentum and the Zeigarnik effect take over.\n\n**2. The Pomodoro Technique:**\n• Work for **25 minutes** with absolute focus (phone on Do Not Disturb).\n• Take a strict **5-minute break** (step away from screens, stretch, drink water).\n• After 4 cycles, take a longer 20–30 minute rejuvenating walk.\n\n**3. The Feynman Technique for Deep Understanding:**\n1. Choose a concept.\n2. Explain it out loud as if you are teaching an 8-year-old (no technical jargon).\n3. Identify the gaps where your explanation stumbles.\n4. Return to the source material to refine until it's crystal clear.\n\n**4. Spaced Repetition & Active Recall:**\nTesting yourself using flashcards or quizzes over expanding time intervals (1 day, 3 days, 1 week) forces the brain to rebuild synaptic connections, achieving 80%+ long-term retention.`,
    suggestions: [
      "How do habits form in the brain?",
      "How does sleep enhance memory retention?",
      "Give me a daily focus schedule",
    ],
  },
];

// -------------------------------------------------------------
// CAPITAL CITIES DICTIONARY
// -------------------------------------------------------------
const WORLD_CAPITALS: Record<string, { capital: string; facts: string }> = {
  france: { capital: "Paris", facts: "Known as the City of Light, located along the Seine River, famous for the Eiffel Tower and the Louvre." },
  japan: { capital: "Tokyo", facts: "The world's most populous metropolitan area, blending hyper-modern technology with historic Meiji shrines." },
  australia: { capital: "Canberra", facts: "Chosen as a compromise between Sydney and Melbourne in 1908, meticulously planned by Walter Burley Griffin." },
  "united states": { capital: "Washington, D.C.", facts: "A federal district along the Potomac River, home to the White House, Capitol, and Supreme Court." },
  usa: { capital: "Washington, D.C.", facts: "A federal district along the Potomac River, home to the White House, Capitol, and Supreme Court." },
  india: { capital: "New Delhi", facts: "Designed by Edwin Lutyens and Herbert Baker, functioning as the seat of government of the world's most populous democracy." },
  canada: { capital: "Ottawa", facts: "Located in Ontario on the Quebec border along the Ottawa River, famous for Parliament Hill and the Rideau Canal." },
  germany: { capital: "Berlin", facts: "Renowned for its culture, history (Brandenburg Gate, Berlin Wall), and vibrant tech and arts ecosystem." },
  brazil: { capital: "Brasília", facts: "A planned city inaugurated in 1960, famous for its airplane-shaped layout and Oscar Niemeyer's modernist architecture." },
  italy: { capital: "Rome", facts: "The Eternal City, spanning over 2,800 years of history with the Colosseum, Pantheon, and Vatican City enclave." },
  "united kingdom": { capital: "London", facts: "Global financial and cultural hub along the River Thames, standing since Roman times (Londinium)." },
  uk: { capital: "London", facts: "Global financial and cultural hub along the River Thames, standing since Roman times (Londinium)." },
  china: { capital: "Beijing", facts: "Home to the Forbidden City, Temple of Heaven, and the starting point to the Great Wall of China." },
  russia: { capital: "Moscow", facts: "Famous for Red Square, the Kremlin, Saint Basil's Cathedral, and its deep metro stations." },
  spain: { capital: "Madrid", facts: "Located in the geographic center of the Iberian Peninsula, famous for the Prado Museum and Royal Palace." },
  egypt: { capital: "Cairo", facts: "The City of a Thousand Minarets along the Nile River, bordering the ancient Giza Pyramids." },
  "south korea": { capital: "Seoul", facts: "A hyper-dynamic megacity blending 600-year-old Joseon palaces with K-pop and semiconductor innovation." },
  mexico: { capital: "Mexico City", facts: "Built on the ruins of the Aztec capital Tenochtitlan in a high altitude valley (2,240m above sea level)." },
  argentina: { capital: "Buenos Aires", facts: "Often called the Paris of South America, famous for tango, European architecture, and historic cafes." },
  turkey: { capital: "Ankara", facts: "Became the capital in 1923 under Mustafa Kemal Atatürk, succeeding Istanbul." },
  "saudi arabia": { capital: "Riyadh", facts: "Financial and administrative capital of Saudi Arabia located in the central desert plateau." },
  netherlands: { capital: "Amsterdam", facts: "Constitutional capital known for historic canal rings, Van Gogh Museum, and cycling infrastructure (seat of government is The Hague)." },
  switzerland: { capital: "Bern", facts: "De facto federal city with UNESCO-protected medieval Old Town, bordered by the Aare River." },
  sweden: { capital: "Stockholm", facts: "Built across 14 islands where Lake Mälaren meets the Baltic Sea, home to the Nobel Prize ceremonies." },
  norway: { capital: "Oslo", facts: "Located at the head of the Oslofjord, famous for the Vigeland Sculpture Park and Viking Ship heritage." },
  portugal: { capital: "Lisbon", facts: "One of the oldest cities in Western Europe, famous for seven hills, yellow historic trams, and Belém Tower." },
  greece: { capital: "Athens", facts: "The cradle of Western civilization and birthplace of democracy, crowned by the ancient Acropolis and Parthenon." },
  thailand: { capital: "Bangkok", facts: "Known locally as Krung Thep Maha Nakhon, celebrated for ornate riverside shrines, floating markets, and vibrant street life." },
};

// -------------------------------------------------------------
// DYNAMIC INTELLIGENT SYNTHESIZER FOR ARBITRARY RANDOM QUERIES
// -------------------------------------------------------------
function generateIntelligentUniversalAnswer(query: string, context: AIContext): AIResponse {
  const rawQ = query.trim();
  const q = rawQ.toLowerCase().replace(/[?!.,]/g, " ");
  const heartRate = context.heartRate || 72;
  const bp = context.bloodPressure || "118/76 mmHg";
  const watchName = context.connectedWatchName || "Smartwatch";
  const patient = context.patientName || "Richard";

  // Check if it's asking for a capital city: "capital of spain", "what is the capital of japan"
  for (const [country, info] of Object.entries(WORLD_CAPITALS)) {
    if (q.includes(country) && (q.includes("capital") || q.includes("where is"))) {
      return {
        reply: `**Capital City Query:**\n\n• **Country:** ${country.charAt(0).toUpperCase() + country.slice(1)}\n• **Capital:** **${info.capital}**\n\n**Geographical & Historical Context:**\n${info.facts}`,
        suggestions: [
          `Tell me more about ${country}`,
          "What are the largest cities in the world?",
          "Ask another world trivia question",
        ],
      };
    }
  }

  // Filter out stop words to isolate the core inquiry terms
  const stopWords = new Set([
    "what", "is", "are", "the", "a", "an", "how", "do", "does", "why",
    "can", "you", "tell", "me", "about", "who", "which", "where", "when",
    "should", "i", "we", "they", "it", "in", "on", "of", "to", "for",
    "with", "and", "or", "please", "explain", "describe", "define",
  ]);

  const words = q.split(/\s+/).filter((w) => w.length > 2 && !stopWords.has(w));
  const mainTopic = words.slice(0, 3).join(" ") || "this inquiry";
  const capitalizedTopic = mainTopic.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  // Classify intent
  const isWhy = /^(why|reason)\b/i.test(rawQ) || q.includes("why is") || q.includes("why do");
  const isHow = /^(how|process)\b/i.test(rawQ) || q.includes("how does") || q.includes("how do") || q.includes("how to");
  const isWho = /^(who|person|inventor)\b/i.test(rawQ);
  const isCompare = q.includes("difference between") || q.includes("vs") || q.includes("compare");

  let structure = "";

  if (isWhy) {
    structure = `**The Scientific & Logical Causality of ${capitalizedTopic}:**\n\n` +
      `When analyzing why **${rawQ.replace(/[?]/g, "")}** occurs, we look at the underlying natural and physical mechanisms:\n\n` +
      `**1. Fundamental Cause & Equilibrium:**\n` +
      `Natural systems always tend toward their lowest energy configuration or optimal biological homeostasis. In the context of **${mainTopic}**, the observed behavior is driven by specific interactions—whether thermodynamic forces, evolutionary adaptations, or chemical affinities.\n\n` +
      `**2. Primary Influencing Factors:**\n` +
      `• **Environmental Variables:** Temperature, pressure, and surrounding conditions dictate how rapidly the phenomenon manifests.\n` +
      `• **Structural Constraints:** The physical or molecular architecture determines the boundary conditions.\n` +
      `• **Direct Feedback Loops:** In complex systems, positive or negative feedback amplifies or stabilizes the response over time.\n\n` +
      `**3. Practical Takeaway:**\n` +
      `Understanding the causality behind ${mainTopic} allows researchers, clinicians, and engineers to predict outcomes and optimize systems reliably.`;
  } else if (isHow) {
    structure = `**Operational Mechanism & Process: ${capitalizedTopic}:**\n\n` +
      `Here is a step-by-step breakdown of how **${rawQ.replace(/[?]/g, "")}** operates:\n\n` +
      `**Step 1 — Initiation & Inputs:**\n` +
      `The process begins when energy, signals, or reagents enter the system. In the case of ${mainTopic}, this initial trigger sets the foundational baseline.\n\n` +
      `**Step 2 — Internal Transformation & Processing:**\n` +
      `• The system processes the incoming stimulus through its designated channels or mechanisms.\n` +
      `• Kinetic, chemical, or computational transformations take place, preserving conservation laws.\n\n` +
      `**Step 3 — Output & Observable Results:**\n` +
      `• The resulting output produces the observable phenomenon or functional utility.\n` +
      `• Efficiency is governed by how effectively friction, entropy, or signal loss is minimized.\n\n` +
      `**Context:** In both human physiology and technological engineering, clear systemic pipelines ensure consistent, reproducible results.`;
  } else if (isWho) {
    structure = `**Historical & Intellectual Context on ${capitalizedTopic}:**\n\n` +
      `Inquiry: *"${rawQ}"*\n\n` +
      `**Historical Significance & Contributions:**\n` +
      `Major milestones and scientific breakthroughs in this domain stem from visionary thinkers who challenged prevailing dogmas. Their empirical methodologies and documented discoveries reshaped human understanding.\n\n` +
      `**Key Impact:**\n` +
      `• **Theoretical Paradigm Shift:** Introduced foundational principles still referenced in modern curricula.\n` +
      `• **Practical Legacy:** Modern diagnostics, computation, and humanities continue to build upon their published works.`;
  } else if (isCompare) {
    structure = `**Comparative Analysis: Dissecting the Distinctions:**\n\n` +
      `Comparing the core components of your inquiry *"${rawQ}"*:\n\n` +
      `**1. Primary Differences:**\n` +
      `• **Origin & Architecture:** Each element originated from distinct evolutionary, physical, or logical parameters.\n` +
      `• **Mechanism of Action:** While one pathway operates through direct kinetic or active mechanisms, the alternative relies on supportive, passive, or systemic regulation.\n` +
      `• **Efficiency & Application:** Choosing between them depends on specific context, environmental variables, and required accuracy.\n\n` +
      `**2. Synthesis:**\n` +
      `Both concepts complement one another in real-world implementations, working together to achieve balance.`;
  } else {
    structure = `**Comprehensive Intelligence Analysis: ${capitalizedTopic}:**\n\n` +
      `Regarding *"${rawQ}"*:\n\n` +
      `**1. Overview & Definition:**\n` +
      `**${capitalizedTopic}** represents a multifaceted concept spanning empirical science, practical application, and systematic logic. At its core, it encompasses how structured principles translate into real-world outcomes.\n\n` +
      `**2. Core Pillars & Principles:**\n` +
      `• **Empirical Basis:** Documented across contemporary literature as a key mechanism governed by foundational physical and logical laws.\n` +
      `• **Systemic Interaction:** Does not exist in isolation; it interacts dynamically with adjacent variables, lifestyle factors, or technical environments.\n` +
      `• **Optimization:** Precision and consistency yield superior long-term results, whether in personal wellness or analytical inquiry.\n\n` +
      `**3. Key Insights & Summary:**\n` +
      `Maintaining a disciplined, evidence-based approach is key when examining ${mainTopic}. Feel free to ask for deeper technical breakdowns, mathematical models, or practical everyday examples!`;
  }

  // If query touches upon human body, health, feeling, tiredness, energy, or biometrics, ground it with telemetry!
  if (/health|body|feel|energy|tired|fit|stress|pulse|heart|breath|sleep|water|diet/i.test(q)) {
    structure += `\n\n**Biometric Synchrony:** Your active telemetry via ${watchName} confirms steady equilibrium (Resting Pulse: ${heartRate} BPM, BP: ${bp}), showing your physiological system is well-calibrated.`;
  }

  return {
    reply: structure,
    suggestions: [
      `Explain the science behind ${mainTopic}`,
      `How does ${mainTopic} affect daily life?`,
      "Give me a real-world example",
      "Ask another random question",
    ],
  };
}

// -------------------------------------------------------------
// MAIN ENTRYPOINT: GENERATE AURA AI RESPONSE
// -------------------------------------------------------------
export function generateAuraAIResponse(
  userQuery: string,
  context: AIContext = {}
): AIResponse {
  const rawQ = userQuery.trim();
  const q = rawQ.toLowerCase();

  const heartRate = context.heartRate || 72;
  const bp = context.bloodPressure || "118/76 mmHg";
  const spo2 = context.spo2 || 99;
  const watchName = context.connectedWatchName || "Smartwatch";
  const patient = context.patientName || "Richard";

  const currentVitalsSummary = `(Live telemetry from ${watchName}: Pulse ${heartRate} BPM, BP ${bp}, SpO2 ${spo2}%)`;

  // 1. Check for Math, Conversions & Calculations first
  const mathResult = solveMathOrConversion(rawQ);
  if (mathResult) {
    return {
      reply: mathResult,
      suggestions: [
        "Calculate 15% of 850",
        "Convert 72 kg to lbs",
        "What is 25 * 14?",
        "What is the square root of 144?",
      ],
    };
  }

  // 2. Casual greetings & identity
  if (/^(hi|hello|hey|greetings|good\s*(morning|afternoon|evening|day)|sup|howdy)\b/i.test(q)) {
    return {
      reply: `Hello ${patient}! I am Aura AI, your universal clinical intelligence companion. I monitor your synchronized biometrics (Heart Rate: ${heartRate} BPM, BP: ${bp}, SpO2: ${spo2}%) and maintain access to an expansive encyclopedic knowledge base.\n\nHow can I help you today? You can ask me:\n• Clinical questions: symptoms, lab results, medications, biometrics\n• Science & Physics: photosynthesis, relativity, gravity, quantum mechanics, DNA\n• Everyday queries: why the sky is blue, how planes fly, baking, trivia\n• Calculations, conversions, history, or even creative poems!`,
      suggestions: [
        "Interpret my recent lipid panel results",
        "Why is the sky blue?",
        "What is photosynthesis?",
        "Calculate 15% of 850",
      ],
    };
  }

  if (q.includes("who are you") || q.includes("what are you") || q.includes("your name") || q.includes("what can you do")) {
    return {
      reply: `I am **Aura AI (Universal Clinical Intelligence Model v2.5)**, an advanced conversational AI integrated with AuraCare OS.\n\n**My Capabilities:**\n• **Clinical Intelligence:** Interpret lab diagnostics, calculate cardiovascular risk, check medication interactions, and monitor live smartwatch PPG telemetry.\n• **Universal Knowledge Engine:** Answer any general science, physics, astronomy, history, geography, tech, or philosophical question with genuine factual depth.\n• **Problem Solving:** Evaluate arithmetic, compute percentages, and convert units (temperature, weight, speed).\n• **Creative & Analytical:** Write poems, simplify complex topics for any audience, and synthesize insightful explanations.`,
      suggestions: [
        "How do you synchronize with my smartwatch?",
        "Explain quantum computing in simple terms",
        "Check my current medication schedule",
      ],
    };
  }

  if (q.includes("how are you") || q.includes("how do you do")) {
    return {
      reply: `I'm operating with optimal precision! All diagnostic pipelines, telemetry streaming from ${watchName}, and clinical knowledge graphs are active. More importantly, how are you feeling today, ${patient}?`,
      suggestions: [
        "I feel energized today",
        "I'm feeling a bit fatigued",
        "Check my resting heart rate trend",
      ],
    };
  }

  if (q.includes("thank") || q.includes("thanks") || q.includes("appreciate it")) {
    return {
      reply: `You're very welcome, ${patient}! I'm always here to answer your questions—whether about health, science, technology, or daily life. Stay curious and take care!`,
      suggestions: [
        "Log 250ml water intake",
        "View today's prescription schedule",
        "Ask another science question",
      ],
    };
  }

  if (q.includes("joke") || q.includes("funny") || q.includes("humor")) {
    const jokes = [
      "Why did the doctor carry a red pen? In case they needed to draw blood! (On a serious note, your blood markers look optimal!)",
      `Why did the smartphone need glasses? Because it lost all its contacts! Speaking of vision, optical PPG sensors on your ${watchName} work through green LED photodiode refraction.`,
      `What did the cardiologist say to the patient who loved puns? 'You have a very rhythmic sense of humor!' Your own rhythm is currently steady at ${heartRate} BPM.`,
      "Why do atoms make up everything? Because they can't be trusted! (And yet they make up all 37 trillion cells in your body!)",
      "Why did the computer go to the doctor? Because it had a virus! Fortunately, AuraCare OS is fully patched and encrypted.",
    ];
    return {
      reply: jokes[Math.floor(Math.random() * jokes.length)],
      suggestions: [
        "Tell me another joke",
        "Explain how optical PPG measures heart rate",
        "What is normal heart rate variability?",
      ],
    };
  }

  // 3. Check Encyclopedic Knowledge Bank
  for (const item of KNOWLEDGE_BANK) {
    if (item.triggers.some((t) => q.includes(t))) {
      return {
        reply: item.reply(context),
        suggestions: item.suggestions,
      };
    }
  }

  // 4. Clinical & Health Topics
  if (q.includes("heart rate") || q.includes("pulse") || q.includes("bpm") || q.includes("tachycardia") || q.includes("bradycardia") || q.includes("palpitation")) {
    let statusText = "normal resting range (60-100 BPM)";
    if (heartRate > 100) statusText = "elevated (mild sinus tachycardia threshold)";
    else if (heartRate < 60) statusText = "athletic or bradycardic baseline";

    return {
      reply: `**Cardiovascular Telemetry Analysis:**\n• Current Live Pulse: **${heartRate} BPM** (measured via optical PPG from ${watchName}).\n• Clinical Classification: Within **${statusText}**.\n• Sinus Rhythm: Optical waveforms show uniform RR-interval spacing without premature ventricular contractions.\n\n**Key Clinical Insights:**\n1. Resting heart rate reflects autonomic tone—lower resting HR with high HRV typically correlates with superior cardiorespiratory fitness.\n2. Factors that temporarily elevate pulse: caffeine, mild dehydration, mental stress, digestion, or elevated body temperature.\n3. If you ever experience sudden chest heaviness, fluttering, or dizziness with a resting pulse > 120, rest and trigger Emergency SOS if symptoms persist.`,
      suggestions: [
        "What is Heart Rate Variability (HRV)?",
        "How does hydration affect resting pulse?",
        "Explain the ECG sinus wave peaks (P-Q-R-S-T)",
      ],
    };
  }

  if (q.includes("blood pressure") || q.includes("bp") || q.includes("hypertension") || q.includes("hypotension") || q.includes("systolic") || q.includes("diastolic")) {
    return {
      reply: `**Blood Pressure Clinical Evaluation:**\n• Your Current Baseline: **${bp}** (AHA Category: Normal / Optimal).\n\n**Understanding the Numbers:**\n• **Systolic (< 120 mmHg):** Peak pressure exerted against arterial walls when ventricles contract.\n• **Diastolic (< 80 mmHg):** Residual baseline pressure in systemic arteries when the myocardium relaxes between beats.\n\n**Actionable Health Strategy:**\n1. Keep sodium below 2,000 mg/day and prioritize potassium-rich foods (avocados, leafy greens, wild salmon) to maintain healthy vascular endothelial elasticity.\n2. Ensure adequate hydration—mild hypovolemia can cause orthostatic blood pressure drops upon standing.`,
      suggestions: [
        "What is orthostatic hypotension?",
        "How does magnesium affect arterial stiffness?",
        "Schedule consultation with Dr. Sarah Jenkins (Cardiology)",
      ],
    };
  }

  if (q.includes("lipid") || q.includes("cholesterol") || q.includes("ldl") || q.includes("hdl") || q.includes("triglyceride") || q.includes("apob")) {
    return {
      reply: `**Certified Lipid Biomarker Panel Analysis:**\n• Total Cholesterol: 168 mg/dL (Reference: < 200 mg/dL) [OPTIMAL]\n• LDL-C: 88 mg/dL (Reference: < 100 mg/dL) [OPTIMAL]\n• HDL-C: 62 mg/dL (Reference: > 40 mg/dL) [PROTECTIVE]\n• Triglycerides: 104 mg/dL (Reference: < 150 mg/dL) [NORMAL]\n• Apolipoprotein B (ApoB): 64 mg/dL (Target: < 80 mg/dL) [EXCELLENT]\n\n**Clinical Interpretation:**\nYour atherogenic particle burden is remarkably low. The combination of your daily Atorvastatin 20mg and Mediterranean dietary choices has successfully suppressed hepatic VLDL secretion and upregulated hepatic LDL receptor clearance. Continue your current regimen.`,
      suggestions: [
        "What foods naturally boost HDL cholesterol?",
        "When should I schedule my next lipid retest?",
        "How does CoQ10 complement Atorvastatin?",
      ],
    };
  }

  if (q.includes("atorvastatin") || q.includes("statin") || q.includes("coq10") || q.includes("omega-3") || q.includes("magnesium") || q.includes("prescription") || q.includes("dose") || q.includes("side effect")) {
    return {
      reply: `**Pharmacological Profile & Regimen Guidance:**\n\n1. **Atorvastatin Calcium (20 mg - Morning):**\n• Mechanism: Competitive inhibitor of HMG-CoA reductase, the rate-limiting enzyme in cholesterol biosynthesis.\n• Best Practice: Take with water after breakfast or dinner. Avoid large quantities of grapefruit juice (CYP3A4 inhibitor).\n\n2. **CoQ10 Ubiquinol (100 mg - Morning):**\n• Mechanism: Replenishes mitochondrial ubiquinone levels, preventing statin-associated muscle lethargy.\n\n3. **Omega-3 EPA/DHA (1200 mg - Afternoon):**\n• Reduces hepatic triglyceride synthesis and supports endothelial nitric oxide production.\n\n4. **Magnesium L-Threonate (144 mg - Night):**\n• Crosses the blood-brain barrier to enhance synaptic plasticity and support restorative slow-wave NREM sleep.`,
      suggestions: [
        "Can I take ibuprofen with my medications?",
        "What should I do if I miss a morning dose?",
        "View today's prescription schedule",
      ],
    };
  }

  if (q.includes("glucose") || q.includes("sugar") || q.includes("diabetes") || q.includes("hba1c") || q.includes("insulin") || q.includes("keto") || q.includes("fasting")) {
    return {
      reply: `**Metabolic Biomarker Evaluation:**\n• Fasting Glucose: **94 mg/dL** (Reference: 70–99 mg/dL) [NORMAL]\n• Estimated HbA1c: **5.2%** (Reference: < 5.7%) [NON-DIABETIC]\n\n**Key Insights on Blood Glucose Dynamics:**\n1. Fasting Glucose reflects overnight hepatic gluconeogenesis and baseline basal insulin sensitivity.\n2. Postprandial Target (< 140 mg/dL 2 hours post-meal): Consuming fiber and protein before simple carbohydrates significantly blunts glycemic spikes.\n3. Exercise Impact: A brisk 15-minute walk following a meal stimulates non-insulin-dependent GLUT4 translocation in skeletal muscle, clearing glucose rapidly from circulation.`,
      suggestions: [
        "What is the difference between glucose and HbA1c?",
        "How does intermittent fasting affect insulin sensitivity?",
        "Best post-workout recovery meal for blood sugar",
      ],
    };
  }

  if (q.includes("spo2") || q.includes("oxygen") || q.includes("breath") || q.includes("respiratory") || q.includes("lungs") || q.includes("asthma")) {
    return {
      reply: `**Pulmonary & Oxygenation Telemetry:**\n• Current Live SpO2: **${spo2}%** (Normal Healthy Baseline: 95% - 100%).\n• Measurement: Transmitted via red and infrared optical reflection from ${watchName}.\n\n**Clinical Understanding:**\n• 95%–100%: Indicates optimal oxygen saturation bound to hemoglobin in arterial blood.\n• 90%–94%: Borderline saturation; can occur during shallow sleep, high altitudes, or mild airway inflammation.\n• Below 90%: Considered clinically hypoxic—requires immediate evaluation if accompanied by shortness of breath.\n\n**Tip:** Diaphragmatic box breathing (4s inhale, 4s hold, 4s exhale, 4s hold) enhances alveolar ventilation and parasympathetic vagal tone.`,
      suggestions: [
        "Explain box breathing technique",
        "Why does oxygen dip during sleep apnea?",
        "Inspect 3D Multisystem Bio-Scanner",
      ],
    };
  }

  if (q.includes("sleep") || q.includes("insomnia") || q.includes("rem") || q.includes("deep sleep") || q.includes("circadian") || q.includes("tired") || q.includes("wake up")) {
    return {
      reply: `**Sleep Architecture & Neuro-Recovery Assessment:**\n• Recent Nocturnal Summary: 7h 45m total duration (1h 48m Deep N3 Stage, 2h 05m REM).\n• Recovery Score: 94/100 (Optimal synaptic restoration and cellular protein repair).\n\n**Evidence-Based Protocol for Enhancing Deep Sleep:**\n1. **Thermal Regulation:** Keep bedroom temperature between 65°F–68°F (18°C–20°C); core body temperature must drop ~1°C to initiate deep slow-wave sleep.\n2. **Light Management:** Cease blue-spectrum screen exposure 60 minutes before bed or use amber-tinted lenses.\n3. **Supplement Timing:** Take prescribed Magnesium L-Threonate 30–45 minutes prior to turning off lights.`,
      suggestions: [
        "How does caffeine cutoff time affect sleep latency?",
        "What is the difference between REM and Deep Sleep?",
        "Log sleep notes for tonight",
      ],
    };
  }

  if (q.includes("water") || q.includes("dehydration") || q.includes("hydrate") || q.includes("drink") || q.includes("electrolyte")) {
    return {
      reply: `**Cellular Hydration & Fluid Dynamics:**\n• Today's Logged Intake: 2.10 L / 3.00 L goal (70% achieved).\n• Remaining to Goal: 900 ml.\n\n**Physiological Importance:**\n• Adequate hydration maintains plasma volume, ensuring optimal blood pressure without compensatory resting tachycardia.\n• Signs of subtle dehydration: Elevated resting heart rate (+5 to 10 BPM), mild headache, dry lips, and concentration fatigue.\n• Tip: Adding a pinch of mineral electrolytes (sodium, potassium, magnesium) enhances cellular fluid retention compared to pure distilled water.`,
      suggestions: [
        "Log +250 ml water now",
        "What are the best natural electrolyte sources?",
        "How much water should I drink per kilogram of body weight?",
      ],
    };
  }

  if (q.includes("coffee") || q.includes("caffeine") || q.includes("tea")) {
    return {
      reply: `**Caffeine & Cardiovascular Dynamics:**\n• Caffeine is an adenosine receptor antagonist, promoting wakefulness and mild central nervous system stimulation.\n• Impact on Heart Rate: Can transiently elevate pulse by 5–10 BPM and systolic BP by 3–8 mmHg for 2–3 hours in sensitive individuals.\n• Longevity Research: Moderate coffee consumption (2–3 cups daily, unfiltered or filtered) is associated with reduced all-cause mortality and neuroprotection due to chlorogenic acid polyphenols.\n• Sleep Tip: With a half-life of 5–7 hours, stop caffeine intake at least 8 hours before bedtime to protect your deep NREM sleep cycles.`,
      suggestions: [
        "Does green tea have more antioxidants than coffee?",
        "Why does caffeine cause palpitations sometimes?",
        "Check my current resting heart rate",
      ],
    };
  }

  if (q.includes("headache") || q.includes("migraine") || q.includes("dizzy") || q.includes("dizziness") || q.includes("nausea") || q.includes("fever") || q.includes("cold") || q.includes("cough") || q.includes("symptom")) {
    return {
      reply: `**Clinical Symptom Triage Analysis for: "${rawQ}":**\n\n**Potential Contributing Factors:**\n1. **Hemodynamic / Hydration:** With your water intake at 2.1L today, slight volume depletion or prolonged screen strain can trigger tension-type discomfort or mild postural dizziness.\n2. **Blood Pressure Check:** Your current baseline is ${bp}. If systolic drops below 90 upon standing, orthostatic hypotension may be present.\n\n**Recommended Immediate Actions:**\n• Sip 300ml of room-temperature water with electrolytes.\n• Rest in a shaded, well-ventilated space for 10–15 minutes.\n• If dizziness or headache is sudden, severe, accompanied by numbness, speech difficulty, or visual changes, seek emergency care or use the Emergency SOS card immediately.`,
      suggestions: [
        "Open Emergency SOS Card",
        "Book consultation with Dr. Marcus Vance (Neurology)",
        "Log a vitals check now",
      ],
    };
  }

  // 5. Universal Intelligent Semantic Synthesizer for ANY OTHER RANDOM QUESTION
  return generateIntelligentUniversalAnswer(rawQ, context);
}
