const puppeteer = require("puppeteer");
const fs = require("fs");

// const { DEFAULT_INTERCEPT_RESOLUTION_PRIORITY } = require('puppeteer')
// const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
// puppeteer.use(
//   AdblockerPlugin({
//     // Optionally enable Cooperative Mode for several request interceptors
//     interceptResolutionPriority: DEFAULT_INTERCEPT_RESOLUTION_PRIORITY
//   })
// )

const yunnanSourcing = {
  url: "https://yunnansourcing.us",
  searchUrl: "https://yunnansourcing.us/search?type=product&q=",
  searchBoxSelector: "input[placeholder='What are you looking for?']",
  searchButtonSelector: ".live-search-button",
  productGridSelector: ".products-per-row-4",
  productCardSelector: ".productitem",
  priceSelector: ".money.price__current--min",
  nameSelector: "a:not(.productitem--image-link)",
  descriptionSelector: ".productitem--description > p",
  imgSelector: "",
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

// const yunnanSourcing = new teaWebsite("https://yunnansourcing.us/", "input[placeholder='What are you looking for?']", ".live-search-button", ".products-per-row-4")

const teaWebsiteCrawler = async (teaWebsite, searchTerm) => {
  const {
    url,
    searchUrl,
    searchBoxSelector,
    searchButtonSelector,
    productGridSelector,
    productCardSelector,
    priceSelector,
    nameSelector,
    descriptionSelector,
    popup,
    popupCloseButton,
    searchPageLink,
    imgSelector,
  } = teaWebsite;

  // console.log("Is product card selector here? ", productCardSelector);
  //{ headless: false, devtools: true }
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setUserAgent(
       'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36');
  await page.goto(`${searchUrl}${searchTerm}*`, { waitUntil: "networkidle0" });
  if (popup !== "" && popup !== undefined) {
    // console.log('There is a popup! ', popup);
    await page.waitForSelector(popupCloseButton);
    // await page.keyboard.press('Escape')
    await page.click(popupCloseButton);
    // await page.click(searchButtonSelector)
    // page.on('dialog', async dialog => {
    //   console.log(dialog.message());
    //   await dialog.dismiss();
    // });
  }
  // await page.waitForSelector(searchBoxSelector);
  // console.log('Found search box!');
  // await page.waitForSelector(searchButtonSelector);
  // await page.type(searchBoxSelector, searchTerm);
  // await page.click(searchButtonSelector);
  await page.waitForSelector(productGridSelector);
  // await page.waitForSelector(productCardSelector)
  const config = {
    productCardSelector,
    priceSelector,
    nameSelector,
    descriptionSelector,
    imgSelector
  };
  await page.waitForSelector(productCardSelector)
  const scrapedTeas = await page.$eval(
    productGridSelector,
    (child, config) => {
      debugger;
      let results = Array.from(
        child.querySelectorAll(config.productCardSelector)
      ).map((el) => el.innerHTML);
      console.log('Results: ', results)
      let teaObjectArray = results.map((product) => {
        /**
         * Problem: When grabbing the innerHTML for each element, the result given
         * back to us is a string. We cannot call querySelectors on strings.
         * So we have to change it back into an HTML element, then run querySelector on it.
         */
        // const range = document.createRange();
        // const fragment = range.createContextualFragment(product);
        const parser = new DOMParser()
        const fragment = parser.parseFromString(product, 'text/html')
        const errorNode = fragment.querySelector('parsererror')
        if(errorNode) {
          alert('Error!')
        }
        console.log('Price: ', fragment.querySelector(config.priceSelector).textContent)
        console.log('Name: ', fragment.querySelector(config.nameSelector).textContent.trim());
        // console.log('Description: ', fragment
        // .querySelector(config.descriptionSelector)
        // .textContent.trim());
        let teaObject = {
          price: fragment.querySelector(config.priceSelector).textContent,
          name: fragment.querySelector(config.nameSelector).textContent.trim(),
          description: config.descriptionSelector !== "" 
          ? fragment
          .querySelector(config.descriptionSelector)
          .textContent.trim()
          : "",
          imageLink: fragment.querySelector(config.imgSelector).src
        };
        // console.log('Tea object: ', teaObject)
        return teaObject;
      });
      return teaObjectArray;
    },
    config
  );
  // console.log('Scraped Teas: ', scrapedTeas);
  console.log("First one: ", scrapedTeas[0]);
  console.log("Length: ", scrapedTeas.length);
  console.log("Type: ", typeof scrapedTeas);
  await browser.close();
  return scrapedTeas;
};

// teaWebsiteCrawler(teaAndWhisk, "tieguanyin");

module.exports = teaWebsiteCrawler;
