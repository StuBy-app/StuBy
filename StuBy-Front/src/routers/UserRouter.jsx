import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MainLayout from '../layout/MainLayout/MainLayout';

function UserRouter(props) {
    return (
        <MainLayout>
            <Routes>
                <Route path="/auth/*" element={<AuthRoute />} />
            </Routes>
        </MainLayout>
        
    );
}

export default UserRouter;