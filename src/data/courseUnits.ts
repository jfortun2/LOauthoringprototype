export type CourseUnit = {
  id: string;
  title: string;
  /** Objective IDs linked to content in this unit */
  objectiveIds: string[];
};

export const courseUnits: CourseUnit[] = [
  { id: "unit-1", title: "Unit 1: Foundations of Chemistry", objectiveIds: ["1"] },
  { id: "unit-2", title: "Unit 2: Atoms, Molecules and Ions", objectiveIds: ["2", "7"] },
  { id: "unit-3", title: "Unit 3: Electronic Structure and Periodic Properties", objectiveIds: ["1"] },
  {
    id: "unit-4",
    title: "Unit 4: Chemical Bonding and Molecular Geometry",
    objectiveIds: ["1"],
  },
  { id: "unit-5", title: "Unit 5: Composition of Substances", objectiveIds: ["5", "6"] },
  {
    id: "unit-6",
    title: "Unit 6: Reactions and Stoichiometry",
    objectiveIds: ["2", "3"],
  },
  { id: "unit-7", title: "Unit 7: Gases", objectiveIds: ["8"] },
  { id: "unit-8", title: "Unit 8: Thermochemistry", objectiveIds: ["14"] },
  { id: "unit-9", title: "Unit 9: Liquids and Solids", objectiveIds: [] },
  { id: "unit-10", title: "Unit 10: Solutions", objectiveIds: ["4"] },
  { id: "unit-11", title: "Unit 11: Acids and Bases", objectiveIds: ["2", "4", "7"] },
  { id: "unit-12", title: "Unit 12: Equilibrium", objectiveIds: ["5", "6"] },
  { id: "unit-13", title: "Unit 13: Thermodynamics", objectiveIds: ["9", "10"] },
];

export const COURSE_TITLE = "Test Authoring Course";
export const COURSE_TITLE_SHORT = "Test Authoring c...";
