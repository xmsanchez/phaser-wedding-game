export default class Joystick {
    constructor(scene, x, y) {
        this.joystick = scene.plugins.get('rexvirtualjoystickplugin').add(scene, {
            x: x,
            y: y,
            radius: 150,
            base: scene.add.circle(0, 0, 150, 0x888888).setAlpha(0.3),
            thumb: scene.add.circle(0, 0, 90, 0xcccccc).setAlpha(0.3),
            dir: '4dir',
            forceMin: 5,
            enable: true
        });

        this.interactBtnText = '';
        this.jumpBtnText = '';
    }

	createJumpButton = function (scene, x, y) {
		var btn = scene.add.circle(x, y, 120, 0x008000).setAlpha(0.3);
		btn.scrollFactorX = 0;
		btn.scrollFactorY = 0;

        // Add text to the circle
        var textStyle = {
            font: '70px Arial',
            fill: '#ffffff'
        };
        this.interactBtnText = 'A';
        var textElement = scene.add.text(x, y, this.interactBtnText, textStyle).setOrigin(0.5);
        textElement.scrollFactorX = 0;
        textElement.scrollFactorY = 0;

        // Enable touch input on the button
        btn.setInteractive();

        // Create a container to group the circle and text
        var container = scene.add.container(0, 0, [btn, textElement]);
        container.setSize(btn.width, btn.height);

        // Enable touch input on the container
        container.setInteractive({ useHandCursor: true });

		return btn;
	}

	createInteractButton = function (scene, x, y) {
		var btn = scene.add.circle(x, y, 70, 0xFF0000).setAlpha(0.3);
		btn.scrollFactorX = 0;
		btn.scrollFactorY = 0;

        // Add text to the circle
        var textStyle = {
            font: '50px Arial',
            fill: '#ffffff'
        };
        this.jumpBtnText = 'B';
        var textElement = scene.add.text(x, y, this.jumpBtnText, textStyle).setOrigin(0.5);
        textElement.scrollFactorX = 0;
        textElement.scrollFactorY = 0;

        // Enable touch input on the button
        btn.setInteractive();

        // Create a container to group the circle and text
        var container = scene.add.container(0, 0, [btn, textElement]);
        container.setSize(btn.width, btn.height);

        // Enable touch input on the container
        container.setInteractive({ useHandCursor: true });

		return btn;
	}

    createCursorKeys() {
        return this.joystick.createCursorKeys();
    }
}