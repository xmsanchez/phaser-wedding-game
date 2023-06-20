import Player from './Player.js';

export default class Common {
    constructor(scene) {
		this.score = scene.score
		this.hud = scene.hud
		this.openTreasure = this.openTreasure.bind(scene);
		this.messageBox = [];
		this.scene = scene;

		// Preload audios
		this.chest_opened_sound = scene.sound.add('audio_chest_opened', { loop: false, volume: 0.4 });
		this.coin_sound = scene.sound.add('audio_coin', { loop: false, forceRestart: true });
	}
	
	startScene(scene, sceneName, props, fadeOutTime = 250, delay = 500) {
		if(!this.sceneStarting){
			this.sceneStarting = true;
			console.log('startScene - Stop scene ' + scene.scene.key + ' and start ' + sceneName);
			scene.registry.set('previousScene', scene.scene.key);

			console.log('startScene - Fade out current scene and stop it');
			console.log('Previous scene is: ' + scene.registry.get('previousScene'));
			scene.cameras.main.fadeOut(fadeOutTime);
			this.stopMusic(scene);
			scene.time.addEvent({
				delay: delay,
				callback: () => {
					console.log('startScene - Delayed start of the new scene, start now!');
					this.stopScene(scene);
					scene.scene.start(sceneName, props);
				}
			});
		}
	}

	stopScene(scene) {
		scene.hud.destroy();
		scene.scene.stop('UIScene');
		scene.scene.stop();
	}

	stopMusic(scene) {
		try {
			scene.tweens.add({
				targets: scene.backgroundMusic,
				volume: 0,
				duration: 400, // Fade out duration: 1000ms (1s)
				onComplete: () => {
					try {
						scene.backgroundMusic.stop();
					} catch (error) {
						console.log('Error stopping music: ' + error);
					}
				}
			});
		} catch (error) {
			console.log('Error fading out music: ' + error);
		}
	}

	fadeInMusic(scene, volume, duration) {
		try {
			scene.tweens.add({
				targets: scene.backgroundMusic,
				volume: volume,
				duration: duration
			});
			scene.backgroundMusic.play();
		} catch (error) {
			console.log('Error fading in music: ' + error);
		}
	}
	
	addPlayer(scene) {
		// Player Layer
		const playerLayer = scene.map.getObjectLayer('player');
	
		// Extract player data
		let playerData = playerLayer.objects.find(object => object.name === 'player');
	
		// Player
		scene.player = new Player(scene, playerData.x, playerData.y, 'player').setScale(1).refreshBody();
		scene.player.setBounce(0.1);
		scene.player.setCollideWorldBounds(true);
		scene.player.createAnimations(scene);
		return scene.player;
	}

	addInput(scene) {
		scene.joystick = scene.registry.get('joystick');
		scene.interactBtn = scene.registry.get('interactBtn');
		scene.jumpBtn = scene.registry.get('jumpBtn');
		scene.UIScene = scene.registry.get('UI');

		console.log('Scene is: ' + scene.scene.key);
		console.log('Scene.UIScene is: ' + scene.UIScene);
		
		scene.UIScene.scene.setVisible(true);
		scene.UIScene.scene.bringToTop();
	}
	
	createLevelLayer(scene, layerName, tileset, scrollFactorX){
		try {
			var obj = scene.map.createLayer(layerName, tileset);
			if(scrollFactorX != null){
				obj.scrollFactorX = scrollFactorX;
			}
			// console.log('Created layer ' + layerName);
			return obj;
		} catch (error) {
			console.log('Error trying to create layer ' + layerName);
			return null;
		}
	}
	
	addCollider(scene, obj1, obj2) {
		// Ensure that the objects actually exist
		if (obj1 != null && obj2 != null) {
		  try {
			scene.physics.add.collider(obj1, obj2);
		  } catch (error) {
			console.log('Error while trying to add collider... error: ' + error);
		  }
		}
	  }
	  
	addColliders(scene) {
		// Add colliders for player and different objects
		const { player, ground, platforms, walls, bridge, rocks, rocks2, treasures, coins, bunny } = scene;
	  
		this.addCollider(scene, player, ground);
		this.addCollider(scene, player, platforms);
		this.addCollider(scene, player, walls);
		this.addCollider(scene, player, bridge);
		this.addCollider(scene, player, rocks);
		this.addCollider(scene, player, rocks2);
		this.addCollider(scene, treasures, ground);
		this.addCollider(scene, treasures, platforms);
		this.addCollider(scene, player, coins);
		this.addCollider(scene, coins, ground);
		this.addCollider(scene, bunny, ground);
		if (bunny !== undefined) {
		  this.addCollider(scene, bunny, platforms);
		}
	}
	  
	setCollisions(scene, from, to){
		console.log('Setting collisions!')
		console.log('from, to are: ' + from + ', ' + to);
		if(from === undefined || from === null){
			from = 6
		}
		if(to === undefined || from === null){
			to = 300
		}
		scene.map.setCollisionBetween(from, to, true, true);
		//Before you can use the collide function you need to set what tiles can collide
		scene.map.setCollisionBetween(from, to, true, true, 'ground_fg');
		scene.map.setCollisionBetween(from, to, true, true, 'platforms');
		scene.map.setCollisionBetween(from, to, true, true, 'walls');
		scene.map.setCollisionBetween(from, to, true, true, 'bridge');
		scene.map.setCollisionBetween(from, to, true, true, 'rocks');
		scene.map.setCollisionBetween(from, to, true, true, 'rocks2');
		scene.map.setCollisionByProperty('collects', true, 'solid');

		// Enable physics for the scene (e.g., using Arcade Physics)
		scene.physics.world.setBoundsCollision(true, true, true, true);
	}

	openTreasure(player, treasure, scene) {
		let frameOpened = 11;
		if(!treasure.opened){
			// First, check if this needs special treatment
			// Check if treasure contains the property "order"
			if(treasure.order !== undefined && !scene.boxGameFinished){
				console.log('Order property found. This is probably Level3: ' + treasure.order);
				console.log('Treasure IS NOT opened yet. Opening.');
				frameOpened = 15;
				treasure.opened = true;
				treasure.setFrame(frameOpened);
				console.log('Order: ' + treasure.order);

				scene.boxesPressed.push(treasure.order);
				
				switch(treasure.order){
					case 1:
						scene.piano_s5.play();
						break;
					case 2:
						scene.piano_s4.play();
						break;
					case 3:
						scene.piano_s3.play();
						break;
					case 4:
						scene.piano_s2.play();
						break;
					case 5:
						scene.piano_s3.play();
						break;
					case 6:
						scene.piano_s2.play();
						break;
					case 7:
						scene.piano_s1.play();
						break;
					case 8:
						scene.piano_s2.play();
						break;
					case 9:
						scene.piano_s3.play();
						break;
				}

				// const sceneRegistry = scene.registry.get(scene.scene.key);
				// scene.registry.set(scene.scene.key, {
				// 	...sceneRegistry,
				// 	treasuresOpened: [...sceneRegistry.treasuresOpened, treasure.name]
				// });

				// // Show a message
				// scene.message.showMessageList(scene, ['Has trobat **' + treasure.containsText + '!**']);
				
				// // Add a new object to the inventory
				// console.log('Add treasure contents to the inventory: ' + treasure.contents);
				// scene.hud.inventory.push(treasure.contents);
				// scene.hud.updateInventory(scene, treasure.contents);
			}else if (treasure.order === undefined){
				console.log('Order property NOT found.');
				console.log('Treasure IS NOT opened yet. Opening.');
				treasure.opened = true;
				treasure.setFrame(frameOpened);
				console.log(treasure)
				scene.common.chest_opened_sound.play();

				const sceneRegistry = scene.registry.get(scene.scene.key);
				scene.registry.set(scene.scene.key, {
					...sceneRegistry,
					treasuresOpened: [...sceneRegistry.treasuresOpened, treasure.name]
				});

				// Show a message
				scene.message.showMessageList(scene, ['Has trobat **' + treasure.containsText + '!**']);
				
				// Add a new object to the inventory
				console.log('Add treasure contents to the inventory: ' + treasure.contents);
				scene.hud.inventory.push(treasure.contents);
				scene.hud.updateInventory(scene, treasure.contents);
			}
		}
	}

	getTreasureContents(scene, treasure, newTreasure) {
		const contains = treasure.properties.find(obj => obj.name === "contains");
		console.log('Contains.value is: ' + contains.value);
		newTreasure.contents = contains.value;
		if (contains.value == 'key'){
			newTreasure.containsText = 'una clau';
		}else if (contains.value == 'map'){
			newTreasure.containsText = 'un mapa';
		}else{
			newTreasure.containsText = contains.value;
		}
		console.log('Contains.value is: ' + contains.value);
		console.log('Newtreasure.contents is: ' + newTreasure.contents);
		return newTreasure
	}

	spawnTreasures(scene, frame) {
		scene.treasures = scene.physics.add.staticGroup();
		scene.treasuresLayer = scene.map.getObjectLayer('treasures');
		var count = 0;
		scene.treasuresLayer.objects.forEach((treasure) => {
			count += 1;
			var newTreasure = scene.physics.add.sprite(treasure.x, treasure.y, 'treasure', frame).setOrigin(0, 1).setScale(1.5);
			newTreasure.id = count;
			newTreasure = this.getTreasureContents(scene, treasure, newTreasure);

			const order = treasure.properties.find(obj => obj.name === "order");
			if(order != undefined){
				newTreasure.order = order.value;
			}

			const container = this.drawHintContainer(scene, newTreasure);
			newTreasure.container = container;
			newTreasure.container.setVisible(false);

			scene.treasures.add(newTreasure);
			console.log('Newtreasure.contents is: ' + newTreasure.contents);
		});
	}

	npcLookDirection(scene, npc, distance, defaultFlip) {
		if(defaultFlip === undefined){
			defaultFlip = false;
		}
		if(scene.player.x > npc.x + npc.width / 2){
			npc.flipX = defaultFlip;
		}else{
			npc.flipX = !defaultFlip;
		}
		if(npc.name == 'Bug'){
			if(distance < 100){
				npc.setFrame(23);
			}else{
				npc.setFrame(29);
			}
		}
	}

	checkNpcActions(player, npc, scene) {
		console.log('Talking to an npc:' + JSON.stringify(npc));

		console.log('Check NPC actions');
		scene.npcActions(player, npc);
	}

	actionsBug(scene, npc) {
		let stick = scene.hud.searchInventory('pal');
		console.log('Stick is: ' + stick);
		let bark = scene.sound.add('audio_dog_bark', { loop: false, volume: 0.5 });
		bark.play();
		npc.setFrame(24);
		if(stick != null){
			scene.message.showMessageList(scene, ["Woof, Woof, Woof! (en Bug et babeja una mica mentre mira amb nostàlgia el pal que t'ha regalat)"]);
		}else{
			scene.message.showMessageList(scene, [
				"Woof, Woof! (en Bug et dona un pal... no sembla que t'hagi de servir per res, però ell està content)"
			], function(scene) {
				scene.hud.inventory.push(npc.contents);
				scene.hud.updateInventory(scene, npc.contents);
				npc.contents = [];
				scene.common.chest_opened_sound.play();
			});
		}
	}

	spawnBunny(scene) {
		scene.bunnies = scene.physics.add.staticGroup();
		try {
			const bunnyLayer = scene.map.getObjectLayer('bunny');		
			var newbunny = null;
			bunnyLayer.objects.forEach((bunny) => {
				const contains = bunny.properties.find(obj => obj.name === "contains");
				newbunny = scene.physics.add.sprite(bunny.x, bunny.y, 'npc_bunny', 0).setOrigin(0, 1)
				newbunny.name = bunny.name;
				console.log('Bunny ' + bunny.name + ' props:', bunny.properties);
	
				const container = this.drawHintContainer(scene, newbunny);
				newbunny.container = container;
				newbunny.container.setVisible(false);
				newbunny.contents = contains.value;
				newbunny.body.setAllowGravity(true);

				console.log('Add bunny to scene: ' + scene.bunnies);
		 		scene.bunnies.add(newbunny);
			});		
			
			try {
				scene.pathPoints = scene.map.getObjectLayer('objectPath').objects;
				scene.pathPointsInitial = scene.map.getObjectLayer('objectPath').objects;
				if (scene.game.config.physics.arcade.debug) {
					// Debug PathPoints
					let graphics = scene.add.graphics({ lineStyle: { width: 2, color: 0x0000ff } });
					scene.pathPoints.forEach((point) => {
						// Draw a rectangle centered at each point
						// Here 50, 50 is the width and height of the rectangle
						graphics.strokeRect(point.x - 25, point.y - 25, 50, 50);
					});
				}
			}catch{}
			newbunny = this.setBunnyAnimations(scene, newbunny);
			scene.physics.world.enable(newbunny);
			return newbunny;
		} catch (error) {
			console.log('No bunnies found. Error: ' + error);
		}
	}

	setBunnyAnimations(scene, newbunny) {
		console.log('Setting bunny animations!');
		scene.anims.create({
			key: 'bunny-left',
			frames: scene.anims.generateFrameNumbers('npc_bunny', { start: 13, end: 18 }),
			frameRate: 10,
			repeat: -1,
			duration: 100
		});

		scene.anims.create({
			key: 'bunny-right',
			frames: scene.anims.generateFrameNumbers('npc_bunny', { start: 13, end: 18 }),
			frameRate: 10,
			repeat: -1,
			duration: 100
		});

		scene.anims.create({
			key: 'bunny-idle',
			frames: scene.anims.generateFrameNumbers('npc_bunny', { start: 0, end: 0 }),
			frameRate: 10,
			repeat: -1,
			duration: 100
		});
		console.log('scene.anims: ' + scene.anims);

		newbunny.flipX = false;
		return newbunny;
	}
	
	bunnyMovement(scene) {
		if (scene.player.y > scene.cameras.main.height - 800) {
			console.log('Player has fallen below the bottom of the screen: ' + scene.player.y);
			// scene.player.x = 750;
			// scene.player.y = 100;
			// scene.bunny.x = 800;
			// scene.bunny.y = 100;
	
			// // Reset pathPoints to the original values
			// scene.pathPoints = [...scene.pathPointsInitial];
			scene.scene.restart();
		}

		// Bunny related code
		let bunnySpeed = 250;

		if (scene.bunnyCatched) {
			// Stop bunny movement
			scene.bunny.setVelocity(0, 0);
			scene.bunny.anims.play('bunny-idle', true);	
			scene.bunny.body.setAllowGravity(true);
			scene.bunny.body.gravity.y = 6000;
		}else{

			try {
				const playerDistance = Phaser.Math.Distance.Between(scene.player.x, scene.player.y, scene.bunny.x, scene.bunny.y);
				if (scene.bunnyReverseFlag === undefined) { // Initialize reverseFlag if it doesn't exist
					scene.bunnyReverseFlag = false;
				}

				if(playerDistance > 150 || scene.bunny.x > 1100){
					bunnySpeed = 170;
				}else{
					bunnySpeed = 250;
				}
	
				// Initially, the bunny is not reversing
				scene.bunnyIsReversing = false;

				if (playerDistance < 70 && !scene.bunnyReverseFlag) {
					scene.bunnyReverseFlag = true;
					console.log('Player distance <50: ' + playerDistance);
					// Only reverse the path if the bunny is not already doing so
					if (!scene.bunnyIsReversing) {
						scene.pathPoints.reverse();
						scene.bunnyIsReversing = true;
					}
				} else if (playerDistance > 70 && scene.bunnyReverseFlag) {
					scene.bunnyReverseFlag = false;
					console.log('Player distance >50: ' + playerDistance);
					// Only reverse the path if the bunny is currently reversing
					if (scene.bunnyIsReversing) {
						scene.pathPoints.reverse();
						scene.bunnyIsReversing = false;
					}
				}	
		
				const point = scene.pathPoints[0];
				// console.log('Point is: ' + JSON.stringify(point));
				const distance = Phaser.Math.Distance.Between(scene.bunny.x, scene.bunny.y, point.x, point.y);
				// console.log('Distance between bunny.x and point.x: ' + scene.bunny.x + ' and ' + point.x + ' is: ' + distance);
				if (distance < 15) {
					// Reached the current path point, move to the next one
					scene.pathPoints.push(scene.pathPoints.shift());
				}
		
				// Move the bunny towards the current path point
				scene.physics.velocityFromRotation(scene.bunny.rotation, bunnySpeed, scene.bunny.body.velocity);
				scene.physics.moveToObject(scene.bunny, scene.pathPoints[0], bunnySpeed);
				scene.bunny.container.x = scene.bunny.x;
				scene.bunny.container.y = scene.bunny.y - 20;
			} catch (error) {
				scene.bunny.body.reset(scene.bunny.x, scene.bunny.y);
			}
	
			// Set the appropriate animation based on the bunny's movement direction
			if (scene.bunny.body.velocity.x < 0) {
				scene.bunny.flipX = false;
				scene.bunny.anims.play('bunny-left', true);
			} else if (scene.bunny.body.velocity.x > 0) {
				scene.bunny.flipX = true;
				scene.bunny.anims.play('bunny-right', true);
			}
		}
	}
	
	checkBunnyActions(player, bunny, scene) {
		console.log('Interactuo amb el bunny!');
		console.log('Bunny props: ' + JSON.stringify(bunny.name));
		scene.messageListShowing = [
			bunny.name + ": Oh! M'has atrapat!!\nEl casament **és el dia 30 de Setembre** i hauries d'arribar cap **a les 16 hores.**",
			bunny.name + ': Aquí tens el **rellotge.**\nTIC-TAC. TIC-TAC. TIC-TAC.'
		]
		// Passem un callback per actualitzar l'inventari
		scene.message.showMessageList(scene, scene.messageListShowing, function() {
											if(bunny.contents != null){
												console.log('Bunny contents: ' + bunny.contents);
												scene.hud.inventory.push(bunny.contents);
												scene.hud.updateInventory(scene, bunny.contents);
												bunny.contents = null;
												scene.common.chest_opened_sound.play();
											}
										});
		scene.bunnyCatched = true;
	}

	spawnNpcs(scene, layer) {
		scene.npcs = scene.physics.add.staticGroup();
		scene.npcsLayer = scene.map.getObjectLayer(layer);
		var count = 0;
		scene.npcsLayer.objects.forEach((npc) => {
			count += 1;
			const contains = npc.properties.find(obj => obj.name === "contains");
			const default_frame = npc.properties.find(obj => obj.name === "default_frame");
			const spritesheet = npc.properties.find(obj => obj.name === "spritesheet");
			console.log('Spawn NPC name: ' + npc.name)
			console.log('NPC contents: ' + contains.value);
			var newnpc = scene.physics.add.sprite(npc.x, npc.y, spritesheet.value, default_frame.value).setOrigin(0, 1);
			newnpc.contents = contains.value;
			newnpc.default_frame = default_frame.value;
			newnpc.name = npc.name;
			newnpc.setImmovable(true);
			newnpc.body.setAllowGravity(false);
			newnpc.id = count;
		
			const container = this.drawHintContainer(scene, newnpc);
			newnpc.container = container;
			newnpc.container.setVisible(false);

			if(npc.name == 'Stan'){
				this.setNpcStanAnimations(scene, spritesheet.value, npc.name);
			}else if(npc.name == 'Fada'){
				this.setNpcFairyAnimations(scene, spritesheet.value, npc.name);
			}else if(npc.name == 'Xavi' || npc.name == 'Miriam'){
				this.setNpcAnimations(scene, spritesheet.value, npc.name);
			}else{
				// console.log('Set npc animations for ' + spritesheet.value + ' ' + npc.name);
				newnpc.y = newnpc.y + 3;
				this.setNpcDisneyAnimations(scene, spritesheet.value, npc.name);
			}
			
			scene.npcs.add(newnpc);
			// console.log('Spawn NPC: ' + JSON.stringify(newnpc));
		});
	}

	setNpcAnimations(scene, layer, name) {
		console.log('NPC animations for: ' + layer);
		scene.anims.create({
			key: name + '_left',
			frames: scene.anims.generateFrameNumbers(layer, { frames: [10, 8] }),
			frameRate: 10,
			repeat: 1,
			duration: 100
		});
	
		scene.anims.create({
			key: name + '_right',
			frames: scene.anims.generateFrameNumbers(layer, { frames: [7, 5] }),
			frameRate: 10,
			repeat: 1,
			duration: 100
		});
	}

	setNpcStanAnimations(scene, layer, name) {
		const totalFrames = scene.anims.generateFrameNumbers(layer).length;
	
		let randomFrames = [];
		for (let i = 0; i < 10; i++) {
			let randomIndex = Phaser.Math.Between(0, totalFrames - 1);
			randomFrames.push(randomIndex);
		}
	
		console.log('Animation name: ' + `${name}_stand`);
	
		scene.anims.create({
			key: `${name}_stand`,
			frames: randomFrames.map(index => ({ key: layer, frame: index })),
			frameRate: 10,
			repeat: -1
		});
	}

	setFireAnimations(scene, layer, key) {
		const totalFrames = scene.anims.generateFrameNumbers(layer).length;

		let randomFrames = [];
		for (let i = 0; i < 5; i++) {
			let randomIndex = Phaser.Math.Between(0, totalFrames - 1);
			randomFrames.push(randomIndex);
		}
	
		scene.anims.create({
			key: key,  // Use the unique key here
			frames: randomFrames.map(index => ({ key: layer, frame: index })),
			frameRate: 10,
			repeat: -1
		});
	}

	setNpcFairyAnimations(scene, layer, name) {
		const totalFrames = scene.anims.generateFrameNumbers(layer).length;
		
		scene.anims.create({
			key: `${name}_talking`,
			frames: scene.anims.generateFrameNumbers('npc_fairy', { start: 59, end: 67 }),
			frameRate: 4,
			repeat: -1,
			duration: 300
		});

		scene.anims.create({
			key: `${name}_stand`,
			frames: scene.anims.generateFrameNumbers('npc_fairy', { start: 35, end: 40 }),
			frameRate: 4,
			repeat: -1,
			duration: 300
		});
	}

	setNpcDisneyAnimations(scene, layer, name, start, end) {
		const totalFrames = scene.anims.generateFrameNumbers(layer).length;
		let frames_stand = {start: 0, end: 0};
		let frames_talking = {start: 0, end: 0};

		switch (name) {
			case 'Bèstia':
				frames_stand = {frames: [2, 11]};
				frames_talking = {frames: [0, 1, 2, 3, 8, 10]};
			break;
			case 'Aladdin':
				frames_stand = {start: 37, end: 38};
				frames_talking = {start: 37, end: 40};
			break;
			case 'Malèfica':
				frames_stand = {frames: [0, 3]};
				frames_talking = {start: 0, end: 5};
			break;
			case 'Gaston':
				frames_stand = {frames: [0, 2]};
				frames_talking = {start: 0, end: 5};
			break;
			case 'Geni':
				frames_stand = {frames: [1, 3]};
				frames_talking = {start: 1, end: 5};
			break;
			case 'Peter Pan':
				frames_stand = {frames: [38, 39]};
				frames_talking = {start: 38, end: 42};
			break;
			case 'Pluto':
				frames_stand = {frames: [9, 21]};
				frames_talking = {frames: [4, 8, 25, 34, 32, 33]};
			break;
			case 'Simba':
				frames_stand = {frames: [5, 7]};
				frames_talking = {start: 2, end: 9};
			break;
			case 'Hades':
				frames_stand = {frames: [97, 98]};
				frames_talking = {frames: [101, 103, 104, 107, 108, 110]};
			break;
		}
		
		scene.anims.create({
			key: `${name}_stand`,
			frames: scene.anims.generateFrameNumbers(layer, frames_stand),
			frameRate: 1,
			repeat: -1,
			duration: 1200
		});

		scene.anims.create({
			key: `${name}_talking`,
			frames: scene.anims.generateFrameNumbers(layer, frames_talking),
			frameRate: 4,
			repeat: -1,
			duration: 1200
		});
	}

	checkOverlapsStaticGroups(object, scene) {
		try {
			object.getChildren().forEach((obj) => {
				obj.container.setVisible(false);
			});
	
			scene.physics.world.overlap(scene.player, object.getChildren(), (player, obj) => {
				this.manageOverlaps(obj, scene);
			});
		} catch (error) {
			
		}
	}

	checkOverlapsObject(object, scene) {
		object.container.setVisible(false);
		this.manageOverlaps(object, scene);
	}

	manageOverlaps(obj, scene) {
		// When opening a treasure, we will disable the hint
		var name = '';
		if(obj.hasOwnProperty('objectType')){
			name = obj.objectType.name;
		}

		// console.log('Managing overlaps for object: ' + name);
		// If the object is a treasure then we will enable the hint only when not opened
		if(!obj.opened && name != 'door'){
			obj.container.setVisible(true);

		// Door should be always interactable
		}else if(name == 'door'){
			obj.container.setVisible(true);
		}else if(name == 'bunny'){
			// console.log('Overlapping with bunny!!');
			obj.container.setVisible(true);
		}
	}

	spawnCoins(scene) {
		scene.coins = scene.physics.add.staticGroup();
		try {
			scene.coinsLayer = scene.map.getObjectLayer('coins');
			var count = 0;
			scene.coinsLayer.objects.forEach((coin) => {
				count += 1;
				const newcoin = scene.physics.add.sprite(coin.x, coin.y, 'objects', 10).setOrigin(0, 1)
				newcoin.setImmovable(true)
				newcoin.body.setAllowGravity(false);
				newcoin.id = count;
				scene.coins.add(newcoin);
			});		
		} catch (error) {
			console.log('No coins found');
		}
	}
		
	spawnCartells(scene) {
		scene.cartells = scene.physics.add.staticGroup();
		try {
			scene.cartellsLayer = scene.map.getObjectLayer('cartells');
			var count = 0;
			scene.cartellsLayer.objects.forEach((cartell) => {
				count += 1;
				const newcartell = scene.physics.add.sprite(cartell.x, cartell.y, 'objects', 28).setOrigin(0, 1)
				newcartell.setImmovable(true)
				newcartell.body.setAllowGravity(false);
				newcartell.id = count;
		
				// Custom data must be accessed from here and assigned to the new object...
				newcartell.name = cartell.name;
				console.log('cartell ' + cartell.name + ' props:', cartell.properties);
				
				newcartell.textCartell = cartell.properties.find(obj => obj.name === "text").value;
				
				const container = this.drawHintContainer(scene, newcartell);
				newcartell.container = container;
				newcartell.container.setVisible(false);
		
				scene.cartells.add(newcartell);
			});	
		} catch (error) {
			console.log('No cartells found');
		}
	}

	readCartell(player, cartell, scene) {
		console.log('Cartell: ' + JSON.stringify(cartell.textCartell));
		console.log('Scene.message.messageDisplaying is: ' + JSON.stringify(scene.message.messageDisplaying));
		console.log('scene.message.messageDisplaying is: ' + JSON.stringify(scene.message.messageDisplaying));
		scene.message.showMessageList(scene, [cartell.textCartell]);
	}

	spawnFire(scene) {
		scene.fire = scene.physics.add.staticGroup();
		try {
			scene.fireLayer = scene.map.getObjectLayer('fire');
			var count = 0;
			scene.fireLayer.objects.forEach((fire) => {
				count += 1;
				const newfire = scene.physics.add.sprite(fire.x, fire.y, 'fire', 0).setOrigin(0, 1).setScale(5);
				newfire.setImmovable(true)
				newfire.body.setAllowGravity(false);
				newfire.id = count;
				scene.fire.add(newfire);

				// Use a unique key for each animation
				const animKey = `fire${count}`;
				this.setFireAnimations(scene, 'fire', animKey);

				// Start the animation right away
				newfire.anims.play(animKey, true);
			});
			// this.setFireAnimations(scene, spritesheet.value);
		} catch (error) {
			console.log('No fire found');
		}
		return scene.fire;
	}

	spawnDoors(scene) {
		scene.doors = scene.physics.add.staticGroup();
		try {
		  scene.doorsLayer = scene.map.getObjectLayer('doors');
		  var count = 0;
		  scene.doorsLayer.objects.forEach((door) => {
			console.log('Door object is: ' + JSON.stringify(door));
			count += 1;
			const doorRect = scene.add.rectangle(door.x, door.y + door.height, door.width, door.height);
			console.log('DoorRect is: ' + JSON.stringify(doorRect));
			doorRect.setOrigin(0, 1);
			doorRect.id = count;
	  
			// Custom data must be accessed from here and assigned to the new object...
			doorRect.name = door.name;
			console.log('Door ' + door.name + ' props:', door.properties);
	  
			doorRect.isEntry = door.properties.find(obj => obj.name === "isEntry").value;
			doorRect.isExit = door.properties.find(obj => obj.name === "isExit").value;
			doorRect.opened = door.properties.find(obj => obj.name === "opened").value;
			doorRect.objectType = door.properties.find(obj => obj.name === "door");
	  
			const container = this.drawHintContainer(scene, doorRect);
			doorRect.container = container;
			doorRect.container.setVisible(false);
	  
			scene.doors.add(doorRect);
		  });
		} catch (error) {
		  console.log('No doors found. Error: ' + error);
		}
	}
		
	// spawnBoxes(scene) {
	// 	scene.boxes = scene.physics.add.staticGroup();
	// 	try {
	// 		scene.boxesLayer = scene.map.getObjectLayer('boxes');
	// 		var count = 0;
	// 		scene.boxesLayer.objects.forEach((box) => {
	// 			count += 1;
	// 			const newbox = scene.physics.add.sprite(box.x, box.y, 'objects', 15).setOrigin(0, 1)
	// 			newbox.setImmovable(true)
	// 			newbox.body.setAllowGravity(false);
	// 			newbox.id = count;
		
	// 			// Custom data must be accessed from here and assigned to the new object...
	// 			newbox.name = box.name;
	// 			console.log('box ' + box.name + ' props:', box.properties);
				
	// 			newBox.order = box.properties.find(obj => obj.name === "order").value;
	// 			newBox.contents = box.properties.find(obj => obj.name === "contains");
	  
	// 			const container = this.drawHintContainer(scene, newbox);
	// 			newbox.container = container;
	// 			newbox.container.setVisible(false);
		
	// 			scene.boxes.add(newbox);
	// 		});	
	// 	} catch (error) {
	// 		console.log('No boxes found');
	// 	}
	// }
	
	drawHintContainer(scene, obj) {
		// Create a container for the circle and text
		const container = scene.add.container(obj.x + (obj.width / 2) - 8, obj.y - obj.height - 9);
	  
		// Add the small circle as a child sprite of the container
		const outerCircle = scene.add.circle(0, 0, 9, 0xFFFFFF);
		const circle = scene.add.circle(0, 0, 8, 0xFF0000);
		container.add(outerCircle);
		container.add(circle);
	
		// Add the text as a child sprite of the container
		const text = scene.add.text(-4, -7, 'B', { fontSize: '14px', fill: '#ffffff' });
		container.add(text);

		return container;
	}

	translatePlayerPosition(player, door, targetDoor, scene) {
		// Find the door2_2 object
		const target = scene.doors.getChildren().find(child => child.name === targetDoor);

		if (target) {
			// Move the player to the location of door2_2
			player.x = target.x + target.width / 2;
			player.y = target.y - target.height;
		} else {
			console.error("Door '" + target + "' not found in this.doors");
		}
	}

	// The player has no keys. They can't open the door.
	doorNoKeyMessage(player, door, scene, key) {
		console.log('Key is: ' + key);
		console.log('Message is displaying? ' + scene.message.messageDisplaying);
		console.log('Show message!');
		scene.message.showMessageList(scene, ['La porta està **tancada**. Necessites una **clau** per obrir-la!.']);
		
	}

	// The player has a key. They can open the door.
	doorOpenWithKey(player, door, scene) {
		door.opened = true; 

		// Remove the used from the inventory
		scene.hud.inventory.pop('key');
		scene.hud.updateInventory(scene);
		
		// scene.message.showMessageList(scene, ['Utilitzes la clau!\nObres la porta...']);
	}

	// Check if the door can be opened or is already opened.
	checkIfCanOpenDoor(player, door, scene) {
		var inventory = scene.hud.inventory;
		var key = null;
		let sceneKey = scene.scene.key;

		console.log('Inventory contents: ' + JSON.stringify(inventory));
		console.log(JSON.stringify(inventory))
		key = scene.hud.searchInventory('key');
		console.log('Key is: ' + key);

		// The player has no key and the door is currently closed
		if (key == null && !door.opened) {
			console.log('The player has no key and the door is currently closed. Message displaying: ' + scene.message.messageDisplaying);
			this.doorNoKeyMessage(player, door, scene, key);

		// The player has the key o the door was already opened!
		}else{
			console.log('The player has the key OR the door is opened');
			if(!door.opened && !scene.message.messageDisplaying){
				this.doorOpenWithKey(player, door, scene);
			}
			console.log('The player has a key or the door was already opened. Door name: ' + door.name);

			// Doors Level0
			if (door.name == 'door0_1'){
				// Start a new scene
				const sceneRegistry = scene.registry.get(scene.scene.key);
				scene.registry.set(scene.scene.key, {
					...sceneRegistry,
					doorsOpened: [...sceneRegistry.doorsOpened, door.name]
				});
				let newScene = 'Level1Prev';
				if(sceneKey == 'Level2Prev' ){
					newScene = 'Level2Prev2';
				}
				this.startScene(scene, 'PreLevel', { levelKey: newScene });

			// If we are outside, allow the player to come back in
			}else if(door.name == 'door-outside') {
				if(sceneKey == 'Level1Prev'){
					this.startScene(scene, 'PreLevel', { levelKey: 'Level0' });
				}else if(sceneKey == 'Level3Prev2'){
					this.startScene(scene, 'PreLevel', { levelKey: 'Level3Prev' });
		 		}
			
			}else if(door.name == 'door_castle'){
				this.startScene(scene, 'PreLevel', { levelKey: 'Level4' });

			// Doors Level2
			}else if (door.name == 'door1_2') {
				// Move the player to the location of door number2
				this.translatePlayerPosition(player, door.name, 'door2_2', scene);
			}else if (door.name == 'door2_2') {
				// Move the player to the location of door number3
				this.translatePlayerPosition(player, door.name, 'door1_2', scene);
			}else if (door.name == 'door3_2') {
				scene.message.showMessageList(scene, ['Encara no pots entrar! (estem fent obres :-))']);
			}
		}
		console.log('Door is opened: ' + door.opened);
	}

	loadMusic(scene, tilesetName) {
		console.log('loadMusic - Tileset name is: ' + tilesetName);
		switch (tilesetName) {
			case 'livingroom':
				scene.backgroundMusic = scene.sound.add('background_music_house', { loop: true, volume: 0.2});
				break;
			case 'house-outside':
				scene.backgroundMusic = scene.sound.add('background_music_bunny1', { loop: true, volume: 0.2});
				break;
			case 'tileset_jungle':
				scene.backgroundMusic = scene.sound.add('background_music_woods2', { loop: true, volume: 0.2});
				break;
			case 'swamp':
				scene.backgroundMusic = scene.sound.add('background_music_bunny2', { loop: true, volume: 0.2});
				break;
			case 'castle_inside':
				// scene.backgroundMusic = scene.sound.add('background_music_tangled', { loop: true, volume: 0.1});
				break;
			case 'castle_inside':
				// scene.backgroundMusic = scene.sound.add('background_music_tangled', { loop: true, volume: 0.1});
				break;
			case 'tileset_night':
				scene.backgroundMusic = scene.sound.add('background_music_tangled_real', { loop: false, volume: 0.4});
		}
		try {
			// Play the audio file
			scene.backgroundMusic.play();
		} catch (error) {
			console.log('Error: There is not music for tileset ' + tilesetName);
		}
	}
}