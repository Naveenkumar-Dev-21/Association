import React from 'react';

const SummaryPreview = ({ 
  formData, 
  eventConfigurations, 
  onBack, 
  onSubmit,
  isLoading 
}) => {
  const getSelectedEvents = () => {
    const events = [];
    
    // Add technical events
    formData.eventCategories.technical.forEach(event => {
      events.push({ name: event, type: 'technical' });
    });
    
    // Add non-technical events
    formData.eventCategories.nonTechnical.forEach(event => {
      events.push({ name: event, type: 'nonTechnical' });
    });
    
    return events;
  };

  const renderEventConfig = (eventName, config) => {
    if (!config) return null;

    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">{eventName}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Event Name:</span>
            <p className="text-gray-600">{config.eventName || 'Not set'}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Date:</span>
            <p className="text-gray-600">{config.dateOfEvent || 'Not set'}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Timing:</span>
            <p className="text-gray-600">{config.eventTiming || 'Not set'}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Rules:</span>
            <p className="text-gray-600 truncate">{config.eventRules || 'Not set'}</p>
          </div>
        </div>
        
        {/* Team Configuration */}
        {config.teamConfiguration && Object.keys(config.teamConfiguration).some(key => config.teamConfiguration[key]) && (
          <div className="mt-3">
            <span className="font-medium text-gray-700 text-sm">Team Configuration:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {Object.entries(config.teamConfiguration)
                .filter(([_, enabled]) => enabled)
                .map(([key, _]) => (
                  <span key={key} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                ))}
            </div>
          </div>
        )}
        
        {/* Participation Options */}
        {config.participationOptions && Object.keys(config.participationOptions).some(key => config.participationOptions[key]) && (
          <div className="mt-3">
            <span className="font-medium text-gray-700 text-sm">Participation Options:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {Object.entries(config.participationOptions)
                .filter(([_, enabled]) => enabled)
                .map(([key, _]) => (
                  <span key={key} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const selectedEvents = getSelectedEvents();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Configuration Summary</h2>
        <p className="text-gray-600">Review all event configurations before creating the event</p>
      </div>

      {/* Basic Event Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="font-medium text-gray-700">Event Name:</span>
            <p className="text-gray-900">{formData.name}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Organizing Body:</span>
            <p className="text-gray-900">{formData.organizingBody}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Department Type:</span>
            <p className="text-gray-900 capitalize">{formData.departmentType}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Event Date:</span>
            <p className="text-gray-900">{formData.eventDate}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Coordinator Name:</span>
            <p className="text-gray-900">{formData.eventCoordinator.name}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Coordinator Contact:</span>
            <p className="text-gray-900">{formData.eventCoordinator.contact}</p>
          </div>
        </div>
      </div>

      {/* Selected Events */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Selected Events ({selectedEvents.length})
        </h3>
        <div className="space-y-3">
          {selectedEvents.map((event, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <span className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                  {index + 1}
                </span>
                <div>
                  <p className="font-medium text-gray-900">{event.name}</p>
                  <p className="text-sm text-gray-600 capitalize">{event.type}</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                Configured
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Event Configurations */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Configurations</h3>
        <div className="space-y-4">
          {selectedEvents.map((event, index) => (
            <div key={index}>
              {renderEventConfig(event.name, eventConfigurations[event.name])}
            </div>
          ))}
        </div>
      </div>

      {/* Registration Type Info */}
      {formData.registrationType && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Registration Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="font-medium text-gray-700">Registration Type:</span>
              <p className="text-gray-900 capitalize">
                {formData.registrationType === 'google' ? 'Google Form' : 'Platform'}
              </p>
            </div>
            {formData.registrationType === 'google' && (
              <>
                <div>
                  <span className="font-medium text-gray-700">Google Form Link:</span>
                  <p className="text-gray-600 text-sm truncate">{formData.googleFormLink}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Response Link:</span>
                  <p className="text-gray-600 text-sm truncate">{formData.responseLink}</p>
                </div>
              </>
            )}
            {formData.registrationType === 'platform' && (
              <>
                <div>
                  <span className="font-medium text-gray-700">Mode:</span>
                  <p className="text-gray-900">{formData.mode}</p>
                </div>
                {formData.mode === 'Offline' && (
                  <div>
                    <span className="font-medium text-gray-700">Venue:</span>
                    <p className="text-gray-900">{formData.venue}</p>
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-700">Max Participants:</span>
                  <p className="text-gray-900">{formData.maxParticipants}</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          ← Back to Configuration
        </button>
        <button
          onClick={onSubmit}
          disabled={isLoading}
          className="px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Creating Event...
            </div>
          ) : (
            'Create Event'
          )}
        </button>
      </div>
    </div>
  );
};

export default SummaryPreview;
