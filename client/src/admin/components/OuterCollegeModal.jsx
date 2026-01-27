import React, { useState } from 'react';
import { X, Upload, Image, Calendar } from 'lucide-react';

const OuterCollegeModal = ({ isOpen, onClose, onSave }) => {
  const [posterImage, setPosterImage] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);
  const [registrationEndDate, setRegistrationEndDate] = useState('');
  const [error, setError] = useState('');

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

  const handleSubmit = () => {
    if (!posterImage) {
      setError('Please upload an event poster');
      return;
    }
    
    if (!registrationEndDate) {
      setError('Please select a registration end date');
      return;
    }
    
    onSave({
      posterImage: posterImage,
      registrationEndDate: registrationEndDate
    });
  };

  const handleCancel = () => {
    setPosterImage(null);
    setPosterPreview(null);
    setRegistrationEndDate('');
    setError('');
    onClose();
  };

  const handleRemovePoster = () => {
    setPosterImage(null);
    setPosterPreview(null);
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Outer College Event</h2>
            <p className="text-sm text-gray-500 mt-1">Upload poster and set registration end date</p>
          </div>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Poster Upload */}
          {!posterPreview ? (
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 hover:bg-purple-50 transition-all">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-purple-600" />
                </div>
                <p className="text-lg font-medium text-gray-700 mb-1">Upload Event Poster</p>
                <p className="text-sm text-gray-500">Click to browse or drag and drop</p>
                <p className="text-xs text-gray-400 mt-2">PNG, JPG, JPEG (max 5MB)</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          ) : (
            <div className="relative">
              <img 
                src={posterPreview} 
                alt="Event poster preview" 
                className="w-full h-64 object-contain rounded-xl border border-gray-200 bg-gray-50"
              />
              <button
                onClick={handleRemovePoster}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                <Image className="w-3 h-3 mr-1" />
                Poster ready
              </div>
            </div>
          )}

          {/* Registration End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline-block w-4 h-4 mr-2" />
              Registration End Date *
            </label>
            <input
              type="date"
              value={registrationEndDate}
              onChange={(e) => setRegistrationEndDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Event will be marked as "Completed" after this date
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button
              onClick={handleCancel}
              className="px-6 py-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!posterImage || !registrationEndDate}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OuterCollegeModal;
