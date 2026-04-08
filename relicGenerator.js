import { GAME_DATA } from './gameData.js';

function weightedRandom(itemsWithWeights) {
    const totalWeight = itemsWithWeights.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;
    for (const { item, weight } of itemsWithWeights) {
        if (random < weight) return item;
        random -= weight;
    }
}

/**
 * Generates a relic object based on the specified type ('cavern' or 'planar').
 * @param {string} type - The type of relic to generate.
 */
export function generateRelic(type) {
    const availablePieces = type === 'cavern' ? GAME_DATA.CAVERN_PIECES : GAME_DATA.PLANAR_PIECES;
    const piece = availablePieces[Math.floor(Math.random() * availablePieces.length)];
    
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

// The rest of the functions (calculateMainStatValue, formatStat, upgradeRelic) remain unchanged.
export function calculateMainStatValue(statName, level) {
    const scaling = GAME_DATA.MAIN_STAT_SCALING[statName];
    if (!scaling) return 0;
    return scaling.base + (level * scaling.perLevel);
}

export function formatStat(statName, value) {
    if (statName.includes('%') || ['CRIT', 'DMG', 'Boost', 'Rate', 'Effect'].some(s => statName.includes(s))) {
        return `${value.toFixed(1)}%`;
    }
    return Math.round(value).toString();
}

export function upgradeRelic(relic) {
    if (relic.level >= 15) return relic;
    relic.level = Math.min(15, relic.level + 3);
    const substatToUpgrade = relic.substats[Math.floor(Math.random() * relic.substats.length)];
    const tiers = GAME_DATA.SUBSTAT_VALUES[substatToUpgrade.stat];
    const rollValue = tiers[Math.floor(Math.random() * tiers.length)];
    substatToUpgrade.value += rollValue;
    return relic;
}