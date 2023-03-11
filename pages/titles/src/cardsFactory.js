import CardsController from './cardsController.js';
import CardsView from './cardsView.js';
import CardsService from './cardsService.js';

const [rootPath] = window.location.href.split('/pages/');
const factory = {
    async initialize() {
        return CardsController.initialize({
            view: new CardsView(),
            service: new CardsService({
                dbUrl: `${rootPath}/assets/database.json`,
            }),
        });
    },
};

export default factory;
