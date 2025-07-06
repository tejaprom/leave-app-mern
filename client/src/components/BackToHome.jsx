import React from 'react'
import { useNavigate } from 'react-router-dom';

const BackToHome = ({path="/", btntext="Back"}) => {
    const navigate = useNavigate();

    return (
        <div className="back-arrow" onClick={() => navigate(path)}>
            ← {btntext}
        </div>
    )
}

export default BackToHome