import { prepareRunChecker } from '/libs/shared/util.js';

const { shouldRun: shouldRunScroll } = prepareRunChecker({ timerDelay: 400 });
const { shouldRun: shouldRunClick } = prepareRunChecker({ timerDelay: 2000 });
export default class HandGestureController {
    #view;
    #service;
    #camera;
    #lastDirection = {
        direction: '',
        y: 0,
    };
    #hasAddedOverlay = false;

    constructor({ view, service, camera }) {
        this.#view = view;
        this.#service = service;
        this.#camera = camera;
    }

    async init() {
        return this.#loop();
    }

    async #estimateHands() {
        try {
            const hands = await this.#service.estimateHands(this.#camera.video);

            this.#view.clear();

            if (hands && hands.length) {
                this.#view.drawResults(hands);
            }

            for await (const { event, x, y } of this.#service.detectGestures(
                hands,
            )) {
                if (event === 'click') {
                    if (!shouldRunClick()) continue;

                    this.#view.clickOnElement(x, y);

                    continue;
                }

                if (event.includes('scroll')) {
                    if (!shouldRunScroll()) continue;

                    this.#scrollPage(event);
                }

                // easteregg
                // if (event === 'rockAndRoll' && !this.#hasAddedOverlay) {
                //     this.#view.addRockAndRollOverlay();
                //     this.#hasAddedOverlay = true;
                // }
            }
        } catch (error) {
            console.error('Oh no, something terrible has happened:', error);
        }
    }

    #scrollPage(direction) {
        this.#resolveLastDirection(direction);
        this.#view.scrollPage(this.#lastDirection.y);
    }

    #resolveLastDirection(direction) {
        const pixelsPerScroll = 400;

        if (this.#lastDirection.direction === direction) {
            console.log({ direction });

            this.#lastDirection.y =
                direction === 'scrollDown'
                    ? this.#lastDirection.y + pixelsPerScroll
                    : this.#lastDirection.y - pixelsPerScroll;

            return;
        }

        this.#lastDirection.direction = direction;
    }

    async #loop() {
        await this.#service.initializeDetector();
        await this.#estimateHands();
        await this.#view.loop(this.#loop.bind(this));
    }

    static async initialize(deps) {
        const controller = new HandGestureController(deps);

        return controller.init();
    }
}
