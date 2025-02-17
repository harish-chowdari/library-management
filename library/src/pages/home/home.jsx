import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaRegUser } from "react-icons/fa";



import "./home.css"
import BookCard from '../../components/bookCard/bookCard';
import axios from '../../axios/axios';
import Loader from '../../components/loader/loader';

const Home = () => {
    const { userName } = useParams();

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false); 


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
    }


    useEffect(() => {
        
        fetchBooks();
    }, []);

    return (
        <div className='layout'>
            <div className='bg-img'></div>
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
                                    fetchBooks={fetchBooks}
                                    title={book.bookName}
                                    author={book.authorName}
                                    imageUrl={book.bookImage}
                                    setBooks={setBooks}
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
