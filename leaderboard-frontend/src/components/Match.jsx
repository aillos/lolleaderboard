import React from 'react';
import './Match.css';
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import minion from '../assets/minion.png';
import fight from '../assets/fight.png';
import gold from '../assets/gold.png';
import clock from '../assets/clock.png';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCalendarDays, faChartLine} from "@fortawesome/free-solid-svg-icons";
import spellJson from '../assets/summoner.json';
import runeJson from '../assets/runesReforged.json';

const Match = ({ match, championJson, patchVersion, name, tag, itemJson }) => {
    const participant = match.participants.find(p =>
        p.summoner.game_name === name && p.summoner.tagline === tag
    );
    const championId = participant.champion_id.toString();
    let championImage = '';
    let championName = '';

    const championData = Object.values(championJson).find(champion => champion.key === championId);
    if (championData) {
        championImage = championData.image.full;
        championName = championData.name;
    }

    const findItemData = (itemId) => {
        const itemData = itemJson[itemId];
        return itemData ? itemData.name : 'Unknown Item';
    };


    const spell2Id = participant.spells[0].toString();
    const spell1Id = participant.spells[1].toString();

    const spell1Data = Object.values(spellJson.data).find(spell => spell.key === spell1Id);
    const spell0Data = Object.values(spellJson.data).find(spell => spell.key === spell2Id);


    let spell1Name='';
    let spell1='';
    let spell0Name='';
    let spell0='';

    if (spell1Data) {
        spell1Name = spell1Data.name;
        spell1 = spell1Data.image.full;
    }

    if (spell0Data) {
        spell0Name = spell0Data.name;
        spell0 = spell0Data.image.full;
    }

    const rune1Id = participant.rune.primary_rune_id.toString();
    const rune2Id = participant.rune.secondary_page_id.toString();

    const findRuneDataById = (runeId) => {
        for (let tree of runeJson) {
            for (let slot of tree.slots) {
                for (let rune of slot.runes) {
                    if (rune.id.toString() === runeId) {
                        return rune;
                    }
                }
            }
        }
        return null;
    };

    const findSecondaryRuneById = (runeId) => {
        for (let tree of runeJson) {
                    if (tree.id.toString() === runeId) {
                        return tree;
                }
            }
        return null;
    };

    const rune1Data = findRuneDataById(rune1Id);
    const rune2Data = findSecondaryRuneById(rune2Id);



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
            if (hours < 48){
                return `${days} day ago`;
            } else {
                return `${days} days ago`;
            }
        }
    };

    const getRole = (role) => {
        if (role === "ADC"){
            return 'bottom';
        } else if (role !== null){
            return role.toLowerCase();
        } else {
            return role;
        }
    }


    const getOpScore = (score) => {
        score = score.toString();
        if (score === '1'){
            return `${score}st`;
        } else if (score === '2'){
            return `${score}nd`;
        } else if (score === '3'){
            return `${score}rd`;
        } else {
            return `${score}th`;
        }
    }

    let backgroundColor;
    switch (participant.stats.op_score_rank) {
        case 1:
            backgroundColor = 'rgba(235,155,36,0.5)';
            break;
        case 2:
            backgroundColor = 'rgba(255,255,255,0.5)';
            break;
        case 3:
            backgroundColor = 'rgba(255,175,94,0.5)';
            break;
        default:
            backgroundColor = 'rgba(176,176,176,0.5)';
            break;
    }

    return (

        <div className={`match result-${participant.stats.result.toLowerCase()}`}>
            <div className="match-info">
                <span className={'result'}><FontAwesomeIcon icon={faCalendarDays} style={{marginBottom:'1px', color:'#cdbe91'}}/> {formatDate(match.created_at)}</span>
                <OverlayTrigger
                    placement="top"
                    overlay={
                        <Tooltip
                            id={`tooltip-top`}
                            style={{fontWeight: 'bold'}}>
                            <FontAwesomeIcon icon={faChartLine} style={{marginRight: '4px'}}/>
                            {match.average_tier_info.tier} {match.average_tier_info.division}
                            <img
                                src={`https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests/${match.average_tier_info.tier.toLowerCase()}.svg`}
                                alt={`${match.average_tier_info.tier} icon`}
                                style={{marginLeft: '3px', marginBottom:'4px'}}/>
                        </Tooltip>
                    }
                >
                    <span className="queue-type">{match.queue_info.queue_translate}</span>
                </OverlayTrigger>
                <span
                    className="game-duration"><img src={clock} alt={"Clock"}/>{Math.floor(match.game_length_second / 60)}m {match.game_length_second % 60}s</span>
            </div>
            <div className="champion-items">
                {championJson &&
                    <div className="champion-icon">
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id={`tooltip-top`}>{championName}</Tooltip>}
                        >
                        <img
                            src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/champion/${championImage}`}
                            alt="Champion"/>
                        </OverlayTrigger>
                        <span className="champion-level">{participant.stats.champion_level}</span>
                    </div>}
                <div className={"summoner-spells"}>
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`tooltip-top`}>{spell0Name}</Tooltip>}
                    >
                        <img
                            src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/spell/${spell0}`}
                            alt={spell0Name}
                        />
                    </OverlayTrigger>
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`tooltip-top`}>{spell1Name}</Tooltip>}
                    >
                        <img
                            src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/spell/${spell1}`}
                            alt={spell1Name}
                        />
                    </OverlayTrigger>
                </div>
                <div className={"runes"}>
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`tooltip-top`}>{rune1Data.name}</Tooltip>}
                    >
                    {rune1Data && <img
                        src={`https://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/v1/${rune1Data.icon.toLowerCase()}`}
                        alt={rune1Data.name}/>}
                    </OverlayTrigger>
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`tooltip-top`}>{rune2Data.name}</Tooltip>}
                    >
                    <span id={"secondaryRune"}>{rune2Data && <img
                        src={`https://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/v1/${rune2Data.icon.toLowerCase()}`}
                        alt={rune2Data.name}/>} </span>
                    </OverlayTrigger>
                </div>

                <div className="items">
                    {participant.items.map((item, i) => item ? (
                            <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip id={`tooltip-top`}>{findItemData(item)}</Tooltip>}
                            >
                            <img key={i}
                                 src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/item/${item}.png`}
                                 alt={`Item ${i + 1}`} className="item-icon"/>
                            </OverlayTrigger>
                        ) : <div key={i} className="emptyItem"></div>
                    )}
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`tooltip-top`}>{findItemData(participant.trinket_item)}</Tooltip>}
                    >
                    <img
                        src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/item/${participant.trinket_item}.png`}
                        alt="Trinket" className="item-icon trinket"/>
                    </OverlayTrigger>
                </div>
                <div className={"position"}>
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`tooltip-top`}>{participant.position}</Tooltip>}
                    >{participant.position ?
                        <img
                            src={`https://raw.communitydragon.org/14.4/plugins/rcp-fe-lol-career-stats/global/default/position_${getRole(participant.position)}.png`}
                            alt={participant.position}/> : <></>}
                    </OverlayTrigger>
                    {participant.stats.op_score !== 0 ?
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id={`tooltip-top`}>op.gg
                                score: <b>{participant.stats.op_score}</b></Tooltip>}
                        >
                            <span style={{backgroundColor}}>{getOpScore(participant.stats.op_score_rank)}</span>
                        </OverlayTrigger> : <></>}
                </div>
            </div>
            <div className="stats">
                <span>
                    <img src={fight} alt={"KDA"}/>
                    {participant.stats.kill}/{participant.stats.death}/{participant.stats.assist}
                </span>
                <span>
                    <img src={minion} alt={"CS"}/>
                    {participant.stats.minion_kill + (participant.stats.neutral_minion_kill || 0)}</span>
                <span>
                    <img
                        src={gold} alt={"Gold"}/>
                    {participant.stats.gold_earned.toLocaleString()}
                </span>
            </div>
        </div>

    );
};

export default Match;
