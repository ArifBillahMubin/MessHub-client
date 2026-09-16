import { Navigate, useLocation } from 'react-router';
import useAuth from '../hooks/useAuth';
import Loading from '../components/Loading/Loading';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return <Loading></Loading>

    if (!user) {
        return <Navigate state={location.pathname} to={'/login'}></Navigate>
    }
    return (children);
};

export default PrivateRoute;