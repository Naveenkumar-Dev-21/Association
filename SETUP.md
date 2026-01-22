# College Event Management System - Setup Instructions

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Git

### Installation Steps

1. **Clone/Download the Project**
   ```bash
   # If using git
   git clone <repository-url>
   cd "College Project IIC"
   ```

2. **Install Dependencies**
   ```bash
   # Install all dependencies for root, client, and server
   npm run install-deps
   ```

3. **Environment Setup**
   ```bash
   # Copy environment file for server
   cd server
   copy .env.example .env
   
   # Edit .env file with your configuration:
   # - MONGODB_URI: Your MongoDB connection string
   # - JWT_SECRET: A secure secret key
   # - PORT: Server port (default: 5000)
   ```

4. **Create Upload Directories**
   ```bash
   cd server
   node setup.js
   ```

5. **Start the Application**
   ```bash
   # From root directory
   npm run dev
   ```

   This will start both frontend (http://localhost:3000) and backend (http://localhost:5000) simultaneously.

## 📁 Project Structure

```
College Project IIC/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable Components
│   │   ├── pages/         # Page Components
│   │   ├── context/       # React Context
│   │   └── styles/        # Global Styles
│   └── package.json
├── server/                # Node.js Backend
│   ├── controllers/       # Route Controllers
│   ├── models/           # Database Models
│   ├── routes/           # API Routes
│   ├── middleware/       # Custom Middleware
│   ├── uploads/          # File Upload Directory
│   └── package.json
└── package.json          # Root Package.json
```

## 🔧 Configuration

### Backend Environment Variables (.env)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/college-events

# JWT Secret (change this in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Client URL
CLIENT_URL=http://localhost:3000

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

### Frontend Configuration

The frontend is configured to proxy API requests to the backend automatically. No additional configuration needed.

## 🗄️ Database Setup

### MongoDB Local Setup

1. **Install MongoDB**
   - Windows: Download from [MongoDB官网](https://www.mongodb.com/try/download/community)
   - Mac: `brew install mongodb-community`
   - Linux: Follow official MongoDB documentation

2. **Start MongoDB Service**
   ```bash
   # Windows
   net start MongoDB
   
   # Mac/Linux
   sudo systemctl start mongod
   ```

3. **Create Database**
   The application will automatically create the `college-events` database on first run.

### MongoDB Cloud Setup (Atlas)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in server/.env

## 🚦 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
# Build frontend
cd client && npm run build

# Start server
cd ../server && npm start
```

## 📱 Features Overview

### Admin Authentication
- ✅ Admin Registration & Login
- ✅ Secure JWT Authentication
- ✅ Password Management

### Event Management
- ✅ Create Events (Multi-step form)
- ✅ View/Edit Events
- ✅ Filter by Department (IT/IIC/EMDC)
- ✅ Event Status Tracking
- ✅ File Upload (Posters & Brochures)

### Registration Management
- ✅ View Student Registrations
- ✅ Add Manual Registrations
- ✅ Update Registration Status
- ✅ Export Registration Data (CSV)

### Notification System
- ✅ Create Notifications
- ✅ Schedule Notifications
- ✅ Target Specific Departments
- ✅ Notification History

### Reports & Downloads
- ✅ Event Reports (CSV/JSON)
- ✅ Registration Data Export
- ✅ Summary Reports
- ✅ Department-wise Analytics

### Profile Management
- ✅ Edit Profile Information
- ✅ Change Password
- ✅ View Activity History

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- File upload validation
- CORS protection
- Helmet.js security headers

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check MONGODB_URI in .env file
   - Verify network connectivity

2. **Port Already in Use**
   - Change PORT in server/.env
   - Kill existing process: `taskkill /PID <process_id> /F` (Windows)

3. **File Upload Issues**
   - Ensure upload directories exist
   - Check file size limits
   - Verify file permissions

4. **Frontend Build Issues**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility

### Getting Help

1. Check browser console for frontend errors
2. Check server terminal for backend errors
3. Verify all environment variables are set
4. Ensure MongoDB is accessible

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Admin registration
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current admin

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Registrations
- `GET /api/registrations` - Get all registrations
- `POST /api/registrations` - Add registration
- `PUT /api/registrations/:id` - Update registration
- `DELETE /api/registrations/:id` - Delete registration

### Notifications
- `GET /api/notifications` - Get notifications
- `POST /api/notifications` - Create notification
- `POST /api/notifications/:id/send` - Send notification

### Downloads
- `GET /api/downloads/registrations/:eventId` - Export registrations
- `GET /api/downloads/events` - Export events
- `GET /api/downloads/summary` - Get summary data

## 🎨 Customization

### Theming
- Edit `tailwind.config.js` for color schemes
- Modify `client/src/index.css` for custom styles

### Adding New Features
1. Create new routes in `server/routes/`
2. Add corresponding models in `server/models/`
3. Create frontend components in `client/src/components/`
4. Add pages in `client/src/pages/`

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

**Happy Coding! 🎉**
