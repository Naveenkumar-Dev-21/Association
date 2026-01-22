import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import About from './pages/About';
import Members from './pages/Members';
import Notifications from './pages/Notifications';
import Registration from './pages/Registration';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        {/* Redirect specific category routes to main events page for now, or handle within Events component via query params */}
        <Route path="/events/iic" element={<Events />} />
        <Route path="/events/emdc" element={<Events />} />
        <Route path="/events/it" element={<Events />} />

        <Route path="/about" element={<About />} />
        <Route path="/members" element={<Members />} />
        <Route path="/members/iic" element={<Members />} />
        <Route path="/members/emdc" element={<Members />} />
        <Route path="/members/association" element={<Members />} />
        <Route path="/notifications" element={<Notifications />} />

        <Route path="/events/:id/register" element={<Registration />} />
        <Route path="/admin/login" element={<div className="pt-20 text-center text-xl">Admin Login Coming Soon</div>} />
      </Routes>
    </Layout>
  );
}

export default App;
