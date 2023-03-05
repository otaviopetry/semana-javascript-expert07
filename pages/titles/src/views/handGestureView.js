export default class HandGestureView {
    #handsCanvas = document.querySelector('#hands');
    #canvasContext = this.#handsCanvas.getContext('2d');
    #fingerLookupIndexes;

    constructor({ fingerLookupIndexes }) {
        this.#handsCanvas.width = globalThis.screen.availWidth;
        this.#handsCanvas.height = globalThis.screen.availHeight;
        this.#fingerLookupIndexes = fingerLookupIndexes;
    }

    clear() {
        this.#canvasContext.clearRect(
            0,
            0,
            this.#handsCanvas.width,
            this.#handsCanvas.height,
        );
    }

    drawResults(hands) {
        for (const { keypoints, handedness } of hands) {
            if (!keypoints) continue;

            this.#canvasContext.fillStyle =
                handedness === 'Left' ? 'red' : 'green';
            this.#canvasContext.strokeStyle = 'white';
            this.#canvasContext.lineWidth = 8;
            this.#canvasContext.lineJoin = 'round';

            this.#drawJoints(keypoints);
            this.#drawFingersAndHoverElements(keypoints);
        }
    }

    #drawJoints(keypoints) {
        for (const { x, y } of keypoints) {
            this.#canvasContext.beginPath();
            const newX = x - 2;
            const newY = y - 2;
            const radius = 3;
            const startAngle = 0;
            const endAngle = 2 * Math.PI;

            this.#canvasContext.arc(newX, newY, radius, startAngle, endAngle);
            this.#canvasContext.fill();
        }
    }

    #drawFingersAndHoverElements(keypoints) {
        const fingers = Object.keys(this.#fingerLookupIndexes);

        for (const finger of fingers) {
            const fingerPoints = this.#fingerLookupIndexes[finger].map(
                (index) => keypoints[index],
            );
            const region = new Path2D();
            const [{ x, y }] = fingerPoints;

            region.moveTo(x, y);

            for (const point of fingerPoints) {
                region.lineTo(point.x, point.y);
            }

            this.#canvasContext.stroke(region);
        }
    }

    loop(fn) {
        requestAnimationFrame(fn);
    }

    scrollPage(top) {
        console.log('scrolling to:', top);
        scroll({
            top,
            behavior: 'smooth',
        });
    }

    addRockAndRollOverlay() {
        const overlay = document.createElement('div');
        overlay.classList.add('rock-and-roll-overlay');
        overlay.innerHTML = '666';
        document.body.appendChild(overlay);
    }
}
