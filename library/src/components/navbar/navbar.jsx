import React, { useState, useEffect } from 'react';
import axios from '../../axios/axios';
import { NavLink, useParams } from 'react-router-dom';
import "./navbar.css"
import { FaHome,FaAlignJustify, FaRegUser, FaUsers, FaBook, FaUser } from "react-icons/fa";
import logo from "../../assets/[removal.ai]_ab348180-27e7-439f-b339-6d4f95342f85-screenshot-2024-03-16-at-3-46-20-am_3QQD13.png"
import BookCard from '../bookCard/bookCard';
import { Typewriter } from 'react-simple-typewriter';
import { BsCart3 } from "react-icons/bs";
import { PiBooks } from "react-icons/pi";
import { CgClose } from "react-icons/cg";
import { FiMail } from "react-icons/fi";



const Navbar = () => {
    const { userName } = useParams();
    const librarianId = localStorage.getItem("librarianId");
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [clickedBook, setClickedBook] = useState(null); // State to track clicked book
    const [menuOpen, setMenuOpen] = useState(false)

    const [userData, setUserData] = useState({});

    const [showData, setShowData] = useState(false)

    

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
        }
        fetchBooks();
    }, []);



    useEffect(() => {
        // Fetch user details by user ID
        const fetchUserData = async () => {
          try {
            const res = await axios.get(`auth/get-librarian-by-id/${librarianId}`);
            setUserData(res.data.librarian);
            console.log(res.data.librarian)
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        };
    
        fetchUserData(); 
      }, [librarianId]); 





   

    const handleLogout = () => {
        window.location.href = "/login";
    }

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleBookClick = (bookId) => {
        setClickedBook(bookId); // Set the clicked book
        setSearchTerm(''); // Clear the search term
    };

    const filteredBooks = searchTerm.trim() !== '' ? books.filter(book =>
        book.bookName.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
        book.authorName.toLowerCase().includes(searchTerm.trim().toLowerCase())
    ) : [];

    return (
        <nav className="navbar">
            <div className="nav-links">
                <div className='user-div'>
                    {/* <div onClick={()=> setShowData(!showData)}  className='header-user' >
                        
                        <div >
                            
                        { showData ? <p className='my-profile-active'>My Profile</p> : <p className='my-profile'>My Profile</p>}
                        </div>
                        { showData && <div className="user-data">
                    
                            <p className='user-ic-div'><FaUser size={22} /> {userData.name}</p>
                            <p className='cgmail-div'><FiMail size={22} /> {userData.email}</p>  
                        </div>}
                    </div> */}
                </div>
            </div>

            <div className='logo-div'>
                <div className='menu-icon' >
                    <NavLink  to={`/app/${userName}`} className="menu-nav-link" onClick={()=>setMenuOpen(false)}>
                    <span><FaHome size={25}/></span> Home
                    </NavLink>
                </div>  
                
                <input autoFocus
                    className='search-filter'
                    type="text"
                    placeholder="Search your favourite book or author..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            <div className='div'>
                <div>
                {menuOpen ?  
                <CgClose onClick={()=>setMenuOpen(!menuOpen)} className='menu-icn' size={25} /> 
                :
                <FaAlignJustify onClick={()=>setMenuOpen(!menuOpen)} className='menu-icn' size={25}/>
                }
        
                { menuOpen &&
                    <div className='menu-items'>
                                    
                        <div className='menu-icon' >
                        <NavLink className="menu-nav-link" onClick={()=>setMenuOpen(false)}
                            to={`/app/${userName}/add-books`}
                        >
                
                            <span><PiBooks size={25}/></span> Add Books
                            </NavLink>
                        </div>

                        <div className='menu-icon' >

                        <NavLink to={`/app/${userName}/reserved-users`} className="menu-nav-link" onClick={()=>setMenuOpen(false)}>
                
                            <span><FaUsers size={25}/></span> Reserved Users
                            </NavLink>
                        </div>


                        <div className='menu-icon' >

                        <NavLink to={`/app/${userName}/publications`} className="menu-nav-link" onClick={()=>setMenuOpen(false)}>
                
                            <span><FaBook size={22}/></span> Publications
                            </NavLink>
                        </div>
                        

                    </div>
                }
                    
                </div>

                {filteredBooks.length > 0 && (
                    <div className="filtered-cards-container">
                        {filteredBooks.map((book) => (
                            <div className='book-cards' key={book._id} onClick={() => handleBookClick(book._id)}>
                                <BookCard
                                    id={book._id}
                                    title={book.bookName}
                                    author={book.authorName}
                                    imageUrl={book.bookImage}
                                />
                            </div> 
                        ))}
                    </div>
                )}  
                <div className="logout" onClick={handleLogout}>
                            <button className='logout-btn' onClick={handleLogout}>Logout</button>
                </div>
            </div>

            
            </div>
        </nav>
    );
};

export default Navbar;
