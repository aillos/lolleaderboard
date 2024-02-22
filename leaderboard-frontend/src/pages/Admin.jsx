import React, {useState, useEffect, useContext} from 'react';
import PasswordModal from '../components/PasswordModal';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faHome, faRefresh} from '@fortawesome/free-solid-svg-icons'
import {useNavigate} from "react-router-dom";


export const Admin = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [playerName, setPlayerName] = useState("");
    const [playerTag, setPlayerTag] = useState("");
    const [summoner, setSummoner] = useState(null);
    const [ responseText, setResponseText ] = useState("");
    const [patchVersion, setPatchVersion] = useState("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const navigateHome = () => {
        navigate('/');
    };

    const updateChampionMastery = async() => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('api/updateMastery/' + patchVersion, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.data === true) {
                console.log("Update successful");
            } else {
                console.error("Error updating: Update process failed.");
            }
        } catch (error){
            console.error("Error updating: ", error.message);
        } finally {
            setLoading(false);
        }
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

    const handlePasswordSubmit = (username, password) => {
        fetch('/auth/generateToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: username, password: password }),
            credentials: 'include',
        })
            .then(response => response.text())
            .then(data => {
                console.log(data);
                if (data) {
                    localStorage.setItem('token', data);
                    setIsAuthenticated(true);
                } else {
                    alert('Wrong username or password');
                }
            });
    };


    if (!isAuthenticated) {
        return <PasswordModal onPasswordSubmit={handlePasswordSubmit} />;
    }

    const searchForPlayer = async (name, tag) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`/manage/search/${name}/${tag}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setSummoner(response.data);
            setResponseText("");
        } catch (error) {
            console.error("Error fetching data: ", error);
            setResponseText("Could not find " + name + "#" + tag);
        }
    };

    const removeSummoner = async (name, tag) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`/manage/remove/${name}/${tag}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
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
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`/manage/add/${name}/${tag}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
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

    const updateButton = (
        <div className="backButton" onClick={updateChampionMastery}>
            <FontAwesomeIcon icon={faRefresh} className={"backIcon"} />
            Mastery
        </div>
    );

    const loadingSpinner = (
        <div className="spinner-container"><div className="spinner"/></div>
    );

    return (
        <div>
            <div className="backContainer">
                <div className="backButton" onClick={navigateHome}>
                    <FontAwesomeIcon icon={faHome} className="backIcon"/>
                    Home
                </div>
                <div className={"updateButton"}>
                    {loading ? loadingSpinner : updateButton}
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
                <input type="text" className="gameNameInput" placeholder={"Name"} onChange={e => setPlayerName(e.target.value)} />
                <div className="hashtag"> #</div>
                <input type="text" className="tagLineInput" placeholder={"Tag"} onChange={e => setPlayerTag(e.target.value)} />
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
