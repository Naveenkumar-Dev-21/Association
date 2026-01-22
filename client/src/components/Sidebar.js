import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Menu,
  X,
  Calendar,
  Users,
  Bell,
  Download,
  User,
  LogOut,
  ChevronDown,
  ChevronRight,
  Home
} from 'lucide-react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [eventsExpanded, setEventsExpanded] = useState(false);
  const location = useLocation();
  const { admin, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    {
      title: 'Dashboard',
      icon: Home,
      path: '/dashboard',
    },
    {
      title: 'Event',
      icon: Calendar,
      hasSubmenu: true,
      submenu: [
        { title: 'IIC / EMDC', path: '/events?cellsAndAssociation=IIC' },
        { title: 'IT', path: '/events?cellsAndAssociation=IT' },
      ],
    },
    {
      title: 'Registration',
      icon: Users,
      path: '/registrations',
    },
    {
      title: 'Notification',
      icon: Bell,
      path: '/notifications',
    },
    {
      title: 'Download',
      icon: Download,
      path: '/downloads',
    },
    {
      title: 'Profile',
      icon: User,
      path: '/profile',
    },
  ];

  return (
    <div
      className={`bg-white shadow-lg transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-64'
      } min-h-screen flex flex-col`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-bold text-gray-800">Admin Panel</h2>
              <p className="text-xs text-gray-500">Event Management</p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? (
              <Menu className="h-5 w-5 text-gray-600" />
            ) : (
              <X className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.title}>
              {item.hasSubmenu ? (
                <div>
                  <button
                    onClick={() => setEventsExpanded(!eventsExpanded)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors ${
                      isActive(item.path) || location.pathname.startsWith('/events')
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon className="h-5 w-5" />
                      {!isCollapsed && (
                        <span className="ml-3 text-sm font-medium">{item.title}</span>
                      )}
                    </div>
                    {!isCollapsed && (
                      eventsExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )
                    )}
                  </button>
                  {!isCollapsed && eventsExpanded && (
                    <ul className="ml-8 mt-2 space-y-1">
                      {item.submenu.map((subItem) => (
                        <li key={subItem.title}>
                          <Link
                            to={subItem.path}
                            className={`block p-2 text-sm rounded-lg transition-colors ${
                              isActive(subItem.path)
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            {subItem.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  to={item.path}
                  className={`flex items-center p-2 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {!isCollapsed && (
                    <span className="ml-3 text-sm font-medium">{item.title}</span>
                  )}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-gray-200">
        {!isCollapsed && admin && (
          <div className="mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">{admin.name}</p>
                <p className="text-xs text-gray-500">{admin.cellsAndAssociation}</p>
              </div>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className={`w-full flex items-center p-2 rounded-lg transition-colors text-red-600 hover:bg-red-50`}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && (
            <span className="ml-3 text-sm font-medium">Logout</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
