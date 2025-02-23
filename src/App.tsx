import React from 'react';
import { Authenticator } from "@aws-amplify/ui-react";
import '@aws-amplify/ui-react/styles.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './pages/AppLayout';
import LoginPage from './pages/LoginPage';

const App: React.FC = () => {
    return (
        <Authenticator.Provider>
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
        </Authenticator.Provider>
    );
}

export default App;
