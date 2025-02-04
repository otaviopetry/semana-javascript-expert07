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

function buildRockAndRollGesture() {
    const gesture = new GestureDescription('rockAndRoll');
    const noCurlFingers = [Finger.Index, Finger.Pinky];
    const curlFingers = [Finger.Thumb, Finger.Middle, Finger.Ring];

    for (let finger of noCurlFingers) {
        gesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
        gesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 0.5);
    }

    for (let finger of curlFingers) {
        gesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
        gesture.addCurl(finger, FingerCurl.HalfCurl, 0.9);
    }

    return gesture;
}

function buildClickGesture() {
    const gesture = new GestureDescription('click');

    gesture.addCurl(Finger.Index, FingerCurl.HalfCurl, 0.8);
    gesture.addCurl(Finger.Index, FingerCurl.FullCurl, 0.5);

    gesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
    gesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.4);

    for (const finger of [Finger.Middle, Finger.Ring, Finger.Pinky]) {
        gesture.addCurl(finger, FingerCurl.HalfCurl, 1.0);
        gesture.addCurl(finger, FingerCurl.FullCurl, 0.9);
    }

    return gesture;
}

const ScrollDownGesture = buildScrollDownGesture(); // ✊️
const ScrollUpGesture = buildScrollUpGesture(); // 🖐
const RockAndRollGesture = buildRockAndRollGesture(); // 🤘
const ClickGesture = buildClickGesture(); // 🤏

const knownGestures = [
    ScrollDownGesture,
    ScrollUpGesture,
    RockAndRollGesture,
    ClickGesture,
];
const gestureStrings = {
    scrollDown: '✊️',
    scrollUp: '🖐',
    rockAndRoll: '🤘',
    click: '🤏',
};

export { knownGestures, gestureStrings };
