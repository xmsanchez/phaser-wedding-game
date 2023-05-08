export default class MainMenu extends Phaser.Scene
{
	constructor()
	{
		super('MainMenu');
	}

	preload() {	

    }

	create() {		
		const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
		const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        this.startText = this.add.text(screenCenterX, screenCenterY, 'START', { font: '70px Arial' }).setOrigin(0.5);

		var instructionsText = 'Instruccions:\nUtilitza el joystick esquerre per moure el personatge.\nUtilitza el botó dret per saltar/interactuar.';
		this.instructions = this.add.text(screenCenterX, screenCenterY + 120, instructionsText, { font: '20px Arial' }).setOrigin(0.5);


		// make the startText clickable
		this.startText.setInteractive();

		// add a click event listener to start the Level1 scene
		this.startText.on('pointerdown', () => {
			this.scene.start('Level1');
		});
    }

    update() {
		
    }
}
