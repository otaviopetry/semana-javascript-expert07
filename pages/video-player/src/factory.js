import Camera from '../../../libs/shared/camera.js';
import { supportsWorkerType } from '../../../libs/shared/util.js';
import Controller from './controller.js';
import Service from './service.js';
import View from './view.js';

async function getWorker() {
    if (supportsWorkerType()) {
        console.log('Supports Worker Type');

        const worker = new Worker('./src/worker.js', { type: 'module' });

        return worker;
    }

    console.log('Does not support Worker Type');

    const workerMock = {
        async postMessage() {},
        onmessage(message) {},
    };

    return workerMock;
}

const worker = await getWorker();
worker.postMessage('Hey from factory');

const camera = await Camera.init();

const factory = {
    async initialize() {
        return Controller.initialize({
            view: new View(),
            camera,
            worker,
        });
    },
};

export default factory;
