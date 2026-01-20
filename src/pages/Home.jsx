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
            image: "https://images.unsplash.com/photo-1504384308090-c54be3855833?auto=format&fit=crop&q=80&w=1000",
        },
        {
            id: 2,
            title: "Entrepreneurship Summit",
            date: "March 20, 2024",
            time: "10:00 AM",
            venue: "Seminar Hall 1",
            category: "EMDC",
            type: "Seminar",
            image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=1000",
        },
        {
            id: 3,
            title: "Tech Talk: AI in 2024",
            date: "March 25, 2024",
            time: "2:00 PM",
            venue: "Online",
            category: "Association",
            type: "Workshop",
            image: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?auto=format&fit=crop&q=80&w=1000",
        },
    ];

    return (
        <div className="space-y-0 pb-16">
            {/* Hero Section */}
            <section className="relative bg-white overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-8 text-center lg:text-left">
                        <div className="lg:col-span-12 xl:col-span-7 lg:text-left">
                            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-6xl">
                                <span className="block">Innovate, Create,</span>
                                <span className="block text-blue-600 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                                    Lead the Future
                                </span>
                            </h1>
                            <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg md:mt-5 md:text-xl lg:mx-0 font-light">
                                The official platform for the IT Department's Innovation & Events. Join us in shaping the future of technology through IIC, EMDC, and the IT Association.
                            </p>
                            <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                    <Link to="/events">
                                        <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-blue-500/30">
                                            Explore Events
                                        </Button>
                                    </Link>
                                    <Link to="/about">
                                        <Button variant="secondary" size="lg" className="w-full sm:w-auto hover:bg-gray-50">
                                            Learn More
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Decorative Elements - subtle background patterns could go here */}
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50 -z-10 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-indigo-50 rounded-full blur-3xl opacity-50 -z-10 pointer-events-none"></div>
                </div>
            </section>

            {/* About Preview Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Our Pillars of Excellence
                        </h2>
                        <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                            Three bodies, one vision: empowering students to achieve greatness.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* IIC Card */}
                        <Card className="h-full border-t-4 border-t-blue-500 hover:border-t-blue-600">
                            <Card.Content className="text-center">
                                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3 transition-transform group-hover:rotate-6">
                                    <Lightbulb className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">IIC</h3>
                                <p className="text-gray-500 mb-6">
                                    Institution's Innovation Council fosters the culture of innovation and startups among students.
                                </p>
                                <Link to="/about#iic" className="text-blue-600 font-medium hover:text-blue-700 inline-flex items-center">
                                    Learn more <ArrowRight className="ml-1 w-4 h-4" />
                                </Link>
                            </Card.Content>
                        </Card>

                        {/* EMDC Card */}
                        <Card className="h-full border-t-4 border-t-purple-500 hover:border-t-purple-600">
                            <Card.Content className="text-center">
                                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 transform -rotate-3 transition-transform group-hover:-rotate-6">
                                    <TrendingUp className="w-8 h-8 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">EMDC</h3>
                                <p className="text-gray-500 mb-6">
                                    Entrepreneurship & Management Development Centre nurtures entrepreneurial skills and management acumen.
                                </p>
                                <Link to="/about#emdc" className="text-purple-600 font-medium hover:text-purple-700 inline-flex items-center">
                                    Learn more <ArrowRight className="ml-1 w-4 h-4" />
                                </Link>
                            </Card.Content>
                        </Card>

                        {/* Association Card */}
                        <Card className="h-full border-t-4 border-t-indigo-500 hover:border-t-indigo-600">
                            <Card.Content className="text-center">
                                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3 transition-transform group-hover:rotate-6">
                                    <Users className="w-8 h-8 text-indigo-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">IT Association</h3>
                                <p className="text-gray-500 mb-6">
                                    The student body representing the IT department, organizing technical and non-technical events.
                                </p>
                                <Link to="/about#association" className="text-indigo-600 font-medium hover:text-indigo-700 inline-flex items-center">
                                    Learn more <ArrowRight className="ml-1 w-4 h-4" />
                                </Link>
                            </Card.Content>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Upcoming Events Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                                Upcoming Events
                            </h2>
                            <p className="mt-2 text-xl text-gray-500">
                                Don't miss out on what's happening.
                            </p>
                        </div>
                        <Link to="/events" className="hidden sm:flex items-center text-blue-600 font-medium hover:text-blue-700">
                            View all events <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {upcomingEvents.map(event => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>

                    <div className="mt-10 text-center sm:hidden">
                        <Link to="/events" className="text-blue-600 font-medium hover:text-blue-700">
                            View all events &rarr;
                        </Link>
                    </div>
                </div>
            </section>

            {/* Impact Counters Section */}
            <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
                {/* Background Overlay */}
                <div className="absolute inset-0 bg-blue-900/20"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div className="p-4">
                            <div className="text-4xl md:text-5xl font-extrabold text-blue-400 mb-2">50+</div>
                            <div className="text-gray-400 font-medium">Events Conducted</div>
                        </div>
                        <div className="p-4">
                            <div className="text-4xl md:text-5xl font-extrabold text-purple-400 mb-2">1000+</div>
                            <div className="text-gray-400 font-medium">Participants</div>
                        </div>
                        <div className="p-4">
                            <div className="text-4xl md:text-5xl font-extrabold text-indigo-400 mb-2">20+</div>
                            <div className="text-gray-400 font-medium">Startups Incubated</div>
                        </div>
                        <div className="p-4">
                            <div className="text-4xl md:text-5xl font-extrabold text-teal-400 mb-2">15+</div>
                            <div className="text-gray-400 font-medium">Industry Partners</div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
