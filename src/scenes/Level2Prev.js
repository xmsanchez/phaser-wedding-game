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
		this.map = this.make.tilemap({ key: 'house-inside'});
	
		// Add the loaded tiles image asset to the map
		const tileset = this.map.addTilesetImage('livingroom', 'livingroom');

		// Create all the layers
		this.common.createLevelLayer(this, 'bg_background', tileset);
		this.common.createLevelLayer(this, 'fg_background', tileset);
		this.ground_bg = this.common.createLevelLayer(this, 'ground_bg', tileset);
		this.ground = this.common.createLevelLayer(this, 'ground_fg', tileset);
		this.common.createLevelLayer(this, 'ground_decorations', tileset);
		this.common.createLevelLayer(this, 'decorations', tileset);
		
		this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels * tileset.tileHeight);

		// Spawn all interactable objects
		this.common.spawnDoors(this);
		this.common.spawnNpcs(this, 'npcs', 4);

		// Spawn player
		this.player = this.common.addPlayer(this);

		// Add colliders, input, hud, music
		this.common.addColliders(this);
		this.common.setCollisions(this, 0, 1400);
		this.loadMusic();

		// Add controls
		this.player.addTouchScreenPointers(this);
		this.player.setKeyboardControls(this);
		
		// Setup camera bounds and zoom
		this.camera.setCamera(this, 2.40);

		this.checkCompleted();
		
		this.justArrived = this.sceneRegistry.justArrived;
	}

	checkCompleted() {
		this.scenesVisited = this.registry.get('scenesVisited');
		this.previousScene = this.registry.get('previousScene');
		this.scenesVisited.push(this.currentScene);
		console.log('checkCompleted this.scenesVisited: ' + this.scenesVisited);
		this.sceneRegistry = this.registry.get(this.scene.key);
		let doorsOpened = this.sceneRegistry.doorsOpened;
		this.doors.getChildren().forEach((door) => {
			door.opened = true;
			this.doorOpened = true;
		});
	}

	npcActions(player, npc) {

	}
	
    update() {
		// Update player movement based on events
		this.player.playerMovement(this);
		
		// Check overlaps (show the 'B' button hint)
		this.common.checkOverlapsStaticGroups(this.npcs, this);
		this.common.checkOverlapsStaticGroups(this.doors, this);

		// NPCs will always look at the player
		this.npcLookDirection();

		if(this.justArrived){
			console.log('Player just got here!');
			this.registry.set(this.scene.key, {
				...this.sceneRegistry,
    			justArrived: false
			});
			this.justArrived = false;
			this.player.x = this.player.x + 330;
			let dialog = [
				'Miriam: Has aconseguit el **mapa**!',
				'Miriam: Ara hauríem d\'esbrinar quin és el dia i l\'hora en que cal estar allà',
				'Miriam: Segons diuen, el Conill Blanc ronda per aquí a prop i té un **rellotge** màgic...',
				'Miriam: La seva madriguera està **passat el bosc**. Per entrar-hi, necessitaràs una **bruixola**. Emporta\'t aquesta!',
				'Miriam: Amb això ja pots anar-lo a buscar. Ànims!'
			]
			this.message.showMessageList(this, dialog, function(scene){
				scene.hud.inventory.push('bruixola');
				scene.hud.updateInventory(scene, 'bruixola');
			});
		}

		if (this.startScene) {
			console.log('Stop scene Level2Prev, start scene Level2Prev2');
			this.startScene = false;
			this.registry.set('previousScene', this.scene.key);
			// We need to stop current UIScene
			this.common.stopScene(this);
			this.scene.start('PreLevel', { levelKey: 'Level2Prev2' });
		}
    }

	npcLookDirection() {
		const position = this.npcs.getChildren().find((npc) => {
			if(this.player.x > npc.x + npc.width / 2){
				npc.setFrame(7);
			}else{
				npc.setFrame(10);
			}
		})
	}

	loadMusic(){
		// Create an instance of the audio object
		this.backgroundMusic = this.sound.add('background_music_bunny1', { loop: true, volume: 0.4});
		// Play the audio file
		this.backgroundMusic.play();
	}
}
