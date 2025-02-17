const express = require("express");
const { BookPublication, getPublications, deletePublication } = require("../controllers/PublicationController");
const router = express.Router(); 

const {bookUpload} = require("../multer");


router.post("/book-publication/:isbnNumber", bookUpload, BookPublication)



router.get("/all-publications", getPublications)


router.delete("/remove-publication/:id", deletePublication)



module.exports = router