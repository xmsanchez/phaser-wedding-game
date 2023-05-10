import Player from './Player.js';
import Joystick from './Joystick.js';
import Level2 from '../scenes/Level2'

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
        // Player
        scene.player = new Player(scene, 170, 500, 'player').setScale(1).refreshBody();
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
		scene.interactBtn = scene.joystick.createInteractButton(scene, canvasWidth - 300, (canvasHeight / 2) * 1.3);

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
		}else{
			newTreasure.containsText = contains.value;
		}
		console.log('Contains.value is: ' + contains.value);
		console.log('Newtreasure.contents is: ' + newTreasure.contents);
		return newTreasure
	}

	openTreasure(player, treasure, scene) {
		console.log('Treasure opened! Show the message');
		
		scene.common.chest_opened_sound.play();
		// Show a message
		scene.common.showMessage(this, 'Has trobat ' + treasure.containsText + '!');
		
		// Add a new object to the inventory
		console.log('Add treasure contents to the inventory: ' + treasure.contents);
		scene.hud.inventory.push(treasure.contents);
		scene.hud.updateInventory(scene);
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
			// newdoor.data = door.properties;
			scene.doors.add(newdoor);
		});	
	}

	translatePlayerPosition(player, door, scene) {
		// Find the door2_2 object
		const door2_2 = scene.doors.getChildren().find(child => child.name === 'door2_2');

		if (door2_2) {
			// Move the player to the location of door2_2
			player.x = door2_2.x + door2_2.width / 2;
			player.y = door2_2.y;
		} else {
			console.error("Door 'door2_2' not found in this.doors");
		}
	}

	openDoor(player, door, scene) {
		console.log('You found a door');
		var inventory = scene.hud.inventory;
		var key = null;
		console.log('Inventory length: ' + inventory.length);
		console.log('Inventory contents: ' + JSON.stringify(inventory));
		console.log(JSON.stringify(inventory))
		for (var i = 0; i < inventory.length; i++) {
			if (inventory[i] == 'key') {
				key = i;
			}
		}

		const doorName = door.name;
		console.log('Key is: ' + key);
		console.log('Door opened is: ' + door.opened);

		if (key == null && door.opened == null) {
			console.log('Key is: ' + key);
			console.log('Door opened is: ' + door.opened);
			if(scene.messageDisplaying) {
				scene.messageDisplaying = false;
				this.destroyMessageBox();
			}else{
				scene.common.showMessage(this, 'La porta està tancada.\nNecessites una clau!.');
			}

		// The player has the key!
		}else{
			door.opened = true;

			// Remove the used from the inventory
			scene.hud.inventory.pop('key');
			scene.hud.updateInventory(scene);
			
			scene.common.showMessage(this, 'Utilitzes la clau!\nObres la porta...');

			// Doors Level1
			if (doorName == 'door1_1'){
				// Start a new scene
				console.log('door1_1 interacted. Start a new scene');
				this.scene.startScene = true;

			// Doors Level2
			}else if (doorName == 'door1_2') {
				console.log('We found the door number 1!');
				// Move the player to the location of door number2
				this.translatePlayerPosition(player, doorName, scene);
			}
		}
	}

	showMessage(scene, message) {
		const padding = 20;
		const boxWidth = this.scene.cameras.main.width / 2.3 - padding * 2;
		const boxHeight = 100;
		const centerX = this.scene.cameras.main.centerX;
		const centerY = this.scene.cameras.main.centerY;
		const boxX = centerX - boxWidth / 2;
		const boxY = centerY - boxHeight / 2;
	
		const graphics = this.scene.add.graphics();
		graphics.fillStyle(0x000000, 1);
		graphics.fillRect(boxX, boxY, boxWidth, boxHeight);
		graphics.lineStyle(4, 0xffffff);
		graphics.strokeRect(boxX, boxY, boxWidth, boxHeight);
		
		const text = this.scene.add.text(centerX, centerY, message, {
			fontSize: '24px',
			fill: '#ffffff'
		});
		text.setOrigin(0.5);
	
		graphics.setScrollFactor(0);
		text.setScrollFactor(0);

		this.messageBox.push(graphics, text);
		this.scene.messageDisplaying = true;
	}

	destroyMessageBox() {
		if (this.messageBox && this.messageBox.length > 0) {
		  this.messageBox.forEach(element => {
			element.destroy();
		  });
		  this.messageBox = [];
		}
	}
}