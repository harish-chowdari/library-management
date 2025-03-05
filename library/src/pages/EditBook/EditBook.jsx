import React, { useEffect, useState } from 'react';
import PopUp from '../../components/popups/popup';
import Loader from '../../components/loader/loader';
import { useParams } from 'react-router-dom';
import axios from '../../axios/axios';

const EditBook = () => {
    const [bookDetails, setBookDetails] = useState({
        authorName: '',
        isbnNumber: '',
        bookName: '',
        category: '',
        publishedDate: '',
        bookImage: null,
        description: '',
        fine: '',
        numberOfCopies: 1
    });

    const { bookId } = useParams();
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    const [isPopUpOpen, setIsPopUpOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [popUpText, setPopUpText] = useState("");

    useEffect(() => {
        const fetchBookById = async () => {
            try {
                const res = await axios.get(`librarian/getbook/${bookId}`);
                setBookDetails(res.data);
                if (res.data.bookImage) {
                    setImagePreviewUrl(res.data.bookImage);
                }
            } catch (error) {
                setPopUpText("Failed to fetch book details");
                setIsPopUpOpen(true);
            }
        };
        fetchBookById();
    }, [bookId]);

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
        if (!bookDetails.authorName.trim() || !bookDetails.isbnNumber.trim() || !bookDetails.bookName.trim() || !bookDetails.category.trim() || !bookDetails.publishedDate.trim() || !bookDetails.bookImage || !bookDetails.description.trim() || !bookDetails.fine.trim() || !bookDetails.numberOfCopies) {
            setPopUpText("Please fill all the fields.");
            setIsPopUpOpen(true);
            return;
        }

        try {
            setLoading(true);
            let formData = new FormData();
            Object.keys(bookDetails).forEach(key => {
                formData.append(key, bookDetails[key]);
            });

            await axios.post(`librarian/editBook/${bookId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            setLoading(false);
            setPopUpText("Book Updated Successfully");
            setIsPopUpOpen(true);
        } catch (error) {
            setLoading(false);
            setPopUpText(error?.response?.data?.message || "Something Went Wrong");
            setIsPopUpOpen(true);
        }
    };

    return (
        <div className='layout'>
            {loading && <Loader />}
            <div className="addbook-content">
                <div className="addBook-header">
                    <h2>Edit Book</h2>
                </div>
                <div className="book-details-form-container">
                    <form className="book-details-form" onSubmit={handleSubmit}>
                        <label>Book Name:</label>
                        <input type="text" name="bookName" value={bookDetails.bookName} onChange={handleChange} />

                        <label>Category:</label>
                        <input type="text" name="category" value={bookDetails.category} onChange={handleChange} />

                        <label>Author Name:</label>
                        <input type="text" name="authorName" value={bookDetails.authorName} onChange={handleChange} />

                        <label>ISBN Number:</label>
                        <input type="text" name="isbnNumber" value={bookDetails.isbnNumber} onChange={handleChange} />

                        <label>Published Date:</label>
                        <input type="date" name="publishedDate" value={bookDetails.publishedDate} onChange={handleChange} />

                        <label>Description:</label>
                        <textarea name="description" value={bookDetails.description} onChange={handleChange} rows="4" />

                        <label>Fine Per Day:</label>
                        <input type="text" name="fine" value={bookDetails.fine} onChange={handleChange} />

                        <label>Book Image:</label>
                        <input type="file" accept='image/*' name="bookImage" onChange={handleImageChange} />
                        {imagePreviewUrl && <img style={{ marginTop: "10px", maxWidth: "150px", height: "auto", borderRadius: "8px", overflow: "hidden", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)" }} src={imagePreviewUrl} alt="Book Preview" />}

                        <label>Number of Copies:</label>
                        <input type="number" name="numberOfCopies" value={bookDetails.numberOfCopies} onChange={handleChange} min="1" />

                        <button type="submit">Update Book</button>
                    </form>
                </div>
            </div>
            <PopUp isOpen={isPopUpOpen} close={() => setIsPopUpOpen(false)} text={popUpText} />
        </div>
    );
};

export default EditBook;