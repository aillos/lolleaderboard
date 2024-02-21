import { useParams } from 'react-router-dom';
import axios from "axios";
import {useEffect, useState} from "react";

export const Profile = () => {
    const [summoner, setSummoner] = useState(null);

    const { name, tag } = useParams();

    const getSummonerProfile = async (name, tag) => {
        const response = await axios.get(`/api/profile/${name}/${tag}`)
        setSummoner(response.data);
    }

    useEffect(() => {
        getSummonerProfile(name, tag).then(r => console.log(r));
    }, []);

    const renderSummoner = () => {
        if (summoner) {
            return (
                <div>
                    <h1>{summoner.gameName}</h1>
                    <h2>{summoner.tagLine}</h2>
                    <h3>{summoner.tier}</h3>
                </div>
            );
        }
    }
    return(
        <div>
            {renderSummoner()}
        </div>
    );
}