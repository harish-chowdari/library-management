import React, { useState, useEffect } from 'react';
import axios from '../../axios/axios';
import Loader from '../../Components/Loader/Loader';
import PopUp from '../../Components/Popups/Popup';
import styles from './ReservedBooks.module.css';

const ReservedBooks = () => {
  const [booksReserved, setBooksReserved] = useState(null);
  const [loading, setLoading] = useState(true);
  const [popUpText, setPopUpText] = useState("");
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const userId = localStorage.getItem("userId");

  // Calculate days difference between today and the "will use by" date.
  const daysExceededOrRemaining = (willUseBy) => {
    const currentDate = new Date().toISOString().slice(0, 10);
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const currentTimestamp = new Date(currentDate).getTime();
    const willUseByTimestamp = new Date(willUseBy).getTime();
    return Math.floor((willUseByTimestamp - currentTimestamp) / millisecondsPerDay);
  };

  const displayFineOrRemaining = (days, fine) => {
    // Extract numeric portion from fine, if available.
    const fineAmount = fine?.match(/\d+(\.\d+)?/);
    if (days < 0 && fineAmount) {
      const numberOfDaysExceeded = Math.abs(days);
      const totalFine = parseFloat(fineAmount[0]) * numberOfDaysExceeded;
      return (
        <span style={{ color: "#ff9800" }}>
          {numberOfDaysExceeded} days exceeded. Total fine: {totalFine.toFixed(2)}$
        </span>
      );
    } else if (days < 0 && !fineAmount) {
      return <span>Fine Paid</span>;
    } else if (days === 0) {
      return <span>Last day to return</span>;
    } else {
      return <span>{days} days remaining</span>;
    }
  };

  const fetchBooksReserved = async () => {
    try {
      const res = await axios.get(`reserved/books-reserved/${userId}`);
      if (res.data.booksReserved) {
        setBooksReserved(res.data.booksReserved);
      } else {
        setPopUpText("No reserved books found.");
        setIsPopUpOpen(true);
      }
    } catch (error) {
      console.error("Error fetching reserved books:", error);
      setPopUpText("Error fetching reserved books.");
      setIsPopUpOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooksReserved();
  }, [userId]);

  const submitBook = async (bookId) => {
    try {
      setLoading(true);
      const response = await axios.put("reserved/update-reserved-book", { userId, bookId: bookId._id });
      if (response.data.updatedReservation) {
        setPopUpText(response.data.updatedReservation);
      } else {
        setPopUpText(response.data.alreadySubmitted);
      }
      setIsPopUpOpen(true);
      fetchBooksReserved();
    } catch (error) {
      console.error("Error submitting book:", error);
      setPopUpText(error.message);
      setIsPopUpOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* <div className={styles.banner}></div> */}
      <h2 className={styles.title}>Reserved Books</h2>
      {loading ? (
        <Loader />
      ) : booksReserved && booksReserved.items.length > 0 ? (
        <div className={styles.cardGrid}>
          {booksReserved.items.map((book, index) => (
            <div className={styles.card} key={index}>
              <div className={styles.cardHeader}>
                {book.bookId && book.bookId.bookImage ? (
                  <img src={book.bookId.bookImage} alt={book.bookId.bookName} className={styles.bookImage} />
                ) : (
                  <div className={styles.imagePlaceholder}>No Image</div>
                )}
                <div className={styles.bookInfo}>
                  <h3 className={styles.bookName}>
                    {book.bookId ? book.bookId.bookName : "Unknown Book"}
                  </h3>
                  <p className={styles.authorName}>
                    {book.bookId ? book.bookId.authorName : "Unknown Author"}
                  </p>
                </div>
              </div>
              <div className={styles.cardBody}>
                <p><strong>Reserved On:</strong> {book.createdDate.slice(0, 10)}</p>
                <p><strong>Use By:</strong> {book.willUseBy.slice(0, 10)}</p>
                <p><strong>Status:</strong> {book.submitStatus === "Submitting" ? "Requested" : "Pending"}</p>
                <p className={styles.daysInfo}>
                  {displayFineOrRemaining(daysExceededOrRemaining(book.willUseBy), book.fine)}
                </p>
              </div>
              <div className={styles.cardFooter}>
                {book.submitStatus === "Submitting" ? (
                  <button className={styles.submitButton} disabled>
                    Requested
                  </button>
                ) : (
                  <button className={styles.submitButton} onClick={() => submitBook(book.bookId)}>
                    Submit
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyMessage}>
          <h2>No reserved books found.</h2>
        </div>
      )}
      <PopUp isOpen={isPopUpOpen} close={() => setIsPopUpOpen(false)} text={popUpText} />
    </div>
  );
};

export default ReservedBooks;
