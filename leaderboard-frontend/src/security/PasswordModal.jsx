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
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    );
};

export default PasswordModal;
