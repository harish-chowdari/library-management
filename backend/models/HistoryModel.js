const mongoose = require("mongoose");

const ReservedSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    
    items: [{
        bookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Books",
            required: true
        },
        fine : {
            type: String
        },
        createdDate: {
            type: Date,
            default: Date.now
        },
        willUseBy : {
            type: Date
        },
         
        submitStatus : { 
            type:String
        }
    }]
}, { timestamps: true });

module.exports = mongoose.model("Reserveds", ReservedSchema);
