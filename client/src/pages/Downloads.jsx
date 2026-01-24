import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import toast from 'react-hot-toast';
import {
  Download,
  FileText,
  Calendar,
  Users,
  TrendingUp,
  Search,
  Filter,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

const Downloads = () => {
  const { admin, api } = useAuth();
  const [summary, setSummary] = useState({
    totalEvents: 0,
    ongoingEvents: 0,
    upcomingEvents: 0,
    completedEvents: 0,
    totalRegistrations: 0,
    registrationsByDepartment: {}
  });
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [departmentFilter, setDepartmentFilter] = useState('all');

  useEffect(() => {
    fetchSummary();
    fetchEvents();
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await api.get('/downloads/summary');
      setSummary(response.data.data.summary);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      setEvents(response.data.data.events);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadEvents = (format = 'csv') => {
    const url = departmentFilter !== 'all' 
      ? `/downloads/events?format=${format}&department=${departmentFilter}`
      : `/downloads/events?format=${format}`;
    window.open(url, '_blank');
  };

  const handleDownloadRegistrations = (eventId) => {
    const url = `/downloads/registrations/${eventId}?format=csv`;
    window.open(url, '_blank');
  };

  const handleDownloadSummary = () => {
    // Create summary report
    const summaryData = {
      summary,
      generatedAt: new Date().toISOString(),
      events: events.map(event => ({
        name: event.name,
        department: event.department,
        status: event.status,
        registrations: event.currentRegistrations,
        maxParticipants: event.maxParticipants,
        date: event.eventDate
      }))
    };

    const blob = new Blob([JSON.stringify(summaryData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `summary-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success('Summary report downloaded successfully!');
  };

  if (isLoading) {
    return (
      <div className="flex bg-gray-950 min-h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-950 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-purple-200">Downloads</h1>
            <p className="text-gray-400 mt-2">Download reports and data exports</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900/40 backdrop-blur-xl border border-gray-800 rounded-xl shadow-lg p-6 hover:border-blue-500/30 transition-all">
            <div className="flex items-center">
              <div className="p-3 bg-blue-600/20 border border-blue-500/30 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Events</p>
                <p className="text-2xl font-bold text-white">{summary.totalEvents}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/40 backdrop-blur-xl border border-gray-800 rounded-xl shadow-lg p-6 hover:border-blue-500/30 transition-all">
            <div className="flex items-center">
              <div className="p-3 bg-green-600/20 border border-green-500/30 rounded-lg">
                <Activity className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Ongoing Events</p>
                <p className="text-2xl font-bold text-white">{summary.ongoingEvents}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/40 backdrop-blur-xl border border-gray-800 rounded-xl shadow-lg p-6 hover:border-blue-500/30 transition-all">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-600/20 border border-yellow-500/30 rounded-lg">
                <TrendingUp className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Upcoming Events</p>
                <p className="text-2xl font-bold text-white">{summary.upcomingEvents}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/40 backdrop-blur-xl border border-gray-800 rounded-xl shadow-lg p-6 hover:border-blue-500/30 transition-all">
            <div className="flex items-center">
              <div className="p-3 bg-purple-600/20 border border-purple-500/30 rounded-lg">
                <Users className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Registrations</p>
                <p className="text-2xl font-bold text-white">{summary.totalRegistrations}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Department Statistics */}
        {Object.keys(summary.registrationsByDepartment).length > 0 && (
          <div className="bg-gray-900/40 backdrop-blur-xl border border-gray-800 rounded-xl shadow-lg mb-8">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-white">Registrations by Department</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(summary.registrationsByDepartment).map(([department, count]) => (
                  <div key={department} className="flex items-center justify-between p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <PieChart className="h-5 w-5 text-gray-500 mr-3" />
                      <span className="text-sm font-medium text-white">{department}</span>
                    </div>
                    <span className="text-sm font-bold text-blue-400">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Download Options */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Events Download */}
          <div className="bg-gray-900/40 backdrop-blur-xl border border-gray-800 rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-white">Event Reports</h2>
              <p className="text-sm text-gray-400 mt-1">Download complete event data</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {admin?.cellsAndAssociation === 'OT' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Filter by Department
                    </label>
                    <select
                      value={departmentFilter}
                      onChange={(e) => setDepartmentFilter(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Departments</option>
                      <option value="IT">IT</option>
                      <option value="IIC">IIC</option>
                      <option value="EMDC">EMDC</option>
                    </select>
                  </div>
                )}

                <div className="flex items-center justify-between p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                  <div>
                    <h3 className="text-sm font-medium text-white">Events Data</h3>
                    <p className="text-xs text-gray-400">Complete event information</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDownloadEvents('csv')}
                      className="inline-flex items-center px-3 py-2 border border-gray-700 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      CSV
                    </button>
                    <button
                      onClick={() => handleDownloadEvents('json')}
                      className="inline-flex items-center px-3 py-2 border border-gray-700 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      JSON
                    </button>
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  <p>• CSV format for spreadsheet applications</p>
                  <p>• JSON format for data processing</p>
                  <p>• Includes all event details and statistics</p>
                </div>
              </div>
            </div>
          </div>

          {/* Registration Downloads */}
          <div className="bg-gray-900/40 backdrop-blur-xl border border-gray-800 rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-white">Registration Reports</h2>
              <p className="text-sm text-gray-400 mt-1">Download student registration data</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="max-h-64 overflow-y-auto">
                  {events.length > 0 ? (
                    <div className="space-y-2">
                      {events.map((event) => (
                        <div key={event._id} className="flex items-center justify-between p-3 bg-gray-800/50 border border-gray-700 rounded-lg hover:border-blue-500/30 transition-all">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-white">{event.name}</h4>
                            <p className="text-xs text-gray-400">
                              {event.department} • {event.currentRegistrations} registrations
                            </p>
                          </div>
                          <button
                            onClick={() => handleDownloadRegistrations(event._id)}
                            className="inline-flex items-center px-3 py-1 border border-gray-700 text-xs font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            CSV
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-sm text-gray-400">No events available</p>
                    </div>
                  )}
                </div>

                <div className="text-xs text-gray-500">
                  <p>• CSV format with complete registration details</p>
                  <p>• Includes student information and event data</p>
                  <p>• Ready for import into spreadsheet applications</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Report */}
        <div className="mt-8 bg-gray-900/40 backdrop-blur-xl border border-gray-800 rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-white">Summary Report</h2>
            <p className="text-sm text-gray-400 mt-1">Complete system overview and analytics</p>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-white">System Summary</h3>
                <p className="text-xs text-gray-400">
                  Generated on {new Date().toLocaleDateString()} • 
                  {summary.totalEvents} events • {summary.totalRegistrations} total registrations
                </p>
              </div>
              <button
                onClick={handleDownloadSummary}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Download Summary
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900">Event Statistics</h4>
                <ul className="mt-2 text-xs text-blue-700 space-y-1">
                  <li>• {summary.completedEvents} completed events</li>
                  <li>• {summary.ongoingEvents} ongoing events</li>
                  <li>• {summary.upcomingEvents} upcoming events</li>
                </ul>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="text-sm font-medium text-green-900">Registration Stats</h4>
                <ul className="mt-2 text-xs text-green-700 space-y-1">
                  <li>• {summary.totalRegistrations} total registrations</li>
                  <li>• {Object.keys(summary.registrationsByDepartment).length} departments</li>
                  <li>• Average per event: {summary.totalEvents > 0 ? Math.round(summary.totalRegistrations / summary.totalEvents) : 0}</li>
                </ul>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="text-sm font-medium text-purple-900">Report Details</h4>
                <ul className="mt-2 text-xs text-purple-700 space-y-1">
                  <li>• JSON format for easy processing</li>
                  <li>• Complete event and registration data</li>
                  <li>• Department-wise breakdown</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Downloads;
