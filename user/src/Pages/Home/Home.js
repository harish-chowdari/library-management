// Home.js

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../../axios/axios';
import Loader from '../../Components/Loader/Loader';
import BookCard from '../../Components/BookCard/BookCard';
import "./Home.css"


const Home = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);

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

   

   

    return (
        <div className='layout'>
            <div className="content">
                {books.length === 0 ? <h3>Books List is empty</h3> : <h3> Lists of Books</h3>}
                {loading ? (
                    <Loader />
                ) : (
                    <div className="book-cards-container">
                        {books.map((book) => (
                            <div className='book-cards' key={book._id} >
                                <BookCard
                                    id={book._id}
                                    title={book.bookName}
                                    author={book.authorName}
                                    imageUrl={book.bookImage}
                                    bookId={book._id}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
 