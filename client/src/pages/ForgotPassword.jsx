import { useState } from 'react';
import axios from 'axios';
import '../styles/ForgotPassword.css';
import { useNavigate } from 'react-router-dom';
import BackToHome from '../components/BackToHome';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setMessage('');
            setError('');
            const res = await axios.post('/api/auth/forgot-password', { email });
            setMessage(res.data.message);
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong');
        }
    };

    return (
        <div className="forgot-container">
            <BackToHome />
            <h2>Forgot Password</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                {error && <p className="error-message">{error}</p>}
                {message && <p className="success-message">{message}</p>}
                <button type="submit">Send Reset Link</button>
            </form>
        </div>
    );
};

export default ForgotPassword;
