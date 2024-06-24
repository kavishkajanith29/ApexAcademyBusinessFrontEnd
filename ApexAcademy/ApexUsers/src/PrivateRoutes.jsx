import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoutes = () => {
    const isAuthenticated  = localStorage.getItem('isAuthenticated') === 'true'; 

    return isAuthenticated ? <Outlet /> : <Navigate to="/LoginPage" />;
};

export default PrivateRoutes;
