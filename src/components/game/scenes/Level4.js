import Common from '../classes/Common';
import Camera from '../classes/Camera';

////////////////////////////////////////////////////////
// EL DESERT
////////////////////////////////////////////////////////
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

		this.boxesPressed = [];
		// this.boxesOrder = [2, 1, 3, 4, 5, 6, 7, 8, 9];
		this.boxesOrder = [2, 1, 3];
		this.boxGameFinished = false;
		this.boxGameTunePlaying = false;
		this.talkedToFada = false;
	}

	preload()
    {
		this.piano_s1 = this.sound.add('audio_piano_s1', { loop: false, volume: 1 });
		this.piano_s2 = this.sound.add('audio_piano_s2', { loop: false, volume: 1 });
		this.piano_s3 = this.sound.add('audio_piano_s3', { loop: false, volume: 1 });
		this.piano_s4 = this.sound.add('audio_piano_s4', { loop: false, volume: 1 });
		this.piano_s5 = this.sound.add('audio_piano_s5', { loop: false, volume: 1 });
		this.piano_s6 = this.sound.add('audio_piano_s6', { loop: false, volume: 1 });
		this.piano_s7 = this.sound.add('audio_piano_s7', { loop: false, volume: 1 });
	 }

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
		const tileset = this.map.addTilesetImage('castle_inside', 'castle_inside');

		// Create all the layers
		this.common.createLevelLayer(this, 'bg_background', tileset);
		this.common.createLevelLayer(this, 'fg_background', tileset);
		this.ground_bg = this.common.createLevelLayer(this, 'ground_bg', tileset);
		this.ground = this.common.createLevelLayer(this, 'ground_fg', tileset);
		this.common.createLevelLayer(this, 'ground_decorations', tileset);
		this.common.createLevelLayer(this, 'decorations', tileset);
		
		this.physics.world.setBounds(-60, 0, this.map.widthInPixels + 60, this.map.heightInPixels * tileset.tileHeight);

		// Spawn all interactable objects
		this.common.spawnNpcs(this, 'npcs');
		this.common.spawnTreasures(this, 12);

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
		this.camera.setCamera(this, 1.80);
		this.cameras.main.fadeIn(250);

		this.checkCompleted();

		this.npcs.getChildren().forEach((npc) => {
			if(npc.name == 'Fada'){
				this.npc = npc;
			}
		});

		// // TODO REMOVE THIS, ONLY SET FOR DEBUG
		// this.hud.inventory.push('vestit');
		// this.hud.updateInventory(this, 'vestit');
	}

	checkCompleted() {
		this.scenesVisited = this.registry.get('scenesVisited');
		this.previousScene = this.registry.get('previousScene');
		this.scenesVisited.push(this.currentScene);
		console.log('checkCompleted this.scenesVisited: ' + this.scenesVisited);
		this.sceneRegistry = this.registry.get(this.scene.key);
		// let treasuresOpened = this.sceneRegistry.treasuresOpened;
		// for(let i = 0; i < treasuresOpened.length; i++) {
		// 	this.treasures.getChildren().forEach((treasure) => {
		// 		if(treasure.name === treasuresOpened[i]) {
		// 			treasure.opened = true;
		// 			treasure.setFrame(11);
		// 		}
		// 	})
		// }
	}

	update() {
		// Update player movement based on events
		this.player.playerMovement(this);
		
		// Check overlaps (show the 'B' button hint)
		this.common.checkOverlapsStaticGroups(this.npcs, this);

		if(!this.boxGameFinished){
			this.common.checkOverlapsStaticGroups(this.treasures, this);
		}

		if(!this.boxGameFinished && (this.boxesPressed.length == this.boxesOrder.length) && (!this.message.messageDisplaying)){
			if(this.comparaArrays(this.boxesPressed, this.boxesOrder)){
				this.boxGameIsFinished(this, function(scene){
					scene.messageListShowing = [
						'Fada: Ho has fet molt, molt bé! Ara puc obrar la meva màgia.',
						'Fada: Bibidi-babidi-bu!',
						'(obtens el vestit!!)'
					]
					scene.npc.anims.play('Fada_talking', true);
					scene.message.showMessageList(scene, scene.messageListShowing, function(scene){
						scene.messageListShowing = [];
						scene.npc.anims.play('Fada_stand', true);
						console.log('Give the dress to the user');
						scene.hud.inventory.push(scene.npc.contents);
						scene.hud.updateInventory(scene, scene.npc.contents);
						scene.common.chest_opened_sound.play();
					});
					scene.boxGameFinished = true;
					scene.firstInteraction = false;
				});
				
			}else{
				this.message.showMessage(this, "No has pressionat les tecles en l'ordre correcte!", function(scene){
					scene.treasures.getChildren().forEach((treasure) => {
						treasure.opened = false;
						treasure.setFrame(14);
					})
				});
				this.boxesPressed = [];
			}
		}

		// If player goes out of the screen to the left, start next scene
		if(this.player.x < -30){
			this.common.startScene(this, 'PreLevel', { levelKey: 'Level3' });
		}
	}

	boxGameIsFinished(scene, func) {
		scene.backgroundMusic = scene.sound.add('background_music_tangled', { loop: true, volume: 0.001});

		scene.common.fadeInMusic(scene, 0.1, 30000);
		if(!scene.message.messageDisplaying){
			scene.message.showMessageList(scene, ['Comences a escoltar una melodia que sona cada vegada més a prop...', '.'], function(scene){
				func(scene);
			})
		}
	}

	comparaArrays(array1, array2) {
		if (array1.length !== array2.length) {
		  return false;
		}
	  
		for (let i = 0; i < array1.length; i++) {
		  if (array1[i] !== array2[i]) {
			return false;
		  }
		}
	  
		return true;
	  }

	npcActions(player, npc) {
		if(npc.name == 'Bug'){
			this.common.actionsBug(this, npc);
		}else{
			console.log('Interacting with npc.name: ' + npc.name);
			npc.anims.stop();
			if(!this.message.messageDisplaying){
				if(this.firstInteraction){
					let dialog = [
						npc.name + ': Hola preciositat!',
						npc.name + ": Per què no proves a ordenar les **caixes?**.",
						npc.name + ": Només **has de tocar-les en l'ordre correcte**",
					];
					this.message.showMessageList(this, dialog);
					this.firstInteraction = false;
				}else if(!this.boxGameFinished){
					let dialog = [
						npc.name + ': Recorda: Prova a ordenar les **caixes**.',
						npc.name + ": No saps quin és l'**ordre correcte?**. Torna al **bosc** sortint aquí a l'esquerra i **parla amb tothom** qui trobis, et donaran les pistes que necessites!",
					];
					this.message.showMessageList(this, dialog);
				}else{
					let dialog = [
						npc.name + ': Ja has obtingut tot el que necessites per al **casament**.',
						npc.name + ": La **Miriam** i el **Xavi** t'esperen **fora del castell**.",
					];
					this.message.showMessageList(this, dialog);
				}
			}
		}
	}
}
