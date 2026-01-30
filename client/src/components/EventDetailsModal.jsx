import React from 'react';
import { X, Calendar, MapPin, Clock, Users, ExternalLink, Image } from 'lucide-react';
import Button from './ui/Button';
import Badge from './ui/Badge';
import { getImageUrl } from '../config/api';

const EventDetailsModal = ({ isOpen, onClose, event }) => {
  if (!isOpen || !event) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
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

  const isRegistrationEnded = () => {
    if (!event.registrationEndDate) return false;
    return new Date(event.registrationEndDate) < new Date();
  };

  const registrationEnded = isRegistrationEnded();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Badge className="bg-blue-500 text-white">
                  {event.cellsAndAssociation}
                </Badge>
                {event.eventType?.[0] && (
                  <Badge variant="outline">
                    {event.eventType[0]}
                  </Badge>
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{event.name}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Event Poster */}
          {event.posterImage && (
            <div className="relative">
              <img
                src={getImageUrl(event.posterImage)}
                alt={event.name}
                className="w-full h-auto max-h-96 object-contain rounded-lg border border-gray-200 bg-gray-50"
              />
            </div>
          )}

          {/* Event Information */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                  Event Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{formatDate(event.eventDate)}</span>
                  </div>
                  {event.eventDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium">{formatTime(event.eventDate)}</span>
                    </div>
                  )}
                  {event.venue && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" /> Venue:
                      </span>
                      <span className="font-medium">{event.venue}</span>
                    </div>
                  )}
                  {event.mode && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mode:</span>
                      <span className="font-medium">{event.mode}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Registration Info */}
              {event.registrationEndDate && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-green-500" />
                    Registration
                  </h3>
                  <div className={`p-3 rounded-lg ${
                    registrationEnded 
                      ? 'bg-orange-50 border border-orange-200' 
                      : 'bg-green-50 border border-green-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {registrationEnded ? 'Registration Ended' : 'Register by'}
                      </span>
                      <span className={`text-sm font-bold ${
                        registrationEnded ? 'text-orange-600' : 'text-green-600'
                      }`}>
                        {formatDate(event.registrationEndDate)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Organizer Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Organizer</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Organizing Body:</span>
                    <span className="font-medium">{event.organizingBody}</span>
                  </div>
                  {event.eventCoordinator?.name && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Contact:</span>
                      <span className="font-medium">{event.eventCoordinator.name}</span>
                    </div>
                  )}
                  {event.eventCoordinator?.contact && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{event.eventCoordinator.contact}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Participants */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Users className="w-4 h-4 mr-2 text-purple-500" />
                  Participants
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Max Participants:</span>
                    <span className="font-medium">{event.maxParticipants || 'Unlimited'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current:</span>
                    <span className="font-medium">{event.currentRegistrations || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">About Event</h3>
              <p className="text-gray-700 leading-relaxed">{event.description}</p>
            </div>
          )}

          {/* Rules */}
          {event.rules && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Rules & Guidelines</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-line">{event.rules}</p>
              </div>
            </div>
          )}

          {/* Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Quick Links</h3>
            <div className="space-y-2">
              {event.registrationLink && (
                <a
                  href={event.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                    registrationEnded
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                  onClick={(e) => registrationEnded && e.preventDefault()}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {registrationEnded ? 'Registration Closed' : 'Register Now'}
                </a>
              )}
              {event.eventLink && (
                <a
                  href={event.eventLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 ml-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Event Page
                </a>
              )}
              {event.whatsappGroupLink && (
                <a
                  href={event.whatsappGroupLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 ml-2 border border-green-300 text-green-700 rounded-lg font-medium hover:bg-green-50 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  WhatsApp Group
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;
