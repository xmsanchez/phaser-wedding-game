import Common from '../classes/Common';
import Camera from '../classes/Camera';

////////////////////////////////////////////////////////
// EL DESERT
////////////////////////////////////////////////////////
export default class Level3 extends Phaser.Scene
{
	constructor()
	{
		super('Level3');

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
		this.startScene = false;
		this.currentScene = 'Level3';

		this.npcs = null;
		this.treasures = null;
		this.doors = null;
		this.cartells = null;
		this.bunnies = null;

		this.interactBtn = null;
		this.firstInteraction = true;

		this.common = null;
		this.message = null;

		this.boxesPressed = [];
		// this.boxesOrder = [2, 1, 3, 4, 5, 6, 7, 8, 9];
		this.boxesOrder = [2, 1, 3];
		this.boxGameFinished = false;
		this.talkedToFada = false;
	}

	preload()
    {
		this.piano_s1 = this.sound.add('audio_piano_s1', { loop: false, volume: 0.4 });
		this.piano_s2 = this.sound.add('audio_piano_s2', { loop: false, volume: 0.4 });
		this.piano_s3 = this.sound.add('audio_piano_s3', { loop: false, volume: 0.4 });
		this.piano_s4 = this.sound.add('audio_piano_s4', { loop: false, volume: 0.4 });
		this.piano_s5 = this.sound.add('audio_piano_s5', { loop: false, volume: 0.4 });
		this.piano_s6 = this.sound.add('audio_piano_s6', { loop: false, volume: 0.4 });
		this.piano_s7 = this.sound.add('audio_piano_s7', { loop: false, volume: 0.4 });
	 }

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
		this.map = this.make.tilemap({ key: 'level3' });
	
		// Add the loaded tiles image asset to the map
		const tileset_field = this.map.addTilesetImage('tileset_field', 'tileset_field');
		const tileset_jungle = this.map.addTilesetImage('tileset_jungle', 'tileset_jungle');

		// Create all the layers
		this.common.createLevelLayer(this, 'bg_5', tileset_jungle, 0.4);
		this.common.createLevelLayer(this, 'bg_4', tileset_jungle, 0.5);
		this.common.createLevelLayer(this, 'bg_3', tileset_jungle, 0.6);
		this.common.createLevelLayer(this, 'bg_2', tileset_jungle, 0.7);
		this.common.createLevelLayer(this, 'top_bg4', tileset_field, 0.4);
		this.common.createLevelLayer(this, 'top_bg3', tileset_field, 0.5);
		this.common.createLevelLayer(this, 'top_bg2', tileset_field, 0.6);
		this.common.createLevelLayer(this, 'top_bg1', tileset_field, 0.7);
		this.common.createLevelLayer(this, 'bg_1', tileset_jungle, 0.8);
		this.common.createLevelLayer(this, 'fg_background', tileset_jungle, 0.9);
		this.common.createLevelLayer(this, 'ground_bg', tileset_jungle, 0.8);
		// this.common.createLevelLayer(this, 'rocks', tileset_field);
		this.common.createLevelLayer(this, 'ground_decorations', tileset_field);
		this.ground = this.common.createLevelLayer(this, 'ground_fg', tileset_jungle);
		this.platforms = this.common.createLevelLayer(this, 'platforms', tileset_field);
		
		this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels * tileset_jungle.tileHeight);

		// Spawn all interactable objects
		this.common.spawnNpcs(this, 'npcs', 4);
		// this.common.spawnTreasures(this);
		// this.common.spawnCartells(this);

		// Spawn player
		this.player = this.common.addPlayer(this);
		// On this level, make bounds a little narrower
		this.player.setSize(13);

		// Add colliders, input, hud, music
		this.common.addColliders(this);
		this.common.setCollisions(this, 0, 20000);

		this.common.loadMusic(this, tileset_jungle.name);

		// Add controls
		this.player.addTouchScreenPointers(this);
		this.player.setKeyboardControls(this);

		// Setup camera bounds and zoom
		this.camera.setCamera(this, 3);
		this.cameras.main.fadeIn(250);

		this.checkCompleted();
	}

	checkCompleted() {
		this.scenesVisited = this.registry.get('scenesVisited');
		this.previousScene = this.registry.get('previousScene');
		this.scenesVisited.push(this.currentScene);
		console.log('checkCompleted this.scenesVisited: ' + this.scenesVisited);
		this.sceneRegistry = this.registry.get(this.scene.key);
		let treasuresOpened = this.sceneRegistry.treasuresOpened;
		for(let i = 0; i < treasuresOpened.length; i++) {
			this.treasures.getChildren().forEach((treasure) => {
				if(treasure.name === treasuresOpened[i]) {
					treasure.opened = true;
					treasure.setFrame(11);
				}
			})
		}
	}

	update() {
		// Update player movement based on events
		this.player.playerMovement(this);
		
		this.npcs.getChildren().forEach((npc) => {
			// npc.anims.play('Fada_stand', true);
			// // NPCs will always look at the player
			// this.common.npcLookDirection(this, npc, distance);
		});
		
		// Check overlaps (show the 'B' button hint)
		this.common.checkOverlapsStaticGroups(this.npcs, this);
		// this.common.checkOverlapsStaticGroups(this.treasures, this);

		// if(this.player.x < 0){
		// 	this.common.startScene(this, 'PreLevel', { levelName: 'El vestit', timeout: 2500, levelKey: 'Level4', text: 'El misteri\nde les caixes' });
		// }else if(this.player.x > this.map.widthInPixels + 30){
		// 	let previousScene = this.previousScene;
		// 	this.common.startScene(this, 'PreLevel', { levelKey: previousScene });
		// }
	}

	npcActions(player, npc) {
		
	}
}
