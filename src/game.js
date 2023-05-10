import Phaser from 'phaser'
import MainMenu from './scenes/MainMenu'
import Level1 from './scenes/Level1'
import Level2 from './scenes/Level2'

const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 1200,
	// width: window.innerWidth,
	// height: window.innerHeight,
    scale: {
        // mode: Phaser.Scale.ENVELOP,
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
	scene: [ MainMenu, Level1, Level2 ]
}

export default new Phaser.Game(config)
