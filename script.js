import { generateRelic, calculateMainStatValue, formatStat, upgradeRelic } from './relicGenerator.js';
import { RELIC_SETS } from './relicSets.js';
import { CHARACTERS } from './characterData.js';
import { LIGHT_CONES } from './lightConeData.js';

// --- STATE ---
let inventory = [];
let trash = [];
let currentPullType = 'cavern';
let currentSetName  = '';        // tracks selected set on pull page
let inventoryView   = 'inventory'; // 'inventory' or 'trash'
let currentCharId   = null;      // currently viewed character id (string)
let currentLcId     = null;      // currently selected light cone id (string)
const STORAGE_KEY   = 'hsr-data';

// --- FILTER / SORT STATE ---
let filterPiece    = '';
let filterSet      = '';
let filterMainStat = '';
let sortBy         = 'date';
let sortOrder      = 'desc';

// --- DOM REFS: NAV ---
const navPullBtn        = document.getElementById('nav-pull-btn');
const navInventoryBtn   = document.getElementById('nav-inventory-btn');
const navCharactersBtn  = document.getElementById('nav-characters-btn');
const pullPage          = document.getElementById('pull-page');
const inventoryPage     = document.getElementById('inventory-page');
const characterPage     = document.getElementById('character-page');

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

// --- IMAGE URL HELPER ---
const IMG_BASE   = 'https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/';
const PIECE_INDEX = { 'Head': 0, 'Hands': 1, 'Body': 2, 'Feet': 3, 'Planar Sphere': 0, 'Link Rope': 1 };

function getRelicImageUrl(setId, piece) {
    if (!setId) return null;
    return `${IMG_BASE}icon/relic/${setId}_${PIECE_INDEX[piece]}.png`;
}

// --- CUSTOM SELECT ---
function closeAllCustomSelects() {
    document.querySelectorAll('.custom-select.open').forEach(cs => {
        cs.querySelector('.cs-dropdown')?.classList.add('hidden');
        cs.classList.remove('open');
    });
}

document.addEventListener('click', closeAllCustomSelects);

/**
 * Builds a custom image-bearing dropdown inside `container`.
 * @param {HTMLElement} container - The wrapper div (gets class 'custom-select' added)
 * @param {Array} options - Array of { value, label, imageUrl?, isGroup?, label }
 * @param {string} selectedValue - Initially selected value
 * @param {Function} onChange - Called with new value when an option is picked
 */
function buildCustomSelect(container, options, selectedValue, onChange) {
    container.innerHTML = '';
    container.className = 'custom-select';

    const firstReal = options.find(o => !o.isGroup);
    const initOpt   = options.find(o => !o.isGroup && o.value === selectedValue) || firstReal;

    // Trigger row
    const trigger = document.createElement('div');
    trigger.className = 'cs-trigger';

    function updateTrigger(opt) {
        trigger.innerHTML = `
            ${opt?.imageUrl ? `<img class="cs-img" src="${opt.imageUrl}" onerror="this.style.display='none'">` : ''}
            <span class="cs-label">${opt?.label || ''}</span>
            <span class="cs-arrow">▾</span>
        `;
    }
    updateTrigger(initOpt);

    // Dropdown list
    const dropdown = document.createElement('div');
    dropdown.className = 'cs-dropdown hidden';

    options.forEach(opt => {
        if (opt.isGroup) {
            const header = document.createElement('div');
            header.className = 'cs-group-header';
            header.textContent = opt.label;
            dropdown.appendChild(header);
            return;
        }

        const item = document.createElement('div');
        item.className = 'cs-option' + (opt.value === selectedValue ? ' selected' : '');
        item.dataset.value = opt.value;
        item.innerHTML = `
            ${opt.imageUrl ? `<img class="cs-img" src="${opt.imageUrl}" onerror="this.style.display='none'">` : ''}
            <span>${opt.label}</span>
        `;
        item.addEventListener('click', e => {
            e.stopPropagation();
            dropdown.querySelectorAll('.cs-option').forEach(o => o.classList.remove('selected'));
            item.classList.add('selected');
            updateTrigger(opt);
            dropdown.classList.add('hidden');
            container.classList.remove('open');
            onChange(opt.value);
        });
        dropdown.appendChild(item);
    });

    trigger.addEventListener('click', e => {
        e.stopPropagation();
        const isOpen = !dropdown.classList.contains('hidden');
        closeAllCustomSelects();
        if (!isOpen) {
            dropdown.classList.remove('hidden');
            container.classList.add('open');
        }
    });

    container.appendChild(trigger);
    container.appendChild(dropdown);
}

// --- PULL PAGE SETUP ---
function populateSetDropdown() {
    // Sort by id descending — newest set at top
    const sets = [...RELIC_SETS[currentPullType]].sort((a, b) => b.id - a.id);
    const iconPiece = currentPullType === 'cavern' ? 'Head' : 'Planar Sphere';

    const options = sets.map(set => ({
        value: set.name,
        label: set.name,
        imageUrl: getRelicImageUrl(set.id, iconPiece)
    }));

    currentSetName = options[0]?.value || '';

    buildCustomSelect(setSelector, options, currentSetName, val => {
        currentSetName = val;
        updateSetBonus();
    });

    updateSetBonus();
}

function updateSetBonus() {
    const setData = RELIC_SETS[currentPullType].find(s => s.name === currentSetName);
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
    // Sort each group by id descending (newest first)
    const cavernSets = [...RELIC_SETS.cavern].sort((a, b) => b.id - a.id);
    const planarSets = [...RELIC_SETS.planar].sort((a, b) => b.id - a.id);

    const options = [
        { value: '', label: 'All Sets' },
        { isGroup: true, label: 'Cavern Relics' },
        ...cavernSets.map(set => ({
            value: set.name,
            label: set.name,
            imageUrl: getRelicImageUrl(set.id, 'Head')
        })),
        { isGroup: true, label: 'Planar Ornaments' },
        ...planarSets.map(set => ({
            value: set.name,
            label: set.name,
            imageUrl: getRelicImageUrl(set.id, 'Planar Sphere')
        }))
    ];

    buildCustomSelect(filterSetEl, options, filterSet, val => {
        filterSet = val;
        renderInventory();
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
    filterMainStatEl.value = '';
    sortByEl.value         = 'date';
    sortOrderEl.value      = 'desc';
    populateSetFilter(); // rebuild custom select showing "All Sets"
}

// --- RENDERING ---
function createRelicCard(relic, context) {
    const card = document.createElement('div');
    card.className = 'relic-card';
    card.dataset.id = relic.id;

    const mainStatValue = calculateMainStatValue(relic.mainStat, relic.level);
    const isMaxLevel    = relic.level >= 15;
    const isLocked      = relic.locked || false;

    const allSets  = [...RELIC_SETS.cavern, ...RELIC_SETS.planar];
    const setData  = allSets.find(s => s.name === relic.setName);
    const imageUrl = setData ? getRelicImageUrl(setData.id, relic.piece) : null;
    const imgHtml  = imageUrl
        ? `<img class="relic-icon" src="${imageUrl}" alt="${relic.piece}" onerror="this.style.display='none'">`
        : '';

    const equippedChar = relic.equippedBy
        ? CHARACTERS.find(c => c.id === relic.equippedBy)
        : null;
    const equippedHtml = equippedChar
        ? `<div class="relic-equipped-on" title="Equipped on ${equippedChar.name}">On: ${equippedChar.name}</div>`
        : '';

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
        <div class="relic-header">
            ${imgHtml}
            <div class="relic-header-text">
                <div class="relic-set-name">${relic.setName || ''}</div>
                <h3>${relic.piece} <span class="relic-level">(+${relic.level})</span></h3>
                ${equippedHtml}
            </div>
        </div>
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

    inventoryFilters.classList.toggle('hidden', !isInventoryView);

    const items = isInventoryView
        ? applyFiltersAndSort(inventory)
        : [...trash].reverse();

    items.forEach(relic => {
        inventoryContainer.appendChild(createRelicCard(relic, inventoryView));
    });

    if (isInventoryView) {
        const isFiltered = filterPiece || filterSet || filterMainStat || sortBy !== 'date' || sortOrder !== 'desc';
        filterCountEl.textContent = isFiltered
            ? `Showing ${items.length} of ${inventory.length} relics`
            : `${inventory.length} relic${inventory.length !== 1 ? 's' : ''}`;
    }

    invTabInventory.classList.toggle('active', isInventoryView);
    invTabTrash.classList.toggle('active', !isInventoryView);
    trashControls.classList.toggle('hidden', isInventoryView || trash.length === 0);
}

// --- CHARACTER PAGE ---
const IMG_BASE_CHAR = 'https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/';

const ELEMENT_COLOURS = {
    'Physical': '#9e9e9e', 'Fire': '#ef5350', 'Ice': '#42a5f5',
    'Lightning': '#ab47bc', 'Wind': '#26a69a', 'Quantum': '#7e57c2',
    'Imaginary': '#fdd835'
};

function buildCharSelector() {
    const container = document.getElementById('char-selector-dropdown');
    container.innerHTML = '';
    container.className = 'custom-select';

    // Sort: 5-star first, then alphabetically
    const sorted = [...CHARACTERS].sort((a, b) =>
        b.rarity - a.rarity || a.name.localeCompare(b.name)
    );

    const initChar = currentCharId
        ? CHARACTERS.find(c => c.id === currentCharId)
        : null;

    // Trigger
    const trigger = document.createElement('div');
    trigger.className = 'cs-trigger';

    function updateTrigger(char) {
        trigger.innerHTML = char ? `
            <img class="cs-img" src="${IMG_BASE_CHAR}${char.icon}" onerror="this.style.display='none'">
            <span class="cs-label">${char.name}</span>
            <span class="cs-arrow">▾</span>
        ` : `<span class="cs-label" style="color:#555">Select a character...</span><span class="cs-arrow">▾</span>`;
    }
    updateTrigger(initChar);

    // Dropdown with search
    const dropdown = document.createElement('div');
    dropdown.className = 'cs-dropdown hidden';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'cs-search';
    searchInput.placeholder = 'Search characters...';
    dropdown.appendChild(searchInput);

    const optionsList = document.createElement('div');
    dropdown.appendChild(optionsList);

    function renderOptions(filter) {
        optionsList.innerHTML = '';
        const term = filter.toLowerCase();
        sorted.forEach(char => {
            if (term && !char.name.toLowerCase().includes(term)) return;
            const item = document.createElement('div');
            item.className = 'cs-option' + (char.id === currentCharId ? ' selected' : '');
            item.dataset.id = char.id;
            const elemCol = ELEMENT_COLOURS[char.element] || '#888';
            item.innerHTML = `
                <img class="cs-img" src="${IMG_BASE_CHAR}${char.icon}" onerror="this.style.display='none'">
                <span style="flex:1">${char.name}</span>
                <span style="font-size:0.75em;color:${elemCol}">${char.element}</span>
            `;
            item.addEventListener('click', e => {
                e.stopPropagation();
                currentCharId = char.id;
                updateTrigger(char);
                optionsList.querySelectorAll('.cs-option').forEach(o => o.classList.remove('selected'));
                item.classList.add('selected');
                dropdown.classList.add('hidden');
                container.classList.remove('open');
                renderCharView();
            });
            optionsList.appendChild(item);
        });
        if (!optionsList.children.length) {
            optionsList.innerHTML = '<div style="padding:10px 12px;color:#555;font-size:0.85em">No results</div>';
        }
    }

    renderOptions('');

    searchInput.addEventListener('input', e => {
        e.stopPropagation();
        renderOptions(e.target.value);
    });
    searchInput.addEventListener('click', e => e.stopPropagation());

    trigger.addEventListener('click', e => {
        e.stopPropagation();
        const isOpen = !dropdown.classList.contains('hidden');
        closeAllCustomSelects();
        if (!isOpen) {
            dropdown.classList.remove('hidden');
            container.classList.add('open');
            searchInput.value = '';
            renderOptions('');
            setTimeout(() => searchInput.focus(), 50);
        }
    });

    container.appendChild(trigger);
    container.appendChild(dropdown);
}

function buildLcSelector(charPath) {
    const container = document.getElementById('lc-selector-dropdown');
    container.innerHTML = '';
    container.className = 'custom-select';

    if (!charPath) {
        container.innerHTML = '<div class="cs-trigger" style="color:#444;cursor:default">Select a character first</div>';
        return;
    }

    // Filter to matching path only, keep 5-star first then alpha
    const filtered = LIGHT_CONES.filter(lc => lc.path === charPath);

    // If currently selected LC doesn't match new path, clear it
    if (currentLcId && !filtered.find(lc => lc.id === currentLcId)) {
        currentLcId = null;
    }

    const initLc = currentLcId ? filtered.find(lc => lc.id === currentLcId) : null;

    const trigger = document.createElement('div');
    trigger.className = 'cs-trigger';

    function updateTrigger(lc) {
        trigger.innerHTML = lc ? `
            <img class="cs-img" src="${IMG_BASE_CHAR}${lc.icon}" onerror="this.style.display='none'">
            <span class="cs-label">${lc.name}</span>
            <span style="font-size:0.75em;color:${lc.rarity === 5 ? '#ffa500' : '#42a5f5'};margin-left:auto;flex-shrink:0">${'★'.repeat(lc.rarity)}</span>
        ` : `<span class="cs-label" style="color:#555">No Light Cone</span><span class="cs-arrow">▾</span>`;
    }
    updateTrigger(initLc);

    const dropdown = document.createElement('div');
    dropdown.className = 'cs-dropdown hidden';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'cs-search';
    searchInput.placeholder = 'Search light cones...';
    dropdown.appendChild(searchInput);

    const optionsList = document.createElement('div');
    dropdown.appendChild(optionsList);

    // "No LC" option at top
    function renderOptions(filter) {
        optionsList.innerHTML = '';
        const term = filter.toLowerCase();

        // None option
        if (!term) {
            const noneItem = document.createElement('div');
            noneItem.className = 'cs-option' + (!currentLcId ? ' selected' : '');
            noneItem.innerHTML = `<span style="color:#555">No Light Cone</span>`;
            noneItem.addEventListener('click', e => {
                e.stopPropagation();
                currentLcId = null;
                updateTrigger(null);
                dropdown.classList.add('hidden');
                container.classList.remove('open');
                renderCharView();
            });
            optionsList.appendChild(noneItem);
        }

        filtered.forEach(lc => {
            if (term && !lc.name.toLowerCase().includes(term)) return;
            const item = document.createElement('div');
            item.className = 'cs-option' + (lc.id === currentLcId ? ' selected' : '');
            const starCol = lc.rarity === 5 ? '#ffa500' : '#42a5f5';
            item.innerHTML = `
                <img class="cs-img" src="${IMG_BASE_CHAR}${lc.icon}" onerror="this.style.display='none'">
                <span style="flex:1">${lc.name}</span>
                <span style="font-size:0.72em;color:${starCol};flex-shrink:0">${lc.rarity}★</span>
            `;
            item.addEventListener('click', e => {
                e.stopPropagation();
                currentLcId = lc.id;
                updateTrigger(lc);
                dropdown.classList.add('hidden');
                container.classList.remove('open');
                renderCharView();
            });
            optionsList.appendChild(item);
        });

        if (!optionsList.children.length) {
            optionsList.innerHTML = '<div style="padding:10px 12px;color:#555;font-size:0.85em">No results</div>';
        }
    }

    renderOptions('');

    searchInput.addEventListener('input', e => { e.stopPropagation(); renderOptions(e.target.value); });
    searchInput.addEventListener('click', e => e.stopPropagation());

    trigger.addEventListener('click', e => {
        e.stopPropagation();
        const isOpen = !dropdown.classList.contains('hidden');
        closeAllCustomSelects();
        if (!isOpen) {
            dropdown.classList.remove('hidden');
            container.classList.add('open');
            searchInput.value = '';
            renderOptions('');
            setTimeout(() => searchInput.focus(), 50);
        }
    });

    container.appendChild(trigger);
    container.appendChild(dropdown);
}

function renderCharView() {
    const charView = document.getElementById('char-view');
    if (!currentCharId) { charView.classList.add('hidden'); return; }

    const char = CHARACTERS.find(c => c.id === currentCharId);
    if (!char) { charView.classList.add('hidden'); return; }

    charView.classList.remove('hidden');

    // Build LC selector filtered to this character's path
    buildLcSelector(char.path);

    // Portrait
    document.getElementById('char-portrait').src = `${IMG_BASE_CHAR}${char.portrait}`;
    document.getElementById('char-portrait').alt  = char.name;

    // Name + meta
    document.getElementById('char-name').textContent = char.name;
    const stars = '★'.repeat(char.rarity);
    const elemCol = ELEMENT_COLOURS[char.element] || '#888';
    document.getElementById('char-meta').innerHTML =
        `<span class="char-rarity-star">${stars}</span> &nbsp;` +
        `<span style="color:${elemCol}">${char.element}</span> · ${char.path}`;

    // Resolve selected LC
    const lc = currentLcId ? LIGHT_CONES.find(l => l.id === currentLcId) : null;
    const lcBase = lc ? lc.baseStats : { hp: 0, atk: 0, def: 0 };

    // Collect relic stat contributions
    // Maps stat name → which accumulator bucket it feeds
    const RELIC_STAT_MAP = {
        'HP': 'flatHP', 'ATK': 'flatATK', 'DEF': 'flatDEF',
        'HP%': 'hpPct', 'ATK%': 'atkPct', 'DEF%': 'defPct',
        'SPD': 'spd', 'CRIT Rate': 'critRate', 'CRIT DMG': 'critDmg'
    };
    const rc = { flatHP: 0, flatATK: 0, flatDEF: 0, hpPct: 0, atkPct: 0, defPct: 0, spd: 0, critRate: 0, critDmg: 0 };
    const equippedNow = getEquippedRelics(currentCharId);
    const equippedCount = Object.keys(equippedNow).length;

    Object.values(equippedNow).forEach(relic => {
        // Main stat contribution
        const mainVal = calculateMainStatValue(relic.mainStat, relic.level);
        const mainKey = RELIC_STAT_MAP[relic.mainStat];
        if (mainKey) rc[mainKey] += mainVal;
        // Substat contributions
        relic.substats.forEach(sub => {
            const subKey = RELIC_STAT_MAP[sub.stat];
            if (subKey) rc[subKey] += sub.value;
        });
    });

    // Full formula: (charBase + lcBase) * (1 + trace% + relic%) + flatRelics
    const bs = char.baseStats;
    const tr = char.traces;

    const hpPct   = tr['HP%']       || 0;
    const atkPct  = tr['ATK%']      || 0;
    const defPct  = tr['DEF%']      || 0;
    const spdDelta= tr['SPD']       || 0;
    const crBonus = tr['CRIT Rate'] || 0;
    const cdBonus = tr['CRIT DMG']  || 0;

    const finalHp  = Math.round((bs.hp  + lcBase.hp)  * (1 + hpPct  + rc.hpPct)  + rc.flatHP);
    const finalAtk = Math.round((bs.atk + lcBase.atk) * (1 + atkPct + rc.atkPct) + rc.flatATK);
    const finalDef = Math.round((bs.def + lcBase.def) * (1 + defPct + rc.defPct) + rc.flatDEF);
    const finalSpd = +(bs.spd + spdDelta + rc.spd).toFixed(1);
    const finalCr  = bs.critRate + crBonus + rc.critRate;
    const finalCd  = bs.critDmg  + cdBonus + rc.critDmg;

    // Update heading to reflect what's included
    const statsHeading = document.querySelector('.char-stats-panel .char-stats-heading');
    if (statsHeading) {
        const parts = ['Lv. 80'];
        if (lc) parts.push('LC');
        if (equippedCount > 0) parts.push(`${equippedCount}/6 relics`);
        statsHeading.innerHTML = `Stats <span class="char-stats-level">(${parts.join(' · ')})</span>`;
    }

    const statsTable = document.getElementById('char-stats-table');
    statsTable.innerHTML = [
        ['HP',        finalHp],
        ['ATK',       finalAtk],
        ['DEF',       finalDef],
        ['SPD',       finalSpd],
        ['CRIT Rate', `${(finalCr * 100).toFixed(1)}%`],
        ['CRIT DMG',  `${(finalCd * 100).toFixed(1)}%`],
    ].map(([name, val]) => `<tr><td>${name}</td><td>${val}</td></tr>`).join('');

    // Traces table
    const tracesTable = document.getElementById('char-traces-table');
    const traceRows = Object.entries(char.traces).map(([stat, val]) => {
        const display = typeof val === 'number' && val < 10
            ? `+${(val * 100).toFixed(1)}%`
            : `+${val}`;
        return `<tr><td>${stat}</td><td class="stat-highlight">${display}</td></tr>`;
    });
    tracesTable.innerHTML = traceRows.join('') || '<tr><td colspan="2" style="color:#444">None</td></tr>';

    renderSlots();
}

// --- SET BONUS TRACKER ---

function renderSetBonuses() {
    const tracker = document.getElementById('set-bonus-tracker');
    if (!tracker) return;

    const equippedNow = getEquippedRelics(currentCharId);
    const allSets = [...RELIC_SETS.cavern, ...RELIC_SETS.planar];

    // Count how many relics per set name
    const setCounts = {};
    Object.values(equippedNow).forEach(relic => {
        setCounts[relic.setName] = (setCounts[relic.setName] || 0) + 1;
    });

    if (Object.keys(setCounts).length === 0) {
        tracker.innerHTML = '';
        return;
    }

    // Build rows — sorted by count desc so active bonuses appear first
    const entries = Object.entries(setCounts).sort((a, b) => b[1] - a[1]);

    let html = '<div class="set-bonus-tracker-heading">Set Bonuses</div>';

    entries.forEach(([setName, count]) => {
        const setData = allSets.find(s => s.name === setName);
        if (!setData) return;

        const has2pc = count >= 2;
        const has4pc = count >= 4 && setData.bonus4pc;

        const maxPieces = setData.bonus4pc ? 4 : 2;

        // 2pc row
        html += `
            <div class="sbt-row ${has2pc ? 'sbt-active' : 'sbt-inactive'}">
                <span class="sbt-badge">${count}/${maxPieces}</span>
                <span class="sbt-set-name">${setName}</span>
                <span class="sbt-threshold">2pc</span>
            </div>
            <div class="sbt-bonus-text ${has2pc ? 'sbt-text-active' : 'sbt-text-inactive'}">${setData.bonus2pc}</div>
        `;

        // 4pc row (only for cavern sets that have one)
        if (setData.bonus4pc) {
            html += `
                <div class="sbt-row ${has4pc ? 'sbt-active' : 'sbt-inactive'} sbt-4pc-row">
                    <span class="sbt-badge sbt-badge-4pc">${count}/4</span>
                    <span class="sbt-set-name"></span>
                    <span class="sbt-threshold">4pc</span>
                </div>
                <div class="sbt-bonus-text ${has4pc ? 'sbt-text-active' : 'sbt-text-inactive'}">${setData.bonus4pc}</div>
            `;
        }
    });

    tracker.innerHTML = html;
}

// --- EQUIP SYSTEM ---

function getEquippedRelics(charId) {
    const slots = {};
    inventory.filter(r => r.equippedBy === charId).forEach(r => { slots[r.piece] = r; });
    return slots;
}

function renderSlots() {
    if (!currentCharId) return;
    const equippedRelics = getEquippedRelics(currentCharId);
    const allSets = [...RELIC_SETS.cavern, ...RELIC_SETS.planar];

    document.querySelectorAll('.relic-slot').forEach(slotEl => {
        const piece = slotEl.dataset.piece;
        const relic = equippedRelics[piece] || null;

        slotEl.classList.toggle('filled', !!relic);
        slotEl.onclick = () => openSlotPicker(piece);

        if (relic) {
            const setData  = allSets.find(s => s.name === relic.setName);
            const imageUrl = setData ? getRelicImageUrl(setData.id, relic.piece) : null;
            const mainVal  = calculateMainStatValue(relic.mainStat, relic.level);

            const substatHtml = relic.substats.map(s =>
                `<div class="slot-substat-row">${s.stat}: ${formatStat(s.stat, s.value)}</div>`
            ).join('');

            slotEl.innerHTML = `
                <div class="slot-piece-label">${piece}</div>
                <div class="slot-relic-content">
                    ${imageUrl ? `<img class="slot-relic-icon" src="${imageUrl}" onerror="this.style.display='none'">` : ''}
                    <div class="slot-relic-info">
                        <div class="slot-set-name">${relic.setName}</div>
                        <div class="slot-main-stat-display"><strong>${relic.mainStat}: ${formatStat(relic.mainStat, mainVal)}</strong></div>
                        <div class="slot-substats">${substatHtml}</div>
                    </div>
                    <button class="slot-unequip-btn" title="Unequip">✕</button>
                </div>
                <div class="slot-level-badge">+${relic.level}</div>
            `;

            slotEl.querySelector('.slot-unequip-btn').onclick = e => {
                e.stopPropagation();
                relic.equippedBy = null;
                saveData();
                renderSlots();
            };
        } else {
            slotEl.innerHTML = `
                <div class="slot-piece-label">${piece}</div>
                <div class="slot-empty">Click to equip</div>
            `;
        }
    });

    renderSetBonuses();
}

// --- SLOT PICKER ---

let slotPickerEl = null;

function ensureSlotPicker() {
    if (slotPickerEl) return;
    slotPickerEl = document.createElement('div');
    slotPickerEl.id = 'slot-picker-overlay';
    slotPickerEl.className = 'slot-picker-overlay hidden';
    document.body.appendChild(slotPickerEl);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSlotPicker(); });
}

function openSlotPicker(piece) {
    ensureSlotPicker();

    const equippedRelics  = getEquippedRelics(currentCharId);
    const currentRelic    = equippedRelics[piece] || null;
    const others = inventory
        .filter(r => r.piece === piece && r.id !== currentRelic?.id)
        .sort((a, b) => {
            const aOther = a.equippedBy && a.equippedBy !== currentCharId ? 1 : 0;
            const bOther = b.equippedBy && b.equippedBy !== currentCharId ? 1 : 0;
            if (aOther !== bOther) return aOther - bOther;
            return b.level - a.level;
        });

    slotPickerEl.innerHTML = `
        <div class="slot-picker-panel">
            <div class="slot-picker-header">
                <span class="slot-picker-title">Equip ${piece}</span>
                <button class="slot-picker-close">✕</button>
            </div>
            <div class="slot-picker-list" id="slot-picker-list"></div>
        </div>
    `;

    slotPickerEl.querySelector('.slot-picker-close').onclick = closeSlotPicker;
    slotPickerEl.onclick = e => { if (e.target === slotPickerEl) closeSlotPicker(); };

    const list = document.getElementById('slot-picker-list');

    // Currently equipped section
    addSectionHeader(list, 'Currently Equipped');
    if (currentRelic) {
        list.appendChild(createPickerItem(currentRelic, true));
    } else {
        addEmptyNote(list, 'Nothing equipped');
    }

    // Inventory section
    addSectionHeader(list, `Inventory (${others.length})`);
    if (others.length === 0) {
        addEmptyNote(list, 'No relics for this slot — pull some first!');
    } else {
        others.forEach(r => list.appendChild(createPickerItem(r, false)));
    }

    slotPickerEl.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeSlotPicker() {
    if (!slotPickerEl) return;
    slotPickerEl.classList.add('hidden');
    document.body.style.overflow = '';
}

function addSectionHeader(parent, text) {
    const el = document.createElement('div');
    el.className = 'slot-picker-section-header';
    el.textContent = text;
    parent.appendChild(el);
}

function addEmptyNote(parent, text) {
    const el = document.createElement('div');
    el.className = 'slot-picker-none';
    el.textContent = text;
    parent.appendChild(el);
}

function createPickerItem(relic, isEquipped) {
    const allSets   = [...RELIC_SETS.cavern, ...RELIC_SETS.planar];
    const setData   = allSets.find(s => s.name === relic.setName);
    const imageUrl  = setData ? getRelicImageUrl(setData.id, relic.piece) : null;
    const mainVal   = calculateMainStatValue(relic.mainStat, relic.level);
    const onOther   = !isEquipped && relic.equippedBy && relic.equippedBy !== currentCharId;
    const otherChar = onOther ? CHARACTERS.find(c => c.id === relic.equippedBy) : null;

    const item = document.createElement('div');
    item.className = 'slot-picker-item'
        + (isEquipped ? ' is-equipped' : '')
        + (onOther    ? ' is-on-other'  : '');

    item.innerHTML = `
        <div class="picker-item-top">
            ${imageUrl ? `<img class="picker-relic-icon" src="${imageUrl}" onerror="this.style.display='none'">` : ''}
            <div class="picker-item-info">
                <div class="picker-set-name">${relic.setName || ''}</div>
                <div class="picker-main-stat">
                    ${relic.mainStat}
                    <span class="picker-main-val">${formatStat(relic.mainStat, mainVal)}</span>
                    <span class="picker-level">+${relic.level}</span>
                </div>
                ${onOther ? `<div class="picker-other-char">On: ${otherChar?.name || 'another character'}</div>` : ''}
            </div>
            <div class="picker-badges">
                ${isEquipped ? '<span class="picker-badge-equipped">Equipped</span>' : ''}
                ${relic.locked ? '<span class="picker-lock">🔒</span>' : ''}
            </div>
        </div>
        <div class="picker-substats">
            ${relic.substats.map(s =>
                `<span class="picker-substat">${s.stat}: ${formatStat(s.stat, s.value)}</span>`
            ).join('')}
        </div>
        <div class="picker-item-actions">
            ${isEquipped
                ? `<button class="picker-btn picker-unequip-btn">Unequip</button>`
                : `<button class="picker-btn picker-equip-btn">Equip</button>`}
        </div>
    `;

    if (isEquipped) {
        item.querySelector('.picker-unequip-btn').onclick = e => {
            e.stopPropagation();
            relic.equippedBy = null;
            saveData();
            closeSlotPicker();
            renderSlots();
        };
    } else {
        item.querySelector('.picker-equip-btn').onclick = e => {
            e.stopPropagation();
            doEquip(relic);
        };
    }

    return item;
}

function doEquip(relic) {
    const currentChar = CHARACTERS.find(c => c.id === currentCharId);

    if (relic.equippedBy && relic.equippedBy !== currentCharId) {
        const otherChar = CHARACTERS.find(c => c.id === relic.equippedBy);
        if (!confirm(`This relic is on ${otherChar?.name || 'another character'}. Move it to ${currentChar?.name}?`)) return;
        relic.equippedBy = null;
    }

    // Unequip whatever is currently in this slot
    const slottedRelic = inventory.find(r => r.equippedBy === currentCharId && r.piece === relic.piece);
    if (slottedRelic) slottedRelic.equippedBy = null;

    relic.equippedBy = currentCharId;
    saveData();
    closeSlotPicker();
    renderSlots();
}

// --- NAVIGATION ---
navPullBtn.addEventListener('click', () => {
    pullPage.classList.remove('hidden');
    inventoryPage.classList.add('hidden');
    characterPage.classList.add('hidden');
    navPullBtn.classList.add('active');
    navInventoryBtn.classList.remove('active');
    navCharactersBtn.classList.remove('active');
});

navInventoryBtn.addEventListener('click', () => {
    inventoryPage.classList.remove('hidden');
    pullPage.classList.add('hidden');
    characterPage.classList.add('hidden');
    navInventoryBtn.classList.add('active');
    navPullBtn.classList.remove('active');
    navCharactersBtn.classList.remove('active');
    renderInventory();
});

navCharactersBtn.addEventListener('click', () => {
    characterPage.classList.remove('hidden');
    pullPage.classList.add('hidden');
    inventoryPage.classList.add('hidden');
    navCharactersBtn.classList.add('active');
    navPullBtn.classList.remove('active');
    navInventoryBtn.classList.remove('active');
    buildCharSelector();
    if (currentCharId) renderCharView(); else buildLcSelector(null);
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

// --- PULL BUTTON ---
pullBtn.addEventListener('click', () => {
    const relic = generateRelic(currentPullType, currentSetName);
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
        const relic = inventory[idx];
        if (relic.equippedBy) {
            const char = CHARACTERS.find(c => c.id === relic.equippedBy);
            const charName = char ? char.name : 'a character';
            alert(`Can't trash — this relic is equipped on ${charName}. Unequip it first.`);
            return;
        }
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
        // Backfill equippedBy for relics created before the field existed
        [...inventory, ...trash].forEach(r => {
            if (r.equippedBy === undefined) r.equippedBy = null;
        });
    }
}

// --- INIT ---
loadData();
populateSetDropdown();
populateSetFilter();
