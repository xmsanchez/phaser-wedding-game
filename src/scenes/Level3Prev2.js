import Common from '../classes/Common';
import Camera from '../classes/Camera';

////////////////////////////////////////////////////////
// EL DESERT (prev)
////////////////////////////////////////////////////////
export default class Level3Prev2 extends Phaser.Scene
{
	constructor()
	{
		super('Level3Prev2');

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
		this.map = this.make.tilemap({ key: 'house-outside'});
	
		// Add the loaded tiles image asset to the map
		const tileset = this.map.addTilesetImage('house-outside', 'house-outside');

		// Create all the layers
		this.common.createLevelLayer(this, 'bg_background', tileset);
		this.ground = this.common.createLevelLayer(this, 'ground_fg', tileset);
		
		this.physics.world.setBounds(0, 0, this.map.widthInPixels + 30, this.map.heightInPixels * tileset.tileHeight);

		// Spawn all interactable objects
		this.common.spawnDoors(this);
		this.common.spawnCartells(this, 'level1');

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
		
		// Check overlaps (show the 'B' button hint)
		this.common.checkOverlapsStaticGroups(this.cartells, this);
		this.common.checkOverlapsStaticGroups(this.doors, this);

		// If player goes out of the screen to the left, start next scene
		if(this.player.x > this.map.widthInPixels){
			console.log('Stop scene Level3Prev2, start scene Level3');
			this.common.stopScene(this);
			this.registry.set('previousScene', 'Level3Prev2');
			this.scene.start('PreLevel', { levelKey: 'Level3' });
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
