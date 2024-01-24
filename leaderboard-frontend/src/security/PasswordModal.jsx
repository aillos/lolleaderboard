import React, { useState } from 'react';

const PasswordModal = ({ onPasswordSubmit }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = () => {
        onPasswordSubmit(username, password);
    };

    return (
        <div className="password-modal">
            <div className="modal-content">
                <div className="inputModal">
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div className="button updateB logIn" onClick={handleSubmit}>Log in
                </div>
                </div>
            </div>
        </div>
    );
};

export default PasswordModal;
