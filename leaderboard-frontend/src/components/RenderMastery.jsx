import {OverlayTrigger, Tooltip} from "react-bootstrap";
import {formatNumberWithSpaces} from "./HelperMethods.jsx";
import React from "react";

export const renderMastery = (name, image, points, patchVersion) => {
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
                <div className="profile-image-container2">
                    <img
                        src={points[0] === "" ? `https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/profileicon/29.png` : `https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/champion/${image[0]}`}
                        alt={`${name[0]} champion`}/>
                </div>
            </OverlayTrigger>
            <div className={"profile-image-bottom"}>
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
                    <div className="profile-image-container">
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
                    <div className="profile-image-container1">
                        <img
                            src={points[1] === "" ? `https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/profileicon/29.png` : `https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/champion/${image[1]}`}
                            alt={`${name[1]} champion`}/>
                    </div>
                </OverlayTrigger>
            </div>
        </div>
    );
}