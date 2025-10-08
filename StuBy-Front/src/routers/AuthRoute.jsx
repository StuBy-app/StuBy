import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from '../pages/Auth/Login/Login';
import Join from '../pages/Auth/Join/Join';
import OAuthLogin from '../pages/Auth/OAuth2Login/OAuth2Login';

function AuthRoute(props) {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/join" element={<Join />} />
            <Route path="/oauth2/login*" element={<OAuthLogin />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default AuthRoute;