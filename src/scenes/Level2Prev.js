import Common from '../classes/Common.js';
import Camera from '../classes/Camera.js';
import HUD from '../classes/HUD.js';
import Message from '../classes/Message.js';

export default class Level2Prev extends Phaser.Scene
{
	constructor()
	{
		super('Level2Prev');

		this.jumpKeyReleased = true;
		this.jump = false;
		this.moveLeft = false;
		this.moveRight = false;
		this.touchMoveLeft = false;
		this.touchMoveRight = false;
		this.score = 0;
		this.player = null;
		this.joystick = null;		this.firstInteraction = true;
		this.bunnyFirstInteractionJump = false;

		this.startScene = false;
		this.currentScene = 'Level2Prev';
		
		this.npcs = null;
		this.treasures = null;
		this.doors = null;
		this.cartells = null;
		this.bunnies = null;

		// Bunny related variables
		this.pathPoints = null;
		this.bunnyReverseFlag = false;
		this.bunnyCatched = false;

		this.common = null;
	}

	preload()
    {}

	create()
	{
		// Create all resources
		this.common = new Common(this);
		this.camera = new Camera();
		this.common.addInput(this);
		this.message = this.registry.get('Message');
		this.hud = this.registry.get('HUD');

		// Create the tilemap using the loaded JSON file
		this.map = this.make.tilemap({ key: 'house-outside'});
	
		// Add the loaded tiles image asset to the map
		const tileset = this.map.addTilesetImage('house-outside', 'house-outside');

		// Create all the layers
		this.common.createLevelLayer(this, 'bg_background', tileset);
		this.ground = this.common.createLevelLayer(this, 'ground_fg', tileset);
		
		this.physics.world.setBounds(-30, 0, this.map.widthInPixels + 30, this.map.heightInPixels * tileset.tileHeight);

		// Spawn all interactable objects
		this.common.spawnCartells(this);
		this.bunny = this.common.spawnBunny(this);

		// Spawn player
		this.player = this.common.addPlayer(this);

		// Add colliders, input, hud, music
		this.common.addColliders(this);
		this.common.setCollisions(this, 0, 1400);
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

		
    }

	playerLookDirection(bunny) {
		if(this.player.x > bunny.x + bunny.width / 2){
			this.player.setFrame(10);
		}else{
			this.player.setFrame(7);
		}
	}

	loadMusic(){
		// Create an instance of the audio object
		this.backgroundMusic = this.sound.add('background_music_bunny1', { loop: true, volume: 0.4});
		// Play the audio file
		this.backgroundMusic.play();
	}
}
