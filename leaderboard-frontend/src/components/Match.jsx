import React from 'react';
import './Match.css';
import {OverlayTrigger, Tooltip} from "react-bootstrap";

const Match = ({ match, championJson, patchVersion, name, tag }) => {
    const participant = match.participants.find(p =>
        p.summoner.game_name === name && p.summoner.tagline === tag
    );
    const championId = participant.champion_id.toString();
    let championImage = '';

    const championData = Object.values(championJson).find(champion => champion.key === championId);
    if (championData) {
        championImage = championData.image.full;
    }

    const formatDate = (createdAt) => {
        const createdDate = new Date(createdAt);
        const now = new Date();
        const differenceInMilliseconds = now - createdDate;
        const minutes = Math.floor(differenceInMilliseconds / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (minutes < 60) {
            return `${minutes} mins ago`;
        } else if (hours < 24) {
            return `${hours} hours ago`;
        } else {
            return `${days} days ago`;
        }
    };


    return (

        <div className={`match result-${participant.stats.result.toLowerCase()}`}>
            <div className="match-info">
                <span className={'result'}>{formatDate(match.created_at)}</span>
                <OverlayTrigger
                    placement="bottom"
                    overlay={
                        <Tooltip
                            id={`tooltip-bottom`}>
                            Average: {match.average_tier_info.tier} {match.average_tier_info.division}
                        </Tooltip>
                    }
                >
                <span className="queue-type">{match.queue_info.queue_translate}</span>
                </OverlayTrigger>
                <span
                    className="game-duration">{Math.floor(match.game_length_second / 60)}m {match.game_length_second % 60}s</span>
            </div>
            <div className="champion-items">
                {championJson &&
                    <div className="champion-icon">
                    <img src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/champion/${championImage}`}
                         alt="Champion" />
                    </div>}
                <div className="items">
                    {participant.items.map((item, i) => item ? (
                            <img key={i}
                                 src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/item/${item}.png`}
                                 alt={`Item ${i + 1}`} className="item-icon"/>
                        ) : <div key={i} className="emptyItem"></div>
                    )}
                    <img
                        src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/item/${participant.trinket_item}.png`}
                        alt="Trinket" className="item-icon trinket"/>
                </div>
            </div>
            <div className="stats">
                <span>KDA: {participant.stats.kill}/{participant.stats.death}/{participant.stats.assist}</span>
                <span>CS: {participant.stats.minion_kill + (participant.stats.neutral_minion_kill || 0)}</span>
                <span>
                    <img
                        src={"https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/reward-tracker/item-category-icons/currency.png"}
                        alt={"Gold"}/>
                    {participant.stats.gold_earned.toLocaleString()}
                </span>
            </div>
        </div>

    );
};

export default Match;
