import React, { useState, useEffect } from 'react';
import PasswordModal from '../security/PasswordModal';

export const Manage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const auth = localStorage.getItem('isAuthenticated');
        setIsAuthenticated(auth === 'true');
    }, []);

    const handlePasswordSubmit = (password) => {
        fetch('/api/verify-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(password),
            credentials: 'include', // Important for including cookies
        })
            .then(response => response.json())
            .then(isValid => {
                if (isValid) {
                    localStorage.setItem('isAuthenticated', 'true');
                    setIsAuthenticated(true);
                } else {
                    alert('Wrong password');
                }
            });
    };

    if (!isAuthenticated) {
        return <PasswordModal onPasswordSubmit={handlePasswordSubmit} />;
    }

    return (
            <div>
                <div className="searchPlayer">
                    <img src={"{`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/profileicon/${summoner.summonerIcon}.png`}"} alt={""} />
                    <h2> </h2>
                </div>
                <div className="inputSearch">
                    <input type={"text"} />
                    <div className="button"> Test</div>
                </div>
            </div>
        );
}
