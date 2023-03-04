class Controller {
    #view;
    #service;
    #worker;
    #blinkCounter = 0;

    constructor({ view, service, worker }) {
        this.#view = view;
        this.#service = service;
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
            this.#blinkCounter += blinked;
            console.log('Blinked:', blinked);
        };

        return worker;
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

    log(text) {
        this.#view.log(`Status: ${text}`);
    }

    onButtonStart() {
        this.log('Initializing detection...');
        this.#blinkCounter = 0;
    }
}

export default Controller;
