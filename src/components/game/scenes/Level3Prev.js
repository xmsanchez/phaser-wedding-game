import Common from '../classes/Common';
import Camera from '../classes/Camera';

////////////////////////////////////////////////////////
// EL DESERT (prev)
////////////////////////////////////////////////////////
export default class Level3Prev extends Phaser.Scene
{
	constructor()
	{
		super('Level3Prev');

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
		
		this.common.loadMusic(this, tileset.name);

		// Add controls
		this.player.addTouchScreenPointers(this);
		this.player.setKeyboardControls(this);

		// Setup camera bounds and zoom
		this.camera.setCamera(this, 2.40);
		this.cameras.main.fadeIn(250);

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

		this.checkCompleted();
	}

	checkCompleted() {
		this.scenesVisited = this.registry.get('scenesVisited');
		this.previousScene = this.registry.get('previousScene');
		this.scenesVisited.push(this.currentScene);
		console.log('checkCompleted this.scenesVisited: ' + this.scenesVisited);
		this.sceneRegistry = this.registry.get(this.scene.key);
		let doorsOpened = this.sceneRegistry.doorsOpened;
		for(let i = 0; i < doorsOpened.length; i++) {
			this.doors.getChildren().forEach((door) => {
				console.log('checkCompleted - Comaring to door.name: ' + door.name);
				if(door.name === doorsOpened[i]) {
					console.log('checkCompleted - Found it!! -> ' + door.name);
					door.opened = true;
					this.doorOpened = true;
				}
			})
		}
	}

	update() {
		// Update player movement based on events
		this.player.playerMovement(this);

		this.npcs.getChildren().forEach((npc) => {
			const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.x, npc.y);
			
			// NPCs will always look at the player
			this.common.npcLookDirection(this, npc, distance);

			if (distance < 300) {				
				// NOT SURE WHY WE NEED TO REINITIALIZE THIS VAR
				// BUT IF WE DON'T, MESSAGES ARE NOT SHOWN
				this.messageListShowing = [];
				
				// For first interaction, show a message list when approaching NPCs
				if(this.firstInteraction && !this.message.messageDisplaying){
					// If we come from the next scene, don't show the initial message
					if(this.previousScene == 'Level3Prev2'){
						this.firstInteraction = false;
					}else{
						this.messageListShowing = [
							npc.name + ': Que bé! Has aconseguit el **rellotge.**\nMalauradament... també necessitaràs **un vestit**',
							npc.name + ': Hauries **d\'anar al castell**, travessant el pont que hi ha sortint a mà esquerra.',
							npc.name + ': Ànims! Ja gairabé ho tens tot!'
						];
						this.message.showMessageList(this, this.messageListShowing);
						this.firstInteraction = false;
					}
					
				}
			}
		});

		this.common.checkOverlapsStaticGroups(this.npcs, this);
		this.common.checkOverlapsStaticGroups(this.doors, this);
	}

	npcActions(player, npc) {
		if(npc.name == 'Bug'){
			this.common.actionsBug(this, npc);
		}else{
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
	}
}
