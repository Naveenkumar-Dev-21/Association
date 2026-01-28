import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Save,
  Upload,
  Calendar,
  MapPin,
  Users,
  Link as LinkIcon,
  MessageCircle,
  Loader2,
  Image
} from 'lucide-react';

const EditEvent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { api } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [posterPreview, setPosterPreview] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    organizingBody: '',
    mode: 'Offline',
    eventDate: '',
    registrationEndDate: '',
    venue: '',
    eventCoordinator: {
      name: '',
      contact: ''
    },
    cellsAndAssociation: 'IT',
    posterImage: null,
    description: '',
    rules: '',
    eventLink: '',
    whatsappGroupLink: '',
    registrationLink: '',
    maxParticipants: '',
    status: 'Upcoming',
    isPublished: false
  });

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await api.get(`/events/${id}`);
      const event = response.data.data.event;
      
      setFormData({
        name: event.name || '',
        organizingBody: event.organizingBody || '',
        mode: event.mode || 'Offline',
        eventDate: event.eventDate ? new Date(event.eventDate).toISOString().split('T')[0] : '',
        registrationEndDate: event.registrationEndDate ? new Date(event.registrationEndDate).toISOString().split('T')[0] : '',
        venue: event.venue || '',
        eventCoordinator: {
          name: event.eventCoordinator?.name || '',
          contact: event.eventCoordinator?.contact || ''
        },
        cellsAndAssociation: event.cellsAndAssociation || 'IT',
        posterImage: null,
        description: event.description || '',
        rules: event.rules || '',
        eventLink: event.eventLink || '',
        whatsappGroupLink: event.whatsappGroupLink || '',
        registrationLink: event.registrationLink || '',
        maxParticipants: event.maxParticipants?.toString() || '',
        status: event.status || 'Upcoming',
        isPublished: event.isPublished || false
      });
      
      // Set poster preview if exists
      if (event.posterImage) {
        setPosterPreview(`http://localhost:5000${event.posterImage}`);
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      toast.error('Failed to load event');
      navigate('/admin/events');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
      
      // Create preview
      if (name === 'posterImage') {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPosterPreview(reader.result);
        };
        reader.readAsDataURL(files[0]);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.organizingBody || !formData.eventDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSaving(true);
    
    try {
      const formDataToSend = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'eventCoordinator') {
          formDataToSend.append('eventCoordinator[name]', formData.eventCoordinator.name);
          formDataToSend.append('eventCoordinator[contact]', formData.eventCoordinator.contact);
        } else if (formData[key] instanceof File) {
          formDataToSend.append(key, formData[key]);
        } else if (typeof formData[key] === 'boolean') {
          formDataToSend.append(key, formData[key].toString());
        } else if (formData[key] !== null && formData[key] !== '') {
          formDataToSend.append(key, formData[key]);
        }
      });

      await api.put(`/events/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Event updated successfully!');
      navigate('/admin/events');
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error(error.response?.data?.message || 'Failed to update event');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex bg-gray-950 min-h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-950 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/events')}
            className="flex items-center text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </button>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-purple-200">
            Edit Event
          </h1>
          <p className="text-gray-400 mt-2">
            Update event details and settings
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-gray-900/40 backdrop-blur-xl border border-gray-800 rounded-xl shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Event Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Event Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter event name"
              />
            </div>

            {/* Organizing Body */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Organizing Body *
              </label>
              <select
                name="organizingBody"
                value={formData.organizingBody}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select organizing body</option>
                <option value="IT">IT</option>
                <option value="IIC">IIC</option>
                <option value="EMDC">EMDC</option>
              </select>
            </div>

            {/* Event Date */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Calendar className="inline-block w-4 h-4 mr-2" />
                Event Date *
              </label>
              <input
                type="date"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Registration End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Calendar className="inline-block w-4 h-4 mr-2" />
                Registration End Date
              </label>
              <input
                type="date"
                name="registrationEndDate"
                value={formData.registrationEndDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-gray-500 text-xs mt-1">
                Event will be marked as "Completed" after this date
              </p>
            </div>

            {/* Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Mode
              </label>
              <select
                name="mode"
                value={formData.mode}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
              </select>
            </div>

            {/* Venue (only for offline) */}
            {formData.mode === 'Offline' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <MapPin className="inline-block w-4 h-4 mr-2" />
                  Venue
                </label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter venue"
                />
              </div>
            )}

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Max Participants */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Users className="inline-block w-4 h-4 mr-2" />
                Max Participants
              </label>
              <input
                type="number"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Maximum participants"
              />
            </div>

            {/* Coordinator Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Coordinator Name
              </label>
              <input
                type="text"
                name="eventCoordinator.name"
                value={formData.eventCoordinator.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Coordinator name"
              />
            </div>

            {/* Coordinator Contact */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Coordinator Contact
              </label>
              <input
                type="text"
                name="eventCoordinator.contact"
                value={formData.eventCoordinator.contact}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Phone number"
              />
            </div>

            {/* WhatsApp Group Link */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <MessageCircle className="inline-block w-4 h-4 mr-2" />
                WhatsApp Group Link
              </label>
              <input
                type="url"
                name="whatsappGroupLink"
                value={formData.whatsappGroupLink}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://chat.whatsapp.com/..."
              />
            </div>

            {/* Registration Link */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <LinkIcon className="inline-block w-4 h-4 mr-2" />
                Registration Link
              </label>
              <input
                type="url"
                name="registrationLink"
                value={formData.registrationLink}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Registration form link"
              />
            </div>

            {/* Event Link */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <LinkIcon className="inline-block w-4 h-4 mr-2" />
                Event Link (Meeting/Website)
              </label>
              <input
                type="url"
                name="eventLink"
                value={formData.eventLink}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Meeting link or event website"
              />
            </div>

            {/* Poster Image */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Image className="inline-block w-4 h-4 mr-2" />
                Event Poster
              </label>
              <div className="flex items-start space-x-4">
                {posterPreview && (
                  <img
                    src={posterPreview}
                    alt="Poster preview"
                    className="w-40 h-40 object-contain bg-gray-800 rounded-lg border border-gray-700"
                  />
                )}
                <div className="flex-1">
                  <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">Click to upload new poster</p>
                      <p className="text-gray-500 text-xs mt-1">PNG, JPG, GIF up to 10MB</p>
                    </div>
                    <input
                      type="file"
                      name="posterImage"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Event description..."
              />
            </div>

            {/* Rules */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Rules
              </label>
              <textarea
                name="rules"
                value={formData.rules}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Event rules and guidelines..."
              />
            </div>

            {/* Published Toggle */}
            <div className="md:col-span-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-gray-300">Publish event (visible to students)</span>
              </label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-700">
            <button
              type="button"
              onClick={() => navigate('/admin/events')}
              className="px-6 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;
