const BookModel = require("../models/books");
const S3 = require("../s3");



const addBook = async (req, res) => {
    try {

        console.log('Req Body:', req.body)

        const response = await S3.uploadFile(process.env.AWS_BUCKET_NAME,req.files.bookImage[0]) ; 
        const { bookName, authorName, isbnNumber, publishedDate, description, numberOfCopies, fine } = req.body;
        const book = new BookModel({
            bookName,
            authorName,
            isbnNumber,
            publishedDate, 
            bookImage: response.Location,
            description,
            numberOfCopies,
            fine
        });
        await book.save();
        res.status(201).json({ message: "Book added successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}




const  publishBookByUser = async (req, res) => {
    try
    {
        const { bookName, authorName, isbnNumber, 
            publishedDate, bookImage, 
            description, numberOfCopies,
            fine } = req.body;

        const book = new BookModel({
            bookName,
            authorName,
            isbnNumber,
            publishedDate,
            bookImage,
            description,
            numberOfCopies,
            fine
        });

        await book.save();
        res.status(201).json({ bookAdded: "Book added successfully" });
    } 
    
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
    
}





const addWillUseBy = async (req, res) => {

    const { bookId } = req.params;

    try {

        const { willUseBy } = req.body;

        const book = await BookModel.findById(bookId);
        if (!book) {
            throw new Error("Book not found");
        }
        book.useByDatesArray.push({ willUseBy: willUseBy });
        await book.save();
        return res.json(book);
    } catch (error) {
        throw error;
    }
};




const increaseCopy = async (req, res) => {
    try {
      // Fetch the book ID from the request parameters
      const { bookId } = req.params;
  
      // Find the book by ID
      const book = await BookModel.findById(bookId);
  
      // If the book doesn't exist, return a 404 error
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
  
      // Increment the number of copies by 1
      book.numberOfCopies += 1;
  
      // Save the updated book to the database
      await book.save();
  
      // Return a success response with the updated book details
      res.status(200).json({ message: "Book copy count increased", book });
    } catch (error) {
      // Log the error and return a 500 status if something goes wrong
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  };




  const decreaseCopy = async (req, res) => {
    try {
      // Fetch the book ID from the request parameters
      const { bookId } = req.params;
  
      // Find the book by ID
      const book = await BookModel.findById(bookId);
  
      // If the book doesn't exist, return a 404 error
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
  
      // Check if the number of copies is greater than 0 before decrementing
      if (book.numberOfCopies > 0) {
        book.numberOfCopies -= 1; // Decrement the number of copies by 1
      } else {
        return res.status(400).json({ message: "Cannot decrease, no copies left" });
      }
  
      // Save the updated book to the database
      await book.save();
  
      // Return a success response with the updated book details
      res.status(200).json({ message: "Book copy count decreased", book });
    } catch (error) {
      // Log the error and return a 500 status if something goes wrong
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  };
  



const fetchAllBooks = async (req, res) => {
    try {
        const books = await BookModel.find({}).sort({ publishedDate: -1 });
        console.log(books);
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



const getBookById = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await BookModel.findById(id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json(book);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};



const deleteBookById = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBook = await BookModel.findByIdAndDelete(id);
        if (!deletedBook) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json({ message: "Book deleted successfully", deletedBook });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    } 
};



const getBookSuggestions = async (req, res) => {
    try {
        console.log(req.query);
        const { searchQuery } = req.params;
        const books = await BookModel.find({
            $or: [
                { bookName: { $regex: searchQuery, $options: "i" } },
                { authorName: { $regex: searchQuery, $options: "i" } },
                // Add more fields to search here if needed
            ]
        }).select("bookName");
        res.status(200).json(books);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message }); 
    }
}
module.exports = {
    addBook,
    addWillUseBy,
    fetchAllBooks,
    increaseCopy,
    decreaseCopy,
    getBookSuggestions,
    getBookById,
    deleteBookById,
    publishBookByUser
}

  