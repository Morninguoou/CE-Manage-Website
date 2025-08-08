import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: 'example@gmail.com',
    password: '1234567'
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = () => {
    console.log('Login attempt:', formData);
    navigate('/subjectslist');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Background with circuit pattern */}
      <div className="flex-1 relative bg-gradient-to-b from-[#498EFF] to-[#8ECAE6] overflow-hidden">
        {/* Background pattern overlay */}
        <div className="absolute inset-0 opacity-30">
          <img 
            src="/src/assets/images/mainPageBG.png" 
            alt="Background Pattern" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Logo section */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          {/* CE Logo */}
          <div className="min-w-32 h-32 mx-auto mb-4">
            <img 
              src="/src/assets/images/ce_icon.png" 
              alt="CE Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-white text-2xl font-bold">CE Admin Center</h2>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 bg-[#FAF9F6] flex items-center justify-center p-8">
        <div className="w-full max-w-xl">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-semibold text-[#0053BA] mb-2">Welcome to Admin Website</h1>
            <p className="text-[#0053BA] mb-8">Login to your account</p>
            
            <div className="space-y-6">
              {/* Username field */}
              <div>
                <label className="block text-sm font-medium text-[#498EFF] mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-[#FFC554]" />
                  </div>
                  <input
                    type="email"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="example@gmail.com"
                  />
                </div>
              </div>

              {/* Password field */}
              <div>
                <label className="block text-sm font-medium text-[#498EFF] mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-[#FFC554]" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1234567"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Login button */}
              <button
                onClick={handleLogin}
                className="w-full bg-[#FFC554] hover:bg-[#ffb554] text-white font-semibold py-3 px-4 rounded-2xl transition duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Login
              </button>
            </div>
            
            {/* <div className="mt-6 text-center">
              <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                Forgot your password?
              </a>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}