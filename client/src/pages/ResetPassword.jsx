import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import BackToHome from '../components/BackToHome';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:5000/api/auth/reset-password`, { password }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(res.data.message);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setMessage(err.response?.data?.error || "Reset failed");
    }
  };

  return (
    <div className="forgot-container">
      {/* <BackToHome /> */}
      <h2>Reset Password</h2>
      <form onSubmit={handleReset}>
        {message && <p>{message}</p>}
        <input type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Reset</button>
      </form>
    </div>

  );
};

export default ResetPassword;
