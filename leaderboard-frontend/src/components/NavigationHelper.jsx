import {useNavigate} from "react-router-dom";

const navigate = useNavigate();

export const goToProfile = (name, tag) => {
    navigate(`/profile/${name}/${tag}`);
}