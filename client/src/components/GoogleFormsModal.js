import React, { useState } from 'react';

const GoogleFormsModal = ({ isOpen, onClose, onSave, initialData = {} }) => {
  const [formData, setFormData] = useState({
    googleFormLink: initialData.googleFormLink || '',
    responseLink: initialData.responseLink || ''
  });
  const [errors, setErrors] = useState({});

  const validateURL = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const validateGoogleFormsURL = (url) => {
    if (!validateURL(url)) return false;
    return url.includes('forms.google.com') || url.includes('docs.google.com/forms');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.googleFormLink.trim()) {
      newErrors.googleFormLink = 'Google Form link is required';
    } else if (!validateGoogleFormsURL(formData.googleFormLink)) {
      newErrors.googleFormLink = 'Please enter a valid Google Forms URL';
    }

    if (!formData.responseLink.trim()) {
      newErrors.responseLink = 'Response link is required';
    } else if (!validateURL(formData.responseLink)) {
      newErrors.responseLink = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleCancel = () => {
    setFormData({
      googleFormLink: initialData.googleFormLink || '',
      responseLink: initialData.responseLink || ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-lg w-full mx-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Google Forms Registration Setup</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Google Form Link *
            </label>
            <input
              type="url"
              name="googleFormLink"
              value={formData.googleFormLink}
              onChange={handleInputChange}
              placeholder="Enter Google Form URL"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.googleFormLink ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.googleFormLink && (
              <p className="mt-1 text-sm text-red-600">{errors.googleFormLink}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Link to your Google Form for event registration
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Completed Registration Response Link *
            </label>
            <input
              type="url"
              name="responseLink"
              value={formData.responseLink}
              onChange={handleInputChange}
              placeholder="Enter Google Form responses link"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.responseLink ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.responseLink && (
              <p className="mt-1 text-sm text-red-600">{errors.responseLink}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Link to view Google Form responses (for admin tracking)
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={handleCancel}
            className="px-6 py-2 text-gray-600 hover:text-gray-900 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
          >
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoogleFormsModal;
