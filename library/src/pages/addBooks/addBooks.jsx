import React, { useState } from 'react';
import "./addBooks.css";
import { IoNotifications } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import PopUp from "../../components/popups/popup";
import Loader from '../../components/loader/loader';
import axios from "../../axios/axios";

function AddBooks() {
    const [bookDetails, setBookDetails] = useState({
        authorName: '',
        isbnNumber: '',
        bookName: '',
        publishedDate: '',
        bookImage: null,
        description: '',
        fine: '',
        numberOfCopies: 1 
    });

    const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    const [isPopUpOpen, setIsPopUpOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [popUpText, setpopUpText] = useState("");
    const [isBackgroundBlurred, setIsBackgroundBlurred] = useState(false);

    const blurredBackgroundStyles = isBackgroundBlurred
        ? {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(100, 100, 100, 0.5)",
            backdropFilter: "blur(1.8px)",
            zIndex: 1,
        }
        : {};

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBookDetails({ ...bookDetails, [name]: value });
    };

    const handleImageChange = (e) => {
        const reader = new FileReader();
        const file = e.target.files[0];

        reader.onloadend = () => {
            setBookDetails({ ...bookDetails, bookImage: file });
            setImagePreviewUrl(reader.result);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let formData = new FormData();
        formData.append('authorName', bookDetails.authorName);
        formData.append('isbnNumber', bookDetails.isbnNumber);
        formData.append('bookName', bookDetails.bookName);
        formData.append('publishedDate', bookDetails.publishedDate);
        formData.append('bookImage', bookDetails.bookImage);
        formData.append('description', bookDetails.description);
        formData.append('fine', bookDetails.fine);
        formData.append('numberOfCopies', bookDetails.numberOfCopies); // Append number of copies to the form data

        try { 
            setLoading(true);
            const response = await axios.post(`librarian/addBook/${bookDetails.isbnNumber}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setLoading(false);
            setpopUpText("Book Added Successfully");
            setIsPopUpOpen(true);
            setBookDetails({
                authorName: '',
                isbnNumber: '',
                bookName: '',
                publishedDate: '',
                bookImage: null,
                description: '',
                fine: '',
                numberOfCopies: 1 // Reset number of copies to 1 after submission
            });
            setImagePreviewUrl('');
        } catch (error) {
            setLoading(false);
            if (error?.response?.data?.message) {
                setpopUpText(error?.response?.data?.message);
            } else {
                setpopUpText("Something Went Wrong")
            }
            setIsPopUpOpen(true);
        }
    };

    return (
        <div className='layout'>
            {isBackgroundBlurred && <div style={blurredBackgroundStyles} />}
            {loading && <Loader />}
            <div className="addbook-content">
                <div className="addBook-header">
                    <h2>Add Book</h2>
                    <div className='header-user' >
                        
                    </div>
                </div>
                <div className="book-details-form-container">
                <form className="book-details-form" onSubmit={handleSubmit}>
    <label htmlFor="bookName">Book Name:</label>
    <input
        type="text"
        id="bookName"
        name="bookName"
        value={bookDetails.bookName}
        onChange={handleChange}
        required
    />

    <label htmlFor="authorName">Author Name:</label>
    <input
        type="text"
        id="authorName"
        name="authorName"
        value={bookDetails.authorName}
        onChange={handleChange}
        required
    />

    <label htmlFor="isbnNumber">ISBN Number:</label>
    <input
        type="text"
        id="isbnNumber"
        name="isbnNumber"
        value={bookDetails.isbnNumber}
        onChange={handleChange}
        required
    />

    <label htmlFor="publishedDate">Published Date:</label>
    <input
        type="date"
        id="publishedDate"
        name="publishedDate"
        value={bookDetails.publishedDate}
        onChange={handleChange}
        required
    />

    <label htmlFor="description">Description:</label>
    <textarea
        id="description"
        name="description"
        value={bookDetails.description}
        onChange={handleChange}
        className='textarea-description'
        placeholder="Enter book description"
        rows="4" 
    />
    

    <label htmlFor="fine">Fine Per day:</label>
    <input
        type="text"
        id="fine"
        name="fine"
        value={bookDetails.fine}
        onChange={handleChange}
        required
    />

    <label htmlFor="bookImage">Book Image:</label>
    <input
        type="file"
        id="bookImage"
        name="bookImage"
        onChange={handleImageChange}
    />
    {imagePreviewUrl && (
        <div className="image-preview">
            <img src={imagePreviewUrl} alt="Book Preview" />
        </div>
    )}

    <label htmlFor="numberOfCopies">Number of Copies:</label>
    <input
        type="number"
        id="numberOfCopies"
        name="numberOfCopies"
        value={bookDetails.numberOfCopies}
        onChange={handleChange}
        min="1" 
        required
    />

    <button type="submit">Submit Book Details</button>
</form>

                </div>
            </div>
            <PopUp
                isOpen={isPopUpOpen}
                close={() => setIsPopUpOpen(false)}
                text={popUpText}
            />
        </div>
    );
}

export default AddBooks;
