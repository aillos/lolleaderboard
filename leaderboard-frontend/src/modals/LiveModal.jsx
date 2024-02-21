import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const fetchPatchVersion = async () => {
    try {
        const response = await axios.get('https://ddragon.leagueoflegends.com/realms/euw.json');
        return response.data.v;
    } catch (error) {
        console.error("Failed to fetch patch version:", error);
        return null;
    }
};
const ParticipantDetails = ({ participant, patchVersion, isRightSide }) => (
    <div className={"spectatePlayer"}>
        {isRightSide && <div style={{marginRight:'8px'}}>{participant.summonerName}</div>}
        {isRightSide &&
            <div className="summonerSpells">
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`tooltip-top`}>{participant.spell1.name}</Tooltip>}
                >
                    <img
                        src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/spell/${participant.spell1.image}`}
                        alt={participant.spell1.name}
                    />
                </OverlayTrigger>
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`tooltip-top`}>{participant.spell2.name}</Tooltip>}
                >
                    <img
                        src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/spell/${participant.spell2.image}`}
                        alt={participant.spell2.name}
                    />
                </OverlayTrigger>
            </div>}

        <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`tooltip-top`}>{participant.championName}</Tooltip>}
        >
            <img
                src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/champion/${participant.championImage}`}
                alt={participant.championName}
            />
        </OverlayTrigger>
        {!isRightSide && <div className="summonerSpells">
            <OverlayTrigger
                placement="top"
                overlay={<Tooltip id={`tooltip-top`}>{participant.spell1.name}</Tooltip>}
            >
                <img
                    src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/spell/${participant.spell1.image}`}
                    alt={participant.spell1.name}
                />
            </OverlayTrigger>
            <OverlayTrigger
                placement="top"
                overlay={<Tooltip id={`tooltip-top`}>{participant.spell2.name}</Tooltip>}
            >
                <img
                    src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/spell/${participant.spell2.image}`}
                    alt={participant.spell2.name}
                />
            </OverlayTrigger>
        </div>}
        {!isRightSide && <div style={{marginLeft:'8px'}}>{participant.summonerName}</div>}
    </div>
);

const BannedChampions = ({ bans, patchVersion }) => (
    <div className="bannedChampions">
        {bans.map((ban, index) => (
            <OverlayTrigger
                key={index}
                placement="top"
                overlay={<Tooltip id={`tooltip-top`}>{ban[2]}</Tooltip>}
            >
                <img
                    src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/champion/${ban[3]}`}
                    alt={ban.championName}
                />
            </OverlayTrigger>
        ))}
    </div>
);

function LiveModal({ show, onHide, liveData }) {
    const [patchVersion, setPatchVersion] = useState(null);

    useEffect(() => {
        fetchPatchVersion().then(setPatchVersion);
    }, []);

    console.log(liveData);

    return liveData ? (
        <Modal show={show} onHide={onHide} backdrop="static" centered keyboard={false} className="liveModal">
            <Modal.Header closeButton closeVariant="white">
                <Modal.Title>{liveData.gameMode.replace(" games", "")}, {liveData.map}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="vs">VS</div>
                <div className={"bans"}>
                    <div className={"leftBans"}>
                        <BannedChampions bans={liveData.bannedChampions.slice(0, 5)} patchVersion={patchVersion}/>
                    </div>
                    <div className={"rightBans"}>
                        <BannedChampions bans={liveData.bannedChampions.slice(5)} patchVersion={patchVersion}/>
                    </div>
                </div>
                <div className="teams">
                    <div className="left">
                        {liveData.participants.slice(0, 5).map((participant, index) => (
                            <ParticipantDetails key={index} participant={participant} patchVersion={patchVersion}
                                                isRightSide={false}/>
                        ))}
                    </div>
                    <div className="right">
                        {liveData.participants.slice(5).map((participant, index) => (
                            <ParticipantDetails key={index} participant={participant} patchVersion={patchVersion}
                                                isRightSide={true}/>
                        ))}
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    ) : null;
}

export default LiveModal;
