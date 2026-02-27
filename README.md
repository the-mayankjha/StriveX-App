# StriveX

StriveX is a modern, gamified fitness and workout tracking application designed to turn your fitness journey into an RPG-style adventure. Drawing inspiration from popular RPG systems like "Solo Leveling," StriveX features a unique, dynamic interface complete with quest systems, exercise banks, and highly immersive UI effects.

## 🌟 Key Features

- **Quest System:** Daily and weekly fitness objectives categorized by workout types (Strength, Push, Pull, Legs, Cardio, etc.). Build your routine just like accepting a daily quest.
- **Exercise Bank:** A comprehensive library of exercises with robust search and filtering options by body part, target muscle, and equipment.
- **Solo Leveling Mode:** A highly immersive UI theme featuring custom glitch animations, electric borders, and holographic notifications that respond to your progression.
- **Gamified Progression:** Earn experience, level up, and celebrate your milestones with custom animations, rank tracking, and visual feedback.
- **Guilds & Leaderboards:** Connect with other athletes, track progress, and compete on community leaderboards.

## 🛠 Tech Stack

- **Frontend Framework:** React 19 + TypeScript
- **Build Tool:** Vite
- **Styling & CSS:** Tailwind CSS v4
- **Animations & Effects:**
  - Framer Motion (page transitions and layout animations)
  - react-powerglitch (sci-fi glitch effects)
  - canvas-confetti (celebration effects)
- **Icons:** Lucide React
- **Routing:** React Router v7

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/the-mayankjha/StriveX-App.git
   cd StriveX-App
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

### Development Server

To start the local Vite development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## 📦 Build for Production

To create an optimized production build:

```bash
npm run build
```

This will run TypeScript type checking and bundle the application into the `dist` directory. You can preview the production build locally using `npm run preview`.

## 🎨 UI/UX Notes

StriveX relies heavily on a deeply integrated dark mode theme (`#0F1115` base background) with vibrant `#3B82F6` blue accents. It leverages advanced CSS features alongside `framer-motion` to deliver snappy, hardware-accelerated animations (specifically optimized for both Desktop and PWA mobile environments).
