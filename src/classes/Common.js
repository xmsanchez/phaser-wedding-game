import Player from './Player.js';
import Joystick from './Joystick.js';

export default class Common {
    constructor(scene) {
		this.score = scene.score
		this.hud = scene.hud
		this.openTreasure = this.openTreasure.bind(scene);
		this.messageBox = [];
		this.scene = scene;

		// Preload audios
		this.chest_opened_sound = scene.sound.add('audio_chest_opened', { loop: false });
		this.coin_sound = scene.sound.add('audio_coin', { loop: false, forceRestart: true });
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
		// Create input
		const canvasWidth = scene.cameras.main.width;
		const canvasHeight = scene.cameras.main.height;
		console.log('Canvas height: ' + canvasHeight);
		console.log('Canvas width: ' + canvasWidth);
		scene.input.addPointer(1);
		scene.joystick = new Joystick(scene, 300, (canvasHeight / 2) * 1.3);
		scene.jumpBtn = scene.joystick.createJumpButton(scene, canvasWidth - 300, (canvasHeight / 2) * 1.3);
		scene.interactBtn = scene.joystick.createInteractButton(scene, canvasWidth - 380, (canvasHeight / 2) * 1.34);

		return scene.joystick;
	}
	
	addColliders(scene) {
		// Add colliders
		scene.physics.add.collider(scene.player, scene.ground);
		scene.physics.add.collider(scene.player, scene.platforms);
		scene.physics.add.collider(scene.player, scene.walls);
		scene.physics.add.collider(scene.player, scene.bridge);
		scene.physics.add.collider(scene.player, scene.rocks);
		scene.physics.add.collider(scene.treasures, scene.ground);
		scene.physics.add.collider(scene.treasures, scene.platforms);
		scene.physics.add.collider(scene.player, scene.coins);
		scene.physics.add.collider(scene.coins, scene.ground);
	}

	setCollisions(scene){
		//Before you can use the collide function you need to set what tiles can collide
		scene.map.setCollisionBetween(6, 270, true, true, 'ground_fg');
		scene.map.setCollisionBetween(6, 270, true, true, 'platforms');
		scene.map.setCollisionBetween(6, 270, true, true, 'walls');
		scene.map.setCollisionBetween(6, 270, true, true, 'bridge');
		scene.map.setCollisionBetween(6, 270, true, true, 'rocks');
		scene.map.setCollisionByProperty('collects', true, 'solid');

		// Enable physics for the scene (e.g., using Arcade Physics)
		scene.physics.world.setBoundsCollision(true, true, true, true);
	}

	openTreasure(player, treasure, scene) {
		console.log('Check if treasure is opened: ' + treasure.opened);
		if(!treasure.opened){
			treasure.opened = true;
			treasure.setFrame(11);
			console.log(treasure)
			scene.common.chest_opened_sound.play();

			// Show a message
			scene.message.showMessage(this, 'Has trobat ' + treasure.containsText + '!');
			
			// Add a new object to the inventory
			console.log('Add treasure contents to the inventory: ' + treasure.contents);
			scene.hud.inventory.push(treasure.contents);
			scene.hud.updateInventory(scene, treasure.contents);
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

	spawnTreasures(scene) {
		scene.treasures = scene.physics.add.staticGroup();
		scene.treasuresLayer = scene.map.getObjectLayer('treasures');
		var count = 0;
		scene.treasuresLayer.objects.forEach((treasure) => {
			count += 1;
			var newTreasure = scene.physics.add.sprite(treasure.x, treasure.y, 'treasure', 8).setOrigin(0, 1);
			newTreasure.id = count;
			newTreasure = this.getTreasureContents(scene, treasure, newTreasure);

			const container = this.drawHintContainer(scene, newTreasure);
			newTreasure.container = container;
			newTreasure.container.setVisible(false);

			scene.treasures.add(newTreasure);
			console.log('Newtreasure.contents is: ' + newTreasure.contents);
		});
	}

	npcActionsLevel1(player, npc, scene) {
		if(scene.hud.inventory.length == 0){
			if(npc.name == 'Xavi'){
				scene.message.showMessage(scene, npc.name + ": Encara no has trobat el mapa? Ha de ser dins d'un bagul");
			}else if(npc.name == 'Miriam'){
				scene.message.showMessage(scene, npc.name + ': El mapa és en algun lloc sobre una plataforma, però no recordo ben bé on era...');
			}
		}else{
			// Look for the map in the inventory
			console.log('Objects in inventory: ' + scene.hud.inventory);
			for (var i = 0; i < scene.hud.inventory.length; i++) {
				console.log('Object in inventory: ' + scene.hud.inventory[i]);
				if(scene.hud.inventory[i] === 'map'){
					if(npc.name == 'Xavi'){
						scene.message.showMessage(scene, npc.name + ': Ja tens el mapa? Dona-li a la Miriam!')
					}else if(npc.name == 'Miriam'){
						if(npc.contents == ''){
							console.log(npc.name + ': Ja tens la clau, corre cap a la porta!');
						}else{
							scene.message.showMessage(scene, npc.name + ': Has trobat el mapa!\n\nEl casament serà a "LA VINYASSA". És a prop de Arbúcies!\n\nAquí tens la clau per obrir la porta, al proper nivell esbrinaràs la data del casament!');
							scene.common.chest_opened_sound.play();
							scene.hud.updateInventory(scene, npc.contents);
							scene.hud.inventory.push(npc.contents);
							npc.contents = '';
							return;
						}
					}
				}else if (scene.hud.inventory[i] === 'key'){
					if(npc.name == 'Xavi'){
						scene.message.showMessage(scene, npc.name + ": La Miriam t'ha donat la clau? Doncs corre cap a la porta!");
					}else if (npc.name == 'Miriam'){
						scene.message.showMessage(scene, npc.name + ': Ja tens la clau! Ja pots obrir la porta, corre cap allà!');
					}
				}
			}
		}
	}

	checkNpcActions(player, npc, scene) {
		console.log('Talking to an npc:' + JSON.stringify(npc));

		if(scene.currentScene === 'Level1'){
			this.npcActionsLevel1(player, npc, scene);
		}
	}

	spawnNpcs(scene, layer, frame) {
		scene.npcs = scene.physics.add.staticGroup();
		scene.npcsLayer = scene.map.getObjectLayer(layer);
		var count = 0;
		scene.npcsLayer.objects.forEach((npc) => {
		  count += 1;
		  const contains = npc.properties.find(obj => obj.name === "contains");
		  const default_frame = npc.properties.find(obj => obj.name === "default_frame");
		  const spritesheet = npc.properties.find(obj => obj.name === "spritesheet");
		  console.log('Contains.value is: ' + contains.value);
		  console.log('default_frame.value is: ' + default_frame.value);
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
	  	  
		  scene.npcs.add(newnpc);
		  console.log('Spawn NPC: ' + JSON.stringify(newnpc));
		});
	}

	checkOverlaps(object, scene) {
		object.getChildren().forEach((obj) => {
			obj.container.setVisible(false);
		});

		scene.physics.world.overlap(scene.player, object.getChildren(), (player, obj) => {
			// When opening a treasure, we will disable the hint
			var name = '';
			if(obj.hasOwnProperty('objectType')){
				name = obj.objectType.name;
			}
			// If the object is a treasure then we will enable the hint only when not opened
			if(!obj.opened && name != 'door'){
				obj.container.setVisible(true);

			// Door should be always interactable
			}else if(name == 'door'){
				obj.container.setVisible(true);
			}
		});
	}

	spawnCoins(scene) {
		scene.coins = scene.physics.add.staticGroup();
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
	}
		
	spawnCartells(scene) {
		scene.cartells = scene.physics.add.staticGroup();
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
			// newcartell.isEntry = cartell.properties.find(obj => obj.name === "isEntry").value;
			// newcartell.isExit = cartell.properties.find(obj => obj.name === "isExit").value;
			// newcartell.opened = cartell.properties.find(obj => obj.name === "opened").value;
			// newcartell.objectType = cartell.properties.find(obj => obj.name === "cartell"); 
	
			const container = this.drawHintContainer(scene, newcartell);
			newcartell.container = container;
			newcartell.container.setVisible(false);
	
			scene.cartells.add(newcartell);
		});	
	}

	readCartell(player, cartell, scene) {
		console.log('Llegeixo el cartell!');
		console.log('Cartell: ' + JSON.stringify(cartell.textCartell));
		scene.message.showMessage(this, cartell.textCartell);
	}

	spawnDoors(scene) {
		scene.doors = scene.physics.add.staticGroup();
		scene.doorsLayer = scene.map.getObjectLayer('doors');
		var count = 0;
		scene.doorsLayer.objects.forEach((door) => {
			count += 1;
			const newdoor = scene.physics.add.sprite(door.x, door.y, 'objects', 19).setOrigin(0, 1)
			newdoor.setImmovable(true)
			newdoor.body.setAllowGravity(false);
			newdoor.id = count;

			// Custom data must be accessed from here and assigned to the new object...
			newdoor.name = door.name;
			console.log('Door ' + door.name + ' props:', door.properties);

			newdoor.isEntry = door.properties.find(obj => obj.name === "isEntry").value;
			newdoor.isExit = door.properties.find(obj => obj.name === "isExit").value;
			newdoor.opened = door.properties.find(obj => obj.name === "opened").value;
			newdoor.objectType = door.properties.find(obj => obj.name === "door"); 

			const container = this.drawHintContainer(scene, newdoor);
			newdoor.container = container;
			newdoor.container.setVisible(false);

			scene.doors.add(newdoor);
		});	
	}
	
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
			player.y = target.y;
		} else {
			console.error("Door '" + target + "' not found in this.doors");
		}
	}

	// The player has no keys. They can't open the door.
	doorNoKeyMessage(player, door, scene, key) {
		console.log('Key is: ' + key);
		console.log('Message is displaying? ' + scene.messageDisplaying);
		if(scene.messageDisplaying){
			scene.messageDisplaying = false;
			scene.message.destroyMessageBox();
		}else{
			scene.message.showMessage(this, 'La porta està tancada.\nNecessites una clau!.');
		}
	}

	// The player has a key. They can open the door.
	doorOpenWithKey(player, door, scene) {
		door.opened = true; 

		// Remove the used from the inventory
		scene.hud.inventory.pop('key');
		scene.hud.updateInventory(scene);
		
		scene.message.showMessage(this, 'Utilitzes la clau!\nObres la porta...');
	}

	// Check if the door can be opened or is already opened.
	checkIfCanOpenDoor(player, door, scene) {
		var inventory = scene.hud.inventory;
		var key = null;
		
		console.log('Inventory contents: ' + JSON.stringify(inventory));
		console.log(JSON.stringify(inventory))
		for (var i = 0; i < inventory.length; i++) {
			if (inventory[i] == 'key') {
				console.log('The user has a key!');
				key = i;
			}
		}

		// The player has no key and the door is currently closed
		if (key == null && !door.opened) {
			console.log('The player has no key and the door is currently closed. Message displaying: ' + scene.messageDisplaying);
			this.doorNoKeyMessage(player, door, scene, key);

		// The player has the key o the door was already opened!
		}else{
			console.log('The player has the key OR the door is opened');
			if(!door.opened && !scene.messageDisplaying){
				this.doorOpenWithKey(player, door, scene);
			}
			console.log('The player has a key or the door was already opened. Door name: ' + door.name);

			// Doors Level1
			if (door.name == 'door1_1'){
				// Start a new scene
				console.log('door1_1 interacted. Start a new scene');
				this.scene.startScene = true;

			// Doors Level2
			}else if (door.name == 'door1_2') {
				// Move the player to the location of door number2
				this.translatePlayerPosition(player, door.name, 'door2_2', scene);
			}else if (door.name == 'door2_2') {
				// Move the player to the location of door number3
				this.translatePlayerPosition(player, door.name, 'door1_2', scene);
			}else if (door.name == 'door3_2') {
				scene.message.showMessage(this, 'Encara no pots entrar! (estem fent obres :-))');
			}
		}
		console.log(JSON.stringify(door))
		console.log('Door is opened: ' + door.opened);
	}
}