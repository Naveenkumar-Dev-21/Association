import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCountUp } from '../hooks/useCountUp';
import Sidebar from '../components/Sidebar';
import toast from 'react-hot-toast';
import {
  Calendar,
  Users,
  Bell,
  Clock,
  AlertCircle,
  Plus,
  Eye,
  Edit,
  Download,
  RefreshCw,
  Send,
  TrendingUp
} from 'lucide-react';

const Dashboard = () => {
  const { admin, api } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEvents: 0,
    ongoingEvents: 0,
    upcomingEvents: 0,
    completedEvents: 0,
    totalRegistrations: 0,
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      // Fetch events
      const eventsResponse = await api.get('/events');
      const events = eventsResponse.data.data.events;

      // Calculate stats
      const totalEvents = events.length;
      const ongoingEvents = events.filter(e => e.status === 'Ongoing').length;
      const upcomingEvents = events.filter(e => e.status === 'Upcoming').length;
      const completedEvents = events.filter(e => e.status === 'Completed').length;
      const totalRegistrations = events.reduce((sum, event) => sum + event.currentRegistrations, 0);

      setStats({
        totalEvents,
        ongoingEvents,
        upcomingEvents,
        completedEvents,
        totalRegistrations,
      });

      // Get recent events (last 5)
      const recent = events
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentEvents(recent);

      // Fetch notifications
      const notificationsResponse = await api.get('/notifications');
      const notifications = notificationsResponse.data.data.notifications;
      const recentNotifs = notifications
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentNotifications(recentNotifs);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Navigation handlers
  const handleViewAllEvents = () => navigate('/admin/events');
  const handleViewAllNotifications = () => navigate('/admin/notifications');
  const handleViewEvent = (eventId) => navigate(`/admin/events`);
  const handleEditEvent = (eventId) => navigate(`/admin/events`);
  const handleCreateEvent = () => navigate('/admin/events/create');
  const handleSendNotification = () => navigate('/admin/notifications');
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDashboardData();
    toast.success('Dashboard refreshed!');
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Total Events',
      value: stats.totalEvents,
      icon: Calendar,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Ongoing Events',
      value: stats.ongoingEvents,
      icon: Clock,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Upcoming Events',
      value: stats.upcomingEvents,
      icon: AlertCircle,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Total Registrations',
      value: stats.totalRegistrations,
      icon: Users,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  // Animated stat card component
  const AnimatedStatCard = ({ stat, index }) => {
    const animatedValue = useCountUp(stat.value, 1500);
    
    return (
      <div 
        className="bg-gray-900/40 backdrop-blur-xl border border-gray-800 rounded-xl shadow-lg p-6 hover:border-blue-500/30 hover:scale-105 transition-all duration-300 animate-fade-in-up"
        style={{ animationDelay: `${index * 100}ms`, opacity: 0 }}
      >
        <div className="flex items-center">
          <div className={`${stat.bgColor} bg-opacity-20 p-3 rounded-lg border border-opacity-30 group-hover:scale-110 transition-transform duration-300`} style={{borderColor: stat.color}}>
            <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-400">{stat.title}</p>
            <p className="text-2xl font-bold text-white">{isLoading ? 0 : animatedValue}</p>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-950 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-purple-200 font-sans">
              {admin?.cellsAndAssociation} Dashboard
            </h1>
            <p className="text-gray-400 mt-2 font-sans">
              Welcome back, {admin?.name}! 
              {admin?.cellsAndAssociation === 'OT' 
                ? " Manage your overall tasks here."
                : admin?.cellsAndAssociation === 'IIC'
                  ? " Manage your IIC innovation activities."
                  : admin?.cellsAndAssociation === 'EMDC'
                    ? " Overview of Entrepreneurship activities."
                    : " Here's what's happening with your events."}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-lg text-gray-300 bg-gray-800 hover:bg-gray-700 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={handleCreateEvent}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <AnimatedStatCard key={index} stat={stat} index={index} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Events */}
          <div className="bg-gray-900/40 backdrop-blur-xl border border-gray-800 rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Recent Events</h2>
                <button 
                  onClick={handleViewAllEvents}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                >
                  View All
                </button>
              </div>
            </div>
            <div className="p-6">
              {recentEvents.length > 0 ? (
                <div className="space-y-4">
                  {recentEvents.map((event) => (
                    <div key={event._id} className="flex items-center justify-between p-3 bg-gray-800/50 border border-gray-700 rounded-lg hover:border-blue-500/30 transition-all">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-white">{event.name}</h3>
                        <p className="text-xs text-gray-400">{event.department} • {event.eventType.join(', ')}</p>
                        <div className="flex items-center mt-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            event.status === 'Ongoing' ? 'bg-green-100/10 text-green-400 border border-green-500/20' :
                            event.status === 'Upcoming' ? 'bg-yellow-100/10 text-yellow-400 border border-yellow-500/20' :
                            'bg-gray-100/10 text-gray-400 border border-gray-500/20'
                          }`}>
                            {event.status}
                          </span>
                          <span className="ml-2 text-xs text-gray-400">
                            {event.currentRegistrations}/{event.maxParticipants} registered
                          </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="mt-3 w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-blue-500 h-full rounded-full transition-all duration-1000 ease-out"
                            style={{ 
                              width: `${Math.min((event.currentRegistrations / event.maxParticipants) * 100, 100)}%`,
                              boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleViewEvent(event._id)}
                          className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                          title="View Event"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleEditEvent(event._id)}
                          className="p-1 text-gray-400 hover:text-green-400 transition-colors"
                          title="Edit Event"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No events yet</p>
                  <button 
                    onClick={handleCreateEvent}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-all"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Recent Notifications */}
          <div className="bg-gray-900/40 backdrop-blur-xl border border-gray-800 rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Recent Notifications</h2>
                <button 
                  onClick={handleViewAllNotifications}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                >
                  View All
                </button>
              </div>
            </div>
            <div className="p-6">
              {recentNotifications.length > 0 ? (
                <div className="space-y-4">
                  {recentNotifications.map((notification) => (
                    <div key={notification._id} className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg hover:border-blue-500/30 transition-all">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <Bell className="h-5 w-5 text-blue-400 mt-0.5" />
                        </div>
                        <div className="ml-3 flex-1">
                          <h3 className="text-sm font-medium text-white">{notification.title}</h3>
                          <p className="text-xs text-gray-400 mt-1">{notification.message}</p>
                          <div className="flex items-center mt-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              notification.isSent ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {notification.isSent ? 'Sent' : 'Scheduled'}
                            </span>
                            <span className="ml-2 text-xs text-gray-400">
                              {new Date(notification.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No notifications sent yet</p>
                  <button 
                    onClick={handleSendNotification}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-all"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Send Notification
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gray-900/40 backdrop-blur-xl border border-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={handleCreateEvent}
              className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] transition-all duration-200 shadow-lg shadow-blue-900/20"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Event
            </button>
            <button 
              onClick={handleSendNotification}
              className="flex items-center justify-center px-4 py-3 bg-gray-800/50 border border-gray-700 text-sm font-medium rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white hover:scale-[1.02] transition-all duration-200"
            >
              <Bell className="h-4 w-4 mr-2" />
              Send Notification
            </button>
            <button 
              onClick={() => navigate('/admin/downloads')}
              className="flex items-center justify-center px-4 py-3 bg-gray-800/50 border border-gray-700 text-sm font-medium rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white hover:scale-[1.02] transition-all duration-200"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
