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

		this.inInfraworld = false;
		this.inInfraWorldRight = false;
		this.inInfraWorldLeft = false;
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
		const castle_outside = this.map.addTilesetImage('castle_outside', 'castle_outside');

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
		this.common.createLevelLayer(this, 'ground_bg', tileset_field);
		this.common.createLevelLayer(this, 'castle_outside', castle_outside);
		// this.common.createLevelLayer(this, 'rocks', tileset_field);
		this.common.createLevelLayer(this, 'ground_decorations', tileset_field);
		this.ground = this.common.createLevelLayer(this, 'ground_fg', tileset_jungle);
		this.fire = this.common.spawnFire(this);
		// this.common.setFireAnimations(this, 'fire');
		
		this.rocks = this.common.createLevelLayer(this, 'rocks', tileset_field);
		this.rocks2 = this.common.createLevelLayer(this, 'rocks2', tileset_jungle);
		this.platforms = this.common.createLevelLayer(this, 'platforms', tileset_field);
		
		this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels * tileset_jungle.tileHeight);

		// Spawn all interactable objects
		this.common.spawnNpcs(this, 'npcs', 4);
		this.common.spawnDoors(this);
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
		this.camera.setCamera(this, 2.5);
		this.cameras.main.fadeIn(250);

		this.checkCompleted();

		this.npcs.getChildren().forEach((npc) => {
			let vestit = this.hud.searchInventory('vestit');
			if(vestit == null){
				// If we don't have the dress just put these NPCs out of sight
				if(npc.name == 'Xavi' || npc.name == 'Miriam'){
					npc.x = -200;
				}
			}
			if(npc.name == 'Peter Pan'){
				this.npcFly(npc, 20);
			}else if (npc.name == 'Geni'){
				this.npcFly(npc, 4);
			}
			npc.anims.play(npc.name + '_stand', true);
		})

		if(this.previousScene == 'Level4'){
			this.player.x = this.doors.getChildren()[0].x;
			this.player.y = this.doors.getChildren()[0].y - 20;
		}

		this.bark = this.sound.add('audio_dog_bark', { loop: false, volume: 0.5 });
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
			const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.x, npc.y);
			if(!this.message.messageDisplaying){
				npc.anims.play(npc.name + '_stand', true);
			}

			// NPCs will always look at the player
			if(npc.name != 'Rapunzel'){
				if(npc.name != 'Xavi' && npc.name != 'Miriam' && npc.name != 'Simba') {
					this.common.npcLookDirection(this, npc, distance, true);
				}else{
					this.common.npcLookDirection(this, npc, distance);
				}
			}
		});
		
		// Check overlaps (show the 'B' button hint)
		this.common.checkOverlapsStaticGroups(this.npcs, this);
		this.common.checkOverlapsStaticGroups(this.doors, this);
		// this.common.checkOverlapsStaticGroups(this.treasures, this);

		if(this.player.y >= this.map.heightInPixels - 300){
			this.inInfraworld = true;
			if(this.player.x > this.map.widthInPixels - 350){
				console.log('Must set this.infraworldright as true: ' + this.inInfraWorldRight);
				this.inInfraWorldRight = true;
				this.inInfraWorldLeft = false;
			}else if(this.player.x < 625){
				console.log('Must set this.infraworldleft as true: ' + this.inInfraWorldLeft);
				this.inInfraWorldRight = false;
				this.inInfraWorldLeft = true;
			}
		}

		// If player falls out from the screen, restore it
		if (this.player.y > this.map.heightInPixels) {
			if(this.inInfraWorldRight){
				console.log('infraworld Must spawn at the right');
				console.log("this.inInfraWorldLeft: " + this.inInfraWorldLeft);
				console.log("this.inInfraWorldRight: " + this.inInfraWorldRight);
				this.player.x = this.map.widthInPixels - 250;
				this.player.y = this.map.heightInPixels - 100;
			}
			if(this.inInfraWorldLeft){
				console.log('infraworld Must spawn at the left');
				console.log("this.inInfraWorldLeft: " + this.inInfraWorldLeft);
				console.log("this.inInfraWorldRight: " + this.inInfraWorldRight);
				this.player.x = 625;
				this.player.y = this.map.heightInPixels - 100;
			}
		}
	}

	npcFly(npc, distance) {
		this.tweens.add({
			targets: npc,
			y: npc.y + distance,
			duration: 1200,
			ease: 'Sine.easeInOut',
			yoyo: true,
			repeat: -1
		});
	}

	npcActions(player, npc) {
		npc.anims.play(npc.name + '_talking', true);
		switch(npc.name) {
			case 'Bèstia':
				this.npcActionsBeast(player, npc);
				break;
			case 'Aladdin':
				this.npcActionsAladdin(player, npc);
				break;
			case 'Gaston':
				this.npcActionsGaston(player, npc);
				break;
			case 'Malèfica':
				this.npcActionsMaleficent(player, npc);
				break;
			case 'Peter Pan':
				this.npcActionsPeterPan(player, npc);
				break;
			case 'Pluto':
				this.npcActionsPluto(player, npc);
				break;
			case 'Rapunzel':
				this.npcActionsRapunzel(player, npc);
				break;
			case 'Mickey Mouse':
				this.npcActionsMickeyMouse(player, npc);
				break;
			case 'Geni':
				this.npcActionsGenie(player, npc);
				break;
			case 'Simba':
				this.npcActionsSimba(player, npc);
				break;
			case 'Hades':
				this.npcActionsHades(player, npc);
				break;
		}
	}

	npcActionsAladdin(player, npc) {
		if(!this.message.messageDisplaying) {
			let dialog = [
				npc.name + ": Hola, amic aventurer! T'agraden les emocions fortes?",
				npc.name + ": Recordo els carrers d'Agrabah, obria portes en l'ordre correcte per evitar els guàrdies.",
				npc.name + ": Aquí tens el meu consell, **la sisena caixa**, ha de ser **la primera** que obres."
			]
			this.message.showMessageList(this, dialog);
		}
	}

	npcActionsGaston(player, npc) {
		if(!this.message.messageDisplaying) {
			let dialog = [
				npc.name + ": Què fas aquí, petit ratolí?",
				npc.name + ": Necessites una pista? No pots amb aquest desafiament?",
				npc.name + ": Està bé, te la donaré perquè sóc el millor en tot. **La quarta caixa** és **la segona** que hauries d'obrir."
			]
			this.message.showMessageList(this, dialog);
		}
	}

	npcActionsBeast(player, npc) {
		if(!this.message.messageDisplaying) {
			let dialog = [
				npc.name + ": Per què em molestes?",
				npc.name + ": Aquest castell està ple de secrets i en tinc un per a tu. **La vuitena caixa**, ha de ser **la tercera** en obrir."
			]
			this.message.showMessageList(this, dialog);
		}
	}

	npcActionsMaleficent(player, npc) {
		if(!this.message.messageDisplaying) {
			let dialog = [
				npc.name + ": Ah, buscant respostes, no és així?",
				npc.name + ": De vegades el camí correcte no és el més obvi. **La segona caixa**, fes-la **la quarta** a obrir."
			]
			this.message.showMessageList(this, dialog);
		}
	}

	npcActionsPeterPan(player, npc) {
		if(!this.message.messageDisplaying) {
			let dialog = [
				npc.name + ": Hola, company! Preparat per a una aventura al País de Mai Més?",
				npc.name + ": No tots els tresors estan al final del mapa. **La novena caixa**, ha de ser **la cinquena** a obrir."
			]
			this.message.showMessageList(this, dialog);
		}
	}

	npcActionsPluto(player, npc) {
		if(!this.message.messageDisplaying) {
			// this.bark.play();
			let dialog = [
				"(En Pluto mou la cua amb entusiasme quan li acaricies el cap)",
				"(Assenyala amb la pota que **la primera caixa** ha de ser **la sisena** a obrir)",
				"(Escoltes a en Bug lladrant perquè estàs fent cas a un altre gosset. Decideixes seguir el teu camí...)"
			]
			this.message.showMessageList(this, dialog, function(scene){
				// Play the sound 3 times in a row, then stop
				var playCount = 3;
				scene.bark.play();
				scene.bark.on('complete', function() {
					playCount--;
					if (playCount > 0) {
						scene.bark.play();
					} else {
						scene.bark.stop();
					}
				});
			});
		}
	}

	npcActionsRapunzel(player, npc) {
		if(!this.message.messageDisplaying) {
			let dialog = [
				npc.name + ": Hola! Aquest enigma que has de resoldre em recorda als misteris de la meva torre!",
				npc.name + ": Et donaré una pista, **la tercera caixa** és **la setena** que hauries d'obrir."
			]
			this.message.showMessageList(this, dialog);
		}
	}

	npcActionsMickeyMouse(player, npc) {
		if(!this.message.messageDisplaying) {
			let dialog = [
				npc.name + ": Hola, amic! Preparat per a un bon moment?",
				npc.name + ": Aquí va el meu consell, **la setena caixa** ha de ser **la vuitena** a obrir."
			]
			this.message.showMessageList(this, dialog);
		}
	}

	npcActionsGenie(player, npc) {
		if(!this.message.messageDisplaying) {
			let dialog = [
				npc.name + ": Hola, amic! Estàs llest per un desig?",
				npc.name + ": Vols una pista? Doncs aquí va: **la cinquena caixa** ha de ser **la novena** a obrir."
			]
			this.message.showMessageList(this, dialog);
		}
	}

	npcActionsSimba(player, npc) {
		if(!this.message.messageDisplaying) {
			let dialog = [
				npc.name + ": Hola, amic! Sents la crida de la savana?",
				npc.name + ": Aquest bosc és ple de misteris, igual que aquest enigma que has de resoldre.",
				npc.name + ": El meu consell per a tu, **la setena caixa** ha de ser **la vuitena** a obrir."
			]
			this.message.showMessageList(this, dialog);
		}
	}
	
	npcActionsHades(player, npc) {
		if(!this.message.messageDisplaying) {
			let dialog = [
				npc.name + ": Oh, un altre mortal perdut.",
				npc.name + ": Els misteris dels déus són complexos, com aquest enigma que has de resoldre.",
				npc.name + ": Però ja que estàs aquí, et donaré una pista. **La novena caixa**, ha de ser **la cinquena** a obrir."
			]
			this.message.showMessageList(this, dialog);
		}
	}
}
