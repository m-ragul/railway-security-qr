import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Register.module.css';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5000/register', formData)
            .then(() => {
                setMessage('Registration successful. Redirecting to login...');
                setSuccess(true);
                setTimeout(() => {
                    navigate('/login');
                }, 2000); // Delay navigation by 2 seconds to display the message
            })
            .catch((error) => {
                setMessage(error.response?.data?.message || 'Registration failed');
                setSuccess(false);
            });
    };

    return (
        <div className={styles.authContainer}>
            <form onSubmit={handleSubmit} className={styles.authForm}>
                <h2>Register</h2>
                <div className={styles.inputGroup}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles.inputGroup}>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className={styles.submitBtn}>Register</button>
                {message && (
                    <p className={success ? styles.successMessage : styles.errorMessage}>{message}</p>
                )}
            </form>
        </div>
    );
};

export default Register;
