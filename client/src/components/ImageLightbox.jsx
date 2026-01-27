import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * ImageLightbox - A modal component for viewing images in full size
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the lightbox is open
 * @param {Function} props.onClose - Callback to close the lightbox
 * @param {string} props.imageSrc - Source URL of the image
 * @param {string} props.imageAlt - Alt text for the image
 */
const ImageLightbox = ({ isOpen, onClose, imageSrc, imageAlt = 'Image' }) => {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
        aria-label="Close lightbox"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Image container */}
      <div
        className="relative max-w-[90vw] max-h-[90vh] p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageSrc}
          alt={imageAlt}
          className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
        />
        {imageAlt && imageAlt !== 'Image' && (
          <p className="text-center text-white mt-3 text-sm opacity-80">
            {imageAlt}
          </p>
        )}
      </div>
    </div>
  );
};

export default ImageLightbox;
