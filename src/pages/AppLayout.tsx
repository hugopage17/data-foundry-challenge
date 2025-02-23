import React from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Avatar, CssBaseline, Toolbar, Typography, Box, AppBar, IconButton, Divider, Tooltip } from '@mui/material';
import { StorageImage } from '@aws-amplify/ui-react-storage';
import CreateServiceRequest from '../components/CreateServiceRequest';
import { Logout } from '@mui/icons-material';
import ListServiceRequests from '../components/ListServiceRequests';

const AppLayout: React.FC = () => {

    const { signOut, user } = useAuthenticator((context) => [context.user]);

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, p: 0, backgroundColor: 'white' }} elevation={0}>
                <Toolbar variant="dense">
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '8px' }}>
                        <StorageImage alt="app-icon" path="app-icons/logo.png" width={32} />
                    </span>

                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}></Typography>
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        <IconButton>
                            <Tooltip title={`Logged in as ${user?.signInDetails?.loginId}`}>
                                <Avatar sx={{ width: 24, height: 24 }} />
                            </Tooltip>
                        </IconButton>
                        <IconButton onClick={signOut}>
                            <Logout />
                        </IconButton>
                    </Box>
                </Toolbar>
                <Divider />
            </AppBar>
            <Box component="main" sx={{ flexGrow: 1 }}>
                <CreateServiceRequest />
                <ListServiceRequests />
            </Box>
        </Box>
    );
};

export default AppLayout;
