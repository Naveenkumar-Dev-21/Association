import React, { useState } from 'react';
import { X, User, Phone, Building, GraduationCap, Mail, Users, UserPlus, Trash2 } from 'lucide-react';

const ParticipationModal = ({ isOpen, onClose, onSubmit, eventName, isLoading }) => {
  const [participationType, setParticipationType] = useState(''); // 'solo' or 'team'
  const [formData, setFormData] = useState({
    participantName: '',
    rollNumber: '',
    department: '',
    yearOfStudy: '',
    contactNumber: '',
    email: '',
    modeOfParticipation: 'Offline'
  });
  const [teamMembers, setTeamMembers] = useState([]);
  const [errors, setErrors] = useState({});

  const emptyTeamMember = {
    name: '',
    rollNumber: '',
    department: '',
    yearOfStudy: '',
    contactNumber: ''
  };

  const validateContact = (contact) => {
    const digitsOnly = contact.replace(/\D/g, '');
    return digitsOnly.length === 10;
  };

  const validateEmail = (email) => {
    if (!email) return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.participantName.trim()) {
      newErrors.participantName = 'Name is required';
    }
    if (!formData.rollNumber.trim()) {
      newErrors.rollNumber = 'Roll number is required';
    }
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!validateContact(formData.contactNumber)) {
      newErrors.contactNumber = 'Enter valid 10-digit number';
    }
    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Enter a valid email';
    }

    // Validate team members
    if (participationType === 'team') {
      teamMembers.forEach((member, index) => {
        if (!member.name.trim()) {
          newErrors[`teamMember_${index}_name`] = 'Name required';
        }
        if (!member.rollNumber.trim()) {
          newErrors[`teamMember_${index}_rollNumber`] = 'Roll number required';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'contactNumber') {
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length > 10) return;
      setFormData(prev => ({ ...prev, [name]: digitsOnly }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleTeamMemberChange = (index, field, value) => {
    const updatedMembers = [...teamMembers];
    if (field === 'contactNumber') {
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length > 10) return;
      updatedMembers[index][field] = digitsOnly;
    } else {
      updatedMembers[index][field] = value;
    }
    setTeamMembers(updatedMembers);
    
    // Clear error
    const errorKey = `teamMember_${index}_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const addTeamMember = () => {
    if (teamMembers.length < 5) {
      setTeamMembers([...teamMembers, { ...emptyTeamMember }]);
    }
  };

  const removeTeamMember = (index) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const submitData = {
        ...formData,
        participationType,
        teamMembers: participationType === 'team' ? teamMembers : []
      };
      onSubmit(submitData);
    }
  };

  const handleCancel = () => {
    setFormData({
      participantName: '',
      rollNumber: '',
      department: '',
      yearOfStudy: '',
      contactNumber: '',
      email: '',
      modeOfParticipation: 'Offline'
    });
    setTeamMembers([]);
    setParticipationType('');
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  // Step 1: Choose Solo or Team
  if (!participationType) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Participation Type</h2>
              <p className="text-sm text-gray-500 mt-1">{eventName}</p>
            </div>
            <button onClick={handleCancel} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <p className="text-gray-600 mb-6">Are you participating solo or as a team?</p>

          <div className="space-y-3">
            <button
              onClick={() => setParticipationType('solo')}
              className="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <User className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Solo</p>
                  <p className="text-sm text-gray-500">Individual participation</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                setParticipationType('team');
                setTeamMembers([{ ...emptyTeamMember }]);
              }}
              className="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Team</p>
                  <p className="text-sm text-gray-500">Participate with teammates</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Fill in details
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {participationType === 'solo' ? 'Solo Registration' : 'Team Registration'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">{eventName}</p>
          </div>
          <button onClick={handleCancel} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Team Leader / Solo Participant Section */}
          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="font-semibold text-purple-800 mb-3">
              {participationType === 'team' ? '👤 Team Leader' : '👤 Your Details'}
            </h3>
            
            {/* Name */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="participantName"
                  value={formData.participantName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.participantName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.participantName && <p className="mt-1 text-xs text-red-600">{errors.participantName}</p>}
            </div>

            {/* Roll & Department */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number *</label>
                <input
                  type="text"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleInputChange}
                  placeholder="e.g., 21IT001"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.rollNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.rollNumber && <p className="mt-1 text-xs text-red-600">{errors.rollNumber}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  placeholder="e.g., IT"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Contact & Year */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact *</label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  placeholder="10-digit"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.contactNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.contactNumber && <p className="mt-1 text-xs text-red-600">{errors.contactNumber}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <select
                  name="yearOfStudy"
                  value={formData.yearOfStudy}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Team Members Section */}
          {participationType === 'team' && (
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-blue-800">👥 Team Members</h3>
                {teamMembers.length < 5 && (
                  <button
                    type="button"
                    onClick={addTeamMember}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    <UserPlus className="w-4 h-4 mr-1" /> Add Member
                  </button>
                )}
              </div>

              {teamMembers.map((member, index) => (
                <div key={index} className="bg-white rounded-lg p-3 mb-3 border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Member {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeTeamMember(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <input
                        type="text"
                        placeholder="Name *"
                        value={member.name}
                        onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors[`teamMember_${index}_name`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Roll No *"
                        value={member.rollNumber}
                        onChange={(e) => handleTeamMemberChange(index, 'rollNumber', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors[`teamMember_${index}_rollNumber`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Department"
                      value={member.department}
                      onChange={(e) => handleTeamMemberChange(index, 'department', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      value={member.yearOfStudy}
                      onChange={(e) => handleTeamMemberChange(index, 'yearOfStudy', e.target.value)}
                      className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Year</option>
                      <option value="1">1st</option>
                      <option value="2">2nd</option>
                      <option value="3">3rd</option>
                      <option value="4">4th</option>
                    </select>
                    <input
                      type="tel"
                      placeholder="Contact"
                      value={member.contactNumber}
                      onChange={(e) => handleTeamMemberChange(index, 'contactNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ))}

              <p className="text-xs text-blue-600">You can add up to 5 team members</p>
            </div>
          )}

          {/* Mode of Participation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mode of Participation</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="modeOfParticipation"
                  value="Offline"
                  checked={formData.modeOfParticipation === 'Offline'}
                  onChange={handleInputChange}
                  className="mr-2 h-4 w-4 text-purple-600"
                />
                <span className="text-sm text-gray-700">Offline</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="modeOfParticipation"
                  value="Online"
                  checked={formData.modeOfParticipation === 'Online'}
                  onChange={handleInputChange}
                  className="mr-2 h-4 w-4 text-purple-600"
                />
                <span className="text-sm text-gray-700">Online</span>
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <button
              type="button"
              onClick={() => setParticipationType('')}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              ← Back
            </button>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Submitting...' : 'Submit Registration'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ParticipationModal;
