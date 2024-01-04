import React, { useState } from 'react';

const PasswordModal = ({ onPasswordSubmit }) => {
    const [password, setPassword] = useState('');

    const handleSubmit = () => {
        onPasswordSubmit(password);
    };

    return (
        <div className="password-modal">
            <div className="modal-content">
                <h2>Enter Password</h2>
                <div className="inputModal">
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div className="button secondary" onClick={handleSubmit}>Submit
                </div>
                </div>
            </div>
        </div>
    );
};

export default PasswordModal;
