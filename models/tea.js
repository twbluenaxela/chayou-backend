const mongoose = require('mongoose')

const teaSchema = new mongoose.Schema({
    name: String,
    chineseName: String,
    rating: Number,
    liked: Boolean,
    type: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

teaSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Tea', teaSchema)