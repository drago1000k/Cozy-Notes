<div align="center">

  <img src="public/WebIcon.png" alt="Cozy Notes Logo" width="140" style="border-radius: 28px; box-shadow: 0 10px 30px rgba(0,0,0,0.15);" />

  # 🦊 Cozy Notes — Lofi To-Do & Productivity Board

  <p align="center">
    <strong>A peaceful, aesthetic productivity sanctuary featuring draggable pastel sticky notes, ambient lofi radio, Pomodoro focus timer, an interactive fox companion, and Gemini AI-powered voice dictation & note organization.</strong>
  </p>

  <p align="center">
    <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19" /></a>
    <a href="https://vite.dev/"><img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" alt="Vite" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white" alt="Tailwind CSS v4" /></a>
    <a href="https://www.framer.com/motion/"><img src="https://img.shields.io/badge/Framer_Motion-12-0055FF?logo=framer&logoColor=white" alt="Framer Motion" /></a>
    <a href="https://firebase.google.com/"><img src="https://img.shields.io/badge/Firebase-Auth_%26_Firestore-FFCA28?logo=firebase&logoColor=black" alt="Firebase" /></a>
    <a href="https://ai.google.dev/"><img src="https://img.shields.io/badge/Google_Gemini-3.8_Flash-8E75B2?logo=google-gemini&logoColor=white" alt="Google Gemini" /></a>
    <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License" /></a>
  </p>

</div>

---

## 📖 Overview

**Cozy Notes** reimagines task management by replacing cold, clinical lists with a warm, tactile desktop experience. Set against a soothing study room with a wood-framed corkboard, gentle rain, steaming coffee, and an attentive fox mascot, Cozy Notes helps you enter a calm flow state while staying organized.

Underneath its handcrafted aesthetic lies a modern, full-stack architecture powered by **React 19**, **Vite**, **Tailwind CSS v4**, **Framer Motion**, real-time **Firebase Firestore synchronization**, and **Google Gemini 3.8 Flash** AI capabilities.

---

## ✨ Features at a Glance

### 📌 Interactive Sticky Note Canvas
- **Freeform Drag & Drop:** Move, arrange, and stack notes freely with realistic depth and smooth motion physics.
- **8 Curated Pastel Colors:** Amber, Pink, Mint, Sky, Lavender, Rose, Yellow, and Cyan palettes with matching borders.
- **Rich Text WYSIWYG Editing:** Format your thoughts with bold, italics, underlines, and lists.
- **Task Completion Celebration:** Check off notes to trigger cheerful confetti bursts, audio feedback, and celebratory mascot animations.
- **Canvas Zoom & Pan:** Native momentum panning, interactive zoom controls (Zoom in, Zoom out, Reset 100%), and completion progress meter.

### 🤖 Google Gemini AI Superpowers
- **🎙️ Smart Voice-to-Text Dictation:** Speak your thoughts naturally via the Web Speech API. Gemini AI cleans up grammar, adds punctuation, infers a concise title, and preserves your exact language (supports English, Vietnamese, etc.).
- **✨ Context-Aware Auto-Organize:** One-click semantic sorting that analyzes all active sticky notes, categorizes them into logical clusters (Work, Personal, Ideas, Shopping, etc.), applies harmonious color groupings, and rearranges them across the canvas without overlap.
- **🎯 Dynamic Smart Placement:** When Auto-Organize is active, newly created notes automatically fly to their appropriate semantic cluster on the whiteboard.

### 🦊 Interactive Fox Mascot
- Lives on your desk with animated eyes, fluffy tail, and reactive states:
  - **Idle:** Gently blinks and keeps you company.
  - **Working:** Types along with you while you compose notes.
  - **Celebrating:** Throws hearts, confetti, and celebratory sparkles when you finish a task!

### 📻 Built-in Retro Lofi Radio
- Embedded vintage radio player on your desk with real track audio:
  - **3 Distinct Channels:** 🌧️ *Rainy Night*, 📚 *Study*, 🌅 *Sunset*.
  - **30+ Curated Lofi MP3 Tracks:** Seamless playback, track scrubber, volume control, track skip, and track name display.

### ⏱️ Mini Laptop Pomodoro Timer
- Clickable mini-laptop on your desk functioning as a dedicated focus timer.
- Choose between preset focus intervals (15, 25, 45, or 60 minutes) or custom durations.
- Displays live countdown on the mini laptop screen and rings a gentle chime when focus time is complete.

### 🌧️ Dynamic Weather & Procedural ASMR Soundscapes
- **4 Ambient Moods:**
  - ☀️ **Clear:** Warm golden hour sunlight and serene vibes.
  - 🌧️ **Rainy:** Realistic raindrop screen overlay with continuous procedural rain audio.
  - 🌌 **Magical:** Ambient floating starlight particles and cosmic glow.
  - ☁️ **Cloudy:** Soft diffused overcast ambiance.
- **Synthesized Web Audio ASMR:** Procedurally generated sound effects without heavy asset downloads:
  - Paper crinkle on note interaction.
  - Satisfying bubble pop on deletion.
  - Pencil scribble on task completion.
  - Synthesized pink-noise rain loops, chimes, splash effects, and alarms.

### 🍾 Message in a Bottle
- Jot down a reflection, concern, or wish and send it into the ocean.
- Hear the splash as it drifts away, and receive an uplifting, mood-aware reply in return after a short pause.

### 📦 Vintage Archive Chest
- Finished with your notes? Store them in the vintage wooden treasure chest on your desk to keep your board tidy.
- Open the chest modal anytime to review past notes, restore them to the active board, or delete them permanently.

### ☁️ Cloud Sync & Authentication
- **Multi-Device Synchronization:** Powered by Firebase Authentication (Google Sign-In + Email/Password).
- **Real-Time Persistence:** All notes, positions, and mood histories synchronize live to Cloud Firestore.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Core Framework** | [React 19](https://react.dev/), [Vite 8](https://vite.dev/) |
| **Styling & Design** | [Tailwind CSS v4](https://tailwindcss.com/), Custom Vanilla CSS animations |
| **Motion & Physics** | [Framer Motion 12](https://www.framer.com/motion/) |
| **Icons & Visuals** | [Lucide React](https://lucide.dev/) |
| **Backend & Database** | [Firebase Authentication](https://firebase.google.com/docs/auth), [Cloud Firestore](https://firebase.google.com/docs/firestore) |
| **Artificial Intelligence** | [Google Gemini 3.8 Flash API](https://ai.google.dev/) |
| **Audio Engine** | Web Audio API (Procedural synthesis) + HTML5 Audio |

---

## 📂 Project Structure

```text
Cozy-Notes/
├── public/
│   ├── favicon.svg          # Favicon icon
│   └── WebIcon.png          # High-resolution cozy fox app icon
├── src/
│   ├── assets/              # Lofi audio tracks, ambient sound clips & icons
│   │   ├── Musics/          # Rainy Night, Study, and Sunset lofi music
│   │   └── Sounds/          # Keyboard typing and notification sounds
│   ├── components/
│   │   ├── ArchiveChest.jsx # Vintage chest widget on desk
│   │   ├── ArchiveModal.jsx # Archive management dialog
│   │   ├── AuthScreen.jsx   # Google & Email/Password login modal
│   │   ├── BottleCompanion.jsx # Message in a bottle interactive popover
│   │   ├── CozyDesk.jsx     # Bottom desk layout (fox, coffee, laptop, radio)
│   │   ├── Fox.jsx          # SVG/CSS animated fox companion
│   │   ├── LofiRadio.jsx    # Audio player modal and desk radio
│   │   ├── MoodSelector.jsx # Weather & mood selector pills
│   │   ├── NewNoteButton.jsx# Floating action button
│   │   ├── NewNoteModal.jsx # Rich-text editor with Voice-to-Text
│   │   ├── RainOverlay.jsx  # Animated canvas/CSS rain effect
│   │   ├── StickyNote.jsx   # Draggable sticky note component
│   │   ├── TimerModal.jsx   # Pomodoro duration configuration modal
│   │   └── Whiteboard.jsx   # Infinite-feel canvas with pan/zoom controls
│   ├── context/
│   │   └── AuthContext.jsx  # Firebase authentication context provider
│   ├── hooks/
│   │   └── useFirestoreSync.js # Real-time Firestore synchronization hook
│   ├── utils/
│   │   ├── aiAssistant.js   # Gemini API calls (Voice formatting, Auto-Organize)
│   │   ├── aiResponse.js    # Message in a Bottle mood response logic
│   │   ├── audio.js         # Web Audio API sound synthesis (ASMR sounds)
│   │   └── lofiTracks.js    # Music glob importer and playlist manager
│   ├── App.jsx              # Main application root
│   ├── firebase.js          # Firebase SDK initialization
│   ├── index.css            # Global theme styles & custom animations
│   └── main.jsx             # React DOM entry point
├── .env.example             # Environment configuration template
├── package.json             # Dependencies and scripts
└── vite.config.js           # Vite configuration
```

---

## 🚀 Getting Started

Follow these steps to run Cozy Notes locally on your machine:

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm**, **pnpm**, or **yarn**
- A **Google Gemini API Key** (Free tier available at [Google AI Studio](https://aistudio.google.com/))

### 2. Clone the Repository
```bash
git clone https://github.com/drago1000k/Cozy-Notes.git
cd Cozy-Notes
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Copy `.env.example` into a new `.env` file:
```bash
cp .env.example .env
```

Open `.env` and fill in your Gemini API key:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

> [!TIP]
> Firebase credentials are pre-configured in `src/firebase.js` for immediate out-of-the-box evaluation. For production deployments or your own Firebase project, replace the `firebaseConfig` object with your own Firebase project keys and enable **Email/Password** and **Google** auth providers in the Firebase Console.

### 5. Launch the Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

### 6. Build for Production
To generate an optimized production bundle:
```bash
npm run build
```
To preview the production build locally:
```bash
npm run preview
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| <kbd>N</kbd> | Open New Note modal (when not focused on an input) |
| <kbd>Ctrl</kbd> + <kbd>Enter</kbd> / <kbd>⌘</kbd> + <kbd>Enter</kbd> | Save and pin note |
| <kbd>Esc</kbd> | Close any open modal |

---

## ⚙️ Environment Variables Reference

| Variable | Description | Required |
|---|---|:---:|
| `VITE_GEMINI_API_KEY` | Google Gemini API key used for voice dictation formatting and semantic Auto-Organize clustering. | **Yes** |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📜 License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for more information.

---

<div align="center">
  <sub>Crafted with 💖 and a cup of warm coffee. If you enjoy Cozy Notes, consider giving this repo a ⭐!</sub>
</div>
