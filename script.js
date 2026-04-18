import { generateRelic, calculateMainStatValue, formatStat, upgradeRelic } from './relicGenerator.js';
import { RELIC_SETS } from './relicSets.js';

// --- STATE ---
let inventory = [];
let trash = [];
let currentPullType = 'cavern';
let inventoryView = 'inventory'; // 'inventory' or 'trash'
const STORAGE_KEY = 'hsr-data';

// --- FILTER / SORT STATE ---
let filterPiece    = '';
let filterSet      = '';
let filterMainStat = '';
let sortBy         = 'date';
let sortOrder      = 'desc';

// --- DOM REFS: NAV ---
const navPullBtn      = document.getElementById('nav-pull-btn');
const navInventoryBtn = document.getElementById('nav-inventory-btn');
const pullPage        = document.getElementById('pull-page');
const inventoryPage   = document.getElementById('inventory-page');

// --- DOM REFS: PULL PAGE ---
const pullTypeCavernBtn     = document.getElementById('pull-type-cavern');
const pullTypePlanarBtn     = document.getElementById('pull-type-planar');
const setSelector           = document.getElementById('set-selector-dropdown');
const pullBtn               = document.getElementById('pull-btn');
const pullResultsContainer  = document.getElementById('pull-results-container');
const setBonusDisplay       = document.getElementById('set-bonus-display');
const bonus2pcEl            = document.getElementById('bonus-2pc');
const bonus4pcEl            = document.getElementById('bonus-4pc');

// --- DOM REFS: INVENTORY PAGE ---
const invTabInventory    = document.getElementById('inv-tab-inventory');
const invTabTrash        = document.getElementById('inv-tab-trash');
const trashControls      = document.getElementById('trash-controls');
const scrapAllBtn        = document.getElementById('scrap-all-btn');
const inventoryContainer = document.getElementById('inventory-container');
const inventoryFilters   = document.getElementById('inventory-filters');
const filterCountEl      = document.getElementById('filter-count');

// --- DOM REFS: FILTER CONTROLS ---
const filterPieceEl    = document.getElementById('filter-piece');
const filterSetEl      = document.getElementById('filter-set');
const filterMainStatEl = document.getElementById('filter-mainstat');
const sortByEl         = document.getElementById('sort-by');
const sortOrderEl      = document.getElementById('sort-order');
const resetFiltersBtn  = document.getElementById('reset-filters-btn');

// --- PULL PAGE SETUP ---
function populateSetDropdown() {
    setSelector.innerHTML = '';
    RELIC_SETS[currentPullType].forEach(set => {
        const option = document.createElement('option');
        option.value = set.name;
        option.textContent = set.name;
        setSelector.appendChild(option);
    });
    updateSetBonus();
}

function updateSetBonus() {
    const setData = RELIC_SETS[currentPullType].find(s => s.name === setSelector.value);
    if (!setData) { setBonusDisplay.classList.add('hidden'); return; }
    setBonusDisplay.classList.remove('hidden');
    bonus2pcEl.innerHTML = `<span class="bonus-label">2pc</span> ${setData.bonus2pc}`;
    if (setData.bonus4pc) {
        bonus4pcEl.innerHTML = `<span class="bonus-label">4pc</span> ${setData.bonus4pc}`;
        bonus4pcEl.classList.remove('hidden');
    } else {
        bonus4pcEl.classList.add('hidden');
    }
}

// --- FILTER / SORT SETUP ---
function populateSetFilter() {
    const allSets = [...RELIC_SETS.cavern, ...RELIC_SETS.planar]
        .map(s => s.name)
        .sort((a, b) => a.localeCompare(b));
    filterSetEl.innerHTML = '<option value="">All Sets</option>';
    allSets.forEach(name => {
        const opt = document.createElement('option');
        opt.value = name;
        opt.textContent = name;
        filterSetEl.appendChild(opt);
    });
}

function getSubstatValue(relic, substatName) {
    const sub = relic.substats.find(s => s.stat === substatName);
    return sub ? sub.value : -Infinity;
}

function applyFiltersAndSort(items) {
    let result = [...items];

    if (filterPiece)    result = result.filter(r => r.piece === filterPiece);
    if (filterSet)      result = result.filter(r => r.setName === filterSet);
    if (filterMainStat) result = result.filter(r => r.mainStat === filterMainStat);

    result.sort((a, b) => {
        let aVal, bVal;
        if (sortBy === 'date') {
            aVal = a.id;    bVal = b.id;
        } else if (sortBy === 'level') {
            aVal = a.level; bVal = b.level;
        } else {
            // substat sort — relics missing that substat sink to the bottom
            aVal = getSubstatValue(a, sortBy);
            bVal = getSubstatValue(b, sortBy);
        }
        return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
    });

    return result;
}

function resetFilters() {
    filterPiece = ''; filterSet = ''; filterMainStat = '';
    sortBy = 'date';  sortOrder = 'desc';
    filterPieceEl.value    = '';
    filterSetEl.value      = '';
    filterMainStatEl.value = '';
    sortByEl.value         = 'date';
    sortOrderEl.value      = 'desc';
}

// --- RENDERING ---
function createRelicCard(relic, context) {
    const card = document.createElement('div');
    card.className = 'relic-card';
    card.dataset.id = relic.id;

    const mainStatValue = calculateMainStatValue(relic.mainStat, relic.level);
    const isMaxLevel    = relic.level >= 15;
    const isLocked      = relic.locked || false;

    let buttons = '';
    if (context === 'pull' || context === 'inventory') {
        buttons = `
            <button class="upgrade-btn" ${isMaxLevel ? 'disabled' : ''}>${isMaxLevel ? 'MAX' : '+3'}</button>
            <button class="upgrade-max-btn" ${isMaxLevel ? 'disabled' : ''}>+15</button>
            <button class="trash-btn" ${isLocked ? 'disabled' : ''}>Trash</button>
        `;
    } else if (context === 'trash') {
        buttons = `<button class="restore-btn">Restore</button>`;
    }

    card.innerHTML = `
        <button class="lock-btn ${isLocked ? 'is-locked' : ''}" title="${isLocked ? 'Unlock' : 'Lock'}">${isLocked ? '🔒' : '🔓'}</button>
        <div class="relic-set-name">${relic.setName || ''}</div>
        <h3>${relic.piece} <span class="relic-level">(+${relic.level})</span></h3>
        <div class="stat-row main-stat-row">
            <span class="stat-name">${relic.mainStat}</span>
            <span class="stat-value">${formatStat(relic.mainStat, mainStatValue)}</span>
        </div>
        <ul class="substat-list">
            ${relic.substats.map(sub => {
                const upgradeMarker = sub.upgrades
                    ? `<span class="upgrade-indicator">[${sub.upgrades}]</span>`
                    : '';
                return `<li class="stat-row">
                    <span class="stat-name">${sub.stat}</span>
                    <span class="stat-value">${formatStat(sub.stat, sub.value)}${upgradeMarker}</span>
                </li>`;
            }).join('')}
        </ul>
        <div class="relic-controls">${buttons}</div>
    `;
    return card;
}

function renderInventory() {
    inventoryContainer.innerHTML = '';

    const isInventoryView = inventoryView === 'inventory';

    // Show/hide filter bar
    inventoryFilters.classList.toggle('hidden', !isInventoryView);

    // Apply filters+sort for My Relics; simple reverse for Trash
    const items = isInventoryView
        ? applyFiltersAndSort(inventory)
        : [...trash].reverse();

    items.forEach(relic => {
        inventoryContainer.appendChild(createRelicCard(relic, inventoryView));
    });

    // Result count (only shown in My Relics view)
    if (isInventoryView) {
        const isFiltered = filterPiece || filterSet || filterMainStat || sortBy !== 'date' || sortOrder !== 'desc';
        filterCountEl.textContent = isFiltered
            ? `Showing ${items.length} of ${inventory.length} relics`
            : `${inventory.length} relic${inventory.length !== 1 ? 's' : ''}`;
    }

    // Tab + trash controls state
    invTabInventory.classList.toggle('active', isInventoryView);
    invTabTrash.classList.toggle('active', !isInventoryView);
    trashControls.classList.toggle('hidden', isInventoryView || trash.length === 0);
}

// --- NAVIGATION ---
navPullBtn.addEventListener('click', () => {
    pullPage.classList.remove('hidden');
    inventoryPage.classList.add('hidden');
    navPullBtn.classList.add('active');
    navInventoryBtn.classList.remove('active');
});

navInventoryBtn.addEventListener('click', () => {
    inventoryPage.classList.remove('hidden');
    pullPage.classList.add('hidden');
    navInventoryBtn.classList.add('active');
    navPullBtn.classList.remove('active');
    renderInventory();
});

// --- PULL TYPE TOGGLE ---
pullTypeCavernBtn.addEventListener('click', () => {
    currentPullType = 'cavern';
    pullTypeCavernBtn.classList.add('active');
    pullTypePlanarBtn.classList.remove('active');
    populateSetDropdown();
});

pullTypePlanarBtn.addEventListener('click', () => {
    currentPullType = 'planar';
    pullTypePlanarBtn.classList.add('active');
    pullTypeCavernBtn.classList.remove('active');
    populateSetDropdown();
});

// --- SET BONUS ON DROPDOWN CHANGE ---
setSelector.addEventListener('change', updateSetBonus);

// --- PULL BUTTON ---
pullBtn.addEventListener('click', () => {
    const relic = generateRelic(currentPullType, setSelector.value);
    inventory.push(relic);
    saveData();
    pullResultsContainer.prepend(createRelicCard(relic, 'pull'));
});

// --- CARD INTERACTIONS ---
function handleCardClick(event, context) {
    const target = event.target;
    const card   = target.closest('.relic-card');
    if (!card) return;

    const relicId = Number(card.dataset.id);

    if (target.classList.contains('lock-btn')) {
        const relic = [...inventory, ...trash].find(r => r.id === relicId);
        if (!relic) return;
        relic.locked = !relic.locked;
        card.replaceWith(createRelicCard(relic, context));
        saveData();
    }
    else if (target.classList.contains('upgrade-btn')) {
        const relic = inventory.find(r => r.id === relicId);
        if (!relic || relic.level >= 15) return;
        upgradeRelic(relic);
        card.replaceWith(createRelicCard(relic, context));
        saveData();
    }
    else if (target.classList.contains('upgrade-max-btn')) {
        const relic = inventory.find(r => r.id === relicId);
        if (!relic || relic.level >= 15) return;
        while (relic.level < 15) upgradeRelic(relic);
        card.replaceWith(createRelicCard(relic, context));
        saveData();
    }
    else if (target.classList.contains('trash-btn')) {
        const idx = inventory.findIndex(r => r.id === relicId);
        if (idx === -1) return;
        const [trashed] = inventory.splice(idx, 1);
        trash.push(trashed);
        card.remove();
        saveData();
        if (context === 'inventory') renderInventory();
    }
    else if (target.classList.contains('restore-btn')) {
        const idx = trash.findIndex(r => r.id === relicId);
        if (idx === -1) return;
        const [restored] = trash.splice(idx, 1);
        inventory.push(restored);
        saveData();
        renderInventory();
    }
}

pullResultsContainer.addEventListener('click', e => handleCardClick(e, 'pull'));
inventoryContainer.addEventListener('click', e => handleCardClick(e, inventoryView));

// --- INVENTORY SUB-TABS ---
invTabInventory.addEventListener('click', () => { inventoryView = 'inventory'; renderInventory(); });
invTabTrash.addEventListener('click',     () => { inventoryView = 'trash';     renderInventory(); });

// --- SCRAP ALL ---
scrapAllBtn.addEventListener('click', () => {
    if (trash.length > 0 && confirm(`Permanently delete ${trash.length} relic(s)? This cannot be undone.`)) {
        trash = [];
        saveData();
        renderInventory();
    }
});

// --- FILTER / SORT EVENT LISTENERS ---
filterPieceEl.addEventListener('change',    e => { filterPiece    = e.target.value; renderInventory(); });
filterSetEl.addEventListener('change',      e => { filterSet      = e.target.value; renderInventory(); });
filterMainStatEl.addEventListener('change', e => { filterMainStat = e.target.value; renderInventory(); });
sortByEl.addEventListener('change',         e => { sortBy         = e.target.value; renderInventory(); });
sortOrderEl.addEventListener('change',      e => { sortOrder      = e.target.value; renderInventory(); });

resetFiltersBtn.addEventListener('click', () => {
    resetFilters();
    renderInventory();
});

// --- SAVE / LOAD ---
function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ inventory, trash }));
}

function loadData() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        const data = JSON.parse(saved);
        inventory = data.inventory || [];
        trash     = data.trash     || [];
    }
}

// --- INIT ---
loadData();
populateSetDropdown();
populateSetFilter();
