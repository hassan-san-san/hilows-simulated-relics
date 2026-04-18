// This file contains all descriptive/display data for relic sets.
// Piece names, 2pc bonus text, and 4pc bonus text live here.
// Math modifiers for the future character builder will go in gameData.js separately.

export const RELIC_SETS = {
    cavern: [
        {
            name: "Band of Sizzling Thunder",
            id: 109,
            pieces: { Head: "Band's Polarized Sunglasses", Hands: "Band's Touring Bracelet", Body: "Band's Leather Jacket With Studs", Feet: "Band's Ankle Boots With Rivets" },
            bonus2pc: "Increases Lightning DMG by 10%.",
            bonus4pc: "When the wearer uses their Skill, increases the wearer's ATK by 20% for 1 turn(s)."
        },
        {
            name: "Champion of Streetwise Boxing",
            id: 105,
            pieces: { Head: "Champion's Headgear", Hands: "Champion's Heavy Gloves", Body: "Champion's Chest Guard", Feet: "Champion's Fleetfoot Boots" },
            bonus2pc: "Increases Physical DMG by 10%.",
            bonus4pc: "After the wearer attacks or is hit, their ATK increases by 5% for the rest of the battle. This effect can stack up to 5 time(s)."
        },
        {
            name: "Diviner of Distant Reach",
            id: 130,
            pieces: { Head: "Diviner's Extrapolation Jade Abacus", Hands: "Diviner's Ingenium Prosthetic Hand", Body: "Diviner's Astral Robe", Feet: "Diviner's Cloud-Soaring Boots" },
            bonus2pc: "Increases SPD by 6%.",
            bonus4pc: "Before entering combat, if the wearer's SPD is greater than or equal to 120/160, increases the wearer's CRIT Rate by 10%/18%. When the wearer uses Elation Skill for the first time in each battle, enhances all allies' Elation by 10%. This effect cannot stack."
        },
        {
            name: "Eagle of Twilight Line",
            id: 110,
            pieces: { Head: "Eagle's Beaked Helmet", Hands: "Eagle's Soaring Ring", Body: "Eagle's Winged Suit Harness", Feet: "Eagle's Quilted Puttees" },
            bonus2pc: "Increases Wind DMG by 10%.",
            bonus4pc: "After the wearer uses their Ultimate, their action is Advanced Forward by 25%."
        },
        {
            name: "Ever-Glorious Magical Girl",
            id: 129,
            pieces: { Head: "Magical Girl's Shining Medal", Hands: "Magical Girl's Protective Gloves", Body: "Magical Girl's Everdance Battle Skirt", Feet: "Magical Girl's Contract Boots" },
            bonus2pc: "Increases CRIT DMG by 16%.",
            bonus4pc: "The Elation DMG dealt by the wearer and their memosprites ignores 10% of targets' DEF. For every 5 accumulated Punchline allies gain, the Elation DMG dealt additionally ignores 1% of targets' DEF, stacking up to 10 time(s)."
        },
        {
            name: "Firesmith of Lava-Forging",
            id: 107,
            pieces: { Head: "Firesmith's Obsidian Goggles", Hands: "Firesmith's Ring of Flame-Mastery", Body: "Firesmith's Fireproof Apron", Feet: "Firesmith's Alloy Leg" },
            bonus2pc: "Increases Fire DMG by 10%.",
            bonus4pc: "Increases the wearer's Skill DMG by 12%. After unleashing Ultimate, increases the wearer's Fire DMG by 12% for the next attack."
        },
        {
            name: "Genius of Brilliant Stars",
            id: 108,
            pieces: { Head: "Genius's Ultraremote Sensing Visor", Hands: "Genius's Frequency Catcher", Body: "Genius's Metafield Suit", Feet: "Genius's Gravity Walker" },
            bonus2pc: "Increases Quantum DMG by 10%.",
            bonus4pc: "When the wearer deals DMG to the target enemy, ignores 10% DEF. If the target enemy has Quantum Weakness, the wearer additionally ignores 10% DEF."
        },
        {
            name: "Guard of Wuthering Snow",
            id: 106,
            pieces: { Head: "Guard's Cast Iron Helmet", Hands: "Guard's Shining Gauntlets", Body: "Guard's Uniform of Old", Feet: "Guard's Silver Greaves" },
            bonus2pc: "Reduces DMG taken by 8%.",
            bonus4pc: "At the beginning of the turn, if the wearer's HP is equal to or less than 50%, restores HP equal to 8% of their Max HP and regenerates 5 Energy."
        },
        {
            name: "Hero of Triumphant Song",
            id: 123,
            pieces: { Head: "Hero's Wreath of Championship", Hands: "Hero's Gilded Bracers", Body: "Hero's Gallant Golden Armor", Feet: "Hero's Firechasing Shinguard" },
            bonus2pc: "Increases ATK by 12%.",
            bonus4pc: "While the wearer's memosprite is on the field, increases the wearer's SPD by 6%. When the wearer's memosprite attacks, increases the wearer's and memosprite's CRIT DMG by 30%, lasting for 2 turn(s)."
        },
        {
            name: "Hunter of Glacial Forest",
            id: 104,
            pieces: { Head: "Hunter's Artaius Hood", Hands: "Hunter's Lizard Gloves", Body: "Hunter's Ice Dragon Cloak", Feet: "Hunter's Soft Elkskin Boots" },
            bonus2pc: "Increases Ice DMG by 10%.",
            bonus4pc: "After the wearer uses their Ultimate, their CRIT DMG increases by 25% for 2 turn(s)."
        },
        {
            name: "Iron Cavalry Against the Scourge",
            id: 119,
            pieces: { Head: "Iron Cavalry's Homing Helm", Hands: "Iron Cavalry's Crushing Wristguard", Body: "Iron Cavalry's Silvery Armor", Feet: "Iron Cavalry's Skywalk Greaves" },
            bonus2pc: "Increases Break Effect by 16%.",
            bonus4pc: "If the wearer's Break Effect is 150% or higher, the Break DMG dealt to the enemy target ignores 10% of their DEF. If the wearer's Break Effect is 250% or higher, the Super Break DMG dealt to the enemy target additionally ignores 15% of their DEF."
        },
        {
            name: "Knight of Purity Palace",
            id: 103,
            pieces: { Head: "Knight's Forgiving Casque", Hands: "Knight's Silent Oath Ring", Body: "Knight's Solemn Breastplate", Feet: "Knight's Iron Boots of Order" },
            bonus2pc: "Increases DEF by 15%.",
            bonus4pc: "Increases the max DMG that can be absorbed by the Shield created by the wearer by 20%."
        },
        {
            name: "Longevous Disciple",
            id: 113,
            pieces: { Head: "Disciple's Prosthetic Eye", Hands: "Disciple's Ingenium Hand", Body: "Disciple's Dewy Feather Garb", Feet: "Disciple's Celestial Silk Sandals" },
            bonus2pc: "Increases Max HP by 12%.",
            bonus4pc: "When the wearer is hit or has their HP consumed by an ally or themselves, their CRIT Rate increases by 8% for 2 turn(s) and up to 2 stacks."
        },
        {
            name: "Messenger Traversing Hackerspace",
            id: 114,
            pieces: { Head: "Messenger's Holovisor", Hands: "Messenger's Transformative Arm", Body: "Messenger's Secret Satchel", Feet: "Messenger's Par-kool Sneakers" },
            bonus2pc: "Increases SPD by 6%.",
            bonus4pc: "When the wearer uses their Ultimate on an ally, SPD for all allies increases by 12% for 1 turn(s). This effect cannot be stacked."
        },
        {
            name: "Musketeer of Wild Wheat",
            id: 102,
            pieces: { Head: "Musketeer's Wild Wheat Felt Hat", Hands: "Musketeer's Coarse Leather Gloves", Body: "Musketeer's Wind-Hunting Shawl", Feet: "Musketeer's Rivets Riding Boots" },
            bonus2pc: "ATK increases by 12%.",
            bonus4pc: "The wearer's SPD increases by 6% and Basic ATK DMG increases by 10%."
        },
        {
            name: "Passerby of Wandering Cloud",
            id: 101,
            pieces: { Head: "Passerby's Rejuvenated Wooden Hairstick", Hands: "Passerby's Roaming Dragon Bracer", Body: "Passerby's Ragged Embroided Coat", Feet: "Passerby's Stygian Hiking Boots" },
            bonus2pc: "Increases Outgoing Healing by 10%.",
            bonus4pc: "At the start of the battle, immediately regenerates 1 Skill Point."
        },
        {
            name: "Pioneer Diver of Dead Waters",
            id: 117,
            pieces: { Head: "Pioneer's Heatproof Shell", Hands: "Pioneer's Lacuna Compass", Body: "Pioneer's Sealed Lead Apron", Feet: "Pioneer's Starfaring Anchor" },
            bonus2pc: "Increases DMG dealt to enemies with debuffs by 12%.",
            bonus4pc: "Increases CRIT Rate by 4%. The wearer deals 8%/12% increased CRIT DMG to enemies with at least 2/3 debuffs. After the wearer inflicts a debuff on enemy targets, the aforementioned effects increase by 100%, lasting for 1 turn(s)."
        },
        {
            name: "Poet of Mourning Collapse",
            id: 124,
            pieces: { Head: "Poet's Dill Wreath", Hands: "Poet's Gilded Bracelet", Body: "Poet's Star-Studded Skirt", Feet: "Poet's Silver-Studded Shoes" },
            bonus2pc: "Increases Quantum DMG by 10%.",
            bonus4pc: "Decreases the wearer's SPD by 8%. Before entering battle, if the wearer's SPD is lower than 110/95, increases the wearer's CRIT Rate by 20%/32%. This effect applies to the wearer's memosprite at the same time."
        },
        {
            name: "Prisoner in Deep Confinement",
            id: 116,
            pieces: { Head: "Prisoner's Sealed Muzzle", Hands: "Prisoner's Leadstone Shackles", Body: "Prisoner's Repressive Straitjacket", Feet: "Prisoner's Restrictive Fetters" },
            bonus2pc: "ATK increases by 12%.",
            bonus4pc: "For every DoT the target enemy is afflicted with, the wearer will ignore 6% of its DEF when dealing DMG to it. This effect is valid for a max of 3 DoTs."
        },
        {
            name: "Sacerdos' Relived Ordeal",
            id: 121,
            pieces: { Head: "Sacerdos' Melodic Earrings", Hands: "Sacerdos' Welcoming Gloves", Body: "Sacerdos' Ceremonial Garb", Feet: "Sacerdos' Arduous Boots" },
            bonus2pc: "Increases SPD by 6%.",
            bonus4pc: "When using Skill or Ultimate on one ally target, increases the ability target's CRIT DMG by 18%, lasting for 2 turn(s). This effect can stack up to 2 time(s)."
        },
        {
            name: "Scholar Lost in Erudition",
            id: 122,
            pieces: { Head: "Scholar's Silver-Rimmed Monocle", Hands: "Scholar's Auxiliary Knuckle", Body: "Scholar's Tweed Jacket", Feet: "Scholar's Felt Snowboots" },
            bonus2pc: "Increases CRIT Rate by 8%.",
            bonus4pc: "Increases DMG dealt by Skill and Ultimate by 20%. After using Ultimate, additionally increases the DMG dealt by the next Skill by 25%."
        },
        {
            name: "Self-Enshrouded Recluse",
            id: 128,
            pieces: { Head: "Recluse's Wide-Brimmed Fedora", Hands: "Recluse's Refined Timepiece", Body: "Recluse's Camel-Colored Coat", Feet: "Recluse's Soft Suede Boots" },
            bonus2pc: "Increases Shield Effect by 10%.",
            bonus4pc: "Increases Shield Effect provided by the wearer by 12%. When an ally target has a Shield provided by the wearer, the ally target's CRIT DMG increases by 15%."
        },
        {
            name: "The Ashblazing Grand Duke",
            id: 115,
            pieces: { Head: "Grand Duke's Crown of Netherflame", Hands: "Grand Duke's Gloves of Fieryfur", Body: "Grand Duke's Robe of Grace", Feet: "Grand Duke's Ceremonial Boots" },
            bonus2pc: "Increases the DMG dealt by follow-up attacks by 20%.",
            bonus4pc: "When the wearer uses follow-up attacks, increases the wearer's ATK by 6% for every time the follow-up attack deals DMG. This effect can stack up to 8 time(s) and lasts for 3 turn(s). This effect is removed the next time the wearer uses a follow-up attack."
        },
        {
            name: "The Wind-Soaring Valorous",
            id: 120,
            pieces: { Head: "Valorous Mask of Northern Skies", Hands: "Valorous Bracelet of Grappling Hooks", Body: "Valorous Plate of Soaring Flight", Feet: "Valorous Greaves of Pursuing Hunt" },
            bonus2pc: "Increases ATK by 12%.",
            bonus4pc: "Increases the wearer's CRIT Rate by 6%. When the wearer uses a follow-up attack, increases the DMG dealt by Ultimate by 36%, lasting for 1 turn(s)."
        },
        {
            name: "Thief of Shooting Meteor",
            id: 111,
            pieces: { Head: "Thief's Myriad-Faced Mask", Hands: "Thief's Gloves With Prints", Body: "Thief's Steel Grappling Hook", Feet: "Thief's Meteor Boots" },
            bonus2pc: "Increases Break Effect by 16%.",
            bonus4pc: "Increases the wearer's Break Effect by 16%. After the wearer inflicts Weakness Break on an enemy, regenerates 3 Energy."
        },
        {
            name: "Warrior Goddess of Sun and Thunder",
            id: 125,
            pieces: { Head: "Warrior Goddess's Winged Helm", Hands: "Warrior Goddess's Cavalry Gauntlets", Body: "Warrior Goddess's Dawn Cape", Feet: "Warrior Goddess's Honor Spurs" },
            bonus2pc: "Increases SPD by 6%.",
            bonus4pc: "When the wearer or their memosprite provides healing to ally targets other than themselves, the wearer gains \"Gentle Rain,\" which lasts for 2 turn(s) and can only trigger once per turn. While the wearer has \"Gentle Rain,\" SPD increases by 6% and all allies' CRIT DMG increases by 15%. This effect cannot stack."
        },
        {
            name: "Wastelander of Banditry Desert",
            id: 112,
            pieces: { Head: "Wastelander's Breathing Mask", Hands: "Wastelander's Desert Terminal", Body: "Wastelander's Friar Robe", Feet: "Wastelander's Powered Greaves" },
            bonus2pc: "Increases Imaginary DMG by 10%.",
            bonus4pc: "When attacking debuffed enemies, the wearer's CRIT Rate increases by 10%, and their CRIT DMG increases by 20% against Imprisoned enemies."
        },
        {
            name: "Watchmaker, Master of Dream Machinations",
            id: 118,
            pieces: { Head: "Watchmaker's Telescoping Lens", Hands: "Watchmaker's Fortuitous Wristwatch", Body: "Watchmaker's Illusory Formal Suit", Feet: "Watchmaker's Dream-Concealing Dress Shoes" },
            bonus2pc: "Increases Break Effect by 16%.",
            bonus4pc: "When the wearer uses their Ultimate on an ally, all allies' Break Effect increases by 30% for 2 turn(s). This effect cannot be stacked."
        },
        {
            name: "Wavestrider Captain",
            id: 126,
            pieces: { Head: "Captain's Navigator Hat", Hands: "Captain's Lightcatcher Astrolabe", Body: "Captain's Wind Mantle", Feet: "Captain's Tidal Boots" },
            bonus2pc: "Increases CRIT DMG by 16%.",
            bonus4pc: "When the wearer becomes the target of another ally target's ability, gains 1 stack of \"Help,\" stacking up to 2 time(s). If there are 2 stack(s) of \"Help\" when the wearer uses their Ultimate, consumes all \"Help\" to increase the wearer's ATK by 48% for 1 turn(s)."
        },
        {
            name: "World-Remaking Deliverer",
            id: 127,
            pieces: { Head: "Deliverer's Hood", Hands: "Deliverer's Sword Gauntlet", Body: "Deliverer's Robe of Legacy", Feet: "Deliverer's Boots of Pioneering" },
            bonus2pc: "Increases CRIT Rate by 8%.",
            bonus4pc: "After the wearer uses Basic ATK or Skill, if the wearer's memosprite is on the field, increases Max HP of the wearer and their memosprite by 24%, and increases all allies' DMG by 15% until the wearer's next Basic ATK or Skill."
        },
    ],
    // NOTE: Planar piece names are approximate placeholders — update when confirmed.
    planar: [
        {
            name: "Amphoreus, The Eternal Land",
            id: 323,
            pieces: { "Planar Sphere": "Amphoreus's Titan Heart", "Link Rope": "Amphoreus's Eternal Chain" },
            bonus2pc: "Increases the wearer's CRIT Rate by 8%. While the wearer's memosprite is on the field, increases all allies' SPD by 8%. This effect cannot be stacked.",
            bonus4pc: ""
        },
        {
            name: "Arcadia of Woven Dreams",
            id: 321,
            pieces: { "Planar Sphere": "Arcadia's Dream Globe", "Link Rope": "Arcadia's Silken Tether" },
            bonus2pc: "When there are currently more or less than 4 ally targets in battle, each additional/missing ally target increases the wearer and their memosprite's DMG by 9%/12%, up to a maximum of 4/3 stacks.",
            bonus4pc: ""
        },
        {
            name: "Belobog of the Architects",
            id: 304,
            pieces: { "Planar Sphere": "Belobog's Iron Defensive Wall", "Link Rope": "Belobog's Foundation Bolt" },
            bonus2pc: "Increases the wearer's DEF by 15%. When the wearer's Effect Hit Rate is 50% or higher, the wearer gains an extra 15% DEF.",
            bonus4pc: ""
        },
        {
            name: "Bone Collection's Serene Demesne",
            id: 319,
            pieces: { "Planar Sphere": "Bone Collection's Serene Glass", "Link Rope": "Bone Collection's Silence Chain" },
            bonus2pc: "Increases the wearer's Max HP by 12%. When the wearer's Max HP is 5000 or higher, increases the wearer's and their memosprite's CRIT DMG by 28%.",
            bonus4pc: ""
        },
        {
            name: "Broken Keel",
            id: 310,
            pieces: { "Planar Sphere": "Insumousu's Whalefall Ship", "Link Rope": "Insumousu's Frayed Hawser" },
            bonus2pc: "Increases the wearer's Effect RES by 10%. When the wearer's Effect RES is at 30% or higher, all allies' CRIT DMG increases by 10%.",
            bonus4pc: ""
        },
        {
            name: "Celestial Differentiator",
            id: 305,
            pieces: { "Planar Sphere": "Planet Screwllum's Mechanical Sun", "Link Rope": "Planet Screwllum's Ring System" },
            bonus2pc: "Increases the wearer's CRIT DMG by 16%. When the wearer's current CRIT DMG reaches 120% or higher, after entering battle, the wearer's CRIT Rate increases by 60% until the end of their first attack.",
            bonus4pc: ""
        },
        {
            name: "City of Converging Stars",
            id: 326,
            pieces: { "Planar Sphere": "City of Converging Stars' Orbital Lens", "Link Rope": "City of Converging Stars' Gravity Anchor" },
            bonus2pc: "When the wearer uses a Follow-Up ATK, increases their ATK by 24% for 2 turns. When an enemy target is defeated, increases CRIT DMG for all allies by 12% for the rest of the current battle. This effect cannot stack.",
            bonus4pc: ""
        },
        {
            name: "Duran, Dynasty of Running Wolves",
            id: 315,
            pieces: { "Planar Sphere": "Duran's Tent of Golden Sky", "Link Rope": "Duran's Mechabeast Bridle" },
            bonus2pc: "When an ally uses follow-up attacks, the wearer gains 1 stack of Merit, stacking up to 5 time(s). Each stack of Merit increases the DMG dealt by the wearer's follow-up attacks by 5%. When there are 5 stacks, additionally increases the wearer's CRIT DMG by 25%.",
            bonus4pc: ""
        },
        {
            name: "Firmament Frontline: Glamoth",
            id: 311,
            pieces: { "Planar Sphere": "Glamoth's Iron Cavalry Regiment", "Link Rope": "Glamoth's Silent Tombstone" },
            bonus2pc: "Increases the wearer's ATK by 12%. When the wearer's SPD is equal to or higher than 135/160, the wearer deals 12%/18% more DMG.",
            bonus4pc: ""
        },
        {
            name: "Fleet of the Ageless",
            id: 302,
            pieces: { "Planar Sphere": "The Xianzhou Luofu's Celestial Ark", "Link Rope": "The Xianzhou Luofu's Ambrosial Arbor Vines" },
            bonus2pc: "Increases the wearer's Max HP by 12%. When the wearer's SPD reaches 120 or higher, all allies' ATK increases by 8%.",
            bonus4pc: ""
        },
        {
            name: "Forge of the Kalpagni Lantern",
            id: 316,
            pieces: { "Planar Sphere": "Forge's Lotus Lantern Wick", "Link Rope": "Forge's Heavenly Flamewheel Silk" },
            bonus2pc: "Increases the wearer's SPD by 6%. When the wearer hits an enemy target that has Fire Weakness, the wearer's Break Effect increases by 40%, lasting for 1 turn(s).",
            bonus4pc: ""
        },
        {
            name: "Giant Tree of Rapt Brooding",
            id: 320,
            pieces: { "Planar Sphere": "Giant Tree's Protective Shade", "Link Rope": "Giant Tree's Root Network" },
            bonus2pc: "Increases the wearer's SPD by 6%. When the wearer's Speed is 135/180 or higher, increases the wearer and their memosprite's Outgoing Healing by 12%/20%.",
            bonus4pc: ""
        },
        {
            name: "Inert Salsotto",
            id: 306,
            pieces: { "Planar Sphere": "Salsotto's Moving City", "Link Rope": "Salsotto's Termination Decree" },
            bonus2pc: "Increases the wearer's CRIT Rate by 8%. When the wearer's current CRIT Rate reaches 50% or higher, the wearer's Ultimate and follow-up attack DMG increases by 15%.",
            bonus4pc: ""
        },
        {
            name: "Izumo Gensei and Takama Divine Realm",
            id: 314,
            pieces: { "Planar Sphere": "Izumo's Magatama of Ancient Standing", "Link Rope": "Izumo's Sacred Seal" },
            bonus2pc: "Increases the wearer's ATK by 12%. When entering battle, if at least one other ally follows the same Path as the wearer, then the wearer's CRIT Rate increases by 12%.",
            bonus4pc: ""
        },
        {
            name: "Lushaka, the Sunken Seas",
            id: 317,
            pieces: { "Planar Sphere": "Lushaka's Waterscape", "Link Rope": "Lushaka's Tidal Pendant" },
            bonus2pc: "Increases the wearer's Energy Regeneration Rate by 5%. If the wearer is not the first character in the team lineup, then increases the ATK of the first character in the team lineup by 12%.",
            bonus4pc: ""
        },
        {
            name: "Pan-Cosmic Commercial Enterprise",
            id: 303,
            pieces: { "Planar Sphere": "IPC's Mega HQ", "Link Rope": "IPC's Work Permit" },
            bonus2pc: "Increases the wearer's Effect Hit Rate by 10%. Meanwhile, the wearer's ATK increases by an amount that is equal to 25% of the current Effect Hit Rate, up to a maximum of 25%.",
            bonus4pc: ""
        },
        {
            name: "Penacony, Land of the Dreams",
            id: 312,
            pieces: { "Planar Sphere": "Penacony's Grand Hotel Suite", "Link Rope": "Dream's Montage" },
            bonus2pc: "Increases wearer's Energy Regeneration Rate by 5%. Increases DMG by 10% for all other allies that are of the same Type as the wearer.",
            bonus4pc: ""
        },
        {
            name: "Punklorde Stage Zero",
            id: 325,
            pieces: { "Planar Sphere": "Punklorde's Infinite Neon Globe", "Link Rope": "Punklorde's Frenzy Cord" },
            bonus2pc: "Increases the wearer's Elation by 8%. When Elation reaches 40%/80% for the first time in battle, increases the wearer's CRIT DMG by 20%/32%.",
            bonus4pc: ""
        },
        {
            name: "Revelry by the Sea",
            id: 322,
            pieces: { "Planar Sphere": "Revelry's Festival Lantern", "Link Rope": "Revelry's Anchor Rope" },
            bonus2pc: "Increases the wearer's ATK by 12%. When the wearer's ATK is higher than or equal to 2,400/3,600, increases the DoT DMG dealt by 12%/24%.",
            bonus4pc: ""
        },
        {
            name: "Rutilant Arena",
            id: 309,
            pieces: { "Planar Sphere": "Moment of Victory", "Link Rope": "Squirming Core" },
            bonus2pc: "Increases the wearer's CRIT Rate by 8%. When the wearer's current CRIT Rate reaches 70% or higher, the wearer's Basic ATK and Skill DMG increase by 20%.",
            bonus4pc: ""
        },
        {
            name: "Sigonia, the Unclaimed Desolation",
            id: 313,
            pieces: { "Planar Sphere": "Sigonia's Gaiathra Beryl", "Link Rope": "Sigonia's Knot of Cyclicness" },
            bonus2pc: "Increases the wearer's CRIT Rate by 4%. When an enemy target gets defeated, the wearer's CRIT DMG increases by 4%, stacking up to 10 time(s).",
            bonus4pc: ""
        },
        {
            name: "Space Sealing Station",
            id: 301,
            pieces: { "Planar Sphere": "Herta's Space Station's Exterior", "Link Rope": "Herta's Space Station's Tether" },
            bonus2pc: "Increases the wearer's ATK by 12%. When the wearer's SPD reaches 120 or higher, the wearer's ATK increases by an extra 12%.",
            bonus4pc: ""
        },
        {
            name: "Sprightly Vonwacq",
            id: 308,
            pieces: { "Planar Sphere": "Vonwacq's Island of Birth", "Link Rope": "Vonwacq's Whalefall Rope" },
            bonus2pc: "Increases the wearer's Energy Regeneration Rate by 5%. When the wearer's SPD reaches 120 or higher, the wearer's action is Advanced Forward by 40% immediately upon entering battle.",
            bonus4pc: ""
        },
        {
            name: "Talia: Kingdom of Banditry",
            id: 307,
            pieces: { "Planar Sphere": "Talia's Exposed Electric Wire", "Link Rope": "Talia's Nailscrap Town" },
            bonus2pc: "Increases the wearer's Break Effect by 16%. When the wearer's SPD reaches 145 or higher, the wearer's Break Effect increases by an extra 20%.",
            bonus4pc: ""
        },
        {
            name: "Tengoku Livestream",
            id: 324,
            pieces: { "Planar Sphere": "Tengoku's Streaming Lens", "Link Rope": "Tengoku's Lucky Charm" },
            bonus2pc: "Increases the wearer's CRIT DMG by 16%. If 3 or more Skill Points are consumed in the same turn, additionally increases the wearer's CRIT DMG by 32% for 3 turns.",
            bonus4pc: ""
        },
        {
            name: "The Wondrous BananAmusement Park",
            id: 318,
            pieces: { "Planar Sphere": "BananAmusement Park's Toto-Balloon", "Link Rope": "BananAmusement Park's Commemorative Ticket" },
            bonus2pc: "Increases the wearer's CRIT DMG by 16%. When a target summoned by the wearer is on the field, CRIT DMG additionally increases by 32%.",
            bonus4pc: ""
        },
    ]
};
