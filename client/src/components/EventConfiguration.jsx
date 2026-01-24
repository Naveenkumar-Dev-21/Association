import React, { useState } from 'react';

const EventConfiguration = ({ 
  eventName, 
  eventType, 
  departmentType,
  configData, 
  onConfigChange,
  onBack,
  onNext,
  stepNumber,
  totalSteps
}) => {
  const [localConfig, setLocalConfig] = useState(configData || {
    eventName: '',
    eventRules: '',
    dateOfEvent: '',
    eventTiming: '',
    teamConfiguration: {},
    participationOptions: {}
  });

  // Define configuration options based on event type
  const getEventConfigOptions = (eventName, eventType) => {
    const baseOptions = {
      eventName: { label: `${eventName} Name`, type: 'text', required: true },
      eventRules: { label: 'Event Rules', type: 'textarea', required: true },
      dateOfEvent: { label: 'Date of Event', type: 'date', required: true },
      eventTiming: { label: 'Event Timing', type: 'time', required: true }
    };

    // Technical events team configuration
    const technicalTeamConfig = {
      teamParticipation: { label: 'Team Participation', type: 'checkbox' },
      teamName: { label: 'Team Name', type: 'checkbox' },
      individualTeamMemberNames: { label: 'Individual Team Member Names', type: 'checkbox' },
      individualMemberContactNumber: { label: 'Individual Member Contact Number', type: 'checkbox' },
      individualMemberOfficialGmailID: { label: 'Individual Member Official Gmail ID', type: 'checkbox' },
      domainSelection: { label: 'Domain Selection', type: 'checkbox' },
      abstractUpload: { label: 'Abstract Upload (Word Document)', type: 'checkbox' },
      pptSubmission: { label: 'PPT Submission (PPT format)', type: 'checkbox' }
    };

    // Non-technical events configuration
    const connectionsConfig = {
      teamParticipation: { label: 'Team Participation', type: 'checkbox' },
      individualParticipation: { label: 'Individual Participation', type: 'checkbox' },
      teamName: { label: 'Team Name', type: 'checkbox' },
      individualTeamMemberNames: { label: 'Individual Team Member Names', type: 'checkbox' },
      individualMemberContactNumber: { label: 'Individual Member Contact Number', type: 'checkbox' },
      individualMemberOfficialGmailID: { label: 'Individual Member Official Gmail ID', type: 'checkbox' }
    };

    const flipFlopConfig = {
      individualName: { label: 'Individual Name', type: 'checkbox' },
      emailID: { label: 'Email ID', type: 'checkbox' },
      mobileNumber: { label: 'Mobile Number', type: 'checkbox' }
    };

    // Return configuration based on event name
    if (eventType === 'technical') {
      return {
        ...baseOptions,
        teamConfiguration: technicalTeamConfig
      };
    } else if (eventName === 'Connections') {
      return {
        ...baseOptions,
        participationOptions: connectionsConfig
      };
    } else if (eventName === 'Flip Flop') {
      return {
        ...baseOptions,
        participationOptions: flipFlopConfig
      };
    } else {
      // Default for other non-technical events
      return {
        ...baseOptions,
        participationOptions: connectionsConfig
      };
    }
  };

  const configOptions = getEventConfigOptions(eventName, eventType);

  const handleInputChange = (field, value) => {
    const newConfig = { ...localConfig, [field]: value };
    setLocalConfig(newConfig);
    onConfigChange(eventName, newConfig);
  };

  const handleCheckboxChange = (category, field, checked) => {
    const newConfig = {
      ...localConfig,
      [category]: {
        ...localConfig[category],
        [field]: checked
      }
    };
    setLocalConfig(newConfig);
    onConfigChange(eventName, newConfig);
  };

  const renderCheckboxGroup = (title, category, options) => (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-900">{title}</h4>
      <div className="space-y-2 pl-4">
        {Object.entries(options).map(([key, option]) => (
          <label key={key} className="flex items-center">
            <input
              type="checkbox"
              checked={localConfig[category]?.[key] || false}
              onChange={(e) => handleCheckboxChange(category, key, e.target.checked)}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          {eventName} – Event Registration Setup
        </h2>
        <span className="text-sm text-gray-500">
          Step {stepNumber} of {totalSteps}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Event Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {configOptions.eventName.label} *
          </label>
          <input
            type={configOptions.eventName.type}
            value={localConfig.eventName || ''}
            onChange={(e) => handleInputChange('eventName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`Enter ${eventName.toLowerCase()} name`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {configOptions.dateOfEvent.label} *
          </label>
          <input
            type={configOptions.dateOfEvent.type}
            value={localConfig.dateOfEvent || ''}
            onChange={(e) => handleInputChange('dateOfEvent', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {configOptions.eventTiming.label} *
          </label>
          <input
            type={configOptions.eventTiming.type}
            value={localConfig.eventTiming || ''}
            onChange={(e) => handleInputChange('eventTiming', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {configOptions.eventRules.label} *
          </label>
          <textarea
            value={localConfig.eventRules || ''}
            onChange={(e) => handleInputChange('eventRules', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`Enter rules for ${eventName.toLowerCase()}`}
          />
        </div>
      </div>

      {/* Configuration Options */}
      <div className="space-y-6">
        {configOptions.teamConfiguration && (
          renderCheckboxGroup('Team Configuration', 'teamConfiguration', configOptions.teamConfiguration)
        )}
        
        {configOptions.participationOptions && (
          renderCheckboxGroup('Participation Options', 'participationOptions', configOptions.participationOptions)
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default EventConfiguration;
