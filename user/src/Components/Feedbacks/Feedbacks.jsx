import React, { useState, useEffect } from 'react';
import axios from '../../axios/axios';
import { useParams } from 'react-router-dom';
import { FaStar, FaRegStar, FaUser } from 'react-icons/fa';
import Design from './Feedbacks.module.css';

// Custom component to represent partially filled stars
const Star = ({ percentage }) => (
  <div style={{ position: 'relative', display: 'inline-block', width: '1em', height: '1em' }}>
    <FaRegStar color="#ffd700" style={{ position: 'absolute', top: 0, left: 0 }} />
    <div
      style={{ position: 'absolute', top: 0, left: 0, width: `${percentage}%`, overflow: 'hidden' }}
    >
      <FaStar color="#ffd700" />
    </div>
  </div>
);

// Function to render stars based on the given average rating
const renderStars = (averageRating) => {
  const fullStars = Math.floor(averageRating);
  const fractionalPart = (averageRating % 1) * 100;
  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(<Star key={`star-full-${i}`} percentage={100} />);
  }

  if (fractionalPart > 0) {
    stars.push(<Star key="star-fraction" percentage={fractionalPart} />);
  }

  const emptyStars = 5 - stars.length;
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<Star key={`star-empty-${i}`} percentage={0} />);
  }

  return stars;
};

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc');
  const [starFilter, setStarFilter] = useState('');
  const { id } = useParams();

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get(`feedback/all-feedbacks/${id}`);
        setFeedbacks(response.data.feedbacks);
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
      }
    };

    fetchFeedbacks();
  }, [id]);

  const averageRating = feedbacks.length
    ? feedbacks.reduce((acc, cur) => acc + cur.rating, 0) / feedbacks.length
    : 0;

  const starDistribution = [1, 2, 3, 4, 5].map((star) => {
    const count = feedbacks.filter((f) => f.rating === star).length;
    const percentage = (count / feedbacks.length) * 100;
    return { star, count, percentage };
  });

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleStarFilterChange = (e) => {
    setStarFilter(e.target.value);
  };

  const sortedAndFilteredFeedbacks = feedbacks
    .filter((feedback) => !starFilter || feedback.rating === parseInt(starFilter))
    .sort((a, b) => {
      return sortOrder === 'asc' ? a.rating - b.rating : b.rating - a.rating;
    });

  return (
    <div className={Design.fbContainer}>
      <div className={Design.fbLeft}>
        <h2>User Ratings</h2>
        <div className={Design.starContainer}>
          {renderStars(averageRating)}
          <span className={Design.averageText}>{averageRating.toFixed(1)} out of 5</span>
        </div>
        <p>Total Ratings: {feedbacks.length}</p>

        {starDistribution.map((data) => (
          <div key={data.star} style={{ display: 'flex', alignItems: 'center' }}>
            <span className={Design.starsSpan}>{data.star} stars</span>
            <div
              style={{
                border: '1px solid',
                height: '1em',
                width: '150px',
                backgroundColor: 'lightgray',
                margin: '10px 20px',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${data.percentage}%`,
                  backgroundColor: '#ffd100',
                }}
              />
            </div>
            <span>{data.percentage.toFixed(1)}%</span>
          </div>
        ))}
      </div>

      <div className={Design.fbRight}>
        <div className={Design.sortContainer}>
          <label htmlFor="sortOrder">Sort by Rating:</label>
          <select
            id="sortOrder"
            className={Design.sortSelect}
            value={sortOrder}
            onChange={handleSortOrderChange}
          >
            <option value="asc">Low to High</option>
            <option value="desc">High to Low</option>
          </select>

          <label htmlFor="starFilter">Filter by Star Rating:</label>
          <select
            id="starFilter"
            className={Design.sortSelect}
            value={starFilter ?? ''}
            onChange={handleStarFilterChange}
          >
            <option value="">All Stars</option>
            <option value="1">1 Star</option>
            <option value="2">2 Stars</option>
            <option value="3">3 Stars</option>
            <option value="4">4 Stars</option>
            <option value="5">5 Stars</option>
          </select>
        </div>

        <div className={Design.fbDivision}>
          {sortedAndFilteredFeedbacks.length > 0 ? (
            sortedAndFilteredFeedbacks.map((feedback, index) => (
              <div className={Design.feedback} key={index}>
                <p className={Design.userIcon}>
                  <FaUser size={24} /> <span>{feedback.userName}</span>
                </p>
                <p>
                {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            color={
                              feedback.rating >= star ? 'gold' : 'gray' 
                            }
                           
                          />
                        ))} 
                </p>
                <p>{feedback.feedback}</p>
                <hr className={Design.hr} />
              </div>
            ))
          ) : (
            <p>No reviews available for the selected star rating.</p>
          )}
        </div>
      </div>
    </div>
  ); 
};

export default Feedbacks;
