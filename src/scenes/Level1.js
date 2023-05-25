import Common from '../classes/Common.js';
import Camera from '../classes/Camera.js';
import HUD from '../classes/HUD.js';
import Message from '../classes/Message.js';

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
		this.currentScene = 'Level1';
		
		this.npcs = null;
		this.treasures = null;
		this.doors = null;
		this.cartells = null;

		this.common = null;

		// Bunny related variables
		this.bunnies = null;
		this.pathPoints = null;
		this.bunnyReverseFlag = false;
		this.bunnyCatched = false;
		this.bunny = null;

		this.levelFinished = false;
	}

	preload()
    {}

	create()
	{
		// Create all resources
		this.common = new Common(this);
		this.message = new Message(this);
		this.camera = new Camera();

		// Create the tilemap using the loaded JSON file
		this.map = this.make.tilemap({ key: 'level1' });
	
		// Add the loaded tiles image asset to the map
		const tileset = this.map.addTilesetImage('tileset', 'tileset_jungle');

		// Create all the layers
		this.common.createLevelLayer(this, 'bg_5', tileset, 0.4);
		this.common.createLevelLayer(this, 'bg_4', tileset, 0.5);
		this.common.createLevelLayer(this, 'bg_3', tileset, 0.6);
		this.common.createLevelLayer(this, 'bg_2', tileset, 0.7);
		this.common.createLevelLayer(this, 'bg_1', tileset, 0.8);
		this.common.createLevelLayer(this, 'fg_background', tileset, 0.9);
		this.common.createLevelLayer(this, 'ground_bg', tileset, 0.8);
		this.ground = this.common.createLevelLayer(this, 'ground_fg', tileset, 0.9);
		this.common.createLevelLayer(this, 'rocks', tileset);
		this.platforms = this.common.createLevelLayer(this, 'platforms', tileset);
		
		this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels * tileset.tileHeight);

		// Spawn player
		this.player = this.common.addPlayer(this);

		// Add colliders, input, hud, music
		this.common.addColliders(this);
		this.common.setCollisions(this);
		this.joystick = this.common.addInput(this).joystick;
		this.hud = new HUD(this);
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
		this.camera.setCamera(this, 2);
		
		if(this.levelFinished && !this.messageDisplaying){
			this.startScene = false;
			this.scene.stop('Level1');
			this.backgroundMusic.stop();
			this.scene.start('PreLevel', { levelName: 'Nivell 2\nPròleg', levelKey: 'Level2Prev', text: 'La Data' });
		}
    }
	

	loadMusic(){
		// Create an instance of the audio object
		this.backgroundMusic = this.sound.add('background_music_bunny2', { loop: true, volume: 0.2});
		// Play the audio file
		this.backgroundMusic.play();
	}
}
