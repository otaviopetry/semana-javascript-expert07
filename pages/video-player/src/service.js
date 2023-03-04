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
}

export default Service;
