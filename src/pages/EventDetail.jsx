import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Share2, ArrowLeft, Info, ExternalLink } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const EventDetail = () => {
    // In a real app, use useParams() to fetch data
    const { id } = useParams();

    // Mock Single Event Data (Replica of one event for display purposes)
    const event = {
        id: id,
        title: "Innovation Hackathon 2024",
        description: `
          <p class="mb-4">Join us for the annual Innovation Hackathon, where bright minds come together to solve real-world problems. This 24-hour event is designed to challenge your creativity, coding skills, and teamwork.</p>
          <h4 class="text-lg font-bold mb-2">Themes</h4>
          <ul class="list-disc pl-5 mb-4">
            <li>Smart City Solutions</li>
            <li>Healthcare Innovation</li>
            <li>Sustainable Energy</li>
            <li>FinTech</li>
          </ul>
          <h4 class="text-lg font-bold mb-2">Rules</h4>
          <ul class="list-disc pl-5 mb-4">
            <li>Teams of 3-5 members.</li>
            <li>All code must be written during the event.</li>
            <li>Use of open source libraries is allowed.</li>
          </ul>
        `,
        date: "March 15, 2024",
        time: "9:00 AM - 9:00 AM (Next Day)",
        venue: "Main Auditorium, IT Block",
        category: "IIC",
        type: "Hackathon",
        image: "https://images.unsplash.com/photo-1504384308090-c54be3855833?auto=format&fit=crop&q=80&w=1200",
        registrationDeadline: "March 10, 2024",
        coordinator: {
            name: "Dr. Emily Roberts",
            role: "Faculty Coordinator",
            email: "emily.r@college.edu"
        }
    };

    return (
        <div className="bg-white min-h-screen pb-16">
            {/* Banner */}
            <div className="h-64 md:h-96 w-full relative overflow-hidden">
                <div className="absolute inset-0 bg-black/40 z-10"></div>
                <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 z-20 w-full p-6 md:p-12 text-white">
                    <div className="max-w-7xl mx-auto">
                        <Link to="/events" className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Events
                        </Link>
                        <div className="flex gap-2 mb-3">
                            <Badge className="bg-blue-500/20 text-blue-100 backdrop-blur-md border border-blue-500/30">{event.category}</Badge>
                            <Badge className="bg-white/20 text-white backdrop-blur-md border border-white/30">{event.type}</Badge>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold mb-2">{event.title}</h1>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <div className="lg:grid lg:grid-cols-12 lg:gap-12">

                    {/* Main Content */}
                    <div className="lg:col-span-8">
                        <div className="prose prose-blue max-w-none text-gray-600">
                            <div dangerouslySetInnerHTML={{ __html: event.description }} />
                        </div>

                        <div className="mt-10 pt-8 border-t border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Coordinator</h3>
                            <div className="flex items-center bg-gray-50 p-4 rounded-lg">
                                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl mr-4">
                                    {event.coordinator.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{event.coordinator.name}</p>
                                    <p className="text-sm text-gray-500">{event.coordinator.role}</p>
                                    <a href={`mailto:${event.coordinator.email}`} className="text-sm text-blue-600 hover:text-blue-800">{event.coordinator.email}</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 mt-8 lg:mt-0">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sticky top-24">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">Event Details</h3>

                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <Calendar className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Date</p>
                                        <p className="text-sm text-gray-500">{event.date}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <Clock className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Time</p>
                                        <p className="text-sm text-gray-500">{event.time}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <MapPin className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Venue</p>
                                        <p className="text-sm text-gray-500">{event.venue}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <Info className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Deadline</p>
                                        <p className="text-sm text-red-500 font-medium">Reg. ends on {event.registrationDeadline}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 space-y-3">
                                <Link to={`/events/${id}/register`}>
                                    <Button className="w-full" size="lg">
                                        Register Now
                                    </Button>
                                </Link>
                                <Button variant="outline" className="w-full flex items-center justify-center">
                                    <Share2 className="w-4 h-4 mr-2" /> Share Event
                                </Button>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default EventDetail;
