const { JsonWebTokenError } = require('jsonwebtoken');
const teaWebsiteCrawler = require('../modules/searchDog')

const yunnanSourcing = {
    url: "https://yunnansourcing.us/",
    searchBoxSelector: "input[placeholder='What are you looking for?']",
    searchButtonSelector: ".live-search-button",
    productGridSelector: ".products-per-row-4",
    productCardSelector: ".productitem",
    priceSelector: ".money.price__current--min",
    nameSelector: "a:not(.productitem--image-link)",
    descriptionSelector: ".productitem--description > p",
    listOfTeas: [],
  };

describe('searchdog can find teas', () => {
    test('that searchdog can find oolong teas on yunnansourcing us website', async () => {
        const result = await teaWebsiteCrawler(yunnanSourcing, 'oolong')
        expect(result[0].price).toBe('$12.50')
    }, 6000)
    test('that searchdog can find tieguanyin teas on yunnansourcing us website', async () => {
        const result = await teaWebsiteCrawler(yunnanSourcing, 'tieguanyin')
        expect(result[0].name).toContain('Anxi')
    }, 6000)
})