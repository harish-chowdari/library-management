const mongoose  = require("mongoose")


const SubmissionSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user", 
        required: true
    },
    items: [{
        bookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Books",
        },
        bookName: {
            type: String,
        },
        authorName: {
            type: String,
        },
        isbnNumber: {
            type: String,
        },
        publishedDate: {
            type: String
        },
        bookImage: {
            type: String
        },
        description: {
            type: String,
        },
        submittedOn : {
            type : Date,
            default: Date.now
        }
    }]
}, { timestamps: true });

module.exports = mongoose.model("submissions", SubmissionSchema)