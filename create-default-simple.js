const fs = require('fs');
const path = require('path');

const defaultPosterPath = path.join(__dirname, 'server', 'uploads', 'posters', 'default-poster.svg');

// Simple SVG content
const svgContent = `<svg width="400" height="600" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="600" fill="#3B82F6"/>
  <text x="200" y="300" font-family="Arial" font-size="32" fill="white" text-anchor="middle">EVENT POSTER</text>
</svg>`;

try {
  fs.writeFileSync(defaultPosterPath, svgContent);
  console.log('Default poster created successfully');
} catch (error) {
  console.error('Error creating default poster:', error);
}
