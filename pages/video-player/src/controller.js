class Controller {
    #view;
    #camera;
    #worker;
    #blinkCounter = 0;

    constructor({ view, camera, worker }) {
        this.#view = view;
        this.#camera = camera;
        this.#worker = this.#configureWorker(worker);

        this.#view.configureOnButtonClick(this.onButtonStart.bind(this));
    }

    #configureWorker(worker) {
        let ready = false;

        worker.onmessage = ({ data }) => {
            console.log('Worker message:', data);

            if (data === 'READY') {
                this.#view.enableButton();
                ready = true;

                return;
            }

            const blinked = data.blinked;

            console.log('Blinked:', blinked);
            this.#blinkCounter += blinked;
            this.#view.togglePlayVideo();
        };

        return {
            send(message) {
                console.log('Sending message to worker:', message);
                if (!ready) return;

                worker.postMessage(message);
            },
        };
    }

    static async initialize(deps) {
        const controller = new Controller(deps);

        controller.log(
            'Not yet detecting eye blink. Click on the button to start.',
        );

        return controller.init();
    }

    async init() {
        console.log('Controller initialized');
    }

    loop() {
        const video = this.#camera.video;
        const image = this.#view.getVideoFrame(video);

        this.#worker.send(image);
        this.log('Detecting eye blink...');

        setTimeout(() => this.loop(), 100);
    }

    log(text) {
        const times = `       - blinked times: ${ this.#blinkCounter }`;
        this.#view.log(`Status: ${text}`.concat(this.#blinkCounter ? times : ''));
    }

    onButtonStart() {
        this.log('Initializing detection...');
        this.#blinkCounter = 0;
        this.loop();
    }
}

export default Controller;
