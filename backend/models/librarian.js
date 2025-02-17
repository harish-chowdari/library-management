const mongoose = require("mongoose");

const librarianSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
        trim:true
    },
    email: {
        type: String,
        unique:true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
},{ timestamps: true })

module.exports = mongoose.model("librarian",librarianSchema);
