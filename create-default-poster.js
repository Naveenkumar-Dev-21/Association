// Create a simple SVG default poster
const fs = require('fs');
const path = require('path');

// Create a simple SVG poster as default
const defaultPosterSVG = `
<svg width="400" height="600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8B5CF6;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="400" height="600" fill="url(#bg)"/>
  <text x="200" y="280" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="white" text-anchor="middle">EVENT</text>
  <text x="200" y="320" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle">Poster Coming Soon</text>
  <circle cx="200" cy="180" r="40" fill="white" opacity="0.2"/>
  <text x="200" y="195" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="white" text-anchor="middle">📅</text>
</svg>
`;

// Create the default poster file
const uploadsDir = path.join(__dirname, 'server', 'uploads', 'posters');
const defaultPosterPath = path.join(uploadsDir, 'default-poster.svg');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Write the default poster
fs.writeFileSync(defaultPosterPath, defaultPosterSVG);
console.log('✅ Default poster created at:', defaultPosterPath);
