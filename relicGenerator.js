// This file contains the logic for creating and calculating relic properties.
// It imports the data it needs and exports the functions that use it.

import { GAME_DATA } from './gameData.js';

/**
 * Picks a random item from an array of objects with weights.
 */
function weightedRandom(itemsWithWeights) {
    const totalWeight = itemsWithWeights.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;
    for (const { item, weight } of itemsWithWeights) {
        if (random < weight) return item;
        random -= weight;
    }
}

/**
 * Generates a single, probabilistically correct relic object at level 0.
 */
export function generateRelic() {
    const piece = GAME_DATA.PIECES[Math.floor(Math.random() * GAME_DATA.PIECES.length)];
    let mainStatName;

    if (piece === 'Head') mainStatName = 'HP';
    else if (piece === 'Hands') mainStatName = 'ATK';
    else mainStatName = weightedRandom(GAME_DATA.MAIN_STAT_WEIGHTS[piece]);
    
    const possibleSubstats = GAME_DATA.SUBSTAT_WEIGHTS.filter(sub => sub.item !== mainStatName);
    let substats = [];
    while (substats.length < 4) {
        const newSubstatName = weightedRandom(possibleSubstats);
        if (!substats.some(s => s.stat === newSubstatName)) {
            const tiers = GAME_DATA.SUBSTAT_VALUES[newSubstatName];
            const randomValue = tiers[Math.floor(Math.random() * tiers.length)];
            substats.push({ stat: newSubstatName, value: randomValue });
        }
    }

    return {
        id: Date.now() + Math.random(),
        piece,
        level: 0,
        mainStat: mainStatName,
        substats,
    };
}

/**
 * Calculates the value of a main stat at a given level.
 */
export function calculateMainStatValue(statName, level) {
    const scaling = GAME_DATA.MAIN_STAT_SCALING[statName];
    if (!scaling) return 0;
    return scaling.base + (level * scaling.perLevel);
}

/**
 * Formats a stat value for display (e.g., adds '%' or rounds the number).
 */
export function formatStat(statName, value) {
    if (statName.includes('%') || ['CRIT', 'DMG', 'Boost', 'Rate', 'Effect'].some(s => statName.includes(s))) {
        return `${value.toFixed(1)}%`;
    }
    return Math.round(value).toString();
}

/**
 * Applies one upgrade roll (+3 levels) to a relic.
 */
export function upgradeRelic(relic) {
    if (relic.level >= 15) return relic; // Can't upgrade past max level

    relic.level = Math.min(15, relic.level + 3);
            
    // Add a roll to a random substat
    const substatToUpgrade = relic.substats[Math.floor(Math.random() * relic.substats.length)];
    const tiers = GAME_DATA.SUBSTAT_VALUES[substatToUpgrade.stat];
    const rollValue = tiers[Math.floor(Math.random() * tiers.length)];
    substatToUpgrade.value += rollValue;

    return relic;
}