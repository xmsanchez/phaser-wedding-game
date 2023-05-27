import Common from '../classes/Common';
import Camera from '../classes/Camera';
import HUD from '../classes/HUD';
import Message from '../classes/Message.js';

export default class Level4 extends Phaser.Scene
{
	constructor()
	{
		super('Level4');

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
		this.currentScene = 'Level5';

		this.npcs = null;
		this.treasures = null;
		this.doors = null;
		this.cartells = null;
		this.bunnies = null;

		this.interactBtn = null;
		this.firstInteraction = true;

		this.common = null;
		this.message = null;
	}

	preload()
    { }

	create()
	{
		// Create all resources
		this.common = new Common(this);
		this.camera = new Camera();
		this.common.addInput(this);
		this.message = this.registry.get('Message');
		this.hud = this.registry.get('HUD');

		// Create the tilemap using the loaded JSON file
		this.map = this.make.tilemap({ key: 'level4'});
	
		// Add the loaded tiles image asset to the map
		const tileset = this.map.addTilesetImage('livingroom', 'livingroom');
		// const objects = this.map.addTilesetImage('objects', 'objects');

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
	}

	update() {
		// Update player movement based on events
		this.player.playerMovement(this);
		
		// Setup camera bounds and zoom
		this.camera.setCamera(this, 2.40);

		// // NPCs will always look at the player
		// this.npcLookDirection();

		// this.npcs.getChildren().forEach((npc) => {
		// 	const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.x, npc.y);
		// 	if (distance < 300) {				
		// 		// NOT SURE WHY WE NEED TO REINITIALIZE THIS VAR
		// 		// BUT IF WE DON'T, MESSAGES ARE NOT SHOWN
		// 		this.messageListShowing = [];
				
		// 		// For first interaction, show a message list when approaching NPCs
		// 		if(this.firstInteraction && !this.message.messageDisplaying){
		// 			this.messageListShowing = [
		// 				npc.name + ': Que bé! Has aconseguit el rellotge.\nMalauradament... també necessitaràs un vestit',
		// 				npc.name + ': Penso que dins del bosc, passat el jardí, el trobaràs.',
		// 			];
		// 			this.message.showMessageList(this, this.messageListShowing);
		// 			this.firstInteraction = false;
		// 		}
		// 	}
		// });

		// // Check overlaps (show the 'B' button hint)
		// this.common.checkOverlapsStaticGroups(this.npcs, this);
		// this.common.checkOverlapsStaticGroups(this.doors, this);

		if (this.startScene) {
			console.log('Stop scene Level4, start scene Level5');
		}
	}

	npcActions(player, npc) {
		console.log('NpcActions, checking if inventory is empty or not');
		if(npc.name == 'Xavi'){
			
		}else if(npc.name == 'Miriam'){
			
		}
	}

	npcLookDirection() {
		const position = this.npcs.getChildren().find((npc) => {
			if(this.player.x > npc.x + npc.width / 2){
				npc.setFrame(7);
			}else{
				npc.setFrame(3);
			}
		})
	}

	loadMusic(){
		// Create an instance of the audio object
		this.backgroundMusic = this.sound.add('background_music_house', { loop: true, volume: 0.2});
		// Play the audio file
		this.backgroundMusic.play();
	}
}
