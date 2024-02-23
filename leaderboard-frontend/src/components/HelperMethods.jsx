import {OverlayTrigger, Tooltip} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFire} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import first from "../assets/first.png";
import second from "../assets/second.png";
import third from "../assets/third.png";
import none from "../assets/none.png";

export const formatNumberWithSpaces = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

export const winrate = (wins, losses) => {
    wins = Number(wins) ?? 0;
    losses = Number(losses) ?? 0;

    if (wins + losses === 0) return '0%';
    return `${((wins / (wins + losses)) * 100).toFixed(1)}%`;
};

export const games = (wins, losses) =>{
    return Number(wins)+Number(losses);
}

export const tierCheck = (summoner) => {
    if (summoner.flexPoints > summoner.points){
        return summoner.flexTier.toLowerCase();
    } else {
        return summoner.tier.toLowerCase();
    }
}

export const highElo = (rank) => {
    const highElo = ["MASTER", "GRANDMASTER", "CHALLENGER"];
    return highElo.includes(rank);
}

export const splitPrevRank = (prevRank) => {
    if (prevRank === "UNRANKED") return "UNRANKED";
    return prevRank.split(" ")[0];
}

export const getRankColor = (rank) => {
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

export const hotstreak = (hotstreak) =>{
    return hotstreak === 1;
}

export const getPlacementColor = (rank) =>{
    if (rank === 1){
        return "#9d7730";
    } else if (rank === 2){
        return "#bfbfbf";
    } else if (rank === 3){
        return "#9f6a4e";
    } else {
        return "white";
    }

}

export const streak = (name, windowWidth) => {
    if (windowWidth > 400) {
        return (
            <OverlayTrigger
                placement="top"
                overlay={
                    <Tooltip
                        id={`tooltip-top`}>
                        Winstreak
                    </Tooltip>
                }
            >
                    <span className="streak" style={{fontSize: name.length > 11 ? '16px' : '20px'}}>
                        <FontAwesomeIcon icon={faFire} />
                    </span>
            </OverlayTrigger>
        );
    } else {
        return(
            <span className="streak">
                </span>
        );
    }
};

export const placementIcon = (rank) => {
    console.log(rank);
    if (rank === 1){
        return first;
    } else if (rank === 2){
        return second;
    } else if (rank === 3){
        return third;
    } else {
        return none;
    }
}