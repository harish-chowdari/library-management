import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from '../../axios/axios';
import { FaStar, FaRegStar } from 'react-icons/fa'; // Import star icons
import "./BookCard.css";
import stock from "../../assets/Untitled design.png";

// Custom Star component to fill stars with percentages
const Star = ({ percentage }) => {
  return (
    <div style={{ position: 'relative', display: 'inline-block', width: '1em', height: '1em' }}>
      <FaRegStar color="#ffd700" style={{ position: 'absolute', top: 0, left: 0 }} />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${percentage}%`,
          overflow: 'hidden',
        }}
      >
        <FaStar color="#ffd700" />
      </div>
    </div>
  );
};

// Function to generate star components based on the rating
const renderStars = (rating) => {
  const fullStars = Math.floor(rating); // Number of full stars
  const fractionalPart = (rating % 1) * 100; // Fractional part as percentage
  const emptyStars = Math.floor(5 - fullStars - (fractionalPart > 0 ? 0.5 : 0)); // Number of empty stars

  const stars = [];

  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(<Star key={`star-full-${i}`} percentage={100} />);
  }

  // Add half star if needed
  if (fractionalPart > 0) {
    stars.push(<Star key="star-half" percentage={fractionalPart} />);
  }

  // Add empty stars
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<Star key={`star-empty-${i}`} percentage={0} />);
  }

  return stars;
};

const BookCard = ({ title, imageUrl, id }) => {
  const { userName } = useParams();
  const [isOutOfStock, setIsOutOfStock] = useState(false);
  const [nearestWillUseBy, setNearestWillUseBy] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);




  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get(
        `feedback/all-feedbacks/${id}`
      );
      setFeedbacks(response.data.feedbacks);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };



  const fetchReservationData = async () => {
    try {
      const res = await axios.get(
        `reserved/book-copies-count/${id}`
      );
      const resCount = res.data.reservedCount;

      const bookResponse = await axios.get(
        `librarian/getbook/${id}`
      );
      const numberOfCopies = bookResponse.data.numberOfCopies;

      setIsOutOfStock(resCount >= numberOfCopies);

      const nearestDateRes = await axios.get(
        `reserved/nearest-will-use-by/${id}`
      );
      const nearestDate = nearestDateRes.data.nearestWillUseBy;
      setNearestWillUseBy(nearestDate);
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    
    fetchFeedbacks();
    fetchReservationData();
  }, [id]);

    

    

  const averageRating = feedbacks.length
    ? feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0) / feedbacks.length
    : 0;

  return (
    <div className="book-card" title="View full details">
      <div className="stock-div">
        {isOutOfStock && (
          <img src={stock} className="out-of-stock" alt="Out of Stock" />
        )}
      </div>
      <div className="book-image">
        <Link className="link" to={`/app/${userName}/book/${id}`}>
          <img src={imageUrl} alt={title.toUpperCase()} />
          <div className="book-title">
            <h3 style={{ fontSize: '1rem', margin: '8px' }}>{title}</h3>
          </div>
        </Link>
      </div>
      <div className="available-date">
        {isOutOfStock && (
          <p>
            <strong>Available On:</strong> {nearestWillUseBy ? nearestWillUseBy.slice(0, 10) : 'N/A'}
          </p>
        )}
      </div>  
            <div className='book-rating'>
            <p>
                {renderStars(averageRating)}
            </p>
            </div>
    </div>
  );
};

export default BookCard;
