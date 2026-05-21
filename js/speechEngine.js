/*
 * speechEngine.js — Speech Synthesis + Recognition via Web Speech API
 *
 * Features:
 *   - TTS (speechSynthesis) to play native English audio
 *   - STT (webkitSpeechRecognition / SpeechRecognition) for user recording
 *   - Phonetic error detection targeting common Spanish-speaker mistakes
 */

const SpeechEngine = {
  recognition: null,
  isRecognizing: false,
  _onResult: null,
  _onError: null,

  /**
   * Speak a phrase using the browser's TTS engine.
   * Attempts to select a native English voice.
   */
  speak(phrase) {
    return new Promise((resolve) => {
      if (!window.speechSynthesis) {
        console.warn('speechSynthesis not available');
        return resolve();
      }

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1.0;

      // Try to pick a native English voice
      const voices = window.speechSynthesis.getVoices();
      const englishVoice =
        voices.find(v => v.lang === 'en-US' && v.name.includes('Google')) ||
        voices.find(v => v.lang === 'en-US') ||
        voices.find(v => v.lang.startsWith('en-')) ||
        voices[0];

      if (englishVoice) utterance.voice = englishVoice;

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);
    });
  },

  /**
   * Start speech recognition.
   * Calls onResult(transcript) when speech is captured.
   * Calls onError(err) on failure.
   */
  startListening(onResult, onError) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      onError('Speech Recognition no está disponible en este navegador.');
      return false;
    }

    if (this.isRecognizing) this.stopListening();

    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'en-US';
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;
    this.recognition.continuous = false;

    this._onResult = onResult;
    this._onError = onError;

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      this.isRecognizing = false;
      if (this._onResult) this._onResult(transcript);
    };

    this.recognition.onerror = (event) => {
      this.isRecognizing = false;
      if (this._onError) this._onError(`Error: ${event.error}`);
    };

    this.recognition.onend = () => {
      this.isRecognizing = false;
    };

    this.recognition.start();
    this.isRecognizing = true;
    return true;
  },

  stopListening() {
    if (this.recognition) {
      try { this.recognition.stop(); } catch (e) { /* ok */ }
    }
    this.isRecognizing = false;
  },

  /**
   * Compare expected vs spoken text.
   * Returns { exact, words, phoneticErrors[] }
   *
   * Phonetic errors focus on common Spanish-speaker issues:
   *   - Adding 'e' before s+consonant (e.g., "espeak" for "speak")
   *   - Substituting 'b' for 'v' or vice versa
   *   - Dropping final consonants
   */
  compare(expected, spoken) {
    const expectedLower = expected.toLowerCase().trim();
    const spokenLower = spoken.toLowerCase().trim();

    const expectedWords = expectedLower.split(/\s+/);
    const spokenWords = spokenLower.split(/\s+/);

    const phoneticErrors = [];

    // Word-by-word alignment
    const maxLen = Math.max(expectedWords.length, spokenWords.length);
    const wordResults = [];

    for (let i = 0; i < maxLen; i++) {
      const exp = expectedWords[i] || '';
      const spk = spokenWords[i] || '';

      if (exp.toLowerCase() === spk.toLowerCase()) {
        wordResults.push({ word: exp, status: 'correct' });
      } else if (!exp) {
        wordResults.push({ word: spk, status: 'extra' });
      } else if (!spk) {
        wordResults.push({ word: exp, status: 'missing' });
      } else {
        wordResults.push({ word: exp, status: 'incorrect' });

        // Detect specific phonetic issues
        const issues = this._detectPhoneticIssues(exp, spk);
        if (issues.length > 0) {
          phoneticErrors.push({ expected: exp, spoken: spk, issues });
        }
      }
    }

    const exact = expectedLower === spokenLower;

    return { exact, wordResults, phoneticErrors };
  },

  /**
   * Detect common Spanish-speaker phonetic mistakes.
   */
  _detectPhoneticIssues(expected, spoken) {
    const issues = [];
    const exp = expected.toLowerCase();
    const spk = spoken.toLowerCase();

    // 1. Prothetic 'e' before s+consonant (classic: "espeak" for "speak")
    if (/^s[^aeiou]/i.test(exp) && /^es/i.test(spk) && spk.slice(1) === exp) {
      issues.push('⚠️ "E" protética añadida (típico de hispanohablantes). Prueba empezar directamente con "s".');
    }
    // Also check for 'es' prefixed words where expected starts with s+consonant
    if (/^s[^aeiou]/i.test(exp) && /^es/.test(spk)) {
      if (!issues.some(i => i.includes('protética'))) {
        issues.push('⚠️ Posible "E" inicial añadida ante "s+consonante" (ej. "Specification" → no "Especification").');
      }
    }

    // 2. V/B confusion
    const expHasB = /b/i.test(exp) && !/v/i.test(exp);
    const expHasV = /v/i.test(exp) && !/b/i.test(exp);
    if (expHasB && /v/i.test(spk)) {
      issues.push('🔤 Confusión B/V: dijiste "v" donde debería ir "b". En inglés B y V son sonidos distintos.');
    }
    if (expHasV && /b/i.test(spk)) {
      issues.push('🔤 Confusión V/B: dijiste "b" donde debería ir "v". En inglés, la V requiere labio inferior contra dientes.');
    }

    // 3. Dropped final consonants (-t, -d, -k, -p)
    if (exp.length > 2 && /[tdkp]$/i.test(exp) && !/[tdkp]$/i.test(spk)) {
      const last = exp[exp.length - 1];
      issues.push(`🔇 Consonante final "${last}" omitida. En inglés las consonantes finales son importantes para el significado.`);
    }

    // 4. Adding -e at end of words ending in consonant
    if (/[^aeiou]$/i.test(exp) && /[e]$/i.test(spk) && spk.length === exp.length + 1) {
      issues.push('🔤 "E" final añadida. Evita añadir una vocal al final de palabras inglesas terminadas en consonante.');
    }

    // 5. SH vs S
    if (/sh/i.test(exp) && !/sh/i.test(spk) && /s/i.test(spk)) {
      issues.push('🔤 "SH" pronunciado como "S". El sonido "sh" (como en "she") es diferente del sonido "s".');
    }

    // 6. H not pronounced (silent h vs aspirated h)
    if (/^h/.test(exp) && !/^h/.test(spk) && exp.slice(1) === spk) {
      issues.push('🔤 "H" inicial omitida. En palabras como "handle" o "hit", la H se aspira en inglés.');
    }

    return issues;
  },

  /**
   * Render word-by-word comparison as HTML with color highlighting.
   */
  renderComparisonHTML(wordResults) {
    return wordResults.map(w => {
      let cls = '';
      if (w.status === 'correct') cls = 'correct';
      else if (w.status === 'incorrect' || w.status === 'missing') cls = 'incorrect';
      else if (w.status === 'extra') cls = 'incorrect';
      return `<span class="${cls}">${this._escapeHTML(w.word)}</span>`;
    }).join(' ');
  },

  _escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
};
