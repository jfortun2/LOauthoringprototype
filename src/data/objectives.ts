import type { LearningObjective, LearningObjectiveDraft, ObjectiveTagCounts } from "./types";
import { hasWeakCoverage } from "../utils/mappings";
import { enrichSubObjective } from "../utils/subObjectiveActivities";

export const TOTAL_OBJECTIVES = 160;
export const COURSE_ORGANIZATION = "Test Authoring Course";

const rawObjectives: LearningObjectiveDraft[] = [
  {
    id: "1",
    title: "Predict electron filling from energy splitting in complexes.",
    subObjectives: [
      {
        id: "1-1",
        title:
          "Rank ligand field strength and predict whether a complex is high-spin or low-spin.",
        formativeCount: 3,
        summativeCount: 3,
        linkedPages: [
          { id: "page-1", title: "Crystal Field Theory Intro", path: "Unit 1 › Module 1" },
        ],
      },
      {
        id: "1-2",
        title: "Draw crystal field splitting diagrams for octahedral and tetrahedral geometries.",
        formativeCount: 3,
        summativeCount: 3,
        linkedPages: [
          { id: "page-2", title: "Complex Ion Energy Levels", path: "Unit 1 › Module 1" },
        ],
      },
      {
        id: "1-3",
        title:
          "Use electron configurations to predict the number of unpaired electrons in a transition-metal complex.",
        formativeCount: 3,
        summativeCount: 3,
        linkedPages: [
          { id: "page-1", title: "Crystal Field Theory Intro", path: "Unit 1 › Module 1" },
          { id: "page-2", title: "Complex Ion Energy Levels", path: "Unit 1 › Module 1" },
        ],
      },
    ],
    linkedPages: [
      { id: "page-1", title: "Crystal Field Theory Intro", path: "Unit 1 › Module 1" },
      { id: "page-2", title: "Complex Ion Energy Levels", path: "Unit 1 › Module 1" },
    ],
    linkedAssessments: [
      { id: "act-1", title: "Practice: Splitting Diagrams", type: "formative" },
    ],
    tagCounts: { pages: 5, subObjectives: 3, formative: 9, summative: 9 },
    coverage: "strong",
    performancePercent: 72,
  },
  {
    id: "2",
    title:
      "Apply stoichiometric relationships to calculate amounts of substances involved in chemical reactions.",
    subObjectives: [
      {
        id: "2-1",
        title:
          "Use values from ICE table with the Ka or Kb expression to determine hydronium or hydroxide concentrations.",
        formativeCount: 3,
        summativeCount: 3,
        linkedPages: [
          { id: "page-3", title: "Polyprotic Acids", path: "Unit 2 › Module 2" },
          { id: "page-4", title: "Strong and Weak Acids and Bases Summary", path: "Unit 2 › Module 2" },
        ],
        activityLinks: [
          "survey_ins_diary14-q10",
          "survey_ins_diary12-q10",
          "survey_ins_diary06-q8",
        ],
      },
      {
        id: "2-2",
        title: "Given concentrations of species, calculate Ka and Kb.",
        formativeCount: 3,
        summativeCount: 3,
        linkedPages: [
          { id: "page-5", title: "Polyprotic Acids (CyberLearn)", path: "Unit 2 › Module 2" },
        ],
      },
      {
        id: "2-3",
        title: "Determine relative concentrations of species using an ICE table.",
        formativeCount: 1,
        summativeCount: 0,
        linkedPages: [],
      },
      {
        id: "2-4",
        title: "Calculate [H3O+] from pH (and vice versa) and calculate [OH-] from pOH (and vice versa).",
        formativeCount: 0,
        summativeCount: 0,
        linkedPages: [],
      },
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
    coverage: "weak",
    performancePercent: 58,
  },
  {
    id: "3",
    title:
      "Apply stoichiometric relationships to calculate amounts of substances involved in chemical reactions.",
    subObjectives: [
      {
        id: "3-1",
        title: "Convert between mass, moles, and particle count using molar mass and Avogadro's number.",
        formativeCount: 1,
        summativeCount: 0,
        linkedPages: [],
      },
      {
        id: "3-2",
        title: "Balance chemical equations and identify the limiting reactant.",
        formativeCount: 2,
        summativeCount: 1,
        linkedPages: [
          { id: "page-7", title: "Limiting Reactant", path: "Unit 3 › Module 4" },
        ],
      },
      {
        id: "3-3",
        title: "Calculate theoretical yield and percent yield from experimental data.",
        formativeCount: 1,
        summativeCount: 1,
        linkedPages: [],
      },
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
    subObjectives: [
      {
        id: "4-1",
        title: "Calculate the pH of a buffer given concentrations of weak acid and conjugate base.",
        formativeCount: 3,
        summativeCount: 3,
      },
      {
        id: "4-2",
        title:
          "Determine how much strong acid or base is needed to reach a target pH in a buffered solution.",
        formativeCount: 3,
        summativeCount: 3,
      },
      {
        id: "4-3",
        title:
          "Explain why buffers resist large changes in pH upon addition of small amounts of acid or base.",
        formativeCount: 3,
        summativeCount: 3,
      },
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
    subObjectives: [
      {
        id: "5-1",
        title: "Write equilibrium expressions from balanced chemical equations.",
        formativeCount: 3,
        summativeCount: 3,
      },
      {
        id: "5-2",
        title: "Calculate Kc or Kp from equilibrium concentration or pressure data.",
        formativeCount: 3,
        summativeCount: 3,
      },
      {
        id: "5-3",
        title:
          "Use reaction quotients to predict the direction a system will shift to reach equilibrium.",
        formativeCount: 3,
        summativeCount: 3,
      },
    ],
    linkedPages: [],
    linkedAssessments: [
      { id: "act-2", title: "ICE Table Checkpoint", type: "formative" },
    ],
    coverage: "moderate",
    performancePercent: 41,
  },
  {
    id: "6",
    title:
      "Apply the Law of Mass action to calculate equilibrium constants and concentrations.",
    subObjectives: [
      {
        id: "6-1",
        title:
          "Solve for unknown equilibrium concentrations using ICE tables and the equilibrium constant.",
        formativeCount: 3,
        summativeCount: 3,
      },
      {
        id: "6-2",
        title:
          "Relate the magnitude of K to whether products or reactants are favored at equilibrium.",
        formativeCount: 3,
        summativeCount: 3,
      },
    ],
    linkedPages: [],
    linkedAssessments: [
      { id: "act-2", title: "ICE Table Checkpoint", type: "formative" },
    ],
    coverage: "moderate",
    performancePercent: 45,
  },
  {
    id: "7",
    title:
      "Assess the relative strengths of acids and bases according to their ionization constants.",
    subObjectives: [
      {
        id: "7-1",
        title: "Compare Ka and Kb values to rank acids and bases from strongest to weakest.",
        formativeCount: 3,
        summativeCount: 3,
      },
      {
        id: "7-2",
        title: "Predict whether a salt solution will be acidic, basic, or neutral from its constituent ions.",
        formativeCount: 3,
        summativeCount: 3,
      },
      {
        id: "7-3",
        title: "Use ionization constants to estimate percent ionization for weak acids and bases.",
        formativeCount: 3,
        summativeCount: 3,
      },
    ],
    linkedPages: [
      { id: "page-3", title: "Polyprotic Acids", path: "Unit 2 › Module 2" },
    ],
    linkedAssessments: [],
    coverage: "moderate",
    performancePercent: 52,
  },
  {
    id: "8",
    title: "Calculate pressure, volume, temperature, and moles using the ideal gas law.",
    subObjectives: [
      {
        id: "8-1",
        title: "Apply PV = nRT to solve for any one variable given the others.",
        formativeCount: 3,
        summativeCount: 3,
      },
      {
        id: "8-2",
        title: "Use the combined gas law and Dalton's law of partial pressures in multi-step problems.",
        formativeCount: 3,
        summativeCount: 3,
      },
    ],
    linkedPages: [],
    linkedAssessments: [],
    coverage: "moderate",
    performancePercent: null,
  },
  {
    id: "9",
    title: "Predict the sign and magnitude of entropy changes for chemical processes.",
    subObjectives: [
      {
        id: "9-1",
        title: "Calculate ΔS° from standard molar entropies for reactants and products.",
        formativeCount: 3,
        summativeCount: 3,
      },
      {
        id: "9-2",
        title: "Predict whether entropy increases or decreases for phase changes and reactions.",
        formativeCount: 3,
        summativeCount: 3,
      },
      {
        id: "9-3",
        title: "Relate disorder at the molecular level to macroscopic entropy changes.",
        formativeCount: 3,
        summativeCount: 3,
      },
    ],
    linkedPages: [],
    linkedAssessments: [],
    coverage: "moderate",
    performancePercent: null,
  },
  {
    id: "10",
    title: "Determine whether a reaction is spontaneous under given conditions.",
    subObjectives: [
      {
        id: "10-1",
        title: "Use ΔG = ΔH − TΔS to predict spontaneity at various temperatures.",
        formativeCount: 3,
        summativeCount: 3,
      },
      {
        id: "10-2",
        title: "Interpret Gibbs free energy diagrams for coupled reactions.",
        formativeCount: 3,
        summativeCount: 3,
      },
      {
        id: "10-3",
        title: "Distinguish between thermodynamic favorability and reaction rate.",
        formativeCount: 3,
        summativeCount: 3,
      },
    ],
    linkedPages: [],
    linkedAssessments: [],
    coverage: "moderate",
    performancePercent: null,
  },
  {
    id: "11",
    title: "Interpret reaction rate data and rate laws.",
    subObjectives: [
      {
        id: "11-1",
        title: "Determine reaction order from experimental rate data.",
        formativeCount: 3,
        summativeCount: 3,
      },
      {
        id: "11-2",
        title: "Write rate laws from initial rates and concentration changes.",
        formativeCount: 3,
        summativeCount: 3,
      },
      {
        id: "11-3",
        title: "Explain how temperature and catalysts affect reaction rates.",
        formativeCount: 3,
        summativeCount: 3,
      },
    ],
    linkedPages: [],
    linkedAssessments: [],
    coverage: "moderate",
    performancePercent: 38,
  },
  {
    id: "12",
    title: "Balance redox equations using the half-reaction method.",
    subObjectives: [
      {
        id: "12-1",
        title: "Identify oxidation and reduction half-reactions in aqueous solutions.",
        formativeCount: 3,
        summativeCount: 3,
      },
      {
        id: "12-2",
        title: "Balance electrons and atoms in acidic and basic media.",
        formativeCount: 3,
        summativeCount: 3,
      },
      {
        id: "12-3",
        title: "Combine half-reactions to write balanced overall redox equations.",
        formativeCount: 3,
        summativeCount: 3,
      },
    ],
    linkedPages: [],
    linkedAssessments: [],
    coverage: "moderate",
    performancePercent: 44,
  },
  {
    id: "13",
    title: "Describe the relationship between cell potential and free energy.",
    subObjectives: [
      {
        id: "13-1",
        title: "Calculate ΔG° from standard cell potentials using ΔG° = −nFE°.",
        formativeCount: 3,
        summativeCount: 3,
      },
      {
        id: "13-2",
        title: "Use the Nernst equation to find cell potential under non-standard conditions.",
        formativeCount: 3,
        summativeCount: 3,
      },
      {
        id: "13-3",
        title: "Relate standard reduction potentials to the direction of spontaneous redox reactions.",
        formativeCount: 3,
        summativeCount: 3,
      },
    ],
    linkedPages: [],
    linkedAssessments: [],
    coverage: "moderate",
    performancePercent: 38,
  },
  {
    id: "14",
    title: "Calculate heat transferred in chemical and physical processes.",
    subObjectives: [
      {
        id: "14-1",
        title: "Apply q = mcΔT to calculate heat absorbed or released in temperature changes.",
        formativeCount: 3,
        summativeCount: 3,
      },
      {
        id: "14-2",
        title: "Use specific heat and heat of fusion or vaporization in phase-change calculations.",
        formativeCount: 3,
        summativeCount: 3,
      },
      {
        id: "14-3",
        title: "Distinguish between heat flow at constant pressure (ΔH) and constant volume (ΔU).",
        formativeCount: 3,
        summativeCount: 3,
      },
    ],
    linkedPages: [
      { id: "page-9", title: "Heat Capacity", path: "Unit 3 › Module 5" },
    ],
    linkedAssessments: [],
    coverage: "moderate",
    performancePercent: 55,
  },
];

export const objectives: LearningObjective[] = rawObjectives.map((objective) => {
  const enriched = {
    ...objective,
    subObjectives: objective.subObjectives.map((sub) => enrichSubObjective(sub)),
  };
  return {
    ...enriched,
    coverage: hasWeakCoverage(enriched) ? "weak" : enriched.coverage,
  };
});

export function getObjectiveTagCounts(objective: LearningObjective): ObjectiveTagCounts {
  if (objective.tagCounts) return objective.tagCounts;

  const formativeFromSubs = objective.subObjectives.reduce((n, s) => n + s.formativeCount, 0);
  const summativeFromSubs = objective.subObjectives.reduce((n, s) => n + s.summativeCount, 0);
  const formativeFromLinked = objective.linkedAssessments.filter(
    (a) => a.type === "formative",
  ).length;
  const summativeFromLinked = objective.linkedAssessments.filter(
    (a) => a.type === "summative",
  ).length;

  return {
    pages: objective.linkedPages.length,
    subObjectives: objective.subObjectives.length,
    formative: Math.max(formativeFromSubs, formativeFromLinked),
    summative: Math.max(summativeFromSubs, summativeFromLinked),
  };
}

/** @deprecated Use getObjectiveTagCounts */
export function getObjectiveCounts(objective: LearningObjective) {
  const tags = getObjectiveTagCounts(objective);
  return {
    subObjectives: tags.subObjectives,
    pages: tags.pages,
    activities: tags.formative + tags.summative,
  };
}
