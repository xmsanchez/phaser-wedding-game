// All in-game texts (Catalan). **text** is rendered in red bold by the dialog box.
// Functions are used where a line needs a name interpolated.

export const common = {
	treasureFound: (label) => `Has trobat **${label}!**`,
	doorLocked: 'La porta està **tancada**. Necessites una **clau** per obrir-la!.',
	bugWithStick: "Woof, Woof, Woof! (en Bug et babeja una mica mentre mira amb nostàlgia el pal que t'ha regalat)",
	bugGivesStick: "Woof, Woof! (en Bug et dona un pal... no sembla que t'hagi de servir per res, però ell està content)",
	bunnyCaught: (name) => [
		name + ": Oh! M'has atrapat!!\nEl casament **és el dia 30 de Setembre** i hauries d'arribar cap **a les 16 hores.**",
		name + ': Aquí tens el **rellotge.**\nTIC-TAC. TIC-TAC. TIC-TAC.',
	],
};

// L'arribada
export const level0 = {
	welcome: (npc, playerName) => [
		npc + ': Hola ' + playerName + '! Saps què?!\n\n**ENS CASEM!!!**',
		npc + ': Ara tenim un problema, i és que **hem perdut tota la informació** sobre el casament.\nEns ajudes a trobar-la?',
	],
	xaviNoKey: (npc) => [npc + ': Hauries de parlar amb la **Miriam**, és aquí al costat.'],
	miriamGivesKey: (npc) => [
		npc + ': Que bé que siguis aquí!\nHem **perdut tota la informació** sobre el casament...',
		npc + ': Però... potser ens pots ajudar a trobar-ho?',
		npc + ': Aquí tens la **clau** de la porta! Ànims!',
	],
	xaviHasKey: (npc) => [npc + ": La Miriam t'ha donat la **clau**? Doncs corre cap a la porta!"],
	miriamHasKey: (npc) => [npc + ': Ja tens la **clau**! Ja pots obrir la porta.'],
	doorOpened: (npc) => [npc + ': Ja tens la porta oberta, recorda que has de buscar el **mapa**'],
};

// El mapa
export const level1 = {
	stanIntro: [
		'No estaràs pas buscant el mapa cap a Monkey Island, no?',
		'Potser busques un vaixell?',
		'Tinc els millors vaixells del mon.',
		'Que per què venc vaixells en un bosc?',
		'És una pregunta excelent! Doncs veuràs, tot va començar el dia en que...',
		"Que tens pressa? Que busques **el mapa** d'un casament?",
		"Bé, doncs si trobes una **clau** que he perdut en aquest bosc, et donaré **el mapa** que busques!",
	],
	stanTrade: [
		"**(!!!!!)** Veig que has trobat **la clau!** (D'on carai l'haurà tret???)",
		'Segur que no estàs interessat en comprar un vaixell?',
		'Bé, crec que no em deixes alternativa',
		'Una promesa és una promesa. Aquí tens **el mapa**',
	],
	stanHasMap: [
		"Ja tens **el mapa**, si no tens intencions de comprar un vaixell deixa'm estar, estic molt ocupat",
	],
	stanNoKey: [
		'Hola de nou!',
		'Ja has trobat la **clau**?',
		"T'he explicat ja que venc els millors vaixells del món?",
		"Que no estàs interessat? Bé, és una llàstima! Sort amb la cerca de la **clau**!",
		'(el tindré donant voltes sense saber que **per molt amunt que pugi** no trobarà cap **clau**...)',
	],
};

// El conill
export const level2 = {
	miriamCompass: [
		'Miriam: Has aconseguit el **mapa**!',
		"Miriam: Ara hauríem d'esbrinar quin és el dia i l'hora en que cal estar allà",
		'Miriam: Segons diuen, el Conill Blanc ronda per aquí a prop i té un **rellotge** màgic...',
		"Miriam: La seva madriguera està **passat el bosc**. Per entrar-hi, necessitaràs una **bruixola**. Emporta't aquesta!",
		'Miriam: Amb això ja pots anar-lo a buscar. Ànims!',
	],
	bunnyLate: (name) => [
		name + ': Oh, no! Vaig tard, vaig tard.',
		name + ': Aquest rellotge marca **el dia i la hora** del casament. Vaig tard, vaig tard!!',
	],
};

// El vestit
export const level3 = {
	homeIntro: (npc) => [
		npc + ': Que bé! Has aconseguit el **rellotge.**\nMalauradament... també necessitaràs **un vestit**',
		npc + ": Has **d'anar al castell**, travessant el pont que hi ha sortint a mà esquerra.",
		npc + ": Escolta amb **molta atenció**: Al castell has de **resoldre un enigma**. Al bosc trobaràs **altres personatges** que t'ajudaran a resoldre l'**enigma**",
		npc + ': Pren nota de tot allò que et diguin i podràs resoldre el problema',
		npc + ': Ànims! Ja gairabé ho tens tot!',
	],
	xaviGoGetDress: (npc) => [npc + ': Ves a buscar **el vestit**!'],
	miriamClock: (npc) => [
		npc + ': Estic molt contenta de que hagis trobat **el rellotge!**',
		npc + ': Ja has parlat amb el **Xavi** sobre el següent que necessitaràs?',
	],
	workerBlocked: ['El camí està en obres, no pots passar, ho sento molt.', 'Prova a **venir més tard.**'],
	workerBlockedAgain: ["Tal com t'he comentat, el camí està en obres, no pots passar.", 'Prova a **venir més tard.**'],
	workerFixed: ['Ja hem reparat el pont, el castell està més enllà.'],
	xaviHello: (npc) => [npc + ': Ei, hola!'],
	miriamHello: (npc) => [npc + ': Holaaa!'],
	finish: [
		'Xavi: Que bé, has aconseguit **tot el que necessitàvem**. Que crack!!',
		'Miriam: Ara ja **podem anar tots al casament**! Ai, que ploro :)',
		'Miriam: Estem tant, tant **contents**...',
	],
	// Forest characters: each one gives a hint about the box order in the castle
	npcs: {
		'Aladdin': (n) => [
			n + ": Hola, amic aventurer! T'agraden les emocions fortes?",
			n + ": Recordo els carrers d'Agrabah, obria portes en l'ordre correcte per evitar els guàrdies.",
			n + ': Aquí tens el meu consell, **la sisena caixa**, ha de ser **la primera** que obres.',
		],
		'Gaston': (n) => [
			n + ': Què fas aquí, petit ratolí?',
			n + ': Necessites una pista? No pots amb aquest desafiament?',
			n + ': Està bé, te la donaré perquè sóc el millor en tot. **La quarta caixa** és **la segona** que hauries d\'obrir.',
		],
		'Bèstia': (n) => [
			n + ': Per què em molestes?',
			n + ': Aquest castell està ple de secrets i en tinc un per a tu. **La vuitena caixa**, ha de ser **la tercera** en obrir.',
		],
		'Malèfica': (n) => [
			n + ': Ah, buscant respostes, no és així?',
			n + ': De vegades el camí correcte no és el més obvi. **La segona caixa**, és la **la quarta** que hauràs d\'obrir.',
		],
		'Peter Pan': (n) => [
			n + ': Hola, company! Preparat per a una aventura al País de Mai Més?',
			n + ': En aquest bosc trobaràs molts personatges que et donaràn les pistes que necessites. Fins i tot a sota del bosc i també al cel!',
		],
		'Pluto': () => [
			'(En Pluto mou la cua amb entusiasme quan li acaricies el cap)',
			'(Assenyala amb la pota que **la primera caixa** ha de ser **la sisena** a obrir)',
			'(Escoltes a en Bug lladrant perquè estàs fent cas a un altre gosset. Decideixes seguir el teu camí...)',
		],
		'Rapunzel': (n) => [
			n + ': Hola! Aquest enigma que has de resoldre em recorda als misteris de la meva torre!',
			n + ': Et donaré una pista, **la tercera caixa** és **la setena** que hauries d\'obrir.',
		],
		'Geni': (n) => [
			n + ': Hola, amic! Estàs llest per un desig?',
			n + ': Vols una pista? Doncs aquí va: **la cinquena caixa** ha de ser **la novena** a obrir.',
		],
		'Simba': (n) => [
			n + ': Hola, amic! Sents la crida de la savana?',
			n + ': Aquest bosc és ple de misteris, igual que aquest enigma que has de resoldre.',
			n + ': El meu consell per a tu, **la setena caixa** ha de ser **la vuitena** a obrir.',
		],
		'Hades': (n) => [
			n + ': Oh, un altre mortal perdut.',
			n + ': Els misteris dels déus són complexos, com aquest enigma que has de resoldre.',
			n + ': Però ja que estàs aquí, et donaré una pista. **La novena caixa**, ha de ser **la cinquena** a obrir.',
		],
	},
};

// El castell
export const level4 = {
	wrongOrder: "No has pressionat les tecles en l'ordre correcte!",
	melody: ['Comences a escoltar una melodia que sona cada vegada més a prop...', '.'],
	fairyReward: [
		'Fada: Ho has fet molt, molt bé! Ara puc obrar la meva màgia.',
		'Fada: Bibidi-babidi-bu!',
		'(obtens el vestit!!)',
	],
	fairyIntro: (npc) => [
		npc + ': Hola preciositat!',
		npc + ': Per què no proves a ordenar les **caixes?**.',
		npc + ": Només **has de tocar-les en l'ordre correcte**",
	],
	fairyReminder: (npc) => [
		npc + ': Recorda: Prova a ordenar les **caixes**.',
		npc + ": No saps quin és l'**ordre correcte?**. Torna al **bosc** sortint aquí a l'esquerra i **parla amb tothom** qui trobis, et donaran les pistes que necessites!",
	],
	fairyDone: (npc) => [
		npc + ': Ja has obtingut tot el que necessites per al **casament**.',
		npc + ": La **Miriam** i el **Xavi** t'esperen **fora del castell**.",
	],
};

// Scene transition texts (PreLevel)
export const transitions = {
	arrival: "L'arribada",
	toBunnyHouse: 'Uns minuts\nmés tard...',
	toSwamp: "Mitja hora més tard,\ndesprés de travessar\nel bosc, evitant la\nxapa de l'Stan...",
	backHome: 'Amb el mapa i el rellotge,\nja en el teu poder, vas\ncamí de tornada a casa...',
	epilogueTitle: 'Epíleg',
	epilogue: 'I així, ens encaminem\ncap a les afores,\nmentre es fa de nit...',
};

export const mainMenu = {
	start: 'Toca la pantalla per continuar',
	instructions:
		"Instruccions:\nUtilitza el joystick per moure't.\nUtilitza el botó verd per saltar.\nUtilitza el botó vermell per interactuar.",
	continueHint: 'Prem [color=#ff0000][b][i]B[/i][/b][/color] per continuar',
	loading: 'Carregant...',
	inventory: 'Inventari',
};

// Final credits (Level5): [text, startTime, fadeTime, holdTime, fontSize, style]
export const credits = [
	['Gràcies per acompanyar-nos\nen aquest viatge', 2000, 2000, 1500],
	['Ha estat un plaer treballar\nen aquest projecte', 7000, 2000, 1500],
	['Us esperem a tots al casament\n- Dia 30 de Setembre\n- A La Vinyassa\n- Recepció a les 16:30\n- Dress code: Formal. El color blanc\n  està reservat per la núvia!!\n- Allotjament: Booking :-)', 14000, 2000, 20000, '27px', 'resum'],
	['Direcció:\n- Xavier Miranda Sánchez', 30000, 7000, 1500, '40px', 'left'],
	['Disseny de nivells:\n- Xavier Miranda Sánchez\n- Miriam Garcia Sala', 45000, 7000, 1500, '40px', 'left'],
	['Amb la colaboració de:\n- Arnau Morató Codorniu', 60000, 7000, 1500, '40px', 'left'],
	['Programació:\n- Xavier Miranda Sánchez', 75000, 7000, 1500, '40px', 'left'],
	['Assistent de programació:\n- GPT-4', 90000, 7000, 1500, '40px', 'left'],
	['Becari:\n- GPT-3.5', 105000, 7000, 1500, '40px', 'left'],
	['Pixel Art:\n- Xavier Miranda Sánchez\n- Miriam Garcia Sala\n- www.spriters-resource.com\n- Adobe Stock\n- Google Images', 120000, 7000, 1500, '40px', 'left'],
	['Àudio:\n- Creative Commons\n- Algun que altre rip...\n  (no ho comenteu a la SGAE ;-D)', 135000, 7000, 1500, '40px', 'left'],
	['Beta testers:\n- Xavier Miranda Sánchez\n- Miriam Garcia Sala\n- Arnau Morató Codorniu', 150000, 7000, 1500, '40px', 'left'],
	['Agraïments:\n- A tots els que ens\nacompanyareu en un dia\nmolt especial :-)', 165000, 7000, 1500, '40px', 'left'],
	['Gràcies', 180000, 12000, 1500, '80px'],
];
