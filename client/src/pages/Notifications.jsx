import React from 'react';
import { Bell } from 'lucide-react';
import Card from '../components/ui/Card';

const Notifications = () => {
    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <div className="flex items-center mb-8">
                <Bell className="w-8 h-8 text-blue-600 mr-3" />
                <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            </div>

            <div className="space-y-4">
                <Card className="border-l-4 border-l-blue-500">
                    <Card.Content>
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-semibold text-gray-900">Hackathon Registration Open</h3>
                                <p className="text-gray-600 mt-1">Innovation Hackathon 2024 registration is now open. Register your team before March 10th.</p>
                                <p className="text-xs text-gray-400 mt-3">2 hours ago</p>
                            </div>
                            <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                        </div>
                    </Card.Content>
                </Card>

                <Card className="bg-gray-50">
                    <Card.Content>
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-semibold text-gray-900">EMDC Workshop Rescheduled</h3>
                                <p className="text-gray-600 mt-1">The startup workshop has been moved to next Tuesday.</p>
                                <p className="text-xs text-gray-400 mt-3">1 day ago</p>
                            </div>
                        </div>
                    </Card.Content>
                </Card>
            </div>
        </div>
    );
};

export default Notifications;
