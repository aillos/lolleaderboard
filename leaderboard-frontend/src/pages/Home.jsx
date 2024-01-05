import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from 'react-bootstrap/Card';
import { Spinner } from 'react-bootstrap';

export const Home = () => {
    const [patchVersion, setPatchVersion] = useState(null);
    const [summoners, setSummoners] = useState([]);
    const [loading, setLoading] = useState(true);

    const winrate = (wins, losses) => {
        if (wins + losses === 0) return '0%';
        return `${((wins / (wins + losses)) * 100).toFixed(2)}%`;
    };

    const update = async () => {
        setLoading(true); // Start loading
        try {
            const response = await axios.get('api/update');
            if (response.data === true) {
                console.log("Update successful");
            } else {
                console.error("Error updating: Update process failed.");
            }
        } catch (error) {
            console.error("Error updating: ", error.message);
        } finally {
            setLoading(false); // Stop loading regardless of the result
        }

        await populateSummoners();
    };

    const populateSummoners = async () => {
        try {
            const response = await axios.get('api/getAll');
            setSummoners(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching summoners:", error);
        }
    };

    const getPatchVersion = async () => {
        try {
            const response = await axios.get('https://ddragon.leagueoflegends.com/realms/euw.json');
            let patch = response.data.v;

            setPatchVersion(patch);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const updateButton = (
        <div className="button secondary" onClick={update}>
            Update
        </div>
    );

    const loadingSpinner = (
        <div className="spinner-container"><div className="spinner"/></div>
    );

    useEffect(() => {
        populateSummoners();
        getPatchVersion();
    }, []);

    const renderSummoner = (summoners, winrate, patchVersion) => (
        <div>
            {summoners.map((summoner, index) => (
                <Card className="playerCard" key={summoner.gameName + summoner.tagLine}>
                    <Card.Body>
                        <div className="summonerIcon">
                            <img src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/profileicon/${summoner.summonerIcon}.png`} alt="" />
                        </div>
                        <Card.Title>{index + 1}. {summoner.gameName}</Card.Title>
                        <Card.Text>
                            <p>Rank: {summoner.tier} {summoner.rank} {summoner.lp}</p>
                            <p>Wins: {summoner.wins}</p>
                            <p>Losses: {summoner.losses}</p>
                            <p>Winrate: {winrate(summoner.wins, summoner.losses)}</p>
                        </Card.Text>
                    </Card.Body>
                </Card>
            ))}
        </div>
    );

    let contents = renderSummoner(summoners, winrate, patchVersion);

    return (
        <div>
            {loading ? loadingSpinner : updateButton}
            {contents}
        </div>
    );
};
