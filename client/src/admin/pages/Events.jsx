import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import ImageLightbox from '../../components/ImageLightbox';
import DeleteEventModal from '../components/DeleteEventModal';
import EditOuterCollegeModal from '../components/EditOuterCollegeModal';
import toast from 'react-hot-toast';
import {
  Plus,
  Calendar,
  MapPin,
  Users,
  Clock,
  Eye,
  Edit,
  Trash2,
  Filter,
  Search,
  ChevronDown,
  Image,
  CalendarX
} from 'lucide-react';

const Events = () => {
  const { admin, api } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cellsAndAssociationFilter, setCellsAndAssociationFilter] = useState(searchParams.get('cellsAndAssociation') || 'all');
  const [showFilters, setShowFilters] = useState(false);

  // Image lightbox state
  const [lightboxImage, setLightboxImage] = useState(null);
  const [lightboxAlt, setLightboxAlt] = useState('');

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  // Edit outer college modal state
  const [editOuterCollegeModalOpen, setEditOuterCollegeModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, statusFilter, cellsAndAssociationFilter]);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      setEvents(response.data.data.events);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Check if registration has ended based on registrationEndDate
   */
  const isRegistrationEnded = (event) => {
    if (!event.registrationEndDate) return false;
    return new Date(event.registrationEndDate) < new Date();
  };

  /**
   * Get effective status - shows 'Completed' if registration has ended
   */
  const getEffectiveStatus = (event) => {
    if (isRegistrationEnded(event) && event.status !== 'Cancelled') {
      return 'Completed';
    }
    return event.status;
  };

  const filterEvents = () => {
    let filtered = events;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organizingBody.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status (using effective status)
    if (statusFilter !== 'all') {
      filtered = filtered.filter(event => getEffectiveStatus(event) === statusFilter);
    }

    // Filter by cells and association
    if (cellsAndAssociationFilter !== 'all') {
      filtered = filtered.filter(event => event.cellsAndAssociation === cellsAndAssociationFilter);
    }

    setFilteredEvents(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ongoing':
        return 'bg-green-100 text-green-800';
      case 'Upcoming':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-gray-100 text-gray-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getModeColor = (mode) => {
    return mode === 'Online' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';
  };

  const handleEdit = (event) => {
    if (event.isOuterCollegeEvent) {
      // Open simplified edit modal for outer college events
      setEventToEdit(event);
      setEditOuterCollegeModalOpen(true);
    } else {
      // Navigate to full edit page for regular events
      navigate(`/admin/events/edit/${event._id}`);
    }
  };

  const handleOuterCollegeEditSave = () => {
    toast.success('Event updated successfully');
    fetchEvents(); // Refresh the events list
  };

  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (eventId) => {
    try {
      await api.delete(`/events/${eventId}`);
      toast.success('Event deleted successfully');
      // Remove from local state
      setEvents(prevEvents => prevEvents.filter(e => e._id !== eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
      throw error;
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-purple-200">Events</h1>
              <p className="text-gray-400 mt-2">
                Manage your college events and activities
              </p>
            </div>
            <Link
              to="/admin/events/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-900/40 backdrop-blur-xl border border-gray-800 rounded-xl shadow-lg mb-6">
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="relative">
                  <Search className="h-5 w-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Cells and Association Filter */}
                {admin?.cellsAndAssociation === 'OT' && (
                  <select
                    className="px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={cellsAndAssociationFilter}
                    onChange={(e) => setCellsAndAssociationFilter(e.target.value)}
                  >
                    <option value="all">All Cells and Associations</option>
                    <option value="IT">IT</option>
                    <option value="IIC">IIC</option>
                    <option value="EMDC">EMDC</option>
                  </select>
                )}

                {/* Status Filter */}
                <select
                  className="px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-3 py-2 text-gray-400 hover:text-white"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                <ChevronDown className={`h-4 w-4 ml-1 transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Results count */}
          <div className="px-4 py-3 bg-gray-800/50 border-b border-gray-800">
            <p className="text-sm text-gray-400">
              Showing {filteredEvents.length} of {events.length} events
            </p>
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
              const effectiveStatus = getEffectiveStatus(event);
              const registrationEnded = isRegistrationEnded(event);
              
              return (
                <div key={event._id} className="bg-gray-900/40 backdrop-blur-xl border border-gray-800 rounded-xl shadow-lg hover:border-blue-500/30 transition-all overflow-hidden">
                  {/* Event Poster Image - Improved display */}
                  <div className="h-56 bg-gray-800 relative">
                    {event.posterImage ? (
                      <img
                        src={`http://localhost:5000${event.posterImage}`}
                        alt={event.name}
                        className="w-full h-full object-contain bg-gray-900 cursor-pointer hover:opacity-90 transition-opacity p-2"
                        onClick={() => {
                          setLightboxImage(`http://localhost:5000${event.posterImage}`);
                          setLightboxAlt(event.name || 'Event Poster');
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700">
                        <Image className="w-12 h-12 text-white/50" />
                      </div>
                    )}
                    {/* Status Badge Overlay */}
                    <div className="absolute top-2 right-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColor(effectiveStatus)}`}>
                        {effectiveStatus}
                      </span>
                    </div>
                    {/* Registration Ended Badge */}
                    {registrationEnded && (
                      <div className="absolute top-2 left-2">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-500/90 text-white">
                          <CalendarX className="w-3 h-3 mr-1" />
                          Registration Closed
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Event Header */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">{event.name}</h3>
                        <p className="text-sm text-gray-400">{event.organizingBody}</p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getModeColor(event.mode)}`}>
                        {event.mode}
                      </span>
                    </div>

                    {/* Event Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-400">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        {new Date(event.eventDate).toLocaleDateString()}
                      </div>
                      {event.registrationEndDate && (
                        <div className={`flex items-center text-sm ${registrationEnded ? 'text-orange-400' : 'text-gray-400'}`}>
                          <CalendarX className="h-4 w-4 mr-2 text-gray-500" />
                          Reg. ends: {new Date(event.registrationEndDate).toLocaleDateString()}
                        </div>
                      )}
                      {event.mode === 'Offline' && (
                        <div className="flex items-center text-sm text-gray-400">
                          <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                          {event.venue}
                        </div>
                      )}
                      <div className="flex items-center text-sm text-gray-400">
                        <Users className="h-4 w-4 mr-2 text-gray-500" />
                        {event.currentRegistrations}/{event.maxParticipants} registered
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        {event.eventType.join(', ')}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-400 mb-1">
                        <span>Registration Progress</span>
                        <span>{Math.round((event.currentRegistrations / event.maxParticipants) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${Math.min((event.currentRegistrations / event.maxParticipants) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                      <div className="flex items-center space-x-2">
                        <button 
                          className="p-2 text-gray-500 hover:text-blue-400 transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleEdit(event)}
                          className="p-2 text-gray-500 hover:text-green-400 transition-colors"
                          title="Edit Event"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(event)}
                          className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                          title="Delete Event"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <span className="text-xs text-gray-400">
                        {event.cellsAndAssociation}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-gray-900/40 backdrop-blur-xl border border-gray-800 rounded-xl shadow-lg p-12">
            <div className="text-center">
              <Calendar className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No events found</h3>
              <p className="text-gray-400 mb-6">
                {searchTerm || statusFilter !== 'all' || cellsAndAssociationFilter !== 'all'
                  ? 'Try adjusting your filters or search terms'
                  : 'Get started by creating your first event'}
              </p>
              <Link
                to="/admin/events/create"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Image Lightbox */}
      <ImageLightbox
        isOpen={!!lightboxImage}
        onClose={() => {
          setLightboxImage(null);
          setLightboxAlt('');
        }}
        imageSrc={lightboxImage}
        imageAlt={lightboxAlt}
      />

      {/* Delete Event Modal */}
      <DeleteEventModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setEventToDelete(null);
        }}
        event={eventToDelete}
        onConfirmDelete={handleConfirmDelete}
        api={api}
      />

      {/* Edit Outer College Event Modal */}
      <EditOuterCollegeModal
        isOpen={editOuterCollegeModalOpen}
        onClose={() => {
          setEditOuterCollegeModalOpen(false);
          setEventToEdit(null);
        }}
        event={eventToEdit}
        onSave={handleOuterCollegeEditSave}
        api={api}
      />
    </div>
  );
};

export default Events;
