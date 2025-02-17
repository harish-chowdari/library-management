import React, { useState, useEffect } from 'react';
import axios from '../../axios/axios';
import { NavLink, useParams } from 'react-router-dom';
import './Users.css';
import Loader from '../../components/loader/loader';

const ReservedUsers = () => {
  const { userName } = useParams();
  const [reservedUsers, setReservedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchReservedUsers = async () => {
      try {
        const res = await axios.get('reserved/all-reserved-books');

        if (Array.isArray(res.data.allReserved)) {
          const users = res.data.allReserved
            .filter((reservedItem) => reservedItem.userId) // Ensure userId exists
            .map((reservedItem) => ({
              user: reservedItem.userId,
              reservedBooksCount: reservedItem.items.length,
            }));

          setReservedUsers(users);
        } else {
          console.error('Invalid data structure received:', res.data);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reserved users:', error);
        setLoading(false);
      }
    };

    fetchReservedUsers();
  }, []);

  const isNumeric = (value) => {
    const number = parseFloat(value);
    return !isNaN(number) && isFinite(number);
  };

  // Filter reserved users based on the search query
  const filteredUsers = reservedUsers.filter((reservedUser) => {
    if (!reservedUser.user) {
      return false;
    }

    const query = searchQuery.trim().toLowerCase();
    const nameMatch = reservedUser.user.name.trim().toLowerCase().includes(query);

    const countMatch = isNumeric(query)
      ? reservedUser.reservedBooksCount === parseInt(query, 10)
      : false;

    return nameMatch || countMatch; 
  });

  return (
    <div className='res-container'>
      {loading ? (
        <h2>
          <Loader />
        </h2>
      ) : (
        <>
          <h2>Reserved Users</h2>
          <hr />
          <input
            autoFocus
            type="text"
            placeholder="Search by username or reserved count..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='search-input'
          />
          <table className='res-users-table'>
            <thead>
              <tr>
                <th className='s-no'>S.No</th>
                <th className='lib-res-count'>Reserved Count</th>
                <th>User Name</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={3} >
                    No users found matching "{searchQuery}"
                  </td>
                </tr>
              ) : (
                filteredUsers.map((reservedUser, index) => (
                  <tr key={reservedUser.user._id}>
                    <td>{index + 1}</td>
                    <td>{reservedUser.reservedBooksCount}</td>
                    <td>
                      <NavLink
                        to={`/app/${userName}/reserved-users/${reservedUser.user._id}`}
                      >
                        <button className='full-width-button'>
                        {reservedUser.user.name}
                        </button>
                      </NavLink>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default ReservedUsers;
