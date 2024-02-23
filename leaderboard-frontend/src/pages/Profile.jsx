import {useNavigate, useParams} from 'react-router-dom';
import axios from "axios";
import React, {useEffect, useState} from "react";
import './Profile.css';
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import Match from "../components/Match.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHome, faMedal, faRefresh} from "@fortawesome/free-solid-svg-icons";
import {formatNumberWithSpaces, games, getRankColor, tierCheck, winrate} from "../components/HelperMethods.jsx";
import {renderChampions} from "../components/RenderChampions.jsx";
import {renderMastery} from "../components/RenderMastery.jsx";

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

    useEffect(() => {
        getSummonerProfile(name, tag);
        getPatchVersion();
    }, []);

    const navigateHome = () => {
        navigate('/');
    };

    const updateOpgg = async () => {
        setLoading(true);
        const id = await axios.get(`/api/opgg/${summoner.gameName}/${summoner.tagLine}`);
        await axios.post(`https://op.gg/api/v1.0/internal/bypass/summoners/euw/${id.data}/renewal`);
        setLoading(false);
    }

    const loadingSpinner = (
        <div className="spinner-container"><div className="spinner"/></div>
    );

    const updateButton = (
        <div className="button updateOpgg mobileButton" onClick={updateOpgg}>
           <img src={'https://i0.wp.com/log.op.gg/wp-content/uploads/2022/01/cropped-opgg_favicon.png'} alt={"Opgg update"} />
             Update
        </div>
    );

    const getMatches = async (summoner) => {
        const id = await axios.get(`/api/opgg/${summoner.gameName}/${summoner.tagLine}`);
        const response = await axios.get(`https://op.gg/api/v1.0/internal/bypass/games/euw/summoners/${id.data}/?&limit=20&hl=en_US&game_type=total`);
        setMatches(response.data.data);
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
                            {renderChampions(summoner.mostPlayedName, summoner.mostPlayedImage, summoner.mostPlayedWR, summoner.mostPlayedKDA, patchVersion)}
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
                            {renderMastery(summoner.championMastery, summoner.championImages, summoner.masteryPoints, patchVersion)}

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
                            {renderChampions(summoner.mostPlayedNameFlex, summoner.mostPlayedImageFlex, summoner.mostPlayedWRFlex, summoner.mostPlayedKDAFlex, patchVersion)}
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