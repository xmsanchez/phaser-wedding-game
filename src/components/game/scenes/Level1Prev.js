import Common from '../classes/Common.js';
import Camera from '../classes/Camera.js';

////////////////////////////////////////////////////////
// EL MAPA (prev)
////////////////////////////////////////////////////////
export default class Level1Prev extends Phaser.Scene
{
	constructor()
	{
		super('Level1Prev');

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
		this.currentScene = 'Level1Prev';
		
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
		
		this.physics.world.setBounds(0, 0, this.map.widthInPixels + 30, this.map.heightInPixels * tileset.tileHeight);

		// Spawn all interactable objects
		this.common.spawnDoors(this);
		this.common.spawnCartells(this, 'level1');

		// Spawn player
		this.player = this.common.addPlayer(this);

		// Add colliders, input, hud, music
		this.common.addColliders(this);
		this.common.setCollisions(this, 0, 1400);
		
		this.common.loadMusic(this, tileset.name);

		// Add controls
		this.player.addTouchScreenPointers(this);
		this.player.setKeyboardControls(this);

		// Setup camera bounds and zoom
		this.camera.setCamera(this, 2.40);

		this.scenesVisited = this.registry.get('scenesVisited');
		this.previousScene = this.registry.get('previousScene');
		this.scenesVisited.push(this.currentScene);
		console.log('this.scenesVisited: ' + this.scenesVisited);
		console.log('this.previousScene: ' + this.previousScene);

		if(this.previousScene == 'Level1'){
			this.player.x = this.map.widthInPixels - 30;
		}
	}

    update() {
		// Update player movement based on events
		this.player.playerMovement(this);
		
		// Check overlaps (show the 'B' button hint)
		this.common.checkOverlapsStaticGroups(this.cartells, this);
		this.common.checkOverlapsStaticGroups(this.doors, this);

		// If player goes out of the screen to the left, start next scene
		if(this.player.x > this.map.widthInPixels){
			console.log('Stop scene Level1Prev, start scene Level1');
			this.startScene = false;
			this.registry.set('previousScene', this.scene.key);
			this.common.stopScene(this);
			this.scene.start('PreLevel', { levelKey: 'Level1', text: "El Mapa" });
		}
    }

	playerLookDirection(bunny) {
		if(this.player.x > bunny.x + bunny.width / 2){
			this.player.setFrame(10);
		}else{
			this.player.setFrame(7);
		}
	}
}