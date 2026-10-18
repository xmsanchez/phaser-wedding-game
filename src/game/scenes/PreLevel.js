// Black transition screen with an optional title, shown before each level.
// Without a levelName it launches the level straight away.
export default class PreLevel extends Phaser.Scene {
	constructor() {
		super('PreLevel');
	}

	create({ levelName, levelKey, text, textSize = 90, timeout = 2000 }) {
		const launch = () => {
			this.scene.launch('UIScene');
			this.scene.launch(levelKey);
			this.scene.stop();
		};

		if (levelName === undefined) {
			launch();
			return;
		}

		this.cameras.main.setBackgroundColor('#000');
		this.add.text(400, 300, levelName, { font: '42px monospace', align: 'center' }).setOrigin(0.5, 0);
		this.add.text(400, 300, text, { font: textSize + 'px monospace', align: 'center' }).setOrigin(0.5, -2);
		this.time.delayedCall(timeout, launch);
	}
}
