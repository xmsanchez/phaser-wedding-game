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

            // scene.tweens.add({
            //     tweens: [
            //         {
            //             targets: element,
            //             duration: 0,
            //             alpha: 0,
            //             ease: easing
            //         },
            //         {
            //             targets: element,
            //             duration: flashDuration,
            //             alpha: 1,
            //             ease: easing
            //         },
            //         {
            //             targets: element,
            //             duration: visiblePauseDuration,
            //             alpha: 1,
            //             ease: easing
            //         },
            //         {
            //             targets: element,
            //             duration: flashDuration,
            //             alpha: 0,
            //             ease: easing,
            //             onComplete: () => {
            //                 if (repeat === true) {
            //                     this.flashElement(scene, element);
            //                 }
            //             }
            //         }
            //     ]
            // });
        }
    }
}