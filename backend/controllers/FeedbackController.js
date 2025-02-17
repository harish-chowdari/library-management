const BookModel = require("../models/books");
const UserModel = require("../models/user");



async function sendFeedback(req, res) {
    try {
        const { bookId, userId, feedback, rating } = req.body;
 
        // Check if all required fields are present
        if (!bookId || !userId || !feedback || !rating) {
            return res.status(200).json({ message: "bookId, userId, feedback, and rating are required fields" });
        }

        // Check if the book exists
        const existingBook = await BookModel.findById(bookId);
        if (!existingBook) {
            return res.status(200).json({ bookNotFound: "Book might be deleted from library" });
        }

        // Check if the user has already submitted feedback for this book
        const hasSubmittedFeedback = existingBook.feedbacksArray.some(entry => entry.userId.toString() === userId);
        if (hasSubmittedFeedback) {
            return res.status(200).json({ alreadySubmitted: "You have already submitted feedback for this book" });
        }
 
        // Add the feedback and rating to the book's feedbacksArray
        existingBook.feedbacksArray.push({ userId, feedback, rating });
        await existingBook.save();

        res.status(200).json({ fbSubmitted: "Feedback submitted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
} 



async function getFeedbacks(req, res) {
    try {
        const { bookId } = req.params;

        // Check if bookId is provided
        if (!bookId) {
            return res.status(400).json({ message: "bookId is required" });
        }

        // Find the book by its ID
        const existingBook = await BookModel.findById(bookId)
            .populate('feedbacksArray.userId', 'name')
            .select('-_id feedbacksArray');

        if (!existingBook) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Extract the feedbacks array with only user names and feedback messages
        const feedbacksArray = existingBook.feedbacksArray.map(feedback => ({
            userName: feedback.userId.name,
            feedback: feedback.feedback,
            rating: feedback.rating
        })); 

        // Return the feedbacks array in the response
        res.status(200).json({ feedbacks: feedbacksArray });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}







module.exports = {
    sendFeedback,
    getFeedbacks
};
