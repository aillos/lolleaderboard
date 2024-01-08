import React, {useEffect, useState} from "react";
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGithub, faInstagram, faJava, faReact, faTwitter} from "@fortawesome/free-brands-svg-icons";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import {faCode} from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router-dom";

export const Footer = () => {
    const navigate = useNavigate();

    const navigateToTwitter = () => {
        window.open('https://twitter.com/aillostft', '_blank');
    };

    const navigateToGithub = () => {
        window.open('https://github.com/aillos', '_blank');
    };

    const goToManage = () => {
        navigate('/manage');
    };

    const navigateToInstagram = () => {
        window.open('https://www.instagram.com/andreas_solli', '_blank');
    };

    return (
        <div className={"footer"}>

            <div className={"socialsFooter"}>
                Socials:
                <OverlayTrigger
                    placement="top"
                    overlay={
                        <Tooltip id={`tooltip-top`}>
                            Go to Github
                        </Tooltip>
                    }
                >
                <FontAwesomeIcon icon={faGithub} onClick={navigateToGithub}/>
                </OverlayTrigger>
                <OverlayTrigger
                    placement="top"
                    overlay={
                        <Tooltip id={`tooltip-top`}>
                            Go to Twitter
                        </Tooltip>
                    }
                >
                    <FontAwesomeIcon icon={faTwitter} onClick={navigateToTwitter}/>
                </OverlayTrigger>
                <OverlayTrigger
                    placement="top"
                    overlay={
                        <Tooltip id={`tooltip-top`}>
                            Go to Instagram
                        </Tooltip>
                    }
                >
                    <FontAwesomeIcon icon={faInstagram} onClick={navigateToInstagram}/>
                </OverlayTrigger>
            </div>
            <div className={"techstackFooter"}>
                Made with:
                <OverlayTrigger
                    placement="top"
                    overlay={
                        <Tooltip id={`tooltip-top`}>
                            Java
                        </Tooltip>
                    }
                >
                <FontAwesomeIcon icon={faJava}/>
                </OverlayTrigger>
                <OverlayTrigger
                    placement="top"
                    overlay={
                        <Tooltip id={`tooltip-top`}>
                            React.js
                        </Tooltip>
                    }
                >
                <FontAwesomeIcon icon={faReact} />
                </OverlayTrigger>
                <OverlayTrigger
                    placement="top"
                    overlay={
                        <Tooltip id={`tooltip-top`}>
                            Vite JS
                        </Tooltip>
                    }
                >
                <FontAwesomeIcon icon={faCode} />
                </OverlayTrigger>
            </div>
            <div className={"copyrightFooter"} onClick={goToManage}>
                ©2024 Andreas Solli
            </div>
        </div>
    );
}