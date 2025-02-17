import React, { useState } from 'react';
import './searchbar.css'; 
import axios from "../../axios/axios"

const SearchBar = ({ onSearch,onSelectBook ,books}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (onSearch) {
        onSearch(searchTerm);
        }
    }; 

    const fetchResults = async (query) => {
        setIsSearching(true);
        try{
            const response = await axios.get(`/librarian/getBookSuggestions/${query}`);
            console.log(response)
            console.log(response.data)
            setResults(response.data);
            setIsSearching(false);
        }catch(error){
            console.log(error);
        }
    };

    const handleInputChange = async (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.length > 1) {
        await fetchResults(value);
        } else {
        setResults([]);
        }
    };

    const handleSelectBook = (bookId) => {
        onSelectBook(bookId); // Pass the selected book's ID to the parent component
        setResults([]); // Clear search results
        setSearchTerm(''); // Clear search input
    };

    return (
        <div className="search-bar">
            <form onSubmit={handleSubmit} className='search-bar-form'>
                <div className='search-bar-container'>
                    <div className='search-sub-bar-container'>
                        <input
                            type="text"
                            placeholder="Search your favourite books"
                            value={searchTerm}
                            onChange={handleInputChange}
                            className='search-bar-input'
                        />
                    </div>
                    {isSearching && <div className="search-loading">Searching...</div>}
                    {results.length > 0 && (
                        <ul className="search-results">
                            {results.map((result) => (
                            <li key={result.id} onClick={() => handleSelectBook(result.id)}>
                                {result.bookName}
                            </li>
                            ))}
                        </ul>
                    )}
                </div>
            </form>
        </div>
    );
};

export default SearchBar;


