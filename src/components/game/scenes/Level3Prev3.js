import Common from '../classes/Common.js';
import Camera from '../classes/Camera.js';

////////////////////////////////////////////////////////
// DIRECCIÓ AL CASTELL
////////////////////////////////////////////////////////
export default class Level3Prev3 extends Phaser.Scene
{
	constructor()
	{
		super('Level3Prev3');

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
		this.currentScene = 'Level3Prev3';
		
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

		this.UIInfo = '';

		this.firstInteraction = true;
		this.hasMap = false;
		this.blocked = true;
	}

	preload()
    {}

	create()
	{
		// Create all resources
		this.sceneRegistry = this.registry.get(this.scene.key);
		this.common = new Common(this);
		this.camera = new Camera();
		this.common.addInput(this);
		this.message = this.registry.get('Message');
		this.hud = this.registry.get('HUD');

		this.initialCameraZoom = 1;
		this.joystickBaseScale = null;

		// Create the tilemap using the loaded JSON file
		this.map = this.make.tilemap({ key: 'house-outside-castle-direction' });
	
		// Add the loaded tiles image asset to the map
		const tileset_field = this.map.addTilesetImage('tileset_field', 'tileset_field');
		const tileset_house_outside = this.map.addTilesetImage('house-outside', 'house-outside');
		this.tileset_field = tileset_field;

		// Create all the layers
		this.common.createLevelLayer(this, 'bg_5', tileset_field, 0.4);
		this.common.createLevelLayer(this, 'bg_4', tileset_house_outside, 0.5);
		this.common.createLevelLayer(this, 'bg_3', tileset_house_outside, 0.6);
		this.common.createLevelLayer(this, 'bg_2', tileset_house_outside, 0.7);
		this.common.createLevelLayer(this, 'top_bg4', tileset_field, 0.4);
		this.common.createLevelLayer(this, 'top_bg3', tileset_field, 0.5);
		this.common.createLevelLayer(this, 'top_bg2', tileset_field, 0.6);
		this.common.createLevelLayer(this, 'top_bg1', tileset_field, 0.7);
		this.common.createLevelLayer(this, 'bg_1', tileset_house_outside, 0.8);
		this.common.createLevelLayer(this, 'fg_background', tileset_field, 0.9);
		this.common.createLevelLayer(this, 'ground_bg', tileset_house_outside, 0.8);
		this.common.createLevelLayer(this, 'rocks', tileset_field);
		this.common.createLevelLayer(this, 'ground_decorations', tileset_field);
		this.ground = this.common.createLevelLayer(this, 'ground_fg', tileset_house_outside);
		this.platforms = this.common.createLevelLayer(this, 'platforms', tileset_field);
		
		this.physics.world.setBounds(-60, 60, this.map.widthInPixels + 120, this.map.heightInPixels * tileset_field.tileHeight);

		// Spawn all interactable objects
		this.common.spawnNpcs(this, 'npcs', 4);
		this.common.spawnCartells(this);

		// Spawn player
		this.player = this.common.addPlayer(this);

		// Add colliders, input, hud, music
		this.common.addColliders(this);
		this.common.setCollisions(this, 0, 20000);

		this.common.loadMusic(this, tileset_field.name);

		// Add controls
		this.player.addTouchScreenPointers(this);
		this.player.setKeyboardControls(this);

		// Setup camera bounds and zoom
		this.camera.setCamera(this, 3);

		// // TODO: REMOVE THIS, THIS IS FOR DEBUGGING ONLY!!
		// this.hud.inventory.push('clock');
		// this.hud.inventory.push('map');
		// this.hud.updateInventory(this, 'clock');
		// this.hud.updateInventory(this, 'map');

		this.checkCompleted();
		console.log('this.blocked is: ' + this.blocked);
	}

	checkCompleted() {
		this.scenesVisited = this.registry.get('scenesVisited');
		this.previousScene = this.registry.get('previousScene');
		this.scenesVisited.push(this.currentScene);
		console.log('checkCompleted this.scenesVisited: ' + this.scenesVisited);
		this.sceneRegistry = this.registry.get(this.scene.key);
		let map = this.hud.searchInventory('map');
		let clock = this.hud.searchInventory('clock');
		console.log('Checking map: ' + map);
		console.log('Checking clock: ' + clock);
		if(map != null && clock != null){
			console.log('The player has the required objects');
			this.blocked = false;
		}else{
			console.log('The player does not have the required objects');
			this.blocked = true;
		}
	}
	
    update() {
		// Update player movement based on events
		this.player.playerMovement(this);

		// Check overlaps (show the 'B' button hint)
		this.common.checkOverlapsStaticGroups(this.npcs, this);
		this.common.checkOverlapsStaticGroups(this.cartells, this);
		
		let dialog = [];
		this.npcs.getChildren().forEach((npc) => {
			// NPCs will always look at the player
			this.common.npcLookDirection(this, npc);

			if(this.blocked){
				this.physics.world.setBounds(npc.x + 20, 0, this.map.widthInPixels + 60, this.map.heightInPixels * this.tileset_field.tileHeight);
			}

			const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.x, npc.y);
			if (distance < 80) {
				if(this.blocked && !this.message.messageDisplaying && this.firstInteraction){
					dialog = [
						'El camí està en obres, no pots passar, ho sento molt.',
						"Prova a **venir més tard.**"
					];
					this.message.showMessageList(this, dialog, function(scene){
						scene.firstInteraction = false;
					})
				}
			}
		});

		if(this.player.x < 0){
			console.log('Stop scene Level3Prev3, if user has all the objects, start Level3Prev4. Otherwise, return to previous level');
			this.startScene = false;
			this.registry.set('previousScene', this.scene.key);
			this.common.stopScene(this);
			this.scene.start('PreLevel', { levelName: 'El vestit', timeout: 2500, levelKey: 'Level3', text: 'El misteri\nde les caixes' });
		}else if(this.player.x > this.map.widthInPixels + 30){
			let previousScene = this.previousScene;
			this.startScene = false;
			this.hud.destroy();
			this.scene.stop('Level3Prev3');
			this.registry.set('previousScene', this.scene.key);
			// this.backgroundMusic.stop();
			console.log('Previous scene is: ' + previousScene);
			this.scene.start('PreLevel', { levelKey: previousScene });
		}
    }

	npcActions(player, npc) {
		console.log('NpcActions. NPC is: ' + npc.name);
		let dialog = [];
		let inventoryLength = this.hud.inventory.length;
		let hasKey = false;

		if(!this.blocked){
			dialog = ['Ja hem reparat el pont, el castell està més enllà.']
		}else{
			dialog = [
				"Tal com t'he comentat, el camí està en obres, no pots passar.",
				"Prova a **venir més tard.**"
			]
		}
		this.message.showMessageList(this, dialog);
	}
}
