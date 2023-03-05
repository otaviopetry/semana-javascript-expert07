const { GestureDescription, Finger, FingerCurl } = window.fp;

function buildScrollDownGesture() {
    const gesture = new GestureDescription('scrollDown');

    gesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
    gesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 0.5);

    for (let finger of [
        Finger.Index,
        Finger.Middle,
        Finger.Ring,
        Finger.Pinky,
    ]) {
        gesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
        gesture.addCurl(finger, FingerCurl.HalfCurl, 0.9);
    }

    return gesture;
}

function buildScrollUpGesture() {
    const gesture = new GestureDescription('scrollUp');

    for (let finger of Finger.all) {
        gesture.addCurl(finger, FingerCurl.NoCurl, 1.0);
    }

    return gesture;
}

const ScrollDownGesture = buildScrollDownGesture(); // ✊️
const ScrollUpGesture = buildScrollUpGesture(); // 🖐

const knownGestures = [ScrollDownGesture, ScrollUpGesture];
const gestureStrings = {
    scrollDown: '✊️',
    scrollUp: '🖐',
};

export { knownGestures, gestureStrings };
