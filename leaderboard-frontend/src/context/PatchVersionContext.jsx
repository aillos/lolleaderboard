import React from 'react';

const PatchVersionContext = React.createContext({
    patchVersion: '',
    setPatchVersion: () => {}
});

export default PatchVersionContext;
