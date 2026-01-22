import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import {
  Calendar,
  Users,
  Bell,
  Clock,
  AlertCircle,
  Plus,
  Eye,
  Edit,
  Download
} from 'lucide-react';

const Dashboard = () => {
  const { admin, api } = useAuth();
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

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
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {admin?.name}! Here's what's happening with your events.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Events */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Events</h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All
                </button>
              </div>
            </div>
            <div className="p-6">
              {recentEvents.length > 0 ? (
                <div className="space-y-4">
                  {recentEvents.map((event) => (
                    <div key={event._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">{event.name}</h3>
                        <p className="text-xs text-gray-500">{event.department} • {event.eventType.join(', ')}</p>
                        <div className="flex items-center mt-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            event.status === 'Ongoing' ? 'bg-green-100 text-green-800' :
                            event.status === 'Upcoming' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {event.status}
                          </span>
                          <span className="ml-2 text-xs text-gray-500">
                            {event.currentRegistrations}/{event.maxParticipants} registered
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-400 hover:text-blue-600">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-green-600">
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No events yet</p>
                  <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Recent Notifications */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Notifications</h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All
                </button>
              </div>
            </div>
            <div className="p-6">
              {recentNotifications.length > 0 ? (
                <div className="space-y-4">
                  {recentNotifications.map((notification) => (
                    <div key={notification._id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <Bell className="h-5 w-5 text-blue-500 mt-0.5" />
                        </div>
                        <div className="ml-3 flex-1">
                          <h3 className="text-sm font-medium text-gray-900">{notification.title}</h3>
                          <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                          <div className="flex items-center mt-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              notification.isSent ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {notification.isSent ? 'Sent' : 'Scheduled'}
                            </span>
                            <span className="ml-2 text-xs text-gray-500">
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
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No notifications sent yet</p>
                  <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Send Notification
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Create New Event
            </button>
            <button className="flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <Bell className="h-4 w-4 mr-2" />
              Send Notification
            </button>
            <button className="flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
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
