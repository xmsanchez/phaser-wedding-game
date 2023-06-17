import Common from '../classes/Common';
import Camera from '../classes/Camera';

////////////////////////////////////////////////////////
// EL DESERT
////////////////////////////////////////////////////////
export default class Level5 extends Phaser.Scene
{
	constructor()
	{
		super('Level5');

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

		this.boxesPressed = [];
		// this.boxesOrder = [2, 1, 3, 4, 5, 6, 7, 8, 9];
		this.boxesOrder = [2, 1, 3];
		this.boxGameFinished = false;
		this.talkedToFada = false;

		this.inInfraworld = false;
		this.inInfraWorldRight = false;
		this.inInfraWorldLeft = false;

		this.vestit = false;
		this.lanterns = null;
		this.spawnTimer = null;
	}

	preload()
    { }

	create()
	{
		// Create all resources
		this.sceneRegistry = this.registry.get(this.scene.key);
		this.common = new Common(this);
		this.camera = new Camera();
		this.common.addInput(this);
		this.message = this.registry.get('Message');
		this.hud = this.registry.get('HUD');
		// In this scene we will hide the inventory
		this.hud.container.setVisible(false);

		this.initialCameraZoom = 1;
		this.joystickBaseScale = null;

		// Create the tilemap using the loaded JSON file
		this.map = this.make.tilemap({ key: 'level5' });
	
		// Add the loaded tiles image asset to the map
		const tileset_night = this.map.addTilesetImage('tileset_night', 'tileset_night');
		const tileset_sky = this.map.addTilesetImage('sky_night', 'sky_night');
		const castle_outside = this.map.addTilesetImage('castle_outside', 'castle_outside');

		// Create all the layers
		this.common.createLevelLayer(this, 'top_bg4', tileset_sky, 0.4);
		this.common.createLevelLayer(this, 'top_bg3', tileset_sky, 0.5);
		this.common.createLevelLayer(this, 'top_bg2', tileset_sky, 0.6);
		this.common.createLevelLayer(this, 'top_bg1', tileset_sky, 0.7);
		this.common.createLevelLayer(this, 'ground_bg', tileset_night);
		this.common.createLevelLayer(this, 'castle_outside', castle_outside);
		// this.common.createLevelLayer(this, 'rocks', tileset_night);
		this.ground = this.common.createLevelLayer(this, 'ground_fg', tileset_night);
		
		this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels * tileset_night.tileHeight);

		// Spawn all interactable objects
		this.common.spawnNpcs(this, 'npcs', 4);

		// Spawn player
		this.player = this.common.addPlayer(this);
		// On this level, make bounds a little narrower
		this.player.setSize(13);

		// Add colliders, input, hud, music
		this.common.addColliders(this);
		this.common.setCollisions(this, 0, 20000);

		this.common.loadMusic(this, tileset_night.name);

		// // Add controls
		// this.player.addTouchScreenPointers(this);
		// this.player.setKeyboardControls(this);

		// Setup camera bounds and zoom
		this.camera.setCameraLastScene(this, 1.5);
		this.cameras.main.fadeIn(4000);
		this.cameras.main.scrollY = this.map.heightInPixels;
		console.log('Map in pixels is: ' + this.map.heightInPixels);
	
		let camera = this.cameras.main;
		this.player.setFrame(10);

		// Begin to move the camera to the left after a delay
		this.time.delayedCall(1000, () => {
			console.log('Move the camera at x axis');
			this.tweens.add({
				targets: camera,
				scrollX: 200, // target position
				duration: 18000, // how long the tween should take in milliseconds
				ease: 'Sine.easeInOut' // easing function to make the movement smooth
			});
		});
	
		// After n seconds, begin to move the camera up
		this.time.delayedCall(5000, () => {
			console.log('Move the camera at y axis');
			this.tweens.add({
				targets: camera,
				zoom: 1,
				scrollY: 300, // target position
				duration: 9000, // how long the tween should take in milliseconds
				ease: 'Sine.easeInOut' // easing function to make the movement smooth
			});
		});

		// After n seconds, begin to move the camera up again
		this.time.delayedCall(24000, () => {
			console.log('Move the camera at y axis');
			this.tweens.add({
				targets: camera,
				zoom: 1.7,
				scrollY: -600, // target position
				duration: 20000, // how long the tween should take in milliseconds
				ease: 'Sine.easeInOut' // easing function to make the movement smooth
			});
		});

		this.lanterns = this.physics.add.group();

		this.spawnLanterns();
		// this.spawnTimer = this.time.addEvent({
		// 	delay: 15000, // delay in ms
		// 	callback: this.spawnLanterns,
		// 	callbackScope: this,
		// 	loop: true
		// });

		this.checkCompleted();

		this.npcs.getChildren().forEach((npc) => {
			if(npc.name == 'Peter Pan'){
				this.npcFly(npc, 20);
			}else if (npc.name == 'Geni'){
				this.npcFly(npc, 4);
			}
			if(npc.name != 'Xavi' && npc.name != 'Miriam'){
				npc.anims.play(npc.name + '_stand', true);
			}else{
				npc.flipX = true;
			}
		})

		this.lights.enable();
        this.lights.setAmbientColor(0xFFFFFF);
		
		this.thankYouText = null;
		this.manageText();
	}

	manageText() {
		this.thankYouText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 
			'Gràcies per acompanyar-nos\nen aquest viatge', {
			fontSize: '32px',
			fill: '#FFFFFF',
			align: 'center'
		}).setOrigin(0.5, 0.5); // Set origin to the center of text

		// Make the text invisible initially
		this.thankYouText.setVisible(false);
		this.thankYouText.setAlpha(0);

		// Fix the text position on the screen, regardless of camera movement
		this.thankYouText.setScrollFactor(0, 0);

		this.time.delayedCall(3000, () => {
			this.tweens.add({
				targets: this.thankYouText,
				duration: 3000, // longer duration
				ease: 'Sine.easeInOut',
				yoyo: false,
				repeat: 0,
				alpha: 1,
				onComplete: () => { // Add onComplete callback
					this.time.delayedCall(3000, () => { // Delay for 3000ms before fading out
						this.tweens.add({
							targets: this.thankYouText,
							duration: 3000, // fade-out duration
							ease: 'Sine.easeInOut',
							yoyo: false,
							repeat: 0,
							alpha: 0
						});
					});
				}	
			});
			this.thankYouText.setVisible(true);
		})
	}

	checkCompleted() {
		this.scenesVisited = this.registry.get('scenesVisited');
		this.previousScene = this.registry.get('previousScene');
		this.scenesVisited.push(this.currentScene);
		console.log('checkCompleted this.scenesVisited: ' + this.scenesVisited);
		this.sceneRegistry = this.registry.get(this.scene.key);
	}

	update() {
		this.thankYouText.setScale(1 / this.cameras.main.zoom);
	}

	spawnLanterns() {
		for(let i = 0; i < 600; i++) {
			let lantern = this.lanterns.create(Phaser.Math.Between(200, 650), this.player.y + 5, 'lantern');
			lantern.body.allowGravity = false; // Disable gravity for this lantern
			lantern.setScale(0.5);
			lantern.setPipeline('Light2D').setAlpha(0.05);
	
			// Create the animation immediately, but with a delay
			let delay = Phaser.Math.Between(0, 300000); // random delay
	
			this.time.delayedCall(6000, () => {// Make the lantern move upwards slowly
				this.tweens.add({
					targets: lantern,
					duration: 500, // longer duration
					ease: 'Sine.easeInOut',
					yoyo: false,
					repeat: 0,
					alpha: 1,
					delay: delay // start after the random delay
				});

				// Make the lantern move upwards slowly
				this.tweens.add({
					targets: lantern,
					y: lantern.y - 2000, // move upwards a larger distance
					duration: 100000, // longer duration
					ease: 'Sine.easeInOut',
					yoyo: false,
					delay: delay, // start after the random delay
				});
		
				// Make the lantern move left and right in a swirl-like motion
				this.tweens.add({
					targets: lantern,
					x: { start: lantern.x, to: [lantern.x, lantern.x + 20] }, // move left then right
					duration: 5000, // 3 seconds
					ease: 'Sine.easeInOut',
					repeat: -1, // Repeat forever
					yoyo: true,
					delay: delay, // start after the random delay
				});
			});
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
		if(npc.name != 'Xavi' && npc.name != 'Miriam'){
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

		// Define actions for Xavi and Miriam
		}else{
			this.npcActionsXaviMiriam(player, npc);
		}
	}

	npcActionsXaviMiriamGameFinished(player, npc) {
		if(!this.message.messageDisplaying){
			this.message.showMessageList(this, this.finishDialog, function(scene){
				scene.common.startScene(scene, 'PreLevel', { textSize: 40, timeout: 5000, levelName: 'Epíleg', levelKey: 'Level0', text: 'I així, ens encaminem\ncap a les afores,\nmentre es fa de nit...' }, 4000, 5000);
			});
		}
	}

	npcActionsXaviMiriam(player, npc) {
		let dialog = [];
		if(npc.name == 'Xavi'){
			dialog = [
				npc.name + ': Ei, hola!'
			]
		}else if (npc.name == 'Miriam'){
			dialog = [
				npc.name + ': Holaaa!'
			]
		}
		this.message.showMessageList(this, dialog);
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
