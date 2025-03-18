import React, { useState, useEffect } from 'react';
import axios from '../../axios/axios';
import Loader from '../../Components/Loader/Loader';
import PopUp from '../../Components/Popups/Popup';
import CartItem from '../../Components/CartItem/CartItem';
import styles from './Cart.module.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId] = useState(localStorage.getItem("userId"));
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [popUpText, setPopUpText] = useState("");
  const [willUseByMap, setWillUseByMap] = useState({});
  // const [reservedBooks, setReservedBooks] = useState([]); // if needed

  async function fetchCartItems() {
    try {
      const res = await axios.get(`cart/get-cart/${userId}`);
      if (res.data.noCartFound) {
        setPopUpText("You don't have any books in your cart!");
        setIsPopUpOpen(true);
      } else {
        setCartItems(res.data.items);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCartItems();
  }, [userId]);

  const removeFromCart = async (bookId) => {
    try {
      setLoading(true);
      const response = await axios.post('cart/remove-from-cart', { userId, bookId });
      console.log(response.data);
      setPopUpText("Removed from the cart");
      setIsPopUpOpen(true);
      fetchCartItems();
    } catch (error) {
      console.error('Error removing from cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const reserveBook = async (bookId, fine) => {
    try {
      setLoading(true);
      const selectedDate = willUseByMap[bookId];
      if (!selectedDate) {
        setPopUpText("Please select a date");
        setIsPopUpOpen(true);
        return;
      }
      const reserveResponse = await axios.post('reserved/add-to-reserved', {
        userId,
        bookId,
        fine,
        willUseBy: selectedDate
      });

      if (reserveResponse.data.alreadyReserved) {
        setPopUpText(reserveResponse.data.alreadyReserved);
        setIsPopUpOpen(true);
      } else if (reserveResponse.data.allCopiesReserved) {
        setPopUpText(reserveResponse.data.allCopiesReserved);
        setIsPopUpOpen(true);
      } else if (reserveResponse.data.reachedMaxLimit) {
        setPopUpText(reserveResponse.data.reachedMaxLimit);
        setIsPopUpOpen(true);
      } else {
        fetchCartItems();
        setPopUpText(`This book is reserved for you. If you are not able to give this book back by ${selectedDate}, you will be fined of $${fine}.`);
        setIsPopUpOpen(true);
      }
    } catch (error) {
      console.error('Error reserving book:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event, bookId) => {
    setWillUseByMap(prevState => ({
      ...prevState,
      [bookId]: event.target.value
    }));
  };

  return (
    <div className={styles.cartWrapper}>
      <div className={styles.cartHeader}>
        <h1>Your Book Cart</h1>
        { cartItems?.length > 0 && <p>Review and manage your selected books.</p>}
      </div>
      {loading ? (
        <Loader />
      ) : cartItems?.length === 0 ? (
        <div className={styles.emptyCart}>
          <p>Your cart is empty.</p>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.cartTable}>
            <thead>
              <tr>
                <th className={styles.headerCell}>Book Image</th>
                <th className={styles.headerCell}>Name</th>
                <th className={styles.headerCell}>Will Use By</th>
                <th className={styles.headerCell}>Reserve</th>
                <th className={styles.headerCell}>Remove</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => (
                <CartItem
                  key={index}
                  item={item}
                  removeFromCart={removeFromCart}
                  reserveBook={reserveBook}
                  willUseBy={willUseByMap[item.bookId._id]}
                  handleDateChange={(event) => handleDateChange(event, item.bookId._id)}
                />
              ))}
            </tbody>
          </table>
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

export default Cart;
