import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import RegistrationModal from '../components/RegistrationModal';
import GoogleFormsModal from '../components/GoogleFormsModal';
import EventCategory from '../components/EventCategory';
import EventConfiguration from '../components/EventConfiguration';
import SummaryPreview from '../components/SummaryPreview';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Upload,
  FileText
} from 'lucide-react';

const CreateEvent = () => {
  const navigate = useNavigate();
  const { api } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(true);
  const [showGoogleFormsModal, setShowGoogleFormsModal] = useState(false);
  const [registrationType, setRegistrationType] = useState('');
  const [formData, setFormData] = useState({
    // Registration Type
    registrationType: '',
    
    // Google Forms Links (for Google Form registration)
    googleFormLink: '',
    responseLink: '',
    
    // Department Type
    departmentType: '',
    
    // Event Categories
    eventCategories: {
      technical: [],
      nonTechnical: []
    },
    
    // Custom Events
    customEvents: {
      technical: [],
      nonTechnical: []
    },
    
    // Event Configurations (for dynamic event pages)
    eventConfigurations: {},
    
    // Section A - Event Foundation
    name: '',
    organizingBody: '',
    mode: 'Online',
    eventDate: '',
    venue: '',
    eventCoordinator: {
      name: '',
      contact: ''
    },
    cellsAndAssociation: 'IT',
    
    // Section B - Event Info & Usability (Platform only)
    posterImage: null,
    description: '',
    rules: '',
    eventLink: '',
    whatsappGroupLink: '',
    registrationLink: '',
    maxParticipants: '',
    isPublished: false
  });

  // Load form data from localStorage on component mount
  useEffect(() => {
    const savedFormData = localStorage.getItem('createEventFormData');
    const savedRegistrationType = localStorage.getItem('createEventRegistrationType');
    
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        setFormData(prev => ({ ...prev, ...parsedData }));
      } catch (error) {
        console.error('Error parsing saved form data:', error);
      }
    }
    
    if (savedRegistrationType) {
      setRegistrationType(savedRegistrationType);
      setShowRegistrationModal(false);
    }
  }, []);
  
  // Save form data to localStorage whenever it changes
  useEffect(() => {
    if (registrationType || formData.name || formData.organizingBody) {
      localStorage.setItem('createEventFormData', JSON.stringify(formData));
      localStorage.setItem('createEventRegistrationType', registrationType);
    }
  }, [formData, registrationType]);

  const departmentTypes = ['inter', 'intra'];
  const categoryTypes = ['technical', 'nonTechnical'];

  const handleRegistrationTypeSelect = (type) => {
    setRegistrationType(type);
    setFormData(prev => ({ ...prev, registrationType: type }));
    
    if (type === 'google') {
      // Show Google Forms modal for Google Form registration
      setShowRegistrationModal(false);
      setShowGoogleFormsModal(true);
    } else {
      // Direct to form for Platform registration
      setShowRegistrationModal(false);
    }
  };

  const handleGoogleFormsSave = (googleFormsData) => {
    setFormData(prev => ({
      ...prev,
      googleFormLink: googleFormsData.googleFormLink,
      responseLink: googleFormsData.responseLink
    }));
    setShowGoogleFormsModal(false);
  };

  const handleGoogleFormsCancel = () => {
    setShowGoogleFormsModal(false);
    // Reset registration type and show main modal again
    setRegistrationType('');
    setFormData(prev => ({ ...prev, registrationType: '' }));
    setShowRegistrationModal(true);
  };

  const clearFormData = () => {
    localStorage.removeItem('createEventFormData');
    localStorage.removeItem('createEventRegistrationType');
    setFormData({
      // Registration Type
      registrationType: '',
      
      // Google Forms Links (for Google Form registration)
      googleFormLink: '',
      responseLink: '',
      
      // Department Type
      departmentType: '',
      
      // Event Categories
      eventCategories: {
        technical: [],
        nonTechnical: []
      },
      
      // Custom Events
      customEvents: {
        technical: [],
        nonTechnical: []
      },
      
      // Section A - Event Foundation
      name: '',
      organizingBody: '',
      mode: 'Online',
      eventDate: '',
      venue: '',
      eventCoordinator: {
        name: '',
        contact: ''
      },
      cellsAndAssociation: 'IT',
      
      // Event Configurations
      eventConfigurations: {},
      
      // Section B - Event Info & Usability (Platform only)
      posterImage: null,
      description: '',
      rules: '',
      eventLink: '',
      whatsappGroupLink: '',
      registrationLink: '',
      maxParticipants: '',
      isPublished: false
    });
    setRegistrationType('');
    setCurrentStep(1);
  };

  const handleDepartmentTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      departmentType: type,
      eventCategories: {
        technical: [],
        nonTechnical: []
      }
    }));
  };

  const handleEventToggle = (event, categoryType) => {
    setFormData(prev => {
      const newEventCategories = { ...prev.eventCategories };
      
      if (newEventCategories[categoryType].includes(event)) {
        // Remove event from category
        newEventCategories[categoryType] = newEventCategories[categoryType].filter(e => e !== event);
      } else {
        // Add event to category
        newEventCategories[categoryType] = [...newEventCategories[categoryType], event];
      }
      
      return { ...prev, eventCategories: newEventCategories };
    });
  };

  const handleAddCustomEvent = (categoryType, eventName) => {
    setFormData(prev => {
      const customEvents = { ...prev.customEvents };
      
      // Check for duplicates
      const allCustomEvents = [...customEvents.technical, ...customEvents.nonTechnical];
      if (allCustomEvents.includes(eventName)) {
        toast.error('Event already exists');
        return prev;
      }
      
      customEvents[categoryType] = [...customEvents[categoryType], eventName];
      return { ...prev, customEvents };
    });
  };

  const handleRemoveCustomEvent = (categoryType, eventName) => {
    setFormData(prev => {
      const customEvents = { ...prev.customEvents };
      const eventCategories = { ...prev.eventCategories };
      
      customEvents[categoryType] = customEvents[categoryType].filter(e => e !== eventName);
      eventCategories[categoryType] = eventCategories[categoryType].filter(e => e !== eventName);
      
      return { ...prev, customEvents, eventCategories };
    });
  };

  const handleEventConfigChange = (eventName, config) => {
    setFormData(prev => ({
      ...prev,
      eventConfigurations: {
        ...prev.eventConfigurations,
        [eventName]: config
      }
    }));
  };

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

  const getTotalSteps = () => {
    const selectedEvents = getSelectedEvents();
    return 2 + selectedEvents.length + 1; // Step 1 + Event pages + Summary
  };

  const getCurrentEventName = () => {
    const selectedEvents = getSelectedEvents();
    if (currentStep > 2 && currentStep <= 2 + selectedEvents.length) {
      return selectedEvents[currentStep - 3]?.name;
    }
    return null;
  };

  const getCurrentEventType = () => {
    const selectedEvents = getSelectedEvents();
    if (currentStep > 2 && currentStep <= 2 + selectedEvents.length) {
      return selectedEvents[currentStep - 3]?.type;
    }
    return null;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Mobile number validation for coordinator contact
    if (name === 'eventCoordinator.contact') {
      // Only allow numbers, +, -, and spaces
      const mobilePattern = /^[0-9+\-\s]*$/;
      if (!mobilePattern.test(value)) {
        return; // Don't update if invalid characters
      }
      
      // Remove all non-digit characters for validation
      const digitsOnly = value.replace(/\D/g, '');
      
      // Check if it's a valid mobile number (exactly 10 digits)
      if (digitsOnly.length > 0 && digitsOnly.length !== 10) {
        // Still allow typing but don't allow more than 10 digits
        if (digitsOnly.length > 10) {
          return; // Don't allow more than 10 digits
        }
      }
    }
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else if (name === 'departmentType') {
      handleDepartmentTypeChange(value);
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    }
  };

  const validateMobileNumber = (mobile) => {
    const digitsOnly = mobile.replace(/\D/g, '');
    return digitsOnly.length === 10;
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        // Common validations for both registration types
        if (!formData.name || !formData.organizingBody || !formData.eventDate || 
            !formData.eventCoordinator.name || !formData.eventCoordinator.contact) {
          toast.error('Please fill in all required fields');
          return false;
        }
        
        // Validate mobile number
        if (!validateMobileNumber(formData.eventCoordinator.contact)) {
          toast.error('Please enter a valid 10-digit mobile number');
          return false;
        }
        
        // Validate mandatory event details fields
        if (!formData.posterImage) {
          toast.error('Please upload an event poster');
          return false;
        }
        
        if (!formData.description || formData.description.trim() === '') {
          toast.error('Please enter event description');
          return false;
        }
        
        if (!formData.rules || formData.rules.trim() === '') {
          toast.error('Please enter event rules');
          return false;
        }
        
        if (!formData.whatsappGroupLink || formData.whatsappGroupLink.trim() === '') {
          toast.error('Please enter WhatsApp group link');
          return false;
        }
        
        if (!formData.registrationLink || formData.registrationLink.trim() === '') {
          toast.error('Please enter registration link');
          return false;
        }
        
        // Google Form registration specific validations
        if (registrationType === 'google') {
          if (!formData.googleFormLink || !formData.responseLink) {
            toast.error('Please configure Google Forms links');
            return false;
          }
        }
        
        // Department type validation
        if (!formData.departmentType) {
          toast.error('Please select department type');
          return false;
        }
        
        // Event selection validation
        const totalEvents = formData.eventCategories.technical.length + formData.eventCategories.nonTechnical.length;
        if (totalEvents === 0) {
          toast.error('Please select at least one event');
          return false;
        }
        
        // Platform-specific validations
        if (registrationType === 'platform') {
          if (formData.mode === 'Offline' && !formData.venue) {
            toast.error('Venue is required for offline events');
            return false;
          }
          if (!formData.maxParticipants) {
            toast.error('Maximum participants is required');
            return false;
          }
        }
        
        return true;
      case 2:
        // Only for platform registration
        if (registrationType === 'platform') {
          if (!formData.description || !formData.rules || !formData.registrationLink) {
            toast.error('Please fill in all required fields');
            return false;
          }
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      const selectedEvents = getSelectedEvents();
      const totalSteps = getTotalSteps();
      
      if (currentStep === 1 && selectedEvents.length > 0) {
        // Move to first event configuration page
        setCurrentStep(3);
      } else if (currentStep < totalSteps - 1) {
        setCurrentStep(currentStep + 1);
      } else if (currentStep === totalSteps - 1) {
        // Move to summary
        setCurrentStep(totalSteps);
      }
    }
  };

  const handlePrevious = () => {
    const selectedEvents = getSelectedEvents();
    
    if (currentStep === 3) {
      // Go back to step 1 from first event page
      setCurrentStep(1);
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async () => {
    if (!validateStep(currentStep)) return;
    
    setIsLoading(true);
    
    try {
      const formDataToSend = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'eventCoordinator') {
          formDataToSend.append('eventCoordinator[name]', formData.eventCoordinator.name);
          formDataToSend.append('eventCoordinator[contact]', formData.eventCoordinator.contact);
        } else if (key === 'eventCategories' || key === 'customEvents') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (formData[key] instanceof File) {
          formDataToSend.append(key, formData[key]);
        } else if (typeof formData[key] === 'boolean') {
          formDataToSend.append(key, formData[key].toString());
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      await api.post('/events', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Clear saved form data after successful submission
      localStorage.removeItem('createEventFormData');
      localStorage.removeItem('createEventRegistrationType');
      
      toast.success('Event created successfully!');
      navigate('/events');
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error(error.response?.data?.message || 'Failed to create event');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAndPublish = async () => {
    setFormData(prev => ({ ...prev, isPublished: true }));
    await handleSave();
  };

  const renderStepIndicator = () => {
    const selectedEvents = getSelectedEvents();
    const totalSteps = getTotalSteps();
    
    // Don't show step indicator for Google Form registration (only 1 step)
    if (registrationType === 'google') {
      return null;
    }
    
    return (
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-2">
          {/* Step 1 */}
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            1
          </div>
          
          {/* Event steps */}
          {selectedEvents.map((event, index) => (
            <React.Fragment key={index}>
              <div className={`w-16 h-1 ${
                currentStep > 2 + index ? 'bg-blue-600' : 'bg-gray-200'
              }`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                currentStep > 2 + index ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {event.name.substring(0, 3).toUpperCase()}
              </div>
            </React.Fragment>
          ))}
          
          {/* Summary step */}
          <div className={`w-16 h-1 ${
            currentStep === totalSteps ? 'bg-blue-600' : 'bg-gray-200'
          }`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            currentStep === totalSteps ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            ✓
          </div>
        </div>
      </div>
    );
  };

  const renderCurrentStep = () => {
    const selectedEvents = getSelectedEvents();
    const totalSteps = getTotalSteps();
    const currentEventName = getCurrentEventName();
    const currentEventType = getCurrentEventType();
    
    // Event configuration pages
    if (currentStep > 2 && currentStep <= 2 + selectedEvents.length) {
      return (
        <EventConfiguration
          eventName={currentEventName}
          eventType={currentEventType}
          departmentType={formData.departmentType}
          configData={formData.eventConfigurations[currentEventName]}
          onConfigChange={handleEventConfigChange}
          onBack={handlePrevious}
          onNext={handleNext}
          stepNumber={currentStep}
          totalSteps={totalSteps}
        />
      );
    }
    
    // Summary page
    if (currentStep === totalSteps) {
      return (
        <SummaryPreview
          formData={formData}
          eventConfigurations={formData.eventConfigurations}
          onBack={handlePrevious}
          onSubmit={handleSaveAndPublish}
          isLoading={isLoading}
        />
      );
    }
    
    // Default to step 1
    return renderStep1();
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Event Foundation</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter event name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Organizing Body *
          </label>
          <select
            name="organizingBody"
            value={formData.organizingBody}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select organizing body</option>
            <option value="IT">IT</option>
            <option value="IIC">IIC</option>
            <option value="EMDC">EMDC</option>
          </select>
        </div>

        {/* Event Type - Department Type */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🔹 Department Type *
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="departmentType"
                value="inter"
                checked={formData.departmentType === 'inter'}
                onChange={handleInputChange}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="text-sm text-gray-700">🔘 Inter Department</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="departmentType"
                value="intra"
                checked={formData.departmentType === 'intra'}
                onChange={handleInputChange}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="text-sm text-gray-700">🔘 Intra Department</span>
            </label>
          </div>
        </div>

        {/* Event Categories - Only show if department type is selected */}
        {formData.departmentType && (
          <div className="md:col-span-2 space-y-6">
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.eventCategories.technical.length > 0}
                  onChange={(e) => {
                    if (e.target.checked && formData.eventCategories.technical.length === 0) {
                      // Add first default technical event when category is selected
                      setFormData(prev => ({
                        ...prev,
                        eventCategories: {
                          ...prev.eventCategories,
                          technical: ['Paper Presentation']
                        }
                      }));
                    } else if (!e.target.checked) {
                      setFormData(prev => ({
                        ...prev,
                        eventCategories: {
                          ...prev.eventCategories,
                          technical: []
                        }
                      }));
                    }
                  }}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="text-sm font-medium text-gray-900">⬜ Technical</span>
              </label>
              
              {formData.eventCategories.technical.length > 0 && (
                <div className="ml-6">
                  <EventCategory
                    categoryType="technical"
                    departmentType={formData.departmentType}
                    selectedEvents={formData.eventCategories.technical}
                    onEventToggle={(event) => handleEventToggle(event, 'technical')}
                    customEvents={formData.customEvents}
                    onAddCustomEvent={handleAddCustomEvent}
                    onRemoveCustomEvent={handleRemoveCustomEvent}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.eventCategories.nonTechnical.length > 0}
                  onChange={(e) => {
                    if (e.target.checked && formData.eventCategories.nonTechnical.length === 0) {
                      // Add first default non-technical event when category is selected
                      setFormData(prev => ({
                        ...prev,
                        eventCategories: {
                          ...prev.eventCategories,
                          nonTechnical: ['Connections']
                        }
                      }));
                    } else if (!e.target.checked) {
                      setFormData(prev => ({
                        ...prev,
                        eventCategories: {
                          ...prev.eventCategories,
                          nonTechnical: []
                        }
                      }));
                    }
                  }}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="text-sm font-medium text-gray-900">⬜ Non-Technical</span>
              </label>
              
              {formData.eventCategories.nonTechnical.length > 0 && (
                <div className="ml-6">
                  <EventCategory
                    categoryType="nonTechnical"
                    departmentType={formData.departmentType}
                    selectedEvents={formData.eventCategories.nonTechnical}
                    onEventToggle={(event) => handleEventToggle(event, 'nonTechnical')}
                    customEvents={formData.customEvents}
                    onAddCustomEvent={handleAddCustomEvent}
                    onRemoveCustomEvent={handleRemoveCustomEvent}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Platform-specific fields */}
        {registrationType === 'platform' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mode *
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="mode"
                    value="Online"
                    checked={formData.mode === 'Online'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Online</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="mode"
                    value="Offline"
                    checked={formData.mode === 'Offline'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Offline</span>
                </label>
              </div>
            </div>

            {formData.mode === 'Offline' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Venue *
                </label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter venue"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Participants *
              </label>
              <input
                type="number"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleInputChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter maximum participants"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Date *
          </label>
          <input
            type="date"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleInputChange}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Coordinator Name *
          </label>
          <input
            type="text"
            name="eventCoordinator.name"
            value={formData.eventCoordinator.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter coordinator name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Coordinator Contact *
          </label>
          <input
            type="tel"
            name="eventCoordinator.contact"
            value={formData.eventCoordinator.contact}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter 10-digit mobile number"
            maxLength="10"
            pattern="[0-9]{10}"
          />
          <p className="mt-1 text-xs text-gray-500">Enter a valid 10-digit mobile number</p>
        </div>
      </div>

      {/* Additional Event Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900">Event Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Poster Upload */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Poster *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input
                type="file"
                name="posterImage"
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.pdf"
                className="hidden"
                id="posterImage"
              />
              <label htmlFor="posterImage" className="cursor-pointer">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Upload event poster</p>
                <p className="text-xs text-gray-500 mt-1">JPG, PNG, PDF up to 10MB</p>
                {formData.posterImage && (
                  <p className="text-sm text-green-600 mt-2">Selected: {formData.posterImage.name}</p>
                )}
              </label>
            </div>
          </div>

          

          {/* Event Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter detailed description of the event..."
            />
          </div>

          {/* Event Rules */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Rules *
            </label>
            <textarea
              name="rules"
              value={formData.rules}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter rules and guidelines for the event..."
            />
          </div>

          {/* Event Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Link
            </label>
            <input
              type="url"
              name="eventLink"
              value={formData.eventLink}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter event page link"
            />
          </div>
          {/* WhatsApp Group Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              WhatsApp Group Link *
            </label>
            <input
              type="url"
              name="whatsappGroupLink"
              value={formData.whatsappGroupLink}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter WhatsApp group link"
            />
          </div>

          {/* Registration Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Registration Link *
            </label>
            <input
              type="url"
              name="registrationLink"
              value={formData.registrationLink}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter registration link"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Event Info & Usability</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Poster Image
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              name="posterImage"
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
              id="posterImage"
            />
            <label htmlFor="posterImage" className="cursor-pointer">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600">Click to upload poster image</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
              {formData.posterImage && (
                <p className="text-sm text-green-600 mt-2">Selected: {formData.posterImage.name}</p>
              )}
            </label>
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter event description"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rules *
          </label>
          <textarea
            name="rules"
            value={formData.rules}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter event rules"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Link
          </label>
          <input
            type="url"
            name="eventLink"
            value={formData.eventLink}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter event link"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            WhatsApp Group Link
          </label>
          <input
            type="url"
            name="whatsappGroupLink"
            value={formData.whatsappGroupLink}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter WhatsApp group link"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Registration Link *
          </label>
          <input
            type="url"
            name="registrationLink"
            value={formData.registrationLink}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter registration link"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center">
            <button
              onClick={() => {
                clearFormData();
                navigate('/events');
              }}
              className="mr-4 p-2 text-gray-600 hover:text-gray-900"
              title="Clear form data"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
              <p className="text-gray-600 mt-2">
                {registrationType ? 
                  `(${registrationType === 'google' ? 'Google Form' : 'Platform'} Registration)` : 
                  'Fill in the details to create a new event'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Registration Modal */}
        <RegistrationModal
          isOpen={showRegistrationModal}
          onClose={() => navigate('/events')}
          onSelectRegistrationType={handleRegistrationTypeSelect}
        />

        {/* Google Forms Modal */}
        <GoogleFormsModal
          isOpen={showGoogleFormsModal}
          onClose={handleGoogleFormsCancel}
          onSave={handleGoogleFormsSave}
          initialData={{
            googleFormLink: formData.googleFormLink,
            responseLink: formData.responseLink
          }}
        />

        {/* Form Content - Only show after registration type is selected and Google Forms is configured (if applicable) */}
        {!showRegistrationModal && !showGoogleFormsModal && registrationType && (
          <>
            {/* Step Indicator */}
            {renderStepIndicator()}

            {/* Form */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                {renderCurrentStep()}
              </div>

              {/* Actions - Only show for Step 1 */}
              {currentStep === 1 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => {
                        clearFormData();
                        navigate('/events');
                      }}
                      className="mr-4 p-2 text-gray-600 hover:text-gray-900"
                      title="Clear form data"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Draft
                      </button>

                      <button
                        onClick={handleNext}
                        className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Next
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateEvent;
