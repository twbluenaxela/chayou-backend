const puppeteer = require("puppeteer");
const fs = require("fs");

const yunnanSourcing = {
  url: "https://yunnansourcing.us",
  searchUrl: "https://yunnansourcing.us/search?type=product&q=",
  productUrlSelector: "h2 > a",
  searchBoxSelector: "input[placeholder='What are you looking for?']",
  searchButtonSelector: ".live-search-button",
  productGridSelector: ".products-per-row-4",
  productCardSelector: ".productitem",
  priceSelector: ".money.price__current--min",
  nameSelector: "a:not(.productitem--image-link)",
  descriptionSelector: ".productitem--description > p",
  imgSelector: "img.productitem--image-primary",
  popup: "",
  popupCloseButton: "",
};

const teaAndWhisk = {
  url: "https://teaandwhisk.com",
  searchUrl: "https://teaandwhisk.com/pages/search-results-page?q=",
  productUrlSelector: ".snize-view-link",
  searchBoxSelector: "input[type='search']",
  searchButtonSelector: "div.input-group-btn > button",
  productGridSelector: "ul.snize-search-results-content",
  productCardSelector: "li",
  priceSelector: "span.snize-price",
  nameSelector: "span.snize-title",
  descriptionSelector: "",
  imgSelector: "img.snize-item-image",
  popup: "div.needsclick.kl-private-reset-css-Xuajs1",
  popupCloseButton: ".needsclick.klaviyo-close-form"
};

//So I think it would probably be in my best interests to just make a class that has all the parameters I need, every single time. But I haven't decided on it yet, because I would also
//need to remember exactly in what order to put everything in anyway as well, so it doesn't make it more convenient imo.
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


const teaWebsiteCrawler = async (teaWebsite, searchTerm) => {
  const {
    url,
    searchUrl,
    productUrlSelector,
    productGridSelector,
    productCardSelector,
    priceSelector,
    nameSelector,
    descriptionSelector,
    popup,
    popupCloseButton,
    imgSelector,
  } = teaWebsite;

  //{ headless: false, devtools: true }
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
  ]
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36');
  await page.goto(`${searchUrl}${searchTerm}`, { waitUntil: "networkidle0" });
  if (popup !== "" && popup !== undefined) {
    await page.waitForSelector(popupCloseButton);
    await page.click(popupCloseButton);
  }
  try {
    await page.waitForSelector(productGridSelector, { timeout: 2500 });
  }catch(error) {
    console.log('Error!', error)
    return []
  }

  /**
   * Problem: we cannot directly use the selectors already imported from the teaWebsite object directly into puppeteers 
   * $eval function, because it is running in an entirely seperate environment, the headless browser.
   * Solution: put all the selectors in an object, then pass that object as an argument into the callback function argument. 
   * From there you can use your previously defined selectors, and get the data you want. 
   */
  const config = {
    productCardSelector,
    priceSelector,
    nameSelector,
    descriptionSelector,
    imgSelector,
    productUrlSelector,
  };
  await page.waitForSelector(productCardSelector)
  const scrapedTeas = await page.$eval(
    productGridSelector,
    (child, config) => {
      debugger;
      let results = Array.from(
        child.querySelectorAll(config.productCardSelector)
      ).map((el) => el.innerHTML);
      // console.log('Results: ', results)
      let teaObjectArray = results.map((product) => {
        /**
         * Problem: When grabbing the innerHTML for each element, the result given
         * back to us is a string. We cannot call querySelectors on strings.
         * So we have to change it back into an HTML element, then run querySelector on it.
         */
        const parser = new DOMParser()
        const fragment = parser.parseFromString(product, 'text/html')
        // console.log('Price: ', fragment.querySelector(config.priceSelector).textContent)
        // console.log('Name: ', fragment.querySelector(config.nameSelector).textContent.trim());
        /**
         * Problem: Sometimes a website may not have a description for each tea. They might only have an image, name, and price.
         * That is fine, but if the querySelector function takes "" as an argument, it will get mad and won't let you continue. 
         * Solution: Check if the descriptionSelector is blank or not, and then assign it a value, or keep it blank by default. 
         */
        let teaObject = {
          price: fragment.querySelector(config.priceSelector).textContent,
          name: fragment.querySelector(config.nameSelector).textContent.trim(),
          description: config.descriptionSelector !== "" 
          ? fragment
          .querySelector(config.descriptionSelector)
          .textContent.trim()
          : "",
          imageLink: fragment.querySelector(config.imgSelector).src,
          productUrl: fragment.querySelector(config.productUrlSelector).href,
        };
        // console.log('Tea object: ', teaObject)
        return teaObject;
      });
      return teaObjectArray;
    },
    config
  );
  // console.log('Scraped Teas: ', scrapedTeas);
  // console.log("First one: ", scrapedTeas[0]);
  // console.log("Length: ", scrapedTeas.length);
  // console.log("Type: ", typeof scrapedTeas);
  await browser.close();
  return scrapedTeas;
};

// teaWebsiteCrawler(teaAndWhisk, "tieguanyin");

module.exports = teaWebsiteCrawler;
