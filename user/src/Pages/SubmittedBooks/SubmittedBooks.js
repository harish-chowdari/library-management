import React, { useState, useEffect } from 'react';
import axios from '../../axios/axios';
import Loader from '../../Components/Loader/Loader';
import { FaStar } from 'react-icons/fa';
import "./SubmittedBooks.css";
import PopUp from '../../Components/Popups/Popup';
import { useParams } from "react-router-dom";

const SubmittedBooks = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [popUpText, setPopUpText] = useState("");
  const [feedbackTexts, setFeedbackTexts] = useState({});
  const [feedbackRatings, setFeedbackRatings] = useState({});
  const [showFeedbackInput, setShowFeedbackInput] = useState({});
  const userId = localStorage.getItem("userId");
  const { userName } = useParams();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get(`submit/get-submissions/${userId}`);
        if (response.data?.submissions?.items) {
          setSubmissions(response.data.submissions.items);
          setLoading(false);
        } else {
          setPopUpText("No submissions found");
          setIsPopUpOpen(true);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching submissions:', error);
        setPopUpText("Error fetching submissions");
        setIsPopUpOpen(true);
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [userId]);

  const submitFeedback = async (bookName, authorName, bookId) => {
    try {
      const feedback = feedbackTexts[`${bookName}-${authorName}`] || "";
      const rating = feedbackRatings[`${bookName}-${authorName}`] || 0;

      if (feedback.trim() === "") {
        setPopUpText("Please provide feedback before submitting.");
        setIsPopUpOpen(true);
        return;
      }

      if (rating === 0) {
        setPopUpText("Please provide rating before submitting.");
        setIsPopUpOpen(true);
        return;
      }

      const response = await axios.post('feedback/send-feedback', {
        bookId,
        userId,
        feedback,
        rating,
      });

      if (response.data.alreadySubmitted) {
        setPopUpText(response.data.alreadySubmitted);
        setIsPopUpOpen(true);
      } else if (response.data.bookNotFound) {
        setPopUpText(response.data.bookNotFound);
        setIsPopUpOpen(true);
      } else {
        setPopUpText("Feedback submitted successfully.");
        setIsPopUpOpen(true);
      }

      setShowFeedbackInput((prevState) => ({
        ...prevState,
        [`${bookName}-${authorName}`]: false,
      }));
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setPopUpText("An error occurred while submitting feedback.");
      setIsPopUpOpen(true);
    }
  };

  const updateFeedbackText = (bookName, authorName, text) => {
    setFeedbackTexts((prevState) => ({
      ...prevState,
      [`${bookName}-${authorName}`]: text,
    }));
  };

  const updateRating = (bookName, authorName, rating) => {
    setFeedbackRatings((prevState) => ({
      ...prevState,
      [`${bookName}-${authorName}`]: rating,
    }));
  };

  return (
    <div className="submission-container">
      <div className='submission-img'></div>
      {submissions.length === 0 ? <h2>Submissions are empty</h2> : <h2>Submitted Books</h2>}
      {loading ? (
        <Loader />
      ) : submissions.length === 0 ? (
        <p></p>
      ) : (
        <div className='submission-division'>
          <div className='submissionitems-format-main submission-headings'>
            <h3>Book</h3> 
            <h3>Name</h3>
            <h3>Author</h3>
            <h3>ISBN</h3>
            <h3>Submitted</h3>
            <h3>Description</h3> 
            <h3>Feedback</h3>
          </div>
          {submissions.map((item, index) => (
            <div className='Main-div-submission' key={index}>
              <div className="submissionitems-format-main submission-items-format">
                <img src={item.bookImage} alt={item.bookName} />
                <p>{item.bookName}</p>
                <p>{item.authorName}</p> 
                <p>{item.isbnNumber}</p>
                <p>{item.submittedOn.slice(0, 10)}</p>
                <p>{item.description}</p>
                {!showFeedbackInput[`${item.bookName}-${item.authorName}`] ? (
                  <button className='write-btn'
                    onClick={() => setShowFeedbackInput((prevState) => ({
                      ...prevState,
                      [`${item.bookName}-${item.authorName}`]: true,
                    }))}>
                    Write Feedback
                  </button>
                ) : (
                  <div className="feedback-overlay" onClick={() => {
                    setShowFeedbackInput((prevState) => ({
                      ...prevState,
                      [`${item.bookName}-${item.authorName}`]: false,
                    }));
                  }}>
                    <div className="feedback-div" onClick={(e) => e.stopPropagation()}>
                    <p className='pop'>{item.bookName}</p>
                      <textarea autoFocus
                        placeholder='Give Feedback...'
                        value={feedbackTexts[`${item.bookName}-${item.authorName}`] || ""}
                        onChange={(e) => updateFeedbackText(item.bookName, item.authorName, e.target.value)}
                      />
                      <div className="star-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            color={
                              (feedbackRatings[`${item.bookName}-${item.authorName}`] || 0) >= star ? 'gold' : 'gray'
                            }
                            onClick={() => updateRating(item.bookName, item.authorName, star)}
                            style={{ cursor: 'pointer' }}
                          />
                        ))}
                      </div>
                      <button
                        className='submit-btn'
                        onClick={() => submitFeedback(item.bookName, item.authorName, item.bookId)}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <PopUp
        isOpen={isPopUpOpen}
        close={() => setIsPopUpOpen(false)}
        text={popUpText}
      />
    </div>
  );
};

export default SubmittedBooks;
