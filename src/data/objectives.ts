import type { LearningObjective } from "./types";

export const TOTAL_OBJECTIVES = 160;
export const COURSE_ORGANIZATION = "Gardening 101";

export const objectives: LearningObjective[] = [
  {
    id: "1",
    title: "Predict electron filling from energy splitting in complexes.",
    subObjectiveItems: [
      "Rank ligand field strength and predict whether a complex is high-spin or low-spin.",
      "Draw crystal field splitting diagrams for octahedral and tetrahedral geometries.",
      "Use electron configurations to predict the number of unpaired electrons in a transition-metal complex.",
    ],
    linkedPages: [
      { id: "page-1", title: "Crystal Field Theory Intro", path: "Unit 1 › Module 1" },
      { id: "page-2", title: "Complex Ion Energy Levels", path: "Unit 1 › Module 1" },
    ],
    linkedAssessments: [
      { id: "act-1", title: "Practice: Splitting Diagrams", type: "formative" },
    ],
    coverage: "moderate",
    performancePercent: 72,
  },
  {
    id: "2",
    title:
      "Apply equilibrium concepts to acids and bases that may donate or accept more than one proton.",
    subObjectiveItems: [
      "Use values from ICE table with the Ka or Kb expression to determine hydronium or hydroxide concentrations.",
      "Given concentrations of species, calculate Ka and Kb.",
      "Determine relative concentrations of species using an ICE table.",
      "Calculate [H3O+] from pH (and vice versa) and calculate [OH-] from pOH (and vice versa).",
    ],
    linkedPages: [
      { id: "page-3", title: "Polyprotic Acids", path: "Unit 2 › Module 2" },
      { id: "page-4", title: "Strong and Weak Acids and Bases Summary", path: "Unit 2 › Module 2" },
      { id: "page-5", title: "Polyprotic Acids (CyberLearn)", path: "Unit 2 › Module 2" },
    ],
    linkedAssessments: [
      { id: "act-2", title: "ICE Table Checkpoint", type: "formative" },
      { id: "act-3", title: "Polyprotic Equilibrium Quiz", type: "summative" },
    ],
    coverage: "strong",
    performancePercent: 58,
  },
  {
    id: "3",
    title:
      "Apply stoichiometric relationships to calculate amounts of substances involved in chemical reactions.",
    subObjectiveItems: [
      "Convert between mass, moles, and particle count using molar mass and Avogadro's number.",
      "Balance chemical equations and identify the limiting reactant.",
      "Calculate theoretical yield and percent yield from experimental data.",
    ],
    linkedPages: [
      { id: "page-7", title: "Limiting Reactant", path: "Unit 3 › Module 4" },
    ],
    linkedAssessments: [
      { id: "act-5", title: "Stoichiometry Problem Set", type: "formative" },
    ],
    coverage: "moderate",
    performancePercent: 81,
  },
  {
    id: "4",
    title: "Apply the Henderson-Hasselbalch Equation to buffer calculations.",
    subObjectiveItems: [
      "Calculate the pH of a buffer given concentrations of weak acid and conjugate base.",
      "Determine how much strong acid or base is needed to reach a target pH in a buffered solution.",
      "Explain why buffers resist large changes in pH upon addition of small amounts of acid or base.",
    ],
    linkedPages: [
      { id: "page-6", title: "Henderson-Hasselbalch", path: "Unit 2 › Module 3" },
    ],
    linkedAssessments: [
      { id: "act-4", title: "Buffer Capacity Lab", type: "formative" },
    ],
    coverage: "moderate",
    performancePercent: 64,
  },
  {
    id: "5",
    title:
      "Apply the Law of Mass action to calculate equilibrium constants and concentrations",
    subObjectiveItems: [
      "Write equilibrium expressions from balanced chemical equations.",
      "Calculate Kc or Kp from equilibrium concentration or pressure data.",
      "Use reaction quotients to predict the direction a system will shift to reach equilibrium.",
    ],
    linkedPages: [],
    linkedAssessments: [
      { id: "act-2", title: "ICE Table Checkpoint", type: "formative" },
    ],
    coverage: "weak",
    performancePercent: 41,
  },
  {
    id: "6",
    title:
      "Apply the Law of Mass action to calculate equilibrium constants and concentrations.",
    subObjectiveItems: [
      "Solve for unknown equilibrium concentrations using ICE tables and the equilibrium constant.",
      "Relate the magnitude of K to whether products or reactants are favored at equilibrium.",
    ],
    linkedPages: [],
    linkedAssessments: [
      { id: "act-2", title: "ICE Table Checkpoint", type: "formative" },
    ],
    coverage: "weak",
    performancePercent: 45,
  },
  {
    id: "7",
    title:
      "Assess the relative strengths of acids and bases according to their ionization constants.",
    subObjectiveItems: [
      "Compare Ka and Kb values to rank acids and bases from strongest to weakest.",
      "Predict whether a salt solution will be acidic, basic, or neutral from its constituent ions.",
      "Use ionization constants to estimate percent ionization for weak acids and bases.",
    ],
    linkedPages: [
      { id: "page-3", title: "Polyprotic Acids", path: "Unit 2 › Module 2" },
      { id: "page-4", title: "Strong and Weak Acids and Bases Summary", path: "Unit 2 › Module 2" },
    ],
    linkedAssessments: [],
    coverage: "weak",
    performancePercent: 52,
  },
  {
    id: "8",
    title: "Assign oxidation states to compounds.",
    subObjectiveItems: [
      "Apply oxidation-state rules to atoms in ionic and molecular compounds.",
      "Identify which species is oxidized and which is reduced in a redox reaction.",
      "Balance redox half-reactions in acidic and basic solution.",
    ],
    linkedPages: [],
    linkedAssessments: [
      { id: "act-6", title: "Faraday's Law Practice", type: "formative" },
    ],
    coverage: "weak",
    performancePercent: 67,
  },
  {
    id: "9",
    title: "calc_k_exp_data",
    subObjectiveItems: [
      "Extract equilibrium constant data from experimental concentration measurements.",
      "Evaluate whether calculated K values are consistent across multiple trials.",
    ],
    linkedPages: [],
    linkedAssessments: [],
    coverage: "none",
    performancePercent: null,
  },
  {
    id: "10",
    title: "Calculate amounts of reacting substances during electrolysis.",
    subObjectiveItems: [
      "Relate current, time, and charge to moles of electrons transferred in an electrochemical cell.",
      "Calculate mass of metal deposited or gas produced at an electrode.",
      "Distinguish between quantities produced at the anode versus the cathode in electrolysis.",
    ],
    linkedPages: [
      { id: "page-10", title: "Electrolysis Calculations", path: "Unit 4 › Module 6" },
    ],
    linkedAssessments: [
      { id: "act-6", title: "Faraday's Law Practice", type: "formative" },
    ],
    coverage: "moderate",
    performancePercent: 73,
  },
  {
    id: "11",
    title:
      "Calculate amounts/concentrations of species and pH after adding strong acid or base to a buffer.",
    subObjectiveItems: [
      "Set up stoichiometric tables for strong acid or base added to a buffer solution.",
      "Recalculate conjugate acid and base concentrations after the neutralization step.",
      "Apply the Henderson-Hasselbalch equation to the post-addition mixture.",
      "Judge whether the buffer capacity has been exceeded and the solution is no longer buffering.",
    ],
    linkedPages: [
      { id: "page-6", title: "Henderson-Hasselbalch", path: "Unit 2 › Module 3" },
    ],
    linkedAssessments: [
      { id: "act-4", title: "Buffer Capacity Lab", type: "formative" },
    ],
    coverage: "moderate",
    performancePercent: 49,
  },
  {
    id: "12",
    title: "Calculate binding energy for nuclei.",
    subObjectiveItems: [
      "Calculate mass defect from nuclear masses of protons, neutrons, and the nucleus.",
      "Convert mass defect to binding energy using E = mc².",
      "Compare binding energy per nucleon across isotopes to identify unusually stable nuclei.",
    ],
    linkedPages: [
      { id: "page-11", title: "Mass Defect & Binding Energy", path: "Unit 4 › Module 7" },
    ],
    linkedAssessments: [
      { id: "act-7", title: "Nuclear Stability Assessment", type: "summative" },
    ],
    coverage: "moderate",
    performancePercent: 76,
  },
  {
    id: "13",
    title: "Calculate enthalpy changes for various chemical reactions.",
    subObjectiveItems: [
      "Use Hess's law to combine thermochemical equations and find overall ΔH.",
      "Calculate enthalpy change from standard enthalpies of formation.",
      "Interpret enthalpy diagrams for exothermic and endothermic processes.",
    ],
    linkedPages: [
      { id: "page-8", title: "Enthalpy & Hess's Law", path: "Unit 3 › Module 5" },
    ],
    linkedAssessments: [],
    coverage: "weak",
    performancePercent: 38,
  },
  {
    id: "14",
    title: "Calculate heat transferred in chemical and physical processes.",
    subObjectiveItems: [
      "Apply q = mcΔT to calculate heat absorbed or released in temperature changes.",
      "Use specific heat and heat of fusion or vaporization in phase-change calculations.",
      "Distinguish between heat flow at constant pressure (ΔH) and constant volume (ΔU).",
    ],
    linkedPages: [
      { id: "page-9", title: "Heat Capacity", path: "Unit 3 › Module 5" },
    ],
    linkedAssessments: [],
    coverage: "weak",
    performancePercent: 55,
  },
];

export function getObjectiveCounts(objective: LearningObjective) {
  return {
    subObjectives: objective.subObjectiveItems.length,
    pages: objective.linkedPages.length,
    activities: objective.linkedAssessments.length,
  };
}
