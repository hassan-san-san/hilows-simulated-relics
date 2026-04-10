// This file contains all the static data for the game.
// We export the main object so other files can import and use it.

export const GAME_DATA = {
    CAVERN_PIECES: ['Head', 'Hands', 'Body', 'Feet'],
    PLANAR_PIECES: ['Planar Sphere', 'Link Rope'],
    
    MAIN_STAT_WEIGHTS: {
        'Body': [
            { item: 'HP%', weight: 20 }, { item: 'ATK%', weight: 20 }, { item: 'DEF%', weight: 20 },
            { item: 'Effect Hit Rate', weight: 10 }, { item: 'Healing Boost', weight: 10 },
            { item: 'CRIT Rate', weight: 10 }, { item: 'CRIT DMG', weight: 10 }
        ],
        'Feet': [
            { item: 'HP%', weight: 28 }, { item: 'ATK%', weight: 30 },
            { item: 'DEF%', weight: 30 }, { item: 'SPD', weight: 12 }
        ],
        'Planar Sphere': [
            { item: 'HP%', weight: 12 }, { item: 'ATK%', weight: 13 }, { item: 'DEF%', weight: 12 },
            { item: 'Physical DMG', weight: 9 }, { item: 'Fire DMG', weight: 9 }, { item: 'Ice DMG', weight: 9 },
            { item: 'Wind DMG', weight: 9 }, { item: 'Lightning DMG', weight: 9 }, { item: 'Quantum DMG', weight: 9 },
            { item: 'Imaginary DMG', weight: 9 }
        ],
        'Link Rope': [
            { item: 'HP%', weight: 26 }, { item: 'ATK%', weight: 27 }, { item: 'DEF%', weight: 24 },
            { item: 'Break Effect', weight: 16 }, { item: 'Energy Regeneration Rate', weight: 5 } // Left Energy alone as it usually fits, or you can change to 'Energy Regen' here too!
        ]
    },
    MAIN_STAT_SCALING: {
        'SPD': { base: 4.032, perLevel: 1.4 }, 'HP': { base: 112.896, perLevel: 39.5136 }, 'ATK': { base: 56.448, perLevel: 19.7568 },
        'HP%': { base: 6.912, perLevel: 2.4192 }, 'ATK%': { base: 6.912, perLevel: 2.4192 }, 'DEF%': { base: 8.64, perLevel: 3.024 },
        'Break Effect': { base: 10.3680, perLevel: 3.6277 }, 'Effect Hit Rate': { base: 6.9120, perLevel: 2.4192 },
        'Energy Regeneration Rate': { base: 3.1104, perLevel: 1.0886 }, 'Healing Boost': { base: 5.5296, perLevel: 1.9354 },
        'Physical DMG': { base: 6.2208, perLevel: 2.1773 }, 'Fire DMG': { base: 6.2208, perLevel: 2.1773 },
        'Ice DMG': { base: 6.2208, perLevel: 2.1773 }, 'Wind DMG': { base: 6.2208, perLevel: 2.1773 },
        'Lightning DMG': { base: 6.2208, perLevel: 2.1773 }, 'Quantum DMG': { base: 6.2208, perLevel: 2.1773 },
        'Imaginary DMG': { base: 6.2208, perLevel: 2.1773 }, 'CRIT Rate': { base: 5.184, perLevel: 1.8144 },
        'CRIT DMG': { base: 10.368, perLevel: 3.6288 }
    },
    SUBSTAT_WEIGHTS: [
        { item: 'HP', weight: 10 }, { item: 'ATK', weight: 10 }, { item: 'DEF', weight: 10 },
        { item: 'HP%', weight: 10 }, { item: 'ATK%', weight: 10 }, { item: 'DEF%', weight: 10 },
        { item: 'SPD', weight: 4 }, { item: 'CRIT Rate', weight: 6 }, { item: 'CRIT DMG', weight: 6 },
        { item: 'Effect Hit Rate', weight: 8 }, { item: 'Effect RES', weight: 8 }, { item: 'Break Effect', weight: 8 }
    ],
    SUBSTAT_VALUES: {
        'SPD': [2, 2.3, 2.6], 'HP': [33.87, 38.103755, 42.33751], 'ATK': [16.935, 19.051877, 21.168754],
        'DEF': [16.935, 19.051877, 21.168754], 'HP%': [3.456, 3.888, 4.32], 'ATK%': [3.456, 3.888, 4.32],
        'DEF%': [4.32, 4.86, 5.4], 'Break Effect': [5.184, 5.832, 6.48], 'Effect Hit Rate': [3.456, 3.888, 4.32],
        'Effect RES': [3.456, 3.888, 4.32], 'CRIT Rate': [2.592, 2.916, 3.24], 'CRIT DMG': [5.184, 5.832, 6.48]
    }
};