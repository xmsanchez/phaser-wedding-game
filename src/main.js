import Phaser from 'phaser'

import Level1 from './scenes/Level1'

const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 1200,
    scale: {
        mode: Phaser.Scale.FIT,
    },
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 1000 }
		}
	},
	render: {
        antialias: false,
        pixelArt: true,
        roundPixels: true
    },
	scene: [Level1]
}

export default new Phaser.Game(config)
