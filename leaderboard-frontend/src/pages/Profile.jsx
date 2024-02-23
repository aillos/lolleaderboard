import {useNavigate, useParams} from 'react-router-dom';
import axios from "axios";
import React, {useEffect, useState} from "react";
import './Profile.css';
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import Match from "../components/Match.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHome, faMedal, faRefresh} from "@fortawesome/free-solid-svg-icons";

export const Profile = () => {
    const [summoner, setSummoner] = useState(null);
    const [patchVersion, setPatchVersion] = useState(null);
    const [matches, setMatches] = useState([]);
    const [championJson, setChampionJson] = useState({});
    const [itemJson, setItemJson] = useState({});
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const getPatchVersion = async () => {
        const response = await axios.get('https://ddragon.leagueoflegends.com/realms/euw.json');
        setPatchVersion(response.data.v);
        const champions = await axios.get(`https://ddragon.leagueoflegends.com/cdn/${response.data.v}/data/en_US/champion.json`);
        setChampionJson(champions.data.data);
        const items = await axios.get(`https://ddragon.leagueoflegends.com/cdn/${response.data.v}/data/en_US/item.json`);
        setItemJson(items.data.data);
    }



    const { name, tag } = useParams();

    const getSummonerProfile = async (name, tag) => {
        const response = await axios.get(`/api/profile/${name}/${tag}`)
        setSummoner(response.data);
        getMatches(response.data);
    }

    const games = (wins, losses) =>{
        return Number(wins)+Number(losses);
    }

    const winrate = (wins, losses) => {
        wins = Number(wins) ?? 0;
        losses = Number(losses) ?? 0;

        if (wins + losses === 0) return '0%';
        return `${((wins / (wins + losses)) * 100).toFixed(1)}%`;
    };

    useEffect(() => {
        getSummonerProfile(name, tag);
        getPatchVersion();
    }, []);

    const tierCheck = (summoner) => {
        if (summoner.flexPoints > summoner.points){
            return summoner.flexTier.toLowerCase();
        } else {
            return summoner.tier.toLowerCase();
        }
    }

    const navigateHome = () => {
        navigate('/');
    };

    const updateOpgg = async () => {
        setLoading(true);
        const id = await axios.get(`/api/opgg/${summoner.gameName}/${summoner.tagLine}`);
        await axios.post(`https://op.gg/api/v1.0/internal/bypass/summoners/euw/${id.data}/renewal`);
        setLoading(false);
    }

    const renderChampions = (name, image, wr, kda) => {
        return(
            <div>
                <OverlayTrigger
                    placement="top"
                    overlay={
                        <Tooltip
                            id={kda[0] === "0" ? "tooltip-invis" : `tooltip-top`}>
                        <b>{name[0]} </b> <br />
                    Games: <b>{games(wr[0], wr[1])}</b>  <br/>
                    Avg: <b>{kda[0]}</b> <br />
                    WR: <b> {winrate(wr[0], wr[1])} </b>
                </Tooltip>
            }
        >
            <div className="profile-image-container2">
                <img
                    src={kda[0] === "0" ? `https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/profileicon/29.png` : `https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/champion/${image[0]}`}
                    alt={`${name[0]} champion`}/>
            </div>
        </OverlayTrigger>
        <div className={"profile-image-bottom"}>
            <OverlayTrigger
                placement="top"
                overlay={
                    <Tooltip
                        id={kda[2] === "0" ? "tooltip-invis" : `tooltip-top`}>
                        <b>{name[2]} </b> <br/>
                        Games: <b>{games(wr[4], wr[5])}</b> <br/>
                        Avg: <b>{kda[2]}</b> <br/>
                        WR: <b> {winrate(wr[4], wr[5])} </b>

                    </Tooltip>
                }
            >
                <div className="profile-image-container">
                    <img
                        src={kda[2] === "0" ? `https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/profileicon/29.png` : `https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/champion/${image[2]}`}
                        alt={`${name[2]} champion`}/>
                </div>
            </OverlayTrigger>
            <OverlayTrigger
                placement="top"
                overlay={
                    <Tooltip
                        id={kda[1] === "0" ? "tooltip-invis" : `tooltip-top`}>
                        <b>{name[1]} </b> <br/>
                        Games: <b>{games(wr[2], wr[3])}</b> <br/>
                        Avg: <b>{kda[1]}</b> <br/>
                        WR: <b> {winrate(wr[2], wr[3])} </b>
                    </Tooltip>
                }
            >
                <div className="profile-image-container1">
                    <img
                        src={kda[1] === "0" ? `https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/profileicon/29.png` : `https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/champion/${image[1]}`}
                        alt={`${name[1]} champion`}/>
                </div>
            </OverlayTrigger>
        </div>
            </div>
    );
    }

    const formatNumberWithSpaces = (number) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };

    const loadingSpinner = (
        <div className="spinner-container"><div className="spinner"/></div>
    );

    const updateButton = (
        <div className="button updateOpgg mobileButton" onClick={updateOpgg}>
           <img src={'https://i0.wp.com/log.op.gg/wp-content/uploads/2022/01/cropped-opgg_favicon.png'} alt={"Opgg update"} />
             Update
        </div>
    );

    const renderMastery = (name, image, points) => {
        return(
            <div>
                <OverlayTrigger
                    placement="top"
                    overlay={
                        <Tooltip
                            id={points[0] === "" ? "tooltip-invis" :`tooltip-top`}>
                            <b>{name[0]} </b> <br />
                            Points: <b>{formatNumberWithSpaces(points[0])}</b>  <br/>
                        </Tooltip>
                    }
                >
                    <div className="profile-image-container2">
                        <img
                            src={points[0] === "" ? `https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/profileicon/29.png` : `https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/champion/${image[0]}`}
                            alt={`${name[0]} champion`}/>
                    </div>
                </OverlayTrigger>
                <div className={"profile-image-bottom"}>
                    <OverlayTrigger
                        placement="top"
                        overlay={
                            <Tooltip
                                id={points[2] === "" ? "tooltip-invis" :`tooltip-top`}>
                                <b>{name[2]} </b> <br />
                                Points: <b>{formatNumberWithSpaces(points[2])}</b>  <br/>
                            </Tooltip>
                        }
                    >
                        <div className="profile-image-container">
                            <img
                                src={points[2] === "" ? `https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/profileicon/29.png` : `https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/champion/${image[2]}`}
                                alt={`${name[2]} champion`}/>
                        </div>
                    </OverlayTrigger>
                    <OverlayTrigger
                        placement="top"
                        overlay={
                            <Tooltip
                                id={points[1] === "" ? "tooltip-invis" :`tooltip-top`}>
                                <b>{name[1]} </b> <br />
                                Points: <b>{formatNumberWithSpaces(points[1])}</b>  <br/>
                            </Tooltip>
                        }
                    >
                        <div className="profile-image-container1">
                            <img
                                src={points[1] === "" ? `https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/profileicon/29.png` : `https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/champion/${image[1]}`}
                                alt={`${name[1]} champion`}/>
                        </div>
                    </OverlayTrigger>
                </div>
            </div>
        );
    }

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

    const getMatches = async (summoner) => {
        const id = await axios.get(`/api/opgg/${summoner.gameName}/${summoner.tagLine}`);
        const response = await axios.get(`https://op.gg/api/v1.0/internal/bypass/games/euw/summoners/${id.data}/?&limit=20&hl=en_US&game_type=total`);
        setMatches(response.data.data);
    }

    const splitPrevRank = (prevRank) => {
        if (prevRank === "UNRANKED") return "UNRANKED";
        return prevRank.split(" ")[0];
    }

    const highElo = (rank) => {
        const highElo = ["MASTER", "GRANDMASTER", "CHALLENGER"];
        return highElo.includes(rank);
    }

    const renderSummoner = () => {
            return (
                <div className={"profileCard"}>
                    <div className={"upperSection"}>
                        <div className={"updateProfile"}></div>
                        <div className={"profileIcon"}>
                            {tierCheck(summoner) !== "unranked" ? <img id={"ranked-border"}
                                                                       src={`https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-emblem/wings/wings_${tierCheck(summoner)}.png`}
                                                                       alt={`Ranked border`}/> : ""}
                            <img
                                src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/profileicon/${summoner.summonerIcon}.png`}
                                alt={`${summoner.gameName} avatar`}/>
                        </div>
                        <div className={"updateProfile"}>
                            <div className={"updateButton"}>
                                {loading ? loadingSpinner : updateButton}
                            </div>
                        </div>
                    </div>
                    <h1>{summoner.gameName}</h1>
                    <div className={"profileRanks"}>
                        <img
                            src={`https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests/${summoner.tier.toLowerCase()}.svg`}
                            alt={`${summoner.tier} icon`} style={{marginBottom: '5px', marginRight: '5px'}}/>
                        <span style={{color: getRankColor(summoner.tier), fontWeight: "bold"}}>
                                        {summoner.tier} {summoner.rank}
                                    </span>
                        <span> {summoner.lp} LP</span>
                        <br/>
                        <img
                            src={`https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests/${summoner.flexTier.toLowerCase()}.svg`}
                            alt={`${summoner.flexTier} icon`} style={{marginBottom: '5px', marginRight: '5px'}}/>
                        <span style={{color: getRankColor(summoner.flexTier), fontWeight: "bold"}}>
                                        {summoner.flexTier} {summoner.flexRank}
                                    </span>
                        <span> {summoner.flexLp} LP</span>
                    </div>
                    <div className={"championsSection"}>
                        <div className={"soloQChampions"}>
                            <OverlayTrigger
                                placement="top"
                                overlay={
                                    <Tooltip id={`tooltip-top`}>
                                        Solo Queue
                                    </Tooltip>
                                }
                            >
                                <div className={"championLabel"}>
                                    <img
                                        src={"https://raw.communitydragon.org/latest/game/assets/ux/minimap/pings/target_gray.png"}
                                        alt={"Solo icon"}/>
                                </div>
                            </OverlayTrigger>
                            {renderChampions(summoner.mostPlayedName, summoner.mostPlayedImage, summoner.mostPlayedWR, summoner.mostPlayedKDA)}
                        </div>
                        <div className={"masteryChampions"}>
                            <OverlayTrigger
                                placement="top"
                                overlay={
                                    <Tooltip id={`tooltip-top`}>
                                        Mastery Points
                                    </Tooltip>
                                }
                            >
                                <div className={"championLabel"}>
                                    <img
                                        src={"https://raw.communitydragon.org/14.4/plugins/rcp-fe-lol-collections/global/default/images/item-element/tooltip-champ-mastery.png"}
                                        alt={"Mastery icon"}/>
                                </div>
                            </OverlayTrigger>
                            {renderMastery(summoner.championMastery, summoner.championImages, summoner.masteryPoints)}

                        </div>
                        <div className={"flexQChampions"}>
                            <OverlayTrigger
                                placement="top"
                                overlay={
                                    <Tooltip id={`tooltip-top`}>
                                        Flex Queue
                                    </Tooltip>
                                }
                            >
                                <div className={"championLabel"}>
                                    <img
                                        src={"https://raw.communitydragon.org/latest/game/assets/ux/minimap/pings/all_in_gray.png"}
                                        alt={"Flex icon"}/>
                                </div>
                            </OverlayTrigger>
                            {renderChampions(summoner.mostPlayedNameFlex, summoner.mostPlayedImageFlex, summoner.mostPlayedWRFlex, summoner.mostPlayedKDAFlex)}
                        </div>
                    </div>
                    <div className="matchHistory">
                        <h2>Match History</h2>
                        <br/>
                        {matches && matches.map(match => <Match key={match.id} match={match} championJson={championJson}
                                                                patchVersion={patchVersion} name={summoner.gameName}
                                                                tag={summoner.tagLine} itemJson={itemJson}/>)}
                    </div>
                </div>
            );

    }
    return (
        <div>
            <div className="leaderboardButton" onClick={navigateHome}>
                <FontAwesomeIcon icon={faMedal} className="backIcon"/>
                Leaderboard
            </div>
            {summoner ? renderSummoner() : <h1>Loading...</h1>}
        </div>
    );
}