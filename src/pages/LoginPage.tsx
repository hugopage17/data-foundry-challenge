import React from 'react';
import { Box, styled } from '@mui/material';
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import { StorageImage } from '@aws-amplify/ui-react-storage';
import { useNavigate } from 'react-router-dom';

const Container = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(4)
}))

const LoginPage = () => {
    const { authStatus } = useAuthenticator((context) => [context.authStatus]);
    const navigate = useNavigate();

    React.useEffect(() => {
        if (authStatus === "authenticated") {
            navigate("/");
        }
    }, [authStatus, navigate]);

    return (
        <Container>
            <StorageImage alt="app-icon" path="app-icons/logo.png" width={128} />
            <Authenticator />
        </Container>
    );
};

export default LoginPage;
