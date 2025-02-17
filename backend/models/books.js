const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
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
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    numberOfCopies :{
        type: Number,
        required: true
    },
    fine : {
        type: String, 
        required: true
    },
    useByDatesArray: [{
        willUseBy : {
            type: Date
        }
    }],

    feedbacksArray: [{
        userId: { 
            type: mongoose.Schema.Types.ObjectId,
            ref : "user"
        },
        rating : {
            type : Number
        },
        feedback: {
            type: String,
            required: true
        } 
    }]
},{ timestamps: true });

module.exports = mongoose.model("Books", bookSchema);
