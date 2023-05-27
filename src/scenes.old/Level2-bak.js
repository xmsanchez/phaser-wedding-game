import Common from '../classes/Common.js';
import Camera from '../classes/Camera.js';
import HUD from '../classes/HUD.js';
import Message from '../classes/Message.js';

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

		this.startScene = false;
		this.currentScene = 'Level2';
		
		this.npcs = null;
		this.treasures = null;
		this.doors = null;
		this.cartells = null;

		this.common = null;

	}

	preload()
    {}

	create()
	{
		// Create all resources
		this.common = new Common(this);
		this.message = new Message(this);
		this.camera = new Camera();
		this.common.addInput(this);

		// Create the tilemap using the loaded JSON file
		this.map = this.make.tilemap({ key: 'level2' });
	
		// Add the loaded tiles image asset to the map
		const tileset = this.map.addTilesetImage('tileset', 'tileset');
		const disney_castle_256 = this.map.addTilesetImage('disney_castle_256', 'disney_castle_256');

		// Create all the layers
		this.sky_bg = this.common.createLevelLayer(this, 'sky_bg', tileset, 0.5);
		this.sky_fg = this.common.createLevelLayer(this, 'sky_fg', tileset, 0.6);
		this.mountains_bg = this.common.createLevelLayer(this, 'sky_mountains_bg', tileset, 0.7);
		this.mountains_fg = this.common.createLevelLayer(this, 'sky_mountains_fg', tileset, 0.8);
		this.trees_bg = this.common.createLevelLayer(this, 'trees_bg', tileset, 0.9);
		this.trees_fg = this.common.createLevelLayer(this, 'trees_fg', tileset);
		this.ground_bg = this.common.createLevelLayer(this, 'ground_bg', tileset);
		this.ground = this.common.createLevelLayer(this, 'ground_fg', tileset);
		this.castle = this.map.createLayer('castle', disney_castle_256);
		this.rocks = this.common.createLevelLayer(this, 'rocks', tileset);
		this.walls = this.common.createLevelLayer(this, 'walls', tileset);
		this.bridge = this.common.createLevelLayer(this, 'bridge', tileset);
		this.platforms = this.common.createLevelLayer(this, 'platforms', tileset);
		this.grass = this.common.createLevelLayer(this, 'grass', tileset)
		
		this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels * tileset.tileHeight);

		// Spawn all interactable objects
		this.common.spawnTreasures(this);
		this.common.spawnCoins(this);
		this.common.spawnCartells(this);
		this.common.spawnDoors(this);

		// Spawn player
		this.player = this.common.addPlayer(this);

		// Add colliders, input, hud, music
		this.common.addColliders(this);
		this.common.setCollisions(this);
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
		this.camera.setCamera(this, 2.40);

		// this.common.checkOverlapsStaticGroups(this.npcs, this);
		this.common.checkOverlapsStaticGroups(this.treasures, this);
		this.common.checkOverlapsStaticGroups(this.doors, this);
		this.common.checkOverlapsStaticGroups(this.cartells, this);

    }

	loadMusic(){
		// Create an instance of the audio object
		this.backgroundMusic = this.sound.add('background_music', { loop: true, volume: 0.2});
		// Play the audio file
		this.backgroundMusic.play();
	}
}
