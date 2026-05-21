/*
 * srsEngine.js — SM-2 Simplified Spaced Repetition Algorithm
 *
 * Based on Piotr Wozniak's SM-2 algorithm:
 *   EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
 *   I(1) = 1, I(2) = 6
 *   I(n) = I(n-1) * EF
 *
 * State persisted in localStorage under key 'web-ingles-srs'.
 */

const SRS_KEY = 'web-ingles-srs';

const SRS = {
  /*
   * State shape:
   * {
   *   cards: {
   *     [chunkId]: { ef: 2.5, interval: 0, n: 0, dueDate: null, lastReview: null }
   *   },
   *   streak: 0,
   *   lastActiveDate: null,
   *   totalReviews: 0
   * }
   */

  /** Load state from localStorage or initialize fresh */
  load() {
    try {
      const raw = localStorage.getItem(SRS_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* corrupted */ }
    return this._initState();
  },

  _initState() {
    return {
      cards: {},
      streak: 0,
      lastActiveDate: null,
      totalReviews: 0
    };
  },

  save(state) {
    localStorage.setItem(SRS_KEY, JSON.stringify(state));
  },

  /** Ensure a card exists in state for a given chunk */
  initCard(state, chunkId) {
    if (!state.cards[chunkId]) {
      state.cards[chunkId] = {
        ef: 2.5,
        interval: 0,
        n: 0,
        dueDate: null,
        lastReview: null
      };
    }
    return state.cards[chunkId];
  },

  /**
   * Apply SM-2 update based on quality rating:
   *   'easy'   → q=5 (perfect response)
   *   'hard'   → q=3 (correct with hesitation)
   *   'forgot'  → q=1 (complete blackout)
   */
  updateCard(card, rating) {
    const qMap = { easy: 5, hard: 3, forgot: 1 };
    const q = qMap[rating] || 3;

    if (q < 3) {
      // Reset if forgotten
      card.n = 0;
      card.interval = 0;
    } else {
      // Calculate new EF
      const newEF = card.ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
      card.ef = Math.max(1.3, newEF);

      // Calculate new interval
      if (card.n === 0) {
        card.interval = 1;
      } else if (card.n === 1) {
        card.interval = 6;
      } else {
        card.interval = Math.round(card.interval * card.ef);
      }
      card.n += 1;
    }

    // Cap interval at 365 days
    card.interval = Math.min(card.interval, 365);

    // Set next due date
    const now = new Date();
    card.lastReview = now.toISOString();
    const due = new Date(now.getTime() + card.interval * 24 * 60 * 60 * 1000);
    card.dueDate = due.toISOString();

    return card;
  },

  /**
   * Get cards due for review today.
   * New cards (interval=0, never reviewed) are always due.
   */
  getDueCards(state, chunks) {
    const now = Date.now();
    const due = [];

    for (const chunk of chunks) {
      const card = this.initCard(state, chunk.id);

      // New card or due
      if (!card.dueDate || new Date(card.dueDate).getTime() <= now) {
        due.push({ chunk, card });
      }
    }
    return due;
  },

  /** Update daily streak */
  updateStreak(state) {
    const today = new Date().toISOString().slice(0, 10);
    if (state.lastActiveDate === today) return;

    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (state.lastActiveDate === yesterday) {
      state.streak += 1;
    } else {
      state.streak = 1;
    }
    state.lastActiveDate = today;
  },

  /**
   * Select a batch of cards for a review session.
   * Mixes new + due cards, up to `batchSize`.
   */
  pickSessionBatch(state, chunks, batchSize = 10) {
    const due = this.getDueCards(state, chunks);

    // Shuffle to mix new + review
    for (let i = due.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [due[i], due[j]] = [due[j], due[i]];
    }

    return due.slice(0, batchSize);
  },

  /** Get stats for the stats view */
  getStats(state, chunks) {
    const total = chunks.length;
    let mastered = 0;
    let dueCount = 0;
    const now = Date.now();

    for (const chunk of chunks) {
      const card = state.cards[chunk.id];
      if (card && card.n >= 3 && card.ef >= 2.3) mastered++;
      if (!card || !card.dueDate || new Date(card.dueDate).getTime() <= now) dueCount++;
    }

    // Build per-category mastery data
    const categoryData = {};
    for (const chunk of chunks) {
      const cat = chunk.category;
      if (!categoryData[cat]) categoryData[cat] = { total: 0, mastered: 0 };
      categoryData[cat].total++;
      const card = state.cards[chunk.id];
      if (card && card.n >= 3 && card.ef >= 2.3) categoryData[cat].mastered++;
    }

    return {
      total,
      mastered,
      due: dueCount,
      streak: state.streak,
      totalReviews: state.totalReviews,
      categoryData
    };
  }
};
