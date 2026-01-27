import React, { useState, useEffect } from 'react';
import { X, Upload, Calendar, Loader2, Image } from 'lucide-react';

/**
 * EditOuterCollegeModal - Simplified edit modal for outer college events
 * Only allows editing poster and registration end date
 */
const EditOuterCollegeModal = ({ isOpen, onClose, event, onSave, api }) => {
  const [posterImage, setPosterImage] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);
  const [registrationEndDate, setRegistrationEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (event) {
      // Set existing poster preview
      if (event.posterImage) {
        setPosterPreview(`http://localhost:5000${event.posterImage}`);
      }
      // Set existing registration end date
      if (event.registrationEndDate) {
        setRegistrationEndDate(new Date(event.registrationEndDate).toISOString().split('T')[0]);
      }
    }
  }, [event]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      setPosterImage(file);
      setError('');
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPosterPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!registrationEndDate) {
      setError('Please select a registration end date');
      return;
    }
    
    setIsLoading(true);
    try {
      const formData = new FormData();
      
      // Add poster if changed
      if (posterImage) {
        formData.append('posterImage', posterImage);
      }
      
      // Add registration end date
      formData.append('registrationEndDate', new Date(registrationEndDate).toISOString());
      
      await api.put(`/events/${event._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      onSave();
      handleClose();
    } catch (error) {
      console.error('Error updating outer college event:', error);
      setError('Failed to update event. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPosterImage(null);
    setPosterPreview(null);
    setRegistrationEndDate('');
    setError('');
    onClose();
  };

  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h3 className="text-lg font-semibold text-white">Edit Outer College Event</h3>
            <p className="text-sm text-gray-400 mt-1">Update poster or registration end date</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Current/New Poster */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              <Image className="inline-block w-4 h-4 mr-2" />
              Event Poster
            </label>
            
            {posterPreview ? (
              <div className="relative">
                <img 
                  src={posterPreview} 
                  alt="Event poster" 
                  className="w-full h-48 object-contain rounded-lg border border-gray-700 bg-gray-800"
                />
                <label className="absolute bottom-2 right-2 flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
                  <Upload className="w-4 h-4 mr-1.5" />
                  Change
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">Click to upload poster</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Registration End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Calendar className="inline-block w-4 h-4 mr-2" />
              Registration End Date *
            </label>
            <input
              type="date"
              value={registrationEndDate}
              onChange={(e) => setRegistrationEndDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Event will be marked as "Completed" after this date
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-sm text-red-400 text-center">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-700">
          <button
            onClick={handleClose}
            className="px-4 py-2.5 text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex items-center px-4 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditOuterCollegeModal;
