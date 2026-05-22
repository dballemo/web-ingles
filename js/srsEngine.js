/*
 * srsEngine.js — Adaptive SRS with 1-10 Star Rating & Level Progression
 *
 * Rating scale (1-10):
 *   1-2  = Complete blackout / Forgot → Reset interval, decrease EF significantly
 *   3-4  = Barely remembered, very hard → Small interval, decrease EF
 *   5-6  = Hard, with hesitation → Moderate interval, maintain/slight adjust EF
 *   7-8  = Good, minor hesitation → Normal SM-2 progression
 *   9-10 = Perfect, effortless → Accelerated progression, EF bonus
 *
 * Adaptive Difficulty:
 *   - User starts at Level 1
 *   - Track rolling average of last 10 ratings
 *   - If avg >= 8.0 for 10+ reviews → unlock next level
 *   - If avg <= 5.0 for 10+ reviews → suggest lowering level
 *   - Cards are filtered by user's current max unlocked level
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
   *   totalReviews: 0,
   *   userLevel: 1,           // current active level (1-4)
   *   maxUnlockedLevel: 1,    // highest level unlocked
   *   ratingHistory: [],      // last 20 ratings for adaptive calc
   *   levelStats: {            // per-level mastery tracking
   *     1: { total: 0, mastered: 0, avgRating: 0 },
   *     2: { total: 0, mastered: 0, avgRating: 0 },
   *     3: { total: 0, mastered: 0, avgRating: 0 },
   *     4: { total: 0, mastered: 0, avgRating: 0 }
   *   },
   *   adaptiveMessage: null   // last adaptive suggestion
   * }
   */

  /** Load state from localStorage or initialize fresh */
  load() {
    try {
      const raw = localStorage.getItem(SRS_KEY);
      if (raw) {
        const state = JSON.parse(raw);
        // Ensure new fields exist in legacy states
        if (state.userLevel === undefined) state.userLevel = 1;
        if (state.maxUnlockedLevel === undefined) state.maxUnlockedLevel = 1;
        if (state.ratingHistory === undefined) state.ratingHistory = [];
        if (state.levelStats === undefined) {
          state.levelStats = { 1: { total: 0, mastered: 0, avgRating: 0 },
                               2: { total: 0, mastered: 0, avgRating: 0 },
                               3: { total: 0, mastered: 0, avgRating: 0 },
                               4: { total: 0, mastered: 0, avgRating: 0 } };
        }
        if (state.adaptiveMessage === undefined) state.adaptiveMessage = null;
        return state;
      }
    } catch (e) { /* corrupted */ }
    return this._initState();
  },

  _initState() {
    return {
      cards: {},
      streak: 0,
      lastActiveDate: null,
      totalReviews: 0,
      userLevel: 1,
      maxUnlockedLevel: 1,
      ratingHistory: [],
      levelStats: {
        1: { total: 0, mastered: 0, avgRating: 0 },
        2: { total: 0, mastered: 0, avgRating: 0 },
        3: { total: 0, mastered: 0, avgRating: 0 },
        4: { total: 0, mastered: 0, avgRating: 0 }
      },
      adaptiveMessage: null
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
   * Convert 1-10 rating to SM-2 quality (0-5) and update card.
   * 
   * 1-2 → q=0-1 (forgotten)
   * 3-4 → q=2 (barely)
   * 5-6 → q=3 (hard)
   * 7-8 → q=4 (good)
   * 9-10 → q=5 (perfect)
   */
  _starsToQuality(stars) {
    if (stars <= 2) return Math.max(0, stars - 1); // 1→0, 2→1
    if (stars <= 4) return stars - 1;               // 3→2, 4→3
    if (stars <= 6) return 3;
    if (stars <= 8) return 4;
    return 5; // 9-10
  },

  /**
   * Update card based on 1-10 star rating.
   * Returns { card, adaptiveResult } where adaptiveResult contains:
   *   - levelUp: boolean
   *   - levelDown: boolean  
   *   - newLevel: number
   *   - message: string
   */
  updateCard(card, stars, state) {
    const q = this._starsToQuality(stars);
    
    // Update rating history
    state.ratingHistory.push({ stars, timestamp: Date.now() });
    if (state.ratingHistory.length > 20) state.ratingHistory.shift();

    if (q < 3) {
      // Forgotten or barely remembered — reset
      card.n = 0;
      card.interval = 0;
      // Decrease EF more aggressively for lower scores
      const efPenalty = stars <= 2 ? 0.3 : 0.15;
      card.ef = Math.max(1.3, card.ef - efPenalty);
    } else {
      // Calculate new EF with adjusted formula
      const baseEF = card.ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
      
      // Bonus for perfect scores, penalty for marginal passes
      let efBonus = 0;
      if (stars >= 9) efBonus = 0.1;
      else if (stars >= 7) efBonus = 0.0;
      else if (stars >= 5) efBonus = -0.05;
      
      card.ef = Math.max(1.3, baseEF + efBonus);

      // Calculate interval
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

    // Check adaptive difficulty
    const adaptiveResult = this._checkAdaptiveDifficulty(state);
    state.adaptiveMessage = adaptiveResult.message;

    return { card, adaptiveResult };
  },

  /** Check if user should level up or down based on recent performance */
  _checkAdaptiveDifficulty(state) {
    const history = state.ratingHistory;
    if (history.length < 7) {
      return { levelUp: false, levelDown: false, newLevel: state.userLevel, message: null };
    }

    // Use last 10 ratings (or all if fewer)
    const recent = history.slice(-10);
    const avg = recent.reduce((sum, r) => sum + r.stars, 0) / recent.length;
    
    const result = { levelUp: false, levelDown: false, newLevel: state.userLevel, message: null };

    // Level up: avg >= 8.0, at least 10 reviews, and not already at max
    if (avg >= 8.0 && state.userLevel < 4 && history.length >= 10) {
      const newLevel = state.userLevel + 1;
      state.userLevel = newLevel;
      if (newLevel > state.maxUnlockedLevel) {
        state.maxUnlockedLevel = newLevel;
      }
      result.levelUp = true;
      result.newLevel = newLevel;
      result.message = `🎉 ¡Subes de nivel! Ahora eres Nivel ${newLevel}. Las frases serán más desafiantes.`;
    }
    // Level down suggestion: avg <= 5.0 for last 10, and not at level 1
    else if (avg <= 5.0 && state.userLevel > 1 && history.length >= 10) {
      const newLevel = Math.max(1, state.userLevel - 1);
      state.userLevel = newLevel;
      result.levelDown = true;
      result.newLevel = newLevel;
      result.message = `📉 Bajando a Nivel ${newLevel} para reforzar bases. ¡No pasa nada, es parte del proceso!`;
    }
    // Near threshold messages
    else if (avg >= 7.5 && state.userLevel < 4 && history.length >= 7) {
      result.message = `💪 Vas muy bien (${avg.toFixed(1)}/10). ¡Sigue así para subir de nivel!`;
    }
    else if (avg <= 5.5 && state.userLevel > 1 && history.length >= 7) {
      result.message = `🌱 Repasar las bases ayuda. Estoy aquí para apoyarte.`;
    }

    return result;
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
   * Get cards due for review, filtered by user's current level.
   * Only shows cards at or below current userLevel.
   */
  getDueCards(state, chunks) {
    const now = Date.now();
    const due = [];

    for (const chunk of chunks) {
      // Skip chunks above user's current level
      if (chunk.difficulty > state.userLevel) continue;

      const card = this.initCard(state, chunk.id);

      // New card or due
      if (!card.dueDate || new Date(card.dueDate).getTime() <= now) {
        due.push({ chunk, card });
      }
    }
    return due;
  },

  /**
   * Select a batch of cards for a review session.
   * Mixes new + due cards, up to `batchSize`.
   * Prefers cards at user's current level but includes some from lower levels for review.
   */
  pickSessionBatch(state, chunks, batchSize = 10) {
    // Get due cards filtered by level
    let due = this.getDueCards(state, chunks);
    
    // If very few cards at current level, include some from lower levels
    const currentLevelDue = due.filter(d => d.chunk.difficulty === state.userLevel);
    const lowerLevelDue = due.filter(d => d.chunk.difficulty < state.userLevel);
    
    // Mix: 70% current level, 30% lower levels (for retention)
    const targetCurrent = Math.ceil(batchSize * 0.7);
    const targetLower = batchSize - targetCurrent;
    
    let selected = [];
    
    // Add current level cards (shuffled)
    const shuffledCurrent = this._shuffle([...currentLevelDue]);
    selected = selected.concat(shuffledCurrent.slice(0, targetCurrent));
    
    // Add lower level review cards
    const shuffledLower = this._shuffle([...lowerLevelDue]);
    const remaining = batchSize - selected.length;
    selected = selected.concat(shuffledLower.slice(0, remaining));
    
    // If still not enough, add more from current level
    if (selected.length < batchSize) {
      const moreCurrent = shuffledCurrent.slice(targetCurrent);
      selected = selected.concat(moreCurrent.slice(0, batchSize - selected.length));
    }
    
    // Final shuffle so order is random
    return this._shuffle(selected).slice(0, batchSize);
  },

  _shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  },

  /** Set user level manually */
  setUserLevel(state, level) {
    state.userLevel = Math.max(1, Math.min(4, level));
    if (state.userLevel > state.maxUnlockedLevel) {
      state.maxUnlockedLevel = state.userLevel;
    }
  },

  /** Get current level info */
  getLevelInfo(state) {
    const history = state.ratingHistory;
    const recentAvg = history.length >= 5
      ? (history.slice(-5).reduce((s, r) => s + r.stars, 0) / 5).toFixed(1)
      : null;
    
    return {
      currentLevel: state.userLevel,
      maxUnlocked: state.maxUnlockedLevel,
      recentAvg,
      totalHistory: history.length,
      nextLevelThreshold: state.userLevel < 4 ? 8.0 : null,
      prevLevelThreshold: state.userLevel > 1 ? 5.0 : null,
      adaptiveMessage: state.adaptiveMessage
    };
  },

  /** Get stats for the stats view */
  getStats(state, chunks) {
    const total = chunks.length;
    let mastered = 0;
    let dueCount = 0;
    const now = Date.now();

    // Calculate per-level stats
    const levelData = { 1: { total: 0, mastered: 0 },
                        2: { total: 0, mastered: 0 },
                        3: { total: 0, mastered: 0 },
                        4: { total: 0, mastered: 0 } };

    for (const chunk of chunks) {
      const diff = chunk.difficulty || 1;
      levelData[diff].total++;
      
      const card = state.cards[chunk.id];
      const isMastered = card && card.n >= 3 && card.ef >= 2.3;
      
      if (isMastered) {
        mastered++;
        levelData[diff].mastered++;
      }
      
      if (!card || !card.dueDate || new Date(card.dueDate).getTime() <= now) {
        dueCount++;
      }
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
      userLevel: state.userLevel,
      maxUnlockedLevel: state.maxUnlockedLevel,
      categoryData,
      levelData
    };
  }
};
