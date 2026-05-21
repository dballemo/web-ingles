# web-ingles 🇬🇧

**Technical Business English SRS Trainer** — Static Web Application for GitHub Pages.

## Features

- **🧠 Active Recall + SRS** — SM-2 simplified spaced repetition algorithm with 3-second trigger timer
- **🎲 Daily Random Challenge** — 3-axis novelty generator to prevent neural habituation
- **🎤 Shadowing Station** — Web Speech API (TTS + STT) with phonetic error detection for Spanish speakers
- **🧘 NSDR Timer** — 25-min session lock + 5-min box breathing consolidation period
- **📊 Progress Dashboard** — Mastery stats, streaks, per-category breakdown
- **🌙 Dark Mode** — Optimized for reduced visual fatigue

## Tech Stack

- Vanilla JavaScript (no frameworks, no dependencies)
- Web Speech API (SpeechRecognition + SpeechSynthesis)
- GitHub Actions CI/CD → GitHub Pages
- localStorage for data persistence

## Setup

```bash
git clone https://github.com/dballemo/web-ingles.git
cd web-ingles
# Open index.html in a browser, or deploy to GitHub Pages
```

## Deployment

Push to `main` branch → GitHub Actions deploys to GitHub Pages automatically.

## Adding NSDR Ambient Audio

Place an `audio/ambient-alpha.mp3` file in the repo for the NSDR breathing session. The app falls back gracefully if the file is missing.

## Structure

```
├── .github/workflows/deploy.yml
├── index.html
├── css/main.css
├── js/
│   ├── app.js           # Core logic & state
│   ├── srsEngine.js      # SM-2 algorithm
│   ├── speechEngine.js   # TTS + STT + comparison
│   └── repository.js     # Content database
└── audio/
    └── ambient-alpha.mp3 # Optional NSDR audio
```
