import React from 'react';
import {useState} from 'react';
import './AuthModal.css';
import axios from "axios";

const AuthModalComponent = ({isOpen, onClose}) => {
    const [formData, setFormData] = useState({
        login: '',
        password: '',
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    }

    const handleSubmitRegister = (e) => {
        e.preventDefault();
        const {login, password} = formData;
        axios.post('http://localhost:5000/auth/register', {login, password})
            .then(response => {
                console.log('Registration successful:', response.data);
                onClose();
            })
            .catch(error => {
                console.error('Error during registration:', error);
            });
    };

    const handleSubmitLogin = (e) => {
        e.preventDefault();
        const {login, password} = formData;
        axios.post('http://localhost:5000/auth/login', {login, password})
            .then(response => {
                console.log('Login successful:', response.data);
                localStorage.setItem('token', response.data.token);
                onClose();
            })
            .catch(error => {
                console.error('Error during login:', error);
            });
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className={'modal-auth'}>
                <button className="close-button" onClick={onClose}> Close </button>
                <form>
                    <div>
                        <label htmlFor="login">Login:</label>
                        <input
                            type="text"
                            id="login"
                            name="login"
                            value={formData.login}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button onClick={handleSubmitRegister}>Register</button>
                    <button onClick={handleSubmitLogin}>Login</button>
                </form>
            </div>
        </div>
    );
};

export default AuthModalComponent;