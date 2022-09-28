const puppeteer = require("puppeteer");
const fs = require("fs");

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

// class teaWebsite = {
//     constructor(url, searchBoxSelector, searchButtonSelector, productGridSelector, productCardSelector, priceSelector, nameSelector, descriptionSelector) {
//         this.url = url;
//         this.searchBoxSelector = searchBoxSelector;
//         this.searchButtonSelector = searchButtonSelector;
//         this.productGridSelector = productGridSelector;
//         this.productCardSelector = productCardSelector;
//         this.priceSelector = priceSelector;
//         this.nameSelector = nameSelector;
//         this.descriptionSelector = descriptionSelector;
//     }
// }

// const yunnanSourcing = new teaWebsite("https://yunnansourcing.us/", "input[placeholder='What are you looking for?']", ".live-search-button", ".products-per-row-4")

const teaWebsiteCrawler = async (teaWebsite, searchTerm) => {
  const {
    url,
    searchBoxSelector,
    searchButtonSelector,
    productGridSelector,
    productCardSelector,
    priceSelector,
    nameSelector,
    descriptionSelector,
  } = teaWebsite;

  console.log("Is product card selector here? ", productCardSelector);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle0" });
  await page.waitForSelector(searchBoxSelector);
  await page.waitForSelector(searchButtonSelector);
  await page.type(searchBoxSelector, searchTerm);
  await page.click(searchButtonSelector);
  await page.waitForSelector(productGridSelector);
  const config = {
    productCardSelector,
    priceSelector,
    nameSelector,
    descriptionSelector
  }
  const scrapedTeas = await page.$eval(productGridSelector, (child, config) => {
    let results = Array.from(child.querySelectorAll(config.productCardSelector)).map(
      (el) => el.innerHTML
    );
    let teaObjectArray = results.map((product) => {
      /**
       * Problem: When grabbing the innerHTML for each element, the result given
       * back to us is a string. We cannot call querySelectors on strings.
       * So we have to change it back into an HTML element, then run querySelector on it.
       */
      const range = document.createRange();
      const fragment = range.createContextualFragment(product);
      let teaObject = {
        price: fragment.querySelector(config.priceSelector).textContent,
        name: fragment.querySelector(config.nameSelector).textContent.trim(),
        description: fragment
          .querySelector(config.descriptionSelector)
          .textContent.trim(),
      };
      return teaObject;
    });
    return teaObjectArray;
  }, config);
  // console.log('Raw HTML: ', rawHTMLOfProducts);
  console.log("First one: ", scrapedTeas[0]);
  console.log("Length: ", scrapedTeas.length);
  console.log("Type: ", typeof scrapedTeas);
  // fs.writeFileSync('rawHTMLOfProducts.json', rawHTMLOfProducts)
  // console.log('Type of: ', typeof rawHTMLOfProducts);
  await page.screenshot({ path: "exmaple.png" });
  await browser.close();
  return scrapedTeas
};

// teaWebsiteCrawler(yunnanSourcing, "tieguanyin");

module.exports = teaWebsiteCrawler;
