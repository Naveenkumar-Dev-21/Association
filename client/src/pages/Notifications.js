import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import toast from 'react-hot-toast';
import {
  Bell,
  Plus,
  Send,
  Calendar,
  Users,
  Edit,
  Trash2,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const Notifications = () => {
  const { api } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'General',
    targetAudience: ['All Students'],
    relatedEvent: '',
    scheduledFor: ''
  });

  const notificationTypes = ['New Event', 'Event Reminder', 'Registration Closing', 'General'];
  const targetAudiences = ['All Students', 'IT Department', 'IIC Department', 'EMDC Department'];

  useEffect(() => {
    fetchNotifications();
    fetchEvents();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data.data.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      setEvents(response.data.data.events);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTargetAudienceChange = (audience) => {
    setFormData(prev => ({
      ...prev,
      targetAudience: prev.targetAudience.includes(audience)
        ? prev.targetAudience.filter(a => a !== audience)
        : [...prev.targetAudience, audience]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await api.post('/notifications', formData);
      toast.success('Notification created successfully!');
      setShowCreateForm(false);
      setFormData({
        title: '',
        message: '',
        type: 'General',
        targetAudience: ['All Students'],
        relatedEvent: '',
        scheduledFor: ''
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error creating notification:', error);
      toast.error(error.response?.data?.message || 'Failed to create notification');
    }
  };

  const handleSendNow = async (notificationId) => {
    try {
      await api.post(`/notifications/${notificationId}/send`);
      toast.success('Notification sent successfully!');
      fetchNotifications();
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error(error.response?.data?.message || 'Failed to send notification');
    }
  };

  const handleDelete = async (notificationId) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        await api.delete(`/notifications/${notificationId}`);
        toast.success('Notification deleted successfully!');
        fetchNotifications();
      } catch (error) {
        console.error('Error deleting notification:', error);
        toast.error(error.response?.data?.message || 'Failed to delete notification');
      }
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'New Event':
        return 'bg-blue-100 text-blue-800';
      case 'Event Reminder':
        return 'bg-yellow-100 text-yellow-800';
      case 'Registration Closing':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (isSent) => {
    return isSent ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <Clock className="h-4 w-4 text-yellow-500" />
    );
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                          (statusFilter === 'sent' && notification.isSent) ||
                          (statusFilter === 'scheduled' && !notification.isSent);
    return matchesSearch && matchesStatus;
  });

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600 mt-2">Manage and send notifications to students</p>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Notification
            </button>
          </div>
        </div>

        {/* Create Notification Form */}
        {showCreateForm && (
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Create New Notification</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter notification title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {notificationTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter notification message"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Audience *
                  </label>
                  <div className="space-y-2">
                    {targetAudiences.map((audience) => (
                      <label key={audience} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.targetAudience.includes(audience)}
                          onChange={() => handleTargetAudienceChange(audience)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">{audience}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Related Event
                  </label>
                  <select
                    name="relatedEvent"
                    value={formData.relatedEvent}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select an event (optional)</option>
                    {events.map((event) => (
                      <option key={event._id} value={event._id}>{event.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Schedule For
                  </label>
                  <input
                    type="datetime-local"
                    name="scheduledFor"
                    value={formData.scheduledFor}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end mt-6 space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Create Notification
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search notifications..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <select
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="sent">Sent</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            {filteredNotifications.length > 0 ? (
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <div key={notification._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">{notification.title}</h3>
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getTypeColor(notification.type)}`}>
                            {notification.type}
                          </span>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(notification.isSent)}
                            <span className="text-xs text-gray-500">
                              {notification.isSent ? 'Sent' : 'Scheduled'}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{notification.message}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {notification.targetAudience.join(', ')}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </div>
                          {notification.relatedEvent && (
                            <div className="flex items-center">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              {notification.relatedEvent.name}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.isSent && (
                          <button
                            onClick={() => handleSendNow(notification._id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                            title="Send now"
                          >
                            <Send className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          className="p-2 text-gray-400 hover:text-blue-600 rounded-lg"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(notification._id)}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || statusFilter !== 'all'
                    ? 'Try adjusting your filters or search terms'
                    : 'Create your first notification to get started'}
                </p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Notification
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
