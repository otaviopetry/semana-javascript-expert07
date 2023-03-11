import cardsFactory from './src/cardsFactory.js';
import handGestureFactory from '/libs/hand-gesture/handGestureFactory.js';

await cardsFactory.initialize();
await handGestureFactory.initialize();