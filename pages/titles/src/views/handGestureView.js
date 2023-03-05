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
}
