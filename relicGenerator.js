import { GAME_DATA } from './gameData.js';

function weightedRandom(itemsWithWeights) {
    const totalWeight = itemsWithWeights.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;
    for (const { item, weight } of itemsWithWeights) {
        if (random < weight) return item;
        random -= weight;
    }
}

/** Helper function to generate a valid, unique substat */
function getRandomSubstat(mainStatName, existingSubstats) {
    const possibleSubstats = GAME_DATA.SUBSTAT_WEIGHTS.filter(sub => 
        sub.item !== mainStatName && !existingSubstats.some(s => s.stat === sub.item)
    );
    const newSubstatName = weightedRandom(possibleSubstats);
    const tiers = GAME_DATA.SUBSTAT_VALUES[newSubstatName];
    const randomValue = tiers[Math.floor(Math.random() * tiers.length)];
    
    // We now include an 'upgrades' tracker set to 0 initially
    return { stat: newSubstatName, value: randomValue, upgrades: 0 };
}

/**
 * Generate a relic with the specified type.
 * @param {string} type - 'cavern' or 'planar'.
 * @param {string} setName - The name of the set to generate.
 */
export function generateRelic(type, setName) {
    const availablePieces = type === 'cavern' ? GAME_DATA.CAVERN_PIECES : GAME_DATA.PLANAR_PIECES;
    const piece = availablePieces[Math.floor(Math.random() * availablePieces.length)];
    
    let mainStatName;
    if (piece === 'Head') mainStatName = 'HP';
    else if (piece === 'Hands') mainStatName = 'ATK';
    else mainStatName = weightedRandom(GAME_DATA.MAIN_STAT_WEIGHTS[piece]);
    
    // THE 3 OR 4 LINER LOGIC: 20% chance for 4, 80% chance for 3
    const startingSubstatsCount = Math.random() < 0.20 ? 4 : 3;
    
    let substats = [];
    while (substats.length < startingSubstatsCount) {
        substats.push(getRandomSubstat(mainStatName, substats));
    }

    return {
        id: Date.now() + Math.random(),
        setName: setName, // The new property!
        piece,
        level: 0,
        mainStat: mainStatName,
        substats,
    };
}

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
    
    // THE UPGRADE LOGIC: If it has less than 4 stats, add a new one.
    if (relic.substats.length < 4) {
        relic.substats.push(getRandomSubstat(relic.mainStat, relic.substats));
    } 
    // Otherwise, pick a random existing stat to boost
    else {
        const substatToUpgrade = relic.substats[Math.floor(Math.random() * relic.substats.length)];
        const tiers = GAME_DATA.SUBSTAT_VALUES[substatToUpgrade.stat];
        const rollValue = tiers[Math.floor(Math.random() * tiers.length)];
        
        substatToUpgrade.value += rollValue;
        // Track that this specific stat got upgraded for the UI
        substatToUpgrade.upgrades = (substatToUpgrade.upgrades || 0) + 1;
    }
    
    return relic;
}