import Common from '../classes/Common';
import Camera from '../classes/Camera';
import HUD from '../classes/HUD';
import Message from '../classes/Message.js';

export default class Level4Prev extends Phaser.Scene
{
	constructor()
	{
		super('Level4Prev');

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
		this.messageListShowing = [];

		this.startScene = false;
		this.currentScene = 'Level4';

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
		this.message = new Message(this);
		this.camera = new Camera();

		// Create the tilemap using the loaded JSON file
		this.map = this.make.tilemap({ key: 'level4-prev'});
	
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
		this.joystick = this.common.addInput(this).joystick;
		this.hud = new HUD();
		this.hud.addHud(this);
		this.loadMusic();

		// Add controls
		this.player.addTouchScreenPointers(this);
		this.player.setKeyboardControls(this);

		// Make Xavi a little bit closer
		this.npcs.getChildren().forEach((npc) => {
			if(npc.name == 'Xavi'){
				npc.x = this.player.x + 80;
				npc.container.x = npc.x;
			}
		});

		this.doors.getChildren().forEach((door) => {
			door.opened = true;
		});
	}

	update() {
		// this.doors[0].opened = true;
		
		// Update player movement based on events
		this.player.playerMovement(this);
		
		// Setup camera bounds and zoom
		this.camera.setCamera(this, 2.40);

		// NPCs will always look at the player
		this.npcLookDirection();

		this.npcs.getChildren().forEach((npc) => {
			const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.x, npc.y);
			if (distance < 300) {				
				// NOT SURE WHY WE NEED TO REINITIALIZE THIS VAR
				// BUT IF WE DON'T, MESSAGES ARE NOT SHOWN
				this.messageListShowing = [];
				
				// For first interaction, show a message list when approaching NPCs
				if(this.firstInteraction && !this.messageDisplaying){
					this.messageListShowing = [
						npc.name + ': Que bé! Has aconseguit **el rellotge.**\nMalauradament... també necessitaràs **un vestit**',
						npc.name + ': Penso que **dins del bosc**, passat el jardí, el trobaràs.',
					];
					this.message.showMessageList(this, this.messageListShowing);
					this.firstInteraction = false;
				}
			}
		});

		this.common.checkOverlapsStaticGroups(this.npcs, this);
		this.common.checkOverlapsStaticGroups(this.doors, this);

		if (this.startScene) {
			console.log('Stop scene Level4Prev, start scene Level4');
			this.message.showMessage(this, 'Aquí hem de iniciar el Nivell 4');
			// this.startScene = false;
			// this.scene.stop('Level5Prev');
			// this.backgroundMusic.stop();
			// this.scene.start('PreLevel', { levelName: 'Nivell 5', levelKey: 'Level5', text: 'El vestit' });
		}
	}

	npcActions(player, npc) {
		console.log('NpcActions, checking if inventory is empty or not');
		if(npc.name == 'Xavi'){
			// this.message.showMessage(scene, npc.name + ": Encara no has trobat el mapa? Ha de ser dins d'un bagul");
			this.messageListShowing = [npc.name + ': Ves a buscar **el vestit**!']
			this.message.showMessageList(this, this.messageListShowing)
		}else if(npc.name == 'Miriam'){
			this.messageListShowing = [
				npc.name + ': Estic molt contenta de que hagis trobat **el rellotge!**',
				npc.name + ': Ja has parlat amb el **Xavi** sobre el següent que necessitaràs?'
			]
			this.message.showMessageList(this, this.messageListShowing);
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
