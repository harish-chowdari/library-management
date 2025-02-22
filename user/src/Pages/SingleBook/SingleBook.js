import React, { useState, useEffect } from 'react';
import axios from '../../axios/axios';
import { useParams } from 'react-router-dom';
import styles from './SingleBook.module.css';
import { Typewriter } from 'react-simple-typewriter';
import Loader from '../../Components/Loader/Loader';
import PopUp from '../../Components/Popups/Popup';
import Feedbacks from "../../Components/Feedbacks/Feedbacks";

const SingleBook = ({ cart, setCart }) => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function getBook() {
      try {
        const res = await axios.get(`librarian/getbook/${id}`);
        setBook(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching book:', error);
      }
    }
    getBook();
  }, [id]);

  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [popUpText, setPopUpText] = useState("");
  
  const addToCart = async () => {
    const userId = localStorage.getItem("userId");
    if (book && userId) {
      try {
        setLoading(true);
        const response = await axios.post('cart/add-to-cart', {
          userId: userId,
          bookId: book._id,
          quantity: 1
        });
        if (response.data.alreadyAdded) {
          setPopUpText("This Book is already added to cart");
          setIsPopUpOpen(true);
        } else {
          setPopUpText("This book is successfully added to the cart");
          setIsPopUpOpen(true);
          setCart([...cart, { bookId: book._id, quantity: 1 }]);
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
      } finally {
        setLoading(false);
      }
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div className={styles.bookContainer}>
      <div className={styles.singleBgBook}></div>
      
      {loading ? (
        <Loader />
      ) : (
        book ? (
          <div className={styles.bookDetails}>
            <div className={styles.bookLeft}>
              <img src={book.bookImage} alt={book.bookName} />
            </div>
            <div className={styles.bookRight}>
              <div className={styles.bookHeader}>
                <h2>{book.bookName}</h2>
                <hr />
              </div>
              <div className={styles.pTags}>
                <p><span>Author:</span> {book.authorName}</p>
                <p><span>ISBN:</span> {book.isbnNumber}</p>
                <p><span>Published:</span> {formatDate(book.publishedDate)}</p>
                <p><span>Description:</span> {book.description}</p>
              </div>
              <div>
                <button className={styles.addToCartBtn} onClick={addToCart}>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className={styles.notFound}>Book not found</p>
        )
      )}

      <Feedbacks id={id} />

      <PopUp
        isOpen={isPopUpOpen}
        close={() => setIsPopUpOpen(false)}
        text={popUpText}
      />
    </div>
  );
};

export default SingleBook;
