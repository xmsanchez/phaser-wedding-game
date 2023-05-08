import Common from '../classes/Common.js';
import Camera from '../classes/Camera.js';
import HUD from '../classes/HUD.js';

export default class Level1 extends Phaser.Scene
{
	constructor()
	{
		super('Level1');
		this.jumpKeyReleased = true;
		this.jump = false;
		this.moveLeft = false;
		this.moveRight = false;
		this.touchMoveLeft = false;
		this.touchMoveRight = false;
		this.score = 0;
		this.player = null;
		this.joystick = null;
		this.messageDisplaying = false;
		this.startScene = false;

		this.common = null;
	}

	preload()
    {	
		const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
		const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

		var progressBar = this.add.graphics();
		var progressBox = this.add.graphics();
		progressBox.fillStyle(0x222222, 0.8);
		progressBox.fillRect(240, screenCenterY - 50, 320, 50);

		this.load.on('progress', function (value) {
			console.log(value);
			progressBar.clear();
			progressBar.fillStyle(0xffffff, 1);
			progressBar.fillRect(250, screenCenterY - 40, 300 * value, 30);
		});

		var assetText = this.make.text({
			x: screenCenterX,
			y: screenCenterY + 50,
			text: '',
			style: {
				font: '18px monospace'
			}
		});
		assetText.setOrigin(0.5, 0.5);
					
		this.load.on('fileprogress', function (file) {
			assetText.setText('Loading asset: ' + file.key);
		});

		this.load.on('complete', function () {
			progressBar.destroy();
			progressBox.destroy();
		});

		// Load plugins
		var urlJoystick = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js';
		var urlButton = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexbuttonplugin.min.js';
		this.load.plugin('rexvirtualjoystickplugin', urlJoystick, true);
		this.load.plugin('rexbuttonplugin', urlButton, true);
    
		// Load assets
		this.load.image('tileset','assets/tilesets/tileset.png');
		this.load.tilemapTiledJSON('level1', 'assets/maps/level1.json');
		this.load.audio('background_music', 'assets/audio/tangled.mp3');
		this.load.audio('audio_coin', 'assets/audio/coin.mp3');
		this.load.audio('audio_chest_opened', 'assets/audio/new_item.mp3');
		this.load.spritesheet('player',
			'assets/spritesheets/player.png',
			{ frameWidth: 16, frameHeight: 16 }
		);
		// Load tileset as spritesheet for objects such as the treasure
		this.load.spritesheet('treasure', 'assets/spritesheets/treasure.png', {
			frameWidth: 16,
			frameHeight: 16
		});		
		// Load tileset as spritesheet for objects such as the treasure
		this.load.spritesheet('objects', 'assets/spritesheets/objects_16x16.png', {
			frameWidth: 16,
			frameHeight: 16
		});
    }

	create()
	{
		// Create the tilemap using the loaded JSON file
		this.map = this.make.tilemap({ key: 'level1'});
	
		// Add the loaded tiles image asset to the map
		const tileset = this.map.addTilesetImage('tileset', 'tileset');
		const objects = this.map.addTilesetImage('objects', 'objects');

		this.sky_bg = this.map.createLayer('sky_bg', tileset).scrollFactorX = 0.5;
		this.sky_fg = this.map.createLayer('sky_fg', tileset).scrollFactorX = 0.6;
		this.mountains_bg = this.map.createLayer('sky_mountains_bg', tileset).scrollFactorX = 0.7;
		this.mountains_fg = this.map.createLayer('sky_mountains_fg', tileset).scrollFactorX = 0.8;
		this.trees_bg = this.map.createLayer('trees_bg', tileset).scrollFactorX = 0.9;
		this.trees_fg = this.map.createLayer('trees_fg', tileset);
		this.ground_bg = this.map.createLayer('ground_bg', tileset);
		this.ground = this.map.createLayer('ground_fg', tileset);
		this.rocks = this.map.createLayer('rocks', tileset);
		this.walls = this.map.createLayer('walls', tileset);
		this.bridge = this.map.createLayer('bridge', tileset);
		this.platforms = this.map.createLayer('platforms', tileset);
		this.grass = this.map.createLayer('grass', tileset)
		
		this.physics.world.setBounds(50, 0, this.map.widthInPixels - 50, this.map.heightInPixels * tileset.tileHeight);

		// Create all resources
		this.common = new Common(this);
		this.camera = new Camera();

		// this.common.spawnObjects(this, 'treasures', 'treasure');
		// this.common.spawnObjects(this, 'coins', 'objects');
		// this.common.spawnObjects(this, 'doors', 'objects');
		this.common.spawnTreasures(this);
		this.common.spawnCoins(this);
		this.common.spawnDoors(this);
		this.player = this.common.addPlayer(this);
		this.common.addColliders(this);
		this.common.setCollisions(this);
		this.joystick = this.common.addInput(this).joystick;
		this.hud = new HUD();
		this.hud.addHud(this);
		this.loadMusic();

		// Add controls
		this.player.addTouchScreenPointers(this);
		this.player.setKeyboardControls(this);
	}

    update() {
		// Update player movement based on events
		this.player.playerMovement(this);
		
		// Setup camera bounds and zoom
		this.camera.setCamera(this, 2.40);

		if (this.startScene) {
			console.log('Stop scene Level1, start scene Level2');
			this.startScene = false; // Reset the flag
			this.scene.stop('Level1');
			this.backgroundMusic.stop();
			this.scene.start('Level2');
		}
    }

	loadMusic(){
		// Create an instance of the audio object
		this.backgroundMusic = this.sound.add('background_music', { loop: true, volume: 0.2});
		// Play the audio file
		this.backgroundMusic.play();
	}
}
