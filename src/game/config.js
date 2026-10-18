import Phaser from 'phaser';
import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';
import BBCodeTextPlugin from 'phaser3-rex-plugins/plugins/bbcodetext-plugin.js';
import { DEBUG } from './utils/debug.js';

import MainMenu from './scenes/MainMenu.js';
import PreLevel from './scenes/PreLevel.js';
import UIScene from './scenes/UIScene.js';
import Level0 from './scenes/Level0.js';
import Level1Prev from './scenes/Level1Prev.js';
import Level1 from './scenes/Level1.js';
import Level2Prev from './scenes/Level2Prev.js';
import Level2Prev2 from './scenes/Level2Prev2.js';
import Level2 from './scenes/Level2.js';
import Level3Prev from './scenes/Level3Prev.js';
import Level3Prev2 from './scenes/Level3Prev2.js';
import Level3Prev3 from './scenes/Level3Prev3.js';
import Level3 from './scenes/Level3.js';
import Level4 from './scenes/Level4.js';
import Level5 from './scenes/Level5.js';

// Portrait canvas scaled to fit the screen (designed for phones)
export default {
	type: Phaser.AUTO,
	width: 800,
	height: 1200,
	scale: { mode: Phaser.Scale.FIT },
	physics: {
		default: 'arcade',
		arcade: { gravity: { y: 1000 }, debug: DEBUG },
	},
	render: { antialias: false, pixelArt: true, roundPixels: true },
	plugins: {
		global: [
			{ key: 'rexvirtualjoystickplugin', plugin: VirtualJoystickPlugin, start: true },
			{ key: 'rexbbcodetextplugin', plugin: BBCodeTextPlugin, start: true },
		],
	},
	scene: [
		MainMenu, PreLevel, UIScene,
		Level0, Level1Prev, Level1, Level2Prev, Level2Prev2, Level2,
		Level3Prev, Level3Prev2, Level3Prev3, Level3, Level4, Level5,
	],
};
