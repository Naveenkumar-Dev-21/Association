import React from 'react';
import { ArrowRight, Calendar, Users, Award, Lightbulb, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import EventCard from '../components/events/EventCard';

const Home = () => {
    // Mock Data for Events
    const upcomingEvents = [
        {
            id: 1,
            title: "Innovation Hackathon 2024",
            date: "March 15, 2024",
            time: "9:00 AM",
            venue: "Main Auditorium",
            category: "IIC",
            type: "Hackathon",
            image: "https://placehold.co/1000x600/1e293b/white?text=Innovation+Hackathon",
        },
        {
            id: 2,
            title: "Entrepreneurship Summit",
            date: "March 20, 2024",
            time: "10:00 AM",
            venue: "Seminar Hall 1",
            category: "EMDC",
            type: "Seminar",
            image: "https://placehold.co/1000x600/0f172a/white?text=Entrepreneurship+Summit",
        },
        {
            id: 3,
            title: "Tech Talk: AI in 2024",
            date: "March 25, 2024",
            time: "2:00 PM",
            venue: "Online",
            category: "Association",
            type: "Workshop",
            image: "https://placehold.co/1000x600/1e3a8a/white?text=AI+Tech+Talk",
        },
    ];

    return (
        <div className="bg-gray-50/50">
            {/* Official Hero Section */}
            <section className="relative h-[500px] flex items-center justify-center overflow-hidden bg-slate-900 border-b-4 border-yellow-500">
                {/* Background Image & Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="public/images/Kec.jpeg"
                        alt="Background"
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-slate-900/90 mix-blend-multiply"></div>
                </div>


                {/* Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
                    <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight drop-shadow-lg uppercase font-serif">
                        Department of Information Technology
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-200 font-light max-w-3xl mx-auto tracking-wide border-t border-b border-gray-600 py-4">
                        Excellence in Innovation, Entrepreneurship, and Technology
                    </p>
                    <div className="flex justify-center gap-4 mt-8">
                        <Link to="/events">
                            <Button className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold px-8 py-3 rounded shadow-lg shadow-yellow-500/20 border-none uppercase tracking-wide">
                                Explore Events
                            </Button>
                        </Link>
                        <Link to="/about">
                            <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded font-bold uppercase tracking-wide bg-transparent">
                                Discover More
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Department Pillars (Cards) - Institutional Style */}
            <section className="py-20 -mt-16 relative z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* IIC Card */}
                        <div className="bg-white rounded-lg shadow-xl border border-gray-100 p-8 transform hover:-translate-y-2 transition-all duration-300">
                            <div className="w-14 h-14 bg-blue-900 rounded-lg flex items-center justify-center mb-6 shadow-lg shadow-blue-900/20">
                                <Lightbulb className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">IIC</h3>
                            <div className="h-1 w-12 bg-yellow-500 mb-4"></div>
                            <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                                Institution's Innovation Council fosters the culture of innovation and startups among students, creating a vibrant ecosystem.
                            </p>
                            <Link to="/about#iic" className="inline-flex items-center text-blue-900 font-semibold text-sm hover:underline tracking-wide uppercase">
                                View Details <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </div>

                        {/* EMDC Card */}
                        <div className="bg-white rounded-lg shadow-xl border border-gray-100 p-8 transform hover:-translate-y-2 transition-all duration-300">
                            <div className="w-14 h-14 bg-slate-800 rounded-lg flex items-center justify-center mb-6 shadow-lg shadow-slate-800/20">
                                <TrendingUp className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">EMDC</h3>
                            <div className="h-1 w-12 bg-yellow-500 mb-4"></div>
                            <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                                Entrepreneurship & Management Development Centre nurtures entrepreneurial skills and management acumen for future leaders.
                            </p>
                            <Link to="/about#emdc" className="inline-flex items-center text-slate-800 font-semibold text-sm hover:underline tracking-wide uppercase">
                                View Details <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </div>

                        {/* Association Card */}
                        <div className="bg-white rounded-lg shadow-xl border border-gray-100 p-8 transform hover:-translate-y-2 transition-all duration-300">
                            <div className="w-14 h-14 bg-blue-700 rounded-lg flex items-center justify-center mb-6 shadow-lg shadow-blue-700/20">
                                <Users className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">IT Association</h3>
                            <div className="h-1 w-12 bg-yellow-500 mb-4"></div>
                            <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                                The official student body representing the IT department, organizing technical symposiums, workshops, and student activities.
                            </p>
                            <Link to="/about#association" className="inline-flex items-center text-blue-700 font-semibold text-sm hover:underline tracking-wide uppercase">
                                View Details <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Upcoming Events Section - Cleaner List View */}
            <section className="py-16 bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-12 border-b border-gray-200 pb-4">
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight uppercase">
                            Upcoming Activities
                        </h2>
                        <Link to="/events" className="flex items-center text-blue-900 font-semibold hover:text-blue-700 uppercase text-sm tracking-wide">
                            All Events <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {upcomingEvents.map(event => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Impact Counters Section - Official Dark */}
            <section className="py-20 bg-slate-900 text-white relative overflow-hidden border-t-4 border-yellow-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold uppercase tracking-wider mb-2">Department Impact</h2>
                        <div className="h-1 w-20 bg-blue-500 mx-auto"></div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-700">
                        <div className="p-4">
                            <div className="text-5xl font-bold text-white mb-2 font-mono">50+</div>
                            <div className="text-blue-300 text-sm font-medium uppercase tracking-widest">Events Conducted</div>
                        </div>
                        <div className="p-4">
                            <div className="text-5xl font-bold text-white mb-2 font-mono">1K+</div>
                            <div className="text-blue-300 text-sm font-medium uppercase tracking-widest">Participants</div>
                        </div>
                        <div className="p-4">
                            <div className="text-5xl font-bold text-white mb-2 font-mono">20+</div>
                            <div className="text-blue-300 text-sm font-medium uppercase tracking-widest">Startups</div>
                        </div>
                        <div className="p-4">
                            <div className="text-5xl font-bold text-white mb-2 font-mono">15+</div>
                            <div className="text-blue-300 text-sm font-medium uppercase tracking-widest">Partners</div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
