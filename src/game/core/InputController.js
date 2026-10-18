// Unified input for keyboard and touch, owned by the UIScene.
// Movement is polled every frame (left/right); actions are events: 'jump' and 'interact'.
export default class InputController extends Phaser.Events.EventEmitter {
	constructor(scene) {
		super();
		const { width, height } = scene.cameras.main;

		// Allow two simultaneous touches (joystick + button)
		scene.input.addPointer(1);

		this.joystick = scene.plugins.get('rexvirtualjoystickplugin').add(scene, {
			x: 150,
			y: (height / 2) * 1.7,
			radius: 150,
			base: scene.add.circle(0, 0, 150, 0x888888).setAlpha(0.3),
			thumb: scene.add.circle(0, 0, 90, 0xcccccc).setAlpha(0.3),
			dir: '4dir',
			forceMin: 5,
		});
		this.jumpButton = this.createButton(scene, width - 150, (height / 2) * 1.7, 120, 0x008000, 'A', '70px', 'jump');
		this.interactButton = this.createButton(scene, width - 360, (height / 2.2) * 2, 70, 0xff0000, 'B', '50px', 'interact');

		const keyboard = scene.input.keyboard;
		this.cursors = keyboard.createCursorKeys();
		this.enterKey = keyboard.addKey('ENTER');
		this.cursors.space.on('down', () => this.emit('jump'));
		this.enterKey.on('down', () => this.emit('interact'));
	}

	get left() {
		return this.cursors.left.isDown || this.joystick.left;
	}

	get right() {
		return this.cursors.right.isDown || this.joystick.right;
	}

	createButton(scene, x, y, radius, color, label, fontSize, event) {
		const circle = scene.add.circle(x, y, radius, color).setAlpha(0.3);
		circle.setInteractive({ useHandCursor: true });
		circle.on('pointerdown', () => this.emit(event));
		const text = scene.add.text(x, y, label, { font: `${fontSize} Arial`, fill: '#ffffff' }).setOrigin(0.5);
		return scene.add.container(0, 0, [circle, text]);
	}

	setVisible(visible) {
		this.joystick.setVisible(visible);
		this.jumpButton.setVisible(visible);
		this.interactButton.setVisible(visible);
	}

	destroy() {
		this.removeAllListeners();
		this.cursors.space.removeAllListeners();
		this.enterKey.removeAllListeners();
		this.joystick.destroy();
		super.destroy();
	}
}
