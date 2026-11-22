// Community-maintained reference data. Last manually reviewed: 2026-11-21 (Season 11).
// Keep official ability information and balance changes up to date before competitive use.
const ROSTER_BY_ROLE = {
  Vanguard: ['Angela','Captain America','Devil Dinosaur','Doctor Strange','Emma Frost','Groot','Hulk','Magneto','Peni Parker','Rogue','The Hood','The Thing','Thor','Venom'],
  Duelist: ['Black Cat','Black Panther','Black Widow','Blade','Cyclops','Daredevil','Elsa Bloodstone','Gorr','Hawkeye','Hela','Human Torch','Iron Fist','Iron Man','Magik','Mister Fantastic','Moon Knight','Namor','Phoenix','Psylocke','Scarlet Witch','Spider-Man','Squirrel Girl','Star-Lord','Storm','The Punisher','Winter Soldier','Wolverine'],
  Strategist: ['Adam Warlock','Cloak & Dagger','Gambit','Invisible Woman','Jeff the Land Shark','Jubilee','Loki','Luna Snow','Mantis','Nightcrawler','Rocket Raccoon','Ultron','White Fox'],
  Flex: ['Deadpool']
};
const ROLE_TACTICS = {
  Vanguard: {summary:'Frontline presence, space control and team protection.', focus:['Space making','Peel','Defensive setup'], abbreviation:'VAN'},
  Duelist: {summary:'Pressure, picks and finishing power to win teamfights.', focus:['Angles','Target priority','Engage timing'], abbreviation:'DUE'},
  Strategist: {summary:'Sustain, utility and fight-enabling cooldowns.', focus:['Cooldown trading','Positioning','Ultimate tracking'], abbreviation:'STR'},
  Flex: {summary:'Adaptable hero that can switch between all three roles.', focus:['Role flexibility','Team needs','Adaptation'], abbreviation:'FLX'}
};
const PROFILE_DATA = {
  'Doctor Strange': {playstyle:'Protect a push, manipulate sightlines and coordinate team-wide rotations.', abilities:[['Pentagram of Farallah','Create portals that teammates and other units can travel through.'],['Shield of the Seraphim','Deploy a barrier to help the team weather incoming damage.']]},
  'Luna Snow': {playstyle:'Anchor a sustain-heavy backline and plan around her fight-swinging ultimate.', abilities:[['Fate of Both Worlds','Area ultimate that switches between team healing and damage amplification.'],['Absolute Zero','Freeze a target with an ice projectile.']]},
  'Spider-Man': {playstyle:'Pressure isolated targets and time dives alongside your frontline.', abilities:[['Spectacular Spin','Damage and stun enemies around Spider-Man.'],['Web-Swing','Quickly reposition using swinging mobility.']]},
  'Magneto': {playstyle:'Control dangerous sightlines and keep vulnerable teammates protected.', abilities:[['Metallic Curtain','Create a mobile magnetic barrier that blocks incoming projectiles.'],['Mag-Cannon','Launch stored metallic energy in a burst.']]},
  'Mantis': {playstyle:'Manage healing and buffs while staying safe behind your team.', abilities:[['Soul Resurgence','Ultimate that grants nearby allies healing over time and movement speed.']]},
  'Iron Man': {playstyle:'Take advantageous off-angles and pressure from the air.', abilities:[['Invincible Pulse Cannon','Powerful energy beam ultimate.'],['Armor Overdrive','Amplify Iron Man’s attack capabilities.']]},
  'Loki': {playstyle:'Use illusions to complicate target selection and protect the backline.', abilities:[['Deception','Enter stealth and create an illusion.'],['God of Mischief','Transform into another hero and use their non-team-up abilities.']]},
  'Peni Parker': {playstyle:'Set traps and deny entrances before the enemy commits to a push.', abilities:[['Bionic Spider-Nest','Deploy a nest that supports area control.'],['Spider-Sweeper','Ultimate that charges through enemies and repeatedly deploys mines and webs.']]},
  'Groot': {playstyle:'Use walls to split teams, isolate targets and shape the battlefield.', abilities:[['Strangling Prison','Group and imprison nearby enemies with a massive vine cluster.']]},
  'Jeff the Land Shark': {playstyle:'Support teammates through flexible healing and disruptive engages.', abilities:[["It's Jeff!",'Swallow units within an area during Jeff’s ultimate.'],['Healing Bubble','Create a healing pickup for allies.']]},
  'Venom': {playstyle:'Dive the enemy backline, create pressure and escape before being focused.', abilities:[['Feast of the Abyss','Burrow and emerge in a damaging ultimate attack.']]}
};
const HEROES = Object.entries(ROSTER_BY_ROLE).flatMap(([role,names])=> names.map(name => ({
  id: name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''),
  name, role,
  ...(PROFILE_DATA[name] || {})
}))).sort((a,b)=>a.name.localeCompare(b.name));
const HERO_BY_ID = Object.fromEntries(HEROES.map(h=>[h.id,h]));
// Add your own PNGs under assets/maps/<id>.png; the selector loads them automatically.
// Real images are supplied by the site owner (not bundled with this fan-made starter).

// Remote artwork credits: default hero avatar images surfaced by rivals.gs / cdn.source.gs.
// Images remain copyright of Marvel / NetEase; remote access requires internet.
// Full mechanics: official https://www.marvelrivals.com/heroes/ and rivals.gs.
const HERO_ART = {
  "Nightcrawler": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10680010-avatar-0dd78d.webp",
  "Gorr": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10670010-avatar-789d44.webp",
  "The Hood": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10660010-avatar-cbb31b.webp",
  "Jubilee": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10640010-avatar-3048cd.webp",
  "Cyclops": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10630010-avatar-fe6157.webp",
  "Devil Dinosaur": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10620010-avatar-71334b.webp",
  "Black Cat": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10610010-avatar-4fecab.webp",
  "White Fox": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10600010-avatar-0dcb08.webp",
  "Elsa Bloodstone": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10590010-avatar-30c037.webp",
  "Deadpool": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10570010-avatar-b67b1d.webp",
  "Rogue": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10650010-avatar-fee34a.webp",
  "Gambit": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10580010-avatar-46f006.webp",
  "Daredevil": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10550010-avatar-4cff90.webp",
  "Angela": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10560010-avatar-1e8947.webp",
  "Blade": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10440010-avatar-690a91.webp",
  "Phoenix": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10540010-avatar-d4fc4f.webp",
  "Emma Frost": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10530010-avatar-75d2f7.webp",
  "Ultron": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10280010-avatar-24b20c.webp",
  "Human Torch": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10170010-avatar-6e3bf5.webp",
  "The Thing": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10510010-avatar-d4f14b.webp",
  "Mister Fantastic": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10400010-avatar-09fd4e.webp",
  "Invisible Woman": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10500010-avatar-11aeba.webp",
  "Iron Fist": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10520010-avatar-1dc45d.webp",
  "Wolverine": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10490010-avatar-0759ca.webp",
  "Psylocke": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10480010-avatar-20212a.webp",
  "Jeff the Land Shark": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10470010-avatar-dd5547.webp",
  "Namor": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10450010-avatar-9c7289.webp",
  "Star-Lord": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10430010-avatar-36f37e.webp",
  "Peni Parker": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10420010-avatar-09715c.webp",
  "Winter Soldier": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10410010-avatar-be589c.webp",
  "Thor": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10390010-avatar-b9eb60.webp",
  "Scarlet Witch": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10380010-avatar-ebe172.webp",
  "Magneto": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10370010-avatar-1c8116.webp",
  "Venom": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10350010-avatar-d5c604.webp",
  "Iron Man": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10340010-avatar-78a624.webp",
  "Black Widow": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10330010-avatar-59b22a.webp",
  "Squirrel Girl": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10320010-avatar-3e55fa.webp",
  "Luna Snow": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10310010-avatar-6bff83.webp",
  "Moon Knight": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10300010-avatar-d6c319.webp",
  "Magik": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10290010-avatar-52ad81.webp",
  "Groot": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10270010-avatar-e4b57f.webp",
  "Black Panther": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10260010-avatar-a8a0bc.webp",
  "Cloak & Dagger": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10250010-avatar-73e81a.webp",
  "Hela": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10240010-avatar-441cb6.webp",
  "Rocket Raccoon": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10230010-avatar-3c9ebd.webp",
  "Captain America": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10220010-avatar-5de0fb.webp",
  "Hawkeye": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10210010-avatar-2350d7.webp",
  "Mantis": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10200010-avatar-e37bfe.webp",
  "Doctor Strange": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10180010-avatar-8e5396.webp",
  "Loki": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10160010-avatar-44ce46.webp",
  "Storm": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10150010-avatar-0aaccf.webp",
  "The Punisher": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10140010-avatar-094f12.webp",
  "Hulk": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10110011-avatar-9deaf2.webp",
  "Adam Warlock": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10460010-avatar-89c71e.webp",
  "Spider-Man": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10360010-avatar-3d57b9.webp"
};
const HERO_OVERVIEWS = {
  "Adam Warlock": "Soul-linked healing and a resurrection-focused ultimate make him useful for coordinated resets.",
  "Angela": "An aggressive aerial frontline pick who threatens backlines and creates entry space.",
  "Black Cat": "An evasive skirmisher who relies on burst windows and misdirection.",
  "Black Panther": "Fast melee flank pressure; chain mobility carefully to avoid being stranded.",
  "Black Widow": "Long-range precision and repositioning; excels when teammates create clear sightlines.",
  "Blade": "An aggressive melee duelist built around sustained close-range pressure.",
  "Captain America": "Mobile frontline initiator whose shield and dives disrupt enemy aim.",
  "Cloak & Dagger": "Dual-form support mixing healing zones with disruptive darkness.",
  "Cyclops": "Ranged pressure hero whose blasts and positioning demand precise target focus.",
  "Daredevil": "Close-range engagement and information-oriented play; punish exposed angles.",
  "Deadpool": "Multi-role wildcard; coordinate his selected form with your team composition.",
  "Devil Dinosaur": "Large frontline threat best used to claim space and force cooldowns.",
  "Doctor Strange": "Defensive shields and team portals enable safe pushes and surprise rotations.",
  "Elsa Bloodstone": "Weapon-focused hunter with strong burst potential and lane control.",
  "Emma Frost": "A durable frontline controller who can pressure opponents with alternate forms.",
  "Gambit": "Versatile support whose card tricks offer team utility and flexibility.",
  "Gorr": "A hard-hitting close-range specialist whose abilities reward coordinated engages.",
  "Groot": "Deployable walls block sightlines, divide teams and protect objective positions.",
  "Hawkeye": "Long-range projectile picks can start a fight before the enemy can close distance.",
  "Hela": "Consistent ranged damage with excellent finishing potential from protected angles.",
  "Hulk": "Brawler who creates openings by diving and absorbing attention.",
  "Human Torch": "Area denial and aerial damage help pressure static teams off objectives.",
  "Invisible Woman": "Protective utility and crowd control keep allies alive through contested pushes.",
  "Iron Fist": "Close-range pursuit duelist; select targets without getting trapped on the flank.",
  "Iron Man": "Flying damage dealer who punishes clustered teams but needs safe airspace.",
  "Jeff the Land Shark": "Mobile healer with emergency healing tools and disruptive ultimate potential.",
  "Jubilee": "A support whose tempo and teamfight utility reward grouped coordination.",
  "Loki": "Healing, illusions and deception make him flexible but position-dependent.",
  "Luna Snow": "Long-range healing plus a teamfight-saving ultimate; protects clustered allies.",
  "Magik": "Melee skirmisher with teleports and invulnerability windows for precise dives.",
  "Magneto": "Shield-based frontline that controls sightlines and absorbs projectile pressure.",
  "Mantis": "Heals, buffs and crowd control make her a strong backline enabler.",
  "Mister Fantastic": "Elastic mid-range duelist who stretches and disrupts grouped fights.",
  "Moon Knight": "Projectile damage can ricochet through clustered opponents around his setups.",
  "Namor": "Turret-based ranged pressure; place summons to control contested lanes.",
  "Nightcrawler": "Teleporting support with healing and coordinated ally repositioning.",
  "Peni Parker": "Sets spider nests and traps to secure a defensive hold.",
  "Phoenix": "High-impact ranged damage and mobility that rewards precise offensive timing.",
  "Psylocke": "Stealthy flanker relying on short burst windows and clean exits.",
  "Rocket Raccoon": "Engineer-style strategist with healing and team-support deployables.",
  "Rogue": "Frontline brawler whose power-stealing playstyle rewards smart target selection.",
  "Scarlet Witch": "Chaos magic damage and mobility; beware of long exposed channels.",
  "Spider-Man": "Extreme mobility and burst pressure against isolated targets.",
  "Squirrel Girl": "Area splash and unpredictable angles punish grouped opponents.",
  "Star-Lord": "Mobile sustained-fire duelist who excels during short engagement windows.",
  "Storm": "Flying team-buff duelist who amplifies allies while pressuring lanes.",
  "The Hood": "Frontline power hero with strong zone pressure and brawling presence.",
  "The Punisher": "Sustained fire and weapon swaps shred exposed lanes and stationary targets.",
  "The Thing": "Durable dive and anti-displacement presence that helps secure space.",
  "Thor": "Frontline bruiser using melee pressure and Thorforce to control an engage.",
  "Ultron": "Flying strategist deploying healing and damage from favorable angles.",
  "Venom": "Dive frontline with crowd pressure; coordinate entry and escape.",
  "White Fox": "Mobile support with shapeshifting potential and clutch team utility.",
  "Winter Soldier": "Mid-range picks and combo abilities pull exposed enemies into danger.",
  "Wolverine": "Close-range anti-tank pressure backed by self-sustain and displacement."
};
const HERO_EXTRA_ABILITIES = {
  "Adam Warlock": [
    [
      "Karmic Revival",
      "Brings defeated nearby teammates back into a fight."
    ],
    [
      "Soul Bond",
      "Links allies so incoming damage is shared between connected heroes."
    ],
    [
      "Avatar Life Stream",
      "Channels healing toward an ally and nearby teammates."
    ]
  ],
  "Nightcrawler": [
    [
      "Forged Brimstone",
      "Throws explosive projectiles that hurt foes while restoring allies."
    ],
    [
      "Swift Intervention",
      "Teleports to a teammate and gives immediate and continuing support."
    ],
    [
      "Tandem Teleport",
      "Swaps positions with an invited ally while providing sustain and speed."
    ],
    [
      "Phasing Finale",
      "Groups up allied teleports and sets up a follow-up area attack."
    ]
  ],
  "Captain America": [
    [
      "Living Legend",
      "Raises a shield that deflects incoming projectiles."
    ],
    [
      "Freedom Charge",
      "A frontline charge that helps begin an engagement."
    ]
  ],
  "Iron Man": [
    [
      "Invincible Pulse Cannon",
      "Channels a devastating energy blast at a targeted area."
    ],
    [
      "Armor Overdrive",
      "Boosts his damaging attacks for a pressure window."
    ]
  ],
  "Groot": [
    [
      "Thornlash Wall",
      "Raises a wall that interferes with enemy routes and angles."
    ],
    [
      "Strangling Prison",
      "Gathers opponents together for allied follow-up damage."
    ]
  ],
  "Luna Snow": [
    [
      "Absolute Zero",
      "Launches an ice attack that can freeze an enemy."
    ],
    [
      "Fate of Both Worlds",
      "Cycles between group healing and a damage boost."
    ]
  ],
  "Peni Parker": [
    [
      "Bionic Spider-Nest",
      "Places an area-control nest supporting a defensive setup."
    ],
    [
      "Spider-Sweeper",
      "Rushes through the battlefield scattering hazards."
    ]
  ],
  "Venom": [
    [
      "Feast of the Abyss",
      "Burrows and erupts into a damaging ambush."
    ]
  ],
  "Spider-Man": [
    [
      "Web-Swing",
      "Uses webs to quickly reposition and start dives."
    ],
    [
      "Spectacular Spin",
      "Damages and stuns opponents around him."
    ]
  ],
  "Magneto": [
    [
      "Metallic Curtain",
      "Protects a line of sight with a movable magnetic barrier."
    ],
    [
      "Mag-Cannon",
      "Expends stored energy in a direct projectile burst."
    ]
  ],
  "Loki": [
    [
      "Deception",
      "Creates an illusion while hiding his true position."
    ],
    [
      "God of Mischief",
      "Copies another hero and uses their available abilities."
    ]
  ],
  "Jeff the Land Shark": [
    [
      "Healing Bubble",
      "Creates a pickup that can heal teammates."
    ],
    [
      "It’s Jeff!",
      "Swallows nearby units before carrying them away."
    ]
  ],
  "Mantis": [
    [
      "Soul Resurgence",
      "Grants nearby teammates sustained healing and movement speed."
    ]
  ],
  "Hela": [
    [
      "Nastrond Crowstorm",
      "Transforms her movement into a flock of crows to reposition."
    ],
    [
      "Goddess of Death",
      "Ascends to fire powerful ranged attacks from above."
    ]
  ],
  "Hawkeye": [
    [
      "Piercing Arrow",
      "Charges a long-range arrow for precision damage."
    ],
    [
      "Hunter’s Sight",
      "An ultimate that creates echo-like targets on moving enemies."
    ]
  ],
  "Rocket Raccoon": [
    [
      "Repair Mode",
      "Launches bouncing projectiles that heal allies."
    ],
    [
      "B.R.B.",
      "Deploys a beacon to help teammates get back in the fight."
    ]
  ],
  "Cloak & Dagger": [
    [
      "Dagger Storm",
      "Creates an area that heals allies over time."
    ],
    [
      "Dark Teleportation",
      "Briefly conceals allies in a protective darkness effect."
    ]
  ],
  "Moon Knight": [
    [
      "Ancient Ankh",
      "Places a construct that helps ricochet his ranged attacks."
    ],
    [
      "Hand of Khonshu",
      "Summons a large area of repeated attacks."
    ]
  ],
  "Thor": [
    [
      "Thorforce",
      "Consumes or restores power through his connected skills."
    ],
    [
      "God of Thunder",
      "Leaps high and slams down with lightning damage."
    ]
  ],
  "Black Panther": [
    [
      "Spirit Rend",
      "Dashes through enemies and rewards tagging marked targets."
    ],
    [
      "Spear Toss",
      "Throws a spear that marks enemies for follow-up."
    ]
  ],
  "Winter Soldier": [
    [
      "Bionic Hook",
      "Pulls an enemy into a dangerous close-range follow-up."
    ],
    [
      "Kraken Impact",
      "Executes a leap and slam that can reset on takedowns."
    ]
  ],
  "Doctor Strange": [
    [
      "Pentagram of Farallah",
      "Creates a two-way portal for coordinated rotations."
    ],
    [
      "Shield of the Seraphim",
      "Shields teammates from incoming fire."
    ]
  ],
  "Invisible Woman": [
    [
      "Guardian Shield",
      "Places a protective barrier that helps teammates hold positions."
    ],
    [
      "Invisible Boundary",
      "Conceals nearby allies and provides teamfight utility."
    ]
  ],
  "Squirrel Girl": [
    [
      "Burst Acorn",
      "Fires explosive projectiles to pressure grouped enemies."
    ],
    [
      "Unbeatable Squirrel Tsunami",
      "Sends a rushing wave of squirrels through a target area."
    ]
  ],
  "Psylocke": [
    [
      "Psychic Stealth",
      "Conceals herself for a short attack or escape window."
    ],
    [
      "Dance of the Butterfly",
      "Uses repeated slashes across nearby enemies."
    ]
  ],
  "Wolverine": [
    [
      "Feral Leap",
      "Grabs and carries an enemy during a leap."
    ],
    [
      "Regenerative Healing Factor",
      "Survives otherwise lethal bursts through a self-heal mechanic."
    ]
  ]
};
// Short, independent ability descriptions grounded in character reference pages.
const HERO_SUPPLEMENTAL_ABILITIES = {
  "Angela": [
    [
      "Spear of Ichors",
      "A charged spear thrust that can lift enemies when fully powered."
    ],
    [
      "Shielded Stance",
      "Blocks incoming damage and builds charge for her weapon attacks."
    ],
    [
      "Assassin’s Charge",
      "Dashes into enemies and carries a direct-hit target along her route."
    ]
  ],
  "Black Cat": [
    [
      "Turn of Fortune",
      "Grapples toward a target and steals the Fortune resource."
    ],
    [
      "Cat’s Cradle",
      "Cuts through enemies with a forward claw dash."
    ],
    [
      "Malkin Misfortune",
      "Places Jinx on struck enemies, interfering with some critical-hit bonuses."
    ]
  ],
  "Black Widow": [
    [
      "Assassin’s Focus",
      "Switches her rifle to a stronger long-range sniper shot."
    ],
    [
      "Fleet Foot",
      "Dashes and enables a boosted jump for repositioning."
    ],
    [
      "Electro-Plasma Blast",
      "Detonates a projectile that slows enemies in the impact area."
    ]
  ],
  "Blade": [
    [
      "Daywalker Dash",
      "Dashes forward; his equipped weapon determines a slow or healing-reduction follow-up."
    ],
    [
      "Bloodline Awakening",
      "Trades some incoming healing for faster melee pressure and lifesteal."
    ],
    [
      "Scarlet Shroud",
      "Parries frontal attacks and shortens his dash cooldown."
    ]
  ],
  "Cyclops": [
    [
      "Concussive Beam",
      "Channels a beam that can refract between walls and enemies."
    ],
    [
      "Ricochet Force",
      "Fires a wall-bouncing tracking beam while generating bonus health."
    ],
    [
      "Ruby Rage",
      "Releases a broad optic blast that breaks barriers and triggers further explosions."
    ]
  ],
  "Daredevil": [
    [
      "Radar Sense",
      "Reveals nearby enemy movement information."
    ],
    [
      "Sonic Pursuit",
      "Tracks a chosen target, closes in and briefly blinds them."
    ],
    [
      "Objection!",
      "Enters a guarded stance that blocks frontal threats and returns projectiles."
    ]
  ],
  "Deadpool": [
    [
      "Bunny Hop",
      "Double-jumps; stomping enemies generates protective bonus health."
    ],
    [
      "Upgrade!",
      "Builds experience through combat to unlock stronger ability choices."
    ],
    [
      "Healing Factor",
      "Recovers outside combat and can briefly survive fatal bursts."
    ]
  ],
  "Devil Dinosaur": [
    [
      "Primal Bite",
      "Applies a bleeding effect with damage based partly on the target’s health."
    ],
    [
      "Savage Predation",
      "Pounces on enemies and can throw targets already suffering bleed."
    ],
    [
      "Buddy Barrier",
      "Creates a spherical protective shield around the team."
    ]
  ],
  "Elsa Bloodstone": [
    [
      "Smoky Snare",
      "Plants a concealed trap that catches and damages enemies."
    ],
    [
      "Monster-Piercer",
      "Fires powerful penetrating rounds from her heavy firearm."
    ],
    [
      "Living Bullet",
      "Splits a fired round into tracking projectiles that mark nearby targets."
    ]
  ],
  "Emma Frost": [
    [
      "Mind’s Aegis",
      "Positions a floating barrier to defend a lane."
    ],
    [
      "Diamond Form",
      "Trades mobility for strong damage reduction and close-range durability."
    ],
    [
      "Psionic Seduction",
      "Sends a psychic wave that disrupts enemy ultimates and can draw enemies toward her."
    ]
  ],
  "Gambit": [
    [
      "Healing Hearts",
      "Switches to healing cards, enabling bounces and restorative area effects."
    ],
    [
      "Purifying Pick-Up",
      "Throws a healing card cluster that also clears negative effects."
    ],
    [
      "Bayou Bash",
      "Swings his staff to create a damaging shockwave that heals allies."
    ]
  ],
  "Gorr": [
    [
      "Necro-Power",
      "Fires symbiote energy and summons or redirects Black Berserkers toward enemies."
    ],
    [
      "Shadow Harvest",
      "Warps to a summoned Berserker, consuming it for health and a local explosion."
    ],
    [
      "Living Abyss",
      "Surges forward as a symbiote mass and creates a harmful zone."
    ]
  ],
  "Hulk": [
    [
      "Indestructible Guard",
      "Protects Hulk and nearby teammates with gamma-powered shields."
    ],
    [
      "Gamma Burst",
      "Launches gamma energy and helps shorten the shield cooldown."
    ],
    [
      "Incredible Leap",
      "A charged jump that lets Hulk engage or knock airborne enemies down."
    ]
  ],
  "Human Torch": [
    [
      "Blazing Blast",
      "Throws a fireball that can leave behind a persistent damaging flame field."
    ],
    [
      "Pyro-Prison",
      "Connects active flame fields into a dangerous fire wall."
    ],
    [
      "Plasma Body",
      "Dashes upward to change flight position rapidly."
    ]
  ],
  "Iron Fist": [
    [
      "Dragon’s Defense",
      "Blocks incoming pressure, then empowers a retaliation combo."
    ],
    [
      "Harmony Recovery",
      "Channels healing, with excess restoration becoming bonus health."
    ],
    [
      "K’un-Lun Kick",
      "Launches a flying kick with added pressure against weakened opponents."
    ]
  ],
  "Jubilee": [
    [
      "Energy Plasmoids",
      "Fires explosive light that damages enemies and restores teammates."
    ],
    [
      "Blooming Ball",
      "Sends out a growing orb that tracks and heals around its position."
    ],
    [
      "Dazzling Detonation",
      "Blasts an area with blinding energy or redirects support to an ally."
    ]
  ],
  "Magik": [
    [
      "Stepping Discs",
      "Teleports a short distance with invulnerability during the movement."
    ],
    [
      "Magik Slash",
      "Launches a sword-energy projectile and accelerates portal recovery on hit."
    ],
    [
      "Darkchild",
      "Transforms to strengthen her core abilities for a temporary engagement."
    ]
  ],
  "Mister Fantastic": [
    [
      "Distended Grip",
      "Grabs and pulls enemies using elastic arms, potentially colliding two targets."
    ],
    [
      "Flexible Elongation",
      "Stretches toward a target and can give teammates protective shields."
    ],
    [
      "Reflexive Rubber",
      "Absorbs damage with a stretched body, then returns the stored impact."
    ]
  ],
  "Namor": [
    [
      "Aquatic Dominion",
      "Places aquatic summons that automatically attack visible opponents."
    ],
    [
      "Wrath of the Seven Seas",
      "Throws a charged trident and commands summons to focus a struck target."
    ],
    [
      "Blessing of the Deep",
      "Gains temporary protection while rising into the air."
    ]
  ],
  "Phoenix": [
    [
      "Cosmic Flames",
      "Applies Spark marks that can trigger a damaging area explosion."
    ],
    [
      "Psionic Detonation",
      "Chains explosions over a marked area, disrupting targets caught inside."
    ],
    [
      "Telepathic Illusion",
      "Teleports while leaving an illusion that detonates behind her."
    ]
  ],
  "Rogue": [
    [
      "Defensive Stance",
      "Absorbs projectile pressure and powers her next frontal attack."
    ],
    [
      "Southern Brawl",
      "Charges out of her stance to damage and launch enemies."
    ],
    [
      "Chrono Kick Combo",
      "Dashes into a target and follows with a knockdown and enhanced strikes."
    ]
  ],
  "Scarlet Witch": [
    [
      "Chaos Control",
      "Drains opponents and restores energy for follow-up magical attacks."
    ],
    [
      "Chthonian Burst",
      "Spends energy on explosive magic projectiles."
    ],
    [
      "Mystic Projection",
      "Temporarily phases out and flies for repositioning."
    ]
  ],
  "Star-Lord": [
    [
      "Stellar Shift",
      "Dodges with a brief invulnerability window and reloads his weapons."
    ],
    [
      "Rocket Propulsion",
      "Accelerates through the air to chase or disengage."
    ],
    [
      "Blaster Barrage",
      "Sprays sustained fire into nearby targets."
    ]
  ],
  "Storm": [
    [
      "Weather Control",
      "Switches between allied movement and damage enhancement."
    ],
    [
      "Goddess Boost",
      "Amplifies her current weather stance with stronger movement or lightning."
    ],
    [
      "Omega Hurricane",
      "Pulls opponents into a damaging storm during her ultimate."
    ]
  ],
  "The Hood": [
    [
      "Mantle of Oblivion",
      "Expands his cloak into a protective bubble against incoming fire."
    ],
    [
      "Leaded Transformation",
      "Turns his arms into demonic rapid-fire weapons with lifesteal."
    ],
    [
      "Abyssal Veil",
      "Deploys a dark field that modifies incoming shots and disrupts nearby enemies."
    ]
  ],
  "The Punisher": [
    [
      "Culling Turret",
      "Mounts a forward-protected turret to maintain heavy sustained pressure."
    ],
    [
      "Vantage Connection",
      "Builds a zipline to reposition between established angles."
    ],
    [
      "Scourge Grenade",
      "Throws obscuring smoke and leaps away from pressure."
    ]
  ],
  "The Thing": [
    [
      "Yancy Street Charge",
      "Rushes into enemies, launching targets and disabling mobility in the landing zone."
    ],
    [
      "Embattled Leap",
      "Jumps to protect an ally with damage reduction."
    ],
    [
      "Clobberin’ Time",
      "Smashes forward to launch multiple enemies into the air."
    ]
  ],
  "Ultron": [
    [
      "Imperative: Patch",
      "Assigns healing drones to teammates for sustained support."
    ],
    [
      "Imperative: Firewall",
      "Empowers linked teammates and grants nearby allies bonus health."
    ],
    [
      "Dynamic Flight",
      "Surges through the air to establish a new firing and support angle."
    ]
  ],
  "White Fox": [
    [
      "Yeowoo Guseul",
      "Bounces a fox marble between targets, healing allies and hurting enemies."
    ],
    [
      "Spectral Surge",
      "Sends a fox spirit forward to heal teammates and charm opponents."
    ],
    [
      "Fox Form Awakening",
      "Empowers her tails and provides ongoing healing to surrounding allies."
    ]
  ]
};
HEROES.forEach(hero=>{
  hero.portrait=HERO_ART[hero.name] || '';
  hero.playstyle=HERO_OVERVIEWS[hero.name] || hero.playstyle || ROLE_TACTICS[hero.role].summary;
  const entries=[...(HERO_EXTRA_ABILITIES[hero.name]||[]),...(HERO_SUPPLEMENTAL_ABILITIES[hero.name]||[]),...(hero.abilities||[])];
  const seen=new Set();hero.abilities=entries.filter(a=>{const k=a[0].toLowerCase();if(seen.has(k))return false;seen.add(k);return true});
  hero.guide='https://rivals.gs/heroes/'+(hero.name==='Gorr'?'gorr-the-god-butcher':hero.name==='Hulk'?'bruce-banner':hero.id)+'/';
});

// Real supplied WebP overhead captures: mode -> map -> objective layout, exact ZIP contents.
const MAPS = [
  {id:'training',name:'Practice Arena',area:'Custom',mode:'Practice',type:'control',image:null},
  {"id": "convergence-central-park", "name": "Central Park", "area": "Central Park", "mode": "Convergence", "type": "hybrid", "image": "assets/maps/convergence/central-park.webp"},
  {"id": "convergence-hall-of-djalia", "name": "Hall Of Djalia", "area": "Hall Of Djalia", "mode": "Convergence", "type": "hybrid", "image": "assets/maps/convergence/hall-of-djalia.webp"},
  {"id": "convergence-heart-of-heaven", "name": "Heart Of Heaven", "area": "Heart Of Heaven", "mode": "Convergence", "type": "hybrid", "image": "assets/maps/convergence/heart-of-heaven.webp"},
  {"id": "convergence-shin-shibuya", "name": "Shin Shibuya", "area": "Shin Shibuya", "mode": "Convergence", "type": "hybrid", "image": "assets/maps/convergence/shin-shibuya.webp"},
  {"id": "convergence-symbiotic-surface", "name": "Symbiotic Surface", "area": "Symbiotic Surface", "mode": "Convergence", "type": "hybrid", "image": "assets/maps/convergence/symbiotic-surface.webp"},
  {"id": "convoy-arakko", "name": "Arakko", "area": "Arakko", "mode": "Convoy", "type": "escort", "image": "assets/maps/convoy/arakko.webp"},
  {"id": "convoy-midtown", "name": "Midtown", "area": "Midtown", "mode": "Convoy", "type": "escort", "image": "assets/maps/convoy/midtown.webp"},
  {"id": "convoy-spider-islands", "name": "Spider Islands", "area": "Spider Islands", "mode": "Convoy", "type": "escort", "image": "assets/maps/convoy/spider-islands.webp"},
  {"id": "convoy-thebes", "name": "Thebes", "area": "Thebes", "mode": "Convoy", "type": "escort", "image": "assets/maps/convoy/thebes.webp"},
  {"id": "convoy-yggdrasill-path", "name": "Yggdrasill Path", "area": "Yggdrasill Path", "mode": "Convoy", "type": "escort", "image": "assets/maps/convoy/yggdrasill-path.webp"},
  {"id": "domination-birnin-t-challa-imperial-institute-of-science", "name": "Imperial Institute Of Science", "area": "Birnin T'challa", "mode": "Domination", "type": "control", "image": "assets/maps/domination/birnin-t-challa/imperial-institute-of-science.webp"},
  {"id": "domination-birnin-t-challa-stellar-spaceport", "name": "Stellar Spaceport", "area": "Birnin T'challa", "mode": "Domination", "type": "control", "image": "assets/maps/domination/birnin-t-challa/stellar-spaceport.webp"},
  {"id": "domination-birnin-t-challa-warrior-falls", "name": "Warrior Falls", "area": "Birnin T'challa", "mode": "Domination", "type": "control", "image": "assets/maps/domination/birnin-t-challa/warrior-falls.webp"},
  {"id": "domination-celestial-husk-celestial-codex", "name": "Celestial Codex", "area": "Celestial Husk", "mode": "Domination", "type": "control", "image": "assets/maps/domination/celestial-husk/celestial-codex.webp"},
  {"id": "domination-celestial-husk-celestial-hand", "name": "Celestial Hand", "area": "Celestial Husk", "mode": "Domination", "type": "control", "image": "assets/maps/domination/celestial-husk/celestial-hand.webp"},
  {"id": "domination-celestial-husk-celestial-vault", "name": "Celestial Vault", "area": "Celestial Husk", "mode": "Domination", "type": "control", "image": "assets/maps/domination/celestial-husk/celestial-vault.webp"},
  {"id": "domination-god-quarry-confessional-eternity", "name": "Confessional Eternity", "area": "God Quarry", "mode": "Domination", "type": "control", "image": "assets/maps/domination/god-quarry/confessional-eternity.webp"},
  {"id": "domination-god-quarry-halls-of-all-knowing", "name": "Halls Of All Knowing", "area": "God Quarry", "mode": "Domination", "type": "control", "image": "assets/maps/domination/god-quarry/halls-of-all-knowing.webp"},
  {"id": "domination-god-quarry-house-of-ideas", "name": "House Of Ideas", "area": "God Quarry", "mode": "Domination", "type": "control", "image": "assets/maps/domination/god-quarry/house-of-ideas.webp"},
  {"id": "domination-hell-s-heaven-frozen-airfield", "name": "Frozen Airfield", "area": "Hell's Heaven", "mode": "Domination", "type": "control", "image": "assets/maps/domination/hell-s-heaven/frozen-airfield.webp"},
  {"id": "domination-hell-s-heaven-super-soldier-factory", "name": "Super Soldier Factory", "area": "Hell's Heaven", "mode": "Domination", "type": "control", "image": "assets/maps/domination/hell-s-heaven/super-soldier-factory.webp"},
  {"id": "domination-krakoa-carousel", "name": "Carousel", "area": "Krakoa", "mode": "Domination", "type": "control", "image": "assets/maps/domination/krakoa/carousel.webp"},
  {"id": "domination-krakoa-cradle", "name": "Cradle", "area": "Krakoa", "mode": "Domination", "type": "control", "image": "assets/maps/domination/krakoa/cradle.webp"},
  {"id": "domination-krakoa-the-grove", "name": "The Grove", "area": "Krakoa", "mode": "Domination", "type": "control", "image": "assets/maps/domination/krakoa/the-grove.webp"},
];
const BASIC_TURNS = [
  ['a','BAN'],['b','BAN'],['b','LOCK'],['a','LOCK'],['a','BAN'],
  ['b','BAN'],['b','LOCK'],['a','LOCK'],['a','BAN'],['b','BAN']
];

// The simultaneous A/B ban phases in Ignite are entered as A then B in this
// coaching simulator; the game itself conducts these phase pairs simultaneously.
const IGNITE_TURNS = [
  ['a','BAN',1],['b','BAN',1],
  ['b','LOCK',2],['a','BAN',3],['a','LOCK',4],['b','BAN',5],
  ['a','BAN',6],['b','BAN',6],
  ['a','LOCK',7],['b','BAN',8],['b','LOCK',9],['a','BAN',10]
];
// Ranked Gold III+ turn-based 1-2-2-1, no hero protection/locks.
const RANKED_TURNS = []; // Ranked uses lineup planning in this website: no ban actions.
const DRAFT_FORMATS = {
  basic:{name:'MRC / Tournament Basic',source:'https://www.marvelrivals.com/news/20250701/42745_1229373.html',banLimit:3,lockLimit:2,turns:BASIC_TURNS,
    summary:'MRC / Basic: captains take turns. Three bans and two hero protections per team. A banned hero is unavailable to both teams; a protected hero cannot be banned later.',
    detail:'10 steps, with alternating bans and protections. Protecting does not force anyone to play that hero; it just keeps the option available.'},
  ignite:{name:'Ignite / Tournament Advanced',source:'https://master.nse.gg/tournaments/nse-summer-26/marvel-rivals-nse-summer/',banLimit:4,lockLimit:2,turns:IGNITE_TURNS,
    summary:'Ignite Advanced reference: four bans and two protects per side. A ban restricts the opposing team only; your own team can still play that hero.',
    detail:'The two opening ban selections and the two middle ban selections happen simultaneously in-game. This simulator records each pair A then B for easier planning. Tournament stages can change rules: confirm the event rulebook.'},
  ranked:{name:'Ranked / Lineup Planner (no bans)',source:'https://www.marvelrivals.com/heroes/',banLimit:0,lockLimit:0,turns:RANKED_TURNS,
    summary:'Ranked planning in Rift Tactics: all bans and protections are turned off. Select up to six heroes on each side to plan a composition.',
    detail:'This is a user-requested no-ban coaching preset, not a claim about in-game Ranked draft rules. Some competitive ranks use hero bans.'},
  free:{name:'Freeform Practice',source:null,banLimit:3,lockLimit:2,turns:[],
    summary:'Freeform: coach-directed practice with three bans and two protections per team. No mandatory turn order.',
    detail:'This is a flexible planning mode, not a specific tournament rulebook. Click a selected hero to remove it.'}
};
