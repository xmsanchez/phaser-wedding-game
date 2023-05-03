import Phaser from 'phaser'
import MainMenu from './scenes/MainMenu'
import Level1 from './scenes/Level1'

const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 1200,
	// width: window.innerWidth,
	// height: window.innerHeight,
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
	scene: [ MainMenu, Level1 ]
}

export default new Phaser.Game(config)
