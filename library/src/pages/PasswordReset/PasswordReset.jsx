import React, { useState } from "react";
import axios from "../../axios/axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./PasswordReset.module.css";
import Loader from '../../components/loader/loader';


const PasswordReset = () => {
  const [login, setLogin] = useState({ email: "", otp: "", newPassword: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isOTPSent, setIsOTPSent] = useState(false);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!isOTPSent) {
      try {
        setLoading(true);
        const res = await axios.post("/api/send-admin-otp", { email: login.email });

        if (res?.data?.emailRequire) {
          setLoading(false);
          setErrorMessage("Please enter your email address.");
        } else if (res?.data?.userNotExist) {
          setLoading(false);
          setErrorMessage("No account found with this email address.");
        } else if (res?.data?.msg === "OTP sent successfully") {
          setLoading(false);
          alert("OTP has been sent to your email. Please check your inbox.");
          setIsOTPSent(true);
        }
      } catch (error) {
        setLoading(false);
        setErrorMessage("An error occurred. Please try again.");
      }
    } else {
      try {
        setLoading(true);
        const res = await axios.post("/api/update-admin-password", {
          email: login.email,
          otp: login.otp,
          newPassword: login.newPassword,
        });

        if (res?.data?.otpNotValid) {
          setLoading(false);
          setErrorMessage("Invalid OTP. Please try again.");
        } else if (res?.data?.otpExpired) {
          setLoading(false);
          setErrorMessage("OTP has expired. Please request a new one.");
        } else if (res?.data?.updatedPassword) {
          setLoading(false);
          alert("Password updated successfully! You can now log in.");
          navigate("/");
        }
      } catch (error) {
        setLoading(false);
        setErrorMessage("An error occurred while updating the password.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
    {loading && <Loader />}
      <div className={styles.formWrapper}>
        <h2 className={styles.title}>Password Reset</h2>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}

        <input
          className={styles.inputField}
          placeholder="Enter Your Email"
          type="email"
          name="email"
          onChange={handleChange}
          value={login.email}
          required
        />

        {isOTPSent && (
          <>
            <input
              className={styles.inputField}
              placeholder="Enter OTP"
              type="text"
              name="otp"
              onChange={handleChange}
              value={login.otp}
              required
            />

            <input
              className={styles.inputField}
              placeholder="Enter New Password"
              type="password"
              name="newPassword"
              onChange={handleChange}
              value={login.newPassword}
              required
            />
          </>
        )}

        <button type="submit" className={styles.submitButton}>
          {isOTPSent ? "Reset Password" : "Send OTP"}
        </button>

        <p className={styles.rememberText}>
          Remember your password? <Link to="/" className={styles.link}>Login</Link>
        </p>
      </div>
    </form>
  );
};

export default PasswordReset;
