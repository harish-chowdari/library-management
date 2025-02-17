const Reserved = require("../models/HistoryModel");
const Book = require("../models/books")


async function addToReserved(req, res) {
    try {
        const { userId, bookId, fine, createdDate, willUseBy } = req.body;

        if (!userId || !bookId || !fine || !willUseBy) {
            return res.status(400).json({ message: "userId, bookId, fine, and willUseBy are required" });
        }

        // Fetch the book from the books collection
        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Check if the user has already reserved the book
        const userReservedBook = await Reserved.findOne({ userId, "items.bookId": bookId });

        if (userReservedBook) {
            return res.status(200).json({ alreadyReserved: "You have already reserved this book" });
        }

        // Fetch the reserved books by bookId
        const reservedBooks = await Reserved.find({ "items.bookId": bookId });

        // Check if the number of reserved copies is greater than or equal to the number of available copies
        if (reservedBooks.length >= book.numberOfCopies) {
            return res.status(200).json({ allCopiesReserved: "All copies of this book have been reserved" });
        }

        

        // Proceed with adding the book to reserved
        let booksReserved = await Reserved.findOne({ userId });

        if (!booksReserved) {
            booksReserved = new Reserved({
                userId,
                items: [{ bookId, fine, createdDate, willUseBy }]
            });
        } else {
            // Check if the user has already reserved 3 books
            if (booksReserved.items.length >= 3) {
                return res.status(200).json({ reachedMaxLimit: "You have already reserved the maximum number of books (3)." });
            }

            // Push only the required fields to the items array
            booksReserved.items.push({ bookId, fine, createdDate, willUseBy });
        }

        await booksReserved.save();
        return res.json({ booksReserved, reserved: "This book is reserved for you" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}



async function getBookCopiesCount(req,res) {
    try {
        const { bookId } = req.params;
        const reservedCount = await Reserved.countDocuments({ "items.bookId": bookId });
        res.json({ reservedCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}








async function getReserved(req, res) {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }

        const booksReserved = await Reserved.findOne({ userId }).populate("items.bookId");

        if (!booksReserved) {
            return res.status(200).json({ message: "Reserved not found" });
        }

        return res.json({ booksReserved });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}


async function getAllReserved(req, res) {
    try {
        const allReserved = await Reserved.find().populate("items.bookId").populate("userId", "-password");

        if (!allReserved) {
            return res.status(200).json({ noReservedFound: "Reserved not found" });
        }

        return res.json({ allReserved });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}





async function getAllReservedToGroupBookId(req,res) {
    try {
      const allReserved = await Reserved.find(); // Retrieve all reserved items from the database
  
      if (!Array.isArray(allReserved)) {
        throw new Error("Expected an array of reserved books"); // Ensure the result is an array
      }
  
      return { allReserved }; // Return as a JSON object
    } catch (error) {
      console.error("Error in getAllReservedToGroupBookId:", error);
      throw new Error("Failed to fetch reserved books");
    }
  }
  

  


  async function getBookIdGroup(req, res) {
    try {
      const { bookId } = req.params;
  
      if (!bookId) {
        return res.status(400).json({ error: "bookId is required" });
      }
  
      const allReserved = await Reserved.find();
  
      // Make sure bookId is a string for consistent comparison
      const bookIdStr = bookId.toString();
  
      // Filter reserved entries to keep only those with items containing the specified bookId
      const filteredReserved = allReserved
        .map((reserved) => {
          // Keep only the items that match the bookId
          const matchingItems = reserved.items.filter(
            (item) => item.bookId.toString() === bookIdStr
          );
  
          // Return the reserved object with only matching items
          return {
            ...reserved.toObject(), // Convert to plain JavaScript object
            items: matchingItems,
          };
        })
        .filter((reserved) => reserved.items.length > 0); // Remove empty entries
  
      if (filteredReserved.length === 0) {
        return { message: "No reserved books found for the specified bookId." };
      } 
  
      return { result: filteredReserved };
    } catch (error) {
      console.error("Error in getBookIdGroup:", error);
      return { error: "An error occurred while fetching book group data." };
    }
  }
  
  
  
  

  






async function getNearestWillUseBy(req, res) {
    const { bookId } = req.params;

    try {
        const currentDate = new Date(); // Current date

        const groupResponse = await getBookIdGroup({ params: { bookId } }, {});

        const result = groupResponse.result;
       

        if (!result || !Array.isArray(result) || result.length === 0) {
            return res.status(400).json({ message: "Invalid or empty result array" });
        }

        let nearestWillUseBy = null;
        let minDifference = Infinity;

        // Iterate over each item in the result array
        result.forEach(item => {
            const willUseByDate = new Date(item.items[0].willUseBy); // Assuming willUseBy is always the first item in items array

            // Shift the will use by date by one day ahead
            willUseByDate.setDate(willUseByDate.getDate() + 1);

            // Calculate the difference in days between current date and willUseBy date
            const differenceInDays = Math.ceil((willUseByDate - currentDate) / (1000 * 60 * 60 * 24));

            // Check if the willUseBy date is greater than or equal to the current date
            if (willUseByDate >= currentDate) {
                // Update nearestWillUseBy and minDifference if a closer date is found
                if (differenceInDays <= minDifference) {
                    minDifference = differenceInDays;
                    nearestWillUseBy = willUseByDate;
                }
            }
        });

        res.json({ nearestWillUseBy });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}








async function deleteBookFromReserved(req, res) {
    try {
        const { userId, _id } = req.body;

        if(!userId || !_id)
        {
            return res.json("userId and _id are required")
        }

        const reserved = await Reserved.findOne({ userId });

        if (!reserved) {
            return res.status(200).json({ notFoundReservation: "Reservation not found for the user" });
        }

        reserved.items = reserved.items.filter(item => item._id.toString() !== _id);

        await reserved.save();

        return res.status(200).json({ deletedFromReserved: "Book removed from reservation successfully" });
    } 
    
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}



async function updateReservedBook(req, res) {
    try {
        const { userId, bookId } = req.body;

        if (!userId || !bookId) {
            return res.status(400).json({ message: "userId and bookId are required" });
        }

        const reserved = await Reserved.findOne({ userId });

        if (!reserved) {
            return res.status(404).json({ message: "Reservation not found for the user" });
        }

        const reservedBook = reserved.items.find(item => item.bookId.toString() === bookId);

        if (!reservedBook) {
            return res.status(404).json({ message: "Book not found in reservation" });
        }

        if (reservedBook.submitStatus === "Submitting") {
            return res.status(200).json({ alreadySubmitted: "You have already sent submission request for this Book" });
        } 

        // Update submitStatus to "Submitting"
        reservedBook.submitStatus = "Submitting";

        await reserved.save();

        return res.status(200).json({ updatedReservation: "Book submission request sent successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}



async function removeFine(req, res) {
    try {
        const { userId } = req.params;
        const { bookId } = req.body;

        // Fetch the reserved books by userId
        const reservedBooks = await Reserved.findOne({ userId });

        // If no reserved books found, return a 404 status
        if (!reservedBooks) {
            return res.status(200).json({ message: "Reserved books not found" });
        }

        // Find the book in the reservedBooks.items array
        const bookIndex = reservedBooks.items.findIndex(item => item.bookId.toString() === bookId);

        // If the book is not found, return a 404 status
        if (bookIndex === -1) {
            return res.status(200).json({ message: "Book not found in reserved books" });
        }

        // Remove the fine for the found book
        reservedBooks.items[bookIndex].fine = "";

        // Save the updated reservedBooks
        await reservedBooks.save();

        return res.status(200).json({ fineRemoved: "Fine removed successfully", reservedBooks });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }  
}









module.exports = {
    addToReserved,
    getBookCopiesCount,
    getReserved, 
    getAllReserved,
    getAllReservedToGroupBookId,
    getBookIdGroup,
    getNearestWillUseBy,
    deleteBookFromReserved,
    updateReservedBook,
    removeFine
};
 