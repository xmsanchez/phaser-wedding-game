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
		this.map = this.make.tilemap({ key: 'level3'});
	
		// Add the loaded tiles image asset to the map
		const tileset = this.map.addTilesetImage('castle_inside', 'castle_inside');

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
		
		this.common.loadMusic(this, tileset.name);

		// Add controls
		this.player.addTouchScreenPointers(this);
		this.player.setKeyboardControls(this);
	}

	update() {
		// Update player movement based on events
		this.player.playerMovement(this);
		
		// Setup camera bounds and zoom
		this.camera.setCamera(this, 1.80);

		this.npcs.getChildren().forEach((npc) => {
			// npc.anims.play('Fada_stand', true);
			// // NPCs will always look at the player
			// this.common.npcLookDirection(this, npc);
		});
		
		// Check overlaps (show the 'B' button hint)
		this.common.checkOverlapsStaticGroups(this.npcs, this);
		// this.common.checkOverlapsStaticGroups(this.doors, this);

		if (this.startScene) {
			console.log('Stop scene Level3, start scene Level3');
		}
	}

	npcActions(player, npc) {
		if(npc.name == 'Bug'){
			this.common.actionsBug(this, npc);
		}else{
			console.log('Interacting with npc.name: ' + npc.name);
			npc.anims.stop();
			npc.anims.play('Fada_talking', true);
			if(this.firstInteraction && !this.message.messageDisplaying){
				this.messageListShowing = [
					npc.name + ': Hola personeta!',
					npc.name + ': Per què no proves a ordenar les **caixes?**',
				];
				this.message.showMessageList(this, this.messageListShowing);
				// this.firstInteraction = false;
			}
		}
	}
}
