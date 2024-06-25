import { Outlet, Navigate } from 'react-router-dom';

const ProtectedRoutes = () => {
    const isAuthenticatedStudent  = localStorage.getItem('isAuthenticatedStudent') === 'true'; 

    return isAuthenticatedStudent ? <Outlet /> : <Navigate to="/LoginPage/student" />;
};

export default ProtectedRoutes;
