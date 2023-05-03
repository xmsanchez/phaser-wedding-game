import Player from './Player.js';
import Joystick from './Joystick.js';
import HUD from './HUD.js';

export default class Common {
    constructor() {}
	
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
		scene.physics.add.collider(scene.player, scene.coins);
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