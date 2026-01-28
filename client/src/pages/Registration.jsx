import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, User, Users, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Registration = () => {
    const { id } = useParams(); // Event ID
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isTeam, setIsTeam] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock submission
        alert("Registration Submitted Successfully!");
        navigate('/events');
    };

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <Card>
                    <Card.Header>
                        <h1 className="text-2xl font-bold text-center text-gray-900">Event Registration</h1>
                        <p className="text-center text-gray-500 mt-1">Innovation Hackathon 2024</p>
                    </Card.Header>

                    <Card.Content>
                        {/* Progress Stepper */}
                        <div className="flex items-center justify-center mb-8">
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>1</div>
                            <div className={`h-1 w-16 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>2</div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">

                            {step === 1 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900">Participant Details</h3>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                        <input type="text" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border" placeholder="John Doe" required />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                                        <input type="email" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border" placeholder="john@example.com" required />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Year / Department</label>
                                        <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border">
                                            <option>I Year IT</option>
                                            <option>II Year IT</option>
                                            <option>III Year IT</option>
                                            <option>IV Year IT</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Participation Type</label>
                                        <div className="flex space-x-4">
                                            <button
                                                type="button"
                                                className={`flex-1 py-3 px-4 border rounded-md flex items-center justify-center ${!isTeam ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300'}`}
                                                onClick={() => setIsTeam(false)}
                                            >
                                                <User className="w-5 h-5 mr-2" /> Individual
                                            </button>
                                            <button
                                                type="button"
                                                className={`flex-1 py-3 px-4 border rounded-md flex items-center justify-center ${isTeam ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300'}`}
                                                onClick={() => setIsTeam(true)}
                                            >
                                                <Users className="w-5 h-5 mr-2" /> Team
                                            </button>
                                        </div>
                                    </div>

                                    <Button type="button" className="w-full mt-4" onClick={() => setStep(2)}>Next Step</Button>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        {isTeam ? "Team Details & Submission" : "Additional Info & Submission"}
                                    </h3>

                                    {isTeam && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Team Name</label>
                                            <input type="text" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border" required />

                                            <label className="block text-sm font-medium text-gray-700 mt-4">Team Members (Names & Roll Nos)</label>
                                            <textarea className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border" rows="3" placeholder="1. Name (RollNo)&#10;2. Name (RollNo)"></textarea>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Upload ID Card / Abstract</label>
                                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
                                            <div className="space-y-1 text-center">
                                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                                <div className="flex text-sm text-gray-600">
                                                    <span className="font-medium text-blue-600 hover:text-blue-500">Upload a file</span>
                                                    <p className="pl-1">or drag and drop</p>
                                                </div>
                                                <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 mt-6">
                                        <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                                        <Button type="submit" className="flex-1">Submit Registration</Button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </Card.Content>
                </Card>
            </div>
        </div>
    );
};

export default Registration;
