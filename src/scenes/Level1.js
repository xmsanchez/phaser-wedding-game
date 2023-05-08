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
		this.load.tilemapTiledJSON('map', 'assets/maps/level1.json');
		// this.load.audio('background_music', 'assets/audio/tangled.mp3');
		this.load.spritesheet('player',
			'assets/spritesheets/player.png',
			{ frameWidth: 16, frameHeight: 16 }
		);
		// Load tileset as spritesheet for objects such as the treasure
		this.load.spritesheet('treasure', 'assets/spritesheets/treasure.png', {
			frameWidth: 16,
			frameHeight: 16
		});
    }

	create()
	{
		// Create the tilemap using the loaded JSON file
		this.map = this.make.tilemap({ key: 'map' });
	
		// Add the loaded tiles image asset to the map
		const tileset = this.map.addTilesetImage('tileset', 'tileset');

		this.sky_bg = this.map.createLayer('sky_bg', tileset).scrollFactorX = 0.5;
		this.sky_fg = this.map.createLayer('sky_fg', tileset).scrollFactorX = 0.6;
		this.mountains_bg = this.map.createLayer('sky_mountains_bg', tileset).scrollFactorX = 0.7;
		this.mountains_fg = this.map.createLayer('sky_mountains_fg', tileset).scrollFactorX = 0.8;
		this.trees_bg = this.map.createLayer('trees_bg', tileset).scrollFactorX = 0.9;
		this.trees_fg = this.map.createLayer('trees_fg', tileset);
		this.ground_bg = this.map.createLayer('ground_bg', tileset);
		this.ground = this.map.createLayer('ground_fg', tileset);
		this.walls = this.map.createLayer('walls', tileset);
		this.bridge = this.map.createLayer('bridge', tileset);
		this.platforms = this.map.createLayer('platforms', tileset);
		this.grass = this.map.createLayer('grass', tileset)
		this.ladder = this.map.createLayer('ladder', tileset);
		this.coins = this.map.createLayer('coins', tileset)


		this.physics.world.setBounds(50, 0, this.map.widthInPixels - 50, this.map.heightInPixels * tileset.tileHeight);

		// Create all resources
		this.common = new Common(this);
		this.camera = new Camera();
		this.common.spawnTreasures(this);
		this.player = this.common.addPlayer(this);
		this.common.addColliders(this);
		this.common.setCollisions(this);
		this.joystick = this.common.addInput(this).joystick;
		this.hud = new HUD();
		this.hud.addHud(this)
		// this.loadMusic();

		// Add the pointers to the create function
		// Adding it on update will create several 'n' calls
		this.player.addTouchScreenPointers(this);
		this.player.setKeyboardControls(this);
	}

    update() {
		// Add movement to the player
		this.player.playerMovement(this);
		
		// Setup camera bounds and zoom
		this.camera.setCamera(this, 2.40);
    }

	loadMusic(){
		// Create an instance of the audio object
		const backgroundMusic = this.sound.add('background_music', { loop: true });
		// Play the audio file
		backgroundMusic.play();
	}
}
