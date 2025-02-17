import React,{useState} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import librarianImage from '../../assets/librarian.png';
import axios from "../../axios/axios"

import styles from "./login.module.css"; 
import PopUp from "../../components/popups/popup";
import Loader from '../../components/loader/loader';



const LoginPage = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleLogin(e) {
        e.preventDefault();
        console.log(email, password);
        if(!email?.trim() || !password?.trim()){
            setpopUpText("Please fill in both fields.");
            setIsPopUpOpen(true);
            return
        }
        try{
            setLoading(true); 
            const response = await axios.post('auth/librarian-login',{email, password });
            console.log(response);
            navigate(`/app/${response.data.librarian.name}`)
            localStorage.setItem('librarianId', response.data.librarian._id);

        }
        
        catch(error){
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
    return (
        <div className={styles.loginContainer}>
            {loading && <Loader />}
            <div className={styles.loginBox}>
                <h2 style={{fontSize:"24px"}}>Admin Login</h2>
                <form onSubmit={handleLogin}>
                    <input
                        className={styles.inputField}
                        type="email"
                        placeholder="Email"
                        // required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className={styles.inputField}
                        type="password"
                        placeholder="Password"
                        // required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className={styles.submitButton} type="submit">Log In</button>
                </form>
                <div className={styles.signupLink}>
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </div>
            </div>
            <PopUp isOpen={isPopUpOpen} close={() => setIsPopUpOpen(false)} text={popUpText} />
        </div>
    );
};

export default LoginPage;

