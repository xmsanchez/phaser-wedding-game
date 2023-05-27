import TweenHelper from '../classes/TweenHelper.js';
import Loading from '../classes/Loading';

export default class MainMenu extends Phaser.Scene {
	constructor() {
		super('MainMenu');
	}

	preload()
    {
		var loading = new Loading();
		loading.loadAssets(this);
        
		// Load plugins
		var urlJoystick = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js';
		var urlButton = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexbuttonplugin.min.js';
		var urlBBCode = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexbbcodetextplugin.min.js';
		this.load.plugin('rexvirtualjoystickplugin', urlJoystick, true);
		this.load.plugin('rexbuttonplugin', urlButton, true);
		this.load.plugin('rexbbcodetextplugin', urlBBCode, true);

		// Load common tilesets
		this.load.image('tileset_field','assets/tilesets/tileset_field/tileset.png');
		this.load.image('tileset_jungle','assets/tilesets/tileset_jungle/tileset_jungle_embed.png');

		// Load audio music
		this.load.audio('background_music', 'assets/audio/tangled.mp3');
		this.load.audio('background_music_house', 'assets/audio/music/PerituneMaterial_Dawning_Tale.mp3');
		this.load.audio('background_music_bunny1', 'assets/audio/music/Fluffing-a-Duck.mp3');
		this.load.audio('background_music_bunny2', 'assets/audio/music/Run-Amok.mp3');
		this.load.audio('background_music_woods1', 'assets/audio/music/PerituneMaterial_MoonForest.mp3');
		this.load.audio('background_music_woods2', 'assets/audio/music/PerituneMaterial_SnowChill_loop.mp3');
				
		// Load audio sounds
		this.load.audio('audio_coin', 'assets/audio/coin.mp3');
		this.load.audio('audio_chest_opened', 'assets/audio/new_item.mp3');

		// Load maps
		// House inside (pròlegs)
		this.load.tilemapTiledJSON('house-inside', 'assets/maps/house-inside.json');
		// House outside (pròlegs)
		this.load.tilemapTiledJSON('house-outside', 'assets/maps/house-outside.json');
		// El Mapa
		this.load.tilemapTiledJSON('level1', 'assets/maps/level1.json');
		// La Data
		this.load.tilemapTiledJSON('level2', 'assets/maps/level2.json');
		// L'hora
		this.load.tilemapTiledJSON('level3', 'assets/maps/level3.json');
		// El Vestit
		this.load.tilemapTiledJSON('level4', 'assets/maps/level4.json');

		// Level 1 assets
		this.load.image('livingroom', 'assets/tilesets/house-inside/livingroom.png');

		// Level 2 assets+
		this.load.image('disney_castle_256','assets/tilesets/disney_castle.png');
		this.load.image('house-outside','assets/tilesets/house-outside/house-outside.png');

		// Level 3 assets
		// For Level3Prev we will reuse level1 map (the house)
		this.load.tilemapTiledJSON('level3-prev', 'assets/maps/level1.json');
		
		// Level 4 assets
		// For Level4Prev we will reuse level1 map (the house)
		this.load.tilemapTiledJSON('level4-prev', 'assets/maps/level1.json');

		// Load tilesets as spritesheets
		this.load.spritesheet('player', 'assets/spritesheets/player/player.png', { frameWidth: 32, frameHeight: 32 });
		this.load.spritesheet('npc_xavi', 'assets/spritesheets/npcs/xavi.png', { frameWidth: 32, frameHeight: 32 });
		this.load.spritesheet('npc_mi', 'assets/spritesheets/npcs/mi.png', { frameWidth: 32, frameHeight: 32 });
		this.load.spritesheet('npc_bunny', 'assets/spritesheets/npcs/bunny.png', { frameWidth: 45, frameHeight: 45 });
		this.load.spritesheet('npc_beast', 'assets/spritesheets/npcs/bestia.png', { frameWidth: 88, frameHeight: 88 });
		this.load.spritesheet('npc_stan', 'assets/spritesheets/npcs/stan.png', { frameWidth: 66, frameHeight: 66 });
		this.load.spritesheet('treasure', 'assets/spritesheets/objects/treasure.png', {frameWidth: 16, frameHeight: 16});		
		this.load.spritesheet('objects', 'assets/spritesheets/objects/objects.png', {frameWidth: 16, frameHeight: 16});
    }

	create() {
		// Set common vars
        this.registry.set('firstInteraction', true);
		this.registry.set('inventory', []);
		this.registry.set('inventoryDisplay', []);
		this.registry.set('Message', null);
		this.registry.set('UI', null);
		this.registry.set('scenesVisited', []);
		this.registry.set('previousScene', 'MainMenu');

		this.registry.set('Level0', {
			doorOpened: false
		});
		
		const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
		const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

		var titleText = 'The Wedding';
		this.add.text(screenCenterX, screenCenterY - 100, titleText, { font: '115px Arial' }).setOrigin(0.5);

		var startText = this.add.text(screenCenterX, screenCenterY + 40, 'Toca la pantalla per continuar', {
			font: 'italic 30px Arial',
		}).setOrigin(0.5);

		var instructionsText =
			'Instruccions: Utilitza el joystick esquerre per moure el personatge. Utilitza el botó dret per saltar/interactuar.';
		this.add.text(screenCenterX, screenCenterY + 190, instructionsText, {
				font: '25px Arial',
				wordWrap: { width: 500, useAdvancedWrap: true },
			}).setOrigin(0.5);

		TweenHelper.flashElement(this, startText);

		// add a click event listener to start the Level1 scene
		this.input.on('pointerdown', () => {
			this.scene.start('PreLevel', { levelName: '', levelKey: 'Level0', text: "L'arribada" });
		});
		const enterKey = this.input.keyboard.addKey('ENTER');
		enterKey.on('down', () => {
			this.scene.start('PreLevel', { levelName: '', levelKey: 'Level10', text: "L'arribada" });
		});
	}

	update() {}
}
