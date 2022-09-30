const teaRouter = require("express").Router();
const Tea = require("../models/tea");
const logger = require("../utils/logger");
const middleware = require("../utils/middleware");
const teaWebsiteCrawler = require("../modules/teaWebsiteCrawler");

//TEMPORARY:
/**
 * TODO: Pull the tea websites and their info from mongodb.
 * For simplicity purposes and testing I am just including them here as plain objects
 */

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
  popupCloseButton: ".needsclick.klaviyo-close-form",
};

teaRouter.get("/", async (request, response) => {
  logger.info("Hello!");
  const teaList = await Tea.find({});
  console.log(teaList);
  response.json(teaList);
});

teaRouter.get("/:teaToSearchFor", async (request, response) => {
  const teaToSearchFor = request.params["teaToSearchFor"];
  //replaces underscores with space
  const formattedSearchTerm = teaToSearchFor.replace(/_/g, '%20')
  const humanReadableSearchTerm = teaToSearchFor.replace(/_/g, ' ')
  logger.info(`Searching for: ${humanReadableSearchTerm}`);

  const yunnanSourcingResults = await teaWebsiteCrawler(yunnanSourcing, formattedSearchTerm)
  const teaAndWhiskResults = await teaWebsiteCrawler(teaAndWhisk, formattedSearchTerm)
  console.log("Yunnan sourcing teas: ", yunnanSourcingResults)
  console.log('Tea and whisk teas: ', teaAndWhiskResults);
  const resultsArray = [...yunnanSourcingResults, ...teaAndWhiskResults]
  if(resultsArray){
    console.log('Combined results: ', resultsArray)
    response.json(resultsArray)
  }else{
    /**
     * So this will most likely not happen because one of the websites Tea and Whisk will by default send you the
     * information for Original Tongmu Jinjunmei. But just in case, that their website changes and doesn't have a default value, I'll leave this here. 
     */
    response.status(401).json({ error: "Could not find any results. Please try adjusting your search terms and try again." })
  }
});

module.exports = teaRouter;
