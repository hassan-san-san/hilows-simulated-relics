// --- 0. GAME DATA CONSTANTS (The "Separate Table") ---
const GAME_DATA = {
    PIECES: ['Head', 'Hands', 'Body', 'Feet', 'Planar Sphere', 'Link Rope'],
    MAIN_STAT_WEIGHTS: {
        'Body': [
            { item: 'HP%', weight: 20 }, { item: 'ATK%', weight: 20 }, { item: 'DEF%', weight: 20 },
            { item: 'Effect Hit Rate', weight: 10 }, { item: 'Outgoing Healing Boost', weight: 10 },
            { item: 'CRIT Rate', weight: 10 }, { item: 'CRIT DMG', weight: 10 }
        ],
        'Feet': [
            { item: 'HP%', weight: 28 }, { item: 'ATK%', weight: 30 },
            { item: 'DEF%', weight: 30 }, { item: 'SPD', weight: 12 }
        ],
        'Planar Sphere': [
            { item: 'HP%', weight: 12 }, { item: 'ATK%', weight: 13 }, { item: 'DEF%', weight: 12 },
            { item: 'Physical DMG Boost', weight: 9 }, { item: 'Fire DMG Boost', weight: 9 }, { item: 'Ice DMG Boost', weight: 9 },
            { item: 'Wind DMG Boost', weight: 9 }, { item: 'Lightning DMG Boost', weight: 9 }, { item: 'Quantum DMG Boost', weight: 9 },
            { item: 'Imaginary DMG Boost', weight: 9 }
        ],
        'Link Rope': [
            { item: 'HP%', weight: 26 }, { item: 'ATK%', weight: 27 }, { item: 'DEF%', weight: 24 },
            { item: 'Break Effect', weight: 16 }, { item: 'Energy Regeneration Rate', weight: 5 }
        ]
    },
    MAIN_STAT_SCALING: {
        'SPD': { base: 4.032, perLevel: 1.4 }, 'HP': { base: 112.896, perLevel: 39.5136 }, 'ATK': { base: 56.448, perLevel: 19.7568 },
        'HP%': { base: 6.912, perLevel: 2.4192 }, 'ATK%': { base: 6.912, perLevel: 2.4192 }, 'DEF%': { base: 8.64, perLevel: 3.024 },
        'Break Effect': { base: 10.3680, perLevel: 3.6277 }, 'Effect Hit Rate': { base: 6.9120, perLevel: 2.4192 },
        'Energy Regeneration Rate': { base: 3.1104, perLevel: 1.0886 }, 'Outgoing Healing Boost': { base: 5.5296, perLevel: 1.9354 },
        'Physical DMG Boost': { base: 6.2208, perLevel: 2.1773 }, 'Fire DMG Boost': { base: 6.2208, perLevel: 2.1773 },
        'Ice DMG Boost': { base: 6.2208, perLevel: 2.1773 }, 'Wind DMG Boost': { base: 6.2208, perLevel: 2.1773 },
        'Lightning DMG Boost': { base: 6.2208, perLevel: 2.1773 }, 'Quantum DMG Boost': { base: 6.2208, perLevel: 2.1773 },
        'Imaginary DMG Boost': { base: 6.2208, perLevel: 2.1773 }, 'CRIT Rate': { base: 5.184, perLevel: 1.8144 },
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

// --- 1. STATE MANAGEMENT ---
let inventory = [];
const INVENTORY_KEY = 'hsr-inventory';

// --- 2. UI ELEMENT REFERENCES ---
const navPullBtn = document.getElementById('nav-pull-btn'), navInventoryBtn = document.getElementById('nav-inventory-btn');
const pullPage = document.getElementById('pull-page'), inventoryPage = document.getElementById('inventory-page');
const pullButton = document.getElementById('pull-button');
const pullResultsContainer = document.getElementById('pull-results-container'), inventoryContainer = document.getElementById('inventory-container');

// --- 3. UTILITY FUNCTIONS ---

/**
 * Picks a random item from an array of objects with weights.
 * @param {Array<{item: any, weight: number}>} itemsWithWeights - The array of items to choose from.
 * @returns {any} The chosen item.
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
 * Formats a stat value for display.
 * @param {string} statName - The name of the stat.
 * @param {number} value - The numerical value of the stat.
 * @returns {string} The formatted string.
 */
function formatStat(statName, value) {
    if (statName.includes('%') || ['CRIT', 'DMG', 'Boost', 'Rate', 'Effect'].some(s => statName.includes(s))) {
        return `${value.toFixed(1)}%`;
    }
    return Math.round(value).toString();
}

/**
 * Calculates the value of a main stat at a given level.
 * @param {string} statName - The name of the stat.
 * @param {number} level - The relic's level.
 * @returns {number} The calculated value.
 */
function calculateMainStatValue(statName, level) {
    const scaling = GAME_DATA.MAIN_STAT_SCALING[statName];
    if (!scaling) return 0;
    return scaling.base + (level * scaling.perLevel);
}

// --- 4. CORE LOGIC ---

/**
 * Generates a single, probabilistically correct relic object at level 0.
 */
function generateRelic() {
    const piece = GAME_DATA.PIECES[Math.floor(Math.random() * GAME_DATA.PIECES.length)];
    let mainStatName;

    if (piece === 'Head') mainStatName = 'HP';
    else if (piece === 'Hands') mainStatName = 'ATK';
    else mainStatName = weightedRandom(GAME_DATA.MAIN_STAT_WEIGHTS[piece]);
    
    // Generate 4 unique substats, making sure none are the same as the main stat
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
        id: Date.now() + Math.random(), // Add random to avoid collision on fast pulls
        piece,
        level: 0,
        mainStat: mainStatName,
        substats,
    };
}

/**
 * Creates and returns an HTML element for a given relic object.
 */
function createRelicCard(relic) {
    const card = document.createElement('div');
    card.className = 'relic-card';
    card.dataset.id = relic.id; // Store ID on the element for easy access

    const mainStatValue = calculateMainStatValue(relic.mainStat, relic.level);

    card.innerHTML = `
        <h3>${relic.piece} (+${relic.level})</h3>
        <p class="main-stat">${relic.mainStat}: ${formatStat(relic.mainStat, mainStatValue)}</p>
        <ul>
            ${relic.substats.map(sub => `<li>${sub.stat}: ${formatStat(sub.stat, sub.value)}</li>`).join('')}
        </ul>
        <div class="relic-controls">
            <button class="upgrade-btn">Upgrade (+3)</button>
            <button class="delete-btn">Delete</button>
        </div>
    `;
    return card;
}

/**
 * Clears and re-renders the entire inventory display from the `inventory` array.
 */
function renderInventory() {
    inventoryContainer.innerHTML = '';
    inventory.forEach(relic => {
        inventoryContainer.appendChild(createRelicCard(relic));
    });
}

/**
 * Handles the logic for a single pull.
 */
function handlePull() {
    pullResultsContainer.innerHTML = '';
    const newRelic = generateRelic();
    inventory.unshift(newRelic); // Add to start of array (newest first)
    pullResultsContainer.appendChild(createRelicCard(newRelic));
    saveInventory();
}

/**
 * Handles clicks within the inventory container (for delete and upgrade).
 * This uses event delegation.
 */
function handleInventoryClick(event) {
    const target = event.target;
    const card = target.closest('.relic-card');
    if (!card) return;

    const relicId = Number(card.dataset.id);
    const relicIndex = inventory.findIndex(r => r.id === relicId);
    if (relicIndex === -1) return;

    if (target.classList.contains('delete-btn')) {
        inventory.splice(relicIndex, 1); // Remove the relic from the array
    } 
    else if (target.classList.contains('upgrade-btn')) {
        const relic = inventory[relicIndex];
        if (relic.level < 15) {
            relic.level = Math.min(15, relic.level + 3);
            
            // Add a roll to a random substat
            const substatToUpgrade = relic.substats[Math.floor(Math.random() * relic.substats.length)];
            const tiers = GAME_DATA.SUBSTAT_VALUES[substatToUpgrade.stat];
            const rollValue = tiers[Math.floor(Math.random() * tiers.length)];
            substatToUpgrade.value += rollValue;
        }
    }

    saveInventory();
    renderInventory(); // Re-render the whole inventory to show the change
}

/**
 * Switches the visible page.
 */
function showPage(page) {
    pullPage.classList.add('hidden');
    inventoryPage.classList.add('hidden');
    if (page === 'pull') {
        pullPage.classList.remove('hidden');
    } else if (page === 'inventory') {
        renderInventory();
        inventoryPage.classList.remove('hidden');
    }
}

// --- 5. SAVING & LOADING ---
function saveInventory() {
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(inventory));
}

function loadInventory() {
    const saved = localStorage.getItem(INVENTORY_KEY);
    if (saved) {
        inventory = JSON.parse(saved);
    }
}

// --- 6. EVENT LISTENERS ---
pullButton.addEventListener('click', handlePull);
navPullBtn.addEventListener('click', () => showPage('pull'));
navInventoryBtn.addEventListener('click', () => showPage('inventory'));
inventoryContainer.addEventListener('click', handleInventoryClick); // Single listener for all cards

// --- 7. INITIALIZATION ---
loadInventory();
showPage('pull');
console.log('HSR Advanced Simulator Initialized!');