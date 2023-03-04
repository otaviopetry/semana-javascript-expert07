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

    async handleBlinked(video) {
        const predictions = await this.#estimateFaces(video);

        console.log({ predictions });
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
