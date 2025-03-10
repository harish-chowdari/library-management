import React, { useEffect, useState } from 'react';
import axios from '../../axios/axios';
import styles from './CartItem.module.css';

const CartItem = ({ item, removeFromCart, reserveBook, willUseBy, handleDateChange }) => {
  const [isOutOfStock, setIsOutOfStock] = useState(false);
  const [isBookReserved, setIsBookReserved] = useState(false);
  const [availableDate, setAvailableDate] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchReservationData = async () => {
      try {
        // Get reserved count
        const res = await axios.get(`reserved/book-copies-count/${item.bookId._id}`);
        const resCount = res.data.reservedCount;

        // Get total copies
        const bookResponse = await axios.get(`librarian/getbook/${item.bookId._id}`);
        const numberOfCopies = bookResponse.data.numberOfCopies;

        setIsOutOfStock(resCount >= numberOfCopies);

        // Check if already reserved by the user
        const isReserved = await checkReservation(item.bookId._id);
        setIsBookReserved(isReserved);

        // Get nearest available date
        const nearestDateRes = await axios.get(`reserved/nearest-will-use-by/${item.bookId._id}`);
        const nearestDate = nearestDateRes.data.nearestWillUseBy;
        if (nearestDate) {
          setAvailableDate(nearestDate);
        }
      } catch (error) {
        console.error('Error fetching reservation data:', error);
      }
    };

    const checkReservation = async (bookId) => {
      try {
        const res = await axios.get(`reserved/books-reserved/${userId}`);
        if (res.data.booksReserved && res.data.booksReserved.items) {
          const reservedItems = res.data.booksReserved.items;
          return reservedItems.some(item => item.bookId._id === bookId);
        } else {
          return false;
        }
      } catch (error) {
        console.error('Error fetching reserved books:', error);
        return false;
      }
    };

    fetchReservationData();
  }, [item.bookId._id, userId]);

  return (
    <tr className={styles.cartItemRow}>
      <td className={styles.tdCell}>
        {item.bookId && item.bookId.bookImage ? (
          <img 
            src={item.bookId.bookImage} 
            alt={item.bookId.bookName} 
            className={styles.bookImage} 
          />
        ) : (
          "No Image"
        )}
      </td>
      <td className={styles.tdCell}>
        {item.bookId?.bookName || "Unknown"}
      </td>
      <td className={styles.tdCell}>
        {isOutOfStock || isBookReserved ? (
          <span className={styles.availableDate}>
            {availableDate ? availableDate.slice(0, 10) : 'TBD'}
          </span>
        ) : (
          <input
            type="date"
            value={willUseBy || ''}
            onChange={handleDateChange}
            required
            className={styles.dateInput}
          />
        )}
      </td>
      <td className={styles.tdCell}>
        {isBookReserved ? (
          <span className={styles.statusText}>Reserved</span>
        ) : isOutOfStock ? (
          <span className={styles.statusTextNotAvailable}>Not Available</span>
        ) : (
          <button 
            onClick={() => reserveBook(item.bookId._id, item.bookId.fine)}
            className={styles.reserveButton}
          >
            Reserve
          </button>
        )}
      </td>
      <td className={styles.tdCell}>
        <button onClick={() => removeFromCart(item.bookId._id)} className={styles.removeButton}>
          Remove
        </button>
      </td>
    </tr>
  );
};

export default CartItem;
