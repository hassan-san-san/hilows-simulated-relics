import { generateRelic, calculateMainStatValue, formatStat, upgradeRelic } from './relicGenerator.js';

// --- 1. STATE MANAGEMENT ---
let inventory = [];
let trash = [];
let currentView = 'inventory';
const STORAGE_KEY = 'hsr-data';

// --- 2. UI ELEMENT REFERENCES ---
const pullCavernBtn = document.getElementById('pull-cavern-btn');
const pullPlanarBtn = document.getElementById('pull-planar-btn');
const inventoryTabBtn = document.getElementById('inventory-tab-btn');
const trashTabBtn = document.getElementById('trash-tab-btn');
const contentArea = document.getElementById('content-area');
const trashControls = document.getElementById('trash-controls');
const scrapAllBtn = document.getElementById('scrap-all-btn');

// --- 3. RENDERING LOGIC ---
function createRelicCard(relic) {
    const card = document.createElement('div');
    card.className = 'relic-card';
    card.dataset.id = relic.id;
    
    const mainStatValue = calculateMainStatValue(relic.mainStat, relic.level);
    
    const buttons = currentView === 'inventory'
        ? `<button class="upgrade-btn">Upgrade (+3)</button><button class="trash-btn">Trash</button>`
        : `<button class="restore-btn">Restore</button>`;
        
    card.innerHTML = `
        <h3>${relic.piece} (+${relic.level})</h3>
        
        <div class="stat-row main-stat-row">
            <span>${relic.mainStat}</span>
            <span>${formatStat(relic.mainStat, mainStatValue)}</span>
        </div>
        
        <ul>
            ${relic.substats.map(sub => {
                const upgradeArrows = sub.upgrades ? `<span class="upgrade-indicator">[${sub.upgrades}]</span>` : '';
                return `
                <li class="stat-row">
                    <span>${sub.stat}</span>
                    <span>${formatStat(sub.stat, sub.value)} ${upgradeArrows}</span>
                </li>`;
            }).join('')}
        </ul>
        
        <div class="relic-controls">${buttons}</div>
    `;
    return card;
}

function render() {
    contentArea.innerHTML = '';
    const itemsToRender = currentView === 'inventory' ? inventory : trash;
    itemsToRender.slice().reverse().forEach(relic => {
        contentArea.appendChild(createRelicCard(relic));
    });
    inventoryTabBtn.classList.toggle('active', currentView === 'inventory');
    trashTabBtn.classList.toggle('active', currentView === 'trash');
    trashControls.classList.toggle('hidden', currentView !== 'trash' || trash.length === 0);
}

// --- 4. EVENT HANDLERS & HELPERS ---
function addNewRelicToInventory(relic) {
    inventory.push(relic);
    if (currentView === 'inventory') {
        contentArea.prepend(createRelicCard(relic));
    }
    saveData();
}

function handleContentClick(event) {
    const target = event.target;
    const card = target.closest('.relic-card');
    if (!card) return;

    const relicId = Number(card.dataset.id);

    if (target.classList.contains('trash-btn')) {
        const relicIndex = inventory.findIndex(r => r.id === relicId);
        if (relicIndex === -1) return;
        const [relicToTrash] = inventory.splice(relicIndex, 1);
        trash.push(relicToTrash);
    } 
    else if (target.classList.contains('restore-btn')) {
        const relicIndex = trash.findIndex(r => r.id === relicId);
        if (relicIndex === -1) return;
        const [relicToRestore] = trash.splice(relicIndex, 1);
        inventory.push(relicToRestore);
    } 
    else if (target.classList.contains('upgrade-btn')) {
        const relic = inventory.find(r => r.id === relicId);
        if (!relic) return;
        upgradeRelic(relic);
    } 
    else {
        return;
    }

    saveData();
    render();
}

function handleScrapAll() {
    if (trash.length > 0 && confirm(`Are you sure you want to permanently delete ${trash.length} relic(s)? This cannot be undone.`)) {
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
        const data = JSON.parse(savedData);
        inventory = data.inventory || [];
        trash = data.trash || [];
    }
}

// --- 6. INITIALIZATION ---
pullCavernBtn.addEventListener('click', () => {
    const newRelic = generateRelic('cavern');
    addNewRelicToInventory(newRelic);
});
pullPlanarBtn.addEventListener('click', () => {
    const newRelic = generateRelic('planar');
    addNewRelicToInventory(newRelic);
});
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
loadData();
render();
console.log('HSR Simulator initialized with hardcoded short names!');