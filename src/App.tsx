import React from 'react';
import { Authenticator } from "@aws-amplify/ui-react";
import '@aws-amplify/ui-react/styles.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import appTheme from './AppTheme';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './pages/AppLayout';
import LoginPage from './pages/LoginPage';

const App: React.FC = () => {
    const theme = appTheme();
    return (
        <Authenticator.Provider>
            <ThemeProvider theme={theme}>
                <Router>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <AppLayout />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </Router>
            </ThemeProvider>
        </Authenticator.Provider>
    );
}

export default App;
