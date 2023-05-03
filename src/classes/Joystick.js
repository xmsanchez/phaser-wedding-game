export default class Joystick {
    constructor(scene, x, y) {
        this.joystick = scene.plugins.get('rexvirtualjoystickplugin').add(scene, {
            x: x,
            y: y,
            radius: 50,
            base: scene.add.circle(0, 0, 50, 0x888888).setAlpha(0.3),
            thumb: scene.add.circle(0, 0, 25, 0xcccccc).setAlpha(0.3),
            dir: '8dir',
            forceMin: 5,
            enable: true
        });
    }

	createInteractButton = function (scene, x, y) {
		var btn = scene.add.circle(x, y, 50, 0x888888).setAlpha(0.3);
		btn.scrollFactorX = 0;
		btn.scrollFactorY = 0;

		// Enable touch input on the button
		btn.setInteractive();

		return btn;
	}

    createCursorKeys() {
        return this.joystick.createCursorKeys();
    }
}