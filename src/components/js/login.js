import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false); // New state for loading
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading

        try {
            const response = await axios.post('http://localhost:3008/login', {
                username,
                password,
                role
            });

            if (response.data.success) {
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('username', username); // Store username
                localStorage.setItem('userRole', response.data.role); // Store user role

                if (response.data.role === 'admin') {
                    window.location.href = 'http://localhost:3001/home';
                } else {
                    navigate('/dashboard');
                }
            } else {
                setMessage(response.data.message || 'Invalid credentials!');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('An error occurred. Please try again.');
        } finally {
            setLoading(false); // End loading
        }
    };

    return (
        <div className="kopp">
            <div className="login-container">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <label htmlFor="role">Role:</label>
                    <select
                        id="role"
                        name="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                    >
                        <option value="" disabled>Role</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>

                    <button type="submit" disabled={loading}>Sign In</button>
                    {loading && <p>Loading...</p>} {/* Show loading state */}
                </form>
                {message && <p>{message}</p>}
            </div>
        </div> 
    );
}


export default Login;
