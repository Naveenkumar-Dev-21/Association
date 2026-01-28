import React, { useState } from 'react';

const EventCategory = ({ 
  categoryType, 
  departmentType, 
  selectedEvents, 
  onEventToggle, 
  customEvents, 
  onAddCustomEvent, 
  onRemoveCustomEvent 
}) => {
  const [customEventName, setCustomEventName] = useState('');
  const [showAddInput, setShowAddInput] = useState(false);

  const defaultEvents = {
    technical: [
      'Paper Presentation',
      'Project Presentation', 
      'Workshop',
      'Hackathon',
      'Coding Contest',
      'Poster Designing'
    ],
    nonTechnical: [
      'Connections',
      'Flip Flop',
      'IPL Auction'
    ]
  };

  const events = [
    ...defaultEvents[categoryType],
    ...(customEvents[categoryType] || [])
  ];

  const handleAddCustomEvent = () => {
    if (customEventName.trim()) {
      onAddCustomEvent(categoryType, customEventName.trim());
      setCustomEventName('');
      setShowAddInput(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddCustomEvent();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-900 capitalize">
          {categoryType === 'technical' ? 'Technical' : 'Non-Technical'} Events 
          ({departmentType === 'inter' ? 'Inter' : 'Intra'} Department)
        </h4>
        <button
          onClick={() => setShowAddInput(!showAddInput)}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          + Add Custom Event ({categoryType === 'technical' ? 'Technical' : 'Non-Technical'})
        </button>
      </div>

      {showAddInput && (
        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
          <input
            type="text"
            value={customEventName}
            onChange={(e) => setCustomEventName(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Enter custom ${categoryType} event name`}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddCustomEvent}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add
          </button>
          <button
            onClick={() => {
              setShowAddInput(false);
              setCustomEventName('');
            }}
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="space-y-2">
        {events.map((event) => (
          <label key={event} className="flex items-center">
            <input
              type="checkbox"
              checked={selectedEvents.includes(event)}
              onChange={() => onEventToggle(event)}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">{event}</span>
            {customEvents[categoryType]?.includes(event) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveCustomEvent(categoryType, event);
                }}
                className="ml-2 text-red-500 hover:text-red-700 text-xs"
              >
                Remove
              </button>
            )}
          </label>
        ))}
      </div>
    </div>
  );
};

export default EventCategory;
