import Camera from '../../../libs/shared/camera.js';
import { supportsWorkerType } from '../../../libs/shared/util.js';
import Controller from './controller.js';
import Service from './service.js';
import View from './view.js';

const camera = await Camera.init();
const worker = await getWorker();
worker.postMessage('Hey from factory');

const [rootPath] = window.location.href.split('/pages/');

const factory = {
    async initialize() {
        return Controller.initialize({
            view: new View(),
            camera,
            worker,
            videoUrl: `${rootPath}/assets/video.mp4`,
        });
    },
};

export default factory;

async function getWorker() {
    if (supportsWorkerType()) {
        console.log('Initializing ESM Workers');

        const worker = new Worker('./src/worker.js', { type: 'module' });

        return worker;
    }

    return await getFallbackWorker();
}

async function getFallbackWorker() {
    console.warn('Your browser does not support ESM modules on webworkers.');
    console.log('Importing libraries...');

    await import(
        'https://unpkg.com/@tensorflow/tfjs-core@2.4.0/dist/tf-core.js'
    );
    await import(
        'https://unpkg.com/@tensorflow/tfjs-converter@2.4.0/dist/tf-converter.js'
    );
    await import(
        'https://unpkg.com/@tensorflow/tfjs-backend-webgl@2.4.0/dist/tf-backend-webgl.js'
    );
    await import(
        'https://unpkg.com/@tensorflow-models/face-landmarks-detection@0.0.1/dist/face-landmarks-detection.js'
    );

    console.warn('Using mocked worker instead.');
    const service = new Service({
        faceLandmarksDetection: window.faceLandmarksDetection,
    });
    const workerMock = {
        async postMessage(video) {
            if (typeof video === 'string') return;

            const blinked = await service.handleBlinked(video);

            if (!blinked) return;

            workerMock.onmessage({ data: { blinked } });
        },
        // will be overwritten by controller
        onmessage(message) {},
    };
    console.log('Loading Tensorflow model...');
    await service.loadModel();
    console.log('Tensorflow model loaded!');

    setTimeout(() => worker.onmessage({ data: 'READY' }), 1000);

    return workerMock;
}
