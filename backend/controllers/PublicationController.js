const PublicationSchema = require("../models/PublicationModel");
const S3 = require("../s3");

// Function to upload a book publication
const BookPublication = async (req, res) => { 
    try {
        console.log('Req Body:', req.body);

        // Upload the book image to S3 and get the response
        const response = await S3.uploadFile(
            process.env.AWS_BUCKET_NAME,
            req.files.bookImage[0]
        );

        // Destructure the details from the request body
        const { bookName, authorName, isbnNumber, publishedDate, description } = req.body;

        // Create a new publication document
        const book = new PublicationSchema({
            bookName,
            authorName,
            isbnNumber,
            publishedDate,
            bookImage: response.Location,
            description,
        });

        // Save the document to the database
        await book.save();

        // Respond with a success message
        res.status(201).json({ message: "Book added successfully" });
    } catch (error) {
        console.error("Error adding book:", error);
        res.status(500).json({ message: error.message });
    }
};

// Function to get all book publications
const getPublications = async (req, res) => {
    try {
        // Fetch all publications from the database
        const publications = await PublicationSchema.find({});

        // Respond with the list of publications
        res.status(200).json(publications);
    } catch (error) {
        console.error("Error fetching publications:", error);
        res.status(500).json({ message: error.message });
    } 
};



const deletePublication = async (req, res) => {
    try {

        const { id } = req.params;

        const publication = await PublicationSchema.findByIdAndDelete(id);

        if (!publication) {
            return res.status(404).json({ message: "Publication not found" });
        }
        
        res.status(200).json({ message: "Publication deleted successfully" });
    
    } 
    
    catch (error) {
        console.error("Error deleting publication:", error);
        res.status(500).json({ message: error.message });
    }
};




module.exports = {
    BookPublication,
    getPublications,
    deletePublication
};
