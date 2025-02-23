import { useAuthenticator } from '@aws-amplify/ui-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface IProps {
    children: React.ReactNode
}

const ProtectedRoute: React.FC<IProps> = ({ children }) => {
    const { authStatus } = useAuthenticator((context) => [context.authStatus]);
    const navigate = useNavigate();
    const [isChecking, setIsChecking] = React.useState(true);

    React.useEffect(() => {
        if (authStatus === 'unauthenticated') {
            navigate('/login');
        } else {
            setIsChecking(false);
        }
    }, [authStatus, navigate]);

    if (isChecking) return null;

    return <>{children}</>;
};

export default ProtectedRoute;
