const puppeteer = require('puppeteer');
const fs = require('fs')

const yunnanSourcing = {
    url: "https://yunnansourcing.us/",
    searchBoxSelector: "input[placeholder='What are you looking for?']",
    searchButtonSelector: ".live-search-button",
    productGridSelector: ".products-per-row-4",
    productCardSelector: ".productitem",
    priceSelector: ".money.price__current--min",
    nameSelector:"a:not(.productitem--image-link)",
    descriptionSelector: ".productitem--description > p",
    listOfTeas: [],
}

const teaWebsiteCrawler = async (teaWebsite, searchTerm) => {

    const { 
        url, 
        searchBoxSelector, 
        searchButtonSelector, 
        productGridSelector, 
        productCardSelector,
        priceSelector,
        nameSelector,
        descriptionSelector } = teaWebsite

        console.log('Is product card selector here? ', productCardSelector);
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    await page.goto(url, {"waitUntil" : "networkidle0"})
    // const searchBox = "input[placeholder='What are you looking for?']"
    // const searchButton = ".live-search-button"
    await page.waitForSelector(searchBoxSelector)
    await page.waitForSelector(searchButtonSelector)
    await page.type(searchBoxSelector, searchTerm)
    await page.click(searchButtonSelector)
    // await page.waitForNavigation({ waitUntil: 'networkidle0' })
    await page.waitForSelector(productGridSelector)
    const rawHTMLOfProducts = await page.$eval(productGridSelector, (child => {
        // let dom = document.querySelector('.productitem')
        let results = Array.from(child.querySelectorAll(productCardSelector))
        .map(el => el.innerHTML)
        let teaObjectArray = results.map((product) => {
            /**
             * Problem: When grabbing the innerHTML for each element, the result given
             * back to us is a string. We cannot call querySelectors on strings.
             * So we have to change it back into an HTML element, then run querySelector on it.
             */
            const range = document.createRange()
            const fragment = range.createContextualFragment(product)
            let teaObject = {
                price: fragment.querySelector(priceSelector).textContent,
                name: fragment.querySelector(nameSelector).textContent.trim(),
                description: fragment.querySelector(descriptionSelector).textContent.trim()
            }
            return teaObject
        })
        // console.log('Child: ', child);
        return teaObjectArray
    }))
    // console.log('Raw HTML: ', rawHTMLOfProducts);
    console.log('First one: ', rawHTMLOfProducts[0]);
    console.log('Length: ', rawHTMLOfProducts.length);
    console.log('Type: ', typeof rawHTMLOfProducts);
    // fs.writeFileSync('rawHTMLOfProducts.json', rawHTMLOfProducts)
    // console.log('Type of: ', typeof rawHTMLOfProducts);
    // const placeholder = document.createElement('div')
    // placeholder.innerHTML = rawHTMLOfProducts
    // const teaList = placeholder.querySelector('.productitem')
    // fs.writeFileSync('teaListLog.html', teaList)
    //I've heard its better to use a regular for loop instead of mapping when you need async actions. So thats why Im using a for loop
    // console.log('Tea list:  ', teaList)
    await page.screenshot({ path: 'exmaple.png' })
    //TODO: make it so that the objects are passed as parameters with information such as searchBox selectors, searchButton selectors, etc.
    await browser.close()
}

teaWebsiteCrawler(yunnanSourcing, 'oolong')

module.exports = teaWebsiteCrawler

// (async () => {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto('https://example.com');
//     await page.screenshot({path: 'example.png'});
  
//     await browser.close();
//   })();