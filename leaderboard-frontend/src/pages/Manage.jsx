import React, {useState, useEffect, useContext} from 'react';
import PasswordModal from '../security/PasswordModal';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faHome} from '@fortawesome/free-solid-svg-icons'
import {useNavigate} from "react-router-dom";


export const Manage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [playerName, setPlayerName] = useState("");
    const [playerTag, setPlayerTag] = useState("");
    const [summoner, setSummoner] = useState(null);
    const [ responseText, setResponseText ] = useState("");
    const [patchVersion, setPatchVersion] = useState("");
    const navigate = useNavigate();

    const navigateHome = () => {
        navigate('/');
    };


    const getPatchVersion = async () => {
        try {
            const response = await axios.get('https://ddragon.leagueoflegends.com/realms/euw.json');
            setPatchVersion(response.data.v);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    useEffect(() => {
        getPatchVersion();
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
            credentials: 'include',
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

    const searchForPlayer = async (name, tag) => {
        try {
            const response = await axios.get(`/api/search/${name}/${tag}`);
            setSummoner(response.data);
            setResponseText("");
        } catch (error) {
            console.error("Error fetching data: ", error);
            setResponseText("Could not find " + name + "#" + tag);
        }
    };

    const removeSummoner = async (name, tag) => {
        try {
            const response = await axios.get(`/api/remove/${name}/${tag}`);
            if (response.data === true) {
                setResponseText("Successfully removed " + name + "#" + tag);
            } else {
                setResponseText("Failed to remove " + name + "#" + tag);
            }
        } catch (error) {
            console.error("Could not delete: ", name + tag);
            setResponseText("Error in removal: " + error.response?.status || error.message);
        }
    };

    const addSummoner = async (name, tag) => {
        try {
            const response = await axios.get(`/api/add/${name}/${tag}`);
            if (response.data === true) {
                setResponseText("Successfully added " + name + "#" + tag);
            } else {
                setResponseText("Failed to add " + name + "#" + tag);
            }
        } catch (error) {
            console.error("Could not add: ", name + tag);
            setResponseText("Error in addition: " + error.response?.status || error.message);
        }
    };



    return (
        <div>
            <div className="backContainer">
            <div className="backButton" onClick={navigateHome}>
                <FontAwesomeIcon icon={faHome} className="backIcon"/>
                Home
            </div>
            </div>
            <div className="searchPlayer">
                {summoner ? (
                    <>
                        <img src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/profileicon/${summoner.summonerIcon}.png`} alt="Summoner Icon" />
                        <h2>{summoner.gameName} #{summoner.tagLine}</h2>
                    </>
                ) : (
                    <>
                    <img src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/profileicon/4299.png`} alt="Placeholder Icon" />
                    <h2>Name #Tagline</h2>
                    </>
                )}
            </div>
            <div className="inputSearch">
                <input type="text" className="gameNameInput" onChange={e => setPlayerName(e.target.value)} />
                <div className="hashtag"> #</div>
                <input type="text" className="tagLineInput" onChange={e => setPlayerTag(e.target.value)} />
                <div className="button secondary" onClick={() => searchForPlayer(playerName, playerTag)}>Search</div>
            </div>
            <div className="submitButtons">
                <div className="button danger" onClick={() => removeSummoner(playerName, playerTag)}> Remove summoner</div>
                <div className="button primary" onClick={() => addSummoner(playerName, playerTag)}> Add summoner</div>
            </div>
            <div className="responseText">
                {responseText}
            </div>
        </div>
    );
}
