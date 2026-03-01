import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Dashboard from './pages/admin/Dashboard';
import EventsManagement from './pages/admin/EventsManagement';
import AdminCalendar from './pages/admin/AdminCalendar';
import Registrations from './pages/admin/Registrations';
import Venues from './pages/admin/Venues';
import AdminLayout from './components/AdminLayout';
import PublicLayout from './components/PublicLayout';

function App() {
    return (
        <Router>
            <Toaster position="bottom-right" />
            <Routes>
                {/* Public Routes */}
                <Route element={<PublicLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/events/:id" element={<EventDetail />} />
                </Route>

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="events" element={<EventsManagement />} />
                    <Route path="calendar" element={<AdminCalendar />} />
                    <Route path="registrations" element={<Registrations />} />
                    <Route path="venues" element={<Venues />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
