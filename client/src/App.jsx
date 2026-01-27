import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './admin/context/AuthContext';

// User Pages
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import About from './pages/About';
import Members from './pages/Members';
import Notifications from './pages/Notifications';
import Registration from './pages/Registration';
import ComingSoon from './pages/ComingSoon';
import OuterCollegeEvents from './pages/OuterCollegeEvents';

// Admin Pages
import AdminLogin from './admin/pages/Login';
import AdminDashboard from './admin/pages/Dashboard';
import AdminEvents from './admin/pages/Events';
import AdminCreateEvent from './admin/pages/CreateEvent';
import AdminEditEvent from './admin/pages/EditEvent';
import AdminRegistrations from './admin/pages/Registrations';
import AdminNotifications from './admin/pages/Notifications';
import AdminDownloads from './admin/pages/Downloads';
import AdminProfile from './admin/pages/Profile';
import LoadingSpinner from './admin/components/LoadingSpinner';

// TESTING MODE - Set to true to bypass authentication
const TESTING_MODE = true;

// Protected route component for Admin
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    
    // Bypass authentication in testing mode
    if (TESTING_MODE) return children;
    
    if (isLoading) return <LoadingSpinner />;
    return isAuthenticated ? children : <Navigate to="/admin/login" />;
};

// Public route component (redirect if authenticated)
const PublicRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    
    // In testing mode, allow access to login page
    if (TESTING_MODE) return children;
    
    if (isLoading) return <LoadingSpinner />;
    return !isAuthenticated ? children : <Navigate to="/admin/dashboard" />;
};

function App() {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_CLIENT_ID";

    return (
        <GoogleOAuthProvider clientId={googleClientId}>
            <AuthProvider>
                <Routes>
                    {/* Admin Routes (Prefix with /admin) */}
                    <Route
                        path="/admin/login"
                        element={
                            <PublicRoute>
                                <AdminLogin />
                            </PublicRoute>
                        }
                    />
                    
                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                    
                    <Route
                        path="/admin/events"
                        element={
                            <ProtectedRoute>
                                <AdminEvents />
                            </ProtectedRoute>
                        }
                    />
                    
                    <Route
                        path="/admin/events/create"
                        element={
                            <ProtectedRoute>
                                <AdminCreateEvent />
                            </ProtectedRoute>
                        }
                    />
                    
                    <Route
                        path="/admin/events/edit/:id"
                        element={
                            <ProtectedRoute>
                                <AdminEditEvent />
                            </ProtectedRoute>
                        }
                    />
                    
                    <Route
                        path="/admin/registrations"
                        element={
                            <ProtectedRoute>
                                <AdminRegistrations />
                            </ProtectedRoute>
                        }
                    />
                    
                    <Route
                        path="/admin/notifications"
                        element={
                            <ProtectedRoute>
                                <AdminNotifications />
                            </ProtectedRoute>
                        }
                    />
                    
                    <Route
                        path="/admin/downloads"
                        element={
                            <ProtectedRoute>
                                <AdminDownloads />
                            </ProtectedRoute>
                        }
                    />
                    
                    <Route
                        path="/admin/profile"
                        element={
                            <ProtectedRoute>
                                <AdminProfile />
                            </ProtectedRoute>
                        }
                    />

                    {/* Standard redirect for legacy /admin/login link (optional) */}
                    <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />

                    {/* User Routes (Wrapped in User Layout) */}
                    <Route path="/*" element={
                        <Layout>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/events" element={<Events />} />
                                <Route path="/events/:id" element={<EventDetail />} />
                                <Route path="/events/iic" element={<Events />} />
                                <Route path="/events/emdc" element={<Events />} />
                                <Route path="/events/it" element={<Events />} />
                                <Route path="/events/outer-college" element={<OuterCollegeEvents />} />
                                <Route path="/about" element={<About />} />
                                <Route path="/members" element={<Members />} />
                                <Route path="/members/iic" element={<Members />} />
                                <Route path="/members/emdc" element={<Members />} />
                                <Route path="/members/association" element={<Members />} />
                                <Route path="/notifications" element={<Notifications />} />
                                <Route path="/events/:id/register" element={<Registration />} />
                                <Route path="/policies/*" element={<ComingSoon />} />
                                <Route path="/year-plan/*" element={<ComingSoon />} />
                                <Route path="/iic/*" element={<ComingSoon />} />
                                <Route path="/emdc/*" element={<ComingSoon />} />
                                <Route path="/spark-fund/*" element={<ComingSoon />} />
                                <Route path="/reports/*" element={<ComingSoon />} />
                                <Route path="*" element={<ComingSoon />} />
                            </Routes>
                        </Layout>
                    } />
                </Routes>
                
                <Toaster position="top-right" />
            </AuthProvider>
        </GoogleOAuthProvider>
    );
}

export default App;
