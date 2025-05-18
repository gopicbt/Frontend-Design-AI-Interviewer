import React from 'react';
import { 
  Users, Clock, Building2, FileText, AlertTriangle, CheckCircle
} from 'lucide-react';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { mockCandidates, mockInterviews, mockDepartments, mockTimeMetrics } from '../data/mockData';

const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  
  const isAdmin = currentUser?.role === UserRole.SUPER_ADMIN || currentUser?.role === UserRole.ADMIN;

  // Calculate statistics
  const totalInterviews = mockInterviews.length;
  const totalCandidates = mockCandidates.length;
  const totalDepartments = mockDepartments.length;
  const flaggedCandidates = mockCandidates.filter(c => c.fraudScore > 30).length;
  const recommendedCandidates = mockCandidates.filter(c => c.recommended).length;
  const totalHoursSaved = mockTimeMetrics.reduce((sum, metric) => sum + metric.hoursSaved, 0);

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {currentUser?.name}
          </p>
        </div>
        
        {isAdmin && (
          <div className="mt-4 md:mt-0">
            <Button 
              variant="primary"
              icon={<FileText size={16} />}
              onClick={() => window.location.href = '/interviews/new'}
            >
              Create New Interview
            </Button>
          </div>
        )}
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="flex items-center py-6">
            <div className="p-3 rounded-full bg-primary-50 mr-4">
              <FileText size={24} className="text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Interviews</p>
              <p className="text-2xl font-bold text-gray-900">{totalInterviews}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center py-6">
            <div className="p-3 rounded-full bg-secondary-50 mr-4">
              <Users size={24} className="text-secondary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Candidates</p>
              <p className="text-2xl font-bold text-gray-900">{totalCandidates}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center py-6">
            <div className="p-3 rounded-full bg-accent-50 mr-4">
              <Clock size={24} className="text-accent-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Hours Saved</p>
              <p className="text-2xl font-bold text-gray-900">{totalHoursSaved}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Additional stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between px-2 py-3 border-b border-gray-100">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-green-50 mr-3">
                  <CheckCircle size={16} className="text-green-600" />
                </div>
                <span className="text-sm text-gray-700">New candidate completed frontend developer interview</span>
              </div>
              <span className="text-xs text-gray-500">2h ago</span>
            </div>
            
            <div className="flex items-center justify-between px-2 py-3 border-b border-gray-100">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-primary-50 mr-3">
                  <FileText size={16} className="text-primary-600" />
                </div>
                <span className="text-sm text-gray-700">New data scientist interview created</span>
              </div>
              <span className="text-xs text-gray-500">5h ago</span>
            </div>
            
            <div className="flex items-center justify-between px-2 py-3 border-b border-gray-100">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-amber-50 mr-3">
                  <AlertTriangle size={16} className="text-amber-600" />
                </div>
                <span className="text-sm text-gray-700">Flagged candidate with high fraud score</span>
              </div>
              <span className="text-xs text-gray-500">1d ago</span>
            </div>
            
            <div className="flex items-center justify-between px-2 py-3">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-secondary-50 mr-3">
                  <Building2 size={16} className="text-secondary-600" />
                </div>
                <span className="text-sm text-gray-700">New department added: Product Management</span>
              </div>
              <span className="text-xs text-gray-500">2d ago</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Interview Status</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500">Flagged Candidates</span>
                  <div className="p-1.5 rounded-full bg-red-50">
                    <AlertTriangle size={14} className="text-red-600" />
                  </div>
                </div>
                <p className="text-xl font-bold text-gray-900">{flaggedCandidates}</p>
                <div className="mt-1 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500 rounded-full" 
                    style={{ width: `${(flaggedCandidates / totalCandidates) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500">Recommended</span>
                  <div className="p-1.5 rounded-full bg-green-50">
                    <CheckCircle size={14} className="text-green-600" />
                  </div>
                </div>
                <p className="text-xl font-bold text-gray-900">{recommendedCandidates}</p>
                <div className="mt-1 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full" 
                    style={{ width: `${(recommendedCandidates / totalCandidates) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500">Departments</span>
                  <div className="p-1.5 rounded-full bg-secondary-50">
                    <Building2 size={14} className="text-secondary-600" />
                  </div>
                </div>
                <p className="text-xl font-bold text-gray-900">{totalDepartments}</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500">Avg. Score</span>
                  <div className="p-1.5 rounded-full bg-primary-50">
                    <FileText size={14} className="text-primary-600" />
                  </div>
                </div>
                <p className="text-xl font-bold text-gray-900">79%</p>
                <div className="mt-1 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-500 rounded-full" 
                    style={{ width: `79%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Interviews */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Interviews</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {mockInterviews.slice(0, 3).map((interview) => (
            <Card key={interview.id} interactive onClick={() => window.location.href = `/interviews/${interview.id}`}>
              <div className="h-36 bg-gray-200 relative overflow-hidden">
                {interview.imageUrl && (
                  <img 
                    src={interview.imageUrl} 
                    alt={interview.name}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-800">
                    {interview.type === 'llm_based' ? 'LLM Based' : 'Manual'}
                  </div>
                </div>
              </div>
              <CardContent>
                <h3 className="font-semibold text-lg mb-1 line-clamp-1">{interview.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                  {interview.jobDescription}
                </p>
                <div className="text-xs text-gray-500">
                  Created {new Date(interview.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;