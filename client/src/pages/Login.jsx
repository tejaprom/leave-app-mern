import React, { useState } from 'react';
import '../styles/Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { auth, provider } from "../firebase";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Button, Input } from 'antd';
import { googleLogin, login } from '../utils/apiCalls';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '../redux/authSlice';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

     const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth();
      const result = await signInWithPopup(auth, provider);
      const { displayName, email } = result.user;

      // Send to backend
      const res = await googleLogin( {
        name: displayName,
        email,
        role: "manager", // You can change this if needed
      });

      dispatch(setToken(res.data.token));
      dispatch(setUser(res.data.user));
      navigate("/dashboard"); // or wherever you want

    } catch (err) {
      console.error("Google login error:", err);
    }
  };


    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true); // 🔹 Start loader
        try {
            const res = await login({ email, password });
            const { token, user } = res.data;
            // localStorage.setItem('token', token);
            // localStorage.setItem('user', JSON.stringify(user));
            dispatch(setToken(token));
            dispatch(setUser(user));
            navigate('/dashboard', { state: { loginSuccess: true } });
console.log('Navigated to dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false); // 🔹 Stop loader
        }
    };

    return (
        <div className="login">
            <div style={{ padding: '2rem' }} className="login-container">
                <h2>Login</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    /><br /><br />

                    <Input.Password
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <br /><br />
                    <Button type="primary" htmlType="submit" loading={loading}>Login</Button>
                </form>
                <p style={{ marginTop: '10px' }}>
                    <Link to="/forgot-password">Forgot Password?</Link>
                </p>
                <button onClick={handleGoogleLogin} className="google-signin-btn">
                    <img
                        src="https://developers.google.com/identity/images/g-logo.png"
                        alt="Google Logo"
                        className="google-icon"
                    />
                    <span>Sign in with Google</span>
                </button>

            </div>
        </div>
    );
};

export default Login;
