import { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';

export function useColorScheme() {
    const systemPrefersDark = useMediaQuery({ query: '(prefers-color-scheme: dark)' });

    const [isDark, setIsDark] = useState(() => {
        const userPreference = localStorage.getItem('colorScheme');
        if (userPreference != null) {
            return JSON.parse(userPreference);
        } else {
            return systemPrefersDark;
        }
    });

    useEffect(() => {
        localStorage.setItem('colorScheme', JSON.stringify(isDark));
    }, [isDark]);

    useEffect(() => {
        if (isDark) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }, [isDark]);

    return {
        isDark,
        setIsDark,
    };
}
