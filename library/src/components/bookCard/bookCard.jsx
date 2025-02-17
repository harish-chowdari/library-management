import React, { useEffect, useState } from 'react';
import './bookCard.css';
import axios from '../../axios/axios';
import Loader from '../loader/loader';

const BookCard = ({ id, title, imageUrl, author, setBooks }) => {
  const [show, setShow] = useState(false);
  const [reserveCount, setReserveCount] = useState();
  const [Copies, setCopies] = useState();
  const [loading, setLoading] = useState(false);

  // Function to fetch the reservation data
  const fetchReservationData = async () => {
    try {
      const res = await axios.get(`reserved/book-copies-count/${id}`);
      const resCount = res.data.reservedCount;

      const bookResponse = await axios.get(`librarian/getbook/${id}`);
      const numberOfCopies = bookResponse.data.numberOfCopies;

      setReserveCount(resCount);
      setCopies(numberOfCopies);
    } catch (error) {
      console.error('Error fetching reservation data:', error);
    }
  };

  useEffect(() => {
    fetchReservationData();
  }, [id]);


  const remainingCopies = Copies - reserveCount;


  const handleDelete = async () => {
    setLoading(true);

    try {
      await axios.delete(`librarian/remove-book/${id}`);
      await axios.post('cart/remove-from-everyones-cart', { bookId: id });

      setBooks((prevBooks) => prevBooks.filter((book) => book._id !== id));
    } catch (error) {
      console.error('Error deleting book:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleIncrease = async () => {
    setLoading(true); // Show loading indicator
    try {
      await axios.post(`librarian/increase-copy/${id}`);
      await fetchReservationData(); // Re-fetch data to update the UI
    } catch (error) {
      console.error('Error increasing copies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDecrease = async () => {
    setLoading(true); // Show loading indicator
    try {
      await axios.post(`librarian/decrease-copy/${id}`);
      await fetchReservationData(); // Re-fetch data to update the UI
    } catch (error) {
      console.error('Error decreasing copies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setShow(false);
      clearInterval(interval);
    }, 5000);

    return () => clearInterval(interval);
  }, [show]);

  return (
    <div className="book-card">
      <div className="book-image">
        <img
          onClick={() => {
            if (reserveCount === 0) {
              setShow(!show);
            }
          }}
          src={imageUrl}
          alt={title.toUpperCase()}
        />
        <div className="book-div">
          {show ? (
            <button className="dlt-btn" onClick={handleDelete}>
              Delete
            </button>
          ) : (
            <h2 className="book-author">{title}</h2>
          )}
        </div>
        <div className="home-count">
          <p>
            {remainingCopies}/{Copies}
          </p>
        </div>

        <div className="inc-dec">
          <button
            onClick={handleDecrease}
            disabled={reserveCount === Copies || Copies === 1}
          >
            -
          </button>
          <button onClick={handleIncrease}>+</button>
        </div>
      </div>

      {loading && <Loader />}
    </div>
  );
};

export default BookCard;
