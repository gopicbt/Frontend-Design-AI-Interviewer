import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Clock, Shield, LineChart } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { currentUser, login } = useAuth();

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      if (!success) {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Failed to log in');
    } finally {
      setIsLoading(false);
    }
  };
  
  const prefilledLogins = [
    { role: 'HR Super Admin', email: 'admin@example.com', password: 'password' },
    { role: 'HR Admin', email: 'hradmin@example.com', password: 'password' },
    { role: 'Hiring Manager', email: 'manager@example.com', password: 'password' },
    { role: 'Candidate', email: 'candidate@example.com', password: 'password' },
  ];

  const handlePrefilledLogin = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-8">
        {/* Left column: Login form */}
        <div className="bg-white p-8 rounded-lg shadow-md animate-fade-in">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-primary-600 mb-2">InterviewPro</h1>
            <p className="text-gray-600">Intelligent Interview Management</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
            
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            
            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
            >
              Log In
            </Button>
          </form>
          
          <div className="mt-8">
            <p className="text-sm text-gray-500 mb-3">Quick access for demo purposes:</p>
            <div className="space-y-2">
              {prefilledLogins.map((login) => (
                <button
                  key={login.role}
                  onClick={() => handlePrefilledLogin(login.email, login.password)}
                  className="block w-full text-left px-4 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <span className="font-medium">{login.role}</span>
                  <span className="text-gray-500 ml-2">{login.email}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right column: Features */}
        <div className="hidden md:flex md:flex-col justify-center animate-slide-in">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Simplify Your Hiring Process
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-primary-50 p-3 rounded-full mr-4">
                <Clock size={24} className="text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">Save Time</h3>
                <p className="text-gray-600">
                  Reduce interview hours by up to 70% with AI-powered candidate screening and fraud detection.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-secondary-50 p-3 rounded-full mr-4">
                <Shield size={24} className="text-secondary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">Identify Fraudulent Candidates</h3>
                <p className="text-gray-600">
                  Advanced verification systems help identify discrepancies in skills, location, and credentials.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-accent-50 p-3 rounded-full mr-4">
                <LineChart size={24} className="text-accent-500" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">Data-Driven Hiring</h3>
                <p className="text-gray-600">
                  Make better decisions with comprehensive analytics and candidate performance metrics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;