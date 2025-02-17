const express = require("express");
const { addToReserved, getReserved, getAllReserved, deleteBookFromReserved, updateReservedBook, removeFine, getBookCopiesCount, getBookIdGroup, getNearestWillUseBy, getAllReservedToGroupBookId } = require("../controllers/HistoryController");
const router = express.Router(); 



router.post("/add-to-reserved", addToReserved)


router.get("/book-copies-count/:bookId", getBookCopiesCount)



router.get("/books-reserved/:userId", getReserved)



router.get("/all-reserved-books", getAllReserved) 




router.get("/all-reserved-books-by-book-id", getAllReservedToGroupBookId)


 
router.get('/book-id-group/:bookId', getBookIdGroup);



router.get('/nearest-will-use-by/:bookId', getNearestWillUseBy);

 

router.post("/remove-from-reserved", deleteBookFromReserved )


router.put("/update-reserved-book", updateReservedBook)


router.put('/books-reserved/remove-fine/:userId', removeFine);



module.exports = router

