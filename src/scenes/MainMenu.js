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
		this.load.plugin('rexvirtualjoystickplugin', urlJoystick, true);
		this.load.plugin('rexbuttonplugin', urlButton, true);
    
		// Load common assets
		this.load.image('tileset','assets/tilesets/tileset.png');
		this.load.audio('background_music', 'assets/audio/tangled.mp3');
		this.load.audio('audio_coin', 'assets/audio/coin.mp3');
		this.load.audio('audio_chest_opened', 'assets/audio/new_item.mp3');

		// Level 1 assets
		this.load.tilemapTiledJSON('level1', 'assets/maps/level1-bak.json');
		// this.load.tilemapTiledJSON('level1', 'assets/maps/level1-bak.json');

		// Level 2 assets+
		this.load.image('disney_castle_256','assets/tilesets/disney_castle_256.png');
		this.load.tilemapTiledJSON('level2', 'assets/maps/level2.json');
		
		// Load tilesets as spritesheets
		this.load.spritesheet('player', 'assets/spritesheets/player_options_32/Lanto_Charas_9.png', { frameWidth: 32, frameHeight: 32 });
		this.load.spritesheet('npc_xavi', 'assets/spritesheets/xavi_32.png', { frameWidth: 32, frameHeight: 32 });
		this.load.spritesheet('npc_mi', 'assets/spritesheets/mi_32.png', { frameWidth: 32, frameHeight: 32 });
		this.load.spritesheet('npc_bunny', 'assets/spritesheets/bunny.png', { frameWidth: 45, frameHeight: 45 });
		this.load.spritesheet('npc_beast', 'assets/spritesheets/bestia.png', { frameWidth: 88, frameHeight: 88 });
		this.load.spritesheet('treasure', 'assets/spritesheets/treasure.png', {frameWidth: 16, frameHeight: 16});		
		this.load.spritesheet('objects', 'assets/spritesheets/objects_16x16.png', {frameWidth: 16, frameHeight: 16});
    }

	create() {
		const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
		const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

		var titleText = 'The Wedding';
		this.add.text(screenCenterX, screenCenterY, titleText, { font: '70px Arial' }).setOrigin(0.5);

		var startText = this.add.text(screenCenterX, screenCenterY + 120, 'Toca la pantalla per continuar', {
			font: 'italic 20px Arial',
		}).setOrigin(0.5);

		var instructionsText =
			'Instruccions: Utilitza el joystick esquerre per moure el personatge. Utilitza el botó dret per saltar/interactuar.';
		this.add.text(screenCenterX, screenCenterY + 230, instructionsText, {
				font: '20px Arial',
				wordWrap: { width: 450, useAdvancedWrap: true },
			}).setOrigin(0.5);

		TweenHelper.flashElement(this, startText);

		// add a click event listener to start the Level1 scene
		this.input.on('pointerdown', () => {
			this.scene.start('PreLevel', { levelKey: 'Level1', text: 'El Mapa' });
		});
		const enterKey = this.input.keyboard.addKey('ENTER');
		enterKey.on('down', () => {
			this.scene.start('PreLevel', { levelKey: 'Level1', text: 'El Mapa' });
		});
	}

	update() {}
}
