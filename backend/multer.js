const multer=require("multer");
const path = require("path");
const fs = require('fs');


//multer Storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, require('path').resolve(__dirname, '..') + "/backend/upload");
    },
    filename: function (req, file, cb) {
        if(file.fieldname === "bookImage"){
            cb(null,req.params.isbnNumber  + '-' + file.fieldname + '.png');
        }
    }
})


const upload = multer({ storage: storage });

//middleware for product images uploading to multer
const bookUpload = upload.fields([
    { name: 'bookImage', maxCount: 1 }, 
    
])

module.exports = {
    bookUpload
};