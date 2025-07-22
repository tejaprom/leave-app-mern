import { useState } from 'react';
import '../styles/ForgotPassword.css'; // Reusing the same CSS
import { useNavigate } from 'react-router-dom';
import BackToHome from '../components/BackToHome';
import { Button, Select, Input } from 'antd';
import { register } from '../utils/apiCalls';

const { Option } = Select;

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: ''
    });

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
};


    const handleRoleChange = (value) => {
        setFormData({ ...formData, role: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            setMessage('');
            setError('');
            const res = await register(formData);
            setMessage('Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/'), 2000); // Redirect after 2s
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-container">
            <BackToHome />
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <Input.Password
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                />

                <Select
                    placeholder="Select Role"
                    value={formData.role || undefined}
                    onChange={handleRoleChange}
                    style={{ width: '100%', marginBlock: '10px' }}
                    required
                >
                    <Option value="employee">Employee</Option>
                    <Option value="manager">Manager</Option>
                </Select>

                {error && <p className="error-message">{error}</p>}
                {message && <p className="success-message">{message}</p>}

                <Button type="primary" htmlType="submit" loading={loading}>
                    Register
                </Button>
            </form>
        </div>
    );
};

export default Register;
