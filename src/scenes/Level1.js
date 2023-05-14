import Common from '../classes/Common';
import Camera from '../classes/Camera';
import HUD from '../classes/HUD';
import Loading from '../classes/Loading';

export default class Level1 extends Phaser.Scene
{
	constructor()
	{
		super('Level1');
		this.jumpKeyReleased = true;
		this.jump = false;
		this.moveLeft = false;
		this.moveRight = false;
		this.touchMoveLeft = false;
		this.touchMoveRight = false;
		this.score = 0;
		this.player = null;
		this.joystick = null;
		this.messageDisplaying = false;
		this.startScene = false;
		this.npcs = null;

		this.firstInteraction = true;

		this.common = null;
	}

	preload()
    { }

	create()
	{
		// Create the tilemap using the loaded JSON file
		this.map = this.make.tilemap({ key: 'level1'});
	
		// Add the loaded tiles image asset to the map
		const tileset = this.map.addTilesetImage('tileset', 'tileset');
		const objects = this.map.addTilesetImage('objects', 'objects');

		this.sky_bg = this.map.createLayer('sky_bg', tileset).scrollFactorX = 0.5;
		this.sky_fg = this.map.createLayer('sky_fg', tileset).scrollFactorX = 0.6;
		this.mountains_bg = this.map.createLayer('sky_mountains_bg', tileset).scrollFactorX = 0.7;
		this.mountains_fg = this.map.createLayer('sky_mountains_fg', tileset).scrollFactorX = 0.8;
		this.trees_bg = this.map.createLayer('trees_bg', tileset).scrollFactorX = 0.9;
		this.trees_fg = this.map.createLayer('trees_fg', tileset);
		this.ground_bg = this.map.createLayer('ground_bg', tileset);
		this.ground = this.map.createLayer('ground_fg', tileset);
		this.rocks = this.map.createLayer('rocks', tileset);
		this.walls = this.map.createLayer('walls', tileset);
		this.bridge = this.map.createLayer('bridge', tileset);
		this.platforms = this.map.createLayer('platforms', tileset);
		this.grass = this.map.createLayer('grass', tileset)
		
		this.physics.world.setBounds(50, 0, this.map.widthInPixels - 50, this.map.heightInPixels * tileset.tileHeight);

		// Create all resources
		this.common = new Common(this);
		this.camera = new Camera();

		// Spawn all interactable objects
		this.common.spawnTreasures(this);
		this.common.spawnCoins(this);
		this.common.spawnDoors(this);
		this.common.spawnNpcs(this, 'npc_mi', 4);
		this.common.spawnNpcs(this, 'npc_xavi', 7);

		// Spawn player
		this.player = this.common.addPlayer(this);

		// Add colliders, input, hud, music
		this.common.addColliders(this);
		this.common.setCollisions(this);
		this.joystick = this.common.addInput(this).joystick;
		this.hud = new HUD();
		this.hud.addHud(this);
		this.loadMusic();

		// Add controls
		this.player.addTouchScreenPointers(this);
		this.player.setKeyboardControls(this);
	}

	update() {
		// Update player movement based on events
		this.player.playerMovement(this);
		
		// Setup camera bounds and zoom
		this.camera.setCamera(this, 2.40);
	
		// Check for proximity to NPCs
		this.npcs.getChildren().forEach((npc) => {
			const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.x, npc.y);
			if (distance < 50 && this.firstInteraction) {
				console.log('Show message from NPCs');
				let text = 'Som el Xavi i la Miriam!\nSaps què? Ens casem!!\nEl problema és que hem perdut el mapa de la ubicació.\nEns ajudes a trobar-lo?'
				this.common.showMessage(this, text);
			}
			// this.input.on('pointerdown', (pointer) => {
			// 	if(this.firstInteraction === true){
			// 		console.log('This is first interaction? ' + this.firstInteraction + '. Message is displaying? ' + this.messageDisplaying);
			// 		this.firstInteraction = false;
			// 		this.messageDisplaying = false;
			// 		this.common.destroyMessageBox();
			// 	}
			// })
		});
		
	
		if (this.startScene) {
			console.log('Stop scene Level1, start scene Level2');
			this.startScene = false; // Reset the flag
			this.scene.stop('Level1');
			this.backgroundMusic.stop();
			this.scene.start('PreLevel', { levelKey: 'Level2', text: 'La Data' });
		}
	}
	

	loadMusic(){
		// Create an instance of the audio object
		this.backgroundMusic = this.sound.add('background_music', { loop: true, volume: 0.2});
		// Play the audio file
		this.backgroundMusic.play();
	}
}
