import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoutes = () => {
    const isAuthenticated  = localStorage.getItem('isAuthenticatedTeacher') === 'true'; 

    return isAuthenticated ? <Outlet /> : <Navigate to="/LoginPage/teacher" />;
};

export default PrivateRoutes;
