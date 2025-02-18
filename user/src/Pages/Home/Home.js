import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "./Home.css";
import BookCard from '../../Components/BookCard/BookCard';
import axios from '../../axios/axios';
import Loader from '../../Components/Loader/Loader';

const Home = () => {
    const { userName } = useParams();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 5;

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

    useEffect(() => {
        fetchBooks();
    }, []);

    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

    return (
        <div className='layout'>
            <div className='bg-img'></div>
            <div className="content">
                {books.length === 0 ? <h3>Books List is empty</h3> : <h3>Lists of Books</h3>}
                {loading ? (
                    <Loader />
                ) : (
                    <>
                        <div className="book-cards-container">
                            {currentBooks.map((book) => (
                                <div className='book-cards' key={book._id}>
                                    <BookCard
                                        id={book._id}
                                        fetchBooks={fetchBooks}
                                        title={book.bookName}
                                        author={book.authorName}
                                        imageUrl={book.bookImage}
                                        setBooks={setBooks}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="pagination-controls">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="pagination-btn"
                            >
                                Previous
                            </button>
                            <span className="page-info">Page {currentPage}</span>
                            <button
                                onClick={() => setCurrentPage((prev) => (indexOfLastBook < books.length ? prev + 1 : prev))}
                                disabled={indexOfLastBook >= books.length}
                                className="pagination-btn"
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Home;
