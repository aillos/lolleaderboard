import { useParams } from 'react-router-dom';
import axios from "axios";
import React, {useEffect, useState} from "react";
import './Profile.css';
import {OverlayTrigger, Tooltip} from "react-bootstrap";

export const Profile = () => {
    const [summoner, setSummoner] = useState(null);
    const [patchVersion, setPatchVersion] = useState(null);

    const getPatchVersion = async () => {
        const response = await axios.get('https://ddragon.leagueoflegends.com/realms/euw.json');
        setPatchVersion(response.data.v);
    }

    const { name, tag } = useParams();

    const getSummonerProfile = async (name, tag) => {
        const response = await axios.get(`/api/profile/${name}/${tag}`)
        setSummoner(response.data);
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
        getSummonerProfile(name, tag).then(r => console.log(r));
        getPatchVersion().then(r => console.log(r));
    }, []);

    const renderChampions = (name, image, wr, kda) => {
        return(
            <div>
        <OverlayTrigger
            placement="top"
            overlay={
                <Tooltip
                    id={kda[0] === "0" ? "tooltip-invis" :`tooltip-top`}>
                    <b>{name[0]} </b> <br />
                    Games: <b>{games(wr[0], wr[1])}</b>  <br/>
                    Avg: <b>{kda[0]}</b> <br />
                    WR: <b> {winrate(wr[0], wr[1])} </b>
                </Tooltip>
            }
        >
            <div className="image-container2">
                <img
                    src={kda[0] === "0" ? `https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/profileicon/29.png` : `https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/champion/${image[0]}`}
                    alt={`${name[0]} champion`}/>
            </div>
        </OverlayTrigger>
        <div className={"image-bottom"}>
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
                <div className="image-container">
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
                <div className="image-container1">
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
                    <div className="image-container2">
                        <img
                            src={points[0] === "" ? `https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/profileicon/29.png` : `https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/champion/${image[0]}`}
                            alt={`${name[0]} champion`}/>
                    </div>
                </OverlayTrigger>
                <div className={"image-bottom"}>
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
                        <div className="image-container">
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
                        <div className="image-container1">
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

    const renderSummoner = () => {
            return (
                <div className={"profileCard"}>
                    <div className={"upperSection"}>
                        <div className={"updateProfile"}></div>
                        <div className={"profileIcon"}>
                            <img
                                src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/profileicon/${summoner.summonerIcon}.png`}
                                alt={`${summoner.gameName} avatar`}/>
                        </div>
                        <div className={"updateProfile"}></div>
                    </div>
                    <h1>{summoner.gameName}</h1>
                    <div className={"profileRanks"}>

                        <span style={{color: getRankColor(summoner.tier), fontWeight: "bold"}}>
                                        {summoner.tier} {summoner.rank}
                                    </span>
                        <span> {summoner.lp} LP</span>
                        <br />
                        <span style={{color: getRankColor(summoner.flexTier), fontWeight: "bold"}}>
                                        {summoner.flexTier} {summoner.flexRank}
                                    </span>
                        <span> {summoner.flexLp} LP</span>
                    </div>
                    <div className={"championsSection"}>
                        <div className={"masteryChampions"}>
                            {renderMastery(summoner.championMastery, summoner.championImages, summoner.masteryPoints)}
                        </div>
                        <div className={"soloQChampions"}>
                            {renderChampions(summoner.mostPlayedName, summoner.mostPlayedImage, summoner.mostPlayedWR, summoner.mostPlayedKDA)}
                            </div>
                        <div className={"flexQChampions"}>
                            {renderChampions(summoner.mostPlayedNameFlex, summoner.mostPlayedImageFlex, summoner.mostPlayedWRFlex, summoner.mostPlayedKDAFlex)}
                        </div>
                    </div>
    </div>
    );

    }
    return (
        <div>
            {summoner ? renderSummoner() : <h1>Loading...</h1>}
        </div>
    );
}