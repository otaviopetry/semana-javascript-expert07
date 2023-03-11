import 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core@4.2.0/dist/tf-core.min.js';
import 'https://unpkg.com/@tensorflow/tfjs-backend-webgl@3.7.0/dist/tf-backend-webgl.min.js';
import 'https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/hands.min.js';
import 'https://cdn.jsdelivr.net/npm/@tensorflow-models/hand-pose-detection@2.0.0/dist/hand-pose-detection.min.js';
import 'https://cdn.jsdelivr.net/npm/fingerpose@0.1.0/dist/fingerpose.min.js';

import HandGestureController from './handGestureController.js';
import HandGestureService from './handGestureService.js';
import HandGestureView from './handGestureView.js';

import Camera from '/libs/shared/camera.js';
import {
    fingerLookupIndexes,
    gestureStrings,
    knownGestures,
} from './util.js';

const styler = new PseudoStyler();
const camera = await Camera.init();

const factory = {
    async initialize() {
        return HandGestureController.initialize({
            view: new HandGestureView({
                fingerLookupIndexes,
                styler,
            }),
            service: new HandGestureService({
                fingerpose: window.fp,
                handPoseDetection: window.handPoseDetection,
                handsVersion: window.VERSION,
                knownGestures,
                gestureStrings,
            }),
            camera,
        });
    },
};

export default factory;
