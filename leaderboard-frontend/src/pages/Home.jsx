import React, {useEffect, useState} from "react";
import axios from "axios";
import {Dropdown, DropdownButton, OverlayTrigger, Tooltip} from "react-bootstrap";
import {
    faGear,
    faRefresh,
    faUser,
    faUserMinus,
    faUserPlus,
    faUsers,
    faUsersViewfinder
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Footer} from "../Footer";
import {useNavigate} from "react-router-dom";
import Toggle from "react-toggle";
import LiveModal from "../components/LiveModal.jsx";
import {renderSummoner} from "../components/RenderSummoner.jsx";
import {formatDateTime, winrate} from "../components/HelperMethods.jsx";
export const Home = () => {
    const [patchVersion, setPatchVersion] = useState(null);
    const [summoners, setSummoners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingSummoners, setLoadingSummoners] = useState(true);
    const [timeUpdated, setTimeUpdated] = useState("");
    const [updateTime, setUpdateTime] = useState("");
    const navigate = useNavigate();
    const [sortFlexPoints, setSortFlexPoints] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const goRemove = () => {
        navigate('/remove');
    };

    const goAdd = () => {
        navigate('/add');
    };

    const toggleSort = () => {
        setSortFlexPoints(prevSortFlexPoints => {
            const newSortFlexPoints = !prevSortFlexPoints;
            populateSummoners(newSortFlexPoints).then(r => console.log("Updated"));
            return newSortFlexPoints;
        });
    };

    const update = async () => {

        setLoading(true);
        const url = 'api/updateRanked';
        try {
            const response = await axios.get(url);
            if (response.data === true) {
                console.log("Update successful");
            } else {
                const lastUpdateTime = new Date(updateTime);
                const currentTime = new Date();
                const timeDiff = (currentTime - lastUpdateTime) / 1000;
                const waitTime = 120 - timeDiff;
                alert(`Please wait ${waitTime.toFixed(0)} more seconds before updating again.`);
                console.error("Error updating: Update process failed.");
            }
        } catch (error) {
            console.error("Error updating: ", error.message);
        } finally {
            setLoading(false); // Stop loading regardless of the result
        }

        await populateSummoners();
    };

    const updateQueue = async (queue) => {
        try {
            const response = await axios.get(`api/update${queue}`);
            if (response.data===true) console.log("Update successful");
        } catch (error) {
            console.error("Error updating: ", error.message);
        }
        populateSummoners();
    }

    const lastTimeUpdated = async () => {
        try {
            const response = await axios.get('api/time');
            const formattedTime = formatDateTime(response.data);
            setTimeUpdated(formattedTime);
            setUpdateTime(response.data);
        } catch (error) {
            console.error("Error getting time " + error.message);
        }
    };

    const updateBoth = async () => {
        await updateQueue("Solo");
        await updateQueue("Flex");
    }

    const assignPositions = (summoners) => {
        let currentPosition = 1;
        let skipCount = 1;
        let prevPoints = null;
        let points;
        summoners.forEach((summoner, index) => {
            if (sortFlexPoints === true) {
                points = summoner.flexPoints;
            } else {
                points = summoner.points;
            }
            if (index === 0) {
                summoner.position = currentPosition;
            } else {
                if (points === prevPoints) {
                    summoner.position = currentPosition;
                    skipCount++;
                } else {
                    currentPosition += skipCount;
                    summoner.position = currentPosition;
                    skipCount = 1;
                }
            }
            prevPoints = points;
        });
    };

    const populateSummoners = async(sortFlexPoints) => {
        try {
            let summoners;
            let url;
            if (sortFlexPoints) {
                url = '/api/getAllFlex';
            } else {
                url = '/api/getAll';
            }
            const response = await axios.get(url);
            summoners = response.data;
            assignPositions(summoners);

            setSummoners(summoners);
            setLoading(false);
            setLoadingSummoners(false);
            lastTimeUpdated();
        } catch (error) {
            console.error("Error fetching summoners:", error);
        }
    };

    const getPatchVersion = async () => {
        try {
            const response = await axios.get('https://ddragon.leagueoflegends.com/realms/euw.json');
            let patch = response.data.v;

            setPatchVersion(patch);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const updateButton = (
        <div className="button updateB mobileButton" onClick={update}>
            Update Ranks
            <FontAwesomeIcon icon={faRefresh} />
        </div>
    );

    const loadingSpinner = (
        <div className="spinner-container"><div className="spinner"/></div>
    );

    useEffect(() => {
        populateSummoners();
        getPatchVersion();
    }, []);


    const [showLiveModal, setShowLiveModal] = useState(false);
    const [liveData, setLiveData] = useState(null);

    const toggleLiveModal = (liveData) => {
        setLiveData(liveData);
        setShowLiveModal(true);
    };

    let currentRanked = (sortFlexPoints===true ? "Flex Queue" : "Solo Queue");
    let switchRanked = (sortFlexPoints===true ? "Switch to Solo/Duo" : "Switch to Flex");
    let contents = (sortFlexPoints===true ? renderSummoner(summoners, winrate, patchVersion, "flex", windowWidth) : renderSummoner(summoners, winrate, patchVersion, "solo", windowWidth));

    const loadingCards = (
        <div className="player-cards-container">
            <div className="player-card render"/>
            <div className="player-card render"/>
            <div className="player-card render"/>
            <div className="player-card render"/>
            <div className="player-card render"/>
            <div className="player-card render"/>
        </div>
    );

    return (
        <div>
            <div className={"updateSection"}>

                <div className={"rankedtoggle"}>
                    <OverlayTrigger
                        placement="top"
                        overlay={
                            <Tooltip
                                id={`tooltip-top2`}>
                                {switchRanked}
                            </Tooltip>
                        }
                    >
                        <div>
                <Toggle
                    className=""
                    checked={sortFlexPoints}
                    onChange={toggleSort}
                    aria-label="Ranked queue toggle"
                    icons={{ unchecked: <FontAwesomeIcon icon={faUsers} className="toggle-icon fa-users" />,
                        checked: <FontAwesomeIcon icon={faUser} className="toggle-icon fa-user" /> }}
                />
                        </div>
                    </OverlayTrigger>
                    <div className={"rankedText"}>{currentRanked}</div>

                </div>
                <OverlayTrigger
                    placement="top"
                    overlay={
                        <Tooltip
                            id={`tooltip-top2`}>
                            Updated: {timeUpdated}
                        </Tooltip>
                    }
                >
                <div className={"updateButton"}>
                    {loading ? loadingSpinner : updateButton}
                </div>
                </OverlayTrigger>
                <div className={"moreOptions"}>
                        <DropdownButton
                            autoClose={"inside"}
                            id={"dropdown-custom"}
                            className={"button updateB"}
                            drop="down-centered"
                            title={<span>More updates <FontAwesomeIcon icon={faGear} /></span>}
                        >
                            <Dropdown.Item onClick={updateQueue("Flex")}>Flex Champions <FontAwesomeIcon icon={faUsers} id={"upSolo"} /></Dropdown.Item>
                            <Dropdown.Item onClick={updateQueue("Solo")}>Solo Champions <FontAwesomeIcon icon={faUser} id={"upSolo"}/></Dropdown.Item>
                            <Dropdown.Item onClick={updateBoth}>Both queues <FontAwesomeIcon icon={faUsersViewfinder} id={"upSolo"}/></Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={goAdd}>Add me <FontAwesomeIcon icon={faUserPlus} id={"upSolo"}/></Dropdown.Item>
                            <Dropdown.Item onClick={goRemove}>Remove me <FontAwesomeIcon icon={faUserMinus} id={"upSolo"}/></Dropdown.Item>
                        </DropdownButton>
                </div>

            </div>
            <LiveModal show={showLiveModal} onHide={() => setShowLiveModal(false)} liveData={liveData} />
            {loadingSummoners ? loadingCards : contents}
            <Footer />
        </div>

    );
};
