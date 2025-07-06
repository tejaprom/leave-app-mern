import React from 'react'
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token'); // or 'accessToken' if that's what you're using
        localStorage.removeItem('user');  // if you're storing user info too
        navigate('/');
    };
    return (
        <div style={{ padding: 16, backgroundColor: "#e3e3e8" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <h2>Welcome {user?.name}</h2>
                    <span>|</span>
                    <h4>Role: {user?.role}</h4>
                </div>
                <button onClick={handleLogout} style={{ padding: '6px 12px', cursor: 'pointer', background: "transparent", border: "1px solid black" }}>Logout</button>
            </div>
        </div>
    )
}

export default Header