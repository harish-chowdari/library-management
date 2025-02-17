import React, { useState, useEffect } from 'react';
import axios from '../../axios/axios';
import Loader from '../../components/loader/loader';
import "./UserBooks.css"; // Adjust the CSS file import accordingly
import PopUp from '../../components/popups/popup';
import { useParams } from 'react-router-dom';

const UserBooks = () => {
  const [userBooks, setUserBooks] = useState([]);
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [popUpText, setPopUpText] = useState("");
  const { userId } = useParams();

  const [userData, setUserData] = useState(null); // State to store user data
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`auth/get-user-by-id/${userId}`);
        setUserData(res.data.user.name);
        setLoading(false); // Set loading to false
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }; 

    fetchUserData();
  }, [userId]);

  const fetchUserBooks = async () => {
    try {
      const res = await axios.get(`reserved/books-reserved/${userId}`);
      setUserBooks(res.data.booksReserved.items || []);
      console.log(res.data)
    } catch (error) {
      console.error('Error fetching user books:', error);
    }
  };

  useEffect(() => {
    fetchUserBooks();
  }, [userId]);

  // Function to check if the current date exceeds the willUseBy date for a book item
  const daysExceeded = (willUseBy) => {
    const currentDate = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const currentTimestamp = new Date(currentDate).getTime();
    const willUseByTimestamp = new Date(willUseBy).getTime();
    const daysDifference = Math.floor((currentTimestamp - willUseByTimestamp) / millisecondsPerDay);
    return daysDifference;
  };

  // Function to submit a book
  const submitBook = async (bookId, _id) => {
    try {
      setLoading(true);

      // Fetch the book details from userBooks using bookId
      const book = userBooks.find(item => item._id === bookId);

      // Call the endpoint to submit the book
      const submitResponse = await axios.post('submit/submit-book', {
        userId,
        bookId: book.bookId._id,
        bookName: book.bookId.bookName, 
        authorName: book.bookId.authorName,
        isbnNumber: book.bookId.isbnNumber,
        publishedDate: book.bookId.publishedDate,
        bookImage: book.bookId.bookImage,
        description: book.bookId.description
      });

      // Handle response and display pop-up accordingly
      if (submitResponse.data.alreadySubmitted) 
      {
        setPopUpText("Submission successful");
      } 
      
      else 
      {
        setPopUpText("Submission successful");
        console.log(submitResponse.data);
        
      }

      console.log(submitResponse.data)

      
      

      // Placeholder for deleting the book from the reservation
      await axios.post('reserved/remove-from-reserved', { userId, _id });

      fetchUserBooks(); 
      
    } catch (error) {
      console.error('Error submitting book:', error);
      setPopUpText(error.message); // Set error message in the pop-up
    } finally {
      setLoading(false);
      setIsPopUpOpen(true); // Always open the pop-up after submission
    }
  };

  
  
  const removeFine = async (bookId) => {
    try {
      setLoading(true);
  
      // Call the endpoint to remove the fine for the specific book
      const removeFineResponse = await axios.put(`reserved/books-reserved/remove-fine/${userId}`, { bookId });
  
      // Handle response and display pop-up accordingly
      if (removeFineResponse.data.fineRemoved) {
        setPopUpText("Fine removed successfully");
        fetchUserBooks();
      } else {
        setPopUpText("Failed to remove fine");
        console.log(bookId);
      }
    } catch (error) {
      console.error('Error removing fine:', error);
      setPopUpText(error.message); // Set error message in the pop-up
    } finally {
      setLoading(false);
      setIsPopUpOpen(true); // Always open the pop-up after attempting to remove the fine
    }
  };

  


  const daysExceededOrRemaining = (willUseBy) => {
    const currentDate = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const currentTimestamp = new Date(currentDate).getTime();
    const willUseByTimestamp = new Date(willUseBy).getTime();
    const daysDifference = Math.floor((willUseByTimestamp - currentTimestamp) / millisecondsPerDay);
    return daysDifference;
  };

  const displayFineOrRemaining = (days, fine) => {
    // Extract numeric part of fine using regular expression if fine is defined
    const fineAmount = fine?.match(/\d+(\.\d+)?/);

    if (days < 0 && fineAmount) {
      const numberOfDaysExceeded = Math.abs(days);
      const totalFine = parseFloat(fineAmount[0]) * numberOfDaysExceeded;
      // Round totalFine to two decimal places
      const roundedFine = totalFine.toFixed(2);
      return <span style={{ color: "red" }}>  {numberOfDaysExceeded} days exceeded. <br/> Total fine: {roundedFine}$</span>;
    } else if (days < 0 && !fineAmount) {
      return <span>Fine Paid</span>;
    } else if (days === 0) {
      return <span>Today is the last day to use this book</span>;
    } else {
      return <span>{days} days remaining</span>;
    }
  };

  return (
    <div className="user-books-container">
      {loading ? ( // Display loader if loading is true
        <Loader />
      ) : (
        <>
        

          <div className='user-books-img'></div>
          <h2>{userData} Books</h2>

          {userBooks.length === 0 ? <p className='user-books-empty-history'>User Books are empty</p>
        :
        
          <div className='user-books-division'>
            <div className='user-books-format-main user-books-headings'>
              <h3>Book</h3>
              <h3>Name</h3>
              <h3>Author</h3>
              <h3>Reserved</h3>
              <h3>Will Use By</h3> 
              <h3>Days</h3>
              <h3>Fine</h3>
              <h3>Actions</h3>
            </div>
            <hr className='user-books-hr'/>
            {userBooks.map((book, index) => (
              <div className='user-books-main-div' key={index}>
                <div className="user-books-format-main user-books-items-format">
                  <img src={book.bookId.bookImage} alt={book.bookName} />
                  <p>{book.bookId.bookName}</p>
                  <p>{book.bookId.authorName}</p>
                  <p>{book.createdDate.slice(0, 10)}</p>
                  <p>{book.willUseBy.slice(0, 10)}</p>
                  <p className='user-books-fine'>{displayFineOrRemaining(daysExceededOrRemaining(book.willUseBy), book.fine)}</p>
                  
                  <button onClick={() => removeFine(book.bookId._id)}>Collect</button>
                  
                  
                  {book.submitStatus === "Submitting" ? 
                    <button onClick={() => submitBook(book._id, book._id)}>Submit</button>
                    : ""
                  }
                </div>
                <hr className='bottom-hr'/>
              </div>
            ))}
          </div>
        }
        </>
      )}
      <PopUp
        isOpen={isPopUpOpen}
        close={() => setIsPopUpOpen(false)}
        text={popUpText}
      /> 
    </div>
  );
};

export default UserBooks;