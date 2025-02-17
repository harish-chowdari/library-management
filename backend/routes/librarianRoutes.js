const express = require("express");
const router = express.Router();

const {bookUpload} = require("../multer");

const librarianController = require("../controllers/librarianControllers");




router.post("/addBook/:isbnNumber",bookUpload,librarianController.addBook );


router.post("/publish-book-by-user", librarianController.publishBookByUser );



router.post("/add-will-use-by/:bookId", librarianController.addWillUseBy)


router.post("/increase-copy/:bookId", librarianController.increaseCopy)

  

router.post("/decrease-copy/:bookId", librarianController.decreaseCopy)



router.get("/fetchAllBooks", librarianController.fetchAllBooks );


router.get("/getbook/:id", librarianController.getBookById)


router.delete("/remove-book/:id", librarianController.deleteBookById)



router.get("/getBookSuggestions/:searchQuery",librarianController.getBookSuggestions);





module.exports = router;