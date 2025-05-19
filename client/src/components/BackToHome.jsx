import React from 'react'
import { useNavigate } from 'react-router-dom';

const BackToHome = () => {
    const navigate = useNavigate();

    return (
        <div className="back-arrow" onClick={() => navigate('/')}>
            ← Back
        </div>
    )
}

export default BackToHome