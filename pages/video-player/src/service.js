import { prepareRunChecker } from "../../../libs/shared/util.js";

const { shouldRun } = prepareRunChecker({ timerDelay: 500 });

const EYELID_DISTANCE_THRESHOLD = 0.23;

class Service {
    #model;
    #faceLandmarkDetections;

    constructor({ faceLandmarksDetection }) {
        this.#faceLandmarkDetections = faceLandmarksDetection;
    }

    async loadModel() {
        this.#model = await this.#faceLandmarkDetections.load(
            this.#faceLandmarkDetections.SupportedPackages.mediapipeFacemesh,
            { maxFaces: 1 },
        );
    }

    #getEyelidsDistance(upper, lower) {
        function getEucledianDistance(x1, y1, x2, y2) {
            return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
        }

        return (
            (getEucledianDistance(
                upper[5][0],
                upper[5][1],
                lower[4][0],
                lower[4][1],
            ) +
            getEucledianDistance(
                upper[3][0],
                upper[3][1],
                lower[2][0],
                lower[2][1],
            )) /
            (2 * getEucledianDistance(
                upper[0][0],
                upper[0][1],
                upper[8][0],
                upper[8][1],
            ))
        );
    }

    async handleBlinked(video) {
        const predictions = await this.#estimateFaces(video);

        // console.log('Predictions: ', predictions);

        if (!predictions.length) return false;
        
        for (const prediction of predictions) {
            // Right eye parameters
            const lowerRight = prediction.annotations.rightEyeUpper0;
            const upperRight = prediction.annotations.rightEyeLower0;
            const rightEyelidsDistance = this.#getEyelidsDistance(upperRight, lowerRight);
            // Left eye parameters
            const lowerLeft = prediction.annotations.leftEyeUpper0;
            const upperLeft = prediction.annotations.leftEyeLower0;
            const leftEyelidsDistance = this.#getEyelidsDistance(upperLeft, lowerLeft);

            // True if the eye is closed
            const blinkedLeft = leftEyelidsDistance <= EYELID_DISTANCE_THRESHOLD;
            const blinkedRight = rightEyelidsDistance <= EYELID_DISTANCE_THRESHOLD;
                
            if (!blinkedLeft && !blinkedRight) continue;
            if (!shouldRun()) continue;
            
            return {
                blinkedLeft,
                blinkedRight,
            };
        }

        return false;
    }

    #estimateFaces(video) {
        return this.#model.estimateFaces({
            input: video,
            returnTensors: false,
            flipHorizontal: true,
            predictIrises: true,
        });
    }
}

export default Service;
