import React,{useState} from 'react';
import './signup.css'; // Import specific CSS for CreateAccountPage
import {Link,useNavigate} from 'react-router-dom';
import librarianImage from '../../assets/librarian.png';
import axios from "../../axios/axios"

import PopUp from "../../components/popups/popup";
import Loader from '../../components/loader/loader';


const CreateAccountPage = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    

    const [isPopUpOpen, setIsPopUpOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [popUpText, setpopUpText] = useState("")
    const [isBackgroundBlurred, setIsBackgroundBlurred] = useState(false);
    const blurredBackgroundStyles = isBackgroundBlurred
        ? {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(100, 100, 100, 0.5)",
            backdropFilter: "blur(1.8px)",
            zIndex: 1,
        }
        : {};

    async function handleCreateAccount(e) {
        e.preventDefault();
        try{  
            setLoading(true);
            const response = await axios.post('auth/create-librarian-account',{
                email,
                password,
                name:fullName,});
            navigate(`/app/${response.data.librarian.name}`)
            localStorage.setItem('librarianId', response.data.librarian._id);
            setLoading(false);
            
        }catch(error){
            console.log(error);
            setLoading(false);
            if(error?.response?.data?.message){
                setpopUpText(error?.response?.data?.message);
            }
            else{
                setpopUpText("Something Went Wrong")
            }
            setIsPopUpOpen(true);
        }
    }
    return (
        <>
            <div className="create-account-container">
                {isBackgroundBlurred && <div style={blurredBackgroundStyles} />}
                {loading && <Loader />}
                <div className='librarian-container'>
                    <img src={librarianImage} alt="" />
                </div>
                <div className='create-account-form-container'>
                    <h2>Create an Account</h2>
                    <form className="create-account-form">
                        <input 
                            type="text" 
                            placeholder="Full Name" 
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            />
                        <input 
                            type="email"
                            placeholder="Email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            />
                        <input 
                            type="password" 
                            placeholder="Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            />
                        <button type="submit" onClick={handleCreateAccount} >Create Account</button>
                    </form>
                    <div className="alternate-action">
                        Already have an account? <Link to="/login">Login</Link>
                    </div>
                </div>
            </div>
            <PopUp
                isOpen={isPopUpOpen}
                close={() => setIsPopUpOpen(false)}
                text={popUpText}
            />
        </>
    );
};

export default CreateAccountPage;

