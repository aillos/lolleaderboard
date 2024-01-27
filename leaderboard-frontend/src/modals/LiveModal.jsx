import Modal from 'react-bootstrap/Modal';
import axios from "axios";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import React, {useEffect} from "react";

async function fetchPatchVersion() {
    const response = await axios.get('https://ddragon.leagueoflegends.com/realms/euw.json');
    return response.data.v;
}


function LiveModal({ show, onHide, liveData }) {
    const [patchVersion, setPatchVersion] = React.useState(null);

    useEffect(() => {
        async function fetchData() {
            const version = await fetchPatchVersion();
            setPatchVersion(version);
        }
        fetchData();
    }, []);

    if (liveData) {
        return (
        <>
            <Modal
                show={show}
                onHide={onHide}
                backdrop="static"
                centered
                keyboard={false}
                className={"liveModal"}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{liveData.gameMode.replace(" games", "")}, {liveData.map}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {liveData && (
                        <>
                            <div className={"row"}>
                                <div className={"left"}><h1>Blue</h1></div>
                                <div className={"center"}><b>VS</b></div>
                                <div className={"right"}><h1>Red</h1></div>
                            </div>
                            <div className={"row"}>
                                <div className={"left"}>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip
                                                id={`tooltip-top`}>
                                                {liveData.participants[0].championName}
                                            </Tooltip>
                                        }
                                    >
                                    <img src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/champion/` + liveData.participants[0].championImage}  alt={""}/>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip
                                                id={`tooltip-top`}>
                                                {liveData.participants[0].spell1.name}
                                            </Tooltip>
                                        }
                                    >
                                        <img src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/spell/` + liveData.participants[0].spell1.image}  alt={""}/>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip
                                                id={`tooltip-top`}>
                                                {liveData.participants[0].spell2.name}
                                            </Tooltip>
                                        }
                                    >
                                        <img src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/spell/` + liveData.participants[0].spell2.image}  alt={""}/>
                                    </OverlayTrigger>
                                        {liveData.participants[0].summonerName}
                                </div>
                                <div className={"center"}> </div>
                                <div className={"right"}>
                                    {liveData.participants[5].summonerName}
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip
                                                id={`tooltip-top`}>
                                                {liveData.participants[5].spell1.name}
                                            </Tooltip>
                                        }
                                    >
                                        <img src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/spell/` + liveData.participants[5].spell1.image}  alt={""}/>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip
                                                id={`tooltip-top`}>
                                                {liveData.participants[5].spell2.name}
                                            </Tooltip>
                                        }
                                    >
                                        <img src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/spell/` + liveData.participants[5].spell2.image}  alt={""}/>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip
                                                id={`tooltip-top`}>
                                                {liveData.participants[5].championName}
                                            </Tooltip>
                                        }
                                    >
                                    <img src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/champion/` + liveData.participants[5].championImage}  alt={""}/>
                                    </OverlayTrigger>
                                    </div>
                            </div>
                            <div className={"row"}>
                                <div className={"left"}>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip
                                                id={`tooltip-top`}>
                                                {liveData.participants[1].championName}
                                            </Tooltip>
                                        }
                                    >
                                    <img src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/champion/` + liveData.participants[1].championImage}  alt={""}/>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip
                                                id={`tooltip-top`}>
                                                {liveData.participants[1].spell1.name}
                                            </Tooltip>
                                        }
                                    >
                                        <img src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/spell/` + liveData.participants[1].spell1.image}  alt={""}/>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip
                                                id={`tooltip-top`}>
                                                {liveData.participants[1].spell2.name}
                                            </Tooltip>
                                        }
                                    >
                                        <img src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/spell/` + liveData.participants[1].spell2.image}  alt={""}/>
                                    </OverlayTrigger>
                                        {liveData.participants[1].summonerName}
                                </div>
                                <div className={"center"}> </div>
                                <div className={"right"}>
                                    {liveData.participants[6].summonerName}
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip
                                                id={`tooltip-top`}>
                                                {liveData.participants[6].spell1.name}
                                            </Tooltip>
                                        }
                                    >
                                        <img src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/spell/` + liveData.participants[6].spell1.image}  alt={""}/>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip
                                                id={`tooltip-top`}>
                                                {liveData.participants[6].spell2.name}
                                            </Tooltip>
                                        }
                                    >
                                        <img src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/spell/` + liveData.participants[6].spell2.image}  alt={""}/>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip
                                                id={`tooltip-top`}>
                                                {liveData.participants[6].championName}
                                            </Tooltip>
                                        }
                                    >
                                    <img src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/champion/` + liveData.participants[6].championImage}  alt={""}/>
                                    </OverlayTrigger>
                                    </div>
                            </div>
                            <div className={"row"}>
                                <div className={"left"}>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip
                                                id={`tooltip-top`}>
                                                {liveData.participants[2].championName}
                                            </Tooltip>
                                        }
                                    >
                                    <img src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/champion/` + liveData.participants[2].championImage}  alt={""}/>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip
                                                id={`tooltip-top`}>
                                                {liveData.participants[2].spell1.name}
                                            </Tooltip>
                                        }
                                    >
                                        <img src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/spell/` + liveData.participants[2].spell1.image}  alt={""}/>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip
                                                id={`tooltip-top`}>
                                                {liveData.participants[2].spell2.name}
                                            </Tooltip>
                                        }
                                    >
                                        <img src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/spell/` + liveData.participants[2].spell2.image}  alt={""}/>
                                    </OverlayTrigger>
                                        {liveData.participants[2].summonerName}
                                </div>
                                <div className={"center"}> </div>
                                <div className={"right"}>
                                    {liveData.participants[7].summonerName}
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip
                                                id={`tooltip-top`}>
                                                {liveData.participants[7].championName}
                                            </Tooltip>
                                        }
                                    >
                                    <img src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/champion/` + liveData.participants[7].championImage}  alt={""}/>
                                    </OverlayTrigger>
                                    </div>
                            </div>
                            <div className={"row"}>
                                <div className={"left"}>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip
                                                id={`tooltip-top`}>
                                                {liveData.participants[3].championName}
                                            </Tooltip>
                                        }
                                    >
                                    <img src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/champion/` + liveData.participants[3].championImage}  alt={""}/>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip
                                                id={`tooltip-top`}>
                                                {liveData.participants[3].spell1.name}
                                            </Tooltip>
                                        }
                                    >
                                        <img src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/spell/` + liveData.participants[9].spell1.image}  alt={""}/>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip
                                                id={`tooltip-top`}>
                                                {liveData.participants[3].spell2.name}
                                            </Tooltip>
                                        }
                                    >
                                        <img src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/spell/` + liveData.participants[9].spell2.image}  alt={""}/>
                                    </OverlayTrigger>
                                        {liveData.participants[3].summonerName}
                                </div>
                                <div className={"center"}> </div>
                                <div className={"right"}>
                                    {liveData.participants[8].summonerName}
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip
                                                id={`tooltip-top`}>
                                                {liveData.participants[8].spell1.name}
                                            </Tooltip>
                                        }
                                    >
                                        <img src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/spell/` + liveData.participants[9].spell1.image}  alt={""}/>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip
                                                id={`tooltip-top`}>
                                                {liveData.participants[8].spell2.name}
                                            </Tooltip>
                                        }
                                    >
                                        <img src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/spell/` + liveData.participants[9].spell2.image}  alt={""}/>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip
                                                id={`tooltip-top`}>
                                                {liveData.participants[8].championName}
                                            </Tooltip>
                                        }
                                    >
                                    <img src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/champion/` + liveData.participants[8].championImage}  alt={""}/>
                                    </OverlayTrigger>
                                    </div>
                            </div>
                            <div className={"row"}>
                                <div className={"left"}>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip
                                                id={`tooltip-top`}>
                                                {liveData.participants[4].championName}
                                            </Tooltip>
                                        }
                                    >
                                    <img src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/champion/` + liveData.participants[4].championImage}  alt={""}/>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip
                                                id={`tooltip-top`}>
                                                {liveData.participants[4].spell1.name}
                                            </Tooltip>
                                        }
                                    >
                                        <img src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/spell/` + liveData.participants[4].spell1.image}  alt={""}/>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip
                                                id={`tooltip-top`}>
                                                {liveData.participants[4].spell2.name}
                                            </Tooltip>
                                        }
                                    >
                                        <img src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/spell/` + liveData.participants[4].spell2.image}  alt={""}/>
                                    </OverlayTrigger>
                                        {liveData.participants[4].summonerName}
                                </div>
                                <div className={"center"}> </div>
                                <div className={"right"}>
                                    {liveData.participants[9].summonerName}
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip
                                                id={`tooltip-top`}>
                                                {liveData.participants[9].spell1.name}
                                            </Tooltip>
                                        }
                                    >
                                        <img src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/spell/` + liveData.participants[9].spell1.image}  alt={""}/>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip
                                                id={`tooltip-top`}>
                                                {liveData.participants[9].spell2.name}
                                            </Tooltip>
                                        }
                                    >
                                        <img src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/spell/` + liveData.participants[9].spell2.image}  alt={""}/>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip
                                                id={`tooltip-top`}>
                                                {liveData.participants[9].championName}
                                            </Tooltip>
                                        }
                                    >
                                    <img src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/champion/` + liveData.participants[9].championImage}  alt={""}/>
                                    </OverlayTrigger>
                                    </div>
                            </div>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>

                </Modal.Footer>
            </Modal>
        </>
    );}
}

export default LiveModal;