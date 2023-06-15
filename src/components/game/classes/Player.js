export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setBounce(0.1);
        this.setCollideWorldBounds(true);

		this.msgSelectedOnAccept = 0;
		this.msgSelectedIndex = 0;
		this.scene = scene;

		this.lastMove = 'idle';
    }

	// This function will run in the update loop
	playerMovement(scene) {
		const acceleration = 500; // Higher value for more aggressive acceleration
		const drag = 1200; // Higher value for more aggressive deceleration
		const maxVelocityX = 180;
		const jumpVelocity = -450;

		if (!scene.message.messageDisplaying) {
			if (this.moveLeft) {
				this.lastMove = 'idleLeft';
				scene.player.setAccelerationX(-acceleration);
				if (scene.player.body.velocity.x < -maxVelocityX) {
					scene.player.setVelocityX(-maxVelocityX);
				}
				if(scene.player.body.onFloor()){
					scene.player.anims.play('left', true);
				}else{
					scene.player.anims.play('jumpLeft', true);
				}
			} else if (this.moveRight) {
				this.lastMove = 'idleRight';
				scene.player.setAccelerationX(acceleration);
				if (scene.player.body.velocity.x > maxVelocityX) {
					scene.player.setVelocityX(maxVelocityX);
				}
				if(scene.player.body.onFloor()){
					scene.player.anims.play('right', true);
				}else{
					scene.player.anims.play('jumpRight', true);
				}
			} else {
				// If no keys are pressed, the player decelerates
				scene.player.setAccelerationX(0);
				scene.player.setDragX(drag);
				scene.player.anims.play(this.lastMove, true);
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
		}else{
			// While message is displaying the character will stop
			scene.player.setAccelerationX(0);
			scene.player.setDragX(drag);
			scene.player.anims.play(this.lastMove, true);

			// Update the text on the messageSelectorBox
			if (scene.messageIsSelector) {
				for (let i = 0; i < scene.messageSelectorTextObjects.length; i++) {
					if (this.msgSelectedIndex === i) {
						scene.messageSelectorTextObjects[i].setText("-> " + scene.messageSelectorTexts[i]);						
					} else {
						scene.messageSelectorTextObjects[i].setText(scene.messageSelectorTexts[i]);
					}
				}
			}
		}

		this.isOverlappingCoins(scene);
	}

	// The following functions will be called in the create loop
	addTouchScreenPointers(scene) {
		const UIScene = scene.UIScene;
		const joystick = scene.joystick.joystick;
		const interactBtn = scene.interactBtn;
		const jumpBtn = scene.jumpBtn;

		joystick.on('update', this.readTouchInput, scene);

		// Pointer up allow us to stop the player movement
		// When no longer pressing the joystick 
		// WARN: Might affect some other stuff, maybe
        UIScene.input.on('pointerup', function (pointer) {
            console.log('Pointer up!');
			this.moveLeft = false;
			this.moveRight = false;
			this.moveDown = false;
			this.moveUp = false;
        }, this)

		// // Control the message selector box on pointer down
		// // we do it here and not on update to avoid multiple inputs
		// joystick.on('pointerdown', function (pointer) {
		// 	const selected = this.player.msgSelectedIndex;
		// 	const messageList = this.player.scene.messageSelectorTexts;
		// 	if(this.player.moveDown && selected >= 0 && selected < messageList.length - 1){
		// 		this.player.msgSelectedIndex += 1;
		// 	}else if(this.player.moveUp && selected > 0 && selected < messageList.length){
		// 		this.player.msgSelectedIndex -= 1;
		// 	}
		// }, scene);

		// Add a listener for the 'pointerup' event, which fires when the button is released
		interactBtn.on('pointerdown', () => {
            console.log('Pointer down!');
			this.checkInteractBtn(scene);
		});

		// Add a listener for the 'pointerup' event, which fires when the button is released
		jumpBtn.on('pointerdown', () => {
			this.checkJumpBtn(scene);
		});
	}

	checkInteractBtn(scene) {
		// Check overlaps (show the 'B' button hint)
		const overlappingTreasures = this.isOverlappingTreasures(scene);
		const overlappingDoors = this.isOverlappingDoors(scene);
		const overlappingCartells = this.isOverlappingCartells(scene);
		const overlappingNPCs = this.isOverlappingNpcs(scene);
		const overlappingBunny = this.isOverlappingBunny(scene);

		if(scene.message.messageDisplaying && !scene.message.messageIsSelector){
			console.log('Checking interact button. Destroy the message box.');
			scene.message.destroyMessageBox();
			
		}else if (scene.message.messageDisplaying && this.scene.message.messageIsSelector){
			console.log('Select message option and destroy the box!');
			this.msgSelectedOnAccept = this.msgSelectedIndex;
			console.log('Message selected is: ' + scene.message.messageSelectorTexts[this.msgSelectedOnAccept]);
			scene.message.destroyMessageBox();
		}else{
			if (overlappingTreasures.length > 0) {
				overlappingTreasures.forEach((treasure) => {
					scene.common.openTreasure(this, treasure, scene);
				});
			} else if (overlappingDoors.length > 0) {
				overlappingDoors.forEach((door) => {
					scene.common.checkIfCanOpenDoor(this, door, scene);
				});
			} else if (overlappingNPCs.length > 0) {
				overlappingNPCs.forEach((npc) => {
					scene.common.checkNpcActions(this, npc, scene);
				})
			} else if (overlappingCartells.length > 0) {
				overlappingCartells.forEach((cartell) => {
					scene.common.readCartell(this, cartell, scene);
				})
			} else if (overlappingBunny.length > 0) {
				overlappingBunny.forEach((b) => {
					scene.common.checkBunnyActions(this, b, scene);
				})
			}
		}
		console.log('checkInteractBtn finished');
	}	  

	checkJumpBtn(scene) {
		if (scene.player.body.onFloor()) {
			this.jump = true;
		}
	}

	readTouchInput() {
		var cursorKeys = this.joystick.createCursorKeys();
	    var s = 'Key down: ';
        for (var name in cursorKeys) {
            if (cursorKeys[name].isDown) {
                s += `${name} `;

				if (name == 'left') {
					// console.log('Touchscreen LEFT');
					this.player.moveLeft = true;
					this.player.moveRight = false;
					this.player.moveDown = false;
					this.player.moveUp = false;
				}
				if (name == 'right') {
					// console.log('Touchscreen RIGHT');
					this.player.moveRight = true;
					this.player.moveLeft = false;
					this.player.moveDown = false;
					this.player.moveUp = false;
				}
				if (name == 'down') {
					// console.log('Touchscreen DOWN');
					this.player.moveRight = false;
					this.player.moveLeft = false;
					this.player.moveDown = true;
					this.player.moveUp = false;
				}
				if (name == 'up') {
					// console.log('Touchscreen UP');
					this.player.moveRight = false;
					this.player.moveLeft = false;
					this.player.moveDown = false;
					this.player.moveUp = true;
				}
            }
        }
	}

	setKeyboardControls(scene) {
		// Keyboard controls
		const enterKey = scene.input.keyboard.addKey('ENTER');
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
		});
		scene.cursors.up.on('down', () => {
			console.log('Keyboard UP');
			this.moveRight = false;
			this.moveLeft = false;
			this.moveDown = false;
			this.moveUp = true;
			try {
				if(this.msgSelectedIndex > 0 && this.msgSelectedIndex < this.scene.messageSelectorTexts.length){
					this.msgSelectedIndex -= 1;
				}
			} catch (error) {
				
			}
		});
		scene.cursors.down.on('down', () => {
			console.log('Keyboard DOWN');
			this.moveRight = false;
			this.moveLeft = false;
			this.moveDown = true;
			try {
				this.moveUp = false;
				if(this.msgSelectedIndex >= 0 && this.msgSelectedIndex < this.scene.messageSelectorTexts.length - 1){
					this.msgSelectedIndex += 1;
				}
			} catch (error) {
				
			}
		})
		scene.cursors.space.on('down', () => {
			if(scene.player.body.onFloor()){
				this.checkJumpBtn(scene);
			}
		});
		enterKey.on('down', () => {
			this.checkInteractBtn(scene);
		});
		scene.cursors.left.on('up', () => {
			this.moveLeft = false;
		});
		scene.cursors.right.on('up', () => {
			this.moveRight = false;
		})
		scene.cursors.up.on('up', () => {
			this.moveUp = false;
		})
		scene.cursors.down.on('up', () => {
			this.moveDown = false;
		})
		scene.cursors.space.on('up', () => {
			this.jump = false;
		})	
	}

	isOverlappingTreasures(scene) {
		const overlaps = [];
		if(scene.treasures !== null){
			scene.physics.world.overlap(this, scene.treasures.getChildren(), (player, treasure) => {
				overlaps.push(treasure);
			});
		}
		return overlaps;
	}
	
	isOverlappingCoins(scene) {
		try {
			const overlaps = [];
			scene.physics.world.overlap(this, scene.coins.getChildren(), (player, coin) => {
				console.log('Overlaps! Hide coin!');
	
				// Stop the sound if it's already playing
				if (scene.common.coin_sound.isPlaying) {
					scene.common.coin_sound.stop();
				}
				
				// Play the sound
				scene.common.coin_sound.play();
				
				scene.score += 10;
				// scene.hud.updateScore(scene.score);
				coin.destroy();
				overlaps.push(coin);
			});
			return overlaps;
		} catch (error) {
			return [];	
		}
	}
	
	isOverlappingDoors(scene) {
		try {
			const overlaps = [];
			if(scene.doors !== null){
				scene.physics.world.overlap(this, this.scene.doors.getChildren(), (player, door) => {
					overlaps.push(door);
				});
			}
			return overlaps;
		} catch (error) {
			return [];
		}
	}
	
	isOverlappingCartells(scene) {
		try {
			const overlaps = [];
			if(scene.cartells !== null){
				scene.physics.world.overlap(this, scene.cartells.getChildren(), (player, cartell) => {
					overlaps.push(cartell);
				});
			}
			return overlaps;
		} catch (error) {
			return [];
		}
	}

	isOverlappingNpcs(scene) {
		try {
			const overlaps = [];
			if(scene.npcs !== null){
				scene.physics.world.overlap(this, scene.npcs.getChildren(), (player, npc) => {
					overlaps.push(npc);
				});
			}
			return overlaps;
		} catch (error) {
			return [];
		}
	}

	isOverlappingBunny(scene) {
		try {
			const overlaps = [];
			if(scene.bunny !== null){
				scene.physics.world.overlap(this, scene.bunny, (player, b) => {
					overlaps.push(b);
				});
			}
			return overlaps;
		} catch (error) {
			return [];
		}
	}

	createAnimations(scene){
		this.anims.create({
			key: 'idle',
			frames: this.anims.generateFrameNumbers('player', { start: 3, end: 3 }),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'idleRight',
			frames: this.anims.generateFrameNumbers('player', { frames: [7] }),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'idleLeft',
			frames: this.anims.generateFrameNumbers('player', { frames: [10] }),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers('player', { start: 8, end: 10 }),
			frameRate: 10,
			repeat: -1
		});
		
		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers('player', { start: 5, end: 7 }),
			frameRate: 10,
			repeat: -1
		});
	
		this.anims.create({
			key: 'up',
			frames: this.anims.generateFrameNumbers('player', { frames: [4, 0, 1] }),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'down',
			frames: this.anims.generateFrameNumbers('player', { frames: [3, 2, 11] }),
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
			frames: this.anims.generateFrameNumbers('player', { start: 3, end: 3 }),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'jumpLeft',
			frames: this.anims.generateFrameNumbers('player', { start: 10, end: 10 }),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'jumpRight',
			frames: this.anims.generateFrameNumbers('player', { start: 7, end: 7 }),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'turn',
			frames: [{ key: 'player', frame: 3 }],
			frameRate: 20
		});
	}

	// // TEST SPRITESHEET
	// createAnimations(scene){
	// 	this.anims.create({
	// 		key: 'idle',
	// 		frames: this.anims.generateFrameNumbers('player', { frames: [25] }),
	// 		frameRate: 10,
	// 		repeat: -1
	// 	});

	// 	this.anims.create({
	// 		key: 'idleRight',
	// 		frames: this.anims.generateFrameNumbers('player', { frames: [13] }),
	// 		frameRate: 10,
	// 		repeat: -1
	// 	});

	// 	this.anims.create({
	// 		key: 'idleLeft',
	// 		frames: this.anims.generateFrameNumbers('player', { frames: [37] }),
	// 		frameRate: 10,
	// 		repeat: -1
	// 	});

	// 	this.anims.create({
	// 		key: 'left',
	// 		frames: this.anims.generateFrameNumbers('player', { start: 36, end: 38 }),
	// 		frameRate: 10,
	// 		repeat: -1
	// 	});
		
	// 	this.anims.create({
	// 		key: 'right',
	// 		frames: this.anims.generateFrameNumbers('player', { start: 12, end: 14 }),
	// 		frameRate: 10,
	// 		repeat: -1
	// 	});
	
	// 	this.anims.create({
	// 		key: 'up',
	// 		frames: this.anims.generateFrameNumbers('player', { frames: [4, 0, 1] }),
	// 		frameRate: 10,
	// 		repeat: -1
	// 	});

	// 	this.anims.create({
	// 		key: 'down',
	// 		frames: this.anims.generateFrameNumbers('player', { frames: [3, 2, 11] }),
	// 		frameRate: 10,
	// 		repeat: -1
	// 	});

	// 	this.anims.create({
	// 		key: 'climb',
	// 		frames: this.anims.generateFrameNumbers('player', { start: 9, end: 11 }),
	// 		frameRate: 10,
	// 		repeat: -1
	// 	});
	
	// 	this.anims.create({
	// 		key: 'jump',
	// 		frames: this.anims.generateFrameNumbers('player', { frames: [48, 54] }),
	// 		frameRate: 2,
	// 		repeat: 0
	// 	});

	// 	this.anims.create({
	// 		key: 'jumpLeft',
	// 		frames: this.anims.generateFrameNumbers('player', { frames: [48, 54] }),
	// 		frameRate: 2,
	// 		repeat: 0
	// 	});

	// 	this.anims.create({
	// 		key: 'jumpRight',
	// 		frames: this.anims.generateFrameNumbers('player', { frames: [48, 54] }),
	// 		frameRate: 2,
	// 		repeat: 0
	// 	});

	// 	this.anims.create({
	// 		key: 'turn',
	// 		frames: [{ key: 'player', frame: 3 }],
	// 		frameRate: 20
	// 	});
	// }
}