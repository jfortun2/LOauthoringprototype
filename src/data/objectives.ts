export type LearningObjective = {
  id: string;
  title: string;
  subObjectives: number;
  pages: number;
  activities: number;
  expanded?: boolean;
  subObjectiveItems?: string[];
  pageLinks?: string[];
};

export const TOTAL_OBJECTIVES = 160;

export const objectives: LearningObjective[] = [
  {
    id: "1",
    title: "Predict electron filling from energy splitting in complexes.",
    subObjectives: 0,
    pages: 0,
    activities: 0,
  },
  {
    id: "2",
    title:
      "Apply equilibrium concepts to acids and bases that may donate or accept more than one proton.",
    subObjectives: 4,
    pages: 3,
    activities: 5,
    expanded: true,
    subObjectiveItems: [
      "Use values from ICE table with the Ka or Kb expression to determine hydronium or hydroxide concentrations.",
      "Given concentrations of species, calculate Ka and Kb.",
      "Determine relative concentrations of species using an ICE table.",
      "Calculate [H3O+] from pH (and vice versa) and calculate [OH-] from pOH (and vice versa).",
    ],
    pageLinks: [
      "Polyprotic Acids",
      "Strong and Weak Acids and Bases Summary",
      "Polyprotic Acids (CyberLearn)",
    ],
  },
  {
    id: "3",
    title:
      "Apply stoichiometric relationships to calculate amounts of substances involved in chemical reactions.",
    subObjectives: 1,
    pages: 0,
    activities: 0,
  },
  {
    id: "4",
    title: "Apply the Henderson-Hasselbalch Equation to buffer calculations.",
    subObjectives: 0,
    pages: 0,
    activities: 5,
  },
  {
    id: "5",
    title:
      "Apply the Law of Mass action to calculate equilibrium constants and concentrations",
    subObjectives: 0,
    pages: 0,
    activities: 3,
  },
  {
    id: "6",
    title:
      "Apply the Law of Mass action to calculate equilibrium constants and concentrations.",
    subObjectives: 0,
    pages: 0,
    activities: 5,
  },
  {
    id: "7",
    title:
      "Assess the relative strengths of acids and bases according to their ionization constants.",
    subObjectives: 0,
    pages: 0,
    activities: 6,
  },
  {
    id: "8",
    title: "Assign oxidation states to compounds.",
    subObjectives: 0,
    pages: 0,
    activities: 8,
  },
  {
    id: "9",
    title: "calc_k_exp_data",
    subObjectives: 0,
    pages: 0,
    activities: 11,
  },
  {
    id: "10",
    title: "Calculate amounts of reacting substances during electrolysis.",
    subObjectives: 0,
    pages: 0,
    activities: 2,
  },
  {
    id: "11",
    title:
      "Calculate amounts/concentrations of species and pH after adding strong acid or base to a buffer.",
    subObjectives: 0,
    pages: 0,
    activities: 7,
  },
  {
    id: "12",
    title: "Calculate binding energy for nuclei.",
    subObjectives: 0,
    pages: 0,
    activities: 8,
  },
  {
    id: "13",
    title: "Calculate enthalpy changes for various chemical reactions.",
    subObjectives: 0,
    pages: 0,
    activities: 0,
  },
  {
    id: "14",
    title: "Calculate heat transferred in chemical and physical processes.",
    subObjectives: 0,
    pages: 0,
    activities: 0,
  },
];
