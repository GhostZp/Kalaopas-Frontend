import {Navigate, useLocation} from 'react-router';
import {useUserContext} from '../hooks/ContextHooks';

const ProtectedRoute = ({children}: {children: React.ReactNode}) => {
    const location = useLocation();
    const {user} = useUserContext();
    if (!user) {
        console.log('protected location', location.pathname);
        return <Navigate to="/" state={{from: location.pathname}} />;
    }
    return children;
};

export default ProtectedRoute;
