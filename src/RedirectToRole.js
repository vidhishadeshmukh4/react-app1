import React from 'react';
import { Navigate } from 'react-router-dom';

const RedirectToRole = () => {
    const role = localStorage.getItem('userRole');

    if (role === 'admin') {
        return <Navigate to="/adminpage" />;
    } else if (role === 'user') {
        return <Navigate to="/dashboard" />;
    } else {
        return <Navigate to="/" />;
    }
};

export default RedirectToRole;
