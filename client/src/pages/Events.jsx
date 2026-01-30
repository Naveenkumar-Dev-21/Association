import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Filter, Calendar, MapPin, Clock } from 'lucide-react';
import axios from 'axios';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ImageLightbox from '../components/ImageLightbox';
import EventDetailsModal from '../components/EventDetailsModal';
import toast from 'react-hot-toast';
import { getImageUrl } from '../config/api';

const API_URL = '/api';

const Events = () => {
    const location = useLocation();
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Image lightbox state
    const [lightboxImage, setLightboxImage] = useState(null);
    const [lightboxAlt, setLightboxAlt] = useState('');

    // Event details modal state
    const [showEventDetails, setShowEventDetails] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    // Determine the category based on URL path
    const getCategoryFromPath = () => {
        if (location.pathname.includes('/events/iic')) return 'IIC';
        if (location.pathname.includes('/events/emdc')) return 'EMDC';
        if (location.pathname.includes('/events/it')) return 'IT';
        return null; // Main events page shows all (except outer college)
    };

    const currentCategory = getCategoryFromPath();

    // Get page title based on category
    const getPageTitle = () => {
        switch (currentCategory) {
            case 'IIC': return 'IIC Events';
            case 'EMDC': return 'EMDC Events';
            case 'IT': return 'IT Events';
            default: return 'Explore Events';
        }
    };

    // Get page description
    const getPageDescription = () => {
        switch (currentCategory) {
            case 'IIC': return "Events organized by Institution's Innovation Council";
            case 'EMDC': return 'Events organized by Entrepreneurship Development Center';
            case 'IT': return 'Events organized by IT Association';
            default: return 'Discover workshops, seminars, and competitions organized by our clubs.';
        }
    };

    // Fetch events from API
    useEffect(() => {
        fetchEvents();
    }, [location.pathname]);

    const fetchEvents = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_URL}/events/public`);
            if (response.data.success) {
                let filteredEvents = response.data.data.events;
                
                // Debug: Log poster image data for each event
                console.log('=== User Events Poster Debug ===');
                filteredEvents.forEach((event, index) => {
                    console.log(`Event ${index + 1}: ${event.name}`);
                    console.log(`  - posterImage: ${event.posterImage}`);
                    console.log(`  - posterImage type: ${typeof event.posterImage}`);
                    console.log(`  - posterImage exists: ${!!event.posterImage}`);
                    if (event.posterImage) {
                        console.log(`  - Full URL: ${getImageUrl(event.posterImage)}`);
                    }
                    console.log('---');
                });
                
                // Always exclude outer college events from this page
                filteredEvents = filteredEvents.filter(event => !event.isOuterCollegeEvent);
                
                // Filter by category if on a specific category page
                if (currentCategory) {
                    filteredEvents = filteredEvents.filter(
                        event => event.cellsAndAssociation === currentCategory
                    );
                }
                
                setEvents(filteredEvents);
            }
        } catch (error) {
            console.error('Error fetching events:', error);
            toast.error('Failed to load events');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredEvents = events.filter(event => {
        const eventName = event.name || '';
        const matchesSearch = eventName.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    /**
     * Check if registration has ended based on registrationEndDate
     */
    const isRegistrationEnded = (event) => {
        if (!event.registrationEndDate) return false;
        return new Date(event.registrationEndDate) < new Date();
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'TBA';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const handleViewDetails = (event) => {
        setSelectedEvent(event);
        setShowEventDetails(true);
    };

    const handleCloseDetails = () => {
        setShowEventDetails(false);
        setSelectedEvent(null);
    };

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{getPageTitle()}</h1>
                    <p className="text-gray-500">{getPageDescription()}</p>
                </div>

                {/* Search */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full md:w-96">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search events..."
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="text-sm text-gray-500">
                            {filteredEvents.length} events found
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="mt-2 text-gray-500">Loading events...</p>
                    </div>
                ) : filteredEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents.map(event => {
                            const registrationEnded = isRegistrationEnded(event);
                            
                            return (
                                <div 
                                    key={event._id} 
                                    className={`bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-lg transition-shadow ${
                                        registrationEnded ? 'border-gray-300 opacity-80' : 'border-gray-100'
                                    }`}
                                >
                                    {/* Event Image */}
                                    <div className="h-48 bg-gray-200 relative">
                                        {event.posterImage ? (
                                            <img 
                                                src={getImageUrl(event.posterImage)} 
                                                alt={event.name}
                                                className="w-full h-full object-contain bg-gray-100 cursor-pointer hover:opacity-90 transition-opacity"
                                                onClick={() => {
                                                    setLightboxImage(getImageUrl(event.posterImage));
                                                    setLightboxAlt(event.name || 'Event Poster');
                                                }}
                                                onError={(e) => {
                                                    // Show default poster on error
                                                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iIzNCODJGNiIvPgogIDx0ZXh0IHg9IjIwMCIgeT0iMzAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMzIiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5FVkVOVCBQT1NURVI8L3RleHQ+Cjwvc3ZnPg==';
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-600">
                                                <div className="text-center">
                                                    <span className="text-white text-xl font-bold">{event.name?.charAt(0) || 'E'}</span>
                                                    <p className="text-white/80 text-xs mt-1">No Poster</p>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Badges */}
                                        <div className="absolute top-3 left-3 flex gap-2">
                                            <Badge className="bg-blue-500/80 text-white text-xs backdrop-blur-sm">
                                                {event.cellsAndAssociation}
                                            </Badge>
                                            {registrationEnded && (
                                                <Badge className="bg-orange-500 text-white text-xs">
                                                    Closed
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Event Details */}
                                    <div className="p-4">
                                        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">
                                            {event.name}
                                        </h3>
                                        
                                        <div className="space-y-2 text-sm text-gray-500">
                                            {/* Show Registration End Date prominently */}
                                            {event.registrationEndDate && (
                                                <div className={`flex items-center ${registrationEnded ? 'text-orange-600' : 'text-green-600'}`}>
                                                    <Clock className="w-4 h-4 mr-2" />
                                                    <span>
                                                        {registrationEnded 
                                                            ? `Registration ended ${formatDate(event.registrationEndDate)}`
                                                            : `Register by ${formatDate(event.registrationEndDate)}`
                                                        }
                                                    </span>
                                                </div>
                                            )}
                                            
                                            {/* Event Date */}
                                            <div className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                                                <span>Event: {formatDate(event.eventDate)}</span>
                                            </div>
                                            
                                            {/* Venue */}
                                            {event.venue && (
                                                <div className="flex items-center">
                                                    <MapPin className="w-4 h-4 mr-2 text-green-500" />
                                                    {event.venue}
                                                </div>
                                            )}
                                            
                                            {/* Description */}
                                            {event.description && (
                                                <p className="text-gray-600 line-clamp-2 mt-2">{event.description}</p>
                                            )}
                                        </div>
                                        
                                        {/* Action Button */}
                                        <div className="mt-4">
                                            {event.registrationLink ? (
                                                <a 
                                                    href={event.registrationLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`block w-full text-center py-2 px-4 rounded-lg font-medium transition-colors ${
                                                        registrationEnded 
                                                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                                    }`}
                                                    onClick={(e) => registrationEnded && e.preventDefault()}
                                                >
                                                    {registrationEnded ? 'Registration Closed' : 'Register Now'}
                                                </a>
                                            ) : (
                                                <Button 
                                                    className="w-full"
                                                    disabled={registrationEnded}
                                                    variant={registrationEnded ? 'outline' : 'primary'}
                                                    onClick={() => handleViewDetails(event)}
                                                >
                                                    {registrationEnded ? 'Registration Closed' : 'View Details'}
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                        <p className="text-gray-500">
                            {searchTerm 
                                ? 'Try adjusting your search term'
                                : 'Check back later for upcoming events'}
                        </p>
                        {searchTerm && (
                            <Button
                                variant="outline"
                                className="mt-4"
                                onClick={() => setSearchTerm('')}
                            >
                                Clear search
                            </Button>
                        )}
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

            {/* Event Details Modal */}
            <EventDetailsModal
                isOpen={showEventDetails}
                onClose={handleCloseDetails}
                event={selectedEvent}
            />
        </div>
    );
};

export default Events;
