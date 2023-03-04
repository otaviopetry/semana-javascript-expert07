class Controller {
    #view;
    #service;
    #worker;

    constructor({ view, service, worker }) {
        this.#view = view;
        this.#service = service;
        this.#worker = this.#configureWorker(worker);

        this.#view.configureOnButtonClick(this.onButtonStart.bind(this));
    }

    #configureWorker(worker) {
        worker.onmessage = (message) => {
            console.log('Worker message:', message.data);

            if (message.data === 'READY') {
                this.#view.enableButton();

                return;
            }
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
    }
}

export default Controller;
