const Submission = require("../models/Submission");

async function addToSubmit(req, res) {
    try {
        const { userId, bookId, bookName, authorName, isbnNumber, 
            publishedDate, bookImage, description,submittedOn } = req.body;

        if (!userId || !bookId || !bookName) {
            return res.status(400).json({ message: "userId, bookId, and bookName are required" });
        }  
 
        let booksSubmitted = await Submission.findOne({ userId });
 
        if (!booksSubmitted) {
            booksSubmitted = new Submission({
                userId,
                items: [{ bookId, bookName, authorName, isbnNumber, 
                    publishedDate, bookImage, description, submittedOn }]
            });
        } 
        
        else {
            // Check if the bookId already exists in the Submission
            const existingBookIndex = booksSubmitted.items.findIndex(item => item.bookId.toString() === bookId);
            if (existingBookIndex !== -1) {
                return res.status(200).json({ alreadySubmitted: "Book already added to submission" });
            }

            booksSubmitted.items.push({ bookId, bookName, authorName, isbnNumber, 
                publishedDate, bookImage, description });
        }

        await booksSubmitted.save();
        return res.json({ booksSubmitted, submitionSuccess: "This book is submitted" });
    } 
     
    
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}



async function getSubmissionsByUserId(req, res) {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }

        const submissions = await Submission.findOne({ userId });

        if (!submissions) {
            return res.status(200).json({ message: "Submissions not found for the user" });
        }

        return res.json({ submissions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}




module.exports = {
    addToSubmit,
    getSubmissionsByUserId
}; 
