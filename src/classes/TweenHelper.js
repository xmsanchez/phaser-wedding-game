// This class is used to "flash" the text on the MainMenu
export default class TweenHelper {
    static flashElement(scene, element, repeat = true, easing = 'Linear', overallDuration = 1500, visiblePauseDuration = 500) {
        if (scene && element) {
            let flashDuration = overallDuration - visiblePauseDuration / 2;

            scene.tweens.add({
                targets: element,
                alpha: 0.3,
                duration: 500,
                ease: 'Exponential',
                yoyo: true,
                repeat: -1
            });
        }
    }
}