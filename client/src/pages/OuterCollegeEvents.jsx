import React, { useState, useEffect } from 'react';
import { Calendar, ExternalLink, Clock } from 'lucide-react';
import axios from 'axios';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ParticipationModal from '../components/ParticipationModal';
import ImageLightbox from '../components/ImageLightbox';
import toast from 'react-hot-toast';

const API_URL = '/api';

const OuterCollegeEvents = () => {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Participation modal state
    const [showParticipationModal, setShowParticipationModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Image lightbox state
    const [lightboxImage, setLightboxImage] = useState(null);
    const [lightboxAlt, setLightboxAlt] = useState('');

    // Fetch only outer college events from API
    useEffect(() => {
        fetchOuterCollegeEvents();
    }, []);

    const fetchOuterCollegeEvents = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_URL}/events/public`);
            if (response.data.success) {
                // Filter only outer college events
                const outerCollegeEvents = response.data.data.events.filter(
                    event => event.isOuterCollegeEvent
                );
                setEvents(outerCollegeEvents);
            }
        } catch (error) {
            console.error('Error fetching events:', error);
            toast.error('Failed to load events');
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

    const handleRegisterClick = (event) => {
        if (isRegistrationEnded(event)) {
            toast.error('Registration has ended for this event');
            return;
        }
        setSelectedEvent(event);
        setShowParticipationModal(true);
    };

    const handleParticipationSubmit = async (formData) => {
        if (!selectedEvent) return;
        
        setIsSubmitting(true);
        try {
            const response = await axios.post(
                `${API_URL}/outer-college-registrations/${selectedEvent._id}`,
                formData
            );
            
            if (response.data.message) {
                toast.success('Registration successful!');
                setShowParticipationModal(false);
                setSelectedEvent(null);
            }
        } catch (error) {
            console.error('Registration error:', error);
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'TBA';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Outer College Events</h1>
                    <p className="text-gray-500">
                        Explore events happening at other colleges. Click on poster for details and register to participate.
                    </p>
                </div>

                {/* Loading State */}
                {isLoading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="mt-2 text-gray-500">Loading events...</p>
                    </div>
                ) : events.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map(event => {
                            const registrationEnded = isRegistrationEnded(event);
                            
                            return (
                                <div 
                                    key={event._id} 
                                    className={`bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-lg transition-shadow ${
                                        registrationEnded ? 'border-gray-300 opacity-75' : 'border-gray-100'
                                    }`}
                                >
                                    {/* Event Poster - Click to view full */}
                                    <div className="relative">
                                        {event.posterImage ? (
                                            <img 
                                                src={`http://localhost:5000${event.posterImage}`} 
                                                alt="Event Poster"
                                                className="w-full h-auto max-h-96 object-contain bg-gray-100 cursor-pointer hover:opacity-90 transition-opacity"
                                                onClick={() => {
                                                    setLightboxImage(`http://localhost:5000${event.posterImage}`);
                                                    setLightboxAlt('Event Poster');
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-600">
                                                <span className="text-white text-4xl font-bold">Event</span>
                                            </div>
                                        )}
                                        
                                        {/* Status Badge */}
                                        <div className="absolute top-3 left-3 flex gap-2">
                                            <Badge className="bg-purple-500 text-white text-xs">
                                                Outer College
                                            </Badge>
                                            {registrationEnded && (
                                                <Badge className="bg-orange-500 text-white text-xs">
                                                    Registration Closed
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Event Info */}
                                    <div className="p-4">
                                        {/* Registration End Date - Always show */}
                                        <div className={`flex items-center text-sm mb-3 ${
                                            registrationEnded ? 'text-orange-600' : 'text-green-600 font-medium'
                                        }`}>
                                            <Clock className="w-4 h-4 mr-2" />
                                            <span>
                                                {event.registrationEndDate 
                                                    ? (registrationEnded 
                                                        ? `Registration ended on ${formatDate(event.registrationEndDate)}`
                                                        : `Register by ${formatDate(event.registrationEndDate)}`)
                                                    : 'Registration Open'
                                                }
                                            </span>
                                        </div>
                                        
                                        {/* Action Button */}
                                        <Button 
                                            onClick={() => handleRegisterClick(event)}
                                            className="w-full"
                                            disabled={registrationEnded}
                                            variant={registrationEnded ? 'outline' : 'primary'}
                                        >
                                            {registrationEnded ? 'Registration Closed' : 'Register to Participate'}
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Outer College Events</h3>
                        <p className="text-gray-500">Check back later for upcoming events at other colleges.</p>
                    </div>
                )}

            </div>

            {/* Participation Modal */}
            <ParticipationModal
                isOpen={showParticipationModal}
                onClose={() => {
                    setShowParticipationModal(false);
                    setSelectedEvent(null);
                }}
                onSubmit={handleParticipationSubmit}
                eventName="Outer College Event"
                isLoading={isSubmitting}
            />

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
        </div>
    );
};

export default OuterCollegeEvents;
