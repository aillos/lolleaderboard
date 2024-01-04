import React, {Component, useEffect, useState} from "react";
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGlobe} from "@fortawesome/free-solid-svg-icons";

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
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const getGlobeColor = () => {
        if (serviceStatus === -1) {
            return 'red';
        } else if (serviceStatus > 0) {
            return 'yellow';
        } else {
            return 'green';
        }
    };



    useEffect(() => {
        getServiceStatus();
        getPatchVersion();
    }, []);

    return (
        <div className={"header"}>
            <div className={"statusHeader"}>
                <p>Status: </p>
                <FontAwesomeIcon
                    icon={faGlobe}
                    style={{ color: getGlobeColor() }}
                    className={"statusIcon"}>
                </FontAwesomeIcon>
            </div>
            |
            <div className={"patchHeader"}>
                 Patch: {patchVersion}
            </div>
            |
            <div className={"themeHeader"}>
                <input type={"checkbox"} />
            </div>
        </div>
    );
}