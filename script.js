// This is the main "controller" file. It handles user input, manages the state
// (inventory, trash), and updates the UI. It imports logic from other files.

import { generateRelic, calculateMainStatValue, formatStat, upgradeRelic } from './relicGenerator.js';

// --- 1. STATE MANAGEMENT ---
let inventory = [];
let trash = [];
let currentView = 'inventory'; // 'inventory' or 'trash'
const STORAGE_KEY = 'hsr-data';

// --- 2. UI ELEMENT REFERENCES ---
const pullBtn = document.getElementById('pull-btn');
const inventoryTabBtn = document.getElementById('inventory-tab-btn');
const trashTabBtn = document.getElementById('trash-tab-btn');
const contentArea = document.getElementById('content-area');
const trashControls = document.getElementById('trash-controls');
const scrapAllBtn = document.getElementById('scrap-all-btn');

// --- 3. RENDERING LOGIC ---

/** Creates the HTML for a single relic card. */
function createRelicCard(relic) {
    const card = document.createElement('div');
    card.className = 'relic-card';
    card.dataset.id = relic.id;

    const mainStatValue = calculateMainStatValue(relic.mainStat, relic.level);
    
    // Buttons change depending on the current view
    const buttons = currentView === 'inventory'
        ? `<button class="upgrade-btn">Upgrade (+3)</button><button class="trash-btn">Trash</button>`
        : `<button class="restore-btn">Restore</button>`;

    card.innerHTML = `
        <h3>${relic.piece} (+${relic.level})</h3>
        <p class="main-stat">${relic.mainStat}: ${formatStat(relic.mainStat, mainStatValue)}</p>
        <ul>
            ${relic.substats.map(sub => `<li>${sub.stat}: ${formatStat(sub.stat, sub.value)}</li>`).join('')}
        </ul>
        <div class="relic-controls">${buttons}</div>
    `;
    return card;
}

/** Renders the currently active view (inventory or trash) to the screen. */
function render() {
    contentArea.innerHTML = '';
    const itemsToRender = currentView === 'inventory' ? inventory : trash;

    itemsToRender.forEach(relic => {
        contentArea.appendChild(createRelicCard(relic));
    });

    // Update tab styles and visibility of trash controls
    inventoryTabBtn.classList.toggle('active', currentView === 'inventory');
    trashTabBtn.classList.toggle('active', currentView === 'trash');
    trashControls.classList.toggle('hidden', currentView !== 'trash' || trash.length === 0);
}


// --- 4. EVENT HANDLERS ---

function handlePull() {
    const newRelic = generateRelic();
    inventory.unshift(newRelic); // Add to start of inventory
    
    // If we're on the inventory tab, add the new relic to the top of the view
    if (currentView === 'inventory') {
        contentArea.prepend(createRelicCard(newRelic));
    }
    
    saveData();
}

function handleContentClick(event) {
    const target = event.target;
    const card = target.closest('.relic-card');
    if (!card) return;

    const relicId = Number(card.dataset.id);
    const sourceArray = currentView === 'inventory' ? inventory : trash;
    const relicIndex = sourceArray.findIndex(r => r.id === relicId);
    if (relicIndex === -1) return;
    const [relic] = sourceArray.splice(relicIndex, 1); // Find and remove the relic

    if (target.classList.contains('trash-btn')) {
        trash.unshift(relic);
    } else if (target.classList.contains('restore-btn')) {
        inventory.unshift(relic);
    } else if (target.classList.contains('upgrade-btn')) {
        const updatedRelic = upgradeRelic(relic);
        inventory.splice(relicIndex, 0, updatedRelic); // Put it back where it was
    }

    saveData();
    render(); // Re-render the entire view to reflect changes
}

function handleScrapAll() {
    if (confirm(`Are you sure you want to permanently delete ${trash.length} relic(s)? This cannot be undone.`)) {
        trash = [];
        saveData();
        render();
    }
}

// --- 5. SAVING & LOADING ---

function saveData() {
    const data = { inventory, trash };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadData() {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
        const { loadedInventory, loadedTrash } = JSON.parse(savedData);
        inventory = loadedInventory || [];
        trash = loadedTrash || [];
    }
}

// --- 6. INITIALIZATION ---

// Add event listeners
pullBtn.addEventListener('click', handlePull);
contentArea.addEventListener('click', handleContentClick);
scrapAllBtn.addEventListener('click', handleScrapAll);
inventoryTabBtn.addEventListener('click', () => {
    currentView = 'inventory';
    render();
});
trashTabBtn.addEventListener('click', () => {
    currentView = 'trash';
    render();
});

// Initial load
loadData();
render();
console.log('HSR Modular Simulator Initialized!');