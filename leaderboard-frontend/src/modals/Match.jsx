import React from 'react';
import './Match.css';

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

    return (
        <div className="match">
            <div className="match-info">
                <span className={`result ${participant.stats.result.toLowerCase()}`}>{participant.stats.result}</span>
                <span className="queue-type">{match.queue_info.queue_translate}</span>
                <span className="game-duration">{Math.floor(match.game_length_second / 60)}m {match.game_length_second % 60}s</span>
            </div>
            <div className="champion-items">
                {championJson && <img src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/champion/${championImage}`} alt="Champion" className="champion-icon"/>}
                <div className="items">
                    {participant.items.map((item, i) => item ? (
                            <img key={i} src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/item/${item}.png`} alt={`Item ${i + 1}`} className="item-icon"/>
                        ) : <div key={i} className="emptyItem"></div>
                    )}
                    <img src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/item/${participant.trinket_item}.png`} alt="Trinket" className="item-icon trinket"/>
                </div>
            </div>
            <div className="stats">
                <span>KDA: {participant.stats.kill}/{participant.stats.death}/{participant.stats.assist}</span>
                <span>CS: {participant.stats.minion_kill + (participant.stats.neutral_minion_kill || 0)}</span>
                <span>Gold: {participant.stats.gold_earned.toLocaleString()}</span>
            </div>
        </div>
    );
};

export default Match;
