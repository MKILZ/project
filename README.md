# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from "eslint-plugin-react";

export default tseslint.config({
  // Set the react version
  settings: { react: { version: "18.3" } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs["jsx-runtime"].rules,
  },
});
```

# project

Interview Day at Raikes was created by Ian Kuchar, Mary Kate Nussrallah, Zak Rab, and Lucy Salyer. These four are all second-year students in the Raikes School. As first-years, they played the game Friday Night at the ER with other members of their cohort. This is a strategy game that works to build teamwork and encourage the players to collaborate with each other to achieve success in the busy night in the emergency room that is simulated. The four creators of Interview Day at Raikes wanted to make this game personal to themselves and to attribute it to the place where they learned its inspiration. Interview Day at Raikes allows for teams to play a game of strategy and teamwork online instead of having to do so in an in-person environment with the physical game materials.

In order to start this game, there needs to be one person who will host the game. The host is a moderator - a teacher, a boss, etc. The host will start the game. Then, four players besides the host must join the game lobby using the published code. Each of the four players will have a different role in the game. The player who is assigned to "Welcome" will take in arriving students and then will be able to send them to the different rooms in the game. The player who is assigned to "Presentation" will take in students arriving from "Welcome" or from the outside. Then, students from "Presentation" can be sent to "Interview" or "Lunch". The player who is assinged to "Interview" will take in students arriving from "Welcome" or "Presentation". Students from "Interview" can be sent to "Lunch" only. The player assigned to "Lunch" can take in students from any of the other three rooms and can only send students out of the game. When handling students, each player must keep an 1:1 ratio of students:volunteers. You are able to bring in more volunteers throughout the game if you need them in order to keep the 1:1 ratio. This may be difficult to do as "Events" will come about each half-hour that could heavily affect the progress of your team's gameplay. You must handle each "Event" before you can move on to the next round. You will have an hour to complete the game. If you are not finished by the time the hour is up, you will end the game immediately.

# 🎓 Interview Day at Raikes

**Created by Ian Kuchar, Mary Kate Nussrallah, Zak Rab, and Lucy Salyer**

Second-year students at the Raikes School, the creators of _Interview Day at Raikes_, drew inspiration from a game they played as first-years—_Friday Night at the ER_. That game simulated the challenges of a busy emergency room and emphasized teamwork and strategy. With this online version, the team brings that same spirit into a digital setting tailored to their own experience.

---

## 🎮 Game Overview

_Interview Day at Raikes_ is a strategy and collaboration game designed for teams to play online. The goal is to manage a virtual "interview day" simulation efficiently and effectively by working together across multiple roles.

### 👤 Game Roles

There are five participants:

- **1 Host** (e.g., teacher or boss) — starts and moderates the game.
- **4 Players** — each assigned a different role:
- **Welcome**: Greets incoming students and routes them to other rooms.
- **Presentation**: Accepts students from _Welcome_ or the outside; sends them to _Interview_ or _Lunch_.
- **Interview**: Accepts students from _Welcome_ or _Presentation_; sends them only to _Lunch_.
- **Lunch**: Accepts students from any room; only sends them _out_ of the game.

Each role must maintain a **1:1 student-to-volunteer ratio**, and volunteers can be added as needed. However, watch out for in-game "Events" that disrupt progress every simulated half-hour.

---

## 🚀 Getting Started

Follow the steps below to set up and run the project locally using **Vite**.

### 📦 Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn

### 🛠️ Installation and Intitialization

```bash
git clone https://github.com/your-username/interview-day-at-raikes.git
cd interview-day-at-raikes
npm install
npm run dev





```
