import React, { useState, useEffect } from 'react';
import axios from '../../axios/axios';
import Loader from '../../Components/Loader/Loader';
import "./Cart.css";
import PopUp from '../../Components/Popups/Popup';
import CartItem from '../../Components/CartItem/CartItem'; // Import CartItem component

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [popUpText, setPopUpText] = useState("");
  const [willUseByMap, setWillUseByMap] = useState({});
  const [reservedBooks, setReservedBooks] = useState([]); // State to store reserved books


  // Function to fetch cart items
  async function fetchCartItems() {
    try {
      const res = await axios.get(`cart/get-cart/${userId}`);
      if (res.data.noCartFound) {
        setPopUpText("You don't have any book in cart !!");
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



  // Function to remove a book from cart
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

      if(reserveResponse.data.alreadyReserved) {
        setPopUpText(reserveResponse.data.alreadyReserved);
        setIsPopUpOpen(true);
      } 
      
      else if (reserveResponse.data.allCopiesReserved) {
        setPopUpText(reserveResponse.data.allCopiesReserved);
        setIsPopUpOpen(true);
      } 
      
      else if (reserveResponse.data.reachedMaxLimit) {
        setPopUpText(reserveResponse.data.reachedMaxLimit);
        setIsPopUpOpen(true);
      } 
      
      else {
        fetchCartItems();

        setPopUpText("This Book is reserved for you");
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
    <div className='cart-container'>
      <div className='cart-img'></div>
      {loading ? (
        <Loader />
      ) : !cartItems || cartItems.length === 0 ? (
        <h2 className='empty-cart'>Books cart is empty</h2>
      ) : (
        <div>
          <h2>Books Cart</h2>
          <div className='cart-division'>
            <div className='cartitems-format-main cart-headings'>
              <h3>Book</h3>
              <h3>Name</h3>
              <h3>Author</h3>
              <h3>Remove</h3>
              <h3>Reserve</h3>
              <h3>Will Use By</h3>
            </div>
            <hr className='cart-hr' />
            {cartItems.map((item, index) => (
              <CartItem
                key={index}
                item={item}
                id={item.bookId._id}
                removeFromCart={removeFromCart}
                reserveBook={reserveBook}
                willUseBy={willUseByMap[item.bookId._id]}
                handleDateChange={(event) => handleDateChange(event, item.bookId._id)}
                
                reservedBooks={reservedBooks}
              />
            ))}
          </div>
        </div>
      )}
      <PopUp
        isOpen={isPopUpOpen}
        close={() => setIsPopUpOpen(false)}
        text={popUpText}
      />
    </div>
  );
}

export default Cart;
