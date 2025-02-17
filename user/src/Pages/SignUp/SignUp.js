import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../axios/axios';
import styles from './SignUp.module.css';
import Loader from '../../Components/Loader/Loader';
import PopUp from '../../Components/Popups/Popup';

const CreateAccountPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [isPopUpOpen, setIsPopUpOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [popUpText, setPopUpText] = useState("");

    async function handleCreateAccount(e) {
        e.preventDefault();
        if (!email.trim() || !password.trim() || !fullName.trim()) {
            setPopUpText("Please fill all fields");
            setIsPopUpOpen(true);
            return;
        }
        try {
            setLoading(true);
            const response = await axios.post('auth/create-user-account', { email, password, name: fullName });
            localStorage.setItem('userId', response.data.user._id);
            navigate(`/app/${response.data.user.name}`);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setPopUpText(error?.response?.data?.message || "Something went wrong");
            setIsPopUpOpen(true);
        }
    }

    return (
        <div className={styles.createAccountContainer}>
            {loading && <Loader />}
            <div className={styles.createAccountFormContainer}>
                <h2>Create an Account</h2>
                <form className={styles.createAccountForm}>
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" onClick={handleCreateAccount}>Create Account</button>
                </form>
                <div className={styles.alternateAction}>
                    Already have an account? <Link to="/login">Login</Link>
                </div>
            </div>

            <PopUp isOpen={isPopUpOpen} close={() => setIsPopUpOpen(false)} text={popUpText} />
        </div>
    );
};

export default CreateAccountPage;
