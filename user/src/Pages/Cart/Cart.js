import React, { useState, useEffect } from 'react';
import axios from '../../axios/axios';
import Loader from '../../Components/Loader/Loader';
import PopUp from '../../Components/Popups/Popup';
import CartItem from '../../Components/CartItem/CartItem';
import './Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId] = useState(localStorage.getItem("userId"));
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [popUpText, setPopUpText] = useState("");
  const [willUseByMap, setWillUseByMap] = useState({});
  const [reservedBooks, setReservedBooks] = useState([]);

  // Function to fetch cart items
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

  // Function to remove a book from the cart
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

  // Function to reserve a book
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
        setPopUpText("This book is reserved for you");
        setIsPopUpOpen(true);
      }

      console.log(reserveResponse.data);
    } catch (error) {
      console.error('Error reserving book:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle date change
  const handleDateChange = (event, bookId) => {
    setWillUseByMap(prevState => ({
      ...prevState,
      [bookId]: event.target.value
    }));
  };

  return (
    <div className="cart-wrapper">
      <div className="cart-header">
        <h1>Your Book Cart</h1>
        <p>Review and manage your selected books.</p>
      </div>
      {loading ? (
        <Loader />
      ) : cartItems.length === 0 ? (
        <div className="empty-cart-message">
          <p>Your cart is empty.</p>
        </div>
      ) : (
        <div className="cart-grid">
          {cartItems.map((item, index) => (
            <CartItem
              key={index}
              item={item}
              removeFromCart={removeFromCart}
              reserveBook={reserveBook}
              willUseBy={willUseByMap[item.bookId._id]}
              handleDateChange={(event) => handleDateChange(event, item.bookId._id)}
              reservedBooks={reservedBooks}
            />
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

export default Cart;
