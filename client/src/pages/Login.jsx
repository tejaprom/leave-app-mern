import React, { useState } from 'react';
import '../styles/Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { Input } from 'antd';
import { login } from '../utils/apiCalls';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');


    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const token = await user.getIdToken();

            console.log("Google User:", user);
            console.log("Token:", token);

            // You can now store token or user info if needed
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify({
                name: user.displayName,
                email: user.email,
                role: "employee", // Default role or infer later
            }));

            // Navigate to dashboard or homepage
            window.location.href = "/dashboard";

        } catch (error) {
            console.error("Google Login Error:", error.message);
        }
    };


    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {

            const res = await login({ email, password });
            const { token, user } = res.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));


            navigate('/dashboard', { state: { loginSuccess: true } });

            //   if (user.role === 'manager') {
            //     navigate('/manager-dashboard');
            //   } else {
            //     navigate('/employee-dashboard');
            //   }
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
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
                    {/* <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    /> */}

                    <Input.Password
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />


                    <br /><br />
                    <button type="submit">Login</button>
                </form>
                <p style={{ marginTop: '10px' }}>
                    <Link href="/forgot-password">Forgot Password?</Link>
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
