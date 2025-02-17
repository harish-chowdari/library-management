import React, { useState, useEffect } from 'react';
import axios from '../../axios/axios';
import { useParams } from 'react-router-dom';
import "./SingleBook.css";
import { Typewriter } from 'react-simple-typewriter';
import Loader from '../../Components/Loader/Loader';
import PopUp from '../../Components/Popups/Popup';
import Feedbacks from "../../Components/Feedbacks/Feedbacks"


const SingleBook = ({ cart, setCart }) => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    async function getBook() {
      try {
        const res = await axios.get(`librarian/getbook/${id}`);
        setBook(res.data);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error('Error fetching book:', error);
      }
    }

    getBook();
  }, [id]);

  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [popUpText, setPopUpText] = useState("");
  const [isBackgroundBlurred, setIsBackgroundBlurred] = useState(false);
  const blurredBackgroundStyles = isBackgroundBlurred
    ? {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(100, 100, 100, 0.5)",
        backdropFilter: "blur(1.8px)",
        zIndex: 1,
      }
    : {};

    const addToCart = async () => {
      const userId = localStorage.getItem("userId");
      if (book && userId) {
        try {
          setLoading(true); // Set loading to true when adding to cart
          const response = await axios.post('cart/add-to-cart', {
            userId: userId,
            bookId: book._id,
            quantity: 1
          });
          console.log(response.data)
          
          if (response.data.alreadyAdded) {
            setPopUpText("This Book is already added to cart");
            setIsPopUpOpen(true);
          } 
          
          else {
            setPopUpText("This book is successfully added to the cart");
            setIsPopUpOpen(true);
            setCart([...cart, { bookId: book._id, quantity: 1 }]);
          }
          console.log(response.data);
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
    <div className='book-container'>
    <div className="single-bg-book">

</div>
      
      {loading ? (
        <Loader /> // Show loader component while loading
      ) : (
        book ? (
          <div className="book-details">
            <div className="book-left">
              <img width="100px" src={book.bookImage} alt={book.bookName} />
            </div>
            <div className="book-right">
              <div>
                <h2>{book.bookName}</h2>
                <hr/>
              </div>
              <div className='p-tags'>
                <p><span>Author :</span> {book.authorName}</p>
                <p><span>isbnNumber :</span> {book.isbnNumber}</p>
                <p><span>Published in :</span>{formatDate(book.publishedDate)}</p>
                <p><span>Description :</span> {book.description}</p>
              </div>
              <div>
                <button className="add-to-cart-btn" onClick={addToCart}>Add to Cart</button>
              </div>
            </div>
          </div>
        ) : (
          <p>Book not found</p>
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