import React, {useEffect, useState} from "react";
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCross, faGlobe, faSignal, faXmark} from "@fortawesome/free-solid-svg-icons";
import {DarkModeToggle} from "./theme/ColorToggle.jsx";
import {OverlayTrigger, Tooltip} from "react-bootstrap";

export const Header = () => {

    const [patchVersion, setPatchVersion] = useState("");
    const [serviceStatus, setServiceStatus] = useState(0);

    const getPatchVersion = async () => {
        try {
            const response = await axios.get('https://ddragon.leagueoflegends.com/realms/euw.json');
            let patchVersion = response.data.v;
            const patchNumber = patchVersion.charAt(patchVersion.length-1);
            let bPatch = '';
            if (parseInt(patchNumber) !== 1) bPatch = 'B';
            const patchVersionText = patchVersion.replace(/\.\d+$/, '') + bPatch;
            setPatchVersion(patchVersionText);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const getServiceStatus = async () => {
        try {
            const response = await axios.get('api/service');
            setServiceStatus(response.data);
            console.log(serviceStatus);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const getConnectionStatus = () => {
        let color = 'green';
        let icon = faSignal;

        if (serviceStatus === -1) {
            color = 'red';
            icon = faXmark;
        } else if (serviceStatus > 0) {
            color = 'yellow';
            icon = faSignal;
        }

        return { color, icon };
    };



    useEffect(() => {
        getServiceStatus();
        getPatchVersion();
    }, []);

    return (
        <div className={"header"}>
            <OverlayTrigger
                placement="bottom"
                overlay={
                    <Tooltip id={`tooltip-bottom`}>
                        Riot Games Service Status
                    </Tooltip>
                }
            >
            <div className={"statusHeader"}>
                Status:
                <FontAwesomeIcon
                    icon={getConnectionStatus().icon}
                    style={{ color: getConnectionStatus().color }}
                    className={"statusIcon"}>
                </FontAwesomeIcon>
            </div>
            </OverlayTrigger>
            |
            <OverlayTrigger
                placement="bottom"
                overlay={
                    <Tooltip id={`tooltip-bottom`}>
                        Current patch
                    </Tooltip>
                }
            >
            <div className={"patchHeader"}>
                 Patch: {patchVersion}
            </div>
            </OverlayTrigger>
            |
            <div className={"headerTheme"}>
            <OverlayTrigger
                placement="bottom"
                overlay={
                    <Tooltip id={`tooltip-bottom`}>
                        Change theme
                    </Tooltip>
                }
            >
                <div className="toggleButton">
                    <DarkModeToggle />
                </div>
            </OverlayTrigger>
            </div>
        </div>
    );
}