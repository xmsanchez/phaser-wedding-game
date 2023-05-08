import Player from './Player.js';
import Joystick from './Joystick.js';

export default class Common {
    constructor(scene) {
		this.score = scene.score
		this.hud = scene.hud
		this.openTreasure = this.openTreasure.bind(scene);
		this.messageBox = [];
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

	spawnTreasures(scene) {
		scene.treasures = scene.physics.add.staticGroup();
		scene.treasuresLayer = scene.map.getObjectLayer('treasures');
		var count = 0;
		scene.treasuresLayer.objects.forEach((treasure) => {
			count += 1;
			const newTreasure = scene.physics.add.sprite(treasure.x, treasure.y, 'treasure', 8).setOrigin(0, 1);
			newTreasure.id = count;
			scene.treasures.add(newTreasure);
		});	
	}

	openTreasure(player, treasure, scene) {
		console.log('Treasure opened! Show the message');
		// Remove the treasure from the scene
		// treasure.disableBody(true, true);
		// Show a message
		scene.common.showMessage(this, 'You found a treasure!');

		// Update the score (if you have a scoring system)
		this.score += 10;
		this.hud.updateScore(this.score);
	}

	showMessage(scene, message) {
		const padding = 20;
		const boxWidth = scene.cameras.main.width / 2.3 - padding * 2;
		const boxHeight = 100;
		const centerX = scene.cameras.main.centerX;
		const centerY = scene.cameras.main.centerY;
		const boxX = centerX - boxWidth / 2;
		const boxY = centerY - boxHeight / 2;
	
		const graphics = scene.add.graphics();
		graphics.fillStyle(0x000000, 1);
		graphics.fillRect(boxX, boxY, boxWidth, boxHeight);
		graphics.lineStyle(4, 0xffffff);
		graphics.strokeRect(boxX, boxY, boxWidth, boxHeight);
		
		const text = scene.add.text(centerX, centerY, message, {
			fontSize: '24px',
			fill: '#ffffff'
		});
		text.setOrigin(0.5);
	
		graphics.setScrollFactor(0);
		text.setScrollFactor(0);

		this.messageBox.push(graphics, text);
		scene.messageDisplaying = true;
	}

	destroyMessageBox() {
		if (this.messageBox && this.messageBox.length > 0) {
		  this.messageBox.forEach(element => {
			element.destroy();
		  });
		  this.messageBox = [];
		}
	}
	
	addColliders(scene) {
		// Add colliders
		scene.physics.add.collider(scene.player, scene.ground);
		scene.physics.add.collider(scene.player, scene.platforms);
		scene.physics.add.collider(scene.player, scene.walls);
		scene.physics.add.collider(scene.player, scene.bridge);
		scene.physics.add.collider(scene.player, scene.coins);
		scene.physics.add.collider(scene.treasures, scene .ground);
	}

	setCollisions(scene){
		//Before you can use the collide function you need to set what tiles can collide
		scene.map.setCollisionBetween(6, 270, true, true, 'ground_fg');
		scene.map.setCollisionBetween(6, 270, true, true, 'platforms');
		scene.map.setCollisionBetween(6, 270, true, true, 'walls');
		scene.map.setCollisionBetween(6, 270, true, true, 'bridge');
		scene.map.setCollisionByProperty('collects', true, 'solid');

		// Enable physics for the scene (e.g., using Arcade Physics)
		scene.physics.world.setBoundsCollision(true, true, true, true);
	}
}