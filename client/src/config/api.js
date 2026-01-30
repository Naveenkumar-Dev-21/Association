// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const API_URL = API_BASE_URL;

// Helper function to get image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  // If imagePath already includes full URL, return as is
  if (imagePath.startsWith('http')) return imagePath;
  // Otherwise, prepend the API base URL
  return `${API_BASE_URL}${imagePath}`;
};
