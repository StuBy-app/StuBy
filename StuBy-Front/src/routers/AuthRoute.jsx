import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from '../pages/Auth/Login/Login';
import Join from '../pages/Auth/Join/Join';
import OAuthLogin from '../pages/Auth/OAuth2Login/OAuth2Login';
import Loading from '../pages/Loading/Loading';

function AuthRoute(props) {
    return (
        <Routes>
            <Route index element={<Loading />} />

            <Route path='/loading' element={<Loading />} />
            <Route path="/login" element={<Login />} />
            <Route path="/join" element={<Join />} />
            <Route path="/oauth2/login/*" element={<OAuthLogin />} />
        </Routes>
    );
}

export default AuthRoute;