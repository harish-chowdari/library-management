const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    items: [{ 
        bookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Books",
            required: true
        }
    }]
}, { timestamps: true });

module.exports = mongoose.model("Cart", cartSchema);
