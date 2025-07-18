import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import BackToHome from '../components/BackToHome';
import { Button } from "antd";
import { resetPassword } from "../utils/apiCalls";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await resetPassword( token, password );
      setMessage(res.data.message);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setMessage(err.response?.data?.error || "Reset failed");
    } finally {
      setLoading(false); // 🔹 Stop loader
    }
  };

  return (
    <div className="forgot-container">
      {/* <BackToHome /> */}
      <h2>Reset Password</h2>
      <form onSubmit={handleReset}>
        {message && <p>{message}</p>}
        <input type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Button type="primary" htmlType="submit" loading={loading}>Reset</Button>
      </form>
    </div>

  );
};

export default ResetPassword;
