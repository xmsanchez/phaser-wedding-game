import Phaser from 'phaser'
import MainMenu from './scenes/MainMenu'
import PreLevel from './scenes/PreLevel'
import Level1 from './scenes/Level1'
import Level2Prev from './scenes/Level2Prev'
import Level2 from './scenes/Level2'
import Level3Prev from './scenes/Level3Prev'

const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 1200,
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
	scene: [ MainMenu, PreLevel, Level1, Level2Prev, Level2, Level3Prev ]
}

export default new Phaser.Game(config)
