import {OverlayTrigger, Tooltip} from "react-bootstrap";
import {games, winrate} from "./HelperMethods.jsx";
import React from "react";

export const renderChampions = (name, image, wr, kda, patchVersion) => {
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