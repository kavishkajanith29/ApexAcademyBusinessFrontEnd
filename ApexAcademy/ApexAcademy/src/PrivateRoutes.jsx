import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoutes = () => {
    const isAuthenticated  = localStorage.getItem('isAuthenticated') === 'true'; 

    return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;
