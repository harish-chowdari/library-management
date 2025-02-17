import React, { useState, useEffect } from 'react';
import axios from '../../axios/axios';
import { NavLink, useParams } from 'react-router-dom';
import "./SideBar.css";
import { FaHome,FaAlignJustify, FaRegUser, FaBook, FaUser } from "react-icons/fa";
import logo from "../../assets/[removal.ai]_ab348180-27e7-439f-b339-6d4f95342f85-screenshot-2024-03-16-at-3-46-20-am_3QQD13.png"
import BookCard from '../BookCard/BookCard';
import { Typewriter } from 'react-simple-typewriter';
import { BsCart3 } from "react-icons/bs";
import { PiBooks } from "react-icons/pi";
import { CgClose } from "react-icons/cg";
import { VscFeedback } from "react-icons/vsc";
import { FiMail } from "react-icons/fi";




const Sidebar = () => {
    const { userName } = useParams();
    const [cartItems, setCartItems] = useState([]);
    const userId = localStorage.getItem("userId");
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
            const res = await axios.get(`auth/get-user-by-id/${userId}`);
            setUserData(res.data.user);
            console.log(res.data.user)
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        };
    
        fetchUserData(); 
      }, [userId]); 




    async function fetchCartItems() {
        try {
            const res = await axios.get(`cart/get-cart/${userId}`);
            if (res.data.noCartFound) {
                // Handle no cart items found
            } else {
                setCartItems(res.data.items)
            }
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    }

    useEffect(() => {
        fetchCartItems();
        const intervalId = setInterval(fetchCartItems, 1000);
        return () => clearInterval(intervalId);
    }, [userId]);

    const handleLogout = () => {
        window.location.href = "/login";
    }

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleBookClick = (bookId) => {
        setClickedBook(bookId); 
        setSearchTerm(''); 
    };

    const filteredBooks = searchTerm.trim() !== '' ? books.filter(book =>
        book.bookName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.authorName.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    return (
        <nav className="sidebar">
            <div className="nav-links">

            <h3>
            <Typewriter
                className="typewriter"
                words={[
                    'Expand your mind with a good book.',
                    'Books are the keys to knowledge and wisdom.',
                    'Explore new worlds through the pages of a book.',
                    'Discover the power of imagination in every story.',
                    'A book is a journey waiting to be taken.',
                    'Get lost in a story and find yourself.',
                    'Books can change lives, one page at a time.',
                    'Find solace and inspiration in the pages of a book.',
                    'Open a book and open your mind to endless possibilities.',
                    'The best adventures begin with a book in hand.'
                        ]}
                loop={5000}
                cursor
                cursorStyle='_'
                typeSpeed={70}
                deleteSpeed={30}
                delaySpeed={1000}
                />

       
            </h3> 

        <div className='user-div'>
                <div className="logout" onClick={handleLogout}>
                    <button className='logout-btn' onClick={handleLogout}>Logout</button>
                </div>

                <div onClick={()=> setShowData(!showData)}  className='header-user' >
                    
                    <div >
                        
                       { showData ? <p className='my-profile-active'>My Profile</p> : <p className='my-profile'>My Profile</p>}
                    </div>
                    { showData && <div className="user-data">
                
                        <p className='user-ic-div'><FaUser size={22} /> {userData.name}</p>
                        <p className='cgmail-div'><FiMail size={22} /> {userData.email}</p>  
                    </div>}
                </div>

            

           

        </div>
            </div>

            <div className='logo-div'>
                <img src={logo} alt='logo' />
                
                
                <input autoFocus
                    className='search-filter'
                    type="text"
                    placeholder="Search your favourite book or author..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />

<div className='menu-icon' onClick={()=>setMenuOpen(false)}>

<NavLink   className="menu-nav-link" to={`/app/${userName}`} >
<span><FaHome size={25}/></span> Home
</NavLink>
</div> 

            <div>
                    {menuOpen ?  
                    <CgClose onClick={()=>setMenuOpen(!menuOpen)} className='menu-icn' size={25} /> 
                    :
                    <FaAlignJustify onClick={()=>setMenuOpen(!menuOpen)} className='menu-icn' size={25}/>
                    }
            
                        { menuOpen &&
                            <div className='menu-items'>
                                         
                                <div className='menu-icon' >
                                <NavLink onClick={()=>setMenuOpen(false)}
                                 className="menu-nav-link" to={`/app/${userName}/reserved-history`} >
                                     <p> <PiBooks size={25}/> Reserved Books</p>
                                </NavLink>
                                </div>
 
                                <div className='menu-icon' >

                                <NavLink onClick={()=>setMenuOpen(false)}
                                 className="menu-nav-link" to={`/app/${userName}/submitted-history`} >
                                    <p><PiBooks size={25}/> Submitted Books</p>
                                 </NavLink>
                                </div>

                                <div className='menu-icon' >
                                <NavLink onClick={()=>setMenuOpen(false)}
                                 className="menu-nav-link" to={`/app/${userName}/publication`} >
                                    <p><FaBook size={22}/> Book Publication </p>
                                </NavLink>
                                </div>

                            </div>
                        } 
                        
                </div>

                 
                
                <div>
                    <NavLink onClick={()=>setMenuOpen(false)} to={`/app/${userName}/books-cart`} className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
                        <div className='cart-div'>
                            <span>
                                <BsCart3 size={30} className='cart-icon' />
                            </span>
                            <div className='cart-count'>
                                {cartItems && cartItems.length}
                            </div>

                        </div>
                    </NavLink>
                </div>
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

           
            

            
        </nav>
    );
};

export default Sidebar;
