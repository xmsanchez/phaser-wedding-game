import TweenHelper from '../classes/TweenHelper.js';
import Loading from '../classes/Loading.js';

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
		this.load.image('tileset_evening','assets/tilesets/tileset_field/tileset_evening.png');
		this.load.image('tileset_night','assets/tilesets/tileset_field/tileset_night.png');
		this.load.image('sky_night','assets/tilesets/sky_night/sky_night.png');
		this.load.image('tileset_jungle','assets/tilesets/tileset_jungle/tileset_jungle_embed.png');
		this.load.image('tileset_jungle_evening','assets/tilesets/tileset_jungle/tileset_jungle_embed_evening.png');
		this.load.image('swamp', 'assets/tilesets/tileset_swamp/swamp.png');
		this.load.image('swamp_bg', 'assets/tilesets/tileset_swamp/swamp_bg.png');

		// Load audio music
		this.load.audio('background_music_tangled', 'assets/audio/tangled_revamped.mp3');
		this.load.audio('background_music_tangled_real', 'assets/audio/tangled_can_see_the_light.mp3');
		this.load.audio('background_music_house', 'assets/audio/music/PerituneMaterial_Dawning_Tale.mp3');
		this.load.audio('background_music_bunny1', 'assets/audio/music/Fluffing-a-Duck.mp3');
		this.load.audio('background_music_bunny2', 'assets/audio/music/Run-Amok.mp3');
		this.load.audio('background_music_woods1', 'assets/audio/music/PerituneMaterial_MoonForest.mp3');
		this.load.audio('background_music_woods2', 'assets/audio/music/PerituneMaterial_SnowChill_loop.mp3');
				
		// Load audio sounds
		this.load.audio('audio_coin', 'assets/audio/coin.mp3');
		this.load.audio('audio_chest_opened', 'assets/audio/new_item.mp3');
		this.load.audio('audio_dog_bark', 'assets/audio/dog_bark2.mp3');
		this.load.audio('audio_footsteps', 'assets/audio/footsteps.flac');
		// this.load.audio('audio_jump', 'assets/audio/jump1.wav');
		this.load.audio('audio_birds', 'assets/audio/nature_birds.mp3');
		this.load.audio('audio_piano_s1', 'assets/audio/piano/C5.mp3');
		this.load.audio('audio_piano_s2', 'assets/audio/piano/D5.mp3');
		this.load.audio('audio_piano_s3', 'assets/audio/piano/E5.mp3');
		this.load.audio('audio_piano_s4', 'assets/audio/piano/F5.mp3');
		this.load.audio('audio_piano_s5', 'assets/audio/piano/G5.mp3');
		this.load.audio('audio_piano_s6', 'assets/audio/piano/A5.mp3');
		this.load.audio('audio_piano_s7', 'assets/audio/piano/B5.mp3');

		// Load maps
		// House inside (pròlegs)
		this.load.tilemapTiledJSON('house-inside', 'assets/maps/house-inside.json');
		// House outside (pròlegs)
		this.load.tilemapTiledJSON('house-outside', 'assets/maps/house-outside.json');
		this.load.tilemapTiledJSON('house-outside-castle-direction', 'assets/maps/house-outside-castle-direction.json');

		// Maps for the different levels
		this.load.tilemapTiledJSON('level1', 'assets/maps/level1.json');
		this.load.tilemapTiledJSON('level2', 'assets/maps/level2.json');
		this.load.tilemapTiledJSON('level3', 'assets/maps/level3.json');
		this.load.tilemapTiledJSON('level4', 'assets/maps/level4.json');
		this.load.tilemapTiledJSON('level5', 'assets/maps/level5.json');
		this.load.tilemapTiledJSON('level3-prev', 'assets/maps/level1.json');

		// Some common tilesets
		this.load.image('livingroom', 'assets/tilesets/house-inside/livingroom.png');
		this.load.image('castle_outside','assets/tilesets/tileset_castle/castle_outside.png');
		this.load.image('castle_inside','assets/tilesets/tileset_castle/castle_inside.png');
		this.load.image('house-outside','assets/tilesets/house-outside/house-outside.png');
		this.load.image('house-outside','assets/tilesets/house-outside/house-outside.png');
		
		this.load.spritesheet('player', 'assets/spritesheets/player/player.png', { frameWidth: 32, frameHeight: 32 });
		this.load.spritesheet('player2', 'assets/spritesheets/player/heroes.png', { frameWidth: 24, frameHeight: 32 });
		this.load.spritesheet('npc_xavi', 'assets/spritesheets/npcs/xavi.png', { frameWidth: 32, frameHeight: 32 });
		this.load.spritesheet('npc_mi', 'assets/spritesheets/npcs/mi.png', { frameWidth: 32, frameHeight: 32 });
		this.load.spritesheet('npc_bug', 'assets/spritesheets/npcs/bug.png', { frameWidth: 32, frameHeight: 32 });
		this.load.spritesheet('npc_bunny', 'assets/spritesheets/npcs/bunny.png', { frameWidth: 45, frameHeight: 45 });
		this.load.spritesheet('npc_bestia', 'assets/spritesheets/npcs/disney/bestia.png', { frameWidth: 64, frameHeight: 64 });
		this.load.spritesheet('npc_aladdin', 'assets/spritesheets/npcs/disney/aladdin.png', { frameWidth: 45, frameHeight: 60 });
		this.load.spritesheet('npc_gaston', 'assets/spritesheets/npcs/disney/gaston.png', { frameWidth: 45, frameHeight: 60 });
		this.load.spritesheet('npc_malefica', 'assets/spritesheets/npcs/disney/malefica.png', { frameWidth: 50, frameHeight: 70 });
		this.load.spritesheet('npc_peter', 'assets/spritesheets/npcs/disney/peter.png', { frameWidth: 45, frameHeight: 60 });
		this.load.spritesheet('npc_geni', 'assets/spritesheets/npcs/disney/geni.png', { frameWidth: 65, frameHeight: 85 });
		this.load.spritesheet('npc_pluto', 'assets/spritesheets/npcs/disney/pluto.png', { frameWidth: 65, frameHeight: 45 });
		this.load.spritesheet('npc_rapunzel', 'assets/spritesheets/npcs/disney/rapunzel.png', { frameWidth: 35, frameHeight: 50 });
		this.load.spritesheet('npc_simba', 'assets/spritesheets/npcs/disney/simba.png', { frameWidth: 35, frameHeight: 35 });
		this.load.spritesheet('npc_hades', 'assets/spritesheets/npcs/disney/hades.png', { frameWidth: 35, frameHeight: 85 });
		this.load.spritesheet('npc_stan', 'assets/spritesheets/npcs/stan.png', { frameWidth: 66, frameHeight: 66 });
		this.load.spritesheet('npc_fairy', 'assets/spritesheets/npcs/fairy.png', { frameWidth: 64, frameHeight: 64 });
		this.load.spritesheet('npc_worker', 'assets/spritesheets/npcs/worker.png', { frameWidth: 32, frameHeight: 32 });
		this.load.spritesheet('lantern', 'assets/spritesheets/objects/lantern_illuminated.png', {frameWidth: 96, frameHeight: 141 });
		this.load.spritesheet('treasure', 'assets/spritesheets/objects/treasure.png', {frameWidth: 16, frameHeight: 16 });		
		this.load.spritesheet('objects', 'assets/spritesheets/objects/objects.png', {frameWidth: 16, frameHeight: 16 });
		this.load.spritesheet('fire', 'assets/spritesheets/objects/fire1.png', {frameWidth: 16, frameHeight: 16 });
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
			doorsOpened: [],
			treasuresOpened: [],
		});
		this.registry.set('Level1Prev', {
			doorsOpened: [],
			treasuresOpened: [],
		});
		this.registry.set('Level1', {
			doorsOpened: [],
			treasuresOpened: [],
		});
		this.registry.set('Level2Prev', {
			doorsOpened: [],
			treasuresOpened: [],
			justArrived: true,
		});
		this.registry.set('Level2Prev2', {
			doorsOpened: [],
			treasuresOpened: [],
		});
		this.registry.set('Level2', {
			doorsOpened: [],
			treasuresOpened: [],
		});
		this.registry.set('Level3Prev', {
			doorsOpened: [],
			treasuresOpened: [],
		});
		this.registry.set('Level3Prev2', {
			doorsOpened: [],
			treasuresOpened: [],
		});
		this.registry.set('Level3Prev3', {
			doorsOpened: [],
			treasuresOpened: [],
		});
		this.registry.set('Level3', {
			doorsOpened: [],
			treasuresOpened: [],
		});
		this.registry.set('Level4Prev', {
			doorsOpened: [],
			treasuresOpened: [],
		});
		this.registry.set('Level4', {
			doorsOpened: [],
			treasuresOpened: [],
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
			this.scene.start('PreLevel', { levelName: '', timeout: 200, levelKey: 'Level0', text: "L'arribada" });
		});
		const enterKey = this.input.keyboard.addKey('ENTER');
		enterKey.on('down', () => {
			this.scene.start('PreLevel', { levelName: '', levelKey: 'Level1', text: "L'arribada" });
		});
	}

	update() {}
}
