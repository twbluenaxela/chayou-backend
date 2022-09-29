const { JsonWebTokenError } = require("jsonwebtoken");
const teaWebsiteCrawler = require("../modules/teaWebsiteCrawler");

const yunnanSourcing = {
  url: "https://yunnansourcing.us/",
  searchUrl: "https://yunnansourcing.us/search?type=product&q=",
  searchBoxSelector: "input[placeholder='What are you looking for?']",
  searchButtonSelector: ".live-search-button",
  productGridSelector: ".products-per-row-4",
  productCardSelector: ".productitem",
  priceSelector: ".money.price__current--min",
  nameSelector: "a:not(.productitem--image-link)",
  descriptionSelector: ".productitem--description > p",
  popup: "",
};


const teaAndWhisk = {
  url: "https://teaandwhisk.com",
  searchUrl: "https://teaandwhisk.com/pages/search-results-page?q=",
  searchBoxSelector: "input[type='search']",
  searchButtonSelector: "div.input-group-btn > button",
  productGridSelector: "ul.snize-search-results-content",
  productCardSelector: "li",
  priceSelector: "span.snize-price",
  nameSelector: "span.snize-title",
  descriptionSelector: "",
  imgSelector: "img.snize-item-image",
  popup: "div.needsclick.kl-private-reset-css-Xuajs1",
  popupCloseButton: ".needsclick.klaviyo-close-form",
  searchPageLink: "https://teaandwhisk.com/search",
};

describe("searchdog can find teas", () => {
  test("that teawebsitecrawler can find oolong teas on yunnansourcing us website", async () => {
    const result = await teaWebsiteCrawler(yunnanSourcing, "oolong");
    expect(result[0].price).toBe("$14.00");
  }, 7000);
  test("that teawebsitecrawler can find tieguanyin teas on yunnansourcing us website", async () => {
    const result = await teaWebsiteCrawler(yunnanSourcing, "tieguanyin");
    expect(result[0].name).toContain("Tie Guan Yin");
  }, 7000);
  test("that teawebsitecrawler can find tieguanyin teas on teaandwhisk", async () => {
    const result = await teaWebsiteCrawler(teaAndWhisk, "tieguanyin");
    expect(result.length).toBe(2)
  }, 10000);
});
