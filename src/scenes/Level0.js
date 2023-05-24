import Common from '../classes/Common';
import Camera from '../classes/Camera';
import HUD from '../classes/HUD';
import Message from '../classes/Message.js';
import MainMenu from '../scenes/MainMenu.js';

export default class Level0 extends Phaser.Scene
{
	constructor()
	{
		super('Level0');

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
		this.currentScene = 'Level0';

		this.npcs = null;
		this.treasures = null;
		this.doors = null;
		this.cartells = null;
		this.bunnies = null;

		this.interactBtn = null;
		this.firstInteraction = null;
		

		this.common = null;
		this.message = null;
	}

	preload()
    { }

	create()
	{
		this.firstInteraction = this.registry.get('firstInteraction');
		console.log('First interaction is: ' + this.firstInteraction);

		// Create all resources
		this.common = new Common(this);
		this.message = new Message(this);
		this.camera = new Camera();

		// Create the tilemap using the loaded JSON file
		this.map = this.make.tilemap({ key: 'house-inside'});
	
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

		// NPCs will always look at the player
		this.npcLookDirection();
	
		this.npcs.getChildren().forEach((npc) => {
			const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.x, npc.y);
			if (distance < 75) {				
				// NOT SURE WHY WE NEED TO REINITIALIZE THIS VAR
				// BUT IF WE DON'T, MESSAGES ARE NOT SHOWN
				this.messageListShowing = [];
				
				// For first interaction, show a message list when approaching NPCs
				if(this.firstInteraction && !this.messageDisplaying){
					this.messageListShowing = [
						npc.name + ': Hola! Saps què?!\n\n**ENS CASEM!!!**', 
						npc.name + ': Ara tenim un problema, i és que **hem perdut tota la informació** sobre el casament.\nEns ajudes a trobar-la?'
					];
					this.message.showMessageList(this, this.messageListShowing);
					this.firstInteraction = false;
					// Set also the global var to false
					this.registry.set('firstInteraction', false);
				}
			}
		});
		
		// Check overlaps (show the 'B' button hint)
		this.common.checkOverlapsStaticGroups(this.npcs, this);
		this.common.checkOverlapsStaticGroups(this.doors, this);

		if (this.startScene) {
			console.log('Stop scene Level0, start scene Level1');
			this.startScene = false;
			this.scene.stop();
			this.backgroundMusic.stop();
			this.scene.start('Level1Prev');
		}
	}

	npcActions(player, npc) {
		console.log('NpcActions, checking if inventory is empty or not');
		if(this.hud.inventory.length == 0){
			console.log('Inventory is empty!');
			if(npc.name == 'Xavi'){
				this.messageListShowing = [
					npc.name + ': Hauries de parlar amb la **Miriam**, és aquí al costat.'
				]
				this.message.showMessageList(this, this.messageListShowing)
			}else if(npc.name == 'Miriam'){
				this.messageListShowing = [
					npc.name + ': Que bé que siguis aquí!\nHem **perdut tota la informació** sobre el casament...',
					npc.name + ': Però... potser ens pots ajudar a trobar-ho?',
					npc.name + ': Aquí tens la **clau** de la porta! Ànims!'
				]
				// Passem un callback per actualitzar l'inventari
				this.message.showMessageList(this, this.messageListShowing, function(scene){
					console.log('Update inventory: ' + scene.messageListShowing.length);
					scene.hud.inventory.push(npc.contents);
					scene.hud.updateInventory(scene, npc.contents);
					scene.common.chest_opened_sound.play();
				})
			}
		}else{
			console.log('Inventory is NOT empty!');
			// Look for the map in the inventory
			console.log('Objects in inventory: ' + this.hud.inventory);
			for (var i = 0; i < this.hud.inventory.length; i++) {
				console.log('Object in inventory: ' + this.hud.inventory[i]);
				if(this.hud.inventory[i] === 'map'){
					if(npc.name == 'Xavi'){
						this.message.showMessage(this, npc.name + ': Ja tens **el mapa**? Dona-li a la **Miriam**!')
					}else if(npc.name == 'Miriam'){
						if(npc.contents == ''){
							console.log(npc.name + ': Ja tens la **clau**, corre cap a la porta!');
						}else{
							this.message.showMessage(this, npc.name + ': Has trobat el mapa!\n\nEl casament serà a **"LA VINYASSA"**. És a prop **d\'Arbúcies!**\n\nAquí tens la **clau** per obrir la porta, al proper nivell esbrinaràs **la data** del casament!');
							this.common.chest_opened_sound.play();
							this.hud.updateInventory(this, npc.contents);
							this.hud.inventory.push(npc.contents);
							//npc.contents = '';
							return;
						}
					}
				}else if (this.hud.inventory[i] === 'key'){
					if(npc.name == 'Xavi'){
						this.message.showMessage(this, npc.name + ": La Miriam t'ha donat la **clau**? Doncs corre cap a la porta!");
					}else if (npc.name == 'Miriam'){
						this.message.showMessage(this, npc.name + ': Ja tens la **clau**! Ja pots obrir la porta.');
					}
				}
			}
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
		this.backgroundMusic = this.sound.add('background_music_house', { loop: true, volume: 0.2});
		// Play the audio file
		this.backgroundMusic.play();
	}
}