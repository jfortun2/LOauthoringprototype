import type { ContentNode } from "./types";

/** Course structure for bidirectional objective ↔ content mapping */
export const courseContentTree: ContentNode[] = [
  {
    id: "seq-1",
    type: "sequence",
    title: "Sequence 1: General Chemistry Foundations",
    children: [
      {
        id: "unit-1",
        type: "unit",
        title: "Unit 1: Atomic Structure & Bonding",
        children: [
          {
            id: "mod-1",
            type: "module",
            title: "Module 1: Electron Configuration",
            children: [
              {
                id: "page-1",
                type: "page",
                title: "Crystal Field Theory Intro",
                objectiveIds: ["1"],
              },
              {
                id: "page-2",
                type: "page",
                title: "Complex Ion Energy Levels",
                objectiveIds: ["1"],
              },
              {
                id: "act-1",
                type: "activity",
                title: "Practice: Splitting Diagrams",
                objectiveIds: ["1"],
              },
            ],
          },
        ],
      },
      {
        id: "unit-2",
        type: "unit",
        title: "Unit 2: Acids, Bases & Equilibrium",
        children: [
          {
            id: "mod-2",
            type: "module",
            title: "Module 2: Polyprotic Systems",
            children: [
              {
                id: "sec-2a",
                type: "section",
                title: "Section A: Acid-Base Foundations",
                children: [
                  {
                    id: "page-3",
                    type: "page",
                    title: "Polyprotic Acids",
                    objectiveIds: ["2", "7"],
                  },
                  {
                    id: "page-4",
                    type: "page",
                    title: "Strong and Weak Acids and Bases Summary",
                    objectiveIds: ["2", "7"],
                  },
                ],
              },
              {
                id: "sec-2b",
                type: "section",
                title: "Section B: Polyprotic Equilibrium",
                children: [
                  {
                    id: "page-5",
                    type: "page",
                    title: "Polyprotic Acids (CyberLearn)",
                    objectiveIds: ["2"],
                  },
                  {
                    id: "act-2",
                    type: "activity",
                    title: "ICE Table Checkpoint",
                    objectiveIds: ["2", "5", "6"],
                  },
                  {
                    id: "act-3",
                    type: "activity",
                    title: "Polyprotic Equilibrium Quiz",
                    objectiveIds: ["2"],
                  },
                ],
              },
            ],
          },
          {
            id: "mod-3",
            type: "module",
            title: "Module 3: Buffers & pH",
            children: [
              {
                id: "page-6",
                type: "page",
                title: "Henderson-Hasselbalch",
                objectiveIds: ["4", "11"],
              },
              {
                id: "act-4",
                type: "activity",
                title: "Buffer Capacity Lab",
                objectiveIds: ["4", "11"],
              },
            ],
          },
        ],
      },
      {
        id: "unit-3",
        type: "unit",
        title: "Unit 3: Stoichiometry & Thermochemistry",
        children: [
          {
            id: "mod-4",
            type: "module",
            title: "Module 4: Reaction Stoichiometry",
            children: [
              {
                id: "page-7",
                type: "page",
                title: "Limiting Reactant",
                objectiveIds: ["3"],
              },
              {
                id: "act-5",
                type: "activity",
                title: "Stoichiometry Problem Set",
                objectiveIds: ["3"],
              },
            ],
          },
          {
            id: "mod-5",
            type: "module",
            title: "Module 5: Energy in Reactions",
            children: [
              {
                id: "page-8",
                type: "page",
                title: "Enthalpy & Hess's Law",
                objectiveIds: ["13"],
              },
              {
                id: "page-9",
                type: "page",
                title: "Heat Capacity",
                objectiveIds: ["14"],
              },
            ],
          },
        ],
      },
      {
        id: "unit-4",
        type: "unit",
        title: "Unit 4: Redox & Nuclear Chemistry",
        children: [
          {
            id: "mod-6",
            type: "module",
            title: "Module 6: Electrochemistry",
            children: [
              {
                id: "page-10",
                type: "page",
                title: "Electrolysis Calculations",
                objectiveIds: ["10"],
              },
              {
                id: "act-6",
                type: "activity",
                title: "Faraday's Law Practice",
                objectiveIds: ["10", "8"],
              },
            ],
          },
          {
            id: "mod-7",
            type: "module",
            title: "Module 7: Nuclear Binding Energy",
            children: [
              {
                id: "page-11",
                type: "page",
                title: "Mass Defect & Binding Energy",
                objectiveIds: ["12"],
              },
              {
                id: "act-7",
                type: "activity",
                title: "Nuclear Stability Assessment",
                objectiveIds: ["12"],
              },
            ],
          },
        ],
      },
    ],
  },
];
