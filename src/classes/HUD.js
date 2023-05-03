export default class HUD {
    constructor(scene) {
        this.scoreText = null;
    }

    addHud(scene) {
		const canvasWidth = scene.cameras.main.width;
		const canvasHeight = scene.cameras.main.height;
		console.log('Canvas height: ' + canvasHeight);
		console.log('Canvas width: ' + canvasWidth);
		
		// scene.joystick = new Joystick(scene, 300, (canvasHeight / 2) * 1.3);
        this.scoreText = scene.add.text(250, (canvasHeight / 2) * 0.6, 'Score: 0', { font: '18px Arial' }).setScrollFactor(0);
    }
}