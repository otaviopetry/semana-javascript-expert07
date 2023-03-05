export default class HandGestureController {
    #view;
    #service;
    #camera;

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
            for await (const { event, x, y } of this.#service.detectGestures(
                hands,
            )) {
                console.log({ event, x, y });
            }
        } catch (error) {
            console.error('Oh no, something terrible has happened:', error);
        }
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
