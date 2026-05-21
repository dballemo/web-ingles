/*
 * app.js — Core Application Logic & State Management
 *
 * Orchestrates all modules:
 *   - Tab navigation
 *   - Active Recall + SRS (3s timer ring, self-evaluation)
 *   - Daily Random Challenge (3-axis novelty)
 *   - Shadowing (TTS + STT + phonetic comparison)
 *   - Stats dashboard
 *   - NSDR Timer (25 min session → 5 min lockdown)
 */

/* ===========================
   Global State
   =========================== */
const App = {
  state: {
    currentTab: 'recall',
    sessionStart: null,
    sessionSeconds: 0,
    sessionTimerId: null,
    nsdrActive: false,

    // Recall state
    recallBatch: [],
    recallIndex: 0,
    recallAnswered: false,
    recallRingTimeout: null,
    recallRingInterval: null,
    recallRingRemaining: 3,
    recallRoundComplete: false,

    // Shadowing state
    shadowChunk: null,
    shadowSpoken: '',

    // Daily challenge state
    dailySeed: null
  },

  /* ---------- Init ---------- */
  init() {
    this.srsState = SRS.load();
    this.state.sessionStart = Date.now();
    this._startSessionTimer();
    this._bindTabs();
    this._bindNSDR();
    this._bindRecall();
    this._bindDaily();
    this._bindShadowing();
    this._bindStats();
    this._updateHeaderStats();

    // Load daily challenge on init
    this._generateDaily();
  },

  /* ===========================
     Session Timer
     =========================== */
  _startSessionTimer() {
    this.state.sessionTimerId = setInterval(() => {
      this.state.sessionSeconds = Math.floor((Date.now() - this.state.sessionStart) / 1000);
      this._renderSessionTimer();

      // Trigger NSDR at 25 minutes
      if (this.state.sessionSeconds >= 25 * 60 && !this.state.nsdrActive) {
        this._triggerNSDR();
      }
    }, 1000);
  },

  _renderSessionTimer() {
    const el = document.getElementById('session-timer');
    if (!el) return;
    const m = Math.floor(this.state.sessionSeconds / 60);
    const s = this.state.sessionSeconds % 60;
    el.textContent = `⏱ ${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  },

  /* ===========================
     NSDR Timer
     =========================== */
  _bindNSDR() {
    // NSDR is triggered automatically at 25 min
    // User cannot dismiss until 5 min pass
  },

  _triggerNSDR() {
    this.state.nsdrActive = true;
    const overlay = document.getElementById('nsdr-overlay');
    overlay.classList.remove('hidden');

    // Start ambient audio
    const audio = document.getElementById('nsdr-audio');
    if (audio) {
      audio.volume = 0.3;
      audio.play().catch(() => { /* may need user gesture */ });
    }

    // 5-minute countdown
    this._startNSDRCountdown(5 * 60);
  },

  _startNSDRCountdown(totalSeconds) {
    let remaining = totalSeconds;
    const timerEl = document.getElementById('nsdr-timer');
    const circleEl = document.getElementById('breathing-circle');
    const labelEl = document.getElementById('breathing-label');

    // Box breathing cycle: 4s inhale, 4s hold, 4s exhale, 4s hold
    const breathCycle = 16; // seconds for full cycle
    let breathPhase = 0;
    let phaseTime = 0;

    const tick = () => {
      if (remaining <= 0) {
        // NSDR complete
        document.getElementById('nsdr-overlay').classList.add('hidden');
        const audio = document.getElementById('nsdr-audio');
        if (audio) audio.pause();
        this.state.nsdrActive = false;
        this.state.sessionStart = Date.now(); // reset session
        this.state.sessionSeconds = 0;
        return;
      }

      // Update timer display
      const m = Math.floor(remaining / 60);
      const s = remaining % 60;
      timerEl.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

      // Box breathing animation
      phaseTime++;
      if (phaseTime >= 4) { phaseTime = 0; breathPhase = (breathPhase + 1) % 4; }

      circleEl.classList.remove('inhale', 'hold', 'exhale');
      switch (breathPhase) {
        case 0: circleEl.classList.add('inhale'); labelEl.textContent = 'Inhala (4s)'; break;
        case 1: circleEl.classList.add('hold'); labelEl.textContent = 'Retén (4s)'; break;
        case 2: circleEl.classList.add('exhale'); labelEl.textContent = 'Exhala (4s)'; break;
        case 3: circleEl.classList.add('hold'); labelEl.textContent = 'Retén (4s)'; break;
      }

      remaining--;
      setTimeout(tick, 1000);
    };

    tick();
  },

  /* ===========================
     Tab Navigation
     =========================== */
  _bindTabs() {
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        if (this.state.nsdrActive) return; // block during NSDR

        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        tab.classList.add('active');
        document.getElementById(`tab-${target}`).classList.add('active');
        this.state.currentTab = target;

        if (target === 'stats') this._renderStats();
        if (target === 'daily') this._generateDaily();
      });
    });
  },

  /* ===========================
     Active Recall + SRS
     =========================== */
  _bindRecall() {
    document.getElementById('btn-trigger').addEventListener('click', () => this._revealAnswer());
    document.querySelectorAll('.self-eval button').forEach(btn => {
      btn.addEventListener('click', () => {
        const rating = btn.dataset.rating;
        this._evaluateRecall(rating);
      });
    });
    document.getElementById('btn-next-round').addEventListener('click', () => this._startRecallRound());
  },

  _startRecallRound() {
    if (this.state.nsdrActive) return;

    this.state.recallBatch = SRS.pickSessionBatch(this.srsState, REPOSITORY.chunks, 8);
    this.state.recallIndex = 0;
    this.state.recallAnswered = false;
    this.state.recallRoundComplete = false;

    if (this.state.recallBatch.length === 0) {
      document.getElementById('recall-intro').classList.remove('hidden');
      document.getElementById('recall-challenge').classList.add('hidden');
      document.getElementById('recall-done').classList.remove('hidden');
      document.getElementById('recall-summary').textContent = '¡No hay tarjetas pendientes! Vuelve cuando el algoritmo te las programe.';
      document.getElementById('btn-next-round').textContent = 'Revisar de todos modos';
      return;
    }

    document.getElementById('recall-intro').classList.add('hidden');
    document.getElementById('recall-done').classList.add('hidden');
    document.getElementById('recall-challenge').classList.remove('hidden');
    document.getElementById('recall-reveal').classList.add('hidden');

    this._showRecallCard();
  },

  _showRecallCard() {
    const item = this.state.recallBatch[this.state.recallIndex];
    document.getElementById('chunk-spanish').textContent = item.chunk.spanish;
    document.getElementById('chunk-english').textContent = item.chunk.english;
    document.getElementById('btn-trigger').disabled = false;
    document.getElementById('recall-reveal').classList.add('hidden');

    // Start 3-second countdown ring
    this._startRecallRing();
  },

  _startRecallRing() {
    this.state.recallAnswered = false;
    this.state.recallRingRemaining = 3;
    const ring = document.getElementById('ring-progress');
    const countdown = document.getElementById('ring-countdown');
    const circumference = 326.73; // 2 * PI * 52

    ring.style.strokeDashoffset = '0';
    ring.classList.remove('warning', 'danger');
    countdown.textContent = '3';

    let elapsed = 0;
    const tickMs = 100;

    clearInterval(this.state.recallRingInterval);
    this.state.recallRingInterval = setInterval(() => {
      elapsed += tickMs;
      const remaining = Math.max(0, 3000 - elapsed);
      const progress = remaining / 3000;
      const offset = circumference * (1 - progress);
      ring.style.strokeDashoffset = offset;

      const sec = Math.ceil(remaining / 1000);
      countdown.textContent = sec;

      if (remaining <= 1000) ring.classList.add('warning');
      if (remaining <= 500) ring.classList.add('danger');

      if (remaining <= 0) {
        clearInterval(this.state.recallRingInterval);
        this._revealAnswer(); // auto-reveal if user didn't press trigger
      }
    }, tickMs);
  },

  _revealAnswer() {
    if (this.state.recallAnswered) return;
    this.state.recallAnswered = true;
    clearInterval(this.state.recallRingInterval);

    document.getElementById('btn-trigger').disabled = true;
    document.getElementById('recall-reveal').classList.remove('hidden');
  },

  _evaluateRecall(rating) {
    if (!this.state.recallAnswered) return;

    const item = this.state.recallBatch[this.state.recallIndex];
    const updatedCard = SRS.updateCard(item.card, rating);
    this.srsState.cards[item.chunk.id] = updatedCard;
    this.srsState.totalReviews += 1;
    SRS.updateStreak(this.srsState);
    SRS.save(this.srsState);

    // Advance
    this.state.recallIndex++;
    if (this.state.recallIndex >= this.state.recallBatch.length) {
      this._finishRecallRound();
    } else {
      this._showRecallCard();
    }

    this._updateHeaderStats();
  },

  _finishRecallRound() {
    this.state.recallRoundComplete = true;
    document.getElementById('recall-challenge').classList.add('hidden');
    document.getElementById('recall-done').classList.remove('hidden');
    document.getElementById('recall-summary').textContent =
      `${this.state.recallBatch.length} tarjetas revisadas. ¡Buen trabajo!`;
    document.getElementById('btn-next-round').textContent = 'Siguiente ronda';
  },

  /* ===========================
     Daily Random Challenge
     =========================== */
  _bindDaily() {
    document.getElementById('btn-daily-shuffle').addEventListener('click', () => this._generateDaily());
    document.getElementById('btn-daily-check').addEventListener('click', () => this._checkDaily());
  },

  _generateDaily() {
    const pools = REPOSITORY.dailyPools;
    const seed = {
      role: pools.roles[Math.floor(Math.random() * pools.roles.length)],
      tech: pools.techEnvironments[Math.floor(Math.random() * pools.techEnvironments.length)],
      stress: pools.stressConstraints[Math.floor(Math.random() * pools.stressConstraints.length)]
    };
    this.state.dailySeed = seed;

    // Animate cards
    ['var-role', 'var-tech', 'var-stress'].forEach((id, i) => {
      const card = document.getElementById(id);
      card.classList.add('rolled');
      setTimeout(() => card.classList.remove('rolled'), 400);
    });

    document.getElementById('var-role').querySelector('.var-value').textContent = seed.role;
    document.getElementById('var-tech').querySelector('.var-value').textContent = seed.tech;
    document.getElementById('var-stress').querySelector('.var-value').textContent = seed.stress;

    // Generate prompt
    const prompts = [
      `You're in a **${seed.role}** situation discussing **${seed.tech}**.\n\nConstraint: *${seed.stress}*.\n\nWrite a short (~40 words) response in English that fits this scenario.`,
      `Context: **${seed.role}** call. Topic: **${seed.tech}**.\n\nRule: *${seed.stress}*.\n\nDraft a professional reply in English.`,
      `Scenario: You're leading a **${seed.role}** session. The focus is **${seed.tech}**.\n\nChallenge: *${seed.stress}*.\n\nRespond in English.`
    ];
    document.getElementById('daily-prompt').innerHTML =
      `<p>${prompts[Math.floor(Math.random() * prompts.length)]}</p>`;

    document.getElementById('daily-response-input').value = '';
    document.getElementById('daily-feedback').classList.add('hidden');
  },

  _checkDaily() {
    const response = document.getElementById('daily-response-input').value.trim();
    const feedback = document.getElementById('daily-feedback');

    if (!response) {
      feedback.classList.remove('hidden');
      feedback.innerHTML = '<p style="color: var(--warning);">⚠️ Escribe algo antes de verificar.</p>';
      return;
    }

    // Simple heuristic feedback
    const words = response.split(/\s+/).length;
    const hasCapitals = /[A-Z]/.test(response);
    const fillerWords = /\b(um|uh|like|you know|basically|actually)\b/gi;
    const fillerCount = (response.match(fillerWords) || []).length;

    let fb = '';
    if (words < 15) {
      fb += '⚠️ Respuesta muy corta. Intenta desarrollar más. ';
    }
    if (fillerCount > 2) {
      fb += '🗑 Detectadas muletillas (um, like, you know). Elimínalas para un inglés más profesional. ';
    }
    if (!hasCapitals) {
      fb += '🔤 ¿Usaste mayúsculas? Recuerda capitalizar nombres propios y el inicio. ';
    }
    if (words >= 15 && fillerCount <= 2) {
      fb += '✅ Buena longitud y pocas muletillas. ¡Sigue así! ';
    }

    fb += `<br><small>📝 Palabras: ${words} | Muletillas: ${fillerCount}</small>`;

    feedback.classList.remove('hidden');
    feedback.innerHTML = `<p style="color: var(--text-primary);">${fb}</p>`;
  },

  /* ===========================
     Shadowing + Speech
     =========================== */
  _bindShadowing() {
    document.getElementById('btn-play-tts').addEventListener('click', () => this._playTTS());
    document.getElementById('btn-record').addEventListener('click', () => this._toggleRecording());
    document.getElementById('btn-next-shadow').addEventListener('click', () => this._nextShadowChunk());
  },

  _nextShadowChunk() {
    const idx = Math.floor(Math.random() * REPOSITORY.chunks.length);
    this.state.shadowChunk = REPOSITORY.chunks[idx];
    this.state.shadowSpoken = '';

    document.getElementById('target-phrase').textContent = this.state.shadowChunk.english;
    document.getElementById('shadowing-result').classList.add('hidden');
    document.getElementById('transcribed-text').textContent = '';
    document.getElementById('error-highlight').innerHTML = '';
    document.getElementById('phonetic-errors').innerHTML = '';
  },

  _playTTS() {
    if (this.state.shadowChunk) {
      SpeechEngine.speak(this.state.shadowChunk.english);
    }
  },

  _toggleRecording() {
    const btn = document.getElementById('btn-record');
    const indicator = document.getElementById('recording-indicator');

    if (SpeechEngine.isRecognizing) {
      SpeechEngine.stopListening();
      btn.classList.remove('recording');
      btn.textContent = '🎤 Grabar';
      indicator.classList.add('hidden');
    } else {
      const started = SpeechEngine.startListening(
        // onResult
        (transcript) => {
          this.state.shadowSpoken = transcript;
          btn.classList.remove('recording');
          btn.textContent = '🎤 Grabar';
          indicator.classList.add('hidden');
          this._showShadowingResult(transcript);
        },
        // onError
        (err) => {
          btn.classList.remove('recording');
          btn.textContent = '🎤 Grabar';
          indicator.classList.add('hidden');
          alert(err);
        }
      );

      if (started) {
        btn.classList.add('recording');
        btn.textContent = '⏹';
        indicator.classList.remove('hidden');
      }
    }
  },

  _showShadowingResult(transcript) {
    const resultEl = document.getElementById('shadowing-result');
    resultEl.classList.remove('hidden');

    document.getElementById('transcribed-text').textContent = transcript;

    if (this.state.shadowChunk) {
      const comparison = SpeechEngine.compare(this.state.shadowChunk.english, transcript);
      document.getElementById('error-highlight').innerHTML =
        SpeechEngine.renderComparisonHTML(comparison.wordResults);

      const phoneticEl = document.getElementById('phonetic-errors');
      if (comparison.phoneticErrors.length > 0) {
        phoneticEl.innerHTML = comparison.phoneticErrors
          .map(e => `<p>🔍 <strong>${e.expected}</strong> → ${e.spoken}<br>${e.issues.join('<br>')}</p>`)
          .join('');
      } else if (comparison.exact) {
        phoneticEl.innerHTML = '<p style="color: var(--success);">✅ Pronunciación exacta. ¡Perfecto!</p>';
      } else {
        phoneticEl.innerHTML = '<p style="color: var(--warning);">⚠️ No se detectaron errores fonéticos típicos, pero la frase no coincide exactamente.</p>';
      }
    }
  },

  /* ===========================
     Stats Dashboard
     =========================== */
  _bindStats() {
    document.getElementById('btn-reset-data').addEventListener('click', () => {
      if (confirm('¿Seguro que quieres borrar todo tu progreso? Esta acción no se puede deshacer.')) {
        localStorage.removeItem(SRS_KEY);
        this.srsState = SRS._initState();
        SRS.save(this.srsState);
        this._renderStats();
        this._updateHeaderStats();
      }
    });
  },

  _renderStats() {
    const stats = SRS.getStats(this.srsState, REPOSITORY.chunks);
    document.getElementById('stat-total').textContent = stats.total;
    document.getElementById('stat-mastered').textContent = stats.mastered;
    document.getElementById('stat-due').textContent = stats.due;
    document.getElementById('stat-streak').textContent = `${stats.streak} días`;

    // Category chart
    const chartEl = document.getElementById('stats-chart');
    chartEl.innerHTML = '';
    for (const [cat, data] of Object.entries(stats.categoryData)) {
      const percent = data.total > 0 ? (data.mastered / data.total) * 100 : 0;
      const col = document.createElement('div');
      col.style.display = 'flex';
      col.style.flexDirection = 'column';
      col.style.alignItems = 'center';
      col.style.flex = '1';
      col.style.minWidth = '40px';

      const bar = document.createElement('div');
      bar.className = 'chart-bar';
      bar.style.height = `${Math.max(4, percent)}%`;

      const label = document.createElement('div');
      label.className = 'chart-bar-label';
      label.textContent = cat.slice(0, 6);

      const pct = document.createElement('div');
      pct.className = 'chart-bar-label';
      pct.textContent = `${Math.round(percent)}%`;

      col.appendChild(bar);
      col.appendChild(label);
      col.appendChild(pct);
      chartEl.appendChild(col);
    }
  },

  /* ===========================
     Header Stats
     =========================== */
  _updateHeaderStats() {
    const stats = SRS.getStats(this.srsState, REPOSITORY.chunks);
    document.getElementById('streak-counter').textContent = `🔥 ${stats.streak}`;
    document.getElementById('review-count').textContent = `📊 ${stats.totalReviews}`;
    this._renderSessionTimer();
  }
};

/* ===========================
   Bootstrap
   =========================== */
document.addEventListener('DOMContentLoaded', () => {
  App.init();
  // Start with a recall round and a shadow chunk
  App._startRecallRound();
  App._nextShadowChunk();
});
