import React, {useEffect, useState} from "react";
import axios from "axios";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import {faCircle, faFire, faMedal, faRefresh, faUserPlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Footer} from "../Footer";
import {useNavigate} from "react-router-dom";

export const Home = () => {
    const [patchVersion, setPatchVersion] = useState(null);
    const [summoners, setSummoners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeUpdated, setTimeUpdated] = useState("");
    const [updateTime, setUpdateTime] = useState("");
    const navigate = useNavigate();
    const goToContact = () => {
        navigate('/contact');
    };

    const winrate = (wins, losses) => {
        wins = Number(wins) ?? 0;
        losses = Number(losses) ?? 0;

        if (wins + losses === 0) return '0%';
        return `${((wins / (wins + losses)) * 100).toFixed(1)}%`;
    };

    const update = async () => {

        setLoading(true);


        try {
            const response = await axios.get('api/updateRanked');
            if (response.data === true) {
                console.log("Update successful");
            } else {
                const lastUpdateTime = new Date(updateTime);
                const currentTime = new Date();
                const timeDiff = (currentTime - lastUpdateTime) / 1000;
                const waitTime = 120 - timeDiff;
                alert(`Please wait ${waitTime.toFixed(0)} more seconds before updating again.`);
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
            setUpdateTime(response.data);
        } catch (error) {
            console.error("Error getting time " + error.message);
        }
    };

    const assignPositions = (summoners) => {
        let currentPosition = 1;
        let skipCount = 1;
        let lastRank = null, lastTier = null, lastLP = null;

        summoners.forEach((summoner, index) => {
            if (index === 0) {
                summoner.position = currentPosition;
            } else {
                if (summoner.rank === lastRank && summoner.tier === lastTier && summoner.lp === lastLP) {
                    summoner.position = currentPosition;
                    skipCount++;
                } else {
                    currentPosition += skipCount;
                    summoner.position = currentPosition;
                    skipCount = 1;
                }
            }
            lastRank = summoner.rank;
            lastTier = summoner.tier;
            lastLP = summoner.lp;
        });
    };

    const populateSummoners = async () => {
        try {
            const response = await axios.get('api/getAll');
            let summoners = response.data;
            await axios.get('api/isLive');
            assignPositions(summoners);
            setSummoners(summoners);
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
        <div className="button updateB mobileButton" onClick={update}>
            <FontAwesomeIcon icon={faRefresh} />
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

    const getRankColor = (rank) => {
        const rankColors = {
            "IRON": "#c0c0c0",
            "BRONZE": "#ad5600",
            "SILVER": "#d2d2d2",
            "GOLD": "#ffd700",
            "PLATINUM": "#00bda7",
            "EMERALD": "#3eab62",
            "DIAMOND": "#00a1e9",
            "MASTER": "#ac39ac",
            "GRANDMASTER": "#d32f2f",
            "CHALLENGER": "#21fff7"
        };

        return rankColors[rank] || "#c7c7c7";
    };


    const getPlacement = (index) => {
        let color = 'gray';
        let icon = null;
        let icon2 = null;
        let medal;

        if (index === 0) {
            color = '#FFD700';
            icon = faMedal;
            icon2 = faCircle;
            medal = '#181818';
        } else if (index === 1) {
            color = '#C0C0C0';
            icon = faMedal;
            icon2 = faCircle;
            medal = '#181818';
        } else if (index === 2){
            color = '#CD7F32';
            icon = faMedal;
            icon2 = faCircle;
            medal = '#181818';
        }

        return { color, icon, icon2, medal };
    };

    const games = (wins, losses) =>{
        return Number(wins)+Number(losses);
    }

    const formatNumberWithSpaces = (number) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };


    const hotstreak = (hotstreak) =>{
        return hotstreak === 1;
    }

    const streak = (
        <OverlayTrigger
            placement="top"
            overlay={
                <Tooltip
                    id={`tooltip-top`}>
                    Winstreak
                </Tooltip>
            }
        >
        <span className="streak">
            <FontAwesomeIcon icon={faFire} />
        </span>
        </OverlayTrigger>
    );

    const liveBorderStyle = { border: '1px solid green' };


    const renderSummoner = (summoners, winrate, patchVersion) => (

    <div className="player-cards-container">
            {summoners.map((summoner) => (
                <div className="player-card"
                     key={summoner.gameName + summoner.tagLine}
                     style={summoner.isLive==="true" ? liveBorderStyle : {border: '1px solid transparent'}}
                >
                    <div className="player-rank">
                            <span className="fa-layers fa-fw">
                                    <FontAwesomeIcon
                                        icon={getPlacement(summoner.position - 1).icon}
                                        style={{ color: getPlacement(summoner.position - 1).color }}
                                        className={"rankingIcon"}
                                        transform={"down-1"}
                                    />
                                    <FontAwesomeIcon icon={getPlacement(summoner.position - 1).icon2} transform={"down-8 right-10"} className={"placementCircle"} color={getPlacement(summoner.position - 1).color}/>
                                <span className="fa-layers-text placementText" style={{color: getPlacement(summoner.position - 1).medal}} >{summoner.position}</span>
                            </span>
                    </div>
                    <div className="player-avatar">
                        <img src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/profileicon/${summoner.summonerIcon}.png`} alt={`${summoner.gameName} avatar`} />
                    </div>
                    <div className="player-info">
                        <div className={"rankAndName"}>
                            <div className="nameAndStreak">
                                {hotstreak(summoner.hotStreak) ? streak : ""}
                                <OverlayTrigger
                                    placement="top"
                                    overlay={
                                        <Tooltip id={`tooltip-top`}>
                                            {summoner.gameName} #{summoner.tagLine}
                                        </Tooltip>
                                    }
                                >
                                    <h2 className="summoner-name">
                                        {summoner.gameName}
                                    </h2>
                                </OverlayTrigger>
                            </div>
                            <OverlayTrigger
                                placement="bottom"
                                overlay={
                                    <Tooltip id={`tooltip-bottom2`}>
                                        Previous: <b>{summoner.prevRank}</b>
                                    </Tooltip>
                                }
                            >
                            <div>
                                <span style={{ color: getRankColor(summoner.tier), fontWeight: "bold"}}>
                                    {summoner.tier} {summoner.rank}
                                </span>
                                <span> {summoner.lp} LP</span>
                            </div>
                            </OverlayTrigger>
                        </div>
                        <div className={"winsLosses"}>
                            <OverlayTrigger
                                placement="top"
                                overlay={
                                    <Tooltip
                                        id={summoner.mostPlayedKDA[0] === "0" ? "tooltip-invis" :`tooltip-top`}>
                                        <b>{summoner.mostPlayedName[0]} </b> <br />
                                        Games: <b>{games(summoner.mostPlayedWR[0], summoner.mostPlayedWR[1])}</b>  <br/>
                                        Avg: <b>{summoner.mostPlayedKDA[0]}</b> <br />
                                        WR: <b> {winrate(summoner.mostPlayedWR[0], summoner.mostPlayedWR[1])} </b>
                                    </Tooltip>
                                }
                            >
                            <div className="image-container2">
                                <img src={summoner.mostPlayedKDA[0] === "0" ? `https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/profileicon/29.png` : `https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/champion/${summoner.mostPlayedImage[0]}`} alt={`${summoner.mostPlayedName[0]} champion`} />
                            </div>
                            </OverlayTrigger>
                            <div className={"image-bottom"}>
                                <OverlayTrigger
                                    placement="top"
                                    overlay={
                                        <Tooltip
                                            id={summoner.mostPlayedKDA[2] === "0" ? "tooltip-invis" :`tooltip-top`}>
                                            <b>{summoner.mostPlayedName[2]} </b> <br />
                                            Games: <b>{games(summoner.mostPlayedWR[4], summoner.mostPlayedWR[5])}</b>  <br/>
                                            Avg: <b>{summoner.mostPlayedKDA[2]}</b> <br />
                                            WR: <b> {winrate(summoner.mostPlayedWR[4], summoner.mostPlayedWR[5])} </b>

                                        </Tooltip>
                                    }
                                >
                            <div className="image-container">
                                <img src={summoner.mostPlayedKDA[2] === "0" ? `https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/profileicon/29.png` : `https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/champion/${summoner.mostPlayedImage[2]}`} alt={`${summoner.mostPlayedName[2]} champion`} />
                            </div>
                                </OverlayTrigger>
                                <OverlayTrigger
                                    placement="top"
                                    overlay={
                                        <Tooltip
                                            id={summoner.mostPlayedKDA[1] === "0" ? "tooltip-invis" :`tooltip-top`}>
                                            <b>{summoner.mostPlayedName[1]} </b> <br />
                                            Games: <b>{games(summoner.mostPlayedWR[2], summoner.mostPlayedWR[3])}</b>  <br/>
                                            Avg: <b>{summoner.mostPlayedKDA[1]}</b> <br />
                                            WR: <b> {winrate(summoner.mostPlayedWR[2], summoner.mostPlayedWR[3])} </b>
                                        </Tooltip>
                                    }
                                >
                            <div className="image-container1">
                                <img src={summoner.mostPlayedKDA[1] === "0" ? `https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/profileicon/29.png` : `https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/champion/${summoner.mostPlayedImage[1]}`} alt={`${summoner.mostPlayedName[1]} champion`} />
                            </div>
                                </OverlayTrigger>
                            </div>
                        </div>
                        <OverlayTrigger
                            placement="right"
                            overlay={
                                <Tooltip
                                    id={`tooltip-right`}>
                                    {summoner.wins} wins<br />
                                    {summoner.losses} losses<br />
                                    {games(summoner.wins,summoner.losses)} games<br />
                                </Tooltip>
                            }
                        >
                        <div className={"winRate"}>

                            <div className={"winrate1"}>
                            <p> {winrate(summoner.wins, summoner.losses)}</p>
                            </div>
                            <div className={"winrate2"}>
                                <p>WINRATE</p>
                            </div>
                        </div>
                        </OverlayTrigger>
                    </div>
                </div>
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
                <div className={"button updateB"} onClick={goToContact}>
                    <FontAwesomeIcon icon={faUserPlus} />
                    Add me
                </div>
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
