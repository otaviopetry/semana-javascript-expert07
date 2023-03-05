export default class HandGestureView {
    #handsCanvas = document.querySelector('#hands');
    #canvasContext = this.#handsCanvas.getContext('2d');

    constructor() {
        this.#handsCanvas.width = globalThis.screen.availWidth;
        this.#handsCanvas.height = globalThis.screen.availHeight;
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
            console.log({ handedness });
            if (!keypoints) continue;

            this.#canvasContext.fillStyle =
                handedness === 'Left' ? 'red' : 'green';
            this.#canvasContext.strokeStyle = 'white';
            this.#canvasContext.lineWidth = 8;
            this.#canvasContext.lineJoin = 'round';

            this.#drawJoints(keypoints);
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
