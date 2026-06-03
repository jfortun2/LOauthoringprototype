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

- Course author shell: header, sidebar navigation, Learning Objectives page
- Search, sort controls, pagination
- Expandable objective cards with sub-objectives, linked pages, and action buttons
- Mock chemistry course data matching the Figma sample content
