# College Event Management System - Admin Panel

A comprehensive admin panel for managing college club events, notifications, and registrations.

## Features

- 🔐 Secure Admin Authentication
- 📊 Admin Dashboard with Analytics
- 📅 Event Management (IT/IIC/EMDC)
- 📝 Multi-step Event Creation
- 🔔 Notification System
- 📋 Registration Management
- 📥 Download Reports
- 👤 Profile Management
- 📱 Responsive Design

## Tech Stack

- **Frontend**: React 18, TailwindCSS, shadcn/ui, Lucide Icons
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **File Upload**: Multer
- **State Management**: React Context

## Project Structure

```
College Project IIC/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable Components
│   │   ├── pages/         # Page Components
│   │   ├── context/       # React Context
│   │   ├── utils/         # Utility Functions
│   │   └── styles/        # Global Styles
│   ├── public/
│   └── package.json
├── server/                # Node.js Backend
│   ├── controllers/       # Route Controllers
│   ├── models/           # Database Models
│   ├── routes/           # API Routes
│   ├── middleware/       # Custom Middleware
│   ├── utils/           # Server Utilities
│   └── package.json
└── package.json          # Root Package.json
```

## Installation

1. Clone the repository
2. Run `npm run install-deps` to install all dependencies
3. Start development servers with `npm run dev`

## Development

- Frontend runs on http://localhost:3000
- Backend runs on http://localhost:5000

## Usage

1. Register as an admin
2. Login to access the dashboard
3. Create and manage events
4. Send notifications to students
5. View registration reports
