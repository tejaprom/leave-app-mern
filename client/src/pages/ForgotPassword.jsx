import { useState } from 'react';
import '../styles/ForgotPassword.css';
import { useNavigate } from 'react-router-dom';
import BackToHome from '../components/BackToHome';
import axios from '../utils/axiosConfig';
import { Button } from 'antd';
import { forgotPassword } from '../utils/apiCalls';
const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // 🔹 Start loader
        try {
            setMessage('');
            setError('');
            const res = await forgotPassword( email );
            setMessage(res.data.message);
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong');
        } finally {
            setLoading(false); // 🔹 Stop loader
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
                <Button type="primary" htmlType="submit" loading={loading}>Send Reset Link</Button>
            </form>
        </div>
    );
};

export default ForgotPassword;
