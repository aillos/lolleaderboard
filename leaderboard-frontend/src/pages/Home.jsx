import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from 'react-bootstrap/Card';
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import {faAward, faCircle, faCross, faMedal, faShield, faSignal, faTrophy} from "@fortawesome/free-solid-svg-icons";
import {faPatreon} from "@fortawesome/free-brands-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Footer} from "../Footer";

export const Home = () => {
    const [patchVersion, setPatchVersion] = useState(null);
    const [summoners, setSummoners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeUpdated, setTimeUpdated] = useState("");

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

    const lastTimeUpdated = async () => {
        try {
            const response = await axios.get('api/time');
            const formattedTime = formatDateTime(response.data);
            setTimeUpdated(formattedTime);
        } catch (error) {
            console.error("Error getting time " + error.message);
        }
    };

    const populateSummoners = async () => {
        try {
            const response = await axios.get('api/getAll');
            setSummoners(response.data);
            setLoading(false);
            await lastTimeUpdated();
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
        <div className="button updateB" onClick={update}>
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

    const getPlacement = (index) => {
        let color = 'green'; // default color
        let icon;  // default icon
        let icon2;

        if (index === 0) {
            color = 'red';
            icon = faMedal;
            icon2 = faCircle;
        } else if (index === 1) {
            color = 'yellow';
            icon = faMedal;
            icon2 = faCircle;
        } else if (index === 2){
            color = '';
            icon = faMedal;
            icon2 = faCircle;
        }

        return { color, icon, icon2 };
    };

    const renderSummoner = (summoners, winrate, patchVersion) => (
        <div>
            {summoners.map((summoner, index) => (
                <Card className="playerCard" key={summoner.gameName + summoner.tagLine}>
                    <Card.Body>
                        <div className="summonerIcon">
                            <img src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/profileicon/${summoner.summonerIcon}.png`} alt="" />
                        </div>
                        <OverlayTrigger
                            placement="top"
                            overlay={
                                <Tooltip
                                    id={`tooltip-top`}>
                                    {summoner.gameName} #{summoner.tagLine}
                                </Tooltip>
                            }
                        >
                        <Card.Title>
                            <div className="icon-container">
                                <span className="fa-layers fa-fw">
                                    <FontAwesomeIcon
                                    icon={getPlacement(index).icon}
                                    style={{ color: getPlacement(index).color }}
                                    className={"statusIcon"}
                                    />
                                    <FontAwesomeIcon icon={getPlacement(index).icon2} transform={"shrink-8 down-2"} className={"placementCircle"} color={getPlacement(index).color}/>
                                <span className="fa-layers-text placementText">{index + 1}</span>
                                </span>
                            </div>
                             {index + 1}. {summoner.gameName}
                        </Card.Title>
                        </OverlayTrigger>
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

    const formatDateTime = (isoString) => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const date = new Date(isoString);
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');

        return `${day}. ${month} ${year} at ${hours}:${minutes}`;
    };

    let contents = renderSummoner(summoners, winrate, patchVersion);

    return (
        <div>
            <div className={"updateSection"}>
                <div className={"lastUpdated"}>
                    <p>Last updated: {timeUpdated}</p>
                </div>
                <div className={"updateButton"}>
                    {loading ? loadingSpinner : updateButton}
                </div>
            </div>
            {contents}
            <Footer />
        </div>

    );
};
