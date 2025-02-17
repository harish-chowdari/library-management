import React, { useState, useEffect } from 'react';
import axios from '../../axios/axios';
import Loader from '../../Components/Loader/Loader';
import { useSearchFilter } from '../../hooks/useSearchFilter'; // Import the custom hook
import BookCard from "../../Components/BookCard/BookCard"


const SearchFilter = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { searchTerm, handleSearchChange } = useSearchFilter(); // Use the custom hook

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const res = await axios.get("librarian/fetchAllBooks");
        setBooks(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const filteredBooks = books.filter(book =>
    book.bookName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.authorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="book-cards-container">
      <input
        autoFocus
        className='search-filter'
        type="text"
        placeholder="Search your favourite book or author..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      {loading ? (
        <Loader />
      ) : (
        <div className="book-cards-container">
          {filteredBooks.map((book) => (
            <div className='book-cards' key={book._id}>
            <BookCard
                                    id={book._id}
                                    title={book.bookName}
                                    author={book.authorName}
                                    imageUrl={book.bookImage}
                                />            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchFilter;
