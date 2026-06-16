import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Share2, ArrowLeft, Info, ExternalLink, User } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = '/api';

const EventDetail = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const response = await axios.get(`${API_URL}/events/public/${id}`);
                if (response.data.success) {
                    setEvent(response.data.data.event);
                }
            } catch (error) {
                console.error('Error fetching event details:', error);
                toast.error('Failed to load event details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchEventDetails();
    }, [id]);

    const formatDate = (dateString) => {
        if (!dateString) return 'TBA';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
                <div className="text-6xl mb-4">🔍</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
                <p className="text-gray-500 mb-8 text-center max-w-md">The event you're looking for might have been removed or is no longer available.</p>
                <Link to="/events">
                    <Button>Back to Events</Button>
                </Link>
            </div>
        );
    }

    const registrationEnded = event.registrationEndDate && new Date(event.registrationEndDate) < new Date();

    return (
        <div className="bg-white min-h-screen pb-16">
            {/* Banner */}
            <div className="h-64 md:h-96 w-full relative overflow-hidden">
                <div className="absolute inset-0 bg-black/50 z-10"></div>
                {event.posterImage ? (
                    <img
                        src={`http://localhost:5000${event.posterImage}`}
                        alt={event.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-900 flex items-center justify-center">
                        <span className="text-white text-9xl font-black opacity-20 uppercase tracking-tighter">
                            {event.cellsAndAssociation}
                        </span>
                    </div>
                )}
                <div className="absolute bottom-0 left-0 z-20 w-full p-6 md:p-12 text-white">
                    <div className="max-w-7xl mx-auto">
                        <Link to="/events" className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors font-medium">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Events
                        </Link>
                        <div className="flex flex-wrap gap-2 mb-4">
                            <Badge className="bg-blue-600 text-white border-none px-3 py-1 font-bold">
                                {event.cellsAndAssociation === 'IT' ? 'IT Association' : event.cellsAndAssociation}
                            </Badge>
                            {event.eventType && event.eventType.map((type, index) => (
                                <Badge key={index} className="bg-white/20 text-white backdrop-blur-md border border-white/30 px-3 py-1">
                                    {type}
                                </Badge>
                            ))}
                        </div>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-2 tracking-tight uppercase italic">{event.name}</h1>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                <div className="lg:grid lg:grid-cols-12 lg:gap-16">

                    {/* Main Content */}
                    <div className="lg:col-span-8">
                        <div className="space-y-12">
                            {/* Description */}
                            <section>
                                <h3 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tight flex items-center gap-3">
                                    <span className="w-8 h-1 bg-blue-600 inline-block"></span>
                                    Event Details
                                </h3>
                                <div className="prose prose-blue max-w-none text-slate-600 text-lg leading-relaxed whitespace-pre-wrap">
                                    {event.description}
                                </div>
                            </section>

                            {/* Rules */}
                            {event.rules && (
                                <section className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                                    <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tight flex items-center gap-3">
                                        <span className="w-8 h-1 bg-blue-600 inline-block"></span>
                                        Guidelines & Rules
                                    </h3>
                                    <div className="text-slate-600 whitespace-pre-wrap leading-relaxed">
                                        {event.rules}
                                    </div>
                                </section>
                            )}

                            {/* Coordinator */}
                            {event.eventCoordinator && (
                                <section>
                                    <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tight flex items-center gap-3">
                                        <span className="w-8 h-1 bg-blue-600 inline-block"></span>
                                        Contact Coordinator
                                    </h3>
                                    <div className="flex items-center bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                                        <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mr-6 group-hover:scale-110 transition-transform">
                                            <User size={32} />
                                        </div>
                                        <div>
                                            <p className="text-lg font-bold text-slate-900 mb-1 uppercase tracking-tight">{event.eventCoordinator.name}</p>
                                            <div className="flex flex-col gap-1">
                                                <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">Phone / Contact</p>
                                                <p className="text-blue-600 font-bold">{event.eventCoordinator.contact}</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 mt-12 lg:mt-0">
                        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-slate-100 p-8 sticky top-24">
                            <h3 className="text-xl font-black text-slate-900 mb-8 border-b border-slate-100 pb-4 uppercase tracking-tighter">Event Logistics</h3>

                            <div className="space-y-8">
                                <div className="flex items-start">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mr-4 flex-shrink-0">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Date</p>
                                        <p className="text-lg font-bold text-slate-800 tracking-tight">{formatDate(event.eventDate)}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mr-4 flex-shrink-0">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Time</p>
                                        <p className="text-lg font-bold text-slate-800 tracking-tight">{formatTime(event.eventDate) || 'TBA'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mr-4 flex-shrink-0">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Location / Venue</p>
                                        <p className="text-lg font-bold text-slate-800 tracking-tight">{event.venue || 'TBA'}</p>
                                        <p className="text-xs text-slate-500 font-medium">{event.mode} Session</p>
                                    </div>
                                </div>

                                {event.registrationEndDate && (
                                    <div className="flex items-start">
                                        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600 mr-4 flex-shrink-0">
                                            <Info size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">Deadline</p>
                                            <p className={`text-lg font-bold tracking-tight ${registrationEnded ? 'text-gray-400' : 'text-red-500'}`}>
                                                {formatDate(event.registrationEndDate)}
                                            </p>
                                            {registrationEnded && <p className="text-[10px] font-bold text-red-600 uppercase">Registration Closed</p>}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-10 space-y-4">
                                {event.registrationLink && event.registrationLink !== '#' ? (
                                    <a
                                        href={event.registrationLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block"
                                    >
                                        <Button
                                            className={`w-full py-6 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl transition-all ${registrationEnded ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20'}`}
                                            disabled={registrationEnded}
                                        >
                                            {registrationEnded ? 'Closed' : 'Register Now'}
                                        </Button>
                                    </a>
                                ) : (
                                    <Link to={`/events/${event._id}/register`} className="block">
                                        <Button
                                            className={`w-full py-6 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl transition-all ${registrationEnded ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20'}`}
                                            disabled={registrationEnded}
                                        >
                                            {registrationEnded ? 'Closed' : 'Register Now'}
                                        </Button>
                                    </Link>
                                )}

                                <Button variant="outline" className="w-full py-6 rounded-2xl font-black uppercase tracking-widest text-[10px] border-slate-200 text-slate-400 hover:bg-slate-50">
                                    <Share2 className="w-4 h-4 mr-2" /> Share Event
                                </Button>

                                {event.brochure && (
                                    <a href={`http://localhost:5000${event.brochure}`} target="_blank" rel="noopener noreferrer" className="block">
                                        <Button variant="outline" className="w-full py-4 rounded-xl text-blue-600 border-blue-100 bg-blue-50/30 hover:bg-blue-50 font-bold text-xs">
                                            <ExternalLink className="w-4 h-4 mr-2" /> Download Brochure
                                        </Button>
                                    </a>
                                )}
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default EventDetail;
