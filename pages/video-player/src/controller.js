class Controller {
    static async initialize(deps) {
        const controller = new Controller(deps);

        return controller.init();
    }

    async init() {
        console.log('Controller initialized');
    }
}

export default Controller;
