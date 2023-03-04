class Controller {
    #view;
    #service;

    constructor({ view, service }) {
        this.#view = view;
        this.#service = service;

        this.#view.configureOnButtonClick(this.onButtonStart.bind(this));
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
