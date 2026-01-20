import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import EventCard from '../components/events/EventCard';
import Button from '../components/ui/Button';

// Mock Data
const EVENTS_DATA = [
    {
        id: 1,
        title: "Innovation Hackathon 2024",
        date: "March 15, 2024",
        time: "9:00 AM",
        venue: "Main Auditorium",
        category: "IIC",
        type: "Hackathon",
        status: "Upcoming",
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
        status: "Upcoming",
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
        status: "Upcoming",
        image: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?auto=format&fit=crop&q=80&w=1000",
    },
    {
        id: 4,
        title: "Mobile App Development Bootcamp",
        date: "April 05, 2024",
        time: "10:00 AM",
        venue: "Computer Lab 3",
        category: "Association",
        type: "Workshop",
        status: "Open",
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1000",
    },
    {
        id: 5,
        title: "Idea Pitching Contest",
        date: "April 12, 2024",
        time: "11:00 AM",
        venue: "Conference Room",
        category: "IIC",
        type: "Competition",
        status: "Open",
        image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1000",
    },
    {
        id: 6,
        title: "Startup Legal Frameworks",
        date: "April 18, 2024",
        time: "3:00 PM",
        venue: "Seminar Hall 2",
        category: "EMDC",
        type: "Seminar",
        status: "Upcoming",
        image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000",
    },
];

const Events = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedType, setSelectedType] = useState('All');

    const categories = ['All', 'IIC', 'EMDC', 'Association'];
    const types = ['All', 'Hackathon', 'Seminar', 'Workshop', 'Competition'];

    const filteredEvents = EVENTS_DATA.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
        const matchesType = selectedType === 'All' || event.type === selectedType;
        return matchesSearch && matchesCategory && matchesType;
    });

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Explore Events</h1>
                    <p className="text-gray-500">Discover workshops, seminars, and competitions.</p>
                </div>

                {/* Filters & Search */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">

                        {/* Search */}
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

                        {/* Filters */}
                        <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
                            <div className="flex items-center space-x-2">
                                <Filter className="h-5 w-5 text-gray-400" />
                                <span className="text-sm text-gray-500">Filters:</span>
                            </div>

                            <select
                                className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>

                            <select
                                className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                            >
                                {types.map(type => <option key={type} value={type}>{type}</option>)}
                            </select>
                        </div>

                    </div>
                </div>

                {/* Events Grid */}
                {filteredEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents.map(event => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
                        <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
                        <div className="mt-6">
                            <Button
                                variant="outline"
                                onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setSelectedType('All'); }}
                            >
                                Clear all filters
                            </Button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Events;
