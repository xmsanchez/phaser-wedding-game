import Phaser from 'phaser'
import MainMenu from './scenes/MainMenu'
import PreLevel from './scenes/PreLevel'
import UIScene from './scenes/UIScene'
import Level0 from './scenes/Level0'
import Level1Prev from './scenes/Level1Prev'
import Level1 from './scenes/Level1'
import Level2Prev from './scenes/Level2Prev'
import Level2 from './scenes/Level2'
import Level3Prev from './scenes/Level3Prev'
import Level3 from './scenes/Level3'
import Level4Prev from './scenes/Level4Prev'
import Level4 from './scenes/Level4'

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
			gravity: { y: 1000 },
			// debug: true
		}
	},
	render: {
        antialias: false,
        pixelArt: true,
        roundPixels: true
    },
	scene: [ 
		MainMenu,
		PreLevel,
		UIScene,
		Level0,
		Level1Prev,
		Level1,
		Level2Prev,
		Level2,
		Level3Prev,
		Level3,
		Level4Prev,
		Level4,
	]
}

export default new Phaser.Game(config)
