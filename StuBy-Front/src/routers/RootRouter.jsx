import React from 'react';
import usePrincipalQuery from '../queries/usePrincipalQuery';
import { Route, Routes } from 'react-router-dom';

function RootRouter(props) {
    const principalQuery = usePrincipalQuery();

    return (
        <Routes>
            <Route path="/*" element={<AuthRoute />} />
        </Routes>
    );
}

export default RootRouter;