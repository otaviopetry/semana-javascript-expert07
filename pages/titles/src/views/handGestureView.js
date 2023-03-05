export default class HandGestureView {
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
