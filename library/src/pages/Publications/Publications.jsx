import React, { useState, useEffect } from 'react';
import axios from '../../axios/axios';
import PopUp from '../../components/popups/popup';
import Loader from '../../components/loader/loader';
import './Publications.css';
import { FaArrowRight } from "react-icons/fa6";



const Publications = () => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [popUpText, setPopUpText] = useState('');
  const [fineAndCopies, setFineAndCopies] = useState({});
  const [popupVisible, setPopupVisible] = useState(false);
  const [activePublication, setActivePublication] = useState(null);



  const fetchPublications = async () => {
    try {
      const res = await axios.get('publication/all-publications');
      setPublications(res.data);
    } catch (error) {
      console.error('Error fetching publications:', error);
      setPopUpText('Error fetching publications');
      setIsPopUpOpen(true);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchPublications();
  }, []);

  // Correctly define the handleInputChange function
  const handleInputChange = (publicationId, fieldName, value) => {
    setFineAndCopies((prevState) => ({
      ...prevState,
      [publicationId]: {
        ...prevState[publicationId],
        [fieldName]: value,
      },
    }));
  };

  const handleProceed = (publication) => {
    setActivePublication(publication);
    setPopupVisible(true);
  };

  const handleApprove = async (id) => {
    const fineAndCopiesData = fineAndCopies[activePublication._id] || {};
    const { fine, numberOfCopies } = fineAndCopiesData;

    if (!fine || !numberOfCopies) {
      setPopUpText('Please enter fine and number of copies.');
      setIsPopUpOpen(true);
      return;
    }

    try {
      const approveData = {
        bookName: activePublication.bookName,
        authorName: activePublication.authorName,
        isbnNumber: activePublication.isbnNumber,
        publishedDate: activePublication.publishedDate,
        description: activePublication.description,
        fine,
        numberOfCopies,
        bookImage: activePublication.bookImage, // Include book image
      };

      const res = await axios.post(
        "librarian/publish-book-by-user",
        approveData
      );

      if (res.data.bookAdded) {
        setPopUpText('Publication approved and book added successfully.');
        setIsPopUpOpen(true);
        const deleteRes = await axios.delete(`publication/remove-publication/${id}`)
        fetchPublications()
      }
    } catch (error) {
      setPopUpText('Error submitting publications.');
      setIsPopUpOpen(true);
    } finally {
      setPopupVisible(false);
    }
  };

  return (
    <div className="publications-container">
      {loading ? (
        <Loader />
      ) : (
        <>
          <h2>Publications</h2>
          {publications.length === 0 ? (
            <p>No publications found.</p>
          ) : (
            <div className="publications-list">
              {publications.map((publication) => (
                <div className="publication-item" key={publication._id}>
                  <img
                    src={publication.bookImage}
                    alt={publication.bookName}
                    className="publication-image"
                  />

                  <div className="publication-details">
                    <h3>{publication.bookName}</h3>
                    <p><strong>Author:</strong> {publication.authorName}</p>
                    <p><strong>ISBN:</strong> {publication.isbnNumber}</p>
                    <p><strong>Published On:</strong> {publication.publishedDate}</p>
                    <p><strong>Description:</strong> {publication.description}</p>
                  
                  
                    <div className='arrow-ic' onClick={() => handleProceed(publication)} >
                      <FaArrowRight className='fa-arrow'
                      icon="fa-solid fa-arrow-right" />
                    </div>
                  
                  
                </div>
                
                </div>
              ))}
            </div>
          )}
          {popupVisible && activePublication && (
            <>
              <div className={`publication-popup show`}>
                <h3>Approve {activePublication.bookName}</h3>
                <input
                  type="text"
                  placeholder="Fine per day in $"
                  onChange={(e) => handleInputChange(activePublication._id, 'fine', e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Number of Copies"
                  min="1"
                  onChange={(e) => handleInputChange(activePublication._id, 'numberOfCopies', e.target.value)}
                />
                <button onClick={()=>handleApprove(activePublication._id)}>Approve</button>
              </div>
              <div
                className={`popup-backdrop show`}
                onClick={() => setPopupVisible(false)}
              />
            </>
          )}
        </>
      )}
      <PopUp
        isOpen={isPopUpOpen}
        close={() => setIsPopUpOpen(false)}
        text={popUpText}
      />
    </div>
  );
};

export default Publications;
