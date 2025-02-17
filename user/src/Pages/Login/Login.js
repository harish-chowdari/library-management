import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PopUp from "../../Components/Popups/Popup";
import Loader from "../../Components/Loader/Loader";
import styles from "./Login.module.css"; 
import axios from "../../axios/axios";

const LoginPage = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPopUpOpen, setIsPopUpOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [popUpText, setpopUpText] = useState("");

    async function handleLogin(e) {
        e.preventDefault();

        if (!email?.trim() || !password?.trim()) {
            setpopUpText("Please fill in both fields.");
            setIsPopUpOpen(true);
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post('auth/user-login', { email, password });
            localStorage.setItem('userId', response.data.user._id);
            navigate(`/app/${response.data.user.name}`);
        } catch (error) {
            setLoading(false);
            if (error?.response?.data?.message) {
                setpopUpText(error?.response?.data?.message);
            } else {
                setpopUpText("Something went wrong");
            }
            setIsPopUpOpen(true);
        }
    }

    return (
        <div className={styles.loginContainer}>
            {loading && <Loader />}
            <div className={styles.loginBox}>
                <h2>User Login</h2>
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
