import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaSortAlphaDown, FaSortAlphaUp } from 'react-icons/fa';
import "./home.css";
import BookCard from '../../components/bookCard/bookCard';
import axios from '../../axios/axios';
import Loader from '../../components/loader/loader';

const Home = () => {
    const { userName } = useParams();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState('asc');
    const booksPerPage = 8;

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

    const sortedBooks = [...books].sort((a, b) => {
        if (sortOrder === 'asc') {
            return a.bookName.localeCompare(b.bookName);
        } else {
            return b.bookName.localeCompare(a.bookName);
        }
    });

    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = sortedBooks.slice(indexOfFirstBook, indexOfLastBook);

    return (
        <div className='layout'>
            <div className='bg-img'></div>
            <div className="content">
                {books.length === 0 ? <h3>Books List is empty</h3> : <h3>Lists of Books</h3>}

                <div className="sort-controls">
                    <button
                        onClick={() => { setSortOrder('asc'); setCurrentPage(1); }}
                        className="sort-btn"
                        disabled={sortOrder === 'asc'}
                    >
                        <FaSortAlphaDown />
                    </button>
                    <button
                        onClick={() => { setSortOrder('desc'); setCurrentPage(1); }}
                        className="sort-btn"
                        disabled={sortOrder === 'desc'}
                    >
                        <FaSortAlphaUp />
                    </button>
                </div>

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
                                onClick={() => setCurrentPage((prev) => (indexOfLastBook < sortedBooks.length ? prev + 1 : prev))}
                                disabled={indexOfLastBook >= sortedBooks.length}
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
