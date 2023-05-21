import Common from '../classes/Common';
import Camera from '../classes/Camera';
import HUD from '../classes/HUD';
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
		this.moveDown = false;
		this.moveUp = false;
		
		this.touchMoveLeft = false;
		this.touchMoveRight = false;
		this.touchMoveDown = false;
		this.touchMoveUp = false;

		this.score = 0;
		this.player = null;
		this.joystick = null;
		
		this.messageDisplaying = false;
		this.messageIsSelector = false;
		this.messageSelectorTexts = [];
		this.messageSelectorTextObjects = [];

		this.startScene = false;
		this.currentScene = 'Level1';

		this.npcs = null;
		this.treasures = null;
		this.doors = null;
		this.cartells = null;
		this.bunnies = null;

		this.interactBtn = null;
		this.firstInteraction = true;

		this.common = null;
		this.message = null;

		this.messageList = [
			'Hola! Saps què?!', 
			'Ens casem!!!', 
			'Ara tenim un problema, i és que hem perdut el mapa de la ubicació.\nEns ajudes a trobar-lo?'
		];

		// Bunny related variables
		this.pathPoints = null;
		this.bunnyReverseFlag = false;
		this.bunnyCatched = false;
	}

	preload()
    { }

	create()
	{
		// Create all resources
		this.common = new Common(this);
		this.message = new Message(this);
		this.camera = new Camera();

		// Create the tilemap using the loaded JSON file
		this.map = this.make.tilemap({ key: 'level1'});
	
		// Add the loaded tiles image asset to the map
		const tileset = this.map.addTilesetImage('tileset', 'tileset');
		// const objects = this.map.addTilesetImage('objects', 'objects');

		// Create all the layers
		this.sky_bg = this.common.createLevelLayer(this, 'sky_bg', tileset, 0.5);
		this.sky_fg = this.common.createLevelLayer(this, 'sky_fg', tileset, 0.6);
		this.mountains_bg = this.common.createLevelLayer(this, 'sky_mountains_bg', tileset, 0.7);
		this.mountains_fg = this.common.createLevelLayer(this, 'sky_mountains_fg', tileset, 0.8);
		this.trees_bg = this.common.createLevelLayer(this, 'trees_bg', tileset, 0.9);
		this.trees_fg = this.common.createLevelLayer(this, 'trees_fg', tileset);
		this.ground_bg = this.common.createLevelLayer(this, 'ground_bg', tileset);
		this.ground = this.common.createLevelLayer(this, 'ground_fg', tileset);
		this.rocks = this.common.createLevelLayer(this, 'rocks', tileset);
		this.walls = this.common.createLevelLayer(this, 'walls', tileset);
		this.bridge = this.common.createLevelLayer(this, 'bridge', tileset);
		this.platforms = this.common.createLevelLayer(this, 'platforms', tileset);
		this.grass = this.common.createLevelLayer(this, 'grass', tileset)
		
		this.physics.world.setBounds(50, 0, this.map.widthInPixels - 50, this.map.heightInPixels * tileset.tileHeight);

		// Spawn all interactable objects
		this.common.spawnTreasures(this);
		this.common.spawnCoins(this);
		this.common.spawnCartells(this);
		this.common.spawnDoors(this);
		this.common.spawnNpcs(this, 'npcs', 4);

		//this.bunny = this.common.spawnBunny(this);
		
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
	
		this.npcs.getChildren().forEach((npc) => {
			const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.x, npc.y);
			if (distance < 75) {
				npc.setFrame(4);
				
				let currentIndex = 0;
				if(this.messageList.length > 0 && this.firstInteraction && !this.messageDisplaying){
					console.log('Display message: ' + this.messageList[currentIndex]);
					console.log('Messages: ' + this.messageList);
					this.message.showMessage(this, this.messageList[0]);
					this.messageList.shift();
					console.log('Messages: ' + this.messageList);
				}else if(this.messageList.length == 0){
					this.firstInteraction = false;
					npc.setFrame(npc.default_frame);
				}
			}
		});

		this.common.checkOverlapsStaticGroups(this.npcs, this);
		this.common.checkOverlapsStaticGroups(this.treasures, this);
		this.common.checkOverlapsStaticGroups(this.doors, this);
		this.common.checkOverlapsStaticGroups(this.cartells, this);
		this.common.checkOverlapsStaticGroups(this.bunnies, this);

		if (this.startScene) {
			console.log('Stop scene Level1, start scene Level2');
			this.startScene = false; // Reset the flag
			this.scene.stop('Level1');
			this.backgroundMusic.stop();
			this.scene.start('PreLevel', { levelKey: 'Level2', text: 'La Data' });
		}

		// this.messageSelectorTexts = ['Option 0 i text bastant llarg a veure què passa text bastant llarg a veure què passa',  'Option 1 i text bastant llarg a veure què passa', 'Option 2 i més text perquè també vull veure el què', 'Option 3', 'Option 4 també amb bastant text'];
		this.messageSelectorTexts = ['Option 1', 'Option 2', 'Option 3'];
		if(!this.messageDisplaying){
			// this.message.showMessageSelector(this, this.messageSelectorTexts);
		}

		this.common.bunnyMovement(this);
	}

	loadMusic(){
		// Create an instance of the audio object
		this.backgroundMusic = this.sound.add('background_music', { loop: true, volume: 0.2});
		// Play the audio file
		this.backgroundMusic.play();
	}
}
