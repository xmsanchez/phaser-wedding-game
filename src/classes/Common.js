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

	openTreasure(player, treasure, scene) {
		console.log('Check if treasure is opened: ' + treasure.opened);
		if(!treasure.opened){
			treasure.opened = true;
			treasure.setFrame(11);
			console.log(treasure)
			scene.common.chest_opened_sound.play();

			// Show a message
			scene.common.showMessage(this, 'Has trobat ' + treasure.containsText + '!');
			
			// Add a new object to the inventory
			console.log('Add treasure contents to the inventory: ' + treasure.contents);
			scene.hud.inventory.push(treasure.contents);
			scene.hud.updateInventory(scene, treasure.contents);
		}
	}

	checkNpcActions(player, npc, scene) {
		console.log('Perform actions with NPCs here');
	}

	spawnNpcs(scene, layer, frame) {
		scene.npcs = scene.physics.add.staticGroup();
		scene.npcsLayer = scene.map.getObjectLayer(layer);
		var count = 0;
		scene.npcsLayer.objects.forEach((npc) => {
			count += 1;
			const newnpc = scene.physics.add.sprite(npc.x, npc.y, layer, frame).setOrigin(0, 1)
			newnpc.setImmovable(true)
			newnpc.body.setAllowGravity(false);
			newnpc.id = count;
			scene.npcs.add(newnpc);
		});	
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
			scene.treasures.add(newTreasure);
			console.log('Newtreasure.contents is: ' + newTreasure.contents);
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

			scene.doors.add(newdoor);
		});	
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
			this.destroyMessageBox();
		}else{
			scene.common.showMessage(this, 'La porta està tancada.\nNecessites una clau!.');
		}
	}

	// The player has a key. They can open the door.
	doorOpenWithKey(player, door, scene) {
		door.opened = true; 

		// Remove the used from the inventory
		scene.hud.inventory.pop('key');
		scene.hud.updateInventory(scene);
		
		scene.common.showMessage(this, 'Utilitzes la clau!\nObres la porta...');
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
			}else{
				scene.messageDisplaying = false;
				this.destroyMessageBox();
			}
			console.log('The player has a key or the door was already opened');

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
			}
		}
		console.log(JSON.stringify(door))
		console.log('Door is opened: ' + door.opened);
	}

	showMessage(scene, message) {
		const padding = 20;
		const boxWidth = this.scene.cameras.main.width / 2.3 - padding * 2;
		const centerX = this.scene.cameras.main.centerX;
		const centerY = this.scene.cameras.main.centerY;
		const boxX = centerX - boxWidth / 2;
	  
		const textConfig = {
		  fontSize: '24px',
		  fill: '#ffffff',
		  wordWrap: { width: boxWidth - padding * 2, useAdvancedWrap: true },
		};
	  
		const graphics = this.scene.add.graphics();
		graphics.fillStyle(0x000000, 1);
		graphics.setScrollFactor(0);
		graphics.fillRect(boxX, centerY, boxWidth, 1); // Placeholder height for text measurement
		graphics.lineStyle(4, 0xffffff);
		graphics.strokeRect(boxX, centerY, boxWidth, 1); // Placeholder height for text measurement
	  
		const text = this.scene.add.text(centerX, centerY, message, textConfig);
		text.setOrigin(0.5);
		text.setScrollFactor(0);
	  
		const textHeight = text.height + padding * 2;
		const boxHeight = Math.max(textHeight + 30, 100);
		const boxY = centerY - boxHeight / 2;
	  
		graphics.clear();
		graphics.fillStyle(0x000000, 1);
		graphics.fillRect(boxX, boxY, boxWidth, boxHeight);
		graphics.lineStyle(4, 0xffffff);
		graphics.strokeRect(boxX, boxY, boxWidth, boxHeight);
	  
		text.setY(centerY - 10); // Adjust the text Y position based on the new box height
	  
		const additionalTextConfig = {
		  font: 'italic 14px Arial',
		  fill: '#ffffff',
		};
	  
		const additionalText = this.scene.add.text(centerX, boxY + boxHeight + padding, "Prem 'B' per continuar", additionalTextConfig);
		additionalText.setOrigin(0.5, 0);
		additionalText.y = boxY + boxHeight - 30;

		additionalText.setScrollFactor(0);
	  
		this.messageBox.push(graphics, text, additionalText);
		this.scene.messageDisplaying = true;
	  }
	  
	destroyMessageBox() {
		console.log('We need to destroy the message');
		if (this.messageBox && this.messageBox.length > 0) {
		  this.messageBox.forEach(element => {
			console.log('Destroying messageBox element');
			element.destroy();
		  });
		  this.messageBox = [];
		}
	}
}