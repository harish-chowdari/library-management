import React, { useState, useEffect } from 'react';
import axios from '../../axios/axios';
import Loader from '../../Components/Loader/Loader';
import PopUp from '../../Components/Popups/Popup';
import { FaStar } from 'react-icons/fa';
import styles from './SubmittedBooks.module.css';
import { useParams } from 'react-router-dom';

const SubmittedBooks = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popUpText, setPopUpText] = useState("");
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [feedbackTexts, setFeedbackTexts] = useState({});
  const [feedbackRatings, setFeedbackRatings] = useState({});
  const [flipped, setFlipped] = useState({});
  const userId = localStorage.getItem("userId");
  const { userName } = useParams();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get(`submit/get-submissions/${userId}`);
        if (response.data?.submissions?.items) {
          setSubmissions(response.data.submissions.items);
        } else {
          setPopUpText("No submissions found");
          setIsPopUpOpen(true);
        }
      } catch (error) {
        console.error("Error fetching submissions:", error);
        setPopUpText("Error fetching submissions");
        setIsPopUpOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [userId]);

  const toggleFlip = (key) => {
    setFlipped(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const submitFeedback = async (bookId, key) => {
    try {
      const feedback = feedbackTexts[key] || "";
      const rating = feedbackRatings[key] || 0;

      if (!feedback.trim()) {
        setPopUpText("Please provide feedback before submitting.");
        setIsPopUpOpen(true);
        return;
      }
      if (rating === 0) {
        setPopUpText("Please provide a rating.");
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
      } else if (response.data.bookNotFound) {
        setPopUpText(response.data.bookNotFound);
      } else {
        setPopUpText("Feedback submitted successfully.");
      }
      setIsPopUpOpen(true);
      toggleFlip(key); // Flip the card back after submitting
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setPopUpText("An error occurred while submitting feedback.");
      setIsPopUpOpen(true);
    }
  };

  const updateFeedbackText = (key, text) => {
    setFeedbackTexts(prev => ({ ...prev, [key]: text }));
  };

  const updateRating = (key, rating) => {
    setFeedbackRatings(prev => ({ ...prev, [key]: rating }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Submitted Books</h2>
        <p>Flip the card to share your feedback!</p>
      </div>
      {loading ? (
        <Loader />
      ) : submissions.length === 0 ? (
        <div className={styles.emptyMessage}>No submissions available.</div>
      ) : (
        <div className={styles.cardGrid}>
          {submissions.map((item, index) => {
            const key = `${item.bookName}-${item.authorName}`;
            return (
              <div className={styles.flipCard} key={index}>
                <div className={`${styles.flipCardInner} ${flipped[key] ? styles.flipped : ''}`}>
                  {/* Front Side */}
                  <div className={styles.flipCardFront}>
                    <div className={styles.cardContent}>
                      <div className={styles.imageSection}>
                        {item.bookImage ? (
                          <img src={item.bookImage} alt={item.bookName} className={styles.bookImage} />
                        ) : (
                          <div className={styles.imagePlaceholder}>No Image</div>
                        )}
                      </div>
                      <div className={styles.infoSection}>
                        <h3 className={styles.bookName}>{item.bookName}</h3>
                        <p className={styles.authorName}>by {item.authorName}</p>
                        <p className={styles.isbn}>ISBN: {item.isbnNumber}</p>
                        <p className={styles.submittedOn}>Submitted: {item.submittedOn.slice(0, 10)}</p>
                        <p className={styles.description}>{item.description}</p>
                      </div>
                    </div>
                    <button className={styles.flipButton} onClick={() => toggleFlip(key)}>
                      Give Feedback
                    </button>
                  </div>
                  {/* Back Side */}
                  <div className={styles.flipCardBack}>
                    <div className={styles.feedbackForm}>
                      <h3 className={styles.feedbackTitle}>Feedback for {item.bookName}</h3>
                      <textarea
                        className={styles.feedbackInput}
                        placeholder="Your feedback..."
                        value={feedbackTexts[key] || ""}
                        onChange={(e) => updateFeedbackText(key, e.target.value)}
                      />
                      <div className={styles.rating}>
                        {[1, 2, 3, 4, 5].map(star => (
                          <FaStar
                            key={star}
                            className={styles.starIcon}
                            color={(feedbackRatings[key] || 0) >= star ? "#ffb400" : "#444"}
                            onClick={() => updateRating(key, star)}
                          />
                        ))}
                      </div>
                      <button className={styles.submitButton} onClick={() => submitFeedback(item.bookId, key)}>
                        Submit Feedback
                      </button>
                      <button className={styles.backButton} onClick={() => toggleFlip(key)}>
                        Back
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <PopUp isOpen={isPopUpOpen} close={() => setIsPopUpOpen(false)} text={popUpText} />
    </div>
  );
};

export default SubmittedBooks;
