import { knownGestures, gestureStrings } from '../util/gestures.js';

export default class HandGestureService {
    #gestureEstimator;
    #handPoseDetection;
    #handsVersion;
    #detector = null;

    constructor({ fingerpose, handPoseDetection, handsVersion }) {
        this.#gestureEstimator = new fingerpose.GestureEstimator(knownGestures);
        this.#handPoseDetection = handPoseDetection;
        this.#handsVersion = handsVersion;
    }

    async estimate(keypoints3D) {
        const predictions = await this.#gestureEstimator.estimate(
            this.#getLandmarksFromKeypoints(keypoints3D),
            9,
        );

        return predictions.gestures;
    }

    async *detectGestures(predictions) {
        for (const hand of predictions) {
            if (!hand.keypoints3D) continue;

            const gestures = await this.estimate(hand.keypoints3D);

            if (!gestures.length) continue;

            const result = gestures.reduce((previous, current) => {
                return previous.score > current.score ? previous : current;
            });

            console.log('detected:', gestureStrings[result.name]);
        }
    }

    #getLandmarksFromKeypoints(keypoints3D) {
        return keypoints3D.map((keypoint) => [
            keypoint.x,
            keypoint.y,
            keypoint.z,
        ]);
    }

    async estimateHands(video) {
        return this.#detector.estimateHands(video, {
            flipHorizontal: true,
        });
    }

    async initializeDetector() {
        if (this.#detector) return this.#detector;

        const detectorConfig = {
            runtime: 'mediapipe',
            solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/hands@${
                this.#handsVersion
            }`,
            // full é preciso mas pesado
            modelType: 'lite',
            maxHands: 2,
        };
        this.#detector = await this.#handPoseDetection.createDetector(
            this.#handPoseDetection.SupportedModels.MediaPipeHands,
            detectorConfig,
        );

        return this.#detector;
    }
}
