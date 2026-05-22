# web-ingles 🇬🇧

**Adaptive Technical Business English SRS Trainer** — Static Web Application for GitHub Pages.

## What's New: Adaptive Difficulty System

The app now features a **4-level adaptive system** that grows with you:

- **⭐ Nivel 1 — Principiante**: Frases simples, vocabulario básico
- **⭐⭐ Nivel 2 — Intermedio**: Términos técnicos estándar, oraciones compuestas
- **⭐⭐⭐ Nivel 3 — Avanzado**: Lenguaje técnico complejo, expresiones sutiles
- **⭐⭐⭐⭐ Experto**: Muy complejo, específico de la industria, formal

### Sistema de puntuación 1-10 estrellas

En lugar de Easy/Hard/Forgot, ahora puntuas del **1 al 10**:

| Estrellas | Significado | Efecto SRS |
|---|---|---|
| ⭐ 1-2 | Olvidado por completo | Reinicia intervalo |
| ⭐ 3-4 | Muy difícil, casi olvidado | Intervalo corto |
| ⭐ 5-6 | Con dificultad | Intervalo moderado |
| ⭐ 7-8 | Bastante bien | Progresión normal SM-2 |
| ⭐ 9-10 | Perfecto | Progresión acelerada + bonus EF |

### Adaptación automática

- Empiezas en Nivel 1
- Si tu media de las últimas 10 tarjetas es ≥ 8.0 → **subes de nivel** 🎉
- Si tu media baja de 5.0 → **baja de nivel** para reforzar bases
- Siempre puedes cambiar el nivel manualmente en 📈 Progreso

## Features

- **🧠 SRS Adaptativo** — Algoritmo SM-2 mejorado con puntuación 1-10 estrellas
- **🎯 4 Niveles de Dificultad** — De principiante a experto, con progresión automática
- **🎲 Daily Random Challenge** — Generador de novedad en 3 ejes
- **🎤 Shadowing Station** — Web Speech API (TTS + STT) con detección de errores fonéticos
- **🧘 NSDR Timer** — Bloqueo de 25 min + 5 min de respiración box
- **📊 Progress Dashboard** — Estadísticas por nivel, categoría, racha
- **🌙 Dark Mode** — Optimizado para fatiga visual reducida

## Tech Stack

- Vanilla JavaScript (sin frameworks, sin dependencias)
- Web Speech API (SpeechRecognition + SpeechSynthesis)
- GitHub Actions CI/CD → GitHub Pages
- localStorage para persistencia de datos

## Setup

```bash
git clone https://github.com/dballemo/web-ingles.git
cd web-ingles
# Abre index.html en un navegador, o despliega en GitHub Pages
```

## Deployment

Push a `main` → GitHub Actions despliega automáticamente a GitHub Pages.

## Estructura de Niveles

```
Nivel 1 (Principiante)     → 12 chunks
  ├── Presentaciones básicas
  ├── Frases cortas de proveedores
  └── System status simple

Nivel 2 (Intermedio)       → 14 chunks
  ├── Arquitecto de soluciones
  ├── RFPs estándar
  └── API básica

Nivel 3 (Avanzado)         → 16 chunks
  ├── Roadmap técnico
  ├── Canary deployments
  └── Circuit breakers

Nivel 4 (Experto)          → 12 chunks
  ├── Desacoplamiento progresivo
  ├── Cumplimiento SOC 2
  └── Visibilidad ejecutiva
```

## Structure

```
├── .github/workflows/deploy.yml
├── index.html
├── css/main.css
├── js/
│   ├── app.js           # Lógica principal + adaptación de niveles
│   ├── srsEngine.js      # Algoritmo SM-2 con estrellas 1-10
│   ├── speechEngine.js   # TTS + STT + comparación
│   └── repository.js     # Base de datos con dificultad 1-4
└── audio/
    └── ambient-alpha.mp3 # Opcional: audio NSDR
```

## Cómo funciona la adaptación

1. **Puntúa honestamente** del 1 al 10 tras cada tarjeta
2. La app **calcula tu media** en tiempo real
3. Cuando llevas 10+ tarjetas con media ≥ 8.0 → **Nivel desbloqueado**
4. Si te cuesta mucho (media ≤ 5.0) → **baja automáticamente**
5. Siempre puedes **ajustar manualmente** desde el panel de progreso

## Migración desde versión anterior

Si venías usando la versión anterior (Easy/Hard/Forgot):
- Tus datos se migran automáticamente
- El nivel se inicializa en 1
- Las tarjetas anteriores sin dificultad se asignan a Nivel 3

---

*Hecho con 🌌 por dballemo*
