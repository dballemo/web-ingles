/*
 * app.js — State Machine: Gym SRS → Meeting Simulator → Consolidation Lockdown
 *
 * Phase timing:
 *   0-10 min  → Phase 1: SRS Gym (single large card + speech validation)
 *   10-25 min → Phase 2: Meeting Simulator (email threads + mandatory chunks)
 *   25-30 min → Phase 3: Consolidation Lockdown (forced rest, all inputs disabled)
 *   After 30 min → Reset to Phase 1
 */

const App = {
  srsState: null,

  state: {
    phase: 'gym',
    sessionStart: null,
    sessionSeconds: 0,
    sessionTimerId: null,
    recallBatch: [],
    recallIndex: 0,
    recallAnswered: false,
    recallRingInterval: null,
    roundComplete: false,
    dailyChunks: [],
    currentThread: null,
  },

  /* ======================== INIT ======================== */
  init() {
    this.srsState = SRS.load();
    this.state.sessionStart = Date.now();
    this._startSessionTimer();
    this._assignDailyChunks();
    this._bindUI();
    this._startRecallRound();
    this._updatePhaseBar();
    this._updateHeaderStats();
  },

  /* ======================== SESSION TIMER ======================== */
  _startSessionTimer() {
    this.state.sessionTimerId = setInterval(() => {
      this.state.sessionSeconds = Math.floor((Date.now() - this.state.sessionStart) / 1000);
      this._renderSessionTimer();
      this._checkPhaseTransition();
    }, 1000);
  },

  _renderSessionTimer() {
    const el = document.getElementById('session-timer');
    if (!el) return;
    const m = Math.floor(this.state.sessionSeconds / 60);
    const s = this.state.sessionSeconds % 60;
    el.textContent = `⏱ ${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  },

  _checkPhaseTransition() {
    const t = this.state.sessionSeconds;

    if (t >= 30 * 60) {
      this.state.sessionStart = Date.now();
      this.state.sessionSeconds = 0;
      this.state.roundComplete = false;
      this._transitionTo('gym');
      this._startRecallRound();
      return;
    }

    if (t >= 25 * 60 && this.state.phase !== 'lockdown') {
      this._transitionTo('lockdown');
    } else if (t >= 10 * 60 && t < 25 * 60 && this.state.phase !== 'simulator') {
      this._transitionTo('simulator');
    }
  },

  _transitionTo(phase) {
    if (this.state.phase === phase && phase !== 'gym') return;
    this.state.phase = phase;

    document.querySelectorAll('.phase-container').forEach(c => c.classList.remove('active'));

    if (phase === 'gym') {
      document.getElementById('phase-gym').classList.add('active');
    } else if (phase === 'simulator') {
      document.getElementById('phase-simulator').classList.add('active');
      this._loadMeetingThread();
    } else if (phase === 'lockdown') {
      this._enterLockdown();
    }

    this._updatePhaseBar();
    SpeechEngine.stopListening();
    clearInterval(this.state.recallRingInterval);
  },

  _updatePhaseBar() {
    const segs = {
      gym: document.getElementById('phase-seg-1'),
      simulator: document.getElementById('phase-seg-2'),
      lockdown: document.getElementById('phase-seg-3')
    };
    Object.values(segs).forEach(s => s.classList.remove('active', 'done'));

    const order = ['gym', 'simulator', 'lockdown'];
    const idx = order.indexOf(this.state.phase);
    order.forEach((ph, i) => {
      if (i < idx) segs[ph].classList.add('done');
      else if (i === idx) segs[ph].classList.add('active');
    });
  },

  /* ======================== UI BINDINGS ======================== */
  _bindUI() {
    document.getElementById('btn-trigger').addEventListener('click', () => this._revealAnswer());
    document.querySelectorAll('.self-eval button').forEach(btn => {
      btn.addEventListener('click', () => this._evaluateRecall(btn.dataset.rating));
    });
    document.getElementById('btn-record-gym').addEventListener('click', () => this._toggleGymRecording());
    document.getElementById('btn-sim-check').addEventListener('click', () => this._checkSimResponse());
    document.getElementById('btn-sim-new').addEventListener('click', () => this._loadMeetingThread());
    document.getElementById('btn-stats-overlay').addEventListener('click', () => this._toggleStats());
    document.getElementById('btn-close-stats').addEventListener('click', () => this._toggleStats());
    document.getElementById('btn-reset-data').addEventListener('click', () => this._resetData());
  },

  /* ======================== PHASE 1: SRS GYM ======================== */
  _startRecallRound() {
    if (this.state.phase !== 'gym') return;
    this.state.recallBatch = SRS.pickSessionBatch(this.srsState, REPOSITORY.chunks, 10);
    this.state.recallIndex = 0;
    this.state.recallAnswered = false;
    this.state.roundComplete = false;

    document.getElementById('gym-done').classList.add('hidden');
    document.getElementById('gym-card').classList.remove('hidden');

    if (this.state.recallBatch.length === 0) {
      this.state.roundComplete = true;
      document.getElementById('gym-card').classList.add('hidden');
      document.getElementById('gym-done').classList.remove('hidden');
      document.getElementById('gym-summary').textContent = '¡No hay tarjetas pendientes! Descansa o espera al simulador.';
    } else {
      this._showGymCard();
    }
  },

  _showGymCard() {
    const item = this.state.recallBatch[this.state.recallIndex];
    document.getElementById('gym-spanish').textContent = item.chunk.spanish;
    document.getElementById('gym-english').textContent = item.chunk.english;
    document.getElementById('gym-phoneme').textContent =
      item.chunk.critical_phoneme ? `🔊 Enfócate en: ${item.chunk.critical_phoneme}` : '';

    document.getElementById('btn-trigger').disabled = false;
    document.getElementById('gym-back').classList.add('hidden');
    document.getElementById('gym-front').classList.remove('hidden');
    document.getElementById('gym-speech-result').classList.add('hidden');
    document.getElementById('gym-rec-indicator').classList.add('hidden');
    document.getElementById('btn-record-gym').classList.remove('recording');
    document.getElementById('btn-record-gym').textContent = '🎤 Validar pronunciación';
    SpeechEngine.stopListening();

    this._startRecallRing();
  },

  _startRecallRing() {
    this.state.recallAnswered = false;
    const ring = document.getElementById('ring-progress');
    const countdown = document.getElementById('ring-countdown');
    const circumference = 326.73;

    ring.style.strokeDashoffset = '0';
    ring.classList.remove('warning', 'danger');
    countdown.textContent = '3';

    let elapsed = 0;
    clearInterval(this.state.recallRingInterval);
    this.state.recallRingInterval = setInterval(() => {
      elapsed += 100;
      const remaining = Math.max(0, 3000 - elapsed);
      ring.style.strokeDashoffset = circumference * (1 - remaining / 3000);
      const sec = Math.ceil(remaining / 1000);
      countdown.textContent = sec;
      if (remaining <= 1000) ring.classList.add('warning');
      if (remaining <= 500) ring.classList.add('danger');
      if (remaining <= 0) { clearInterval(this.state.recallRingInterval); this._revealAnswer(); }
    }, 100);
  },

  _revealAnswer() {
    if (this.state.recallAnswered) return;
    this.state.recallAnswered = true;
    clearInterval(this.state.recallRingInterval);
    document.getElementById('btn-trigger').disabled = true;
    document.getElementById('gym-back').classList.remove('hidden');
  },

  _evaluateRecall(rating) {
    if (!this.state.recallAnswered) return;
    const item = this.state.recallBatch[this.state.recallIndex];
    const updatedCard = SRS.updateCard(item.card, rating);
    this.srsState.cards[item.chunk.id] = updatedCard;
    this.srsState.totalReviews += 1;
    SRS.updateStreak(this.srsState);
    SRS.save(this.srsState);
    this._updateHeaderStats();

    this.state.recallIndex++;
    if (this.state.recallIndex >= this.state.recallBatch.length) {
      this.state.roundComplete = true;
      document.getElementById('gym-card').classList.add('hidden');
      document.getElementById('gym-done').classList.remove('hidden');
      document.getElementById('gym-summary').textContent = `${this.state.recallBatch.length} tarjetas revisadas. ✅`;
    } else {
      this._showGymCard();
    }
  },

  /* --- Speech validation in Gym card --- */
  _toggleGymRecording() {
    const btn = document.getElementById('btn-record-gym');
    const indicator = document.getElementById('gym-rec-indicator');

    if (SpeechEngine.isRecognizing) {
      SpeechEngine.stopListening();
      btn.classList.remove('recording');
      btn.textContent = '🎤 Validar pronunciación';
      indicator.classList.add('hidden');
    } else {
      const started = SpeechEngine.startListening(
        (transcript) => {
          btn.classList.remove('recording');
          btn.textContent = '🎤 Validar pronunciación';
          indicator.classList.add('hidden');
          this._showGymSpeechResult(transcript);
        },
        (err) => {
          btn.classList.remove('recording');
          btn.textContent = '🎤 Validar pronunciación';
          indicator.classList.add('hidden');
          alert(err);
        }
      );
      if (started) {
        btn.classList.add('recording');
        btn.textContent = '⏹ Grabando';
        indicator.classList.remove('hidden');
      }
    }
  },

  _showGymSpeechResult(transcript) {
    const resultEl = document.getElementById('gym-speech-result');
    resultEl.classList.remove('hidden');
    document.getElementById('gym-transcribed').textContent = transcript;

    if (this.state.recallBatch[this.state.recallIndex]) {
      const expected = this.state.recallBatch[this.state.recallIndex].chunk.english;
      const comparison = SpeechEngine.compare(expected, transcript);
      document.getElementById('gym-error-highlight').innerHTML =
        SpeechEngine.renderComparisonHTML(comparison.wordResults);

      const phoneticEl = document.getElementById('gym-phonetic-errors');
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

  /* ======================== DAILY CHUNKS ======================== */
  _assignDailyChunks() {
    const today = new Date().toISOString().slice(0, 10);
    const stored = localStorage.getItem('web-ingles-daily');
    if (stored) {
      const data = JSON.parse(stored);
      if (data.date === today) { this.state.dailyChunks = data.chunks; return; }
    }
    const shuffled = [...REPOSITORY.chunks].sort(() => Math.random() - 0.5);
    this.state.dailyChunks = shuffled.slice(0, 3);
    localStorage.setItem('web-ingles-daily', JSON.stringify({ date: today, chunks: this.state.dailyChunks }));
  },

  /* ======================== PHASE 2: MEETING SIMULATOR ======================== */
  _loadMeetingThread() {
    const templates = REPOSITORY.meetingTemplates;
    const template = templates[Math.floor(Math.random() * templates.length)];
    this.state.currentThread = template;

    const threadEl = document.getElementById('sim-thread');
    threadEl.innerHTML = '';

    template.thread.forEach(msg => {
      const div = document.createElement('div');
      div.className = msg.body_hint ? 'sim-message hint' : 'sim-message';
      const fromEl = document.createElement('div');
      fromEl.className = 'from';
      fromEl.textContent = msg.from;
      const bodyEl = document.createElement('div');
      bodyEl.className = 'body';
      bodyEl.innerHTML = msg.body_hint ? `<em>${msg.body_hint}</em>` : msg.body;
      div.appendChild(fromEl);
      div.appendChild(bodyEl);
      threadEl.appendChild(div);
    });

    this._renderDailyChunks();
    document.getElementById('sim-response-input').value = '';
    document.getElementById('sim-feedback').classList.add('hidden');
  },

  _renderDailyChunks() {
    const listEl = document.getElementById('sim-chunk-list');
    listEl.innerHTML = '';
    this.state.dailyChunks.forEach(chunk => {
      const badge = document.createElement('span');
      badge.className = 'sim-chunk-badge';
      badge.textContent = chunk.english.slice(0, 60) + '\u2026';
      badge.title = chunk.english;
      badge.addEventListener('click', () => badge.classList.toggle('used'));
      listEl.appendChild(badge);
    });
  },

  _checkSimResponse() {
    const response = document.getElementById('sim-response-input').value.trim();
    const feedback = document.getElementById('sim-feedback');
    feedback.classList.remove('hidden');

    if (!response) {
      feedback.innerHTML = '<p style="color: var(--warning);">⚠️ Escribe una respuesta antes de verificar.</p>';
      return;
    }

    const words = response.split(/\s+/).length;
    const responseLower = response.toLowerCase();

    // Check daily chunks usage
    const usedChunks = [];
    const unusedChunks = [];
    this.state.dailyChunks.forEach(chunk => {
      const chunkWords = chunk.english.toLowerCase().split(/\s+/);
      let found = false;
      for (let i = 0; i <= chunkWords.length - 3; i++) {
        if (responseLower.includes(chunkWords.slice(i, i + 3).join(' '))) { found = true; break; }
      }
      if (found) usedChunks.push(chunk);
      else unusedChunks.push(chunk);
    });

    // Update badges
    document.querySelectorAll('.sim-chunk-badge').forEach(badge => {
      const wasUsed = usedChunks.some(c => badge.title.includes(c.english.slice(0, 40)));
      if (wasUsed) badge.classList.add('used');
      else badge.classList.remove('used');
    });

    const fillerWords = /\b(um|uh|like|you know|basically|actually)\b/gi;
    const fillerCount = (response.match(fillerWords) || []).length;

    let fb = '';
    fb += usedChunks.length === 3
      ? '<p style="color: var(--success);"><strong>✅ ¡Has usado los 3 chunks!</strong></p>'
      : `<p style="color: var(--warning);"><strong>⚠️ Has usado ${usedChunks.length}/3 chunks.</strong></p>`;

    if (unusedChunks.length > 0) {
      fb += '<p style="color: var(--warning);">Chunks no detectados:</p><ul>';
      unusedChunks.forEach(c => {
        fb += `<li style="color: var(--text-secondary); font-size: 0.85rem;">"${c.english.slice(0, 80)}"</li>`;
      });
      fb += '</ul>';
    }

    if (words < 25) fb += '<p style="color: var(--warning);">⚠️ Respuesta corta. Desarrolla más el contexto técnico.</p>';
    if (fillerCount > 2) fb += '<p style="color: var(--warning);">🗑 Detectadas muletillas (um, like). Elimínalas.</p>';
    if (words >= 25 && fillerCount <= 2 && usedChunks.length === 3)
      fb += '<p style="color: var(--success);">✅ Excelente respuesta. Contexto técnico sólido y los 3 chunks integrados.</p>';

    fb += `<p style="font-size: 0.8rem; color: var(--text-muted);">📝 ${words} palabras | Muletillas: ${fillerCount} | Chunks: ${usedChunks.length}/3</p>`;
    feedback.innerHTML = fb;
  },

  /* ======================== PHASE 3: LOCKDOWN ======================== */
  _enterLockdown() {
    document.getElementById('phase-lockdown').classList.remove('hidden');
    document.getElementById('phase-gym').classList.remove('active');
    document.getElementById('phase-simulator').classList.remove('active');

    const audio = document.getElementById('nsdr-audio');
    if (audio && audio.querySelector('source').src) {
      audio.volume = 0.3;
      audio.play().catch(() => {});
    }

    this._startLockdownCountdown(5 * 60);
  },

  _startLockdownCountdown(totalSeconds) {
    let remaining = totalSeconds;
    const timerEl = document.getElementById('lockdown-timer');
    const circleEl = document.getElementById('breathing-circle');
    const labelEl = document.getElementById('breathing-label');
    let breathPhase = 0, phaseTime = 0;

    const tick = () => {
      if (remaining <= 0) {
        document.getElementById('phase-lockdown').classList.add('hidden');
        const audio = document.getElementById('nsdr-audio');
        if (audio) audio.pause();
        this.state.sessionStart = Date.now();
        this.state.sessionSeconds = 0;
        this.state.phase = 'gym';
        this.state.roundComplete = false;
        this._transitionTo('gym');
        this._startRecallRound();
        return;
      }

      const m = Math.floor(remaining / 60);
      const s = remaining % 60;
      timerEl.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

      // Box breathing: 4s inhale, 4s hold, 4s exhale, 4s hold
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

  /* ======================== STATS ======================== */
  _toggleStats() {
    document.getElementById('stats-overlay').classList.toggle('hidden');
    if (!document.getElementById('stats-overlay').classList.contains('hidden')) {
      this._renderStats();
    }
  },

  _renderStats() {
    const stats = SRS.getStats(this.srsState, REPOSITORY.chunks);
    document.getElementById('stat-total').textContent = stats.total;
    document.getElementById('stat-mastered').textContent = stats.mastered;
    document.getElementById('stat-due').textContent = stats.due;
    document.getElementById('stat-streak').textContent = `${stats.streak} días`;

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
      label.textContent = cat.replace('_', ' ').slice(0, 8);

      const pct = document.createElement('div');
      pct.className = 'chart-bar-label';
      pct.textContent = `${Math.round(percent)}%`;

      col.appendChild(bar);
      col.appendChild(label);
      col.appendChild(pct);
      chartEl.appendChild(col);
    }
  },

  _resetData() {
    if (confirm('¿Seguro que quieres borrar todo tu progreso? Esta acción no se puede deshacer.')) {
      localStorage.removeItem('web-ingles-srs');
      localStorage.removeItem('web-ingles-daily');
      this.srsState = SRS._initState();
      SRS.save(this.srsState);
      this._renderStats();
      this._updateHeaderStats();
      this._startRecallRound();
    }
  },

  /* ======================== HEADER ======================== */
  _updateHeaderStats() {
    const stats = SRS.getStats(this.srsState, REPOSITORY.chunks);
    document.getElementById('streak-counter').textContent = `🔥 ${stats.streak}`;
    document.getElementById('review-count').textContent = `📊 ${stats.totalReviews}`;
    this._renderSessionTimer();
  }
};

/* ======================== BOOTSTRAP ======================== */
document.addEventListener('DOMContentLoaded', () => App.init());
