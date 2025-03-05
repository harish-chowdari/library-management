import React, { useState, useEffect } from 'react';
import axios from '../../axios/axios';
import { NavLink, useParams } from 'react-router-dom';
import styles from './Navbar.module.css';
import { FaHome, FaAlignJustify, FaRegUser, FaBook, FaUser } from "react-icons/fa";
import logo from "../../assets/[removal.ai]_ab348180-27e7-439f-b339-6d4f95342f85-screenshot-2024-03-16-at-3-46-20-am_3QQD13.png";
import BookCard from '../BookCard/BookCard';
import { Typewriter } from 'react-simple-typewriter';
import { BsCart3 } from "react-icons/bs";
import { PiBooks } from "react-icons/pi";
import { CgClose } from "react-icons/cg";
import { VscFeedback } from "react-icons/vsc";
import { FiMail } from "react-icons/fi";

const Navbar = () => {
  const { userName } = useParams();
  const [cartItems, setCartItems] = useState([]);
  const userId = localStorage.getItem("userId");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [clickedBook, setClickedBook] = useState(null); // State to track clicked book
  const [menuOpen, setMenuOpen] = useState(false);
  const [userData, setUserData] = useState({});
  const [showData, setShowData] = useState(false);

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

  useEffect(() => {
    // Fetch user details by user ID
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`auth/get-user-by-id/${userId}`);
        setUserData(res.data.user);
        console.log(res.data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [userId]);

  async function fetchCartItems() {
    try {
      const res = await axios.get(`cart/get-cart/${userId}`);
      if (!res.data.noCartFound) {
        setCartItems(res.data.items);
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
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleBookClick = (bookId) => {
    setClickedBook(bookId);
    setSearchTerm('');
  };

  const filteredBooks = searchTerm.trim() !== '' 
    ? books.filter(book =>
        book?.bookName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
        book?.authorName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
        book?.category?.toLowerCase().includes(searchTerm?.toLowerCase())
      ) 
    : [];

  return (
    <nav className={styles.navbar}>
      <div className={styles.navLinks}>
        <div className={styles.userDiv}>
          {/* Optional user profile info */}
        </div>
      </div>

      <div className={styles.logoDiv}>
        <div className={styles.menuIcon} onClick={() => setMenuOpen(false)}>
          <NavLink className={styles.menuNavLink} to={`/app/${userName}`}>
            <span>
              <FaHome size={25} /> Home
            </span>
          </NavLink>
        </div>
        <input
          autoFocus
          className={styles.searchFilter}
          type="text"
          placeholder="Search your favourite book or author..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <div className={styles.navActions}>
          <div className={styles.logout} onClick={handleLogout}>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              Logout
            </button>
          </div>
          <div>
            {menuOpen ? (
              <CgClose
                onClick={() => setMenuOpen(!menuOpen)}
                className={styles.menuIcn}
                size={25}
              />
            ) : (
              <FaAlignJustify
                onClick={() => setMenuOpen(!menuOpen)}
                className={styles.menuIcn}
                size={25}
              />
            )}
            {menuOpen && (
              <div className={styles.menuItems}>
              {/* cart */}
                <NavLink to={`/app/${userName}/cart`} className={styles.menuNavLink}>
                  <p>
                    <BsCart3 size={25} /> Cart
                  </p>
                </NavLink>
                  <NavLink to={`/app/${userName}/reserved-history`} onClick={() => setMenuOpen(false)} className={styles.menuNavLink}>
                    <p>
                      <PiBooks size={25} /> Reserved Books
                    </p>
                  </NavLink>
                  <NavLink to={`/app/${userName}/submitted-history`} onClick={() => setMenuOpen(false)} className={styles.menuNavLink}>
                    <p>
                      <PiBooks size={25} /> Submitted Books
                    </p>
                  </NavLink>
                  <NavLink to={`/app/${userName}/publication`} onClick={() => setMenuOpen(false)} className={styles.menuNavLink}>
                    <p>
                      <FaBook size={22} /> Book Publication
                    </p>
                  </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>

      {filteredBooks.length > 0 && (
        <div className={styles.filteredCardsContainer}>
          {filteredBooks.map((book) => (
            <div
              className={styles.bookCards}
              key={book._id}
              onClick={() => handleBookClick(book._id)}
            >
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

export default Navbar;
