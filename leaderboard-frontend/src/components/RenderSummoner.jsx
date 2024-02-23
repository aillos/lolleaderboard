import React from "react";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import {
    games,
    getPlacementColor,
    getRankColor,
    highElo,
    hotstreak,
    placementIcon,
    splitPrevRank,
    streak
} from "./HelperMethods.jsx";
import '../index.css';
import {useNavigate} from "react-router-dom";


export const renderSummoner = (summoners, winrate, patchVersion, type, windowWidth) => {
    const navigate = useNavigate();

    const goToProfile = (name, tag) => {
        navigate(`/profile/${name}/${tag}`);
    };
    return(
    <div className="player-cards-container">
        {summoners.map((summoner) => {
            const isSolo = type === "solo";
            const tier = isSolo ? summoner.tier : summoner.flexTier;
            const rank = isSolo ? summoner.rank : summoner.flexRank;
            const lp = isSolo ? summoner.lp : summoner.flexLp;
            const hotStreak = isSolo ? summoner.hotStreak : summoner.flexHotStreak;
            const wins = isSolo ? summoner.wins : summoner.flexWins;
            const losses = isSolo ? summoner.losses : summoner.flexLosses;
            const mostPlayedKDA = isSolo ? summoner.mostPlayedKDA : summoner.mostPlayedKDAFlex;
            const mostPlayedName = isSolo ? summoner.mostPlayedName : summoner.mostPlayedNameFlex;
            const mostPlayedImage = isSolo ? summoner.mostPlayedImage : summoner.mostPlayedImageFlex;
            const mostPlayedWR = isSolo ? summoner.mostPlayedWR : summoner.mostPlayedWRFlex;

            return (
                <div className="player-card"
                     key={summoner.gameName + summoner.tagLine}
                     onClick={() => goToProfile(summoner.gameName, summoner.tagLine)}
                >
                    <div className="player-rank" style={{color: getPlacementColor(summoner.position)}}>
                        {summoner.position}
                        <span><img src={placementIcon(summoner.position)} alt={"Placement"}/></span>
                    </div>
                    <div className="player-avatar">
                        {tier !== "UNRANKED" ? <img id={"ranked-border"}
                                                    src={`https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-emblem/wings/wings_${tier.toLowerCase()}.png`}
                                                    alt={`Ranked border`}/> : ""}
                        <img
                            src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/profileicon/${summoner.summonerIcon}.png`}
                            alt={`${summoner.gameName} avatar`}/>
                    </div>
                    <div className="player-info">
                        <div className={"rankAndName"}>
                            <div className="nameAndStreak">
                                {hotstreak(hotStreak) ? streak(summoner.gameName, windowWidth) : ""}
                                <OverlayTrigger
                                    placement="top"
                                    overlay={
                                        <Tooltip id={`tooltip-top`}>
                                            {summoner.gameName} #{summoner.tagLine}
                                        </Tooltip>
                                    }
                                >
                                    <h2 className="summoner-name"
                                        style={{fontSize: summoner.gameName.length > 11 ? '20px' : '24px'}}>
                                        {summoner.gameName}
                                    </h2>
                                </OverlayTrigger>
                            </div>
                            <OverlayTrigger
                                placement="bottom"
                                overlay={
                                    <Tooltip id={`tooltip-bottom2`}>
                                        Previous: <img
                                        src={`https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests/${splitPrevRank(summoner.prevRank).toLowerCase()}.svg`}
                                        alt={`${summoner.prevRank} icon`} style={{marginBottom: '2px'}}/>
                                        <b>{highElo(splitPrevRank(summoner.prevRank)) ? splitPrevRank(summoner.prevRank) : summoner.prevRank}</b>
                                    </Tooltip>
                                }
                            >
                                <div>
                        <span style={{color: getRankColor(tier), fontWeight: "bold"}}>
                            {tier} {rank}
                        </span>
                                    <span> {lp} LP</span>
                                </div>
                            </OverlayTrigger>
                        </div>
                        <div className={"winsLosses"}>
                            <OverlayTrigger
                                placement="top"
                                overlay={
                                    <Tooltip
                                        id={mostPlayedKDA[0] === "0" ? "tooltip-invis" : `tooltip-top`}>
                                        <b>{mostPlayedName[0]} </b> <br/>
                                        Games: <b>{games(mostPlayedWR[0], mostPlayedWR[1])}</b>
                                        <br/>
                                        Avg: <b>{mostPlayedKDA[0]}</b> <br/>
                                        WR: <b> {winrate(mostPlayedWR[0], mostPlayedWR[1])} </b>
                                    </Tooltip>
                                }
                            >
                                <div className="image-container2">
                                    <img
                                        src={mostPlayedKDA[0] === "0" ? `https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/profileicon/29.png` : `https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/champion/${mostPlayedImage[0]}`}
                                        alt={`${mostPlayedName[0]} champion`}/>
                                </div>
                            </OverlayTrigger>
                            <div className={"image-bottom"}>
                                <OverlayTrigger
                                    placement="top"
                                    overlay={
                                        <Tooltip
                                            id={mostPlayedKDA[2] === "0" ? "tooltip-invis" : `tooltip-top`}>
                                            <b>{mostPlayedName[2]} </b> <br/>
                                            Games: <b>{games(mostPlayedWR[4], mostPlayedWR[5])}</b>
                                            <br/>
                                            Avg: <b>{mostPlayedKDA[2]}</b> <br/>
                                            WR: <b> {winrate(mostPlayedWR[4], mostPlayedWR[5])} </b>

                                        </Tooltip>
                                    }
                                >
                                    <div className="image-container">
                                        <img
                                            src={mostPlayedKDA[2] === "0" ? `https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/profileicon/29.png` : `https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/champion/${mostPlayedImage[2]}`}
                                            alt={`${mostPlayedName[2]} champion`}/>
                                    </div>
                                </OverlayTrigger>
                                <OverlayTrigger
                                    placement="top"
                                    overlay={
                                        <Tooltip
                                            id={mostPlayedKDA[1] === "0" ? "tooltip-invis" : `tooltip-top`}>
                                            <b>{mostPlayedName[1]} </b> <br/>
                                            Games: <b>{games(mostPlayedWR[2], mostPlayedWR[3])}</b>
                                            <br/>
                                            Avg: <b>{mostPlayedKDA[1]}</b> <br/>
                                            WR: <b> {winrate(mostPlayedWR[2], mostPlayedWR[3])} </b>
                                        </Tooltip>
                                    }
                                >
                                    <div className="image-container1">
                                        <img
                                            src={mostPlayedKDA[1] === "0" ? `https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/profileicon/29.png` : `https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/champion/${mostPlayedImage[1]}`}
                                            alt={`${mostPlayedName[1]} champion`}/>
                                    </div>
                                </OverlayTrigger>
                            </div>
                        </div>
                        {windowWidth > 400 ?
                            <OverlayTrigger
                                placement="right"
                                overlay={
                                    <Tooltip
                                        id={`tooltip-right`}>
                                        {wins} wins<br/>
                                        {losses} losses<br/>
                                        {games(wins, losses)} games<br/>
                                    </Tooltip>
                                }
                            >
                                <div className={"winRate"}>

                                    <div className={"winrate1"}>
                                        <p> {winrate(wins, losses)}</p>
                                    </div>
                                    <div className={"winrate2"}>
                                        <p>WINRATE</p>
                                    </div>
                                </div>
                            </OverlayTrigger> :
                            <div className={"winRate"}>

                                <div className={"winrate1"}>
                                    <p> {winrate(wins, losses)}</p>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            );
        })}
    </div>
    );
}
