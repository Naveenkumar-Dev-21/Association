import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { LogIn } from 'lucide-react';
import Orb from '../components/Orb';

const Login = () => {
  const { googleLogin, login } = useAuth();
  const navigate = useNavigate();
  const [showFallback, setShowFallback] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSuccess = async (credentialResponse) => {
    const result = await googleLogin(credentialResponse.credential);
    if (result.success) {
      toast.success('Login successful!');
      navigate('/admin/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  const handleError = () => {
    toast.error('Google Login Failed');
  };

  const handleFallbackLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        toast.success('Login successful!');
        navigate('/admin/dashboard');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('An error occurred during login');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-black">
      {/* Orb Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Orb
          hoverIntensity={0.5}
          rotateOnHover={true}
          hue={0}
          forceHoverState={false}
          backgroundColor="#000000"
        />
      </div>

      <div className="max-w-md w-full space-y-8 bg-gray-900/40 backdrop-blur-xl p-8 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/10 relative z-10 transition-all duration-300 hover:shadow-[0_8px_32px_0_rgba(100,100,255,0.2)]">
        <div>
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-500/20 border border-white/5 transition-transform hover:scale-105 duration-300 shadow-inner">
            <LogIn className="h-8 w-8 text-blue-300 drop-shadow-[0_0_8px_rgba(147,197,253,0.5)]" />
          </div>
          <h2 className="mt-6 text-center text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-purple-200 font-sans drop-shadow-sm">
            {showFallback ? 'Admin Login' : 'Sign in'}
          </h2>
          <p className="mt-3 text-center text-sm text-gray-300/80 font-light tracking-wide">
            College Event Management System
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {!showFallback ? (
            <>
              <div className="flex justify-center mt-6 transform transition-transform hover:scale-105 duration-200">
                <GoogleLogin
                  onSuccess={handleSuccess}
                  onError={handleError}
                  useOneTap
                  theme="filled_black"
                  shape="pill"
                  text="continue_with"
                />
              </div>

              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink mx-4 text-gray-500 text-xs uppercase tracking-widest font-medium">Or</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              <button
                onClick={() => setShowFallback(true)}
                className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                Continue with Email
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </>
          ) : (
            <form onSubmit={handleFallbackLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all"
                  placeholder="admin@kongu.edu"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase tracking-wider">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-900/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </button>
              <button
                type="button"
                onClick={() => setShowFallback(false)}
                className="w-full text-center text-sm text-gray-400 hover:text-white transition-colors py-2"
              >
                Back to Google Sign-in
              </button>
            </form>
          )}

          <p className="text-xs text-center text-gray-400/60 mt-6 font-light">
            By signing in, you agree to access the dashboard if your email is authorized.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
