import React from "react";
import Toggle from "react-toggle";
import { useColorScheme } from "./ColorSchemeState";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import "react-toggle/style.css";
import "./ColorToggle.css";

export const DarkModeToggle = () => {
    const { isDark, setIsDark } = useColorScheme();

    return (
        <label>
            <Toggle
                className="custom-toggle"
                checked={isDark}
                onChange={({ target }) => setIsDark(target.checked)}
                aria-label="Dark mode toggle"
                icons={{ unchecked: <FontAwesomeIcon icon={faMoon} className="toggle-icon fa-moon" />,
                    checked: <FontAwesomeIcon icon={faSun} className="toggle-icon fa-sun" /> }}
            />
        </label>
    );
};