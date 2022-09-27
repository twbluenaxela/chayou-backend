const puppeteer = require('puppeteer');

const teaWebsiteCrawler = async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('https://yunnansourcing.us/')
    const searchBox = "input[placeholder='What are you looking for?']"
    await page.waitForSelector(searchBox)
    await page.type(searchBox, 'it is i')
    // await page.screenshot({ path: 'exmaple.png' })
    await browser.close()
}

teaWebsiteCrawler()

module.exports = teaWebsiteCrawler

// (async () => {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto('https://example.com');
//     await page.screenshot({path: 'example.png'});
  
//     await browser.close();
//   })();