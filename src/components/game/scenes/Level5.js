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
		this.textList = [];
	}

	preload()
    { }

	create()
	{
		let rawParams = this.registry.get('rawParams');
		console.log('Raw params: ' + rawParams);

		// Create all resources
		this.sceneRegistry = this.registry.get(this.scene.key);
		this.common = new Common(this);
		this.camera = new Camera();
		this.common.addInput(this);
		this.message = this.registry.get('Message');
		this.hud = this.registry.get('HUD');
		// In this scene we will hide the inventory
		this.hud.container.setVisible(false);
		let joystick = this.registry.get('joystick');
        let interactBtn = this.registry.get('interactBtn');
        let jumpBtn = this.registry.get('jumpBtn');
        let UI = this.registry.get('UI');
		UI.toggleUIVisibility(false);

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
		this.common.createLevelLayer(this, 'top_bg1', tileset_sky, 0.4);
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
				duration: 17000, // how long the tween should take in milliseconds
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
				duration: 13000, // how long the tween should take in milliseconds
				ease: 'Sine.easeInOut' // easing function to make the movement smooth
			});
		});

		// After n seconds, begin to move the camera up again
		this.time.delayedCall(27000, () => {
			console.log('Move the camera at y axis');
			this.tweens.add({
				targets: camera,
				zoom: 1.8,
				scrollY: -600, // target position
				duration: 24000, // how long the tween should take in milliseconds
				ease: 'Sine.easeInOut' // easing function to make the movement smooth
			});
		});

		// Fade-in black and go to the MainMenu when finished and redirect to the landing
		this.time.delayedCall(216000, () => {
			this.cameras.main.fadeOut(4000);
			this.time.delayedCall(5000, () => {
				window.location = '/landing?parameters=' + rawParams;
			})
		});

		this.lanterns = this.physics.add.group();

		this.spawnLanterns();

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
		
		this.finalSceneTexts();
	}

	finalSceneTexts(){
		// manageText(text, startTime, endDelay, duration, fadeDuration, textSize = '32px', showStyle = 'center')
		this.manageText('Gràcies per acompanyar-nos\nen aquest viatge', 
							2000, 2000, 1500);
		this.manageText('Ha estat un plaer treballar\nen aquest projecte', 
							7000, 2000, 1500);
		this.manageText('Us esperem a tots al casament\n- Dia 30 de Setembre\n- A La Vinyassa\n- Recepció a les 16:30\n- Dress code: Formal. El color blanc\n  està reservat per la núvia!!\n- Allotjament: Booking :-)', 
							14000, 2000, 20000, '27px', 'resum')
		this.manageText('Direcció:\n- Xavier Miranda Sánchez',
							30000, 7000, 1500, '40px', 'left');
		this.manageText('Disseny de nivells:\n- Xavier Miranda Sánchez\n- Miriam Garcia Sala',
							45000, 7000, 1500, '40px', 'left');
		this.manageText('Amb la colaboració de:\n- Arnau Morató Codorniu',
							60000, 7000, 1500, '40px', 'left');
		this.manageText('Programació:\n- Xavier Miranda Sánchez',
							75000, 7000, 1500, '40px', 'left');
		this.manageText('Assistent de programació:\n- GPT-4',
							90000, 7000, 1500, '40px', 'left');
		this.manageText('Becari:\n- GPT-3.5',
							105000, 7000, 1500, '40px', 'left');
		this.manageText('Pixel Art:\n- Xavier Miranda Sánchez\n- Miriam Garcia Sala\n- www.spriters-resource.com\n- Adobe Stock\n- Google Images',
							120000, 7000, 1500, '40px', 'left');
		this.manageText('Àudio:\n- Creative Commons\n- Algun que altre rip...\n  (no ho comenteu a la SGAE ;-D)',
							135000, 7000, 1500, '40px', 'left');
		this.manageText('Beta testers:\n- Xavier Miranda Sánchez\n- Miriam Garcia Sala\n- Arnau Morató Codorniu',
							150000, 7000, 1500, '40px', 'left');
		this.manageText('Agraïments:\n- A tots els que ens\nacompanyareu en un dia\nmolt especial :-)',
		 					165000, 7000, 1500, '40px', 'left');
		this.manageText('Gràcies', 180000, 12000, 1500, '80px');
	}

	manageText(text, startTime, endTime, duration, textSize = '32px', showStyle = 'center') {
		let finalText;
		if(showStyle == 'resum'){
			finalText = this.add.text(this.cameras.main.width / 2, (this.cameras.main.height / 2) - 120, 
				text, {
				fontSize: textSize,
				fill: '#FFFFFF',
				align: 'left'
			})
		}else{
			finalText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 
				text, {
				fontSize: textSize,
				fill: '#FFFFFF',
				align: showStyle
			})
		}
		

		// Show it at the screen center
		if(showStyle == 'center'){
			finalText.setOrigin(0.5, 0.5); // Set origin to the center of text
		}else if(showStyle == 'left'){
			finalText.setOrigin(0.5, 0.1);
			finalText.y = 320;
		}else if(showStyle == 'right'){
			finalText.setOrigin(0.3, 0.9);
			finalText.y = this.cameras.main.height;
		}else if(showStyle == 'resum'){		
			finalText.setOrigin(0.5, 0.1);	
		}

		// Make the text invisible initially
		finalText.setVisible(false);
		finalText.setAlpha(0);

		// Fix the text position on the screen, regardless of camera movement
		finalText.setScrollFactor(0, 0);

		this.time.delayedCall(startTime, () => {
			this.tweens.add({
				targets: finalText,
				duration: endTime, // longer duration
				ease: 'Sine.easeInOut',
				yoyo: false,
				repeat: 0,
				alpha: 1,
				onComplete: () => { // Add onComplete callback
					this.time.delayedCall(duration, () => { // Delay for 3000ms before fading out
						this.tweens.add({
							targets: finalText,
							duration: endTime, // fade-out duration
							ease: 'Sine.easeInOut',
							yoyo: false,
							repeat: 0,
							alpha: 0
						});
					});
				}	
			});
			finalText.setVisible(true);
		})
		this.textList.push(finalText);
	}

	update() {
		for(let i = 0; i < this.textList.length; i++){
			this.textList[i].setScale(1 / this.cameras.main.zoom);	
		}
	}

	spawnLanterns() {
		for(let i = 0; i < 400; i++) {
			let lantern = this.lanterns.create(Phaser.Math.Between(200, 650), this.player.y + 5, 'lantern');
			lantern.body.allowGravity = false; // Disable gravity for this lantern
			lantern.setScale(0.5);
			lantern.setPipeline('Light2D').setAlpha(0.05);
	
			// Create the animation immediately, but with a delay
			let delay = Phaser.Math.Between(0, 150000); // random delay
	
			this.time.delayedCall(5000, () => {// Make the lantern move upwards slowly
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
					duration: 105000, // longer duration
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

				// Make the lantern move slowly to the right, like if there was wind
				this.tweens.add({
					targets: lantern,
					x: lantern.x + Phaser.Math.Between(100, 500),
					duration: 50000, // 3 seconds
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
}
