import React, { useState } from 'react';
import { User, Linkedin, Github, Mail } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

// Mock Members Data
const MEMBERS_DATA = [
    {
        id: 1,
        name: "John Doe",
        role: "President",
        year: "IV Year",
        club: "IIC",
        image: "public/images/kongu logo2.png",
    },
    {
        id: 2,
        name: "Jane Smith",
        role: "Secretary",
        year: "III Year",
        club: "IIC",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
    },
    {
        id: 3,
        name: "Mike Johnson",
        role: "Design Lead",
        year: "III Year",
        club: "EMDC",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
    },
    {
        id: 4,
        name: "Sarah Williams",
        role: "Event Coordinator",
        year: "II Year",
        club: "Association",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    },
    {
        id: 5,
        name: "Emily Brown",
        role: "Vice President",
        year: "IV Year",
        club: "EMDC",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400",
    },
    {
        id: 6,
        name: "David Lee",
        role: "Technical Head",
        year: "III Year",
        club: "Association",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    },
];

const Members = () => {
    const [activeTab, setActiveTab] = useState('All');
    const [selectedYear, setSelectedYear] = useState('All');

    const tabs = ['All', 'IIC', 'EMDC', 'Association'];
    const years = ['All', 'IV Year', 'III Year', 'II Year'];

    const filteredMembers = MEMBERS_DATA.filter(member => {
        const matchesTab = activeTab === 'All' || member.club === activeTab;
        const matchesYear = selectedYear === 'All' || member.year === selectedYear;
        return matchesTab && matchesYear;
    });

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Meet Our Team</h1>
                    <p className="mt-4 text-xl text-gray-500">The brilliant minds behind our initiatives.</p>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8">
                    {/* Tabs */}
                    <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto noscrollbar">
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Year Filter */}
                    <div className="flex items-center space-x-4 mt-4 md:mt-0 w-full md:w-auto">
                        <span className="text-sm text-gray-500 whitespace-nowrap">Filter by Year:</span>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        >
                            {years.map(year => <option key={year} value={year}>{year}</option>)}
                        </select>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {filteredMembers.map(member => (
                        <Card key={member.id} className="text-center group">
                            <Card.Content className="pt-8">
                                <div className="relative inline-block mx-auto">
                                    <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-white shadow-lg mx-auto group-hover:scale-105 transition-transform duration-300">
                                        <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                    </div>
                                    <Badge
                                        variant={member.club === 'IIC' ? 'primary' : member.club === 'EMDC' ? 'purple' : 'indigo'}
                                        className="absolute -bottom-2 -right-2 shadow-sm"
                                        size="sm"
                                    >
                                        {member.club}
                                    </Badge>
                                </div>

                                <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                                <p className="text-blue-600 font-medium text-sm mb-1">{member.role}</p>
                                <p className="text-gray-400 text-xs mb-4">{member.year}</p>

                                <div className="flex justify-center space-x-3">
                                    <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors"><Linkedin size={18} /></a>
                                    <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors"><Github size={18} /></a>
                                    <a href="#" className="text-gray-400 hover:text-red-500 transition-colors"><Mail size={18} /></a>
                                </div>
                            </Card.Content>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Members;
