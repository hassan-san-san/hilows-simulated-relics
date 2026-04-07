// --- 1. STATE MANAGEMENT ---
// This is our "source of truth". All relics live here.
let inventory = [];
const INVENTORY_KEY = 'hsr-inventory'; // Key for localStorage

// --- 2. DATA DEFINITIONS (for now, very simple) ---
const PIECES = ['Head', 'Hands', 'Body', 'Feet', 'Sphere', 'Rope'];
const SUB_STATS = ['HP', 'ATK', 'DEF', 'HP%', 'ATK%', 'DEF%', 'Crit Rate', 'Crit Dmg', 'Effect RES', 'Break Effect', 'Speed'];

// --- 3. UI ELEMENT REFERENCES ---
// Navigation
const navPullBtn = document.getElementById('nav-pull-btn');
const navInventoryBtn = document.getElementById('nav-inventory-btn');

// Pages
const pullPage = document.getElementById('pull-page');
const inventoryPage = document.getElementById('inventory-page');

// Content Containers
const pullButton = document.getElementById('pull-button');
const pullResultsContainer = document.getElementById('pull-results-container');
const inventoryContainer = document.getElementById('inventory-container');


// --- 4. CORE LOGIC ---

/**
 * Generates a single, random relic object.
 * For now, main stat is fixed to ATK, and we get 4 random substats.
 */
function generateRelic() {
    // Get 4 unique random substats
    const shuffledSubstats = SUB_STATS.sort(() => 0.5 - Math.random());
    const selectedSubstats = shuffledSubstats.slice(0, 4);

    const newRelic = {
        id: Date.now(), // Unique ID using timestamp
        piece: PIECES[Math.floor(Math.random() * PIECES.length)],
        level: 0,
        mainStat: 'ATK', // Fixed for now, as requested
        substats: selectedSubstats,
    };
    return newRelic;
}

/**
 * Creates and returns an HTML element for a given relic object.
 */
function createRelicCard(relic) {
    const card = document.createElement('div');
    card.className = 'relic-card';

    // Using template literals (backticks ``) to build HTML string
    card.innerHTML = `
        <h3>${relic.piece} (+${relic.level})</h3>
        <p><strong>${relic.mainStat}</strong></p>
        <ul>
            ${relic.substats.map(stat => `<li>${stat}</li>`).join('')}
        </ul>
    `;
    return card;
}

/**
 * Clears and re-renders the entire inventory display from the `inventory` array.
 */
function renderInventory() {
    inventoryContainer.innerHTML = ''; // Clear previous content
    // The inventory is already newest-first because we use unshift()
    inventory.forEach(relic => {
        const relicCard = createRelicCard(relic);
        inventoryContainer.appendChild(relicCard);
    });
}

/**
 * Handles the logic for a 10-pull.
 */
function handlePull() {
    pullResultsContainer.innerHTML = ''; // Clear previous pull results

    for (let i = 0; i < 10; i++) {
        const newRelic = generateRelic();
        
        // Add the new relic to the START of the inventory array (for newest-first)
        inventory.unshift(newRelic);

        // Display this newly pulled relic in the pull results area
        const relicCard = createRelicCard(newRelic);
        pullResultsContainer.appendChild(relicCard);
    }
    
    // After pulling, save the updated inventory
    saveInventory();
}

/**
 * Switches the visible page in the main content area.
 */
function showPage(page) {
    // Hide all pages first
    pullPage.classList.add('hidden');
    inventoryPage.classList.add('hidden');

    // Show the requested page
    if (page === 'pull') {
        pullPage.classList.remove('hidden');
    } else if (page === 'inventory') {
        // We always re-render the inventory when switching to it,
        // in case it has changed.
        renderInventory(); 
        inventoryPage.classList.remove('hidden');
    }
}


// --- 5. SAVING & LOADING ---

function saveInventory() {
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(inventory));
}

function loadInventory() {
    const savedInventory = localStorage.getItem(INVENTORY_KEY);
    if (savedInventory) {
        inventory = JSON.parse(savedInventory);
    }
}

// --- 6. EVENT LISTENERS ---

// Pull button on the pull page
pullButton.addEventListener('click', handlePull);

// Navigation buttons
navPullBtn.addEventListener('click', () => showPage('pull'));
navInventoryBtn.addEventListener('click', () => showPage('inventory'));


// --- 7. INITIALIZATION ---
// This code runs once when the script first loads.
loadInventory();
showPage('pull'); // Start on the pull page
console.log('Hilows Simulated Relics initialized!');
console.log('Loaded inventory:', inventory);