const mongoose = require('mongoose')

// const teaAndWhisk = {
//     url: "https://teaandwhisk.com",
//     searchUrl: "https://teaandwhisk.com/pages/search-results-page?q=",
//     productUrlSelector: ".snize-view-link",
//     searchBoxSelector: "input[type='search']",
//     searchButtonSelector: "div.input-group-btn > button",
//     productGridSelector: "ul.snize-search-results-content",
//     productCardSelector: "li",
//     priceSelector: "span.snize-price",
//     nameSelector: "span.snize-title",
//     descriptionSelector: "",
//     imgSelector: "img.snize-item-image",
//     popup: "div.needsclick.kl-private-reset-css-Xuajs1",
//     popupCloseButton: ".needsclick.klaviyo-close-form"
//   };


const teaWebsiteSchema = new mongoose.Schema({
    url: String,
    searchUrl: String,
    productUrlSelector: String,
    searchBoxSelector: String,
    searchButtonSelector: String,
    productGridSelector: String,
    productCardSelector: String,
    priceSelector: String,
    nameSelector: String,
    descriptionSelector: String,
    imgSelector: String,
    popup: String,
    popupCloseButton: String,
})

teaWebsiteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('TeaWebsite', teaWebsiteSchema)