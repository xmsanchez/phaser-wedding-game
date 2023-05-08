export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setBounce(0.1);
        this.setCollideWorldBounds(true);
    }

	// This function will run in the update loop
	playerMovement(scene) {
		const acceleration = 600; // Higher value for more aggressive acceleration
		const drag = 1200; // Higher value for more aggressive deceleration
		const maxVelocityX = 220;
		const jumpVelocity = -450;

		if (!scene.messageDisplaying) {
			if (this.moveLeft) {
				scene.player.setAccelerationX(-acceleration);
				if (scene.player.body.velocity.x < -maxVelocityX) {
					scene.player.setVelocityX(-maxVelocityX);
				}
				scene.player.anims.play('left', true);
			} else if (this.moveRight) {
				scene.player.setAccelerationX(acceleration);
				if (scene.player.body.velocity.x > maxVelocityX) {
					scene.player.setVelocityX(maxVelocityX);
				}
				scene.player.anims.play('right', true);
			} else {
				// If no keys are pressed, the player decelerates
				scene.player.setAccelerationX(0);
				scene.player.setDragX(drag);
				scene.player.anims.play('idle', true);
			}
		}

		if (this.jump && scene.player.body.onFloor() && this.jumpKeyReleased) {
			scene.player.setVelocityY(jumpVelocity);
			scene.player.play('jump', true);
			this.jump = false;
			this.jumpKeyReleased = false;
		}
		
		// Check if jump key is released
		if (!scene.cursors.space.isDown) {
			this.jumpKeyReleased = true;
		}

		this.isOverlappingCoins(scene);
		this.isOverlappingDoors(scene);
	}

	// The following functions will be called in the create loop
	addTouchScreenPointers(scene) {
		scene.joystick.on('update', this.readTouchInput, scene);

		// Pointer up allow us to stop the player movement
		// When no longer pressing the joystick 
		// WARN: Might affect some other stuff, maybe
        scene.input.on('pointerup', function (pointer) {
            console.log('Pointer up!');
			this.moveLeft = false;
			this.moveRight = false;
        }, this)

		// Add a listener for the 'pointerup' event, which fires when the button is released
		scene.interactBtn.on('pointerdown', () => {
			const overlappingTreasures = this.isOverlappingTreasures(scene);
			const overlappingDoors = this.isOverlappingDoors(scene);
			console.log('Overlapping treasures and doors: ' + overlappingTreasures.length + ' ' + overlappingDoors.length);
			if (overlappingTreasures.length > 0) {
				overlappingTreasures.forEach((treasure) => {
					scene.common.openTreasure(this, treasure, scene);
				});
			} else if (overlappingDoors.length > 0) {
				overlappingDoors.forEach((door) => {
					scene.common.openDoor(this, door, scene);
				});
			} else if (scene.messageDisplaying) {
				scene.messageDisplaying = false;
				scene.common.destroyMessageBox();
			} else if (scene.player.body.onFloor()) {
				this.jump = true;
			}
		});
	}

	readTouchInput() {
		var cursorKeys = this.joystick.createCursorKeys();
	    var s = 'Key down: ';
        for (var name in cursorKeys) {
            if (cursorKeys[name].isDown) {
                s += `${name} `;
				if (name == 'left') {
					console.log('Touchscreen LEFT');
					this.player.moveLeft = true;
					this.player.moveRight = false;
				}
				if (name == 'right') {
					console.log('Touchscreen RIGHT');
					this.player.moveRight = true;
					this.player.moveLeft = false;
				}
            }
        }		
	}
	setKeyboardControls(scene) {
		// Keyboard ccontrols
		scene.cursors = scene.input.keyboard.createCursorKeys();
		scene.cursors.left.on('down', () => {
			console.log('Keyboard LEFT');
			this.moveLeft = true;
			this.moveRight = false;
		});
		scene.cursors.right.on('down', () => {
			console.log('Keyboard RIGHT');
			this.moveRight = true;
			this.moveLeft = false;
		})
		scene.cursors.space.on('down', () => {
			if(scene.player.body.onFloor()){
				const overlappingTreasures = this.isOverlappingTreasures(scene);
				const overlappingDoors = this.isOverlappingDoors(scene);
				console.log('Overlapping treasures: ' + overlappingTreasures.length);
				console.log('Overlapping doors: ' + overlappingDoors.length);
				if (overlappingTreasures.length > 0) {
					overlappingTreasures.forEach((treasure) => {
						scene.common.openTreasure(this, treasure, scene);
					});
				} else if (overlappingDoors.length > 0) {
					overlappingDoors.forEach((door) => {
						scene.common.openDoor(this, door, scene);
					});
				} else if (scene.messageDisplaying) {
					scene.messageDisplaying = false;
					scene.common.destroyMessageBox();
				} else if (scene.player.body.onFloor()) {
					this.jump = true;
				}
			}
		})
		scene.cursors.left.on('up', () => {
			this.moveLeft = false;
			this.moveRight = false;
		});
		scene.cursors.right.on('up', () => {
			this.moveRight = false;
			this.moveLeft = false;
		})
		scene.cursors.space.on('up', () => {
			this.jump = false;
		})	
	}

	isOverlappingTreasures(scene) {
		// console.log('Check if overlaps with TREASURES');
		const overlaps = [];
		scene.physics.world.overlap(this, scene.treasures.getChildren(), (player, treasure) => {
			if (treasure.opened){
				return;
			}
			treasure.opened = true;
			treasure.setFrame(11);
			overlaps.push(treasure);
		});
		return overlaps;
	}
	
	isOverlappingCoins(scene) {
		// console.log('Check if overlaps with COINS');
		const overlaps = [];
		scene.physics.world.overlap(this, scene.coins.getChildren(), (player, coin) => {
			console.log('Overlaps! Hide coin!');

			// scene.common.colletCoin(coin);
			// Stop the sound if it's already playing
			if (scene.common.coin_sound.isPlaying) {
				scene.common.coin_sound.stop();
			}
			
			// Play the sound
			scene.common.coin_sound.play();
			
			scene.score += 10;
			scene.hud.updateScore(scene.score);
			coin.destroy();
			overlaps.push(coin);
		});
		return overlaps;
	}
	
	isOverlappingDoors(scene) {
		const overlaps = [];
		scene.physics.world.overlap(this, scene.doors.getChildren(), (player, door) => {
			if (door.opened){
				return;
			}
			overlaps.push(door);
		});
		return overlaps;
	}

	createAnimations(scene){

		this.anims.create({
			key: 'idle',
			frames: this.anims.generateFrameNumbers('player', { start: 0, end: 0 }),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers('player', { start: 3, end: 5 }),
			frameRate: 10,
			repeat: -1
		});
		
		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers('player', { start: 6, end: 8 }),
			frameRate: 10,
			repeat: -1
		});
	
		this.anims.create({
			key: 'climb',
			frames: this.anims.generateFrameNumbers('player', { start: 9, end: 11 }),
			frameRate: 10,
			repeat: -1
		});
	
		this.anims.create({
			key: 'jump',
			frames: this.anims.generateFrameNumbers('player', { start: 0, end: 2 }),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'turn',
			frames: [{ key: 'player', frame: 1 }],
			frameRate: 20
		});
	}
}