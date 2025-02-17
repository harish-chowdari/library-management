const mongoose = require("mongoose");



const PublicationSchema = mongoose.Schema({
    bookName: {
        type: String,
        required: true
    },
    authorName: {
        type: String,
        required: true
    },
    isbnNumber: {
        type: String,
        required: true
    },
    publishedDate: {
        type: String,
        required: true
    },
    bookImage: {
        type: String
    },
    description:{
        type: String,
        required: true
    }
}, {timestamps : true})


module.exports = mongoose.model("Publication", PublicationSchema)