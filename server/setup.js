const fs = require('fs');
const path = require('path');

// Create necessary directories
const directories = [
  'uploads',
  'uploads/posters',
  'uploads/brochures'
];

directories.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dir}`);
  } else {
    console.log(`Directory already exists: ${dir}`);
  }
});

console.log('Setup completed!');
