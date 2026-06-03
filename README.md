# LOauthoringprototype

UX research prototype for the OLI Torus **Learning Objectives** authoring screen, built from [Figma — Learning Objectives Updates](https://www.figma.com/design/iVKgFJwC1iKP7jmJBGILOK/Learning-Objectives-Updates?node-id=2-1262).

## Run locally

Install dependencies first (required once):

```bash
npm install
```

Then start the dev server:

```bash
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

## Stack

- React 19 + TypeScript
- Vite
- CSS modules (design tokens in `src/styles/tokens.css`)

## Features (prototype)

- **Workspace navigation** (preserved from Figma): Course Author shell, Create → Objectives, etc.
- **Course content outline** (legacy-inspired): hierarchical pages/activities with LO count badges
- **Objective-centric view**: each objective shows coverage strength, linked pages, assessments, sub-objectives, and student mastery %
- **Bidirectional mapping**: select content in the outline → see objectives it supports; expand an objective → see all linked content and assessments (click to jump back to outline)
- **Gap signals**: warning styling when pages or assessments are missing (like legacy red indicators)
- Search, create field, pagination, and mock Gardening 101 / chemistry data
