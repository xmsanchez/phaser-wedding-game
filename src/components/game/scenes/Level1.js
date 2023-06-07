import Common from '../classes/Common.js';
import Camera from '../classes/Camera.js';

////////////////////////////////////////////////////////
// EL MAPA
////////////////////////////////////////////////////////
export default class Level1 extends Phaser.Scene
{
	constructor()
	{
		super('Level1');

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
		this.currentScene = 'Level1';
		
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
		this.map = this.make.tilemap({ key: 'level1' });
	
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
		
		this.physics.world.setBounds(-30, 0, this.map.widthInPixels + 30, this.map.heightInPixels * tileset_jungle.tileHeight);

		// Spawn all interactable objects
		this.common.spawnNpcs(this, 'npcs', 4);
		this.common.spawnTreasures(this);
		this.common.spawnCartells(this);

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

		// Check overlaps (show the 'B' button hint)
		this.common.checkOverlapsStaticGroups(this.npcs, this);
		this.common.checkOverlapsStaticGroups(this.treasures, this);
		this.common.checkOverlapsStaticGroups(this.cartells, this);
		
		let dialog = [];
		this.npcs.getChildren().forEach((npc) => {
			// NPCs will always look at the player
			this.common.npcLookDirection(this, npc);

			if(!this.message.messageDisplaying){
				npc.anims.stop();
				npc.setFrame(2);
			}
			const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.x, npc.y);
			if (distance < 55) {
				if(this.firstInteraction && !this.message.messageDisplaying){
					dialog = [
					//	'Ei, Hola!', 'Soc l\'Stan!',
						'No estaràs pas buscant el mapa cap a Monkey Island, no?',
						'Potser busques un vaixell?',
						'Tinc els millors vaixells del mon.',
						'Que per què venc vaixells en un bosc?',
						'És una pregunta excelent! Doncs veuràs, tot va començar el dia en que...',
						'Que tens pressa? Que busques **el mapa** d\'un casament?',
						'Bé, doncs si trobes la **clau** per obrir aquest bagul, et donaré **el mapa** que busques!'
					];
					npc.anims.play('Stan_stand', true);
					this.message.showMessageList(this, dialog, function(scene){
						scene.firstInteraction = false;
					})
				}
			}
		});

		if(this.player.x < 0){
			if(this.hasMap){
				this.startScene = true;
				this.common.startScene(this, 'PreLevel', { levelName: '', timeout: 2000, levelKey: 'Level2Prev', text: 'Uns minuts\nmés tard...' });
			}else{
				this.startScene = true;
				this.common.startScene(this, 'PreLevel', { levelKey: 'Level1Prev' });
			}
		}
    }

	npcActions(player, npc) {
		npc.anims.play('Stan_stand', true);
		console.log('NpcActions. NPC is: ' + npc.name);
		let dialog = [];
		let inventoryLength = this.hud.inventory.length;
		let hasKey = false;

		if(!this.firstInteraction){
			for (var i = 0; i < inventoryLength; i++) {
				console.log('Object in inventory: ' + this.hud.inventory[i]);
				if(this.hud.inventory[i] === 'key'){
					hasKey = true;
				}
			}
			if(hasKey && !this.hasMap){
				dialog = [
					'**(!!!!!)** Veig que has trobat **la clau!** (D\'on carai l\haurà tret???)',
					'Segur que no estàs interessat en comprar un vaixell?',
					'Bé, crec que no em deixes alternativa',
					'Una promesa és una promesa. Aquí tens **el mapa**'];
				this.message.showMessageList(this, dialog, function(scene){
					console.log('Update inventory');
					scene.hud.inventory.pop('key');
					scene.hud.inventory.push(npc.contents);
					scene.hud.updateInventory(scene, npc.contents);
					// TODO FIX MAP POPING INSTEAD OF KEY!!!
					scene.common.chest_opened_sound.play();
					scene.hasMap = true;
				})
			}else if(this.hasMap){
				dialog = [
					'Ja tens **el mapa**, si no tens intencions de comprar un vaixell deixa\'m estar, estic molt ocupat'
				]
				this.message.showMessageList(this, dialog);
			}else{
				console.log('Not first interaction, plus nothing in inventory');
				dialog = [
					'Hola de nou!',
					'Ja has trobat la **clau**?',
					'T\'he explicat ja que venc els millors vaixells del món?',
					'Que no estàs interessat? Bé, és una llàstima! Sort amb la cerca de la **clau**!',
					'(el tindré donant voltes sense saber que **per molt amunt que pugi** no trobarà cap **clau**...)'
				]
				this.message.showMessageList(this, dialog, function(scene){})
			}
		}
	}
}
