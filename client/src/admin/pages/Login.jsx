import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { LogIn } from 'lucide-react';
import Orb from '../components/Orb';

const Login = () => {
  const { googleLogin } = useAuth();
  const navigate = useNavigate();

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
            Sign in
          </h2>
          <p className="mt-3 text-center text-sm text-gray-300/80 font-light tracking-wide">
            College Event Management System
          </p>
        </div>

        <div className="mt-8 space-y-6">
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
          
          <p className="text-xs text-center text-gray-400/60 mt-6 font-light">
            By signing in, you agree to access the dashboard if your email is authorized.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
