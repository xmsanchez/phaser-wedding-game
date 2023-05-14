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

	createJumpButton = function (scene, x, y) {
		var btn = scene.add.circle(x, y, 50, 0x008000).setAlpha(0.3);
		btn.scrollFactorX = 0;
		btn.scrollFactorY = 0;

        // Add text to the circle
        var textStyle = {
            font: '38px Arial',
            fill: '#ffffff'
        };
        var text = 'A';
        var textElement = scene.add.text(x, y, text, textStyle).setOrigin(0.5);
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

    // This is to display on messages
    createButtonIcon = function (scene, x, y, buttonText) {
        var btn = scene.add.circle(x, y, 10, 0xFF0000).setAlpha(0.3);
		btn.scrollFactorX = 0;
		btn.scrollFactorY = 0;

        // Add text to the circle
        var textStyle = {
            font: '24px Arial',
            fill: '#ffffff'
        };
        var text = buttonText;
        var textElement = scene.add.text(x, y, text, textStyle).setOrigin(0.5);
        textElement.scrollFactorX = 0;
        textElement.scrollFactorY = 0;
    }

	createInteractButton = function (scene, x, y) {
		var btn = scene.add.circle(x, y, 20, 0xFF0000).setAlpha(0.3);
		btn.scrollFactorX = 0;
		btn.scrollFactorY = 0;

        // Add text to the circle
        var textStyle = {
            font: '24px Arial',
            fill: '#ffffff'
        };
        var text = 'B';
        var textElement = scene.add.text(x, y, text, textStyle).setOrigin(0.5);
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