import React, { useState } from "react";
import axios from "../../axios/axios";
import "./AddPublication.css";
import PopUp from "../../Components/Popups/Popup"
import Loader from "../../Components/Loader/Loader";

function AddPublication() {
  const [publicationDetails, setPublicationDetails] = useState({
    bookName: "",
    authorName: "",
    isbnNumber: "",
    publishedDate: "",
    description: "",
  });

  const [bookImage, setBookImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [popUpText, setPopUpText] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPublicationDetails({ ...publicationDetails, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
        setBookImage(file); // Store the image file
      };
      reader.readAsDataURL(file); // Convert to a data URL for preview
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bookImage) {
      setPopUpText("Please upload an image of the book");
      setIsPopUpOpen(true);
      return; // Ensure the image is provided
    }

    const formData = new FormData();
    formData.append("bookName", publicationDetails.bookName);
    formData.append("authorName", publicationDetails.authorName);
    formData.append("isbnNumber", publicationDetails.isbnNumber);
    formData.append("publishedDate", publicationDetails.publishedDate);
    formData.append("description", publicationDetails.description);
    formData.append("bookImage", bookImage); // Include the image file

    try {
      setLoading(true); // Start loading state
      await axios.post(
        `publication/book-publication/${publicationDetails.isbnNumber}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Essential for file uploads
          },
        }
      );
      setLoading(false); // Stop loading
      setPopUpText("Publication added successfully");
      setIsPopUpOpen(true); // Show success message

      // Reset the form fields after successful submission
      setPublicationDetails({
        bookName: "",
        authorName: "",
        isbnNumber: "",
        publishedDate: "",
        description: "",
      });
      setBookImage(null); // Clear the image file
      setImagePreviewUrl(""); // Reset the preview URL
    } catch (error) {
      setLoading(false);
      setPopUpText(
        error?.response?.data?.message || "An error occurred during submission"
      );
      setIsPopUpOpen(true); // Display error message in a pop-up
    }
  };

  return (
    <div className="layout">
      {loading && <Loader />} 
      <div className="add-publication-content">
        <div className="add-publication-header">
          <h2>Add Publication</h2>
        </div>
        <div className="publication-details-form-container">
          <form className="publication-details-form" onSubmit={handleSubmit}>
            <label htmlFor="bookName">Book Name:</label>
            <input
              type="text"
              id="bookName"
              name="bookName"
              value={publicationDetails.bookName}
              onChange={handleChange}
              required
            />

            <label htmlFor="authorName">Author Name:</label>
            <input
              type="text"
              id="authorName"
              name="authorName"
              value={publicationDetails.authorName}
              onChange={handleChange}
              required
            />

            <label htmlFor="isbnNumber">ISBN Number:</label>
            <input
              type="text"
              id="isbnNumber"
              name="isbnNumber"
              value={publicationDetails.isbnNumber}
              onChange={handleChange}
              required
            />

            <label htmlFor="publishedDate">Published Date:</label>
            <input
              type="date"
              id="publishedDate"
              name="publishedDate"
              value={publicationDetails.publishedDate}
              onChange={handleChange}
              required
            />

            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={publicationDetails.description}
              onChange={handleChange}
              rows="4"
              placeholder="Enter book description"
              required
            />

            <label htmlFor="bookImage">Book Image:</label>
            <input
              type="file"
              id="bookImage"
              name="bookImage"
              onChange={handleImageChange}
              required
            />

            {imagePreviewUrl && (
              <div className="image-preview">
                <img src={imagePreviewUrl} alt="Book Preview" />
              </div>
            )}

            <button type="submit">Submit Publication Details</button>
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

export default AddPublication;
