import Common from '../classes/Common.js';
import Camera from '../classes/Camera.js';
import HUD from '../classes/HUD.js';
import Loading from '../classes/Loading';

export default class Level2 extends Phaser.Scene
{
	constructor()
	{
		super('Level2');
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
		this.startScene = null;

		this.common = null;
	}

	preload()
    {}

	create()
	{
		// Create the tilemap using the loaded JSON file
		this.map = this.make.tilemap({ key: 'level2' });
	
		// Add the loaded tiles image asset to the map
		const tileset = this.map.addTilesetImage('tileset', 'tileset');
		const disney_castle_256 = this.map.addTilesetImage('disney_castle_256', 'disney_castle_256');

		this.sky_bg = this.map.createLayer('sky_bg', tileset).scrollFactorX = 0.5;
		this.sky_fg = this.map.createLayer('sky_fg', tileset).scrollFactorX = 0.6;
		this.mountains_bg = this.map.createLayer('sky_mountains_bg', tileset).scrollFactorX = 0.7;
		this.mountains_fg = this.map.createLayer('sky_mountains_fg', tileset).scrollFactorX = 0.8;
		this.trees_bg = this.map.createLayer('trees_bg', tileset).scrollFactorX = 0.9;
		this.trees_fg = this.map.createLayer('trees_fg', tileset);
		this.ground_bg = this.map.createLayer('ground_bg', tileset);
		this.ground = this.map.createLayer('ground_fg', tileset);
		this.castle = this.map.createLayer('castle', disney_castle_256);
		this.walls = this.map.createLayer('walls', tileset);
		this.rocks = this.map.createLayer('rocks', tileset);
		// this.bridge = this.map.createLayer('bridge', tileset);
		this.platforms = this.map.createLayer('platforms', tileset);
		this.grass = this.map.createLayer('grass', tileset)
		
		this.physics.world.setBounds(50, 0, this.map.widthInPixels - 50, this.map.heightInPixels * tileset.tileHeight);

		// Create all resources
		this.common = new Common(this);
		this.camera = new Camera();

		// Spawn all interactable objects
		this.common.spawnTreasures(this);
		this.common.spawnCoins(this);
		this.common.spawnDoors(this);

		// Spawn player
		this.player = this.common.addPlayer(this);

		// Add colliders, input, hud, music
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

		if(this.startScene != null){
			console.log('Stop scene Level2, start scene Level1');
			this.scene.stop('Level2');
			this.backgroundMusic.stop();
			this.scene.start('Level1');
		}
    }

	loadMusic(){
		// Create an instance of the audio object
		this.backgroundMusic = this.sound.add('background_music', { loop: true, volume: 0.2});
		// Play the audio file
		this.backgroundMusic.play();
	}
}
