import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// TESTING MODE - Set to true to bypass authentication redirects
const TESTING_MODE = true;

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !TESTING_MODE) {
      localStorage.removeItem('token');
      localStorage.removeItem('admin');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Auth context
const AuthContext = createContext();

// Initial state
const initialState = {
  admin: null,
  token: localStorage.getItem('token'),
  isLoading: true,
  isAuthenticated: false,
};

// Action types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  LOAD_ADMIN: 'LOAD_ADMIN',
  SET_LOADING: 'SET_LOADING',
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        isLoading: true,
      };
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        admin: action.payload.admin,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        admin: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        admin: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case AUTH_ACTIONS.LOAD_ADMIN:
      return {
        ...state,
        admin: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      };
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

// Auth provider
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load admin from localStorage on mount
  useEffect(() => {
    const loadAdmin = async () => {
      const token = localStorage.getItem('token');
      const adminData = localStorage.getItem('admin');

      if (token && adminData) {
        try {
          const admin = JSON.parse(adminData);
          dispatch({ type: AUTH_ACTIONS.LOAD_ADMIN, payload: admin });
        } catch (error) {
          console.error('Error parsing admin data:', error);
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    loadAdmin();
  }, []);

  // Login function
  const login = async (email, password) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    try {
      const response = await api.post('/auth/login', { email, password });
      const { admin, token } = response.data.data;

      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('admin', JSON.stringify(admin));

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { admin, token },
      });

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE });
      return { success: false, message };
    }
  };

  // Google Login function
  const googleLogin = async (token) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    try {
      const response = await api.post('/auth/google', { token });
      const { admin, token: jwtToken } = response.data.data;

      // Store in localStorage
      localStorage.setItem('token', jwtToken);
      localStorage.setItem('admin', JSON.stringify(admin));

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { admin, token: jwtToken },
      });

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Google Login failed';
      dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE });
      return { success: false, message };
    }
  };

  // Register function
  const register = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    try {
      const response = await api.post('/auth/register', userData);
      const { admin, token } = response.data.data;

      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('admin', JSON.stringify(admin));

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { admin, token },
      });

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE });
      return { success: false, message };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  // Check authentication
  const checkAuth = async () => {
    if (!state.token) return false;

    try {
      const response = await api.get('/auth/me');
      const admin = response.data.data.admin;

      localStorage.setItem('admin', JSON.stringify(admin));
      dispatch({ type: AUTH_ACTIONS.LOAD_ADMIN, payload: admin });

      return true;
    } catch (error) {
      logout();
      return false;
    }
  };

  const value = {
    ...state,
    login,
    register,
    googleLogin,
    logout,
    checkAuth,
    api,
    isTestingMode: TESTING_MODE,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AUTH_ACTIONS };
